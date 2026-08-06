
---

# 3. CONTRIBUTING.md

````markdown
# Contributing Guide

## Coding Standards

- Use TypeScript only.
- Do not use `any`.
- Keep components reusable.
- Keep features isolated.
- Follow Feature-First architecture.

---

## Naming

Components

PascalCase.tsx

Hooks

useSomething.ts

Stores

*.store.ts

Types

*.types.ts

Schemas

*.schema.ts

---

## Folder Rules

Business logic belongs inside Features.

Shared logic belongs inside Lib.

Shared UI belongs inside Components.

Configuration belongs inside Config.

---

## Pull Requests

Every feature should include

- TypeScript passes
- ESLint passes
- Prettier passes
- Tests (when applicable)

---

## Quality First

Never merge code with lint or TypeScript errors.
