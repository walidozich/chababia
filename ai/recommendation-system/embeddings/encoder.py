# Text → vector (using a lightweight model)
import os
os.environ["TRANSFORMERS_OFFLINE"] = "1"
os.environ["HF_DATASETS_OFFLINE"] = "1"
from sentence_transformers import SentenceTransformer
from config import settings

# Loaded once at import time — not per request
_model: SentenceTransformer | None = None


def get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        print(f"[encoder] Loading model: {settings.embedding_model}")
        _model = SentenceTransformer(settings.embedding_model)
    return _model


def encode(text: str) -> list[float]:
    """Encode a single string into a vector. Returns a plain Python list."""
    model = get_model()
    vector = model.encode(text, normalize_embeddings=True)
    return vector.tolist()


def encode_activity(title: str, description: str, category: str, commune: str = "") -> list[float]:
    """
    Build a composite text from activity fields and encode it.
    Combining fields gives richer semantic context than title alone.
    """
    parts = [title, description, category]
    if commune:
        parts.append(commune)
    combined = " | ".join(p for p in parts if p)
    return encode(combined)


# ---------------------------------------------------------------------------
# TEST — run: python -m embeddings.encoder
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    print("--- embeddings/encoder.py self-test ---")

    v1 = encode("Football tournament for youth")
    assert isinstance(v1, list), "Expected list"
    assert len(v1) == 384, f"Expected 384 dims, got {len(v1)}"
    print(f"✓ encode() returned vector of dim {len(v1)}")

    # Same text twice must produce identical vectors (deterministic)
    v2 = encode("Football tournament for youth")
    assert v1 == v2, "Encoding is not deterministic"
    print("✓ encode() is deterministic")

    # Semantic similarity: similar texts should be closer than unrelated ones
    from sentence_transformers import util
    v_sports = encode("youth sports football tournament")
    v_art    = encode("photography art exhibition workshop")
    v_query  = encode("sport competition for young people")

    sim_sports = util.cos_sim([v_query], [v_sports]).item()
    sim_art    = util.cos_sim([v_query], [v_art]).item()
    assert sim_sports > sim_art, "Sports query should be closer to sports activity"
    print(f"✓ cosine(query, sports)={sim_sports:.3f} > cosine(query, art)={sim_art:.3f}")

    v_act = encode_activity(
        title="Robotics Club",
        description="Beginner robotics sessions for teens",
        category="Science",
        commune="Akbou",
    )
    assert len(v_act) == 384
    print(f"✓ encode_activity() returned vector of dim {len(v_act)}")

    print("--- all encoder tests passed ---")