"""Dependency Tests Module."""

from __future__ import annotations

import pytest
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.auth.jwt import create_access_token
from app.models.user import User


def test_get_current_user_success(
    db_session: Session,
    user: User,
) -> None:
    """Test retrieving the current authenticated user."""
    token = create_access_token(str(user.id))
    current_user = get_current_user(
        token=token,
        db=db_session,
    )

    assert current_user.id == user.id


def test_invalid_token(
    db_session: Session,
) -> None:
    """Test that an invalid token raises an HTTP exception."""
    with pytest.raises(HTTPException):
        get_current_user(
            token="invalid-token",
            db=db_session,
        )
