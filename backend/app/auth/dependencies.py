"""Authentication dependencies."""

from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.auth.jwt import decode_access_token
from app.auth.service import AuthenticationService
from app.database import get_db
from app.models.user import User
from app.repositories.user import UserRepository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """Return the authenticated user.

    Args:
        token: JWT access token supplied by the client.
        db: Database session.

    Returns:
        The authenticated user.

    Raises:
        HTTPException: If the token is invalid, the user does not exist,
            or authentication fails.
    """
    try:
        payload = decode_access_token(token)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials.",
        ) from exc

    user_id = UUID(payload["sub"])

    repository = UserRepository(db)
    user = repository.get_by_id(user_id)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found.",
        )

    return user


CurrentActiveUserDependency = Annotated[
    User,
    Depends(get_current_user),
]


def get_authentication_service(
    db: Session = Depends(get_db),
) -> AuthenticationService:
    """Return an authentication service instance.

    Args:
        db: Database session.

    Returns:
        Configured authentication service.
    """
    repository = UserRepository(db)
    return AuthenticationService(repository)


def get_current_superuser(
    current_user: CurrentActiveUserDependency,
) -> User:
    """Return the authenticated superuser.

    Args:
        current_user: Currently authenticated user.

    Returns:
        The authenticated superuser.

    Raises:
        HTTPException: If the authenticated user is not a superuser.
    """
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Superuser privileges required.",
        )

    return current_user


CurrentSuperuserDependency = Annotated[
    User,
    Depends(get_current_superuser),
]

__all__ = [
    "oauth2_scheme",
    "get_current_user",
    "get_current_superuser",
    "get_authentication_service",
    "CurrentActiveUserDependency",
    "CurrentSuperuserDependency",
]
