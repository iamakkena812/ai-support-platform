"""Shared Pydantic base schemas."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict


def to_camel(string: str) -> str:
    """Convert a snake_case string to camelCase.

    Args:
        string: Snake_case field name.

    Returns:
        Equivalent camelCase name.
    """
    first, *rest = string.split("_")
    return first + "".join(word.capitalize() for word in rest)


class CamelModel(BaseModel):
    """Base model that serializes/accepts camelCase JSON.

    The rest of the codebase (models, services, repositories) stays in
    Python's snake_case convention; this only affects the JSON boundary
    so it matches the camelCase the frontend TypeScript types expect.
    `populate_by_name=True` means snake_case still works for input too,
    so constructing these models from Python code is unaffected.
    """

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )


__all__ = ["CamelModel", "to_camel"]
