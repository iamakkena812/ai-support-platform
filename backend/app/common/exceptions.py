"""Application exception handlers."""

from __future__ import annotations

import logging
from collections.abc import Awaitable, Callable
from typing import cast

from app.common.responses import ErrorResponse
from app.core.exceptions import AppException
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse, Response
from starlette.status import HTTP_500_INTERNAL_SERVER_ERROR

logger = logging.getLogger(__name__)


ExceptionHandler = Callable[
    [Request, Exception],
    Awaitable[Response],
]


async def app_exception_handler(
    request: Request,
    exc: AppException,
) -> JSONResponse:
    """Handle application exceptions."""
    logger.warning(
        "%s %s - %s",
        request.method,
        request.url.path,
        exc.message,
    )

    response = ErrorResponse(
        message=exc.message,
        error_code=exc.__class__.__name__,
    )

    return JSONResponse(
        status_code=exc.status_code,
        content=response.model_dump(mode="json"),
    )


async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    """Handle request validation errors."""
    logger.warning(
        "%s %s - Request validation failed.",
        request.method,
        request.url.path,
    )

    response = ErrorResponse(
        message="Request validation failed.",
        error_code="REQUEST_VALIDATION_ERROR",
        details={"errors": exc.errors()},
    )

    return JSONResponse(
        status_code=422,
        content=response.model_dump(mode="json"),
    )


async def unhandled_exception_handler(
    request: Request,
    exc: Exception,
) -> JSONResponse:
    """Handle unexpected exceptions."""
    logger.exception(
        "%s %s - Unhandled exception.",
        request.method,
        request.url.path,
        exc_info=exc,
    )

    response = ErrorResponse(
        message="An unexpected error occurred.",
        error_code="INTERNAL_SERVER_ERROR",
    )

    return JSONResponse(
        status_code=HTTP_500_INTERNAL_SERVER_ERROR,
        content=response.model_dump(mode="json"),
    )


def register_exception_handlers(app: FastAPI) -> None:
    """Register all application exception handlers."""
    app.add_exception_handler(
        AppException,
        cast(ExceptionHandler, app_exception_handler),
    )

    app.add_exception_handler(
        RequestValidationError,
        cast(ExceptionHandler, validation_exception_handler),
    )

    app.add_exception_handler(
        Exception,
        cast(ExceptionHandler, unhandled_exception_handler),
    )
