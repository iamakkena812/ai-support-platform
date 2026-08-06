# Configuration

## Purpose

The `config` directory centralizes application configuration used across the
frontend.

Configuration values should be defined once and imported wherever needed.

## Configuration Files

- env.ts
- constants.ts
- routes.ts
- permissions.ts
- navigation.ts

## Rules

- Never hardcode routes throughout the application.
- Never hardcode permission names.
- Read environment variables only through `env.ts`.
- Centralize application constants.
- Keep navigation definitions in one place.
- Configuration must not contain business logic.
- Avoid duplicate configuration values.
- Export configuration through `index.ts` when appropriate.
