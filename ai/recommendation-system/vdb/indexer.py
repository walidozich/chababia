# Build and upsert vectors from SQLite data

from qdrant_client.models import PointStruct
from vdb.client import get_client
from vdb.collections import ensure_collection_exists
from embeddings.encoder import encode_activity
from db.queries import get_published_activities
from config import settings


def index_activities(session) -> int:
    """
    Read all published activities from SQLite, encode them,
    and upsert into Qdrant. Returns the number of indexed points.

    Call this manually or on a schedule — never during a user request.
    """
    ensure_collection_exists()
    client = get_client()

    activities = get_published_activities(session)
    if not activities:
        print("[indexer] No published activities found — nothing to index.")
        return 0

    points = []
    for act in activities:
        vector = encode_activity(
            title=act.title or "",
            description=act.short_description or "",
            category=act.category_id or "",   # category name if joined, id otherwise
            commune=getattr(act, "commune", "") or "",
        )
        payload = {
            "id": act.id,
            "title": act.title,
            "category": act.category_id,
            "activity_mode": act.activity_mode,
            "establishment_id": act.establishment_id,
            "is_free": act.is_free,
            "age_min": act.age_min,
            "age_max": act.age_max,
        }
        # Qdrant requires integer or UUID point IDs — we hash the string ID
        point_id = abs(hash(act.id)) % (2**63)
        points.append(PointStruct(id=point_id, vector=vector, payload=payload))

    client.upsert(collection_name=settings.qdrant_collection, points=points)
    print(f"[indexer] Indexed {len(points)} activities.")
    return len(points)


# ---------------------------------------------------------------------------
# TEST — run: python -m vector_store.indexer
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    from db.database import SessionLocal, engine
    from db.models import Base, Activity, Category
    from sqlalchemy import text
    from datetime import datetime

    print("--- vector_store/indexer.py self-test ---")

    Base.metadata.create_all(engine)
    session = SessionLocal()

    # Seed test data
    session.execute(text("DELETE FROM activities"))
    session.execute(text("DELETE FROM categories"))
    session.commit()

    session.add(Category(id="cat_sports", name="Sports", status="active"))
    session.add(Activity(
        id="act_idx_1",
        title="Youth Football Tournament",
        short_description="Competitive football for youth aged 15-25.",
        category_id="cat_sports",
        activity_mode="physical",
        status="published",
        last_verified_at=datetime.utcnow(),
    ))
    session.add(Activity(
        id="act_idx_2",
        title="Photography Workshop",
        short_description="Learn basic photography skills.",
        category_id="cat_sports",
        activity_mode="physical",
        status="published",
        last_verified_at=datetime.utcnow(),
    ))
    # Draft activity — must NOT be indexed
    session.add(Activity(
        id="act_idx_3",
        title="Draft Event",
        short_description="This should not be indexed.",
        category_id="cat_sports",
        status="draft",
    ))
    session.commit()

    count = index_activities(session)
    assert count == 2, f"Expected 2 indexed, got {count}"
    print(f"✓ indexed {count} published activities (draft excluded)")

    # Verify points exist in Qdrant
    from vdb.client import get_client
    client = get_client()
    info = client.get_collection(settings.qdrant_collection)
    assert info.points_count == 2, f"Expected 2 points in Qdrant, got {info.points_count}"
    print(f"✓ Qdrant collection has {info.points_count} points")

    session.close()
    print("--- all indexer tests passed ---")