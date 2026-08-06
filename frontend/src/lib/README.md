
---

# `src/lib/README.md`

````markdown
# Lib

## Purpose

The `lib` directory contains shared infrastructure utilities used throughout
the application.

These modules provide foundational services that are not tied to a specific
business feature.

## Examples

- Axios client
- Query Client
- Authentication helpers
- Local storage utilities
- Logging utilities

## Rules

- No UI components.
- No feature-specific logic.
- Keep utilities framework-independent where possible.
- Export shared helpers through `index.ts`.
- Avoid circular dependencies.
- Keep modules focused on a single responsibility.
- All utilities should be fully typed.
- Infrastructure code belongs here, not inside features.
