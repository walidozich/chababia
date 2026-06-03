from pydantic_settings import BaseSettings
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

# ai/recommendation-system -> project-root
PROJECT_ROOT = BASE_DIR.parent.parent

DB_PATH = PROJECT_ROOT / "backend" / "pb_data" / "data.db"


class Settings(BaseSettings):
    sqlite_path: str = str(DB_PATH)

    qdrant_collection: str = "activities"
    qdrant_vector_size: int = 384

    embedding_model: str = "paraphrase-multilingual-MiniLM-L12-v2"

    cache_ttl_seconds: int = 3600
    cache_max_size: int = 128

    recommendation_top_k: int = 5

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()