# Create/ensure Qdrant collection exists

from qdrant_client.models import Distance, VectorParams
from vdb.client import get_client
from config import settings


def ensure_collection_exists() -> None:
    """
    Create the activities collection if it doesn't exist yet.
    Safe to call multiple times — checks first.
    """
    client = get_client()
    existing = [c.name for c in client.get_collections().collections]

    if settings.qdrant_collection not in existing:
        print(f"[qdrant] Creating collection: '{settings.qdrant_collection}'")
        client.create_collection(
            collection_name=settings.qdrant_collection,
            vectors_config=VectorParams(
                size=settings.qdrant_vector_size,
                distance=Distance.COSINE,
            ),
        )
        print(f"[qdrant] Collection '{settings.qdrant_collection}' created.")
    else:
        print(f"[qdrant] Collection '{settings.qdrant_collection}' already exists.")


# ---------------------------------------------------------------------------
# TEST — run: python -m vector_store.collections
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    print("--- vector_store/collections.py self-test ---")

    ensure_collection_exists()

    client = get_client()
    names = [c.name for c in client.get_collections().collections]
    assert settings.qdrant_collection in names, "Collection not found after creation"
    print(f"✓ collection '{settings.qdrant_collection}' exists")

    # Calling again must not crash (idempotent)
    ensure_collection_exists()
    print("✓ idempotent — no crash on second call")

    print("--- all collection tests passed ---")