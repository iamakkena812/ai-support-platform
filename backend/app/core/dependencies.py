"""Shared FastAPI dependencies."""

from __future__ import annotations

import logging
from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.config.logging import get_logger
from app.config.settings import Settings, settings
from app.database.session import get_db


def get_settings() -> Settings:
    """Return the application settings.

    Returns:
        Singleton application settings.
    """
    return settings


def get_application_logger() -> logging.Logger:
    """Return the application logger.

    Returns:
        Configured logger instance.
    """
    return get_logger("app")


SettingsDependency = Annotated[
    Settings,
    Depends(get_settings),
]

DatabaseDependency = Annotated[
    Session,
    Depends(get_db),
]
