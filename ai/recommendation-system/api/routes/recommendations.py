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
    Returns a personalised activity feed for a youth user.

    Matching uses:
    - interests (JSON multi-select stored in users table)
    - commune (locality relevance)
    - registration history (attended/registered activities excluded from results)

    Results cached per user for one hour.
    """
    return get_feed(FeedRequest(user_id=user_id), session)


# ---------------------------------------------------------------------------
# TEST — run: python -m api.routes.recommendations
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    from fastapi.testclient import TestClient
    from fastapi import FastAPI
    from db.database import engine
    from db.models import Base, Activity, Category, User, Registration
    from vdb.indexer import index_activities
    from cache.request_cache import clear_cache
    from db.database import SessionLocal
    from sqlalchemy import text

    print("--- api/routes/recommendations.py self-test ---")
    Base.metadata.create_all(engine)
    session = SessionLocal()
    clear_cache()

    for tbl in ["registrations", "activities", "categories", "users"]:
        session.execute(text(f"DELETE FROM {tbl}"))
    session.commit()

    session.add_all([
        Category(id="cat_env", name="Environment", status="active"),
        Activity(id="r1", title="Eco Walk",     short_description="Environmental awareness walk.",
                 category="cat_env", commune="Akbou", wilaya="Bejaia",
                 activity_mode="physical", status="published", is_free=True,
                 start_datetime="2026-07-10 09:00:00.000Z"),
        Activity(id="r2", title="Tree Planting", short_description="Community tree planting.",
                 category="cat_env", commune="Akbou", wilaya="Bejaia",
                 activity_mode="physical", status="published", is_free=True,
                 start_datetime="2026-07-15 09:00:00.000Z"),
        User(id="u1", full_name="Sara", email="sara@test.dz",
             commune="Akbou", wilaya="Bejaia", role="youth",
             interests=["Environment"]),
    ])
    session.commit()
    index_activities(session)
    session.close()

    app = FastAPI()
    app.include_router(router)
    client = TestClient(app)

    # Known user
    r = client.get("/api/feed/u1")
    assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text}"
    data = r.json()
    assert data["user_id"] == "u1"
    assert isinstance(data["items"], list)
    assert "profile_summary" in data
    assert not data["cached"]
    print(f"✓ GET /api/feed/u1 — {len(data['items'])} items")
    print(f"  Profile: {data['profile_summary']}")

    # Second call — cached
    r2 = client.get("/api/feed/u1")
    assert r2.json()["cached"] is True
    print("✓ second call served from cache")

    # Unknown user — 200 with general feed
    r3 = client.get("/api/feed/nobody")
    assert r3.status_code == 200
    print("✓ unknown user returns 200 with general feed")

    # Item structure
    for item in data["items"]:
        assert "id" in item and "title" in item and "score" in item
    print("✓ all item fields present")

    print("--- all route tests passed ---")