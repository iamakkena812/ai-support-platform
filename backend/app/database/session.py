"""Database session management."""

from __future__ import annotations

from collections.abc import Generator

from sqlalchemy.orm import Session

from app.database.engine import SessionLocal


def get_db() -> Generator[Session]:
    """Provide a database session.

    This dependency creates a new SQLAlchemy session for each request
    and guarantees that it is properly closed afterwards.

    Yields:
        Active SQLAlchemy session.
    """
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
