# Settings (DB path, Qdrant URL, model name, etc.)

from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    # --- Database ---
    sqlite_path: str = "./chababia.db"

    # --- Qdrant (local in-memory, no server needed) ---
    qdrant_collection: str = "activities"
    qdrant_vector_size: int = 384  # matches MiniLM-L12-v2 output

    # --- Embedding model ---
    # multilingual, covers Arabic + French, ~120MB, CPU-friendly
    embedding_model: str = "paraphrase-multilingual-MiniLM-L12-v2"

    # --- Cache ---
    cache_ttl_seconds: int = 3600   # 1 hour
    cache_max_size: int = 128       # max cached request entries

    # --- Recommendation ---
    recommendation_top_k: int = 5   # how many similar activities to retrieve

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()