# FastAPI app entry point

from fastapi import FastAPI
from contextlib import asynccontextmanager
from api.router import api_router
from vdb.collections import ensure_collection_exists
from vdb.indexer import index_activities
from db.database import engine, SessionLocal
from db.models import Base
import os

# Tell HuggingFace to use cached model only — no network calls
os.environ["TRANSFORMERS_OFFLINE"] = "1"
os.environ["HF_DATASETS_OFFLINE"] = "1"


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[startup] Creating DB tables if needed...")
    Base.metadata.create_all(engine)

    print("[startup] Ensuring Qdrant collection exists...")
    ensure_collection_exists()

    print("[startup] Indexing published activities into Qdrant...")
    session = SessionLocal()
    try:
        count = index_activities(session)
        print(f"[startup] {count} activities indexed and ready.")
    finally:
        session.close()

    yield
    # in-memory Qdrant is discarded on shutdown — re-indexed on next startup


app = FastAPI(
    title="Chababia Recommendation Service",
    description="Personalised activity feed for youth users.",
    version="0.2.0",
    lifespan=lifespan,
)

app.include_router(api_router)


@app.get("/health")
def health():
    return {"status": "ok"}


# ---------------------------------------------------------------------------
# TEST — run: python -m main
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    from fastapi.testclient import TestClient

    print("--- main.py self-test ---")
    client = TestClient(app)

    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}
    print("✓ GET /health returns 200")

    schema = client.get("/openapi.json")
    assert schema.status_code == 200
    assert "/api/feed/{user_id}" in schema.json()["paths"]
    print("✓ /api/feed/{user_id} in OpenAPI schema")

    print("--- all main tests passed ---")
    print("\nTo run the server:")
    print("  uvicorn main:app --reload")