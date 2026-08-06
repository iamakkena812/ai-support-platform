"""Tests for prompt builder."""

from __future__ import annotations

import pytest


class PromptBuilder:
    """Simple prompt builder."""

    @staticmethod
    def build(
        system_prompt: str,
        user_prompt: str,
    ) -> str:
        """Build prompt."""
        return f"{system_prompt}\n\n" f"User:\n{user_prompt}"


def test_prompt_builder() -> None:
    """Prompt builds successfully."""
    prompt = PromptBuilder.build(
        "You are an AI assistant.",
        "Hello!",
    )

    assert "Hello!" in prompt
    assert "assistant" in prompt


@pytest.mark.parametrize(
    ("system", "user"),
    [
        ("System", "Hi"),
        ("Assistant", "Question"),
        ("Bot", "Test"),
    ],
)
def test_prompt_builder_variants(
    system: str,
    user: str,
) -> None:
    """Prompt builder supports multiple inputs."""
    prompt = PromptBuilder.build(system, user)

    assert system in prompt
    assert user in prompt
