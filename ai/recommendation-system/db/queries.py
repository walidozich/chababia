from __future__ import annotations
from sqlalchemy.orm import Session
from db.models import Activity, Establishment, Category, User, Registration


# ---------------------------------------------------------------------------
# Activities
# ---------------------------------------------------------------------------

def get_published_activities(session: Session) -> list[Activity]:
    """Return all published activities — used by the indexer."""
    return (
        session.query(Activity)
        .filter(Activity.status == "published")
        .all()
    )


def get_activity_by_id(session: Session, activity_id: str) -> Activity | None:
    return session.query(Activity).filter(Activity.id == activity_id).first()


# ---------------------------------------------------------------------------
# Users
# ---------------------------------------------------------------------------

def get_user_by_id(session: Session, user_id: str) -> User | None:
    return session.query(User).filter(User.id == user_id).first()


# ---------------------------------------------------------------------------
# Registrations → past activity history
# ---------------------------------------------------------------------------

def get_user_registered_activities(session: Session, user_id: str) -> list[Activity]:
    """
    Return published activities the user has previously registered for.
    Used to build the 'past behaviour' part of their taste profile.
    Only includes attended or registered statuses — not cancelled ones.
    """
    registered_activity_ids = (
        session.query(Registration.activity_id)
        .filter(
            Registration.user_id == user_id,
            Registration.status.in_(["registered", "attended"]),
        )
        .subquery()
    )

    return (
        session.query(Activity)
        .filter(
            Activity.id.in_(registered_activity_ids),
            Activity.status == "published",
        )
        .all()
    )


# ---------------------------------------------------------------------------
# Categories
# ---------------------------------------------------------------------------

def get_categories(session: Session) -> list[Category]:
    return session.query(Category).filter(Category.status == "active").all()


def get_establishment_by_id(session: Session, establishment_id: str) -> Establishment | None:
    return session.query(Establishment).filter(Establishment.id == establishment_id).first()


# ---------------------------------------------------------------------------
# TEST — run: python -m db.queries
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    from db.database import SessionLocal, engine
    from db.models import Base
    from sqlalchemy import text
    from datetime import datetime, timezone

    print("--- db/queries.py self-test ---")

    Base.metadata.create_all(engine)
    session = SessionLocal()

    session.execute(text("DELETE FROM registrations"))
    session.execute(text("DELETE FROM activities"))
    session.execute(text("DELETE FROM categories"))
    session.execute(text("DELETE FROM users"))
    session.commit()

    now = datetime.now(timezone.utc)

    # Seed
    session.add(Category(id="cat_sports", name="Sports", status="active"))
    session.add(User(
        id="user_1",
        full_name="Yacine",
        commune="Akbou",
        wilaya="Bejaia",
        interests="Sports,Environment",
    ))
    session.add_all([
        Activity(id="act_1", title="Football Tournament", short_description="Youth football.", category_id="cat_sports", commune="Akbou", activity_mode="physical", status="published", last_verified_at=now),
        Activity(id="act_2", title="Basketball League",   short_description="Youth basketball.", category_id="cat_sports", commune="Akbou", activity_mode="physical", status="published", last_verified_at=now),
    ])
    session.commit()

    session.add_all([
        Registration(id="reg_1", user_id="user_1", activity_id="act_1", status="attended"),
        Registration(id="reg_2", user_id="user_1", activity_id="act_2", status="cancelled"),  # should be excluded
    ])
    session.commit()

    # Test get_published_activities
    acts = get_published_activities(session)
    assert len(acts) == 2
    print("✓ get_published_activities — OK")

    # Test get_user_by_id
    user = get_user_by_id(session, "user_1")
    assert user.full_name == "Yacine"
    assert user.commune == "Akbou"
    print("✓ get_user_by_id — OK")

    # Test get_user_registered_activities — only attended/registered, not cancelled
    history = get_user_registered_activities(session, "user_1")
    assert len(history) == 1
    assert history[0].id == "act_1"
    print("✓ get_user_registered_activities — excludes cancelled registrations")

    # Unknown user returns nothing
    no_history = get_user_registered_activities(session, "ghost_user")
    assert no_history == []
    print("✓ get_user_registered_activities — empty for unknown user")

    session.close()
    print("--- all query tests passed ---")