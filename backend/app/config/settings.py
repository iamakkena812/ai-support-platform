"""Application configuration settings."""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

INSECURE_JWT_SECRET_KEYS = frozenset({"CHANGE_ME", ""})
MIN_JWT_SECRET_KEY_LENGTH = 32

# Anchored to backend/.env regardless of the process's current working
# directory. `env_file=".env"` alone is resolved relative to the CWD at
# launch time, so running uvicorn from the repo root vs. from backend/
# would silently load two different files with different values
# (including different DATABASE_URL targets). Actual environment
# variables (e.g. those injected by Docker/Render) still take
# precedence over this file either way.
BACKEND_ENV_FILE = Path(__file__).resolve().parents[2] / ".env"


class Settings(BaseSettings):
    """Application settings."""

    model_config = SettingsConfigDict(
        env_file=BACKEND_ENV_FILE,
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # -------------------------------------------------------------------------
    # Application
    # -------------------------------------------------------------------------

    APP_NAME: str = Field(
        default="Enterprise AI Support Platform",
    )

    APP_DESCRIPTION: str = Field(
        default="Enterprise AI-powered customer support platform.",
    )

    APP_VERSION: str = Field(
        default="1.0.0",
    )

    APP_ENV: str = Field(
        default="development",
    )

    DEBUG: bool = Field(
        default=True,
    )

    # -------------------------------------------------------------------------
    # Server
    # -------------------------------------------------------------------------

    HOST: str = Field(
        default="0.0.0.0",
    )

    PORT: int = Field(
        default=8000,
        ge=1,
        le=65535,
    )

    # -------------------------------------------------------------------------
    # Database
    # -------------------------------------------------------------------------

    DATABASE_URL: str = Field(
        default="postgresql+psycopg://support:support@localhost:5432/support_db",
    )

    # -------------------------------------------------------------------------
    # Redis
    # -------------------------------------------------------------------------

    REDIS_URL: str = Field(
        default="redis://localhost:6379/0",
    )

    # -------------------------------------------------------------------------
    # JWT
    # -------------------------------------------------------------------------

    JWT_SECRET_KEY: str = Field(
        default="CHANGE_ME",
    )

    JWT_ALGORITHM: str = Field(
        default="HS256",
    )

    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=30,
        ge=1,
    )
    # -------------------------------------------------------------------------
    # AI Providers
    # -------------------------------------------------------------------------

    # OpenAI
    OPENAI_API_KEY: str = Field(
        default="",
    )

    OPENAI_ORGANIZATION: str = Field(
        default="",
    )

    OPENAI_PROJECT: str = Field(
        default="",
    )

    OPENAI_BASE_URL: str = Field(
        default="https://api.openai.com/v1",
    )

    OPENAI_TIMEOUT: int = Field(
        default=60,
        ge=1,
    )

    # Anthropic

    ANTHROPIC_API_KEY: str = ""
    ANTHROPIC_BASE_URL: str = "https://api.anthropic.com"
    ANTHROPIC_TIMEOUT: int = 60

    # Google Gemini

    GEMINI_API_KEY: str = Field(
        default="",
    )

    GEMINI_BASE_URL: str = Field(
        default="https://generativelanguage.googleapis.com",
    )

    # Groq

    GROQ_API_KEY: str = Field(
        default="",
    )

    GROQ_BASE_URL: str = Field(
        default="https://api.groq.com/openai/v1",
    )

    # Ollama

    OLLAMA_BASE_URL: str = Field(
        default="http://localhost:11434",
    )

    # Azure OpenAI

    AZURE_OPENAI_API_KEY: str = Field(
        default="",
    )

    AZURE_OPENAI_ENDPOINT: str = Field(
        default="",
    )

    AZURE_OPENAI_API_VERSION: str = Field(
        default="2025-01-01-preview",
    )

    # -------------------------------------------------------------------------
    # Logging
    # -------------------------------------------------------------------------

    LOG_LEVEL: str = Field(
        default="INFO",
    )

    # -------------------------------------------------------------------------
    # Storage
    # -------------------------------------------------------------------------

    STORAGE_PATH: str = Field(
        default="storage",
    )

    UPLOAD_PATH: str = Field(
        default="storage/uploads",
    )

    VECTOR_DB_PATH: str = Field(
        default="storage/vector_db",
    )

    @model_validator(mode="after")
    def _validate_jwt_secret_key(self) -> Settings:
        """Reject an insecure JWT secret key outside of debug mode.

        Raises:
            ValueError: If DEBUG is False and JWT_SECRET_KEY is missing,
                a known placeholder, or too short to be a real secret.
        """
        if self.DEBUG:
            return self

        if self.JWT_SECRET_KEY in INSECURE_JWT_SECRET_KEYS:
            raise ValueError(
                "JWT_SECRET_KEY must be set to a real secret when DEBUG "
                "is False; refusing to start with the placeholder value.",
            )

        if len(self.JWT_SECRET_KEY) < MIN_JWT_SECRET_KEY_LENGTH:
            raise ValueError(
                "JWT_SECRET_KEY must be at least "
                f"{MIN_JWT_SECRET_KEY_LENGTH} characters when DEBUG is "
                "False.",
            )

        return self


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return cached application settings.

    Returns:
        Singleton Settings instance.
    """
    return Settings()


settings = get_settings()
