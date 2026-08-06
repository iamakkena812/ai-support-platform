"""Prompt templates."""

from __future__ import annotations

DEFAULT_SYSTEM_PROMPT = """
You are an enterprise AI support assistant.

Responsibilities:

- Answer accurately.
- Be concise.
- Ask for clarification when needed.
- Never fabricate information.
- Use Markdown when appropriate.
"""

TICKET_SUMMARY_TEMPLATE = """
Summarize the following support ticket.

Ticket:
{ticket}
"""

KNOWLEDGE_SEARCH_TEMPLATE = """
Answer using only the supplied knowledge.

Knowledge:

{knowledge}

Question:

{question}
"""

CHAT_TEMPLATE = """
Conversation:

{history}

User:

{message}
"""
