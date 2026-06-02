# Orchestrates DB → embed → search → format response

from __future__ import annotations
from typing import Optional
from sqlalchemy.orm import Session
from db.queries import get_user_by_id, get_user_registered_activities
from embeddings.encoder import encode
from vdb.searcher import search_similar_activities
from cache.request_cache import get_cached, set_cached
from schemas.recommendation import FeedRequest, FeedResponse, ActivityCard
from config import settings


def _build_user_profile_text(
    interests: Optional[str],
    commune: Optional[str],
    past_activities: list,
) -> tuple[str, str]:
    """
    Build a natural language text from the user's known data.
    Returns (query_text, human_readable_summary).

    The query_text is what gets encoded into a vector.
    The summary tells the caller what was used (for transparency).
    """
    parts = []
    summary_parts = []

    if interests:
        parts.append(f"interests: {interests}")
        summary_parts.append(f"interests ({interests})")

    if commune:
        parts.append(f"commune: {commune}")
        summary_parts.append(f"commune ({commune})")

    if past_activities:
        past_titles = ", ".join(a.title for a in past_activities[:5])  # cap at 5
        parts.append(f"past activities: {past_titles}")
        summary_parts.append(f"{len(past_activities)} past registration(s)")

    query_text = " | ".join(parts) if parts else "youth activity Algeria"
    summary = "Profile built from: " + ", ".join(summary_parts) if summary_parts else "No profile data — showing general activities."

    return query_text, summary


def get_feed(req: FeedRequest, session: Session) -> FeedResponse:
    """
    Build a personalized activity feed for a youth user.

    Steps:
    1. Check cache — return instantly if same user was recently fetched.
    2. Load user profile (commune + interests).
    3. Load user's registration history (past attended/registered activities).
    4. Build a taste profile text from that data.
    5. Encode profile text → vector.
    6. Cosine search Qdrant for most similar published activities.
    7. Exclude activities the user already registered for.
    8. Cache and return.
    """
    cache_key = {"feed": req.user_id}

    # Step 1 — cache check
    cached = get_cached(cache_key)
    if cached is not None:
        return FeedResponse(
            user_id=req.user_id,
            items=cached["items"],
            cached=True,
            profile_summary=cached["profile_summary"],
        )

    # Step 2 — load user
    user = get_user_by_id(session, req.user_id)
    commune = user.commune if user else None
    interests = user.interests if user else None

    # Step 3 — load history
    past_activities = get_user_registered_activities(session, req.user_id)
    past_ids = {a.id for a in past_activities}

    # Step 4 & 5 — build profile and encode
    query_text, summary = _build_user_profile_text(interests, commune, past_activities)
    query_vector = encode(query_text)

    # Step 6 — search (fetch extra to allow for filtering)
    hits = search_similar_activities(
        query_vector=query_vector,
        top_k=settings.recommendation_top_k + len(past_ids),
    )

    # Step 7 — exclude already-registered activities
    items = [
        ActivityCard(
            id=hit["id"],
            title=hit["title"],
            category=hit.get("category"),
            commune=hit.get("commune"),
            activity_mode=hit.get("activity_mode"),
            is_free=hit.get("is_free"),
            score=hit["score"],
        )
        for hit in hits
        if hit["id"] not in past_ids
    ][:settings.recommendation_top_k]

    # Step 8 — cache
    set_cached(cache_key, {"items": items, "profile_summary": summary})

    return FeedResponse(user_id=req.user_id, items=items, cached=False, profile_summary=summary)


# ---------------------------------------------------------------------------
# TEST — run: python -m services.recommendation_service
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    from db.database import SessionLocal, engine
    from db.models import Base, Activity, Category, User, Registration
    from vdb.indexer import index_activities
    from sqlalchemy import text
    from datetime import datetime, timezone

    print("--- services/recommendation_service.py self-test ---")

    Base.metadata.create_all(engine)
    session = SessionLocal()

    session.execute(text("DELETE FROM registrations"))
    session.execute(text("DELETE FROM activities"))
    session.execute(text("DELETE FROM categories"))
    session.execute(text("DELETE FROM users"))
    session.commit()

    now = datetime.now(timezone.utc)

    session.add_all([
        Category(id="cat_env",    name="Environment", status="active"),
        Category(id="cat_sports", name="Sports",      status="active"),
        Category(id="cat_sci",    name="Science",     status="active"),
    ])
    session.add_all([
        Activity(id="e1", title="Eco Photography Walk",  short_description="Environmental awareness walk.",      category_id="cat_env",    commune="Akbou", activity_mode="physical", status="published", is_free=True,  last_verified_at=now),
        Activity(id="e2", title="Clean-Up Volunteering", short_description="Youth-led local cleanup.",           category_id="cat_env",    commune="Akbou", activity_mode="physical", status="published", is_free=True,  last_verified_at=now),
        Activity(id="s1", title="Football Tournament",   short_description="Competitive football for youth.",   category_id="cat_sports", commune="Akbou", activity_mode="physical", status="published", is_free=True,  last_verified_at=now),
        Activity(id="c1", title="Robotics Workshop",     short_description="Intro to robotics for beginners.",  category_id="cat_sci",    commune="Akbou", activity_mode="physical", status="published", is_free=False, last_verified_at=now),
    ])
    session.add(User(
        id="user_sports",
        full_name="Yacine",
        commune="Akbou",
        wilaya="Bejaia",
        interests="Sports,Environment",
    ))
    # User already attended e1 — should NOT appear in feed
    session.add(Registration(id="reg_1", user_id="user_sports", activity_id="e1", status="attended"))
    session.commit()

    index_activities(session)

    req = FeedRequest(user_id="user_sports")
    response = get_feed(req, session)

    assert response.user_id == "user_sports"
    assert isinstance(response.items, list)
    assert not response.cached
    print(f"✓ feed returned {len(response.items)} items (cache miss)")
    print(f"  Profile: {response.profile_summary}")

    # Already-attended activity must be excluded
    returned_ids = [item.id for item in response.items]
    assert "e1" not in returned_ids, "Already-attended activity should be excluded"
    print("✓ already-attended activity excluded from feed")

    # Second call must be cached
    response2 = get_feed(req, session)
    assert response2.cached
    print("✓ second call served from cache")

    # Unknown user still gets a feed (falls back to general)
    req_anon = FeedRequest(user_id="unknown_user")
    response_anon = get_feed(req_anon, session)
    assert isinstance(response_anon.items, list)
    print(f"✓ unknown user gets general feed ({len(response_anon.items)} items)")

    # All items must have required fields
    for item in response.items:
        assert item.id
        assert item.title
        assert 0.0 <= item.score <= 1.0
    print("✓ all feed item fields valid")

    print(f"\nFeed for Yacine:")
    for item in response.items:
        print(f"  [{item.score:.3f}] {item.title} ({item.category}) — {item.commune}")

    session.close()
    print("\n--- all recommendation service tests passed ---")