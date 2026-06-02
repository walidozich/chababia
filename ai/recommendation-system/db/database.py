# SQLAlchemy engine + session setup

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from config import settings


engine = create_engine(
    f"sqlite:///{settings.sqlite_path}",
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


def get_session():
    """FastAPI dependency — yields a DB session and closes it after the request."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()