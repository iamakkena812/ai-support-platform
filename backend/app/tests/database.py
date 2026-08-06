"""Shared database utilities for repository tests."""

from __future__ import annotations

from collections.abc import Generator
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.models.base import Base

TEST_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    TEST_DATABASE_URL,
    future=True,
)

TestingSessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
    class_=Session,
)

TEST_DB_FILE = Path("test.db")


def create_database() -> None:
    """Create a fresh database."""
    engine.dispose()

    if TEST_DB_FILE.exists():
        TEST_DB_FILE.unlink()

    Base.metadata.create_all(bind=engine)


def drop_database() -> None:
    """Drop the database."""
    Base.metadata.drop_all(bind=engine)

    engine.dispose()

    if TEST_DB_FILE.exists():
        TEST_DB_FILE.unlink()


def get_db_session() -> Generator[Session]:
    """Yield a database session for tests."""
    session = TestingSessionLocal()

    try:
        yield session
    finally:
        session.close()
