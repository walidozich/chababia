from __future__ import annotations
from typing import Optional
from sqlalchemy.orm import Session
from db.models import Activity, Establishment, Category, User, Registration


def get_published_activities(session: Session) -> list[Activity]:
    """Return all published activities — used by the indexer."""
    return session.query(Activity).filter(Activity.status == "published").all()


def get_activity_by_id(session: Session, activity_id: str) -> Optional[Activity]:
    return session.query(Activity).filter(Activity.id == activity_id).first()


def get_user_by_id(session: Session, user_id: str) -> Optional[User]:
    return session.query(User).filter(User.id == user_id).first()


def get_user_registered_activities(session: Session, user_id: str) -> list[Activity]:
    """
    Return published activities the user has registered for or attended.
    Cancelled and waiting_list registrations are excluded.
    """
    registered_ids = (
        session.query(Registration.activity)
        .filter(
            Registration.user == user_id,
            Registration.status.in_(["registered", "attended"]),
        )
        .scalar_subquery()
    )
    return (
        session.query(Activity)
        .filter(Activity.id.in_(registered_ids), Activity.status == "published")
        .all()
    )


def get_categories(session: Session) -> list[Category]:
    return session.query(Category).filter(Category.status == "active").all()


def get_establishment_by_id(session: Session, est_id: str) -> Optional[Establishment]:
    return session.query(Establishment).filter(Establishment.id == est_id).first()


# ---------------------------------------------------------------------------
# TEST — run: python -m db.queries
# ---------------------------------------------------------------------------
# if __name__ == "__main__":
#     from db.database import SessionLocal, engine
#     from db.models import Base
#     from sqlalchemy import text

#     print("--- db/queries.py self-test ---")
#     Base.metadata.create_all(engine)
#     session = SessionLocal()

#     for tbl in ["registrations", "activities", "categories", "users"]:
#         session.execute(text(f"DELETE FROM {tbl}"))
#     session.commit()

#     # interests is JSON — pass a Python list, SQLAlchemy serialises it
#     session.add(Category(id="cat_sports", name="Sports", status="active"))
#     session.add(User(
#         id="user_1", full_name="Yacine", email="yacine@test.dz",
#         commune="Akbou", wilaya="Bejaia", role="youth",
#         interests=["Sports", "Environment"],
#     ))
#     session.add_all([
#         Activity(id="act_1", title="Football Tournament", short_description="Youth football.",
#                  category="cat_sports", commune="Akbou", wilaya="Bejaia",
#                  activity_mode="physical", status="published",
#                  start_datetime="2026-07-01 09:00:00.000Z"),
#         Activity(id="act_2", title="Basketball League", short_description="Youth basketball.",
#                  category="cat_sports", commune="Akbou", wilaya="Bejaia",
#                  activity_mode="physical", status="published",
#                  start_datetime="2026-07-05 09:00:00.000Z"),
#     ])
#     session.commit()

#     session.add_all([
#         Registration(id="reg_1", user="user_1", activity="act_1",
#                      full_name="Yacine", status="attended"),
#         Registration(id="reg_2", user="user_1", activity="act_2",
#                      full_name="Yacine", status="cancelled"),
#     ])
#     session.commit()

#     acts = get_published_activities(session)
#     assert len(acts) == 2
#     print("✓ get_published_activities — OK")

#     user = get_user_by_id(session, "user_1")
#     assert user is not None and user.full_name == "Yacine"
#     # interests is returned as a Python list (JSON column)
#     assert isinstance(user.interests, list)
#     assert "Sports" in user.interests
#     print(f"✓ get_user_by_id — interests={user.interests}")

#     history = get_user_registered_activities(session, "user_1")
#     assert len(history) == 1 and history[0].id == "act_1"
#     print("✓ get_user_registered_activities — cancelled excluded")

#     assert get_user_registered_activities(session, "nobody") == []
#     print("✓ get_user_registered_activities — empty for unknown user")

#     session.close()
#     print("--- all query tests passed ---")