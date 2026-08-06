"""Repository providers for AI."""

from __future__ import annotations

from sqlalchemy.orm import Session

from app.ai.constants import (
    DEFAULT_MAX_TOKENS,
    DEFAULT_TEMPERATURE,
    DEFAULT_TIMEOUT_SECONDS,
    AIModel,
    AIProvider,
)
from app.ai.schemas import AIConfiguration


class AIRepository:
    """Repository for AI configuration and persistence."""

    def __init__(
        self,
        db: Session,
    ) -> None:
        """Initialize repository."""
        self._db = db

    def get_configuration(self) -> AIConfiguration:
        """Return the default AI configuration.

        This implementation returns static defaults.
        Future versions can load configuration from the database.
        """
        return AIConfiguration(
            default_provider=AIProvider.OPENAI,
            default_model=AIModel.GPT_4_1,
            temperature=DEFAULT_TEMPERATURE,
            max_tokens=DEFAULT_MAX_TOKENS,
            timeout_seconds=DEFAULT_TIMEOUT_SECONDS,
        )

    def health(self) -> bool:
        """Return repository health."""
        return True
