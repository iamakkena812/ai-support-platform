"""FastAPI routes for file management."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Query, Response, status

from app.auth.dependencies import CurrentActiveUserDependency
from app.files.constants import FileProvider, FileStatus
from app.files.dependencies import FileServiceDependency
from app.files.models import File
from app.files.schemas import (
    FileCreate,
    FileListResponse,
    FileResponse,
    FileSearchParams,
    FileUpdate,
)


def to_file_response(
    file: File,
) -> FileResponse:
    """Convert File model to API response."""
    data = {key: value for key, value in vars(file).items() if not key.startswith("_")}

    return FileResponse.model_validate(data)


router = APIRouter(
    prefix="/files",
    tags=["Files"],
)


@router.post(
    "",
    response_model=FileResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_file(
    request: FileCreate,
    current_user: CurrentActiveUserDependency,
    service: FileServiceDependency,
) -> FileResponse:
    """Create a file."""
    file = service.create(
        organization_id=current_user.organization_id,
        uploaded_by_id=current_user.id,
        request=request,
    )

    return to_file_response(file)


@router.get(
    "",
    response_model=FileListResponse,
)
def list_files(
    service: FileServiceDependency,
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=100),
) -> FileListResponse:
    """List files."""
    total, items = service.list_files(
        offset=offset,
        limit=limit,
    )

    return FileListResponse(
        total=total,
        items=[to_file_response(file) for file in items],
    )


@router.get(
    "/search",
    response_model=list[FileResponse],
)
def search_files(
    service: FileServiceDependency,
    filename: str | None = None,
    provider: FileProvider | None = None,
    status: FileStatus | None = None,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=100),
) -> list[FileResponse]:
    """Search files."""
    request = FileSearchParams(
        filename=filename,
        provider=provider,
        status=status,
        skip=skip,
        limit=limit,
    )

    files = service.search(request)

    return [to_file_response(file) for file in files]


@router.get(
    "/{file_id}",
    response_model=FileResponse,
)
def get_file(
    file_id: UUID,
    service: FileServiceDependency,
) -> FileResponse:
    """Retrieve a file."""
    file = service.get(file_id)

    return to_file_response(file)


@router.patch(
    "/{file_id}",
    response_model=FileResponse,
)
def update_file(
    file_id: UUID,
    request: FileUpdate,
    service: FileServiceDependency,
) -> FileResponse:
    """Update a file."""
    file = service.update(
        file_id=file_id,
        request=request,
    )

    return to_file_response(file)


@router.delete(
    "/{file_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_file(
    file_id: UUID,
    service: FileServiceDependency,
) -> Response:
    """Delete a file."""
    service.delete(file_id)

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )
