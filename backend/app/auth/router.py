"""Authentication router."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.auth.dependencies import (
    CurrentActiveUserDependency,
    get_authentication_service,
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
    service: AuthenticationService = Depends(
        get_authentication_service,
    ),
) -> TokenResponse:
    """Authenticate a user."""
    try:
        access_token = service.authenticate(
            request.email,
            request.password,
        )
    except AuthenticationError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials.",
        ) from exc

    return TokenResponse(
        access_token=access_token,
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

        return UserResponse.model_validate(
            user,
        )

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


@router.get(
    "/profile",
    response_model=UserResponse,
)
def profile(
    current_user: CurrentActiveUserDependency,
) -> UserResponse:
    """Return the authenticated user."""
    return UserResponse.model_validate(
        current_user,
    )
