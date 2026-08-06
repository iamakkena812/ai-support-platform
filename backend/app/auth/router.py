"""Authentication router."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.auth.dependencies import (
    get_authentication_service,
    get_current_user,
)
from app.auth.schemas import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
)
from app.auth.service import (
    AuthenticationError,
    AuthenticationService,
    EmailAlreadyExistsError,
    UsernameAlreadyExistsError,
)
from app.models.user import User
from app.users.schemas import UserResponse

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    request: LoginRequest,
    service: AuthenticationService = Depends(get_authentication_service),
) -> TokenResponse:
    """Authenticate a user."""
    try:
        token = service.authenticate(
            request.email,
            request.password,
        )
    except AuthenticationError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials.",
        ) from exc

    return TokenResponse(
        access_token=token,
    )


@router.get(
    "/me",
    response_model=UserResponse,
)
def me(
    current_user: User = Depends(get_current_user),
) -> UserResponse:
    """Return the authenticated user."""
    return UserResponse.model_validate(
        current_user,
    )


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    request: RegisterRequest,
    service: AuthenticationService = Depends(
        get_authentication_service,
    ),
) -> UserResponse:
    """Register a new user."""
    try:
        user = service.register(
            email=request.email,
            username=request.username,
            password=request.password,
            full_name=request.full_name,
            organization_id=request.organization_id,
        )

        return UserResponse.model_validate(user)

    except (
        EmailAlreadyExistsError,
        UsernameAlreadyExistsError,
    ) as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc


@router.post(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
)
def logout() -> None:
    """Logout the current user."""
    return None
