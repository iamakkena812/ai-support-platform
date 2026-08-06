"""TypeDecorator."""

from __future__ import annotations

from typing import cast
from uuid import UUID

from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.engine.interfaces import Dialect
from sqlalchemy.sql.type_api import TypeEngine
from sqlalchemy.types import CHAR, TypeDecorator


class GUID(TypeDecorator[UUID]):
    """Platform-independent GUID type."""

    impl = CHAR
    cache_ok = True

    def load_dialect_impl(
        self,
        dialect: Dialect,
    ) -> TypeEngine[UUID]:
        """Return the dialect-specific implementation."""
        if dialect.name == "postgresql":
            return dialect.type_descriptor(PG_UUID(as_uuid=True))

        return dialect.type_descriptor(
            cast(TypeEngine[UUID], CHAR(36)),
        )

    def process_bind_param(
        self,
        value: UUID | str | None,
        dialect: Dialect,
    ) -> UUID | str | None:
        """Convert Python value before storing."""
        if value is None:
            return None

        if isinstance(value, UUID):
            return value if dialect.name == "postgresql" else str(value)

        uuid_value = UUID(str(value))
        return uuid_value if dialect.name == "postgresql" else str(uuid_value)

    def process_result_value(
        self,
        value: UUID | str | None,
        dialect: Dialect,
    ) -> UUID | None:
        """Convert database value to UUID."""
        del dialect

        if value is None:
            return None

        if isinstance(value, UUID):
            return value

        return UUID(str(value))
