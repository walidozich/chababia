# Qdrant client initialization

from qdrant_client import QdrantClient

# Single in-memory client instance — no server required
_client: QdrantClient | None = None


def get_client() -> QdrantClient:
    """Return the shared in-memory Qdrant client, creating it once."""
    global _client
    if _client is None:
        print("[qdrant] Initializing local in-memory Qdrant client")
        _client = QdrantClient(":memory:")
    return _client


# ---------------------------------------------------------------------------
# TEST — run: python -m vector_store.client
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    print("--- vector_store/client.py self-test ---")

    client = get_client()
    assert client is not None
    print("✓ client initialized")

    # Calling again should return the same instance
    client2 = get_client()
    assert client is client2, "Expected singleton"
    print("✓ singleton — same instance returned")

    print("--- all client tests passed ---")