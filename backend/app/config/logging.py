"""Application logging configuration."""

from __future__ import annotations

import logging
import logging.config
from typing import Any

# ...
from app.config.settings import settings

LOGGING_CONFIG: dict[str, Any] = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": ("%(asctime)s | %(levelname)-8s | " "%(name)s | %(message)s"),
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "default",
            "level": settings.LOG_LEVEL,
        },
    },
    "root": {
        "handlers": ["console"],
        "level": settings.LOG_LEVEL,
    },
}


def configure_logging() -> None:
    """Configure the application logging system."""
    logging.config.dictConfig(LOGGING_CONFIG)


def get_logger(name: str) -> logging.Logger:
    """Return a configured logger.

    Args:
        name: Logger name.

    Returns:
        Configured logger instance.
    """
    return logging.getLogger(name)
