"""FastAPI routes for email management."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Query, Response, status

from app.auth.dependencies import CurrentActiveUserDependency
from app.email.constants import EmailStatus
from app.email.dependencies import EmailServiceDep
from app.email.models import Email
from app.email.schemas import (
    EmailCancelRequest,
    EmailCreate,
    EmailListResponse,
    EmailResponse,
    EmailRetryRequest,
    EmailSearchParams,
    EmailUpdate,
)


def to_email_response(
    email: Email,
) -> EmailResponse:
    """Convert Email model to API response."""
    data = {key: value for key, value in vars(email).items() if not key.startswith("_")}

    data["cc"] = email.cc.split(",") if email.cc else []
    data["bcc"] = email.bcc.split(",") if email.bcc else []

    return EmailResponse.model_validate(data)


router = APIRouter(
    prefix="/emails",
    tags=["Emails"],
)


@router.post(
    "",
    response_model=EmailResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_email(
    request: EmailCreate,
    current_user: CurrentActiveUserDependency,
    service: EmailServiceDep,
) -> EmailResponse:
    """Create an email."""
    email = service.create(
        organization_id=current_user.organization_id,
        sender_id=current_user.id,
        request=request,
    )

    return to_email_response(email)


@router.get(
    "",
    response_model=EmailListResponse,
)
def list_emails(
    service: EmailServiceDep,
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=100),
) -> EmailListResponse:
    """List emails."""
    total, items = service.list_emails(
        offset=offset,
        limit=limit,
    )

    return EmailListResponse(
        total=total,
        items=[to_email_response(email) for email in items],
    )


@router.get(
    "/search",
    response_model=list[EmailResponse],
)
def search_emails(
    service: EmailServiceDep,
    recipient: str | None = None,
    status: EmailStatus | None = None,
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=100),
) -> list[EmailResponse]:
    """Search emails."""
    request = EmailSearchParams(
        recipient=recipient,
        status=status,
        offset=offset,
        limit=limit,
    )

    emails = service.search(request)

    return [to_email_response(email) for email in emails]


@router.get(
    "/{email_id}",
    response_model=EmailResponse,
)
def get_email(
    email_id: UUID,
    service: EmailServiceDep,
) -> EmailResponse:
    """Retrieve an email."""
    email = service.get(email_id)
    return to_email_response(email)


@router.patch(
    "/{email_id}",
    response_model=EmailResponse,
)
def update_email(
    email_id: UUID,
    request: EmailUpdate,
    service: EmailServiceDep,
) -> EmailResponse:
    """Update an email."""
    email = service.update(
        email_id=email_id,
        request=request,
    )

    return to_email_response(email)


@router.post(
    "/{email_id}/send",
    response_model=EmailResponse,
)
def send_email(
    email_id: UUID,
    service: EmailServiceDep,
) -> EmailResponse:
    """Send an email."""
    email = service.send(email_id)
    return to_email_response(email)


@router.post(
    "/{email_id}/retry",
    response_model=EmailResponse,
)
def retry_email(
    email_id: UUID,
    request: EmailRetryRequest,
    service: EmailServiceDep,
) -> EmailResponse:
    """Retry an email."""
    email = service.retry(email_id) if request.retry else service.get(email_id)

    return to_email_response(email)


@router.post(
    "/{email_id}/cancel",
    response_model=EmailResponse,
)
def cancel_email(
    email_id: UUID,
    request: EmailCancelRequest,
    service: EmailServiceDep,
) -> EmailResponse:
    """Cancel an email."""
    email = service.cancel(email_id) if request.cancel else service.get(email_id)

    return to_email_response(email)


@router.delete(
    "/{email_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_email(
    email_id: UUID,
    service: EmailServiceDep,
) -> Response:
    """Delete an email."""
    service.delete(email_id)
    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )
