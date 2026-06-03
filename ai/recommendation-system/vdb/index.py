"""
index.py — VDB index management.

CLI usage:
    python index.py            # incremental update
    python index.py --full     # full re-index
    python index.py --stats    # show stats

Importable usage (used by recommendation_service.py on every feed request):
    from index import incremental_index
    incremental_index(session)
"""
from __future__ import annotations
import argparse
import json
from pathlib import Path
from qdrant_client.models import PointStruct
from db.models import Activity
from embeddings.encoder import encode_activity
from vdb.client import get_client
from vdb.collections import ensure_collection_exists
from config import settings

STATE_FILE = Path(__file__).parent / "index_state.json"


# ---------------------------------------------------------------------------
# State helpers
# ---------------------------------------------------------------------------

def _load_state() -> dict:
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text(encoding="utf-8"))
    return {}


def _save_state(state: dict) -> None:
    STATE_FILE.write_text(json.dumps(state, indent=2), encoding="utf-8")


# ---------------------------------------------------------------------------
# Core
# ---------------------------------------------------------------------------

def _build_point(act: Activity) -> PointStruct:
    vector = encode_activity(
        title=act.title or "",
        description=act.short_description or "",
        category=act.category or "",
        commune=act.commune or "",
    )
    payload = {
        "id":            act.id,
        "title":         act.title,
        "category":      act.category,
        "commune":       act.commune,
        "wilaya":        act.wilaya,
        "activity_mode": act.activity_mode,
        "is_free":       bool(act.is_free),
        "age_min":       float(act.age_min) if act.age_min else None,
        "age_max":       float(act.age_max) if act.age_max else None,
    }
    point_id = abs(hash(act.id)) % (2 ** 63)
    return PointStruct(id=point_id, vector=vector, payload=payload)


def _upsert(points: list[PointStruct]) -> None:
    get_client().upsert(collection_name=settings.qdrant_collection, points=points)


# ---------------------------------------------------------------------------
# Public API — imported by recommendation_service.py
# ---------------------------------------------------------------------------

def incremental_index(session) -> int:
    """
    Only re-encode activities that are new or updated since last run.
    Removes stale (unpublished/deleted) activities from Qdrant.
    Safe to call on every feed request — skips immediately if nothing changed.
    Returns number of activities upserted (0 means index was already current).
    """
    ensure_collection_exists()
    state = _load_state()

    activities = (
        session.query(Activity)
        .filter(Activity.status == "published")
        .all()
    )

    # Find new or updated
    to_index = [a for a in activities if state.get(a.id) != a.updated]

    # Remove stale (no longer published)
    current_ids = {a.id for a in activities}
    stale_ids = set(state.keys()) - current_ids
    if stale_ids:
        client = get_client()
        client.delete(
            collection_name=settings.qdrant_collection,
            points_selector=[abs(hash(i)) % (2 ** 63) for i in stale_ids],
        )
        for sid in stale_ids:
            state.pop(sid, None)
        print(f"[index] Removed {len(stale_ids)} stale activities.")

    if not to_index:
        _save_state(state)
        return 0

    points = [_build_point(a) for a in to_index]
    _upsert(points)

    for a in to_index:
        state[a.id] = a.updated
    _save_state(state)

    print(f"[index] Incremental: {len(points)} activities upserted.")
    return len(points)


def full_index(session) -> int:
    """
    Wipe and rebuild the entire Qdrant collection from scratch.
    Use on first run or after schema changes.
    """
    client = get_client()
    existing = [c.name for c in client.get_collections().collections]
    if settings.qdrant_collection in existing:
        client.delete_collection(settings.qdrant_collection)
        print(f"[index] Dropped collection '{settings.qdrant_collection}'.")

    ensure_collection_exists()

    activities = (
        session.query(Activity)
        .filter(Activity.status == "published")
        .all()
    )

    if not activities:
        print("[index] No published activities found.")
        return 0

    print(f"[index] Full re-index: encoding {len(activities)} activities...")
    points = [_build_point(a) for a in activities]
    _upsert(points)

    _save_state({a.id: a.updated for a in activities})
    print(f"[index] Full index complete — {len(points)} activities indexed.")
    return len(points)


def show_stats(session) -> None:
    ensure_collection_exists()
    total = session.query(Activity).filter(Activity.status == "published").count()
    info  = get_client().get_collection(settings.qdrant_collection)
    state = _load_state()
    print(f"\n{'─' * 40}")
    print(f"  Published activities in DB : {total}")
    print(f"  Vectors in Qdrant          : {info.points_count}")
    print(f"  Tracked in state file      : {len(state)}")
    print(f"  State file                 : {STATE_FILE}")
    print(f"  DB path                    : {settings.sqlite_path}")
    print(f"{'─' * 40}\n")


# ---------------------------------------------------------------------------
# CLI entrypoint
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    from db.database import SessionLocal, engine
    from db.models import Base

    parser = argparse.ArgumentParser(description="Chababia activity indexer")
    parser.add_argument("--full",  action="store_true", help="Full re-index")
    parser.add_argument("--stats", action="store_true", help="Show stats only")
    args = parser.parse_args()

    Base.metadata.create_all(engine)
    session = SessionLocal()
    try:
        if args.stats:
            show_stats(session)
        elif args.full:
            full_index(session)
        else:
            incremental_index(session)
    finally:
        session.close()