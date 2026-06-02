# POST /recommendations endpoint

from __future__ import annotations
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_session
from schemas.recommendation import FeedRequest, FeedResponse
from services.recommendation_service import get_feed

router = APIRouter(prefix="/api", tags=["feed"])


@router.get("/feed/{user_id}", response_model=FeedResponse)
def personalized_feed(
    user_id: str,
    session: Session = Depends(get_session),
) -> FeedResponse:
    """
    Returns a personalized activity feed for a youth user.

    Built from the user's:
    - Stored interests (selected during onboarding)
    - Commune (for locality relevance)
    - Registration history (past attended/registered activities)

    Already-registered activities are excluded from results.
    Results are cached per user for one hour.
    """
    return get_feed(FeedRequest(user_id=user_id), session)


# ---------------------------------------------------------------------------
# TEST — run: python -m api.routes.recommendations
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    from fastapi.testclient import TestClient
    from fastapi import FastAPI
    from sqlalchemy import text
    from datetime import datetime, timezone

    from db.database import engine, SessionLocal
    from db.models import Base, Activity, Category, User, Registration
    from vdb.indexer import index_activities

    print("--- api/routes/recommendations.py self-test ---")

    # ------------------------------------------------------------------
    # DB Setup
    # ------------------------------------------------------------------
    Base.metadata.create_all(engine)

    session = SessionLocal()

    session.execute(text("DELETE FROM registrations"))
    session.execute(text("DELETE FROM activities"))
    session.execute(text("DELETE FROM categories"))
    session.execute(text("DELETE FROM users"))
    session.commit()

    now = datetime.now(timezone.utc)

    # ------------------------------------------------------------------
    # Categories
    # ------------------------------------------------------------------
    session.add_all([
        Category(id="cat_sports", name="Sports", status="active"),
        Category(id="cat_science", name="Science", status="active"),
        Category(id="cat_env", name="Environment", status="active"),
    ])

    # ------------------------------------------------------------------
    # Activities
    # ------------------------------------------------------------------
    session.add_all([
        Activity(
            id="football",
            title="Football Tournament",
            short_description="Competitive football event for youth players",
            category_id="cat_sports",
            commune="Akbou",
            activity_mode="physical",
            status="published",
            is_free=True,
            last_verified_at=now,
        ),
        Activity(
            id="basketball",
            title="Basketball Championship",
            short_description="Youth basketball competition",
            category_id="cat_sports",
            commune="Akbou",
            activity_mode="physical",
            status="published",
            is_free=True,
            last_verified_at=now,
        ),
        Activity(
            id="robotics",
            title="Robotics Workshop",
            short_description="Introduction to robotics and engineering",
            category_id="cat_science",
            commune="Akbou",
            activity_mode="physical",
            status="published",
            is_free=False,
            last_verified_at=now,
        ),
        Activity(
            id="chemistry",
            title="Chemistry Seminar",
            short_description="Fundamentals of chemistry and laboratory science",
            category_id="cat_science",
            commune="Akbou",
            activity_mode="physical",
            status="published",
            is_free=True,
            last_verified_at=now,
        ),
        Activity(
            id="trees",
            title="Tree Planting Day",
            short_description="Community environmental activity",
            category_id="cat_env",
            commune="Akbou",
            activity_mode="physical",
            status="published",
            is_free=True,
            last_verified_at=now,
        ),
        Activity(
            id="oran_football",
            title="Football Tournament Oran",
            short_description="Football competition for youth athletes",
            category_id="cat_sports",
            commune="Oran",
            activity_mode="physical",
            status="published",
            is_free=True,
            last_verified_at=now,
        ),
    ])

    # ------------------------------------------------------------------
    # User
    # ------------------------------------------------------------------
    session.add(
        User(
            id="sports_user",
            full_name="Yacine",
            commune="Akbou",
            wilaya="Bejaia",
            interests="Sports,Football",
        )
    )

    # Already attended football
    session.add(
        Registration(
            id="reg1",
            user_id="sports_user",
            activity_id="football",
            status="attended",
        )
    )

    session.commit()

    # ------------------------------------------------------------------
    # Index Activities into Vector DB
    # ------------------------------------------------------------------
    print("Indexing activities...")
    index_activities(session)

    session.close()

    # ------------------------------------------------------------------
    # FastAPI Test Client
    # ------------------------------------------------------------------
    app = FastAPI()
    app.include_router(router)

    client = TestClient(app)

    # ------------------------------------------------------------------
    # Personalized Feed Test
    # ------------------------------------------------------------------
    response = client.get("/api/feed/sports_user")

    assert response.status_code == 200, (
        f"Expected 200, got {response.status_code}"
    )

    data = response.json()

    print("\nProfile Summary:")
    print(data["profile_summary"])

    print("\nRecommendations:")
    for item in data["items"]:
        print(
            f"{item['score']:.3f} | "
            f"{item['title']} | "
            f"{item.get('commune')}"
        )

    returned_ids = [item["id"] for item in data["items"]]

    # ------------------------------------------------------------------
    # Assertions
    # ------------------------------------------------------------------

    assert data["user_id"] == "sports_user"
    print("✓ correct user returned")

    assert isinstance(data["items"], list)
    print("✓ feed contains item list")

    # Already attended activity must not appear
    assert "football" not in returned_ids
    print("✓ attended activity excluded")

    # Sports recommendation should appear
    assert "basketball" in returned_ids
    print("✓ sports activity recommended")

    # User interests should be reflected
    assert "Sports" in data["profile_summary"]
    print("✓ interests included in profile")

    # ------------------------------------------------------------------
    # Score Validation
    # ------------------------------------------------------------------
    scores = {
        item["id"]: item["score"]
        for item in data["items"]
    }

    if "basketball" in scores and "robotics" in scores:
        print(
            f"basketball={scores['basketball']:.3f} "
            f"robotics={scores['robotics']:.3f}"
        )

        assert scores["basketball"] > scores["robotics"]
        print("✓ sports ranked above robotics")

    if "basketball" in scores and "oran_football" in scores:
        print(
            f"local={scores['basketball']:.3f} "
            f"remote={scores['oran_football']:.3f}"
        )

    # ------------------------------------------------------------------
    # Cache Test
    # ------------------------------------------------------------------
    response2 = client.get("/api/feed/sports_user")

    assert response2.status_code == 200
    assert response2.json()["cached"] is True

    print("✓ cache working")

    # ------------------------------------------------------------------
    # Unknown User Test
    # ------------------------------------------------------------------
    response3 = client.get("/api/feed/unknown_user")

    assert response3.status_code == 200

    anon = response3.json()

    assert isinstance(anon["items"], list)

    print(
        f"✓ unknown user receives "
        f"{len(anon['items'])} recommendations"
    )

    print("\n--- ALL TESTS PASSED ---")