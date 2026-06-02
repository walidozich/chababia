# FastAPI app entry point

from fastapi import FastAPI
from contextlib import asynccontextmanager
from api.router import api_router
from vdb.collections import ensure_collection_exists
from db.database import engine
from db.models import Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[startup] Creating DB tables if needed...")
    Base.metadata.create_all(engine)
    print("[startup] Ensuring Qdrant collection exists...")
    ensure_collection_exists()
    print("[startup] Ready.")
    yield


app = FastAPI(
    title="Chababia Recommendation Service",
    description="Personalized activity feed for youth users.",
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

    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
    print("✓ GET /health returns 200")

    schema = client.get("/openapi.json")
    assert schema.status_code == 200
    paths = schema.json()["paths"]
    assert "/api/feed/{user_id}" in paths
    print("✓ /api/feed/{user_id} present in OpenAPI schema")

    print("--- all main tests passed ---")
    print("\nTo run the server:")
    print("  uvicorn main:app --reload")