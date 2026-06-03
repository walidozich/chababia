from __future__ import annotations
from typing import Optional
from qdrant_client.models import Filter, FieldCondition, MatchValue
from vdb.client import get_client
from config import settings


def search_similar_activities(
    query_vector: list[float],
    top_k: int = None,
    filter_category: Optional[str] = None,
    filter_mode: Optional[str] = None,
) -> list[dict]:
    """
    Run cosine similarity search against the activities collection.

    Returns a list of payload dicts (activity metadata) sorted by score descending.
    Each result includes a 'score' field (0.0 – 1.0).

    Args:
        query_vector:     The encoded query vector.
        top_k:            How many results to return. Defaults to settings value.
        filter_category:  Optional — restrict to a specific category.
        filter_mode:      Optional — restrict to activity_mode (physical/online/hybrid).
    """
    client = get_client()
    k = top_k or settings.recommendation_top_k

    # Build optional Qdrant filter
    conditions = []
    if filter_category:
        conditions.append(FieldCondition(key="category", match=MatchValue(value=filter_category)))
    if filter_mode:
        conditions.append(FieldCondition(key="activity_mode", match=MatchValue(value=filter_mode)))

    query_filter = Filter(must=conditions) if conditions else None

    response = client.query_points(
        collection_name=settings.qdrant_collection,
        query=query_vector,
        limit=k,
        query_filter=query_filter,
        with_payload=True,
    )

    return [
        {**hit.payload, "score": round(hit.score, 4)}
        for hit in response.points
    ]


# ---------------------------------------------------------------------------
# TEST — run: python -m vector_store.searcher
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    from db.database import SessionLocal, engine
    from db.models import Base, Activity, Category
    from vdb.indexer import index_activities
    from embeddings.encoder import encode
    from sqlalchemy import text
    from datetime import datetime

    print("--- vector_store/searcher.py self-test ---")

    Base.metadata.create_all(engine)
    session = SessionLocal()

    # Seed
    session.execute(text("DELETE FROM activities"))
    session.execute(text("DELETE FROM categories"))
    session.commit()

    session.add(Category(id="cat_s", name="Sports", status="active"))
    session.add(Category(id="cat_a", name="Arts", status="active"))
    session.add_all([
        Activity(id="s1", title="Football Tournament", short_description="Youth football match", category="cat_s", activity_mode="physical", status="published", last_verified_at=datetime.utcnow()),
        Activity(id="s2", title="Basketball League",   short_description="Youth basketball competition", category="cat_s", activity_mode="physical", status="published", last_verified_at=datetime.utcnow()),
        Activity(id="a1", title="Photography Workshop", short_description="Learn photography basics", category="cat_a", activity_mode="physical", status="published", last_verified_at=datetime.utcnow()),
    ])
    session.commit()

    index_activities(session)

    # Search for something sport-related
    query_vec = encode("team sport competition for youth")
    results = search_similar_activities(query_vec, top_k=3)

    assert len(results) > 0, "Expected at least one result"
    print(f"✓ search returned {len(results)} results")

    titles = [r["title"] for r in results]
    print(f"  Results: {titles}")
    print(f"  Scores:  {[r['score'] for r in results]}")

    # Top result should be a sports activity
    assert results[0]["category"] == "cat_s", "Expected top result to be a sports activity"
    print("✓ top result is correctly a sports activity")

    # Test category filter
    arts_results = search_similar_activities(query_vec, top_k=3, filter_category="cat_a")
    assert all(r["category"] == "cat_a" for r in arts_results), "Filter by category failed"
    print("✓ filter_category works correctly")

    # Scores should be descending
    scores = [r["score"] for r in results]
    assert scores == sorted(scores, reverse=True), "Results not sorted by score"
    print("✓ results are sorted by score descending")

    session.close()
    print("--- all searcher tests passed ---")