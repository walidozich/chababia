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


def _parse_interests(raw) -> list[str]:
    """
    interests is a JSON column — SQLAlchemy returns it as a Python list already.
    Guard against edge cases (None, empty string from legacy data).
    """
    if not raw:
        return []
    if isinstance(raw, list):
        return [str(i) for i in raw if i]
    # Fallback: treat as comma-separated string
    return [s.strip() for s in str(raw).split(",") if s.strip()]


def _build_user_profile_text(
    interests: list[str],
    commune: Optional[str],
    past_activities: list,
) -> tuple[str, str]:
    """
    Build a natural language query string from the user's data.
    Returns (query_text_for_encoding, human_readable_summary).
    """
    parts: list[str] = []
    summary_parts: list[str] = []

    if interests:
        parts.append(f"interests: {', '.join(interests)}")
        summary_parts.append(f"interests ({', '.join(interests)})")

    if commune:
        parts.append(f"commune: {commune}")
        summary_parts.append(f"commune ({commune})")

    if past_activities:
        titles = ", ".join(a.title for a in past_activities[:5])
        parts.append(f"past activities: {titles}")
        summary_parts.append(f"{len(past_activities)} past registration(s)")

    query_text = " | ".join(parts) if parts else "youth activity Algeria"
    summary = (
        "Profile built from: " + ", ".join(summary_parts)
        if summary_parts
        else "No profile data — showing general activities."
    )
    return query_text, summary


def get_feed(req: FeedRequest, session: Session) -> FeedResponse:
    """
    Build a personalised activity feed for a youth user.

    1. Cache check — instant return on repeated request.
    2. Load user (commune + interests from JSON column).
    3. Load registration history (attended/registered only).
    4. Build taste-profile text.
    5. Encode → vector.
    6. Cosine search Qdrant.
    7. Exclude already-registered activities.
    8. Cache result and return.
    """
    cache_key = {"feed": req.user_id}

    cached = get_cached(cache_key)
    if cached is not None:
        return FeedResponse(
            user_id=req.user_id,
            items=cached["items"],
            cached=True,
            profile_summary=cached["profile_summary"],
        )

    user         = get_user_by_id(session, req.user_id)
    commune      = user.commune   if user else None
    interests    = _parse_interests(user.interests if user else None)
    past         = get_user_registered_activities(session, req.user_id)
    past_ids     = {a.id for a in past}

    query_text, summary = _build_user_profile_text(interests, commune, past)
    query_vector = encode(query_text)

    hits = search_similar_activities(
        query_vector=query_vector,
        top_k=settings.recommendation_top_k + len(past_ids),
    )

    items = [
        ActivityCard(
            id=hit["id"],
            title=hit["title"],
            category=hit.get("category"),
            commune=hit.get("commune"),
            wilaya=hit.get("wilaya"),
            activity_mode=hit.get("activity_mode"),
            is_free=hit.get("is_free"),
            score=hit["score"],
        )
        for hit in hits
        if hit["id"] not in past_ids
    ][:settings.recommendation_top_k]

    set_cached(cache_key, {"items": items, "profile_summary": summary})
    return FeedResponse(user_id=req.user_id, items=items, cached=False, profile_summary=summary)


# ---------------------------------------------------------------------------
# TEST — run: python -m services.recommendation_service
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    from db.database import SessionLocal, engine
    from db.models import Base, Activity, Category, User, Registration
    from vdb.indexer import index_activities
    from cache.request_cache import clear_cache
    from sqlalchemy import text

    print("--- services/recommendation_service.py self-test ---")
    Base.metadata.create_all(engine)
    session = SessionLocal()
    clear_cache()

    for tbl in ["registrations", "activities", "categories", "users"]:
        session.execute(text(f"DELETE FROM {tbl}"))
    session.commit()

    session.add_all([
        Category(id="cat_env",    name="Environment", status="active"),
        Category(id="cat_sports", name="Sports",      status="active"),
        Category(id="cat_sci",    name="Science",     status="active"),
    ])
    session.add_all([
        Activity(id="e1", title="Eco Photography Walk",  short_description="Environmental awareness walk.",    category="cat_env",    commune="Akbou", wilaya="Bejaia", activity_mode="physical", status="published", is_free=True,  start_datetime="2026-07-10 09:00:00.000Z"),
        Activity(id="e2", title="Clean-Up Volunteering", short_description="Youth-led local cleanup.",         category="cat_env",    commune="Akbou", wilaya="Bejaia", activity_mode="physical", status="published", is_free=True,  start_datetime="2026-07-12 09:00:00.000Z"),
        Activity(id="s1", title="Football Tournament",   short_description="Competitive football for youth.", category="cat_sports", commune="Akbou", wilaya="Bejaia", activity_mode="physical", status="published", is_free=True,  start_datetime="2026-07-15 09:00:00.000Z"),
        Activity(id="c1", title="Robotics Workshop",     short_description="Intro to robotics for teens.",    category="cat_sci",    commune="Akbou", wilaya="Bejaia", activity_mode="physical", status="published", is_free=False, start_datetime="2026-07-20 09:00:00.000Z"),
    ])
    session.add(User(
        id="user_sports", full_name="Yacine", email="yacine@test.dz",
        commune="Akbou", wilaya="Bejaia", role="youth",
        interests=["Sports", "Environment"],   # Python list — JSON column
    ))
    session.add(Registration(
        id="reg_1", user="user_sports", activity="e1",
        full_name="Yacine", status="attended",
    ))
    session.commit()

    index_activities(session)

    req = FeedRequest(user_id="user_sports")
    response = get_feed(req, session)

    assert response.user_id == "user_sports"
    assert isinstance(response.items, list)
    assert not response.cached
    print(f"✓ feed returned {len(response.items)} items (cache miss)")
    print(f"  Profile: {response.profile_summary}")

    # Already-attended activity must not appear
    assert "e1" not in [i.id for i in response.items]
    print("✓ attended activity excluded")

    # Second call must be cached
    assert get_feed(req, session).cached
    print("✓ second call served from cache")

    # Unknown user still gets a feed
    anon = get_feed(FeedRequest(user_id="nobody"), session)
    assert isinstance(anon.items, list)
    print(f"✓ unknown user gets general feed ({len(anon.items)} items)")

    # All items have valid fields
    for item in response.items:
        assert item.id and item.title
        assert 0.0 <= item.score <= 1.0
    print("✓ all item fields valid")

    # _parse_interests edge cases
    assert _parse_interests(None) == []
    assert _parse_interests([]) == []
    assert _parse_interests(["Sports", "Arts"]) == ["Sports", "Arts"]
    assert _parse_interests("Sports,Arts") == ["Sports", "Arts"]
    print("✓ _parse_interests handles all edge cases")

    print("\nFeed for Yacine:")
    for item in response.items:
        print(f"  [{item.score:.3f}] {item.title} — {item.commune}")

    session.close()
    print("\n--- all recommendation service tests passed ---")