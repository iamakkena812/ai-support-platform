"""Application lifecycle management."""

from __future__ import annotations

from collections.abc import Awaitable, Callable

from fastapi import FastAPI
from sqlalchemy import text

from app.config.logging import get_logger
from app.config.settings import settings
from app.database.engine import engine

logger = get_logger(__name__)


async def startup(app: FastAPI) -> None:
    """Execute application startup tasks."""
    logger.info("Starting %s...", settings.APP_NAME)

    app.state.settings = settings

    startup_tasks = getattr(app.state, "startup_tasks", [])

    for task in startup_tasks:
        await task()

    logger.info("Application environment: %s", settings.APP_ENV)
    logger.info("Debug mode: %s", settings.DEBUG)
    logger.info("Startup completed successfully.")


async def shutdown(app: FastAPI) -> None:
    """Execute application shutdown tasks."""
    shutdown_tasks = getattr(app.state, "shutdown_tasks", [])

    for task in shutdown_tasks:
        await task()

    logger.info("Shutting down %s...", settings.APP_NAME)
    logger.info("Shutdown completed successfully.")


def register_startup_task(
    app: FastAPI,
    task: Callable[[], Awaitable[None]],
) -> None:
    """Register a startup task.

    Args:
        app: FastAPI application instance.
        task: Async startup task.
    """
    tasks: list[Callable[[], Awaitable[None]]] = getattr(
        app.state,
        "startup_tasks",
        [],
    )
    tasks.append(task)
    app.state.startup_tasks = tasks


def register_shutdown_task(
    app: FastAPI,
    task: Callable[[], Awaitable[None]],
) -> None:
    """Register a shutdown task.

    Args:
        app: FastAPI application instance.
        task: Async shutdown task.
    """
    tasks: list[Callable[[], Awaitable[None]]] = getattr(
        app.state,
        "shutdown_tasks",
        [],
    )
    tasks.append(task)
    app.state.shutdown_tasks = tasks


def check_database_connection() -> None:
    """Verify database connectivity."""
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
