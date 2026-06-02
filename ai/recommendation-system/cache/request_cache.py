# In-memory cache for repeated admin requests

import hashlib
import json
from cachetools import TTLCache
from config import settings

# Thread-safe would need a lock in production, but for single-worker FastAPI this is fine
_cache: TTLCache = TTLCache(
    maxsize=settings.cache_max_size,
    ttl=settings.cache_ttl_seconds,
)


def _make_key(request_data: dict) -> str:
    """
    Create a stable hash key from the request dict.
    Same inputs → same key, regardless of key ordering.
    """
    serialized = json.dumps(request_data, sort_keys=True, ensure_ascii=False)
    return hashlib.sha256(serialized.encode()).hexdigest()


def get_cached(request_data: dict) -> list[dict] | None:
    """Return cached suggestions if present, else None."""
    key = _make_key(request_data)
    return _cache.get(key)


def set_cached(request_data: dict, suggestions: list[dict]) -> None:
    """Store suggestions under the request's hash key."""
    key = _make_key(request_data)
    _cache[key] = suggestions


def cache_size() -> int:
    return len(_cache)


def clear_cache() -> None:
    _cache.clear()


# ---------------------------------------------------------------------------
# TEST — run: python -m cache.request_cache
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import time

    print("--- cache/request_cache.py self-test ---")

    clear_cache()

    req = {"commune": "Akbou", "categories": ["Sports"], "season": "summer"}
    suggestions = [{"suggested_title": "Football Camp", "category": "Sports"}]

    # Miss first
    assert get_cached(req) is None, "Expected cache miss"
    print("✓ cache miss on empty cache")

    # Store and hit
    set_cached(req, suggestions)
    result = get_cached(req)
    assert result == suggestions, "Cache did not return stored value"
    print("✓ cache hit returns correct suggestions")

    # Key order should not matter
    req_shuffled = {"season": "summer", "categories": ["Sports"], "commune": "Akbou"}
    assert get_cached(req_shuffled) == suggestions, "Key order should not affect cache lookup"
    print("✓ key order does not affect lookup")

    # Different input → different key → cache miss
    req_diff = {"commune": "Tizi Ouzou", "categories": ["Arts"], "season": "winter"}
    assert get_cached(req_diff) is None, "Expected miss for different input"
    print("✓ different input returns cache miss")

    assert cache_size() == 1
    print(f"✓ cache size is {cache_size()}")

    print("--- all cache tests passed ---")