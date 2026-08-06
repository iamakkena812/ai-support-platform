# Production Readiness Backlog

**Enterprise AI Support Platform — Backend**
Source: findings verified and recorded in `docs/ARCHITECTURE.pdf` (Architecture & Technical Design Document, v1.0 — Architecture Locked)
Status: Engineering backlog only. **No code has been changed to produce this document.**

This backlog exists to separate *documentation of what was found* (the architecture document) from
*decisions about what to do about it* (this document). Each item below traces back to a specific,
source-verified finding — nothing here is speculative.

---

## How to read this document

| Field | Meaning |
|---|---|
| **Description** | What the finding is, stated precisely. |
| **Why it matters** | The concrete consequence of leaving it as-is. |
| **Recommended fix** | The smallest change that resolves it correctly. |
| **Estimated effort** | Rough sizing: **S** (&lt; 1 day), **M** (1&ndash;3 days), **L** (3&ndash;7 days), **XL** (&gt; 1 week / needs its own design pass). |
| **Recommended milestone** | See milestone key below. |

**Milestone key:**
- **v1.1 — Security & Deployment Hardening**: must close before any production traffic.
- **v1.2 — AI Pipeline Completion**: closes the gap between the AI platform's advertised and actual capability.
- **v1.3 — Platform Completeness**: finishes partially-implemented business functionality.
- **v1.4 — Observability & Delivery**: CI/CD and monitoring, once the above are stable.
- **Backlog**: worth doing, not blocking any near-term milestone.

---

## Critical

Items in this section pose a direct security, data-loss, or deployment-blocking risk. **None of these should be
considered optional before production traffic.**

### C-1. Live JWT secret is hardcoded and ignores configuration

- **Description**: Two independent JWT modules exist. `app/config/security.py` correctly reads its secret,
  algorithm, and expiry from `Settings`/`.env`, but nothing in the live authentication path calls it. The module
  actually used by `app/auth/service.py` and `app/auth/dependencies.py` — `app/auth/jwt.py` — hardcodes its own
  constants, including `SECRET_KEY = "your-secret-key-change-in-production"`. Setting `JWT_SECRET_KEY` in `.env`
  currently has no effect on tokens issued or verified.
- **Why it matters**: Every deployment of this codebase, in every environment, signs and verifies tokens with the
  same publicly-visible, source-controlled secret. Anyone with read access to the repository can forge a valid
  access token for any user ID. This is a full authentication bypass, not a theoretical weakness.
- **Recommended fix**: Delete `app/auth/jwt.py`'s hardcoded constants; have it delegate to (or be replaced by)
  `app/config/security.py`, which is already correctly wired to `Settings`. Rotate `JWT_SECRET_KEY` to a real
  secret in every environment once this is fixed, since any tokens signed under the old hardcoded key must be
  considered compromised.
- **Estimated effort**: S
- **Recommended milestone**: v1.1

### C-2. Organization (tenant) isolation is not systemically enforced

- **Description**: `get_current_user` does not filter or scope anything by `organization_id`. Every module that
  must stay within a tenant boundary does so only because that module's repository/service happens to filter by
  `current_user.organization_id` explicitly — there is no dependency, middleware, or base-repository mechanism
  that enforces this automatically. `RBACService.assign_role` is a confirmed example of a module that does check
  correctly; other modules have not been individually audited for the same discipline.
- **Why it matters**: A single missed filter in any one repository method is a cross-tenant data leak — one
  organization's customer being able to read or modify another organization's tickets, users, or files. This is
  the single highest-impact risk category for a multi-tenant SaaS platform and cannot be caught by a spot-check;
  it requires either structural enforcement or an exhaustive audit.
- **Recommended fix**: Preferred: add organization-scoping at the repository or dependency layer (e.g. a base
  repository that automatically injects an organization filter, or a request-scoped "current organization"
  dependency that every scoped query must go through) so a new module cannot forget the check. Minimum
  acceptable interim: a full manual audit of every repository method against every module for correct
  `organization_id` filtering, tracked to completion before production traffic.
- **Estimated effort**: L (audit) / XL (structural enforcement)
- **Recommended milestone**: v1.1

### C-3. No committed database migrations — schema exists only via `create_all()`

- **Description**: The Alembic environment (`app/database/migrations/env.py`) is fully and correctly configured,
  but no `versions/` directory or `alembic.ini` exists anywhere in the repository. Every environment, including
  the test suite, produces its schema via `Base.metadata.create_all()`, not a migration history.
- **Why it matters**: There is no way to safely evolve the production schema after the first deployment —
  `create_all()` only creates missing tables, it does not alter existing ones. The first schema change after
  go-live (a new column, a new index, a new constraint) has no defined, reviewable, reversible path to
  production. This blocks any real production operation, not just the initial launch.
- **Recommended fix**: Run `alembic revision --autogenerate` against the current `Base.metadata` to generate and
  commit an initial migration, verify it produces an identical schema to `create_all()`, and adopt "every schema
  change ships with a migration" as a hard rule from that point forward.
- **Estimated effort**: M
- **Recommended milestone**: v1.1

### C-4. Uploaded files are not actually persisted anywhere

- **Description**: `files.FileService.create()` delegates physical storage to an injected `BaseStorageProvider`.
  The only implementation, `LocalStorageProvider`, is a stub — its `save()`/`delete()` methods return a
  `StorageResult` without writing any bytes to disk or any other backing store. The service also force-sets
  `status=ACTIVE` immediately on creation, regardless of whether storage succeeded.
- **Why it matters**: Every call to `POST /api/v1/files` (and the `attachments` module, which shares this
  pattern) currently reports success and returns an "active" file record for content that was never actually
  stored. Any client relying on later retrieving that file's bytes will fail silently until this is discovered
  in production. This is a data-loss bug disguised as a working feature.
- **Recommended fix**: Implement `LocalStorageProvider.save()`/`delete()` to actually write to
  `Settings.STORAGE_PATH`/`UPLOAD_PATH` (or select and implement a real provider — S3/Azure Blob/GCS — if local
  disk storage is not the intended production backend). Only set `status=ACTIVE` after storage genuinely
  succeeds; keep `PENDING`/`FAILED` as real, reachable states rather than modeled-but-unused ones.
- **Estimated effort**: M
- **Recommended milestone**: v1.1

### C-5. `docker-compose.yml` references a `Dockerfile` that does not exist

- **Description**: The repo-root `docker-compose.yml` defines a `backend` service with
  `build: {context: ., dockerfile: Dockerfile}`, but no `Dockerfile` exists anywhere in the repository (checked
  both the repo root and `backend/`).
- **Why it matters**: The only documented deployment path for this platform (`docker compose up --build`)
  fails immediately, on the first command. There is currently no way to run this application in a
  containerized environment at all.
- **Recommended fix**: Author a `Dockerfile` for the `backend` service (multi-stage build: install
  `pyproject.toml` dependencies, copy `app/`, run under `uvicorn`), and verify `docker compose up --build`
  succeeds end-to-end against the `postgres`/`redis` services already defined.
- **Estimated effort**: S
- **Recommended milestone**: v1.1

---

## High

Items in this section are serious functional or security gaps that should close before the platform is presented
as feature-complete, but do not by themselves make an early-access or internal deployment unsafe the way the
Critical items do.

### H-1. RBAC permission checks are adopted on only 4 of 21 mounted routers

- **Description**: `require_permission(resource, action)` is fully implemented and correctly checks the
  Permission/Role/RolePermission/UserRole model, but it is used as a router guard in only four places:
  `tickets`, `notifications`, `users`, and `rbac`'s own internals. The remaining 17 routers rely on a bare
  active-user check (`CurrentActiveUserDependency`) or, in several modules (`projects`, `audit`, `analytics`,
  `sla`, `workflows`, and most of `files`/`email`), no authentication dependency at all.
- **Why it matters**: Any authenticated user — regardless of role — can currently read and, in several modules,
  write records they should not have permission for (e.g. any user can hit `POST /api/v1/sla/policies` or
  `DELETE /api/v1/workflows/{id}`). The permission system exists and works; it just isn't guarding most of the
  surface it should.
- **Recommended fix**: Audit every router against its intended permission model, add the missing
  `require_permission(...)` (or, at minimum, `CurrentActiveUserDependency`) guards, prioritizing mutating
  endpoints (`POST`/`PATCH`/`PUT`/`DELETE`) on `projects`, `audit`, `analytics`, `sla`, and `workflows` first.
- **Estimated effort**: M
- **Recommended milestone**: v1.1

### H-2. "Active user" is not actually checked by the authentication dependency

- **Description**: There is no separate `get_current_active_user` function. `CurrentActiveUserDependency` is
  simply an alias for `Depends(get_current_user)`, and `get_current_user` never inspects `user.is_active`.
- **Why it matters**: Deactivating a user (e.g. an offboarded employee, a suspended account) has no effect until
  their existing token naturally expires (up to 30 minutes) — deactivation is not actually a way to immediately
  cut off access, which will surprise whoever operates this system expecting otherwise.
- **Recommended fix**: Add an explicit `if not user.is_active: raise AuthenticationException(...)` check inside
  `get_current_user` (or a genuinely separate active-user dependency layered on top of it).
- **Estimated effort**: S
- **Recommended milestone**: v1.1

### H-3. AI retrieval and RAG generation are not functionally connected

- **Description**: `retrieval` and `vectorstore` both return a hardcoded relevance score (`1.0`) for every
  result rather than performing real vector similarity search. `rag.generate()` never calls an LLM provider —
  it returns the literal placeholder string `"This is a placeholder AI-generated response."` `embeddings.create()`
  never calls an embedding-model provider — it persists an empty vector. No chunking algorithm exists anywhere
  in `app/ai/`.
- **Why it matters**: This is the core value proposition of an "AI Support Platform" — grounded, cited answers
  from an organization's own knowledge base. As it stands today, every endpoint in this pipeline returns
  well-typed but functionally meaningless data. Any product demo or customer-facing rollout of the "AI Assistant"
  feature would currently be showing placeholder output.
- **Recommended fix**: Treat as a staged build-out: (1) implement real document chunking in `ingestion`,
  (2) call a real embedding-model provider in `embeddings.create()`, (3) implement genuine vector similarity in
  `retrieval`/`vectorstore` (or standardize on one of the two, see M-6), (4) wire `rag.generate()` to call
  retrieval + a provider with a real grounded prompt, (5) connect `chat.send_message()` to the RAG result rather
  than conversation history alone.
- **Estimated effort**: XL
- **Recommended milestone**: v1.2

### H-4. The one working AI chat implementation is not reachable via the live API

- **Description**: `app.ai.chat` is the most functionally complete AI module — full conversation/message
  persistence and a real, working call to an LLM provider via `app.ai.providers.registry`. Its router is fully
  implemented but is never included in `app/api/v1/router.py` or `app/main.py`; it is exercised only by its own
  test suite.
- **Why it matters**: This is a working feature sitting unused. Unlike H-3, this is not a build-out — it is a
  one-line fix that immediately unlocks real conversational AI (even before H-3's RAG-grounding work lands).
- **Recommended fix**: Add `from app.ai.chat.router import router as chat_router` and
  `api_router.include_router(chat_router)` to `app/api/v1/router.py`, following the same pattern as every other
  mounted router. Confirm via the existing chat test suite and a manual smoke test.
- **Estimated effort**: S
- **Recommended milestone**: v1.1 (high value, trivial cost — no reason to defer to v1.2 alongside H-3)

### H-5. Most AI providers are stubs — only OpenAI and Mock are functional

- **Description**: `AIProvider` implementations are registered in `registry.py` for OpenAI, Anthropic, Gemini,
  Groq, Ollama, and Azure OpenAI, but only `OpenAIProvider` and `MockAIProvider` have working `generate()`; only
  `MockAIProvider` has a working `stream()`. The other five raise `NotImplementedError` for both.
- **Why it matters**: The multi-vendor abstraction that the architecture is built around — vendor fail-over,
  cost control, avoiding lock-in — does not currently deliver on that promise for 5 of 6 advertised providers.
  Any customer or deployment requiring a non-OpenAI provider cannot use this platform today.
- **Recommended fix**: Prioritize by actual customer/deployment need; implement `generate()`/`stream()` for each
  required provider following the `OpenAIProvider` implementation as the template.
- **Estimated effort**: M per provider
- **Recommended milestone**: v1.2 (or later, driven by which providers are actually required)

---

## Medium

Items in this section represent real gaps or risks worth planning for, but none block an initial production
rollout on their own.

### M-1. Dependency manifest has drifted from what the code actually imports

- **Description**: `pyproject.toml` declares `passlib[bcrypt]` and `python-jose[cryptography]` as dependencies,
  but no source file imports either. The code actually runs on `pwdlib` (password hashing) and `PyJWT` (JWT),
  both installed in the environment but absent from the dependency manifest.
- **Why it matters**: A clean install from `pyproject.toml` alone would be missing packages the application
  needs to run, and carries two unused packages as dead weight (and unnecessary supply-chain surface).
- **Recommended fix**: Remove `passlib`/`python-jose` from `[project].dependencies`; add `pwdlib` and `PyJWT`
  with appropriate version pins matching what's currently installed and tested against.
- **Estimated effort**: S
- **Recommended milestone**: v1.1

### M-2. `retrieval`, `vectorstore`, and `rag` independently duplicate the same embedding-query logic

- **Description**: All three modules bypass `AIEmbeddingService`/`AIEmbeddingRepository` and independently query
  `app.ai.embeddings.models.Embedding` directly. `rag` does not call `retrieval` despite the naming implying it
  should. `retrieval_sessions` and `rag_generations` tables are both defined but never written to by any code path.
- **Why it matters**: Three near-duplicate implementations of "fetch some embeddings" is a maintenance burden and
  a source of behavioral drift — a fix or improvement to search logic applied to one module silently does not
  apply to the other two. It also means whichever module is eventually chosen to do "real" retrieval (H-3) has
  to be decided explicitly rather than assumed.
- **Recommended fix**: As part of the H-3 build-out, consolidate on a single retrieval implementation (most
  naturally `retrieval`, given its name) that `rag` calls into, and either start writing to
  `retrieval_sessions`/`rag_generations` for real or remove those unused table definitions.
- **Estimated effort**: M
- **Recommended milestone**: v1.2

### M-3. File and email content validation exists but is never invoked

- **Description**: `files/validators.py` (size limits, content-type checks, filename validation) and
  `files/storage.py` helpers are fully implemented but not called anywhere in `FileService`. Similarly,
  `attachments`' documented 25&nbsp;MB size limit and MIME-type allowlist constants are never enforced in
  `AttachmentService`.
- **Why it matters**: There is currently no server-side limit on uploaded file size or type for either module —
  a client can upload arbitrarily large or arbitrarily-typed files, which is both a resource-exhaustion risk and
  a potential attack surface (e.g. uploading executable content disguised with a benign extension).
- **Recommended fix**: Call the existing validators from `FileService.create()`/`AttachmentService.create_attachment()`
  before persisting; this is wiring already-written validation code, not writing new logic.
- **Estimated effort**: S
- **Recommended milestone**: v1.1

### M-4. Email delivery and templating are stubbed

- **Description**: `SMTPEmailProvider` always reports success without calling `smtplib` or sending anything.
  `EmailTemplates` (subject/body templates per `EmailTemplate` enum value) is fully implemented but never
  invoked by `EmailService` — callers would need to render templates externally before constructing an
  `EmailCreate`.
- **Why it matters**: Any feature depending on actual outbound email (notifications, password reset, ticket
  update alerts) currently sends nothing while reporting success, which will be discovered only when a user
  reports never receiving an expected email.
- **Recommended fix**: Implement `SMTPEmailProvider` (or a real provider — SendGrid/SES/Mailgun, already modeled
  as enum options) against actual credentials; wire `EmailTemplates` into the creation path so callers can pass
  a template name instead of hand-building subject/body.
- **Estimated effort**: M
- **Recommended milestone**: v1.3

### M-5. Workflow execution is simulated, not real

- **Description**: `WorkflowService.execute_workflow()` refuses to run a disabled workflow and returns a summary
  response (`actions_executed` count), but does not actually mutate a ticket or dispatch any configured action
  (e.g. `ASSIGN_USER`, `SEND_EMAIL`). No other module (tickets, comments, sla) calls into `workflows` to fire
  triggers automatically.
- **Why it matters**: The automation feature — the entire point of a workflow engine — does not automate
  anything yet. `POST /api/v1/workflows/{id}/execute` currently returns a success response for actions that
  never happened.
- **Recommended fix**: Implement real action dispatch inside `execute_workflow` (starting with the
  already-modeled action types), and add trigger firing from the modules workflows are meant to react to
  (ticket creation, SLA breach, etc.) — likely via the same event-dispatch mechanism chosen for background work
  (see M-9).
- **Estimated effort**: L
- **Recommended milestone**: v1.3

### M-6. Duplicate, unreconciled `OrganizationRepository` implementations

- **Description**: `app.organizations.repository.OrganizationRepository` (hand-written, used by `organizations`
  and `users`) and `app.repositories.organization.OrganizationRepository` (built on `BaseRepository`, used by
  `teams`) are two independent, live implementations against the same table, with a minor confirmed behavioral
  divergence in soft-delete filtering (`deleted_at.is_(None)` vs. `is_deleted.is_(False)`).
- **Why it matters**: A bug fix or behavior change applied to one will not apply to the other, and the two
  modules consuming them (`organizations`/`users` vs. `teams`) could observe subtly different results for the
  same organization depending on which path queried it (e.g. around soft-deleted rows).
- **Recommended fix**: Perform the method-by-method behavioral diff both docstrings acknowledge has never been
  done; consolidate on one implementation (the `BaseRepository`-based one is the more consistent long-term
  choice) and update `organizations`/`users` to use it.
- **Estimated effort**: M
- **Recommended milestone**: v1.3

### M-7. Several fully-implemented service methods are not exposed via any route

- **Description**: `TicketService.get_ticket/update_ticket/delete_ticket` and
  `SLAService.assign_policy/record_first_response/resolve_ticket` are implemented and tested at the service
  layer, but `tickets`/`sla` routers only wire a subset of their module's service methods to actual endpoints
  (tickets: only list/create; SLA: only policy CRUD and read paths).
- **Why it matters**: Basic expected operations — updating or deleting a single ticket by ID, actually recording
  an SLA first-response/resolution event — are currently impossible through the API despite the business logic
  existing and being tested. This looks like an oversight rather than a deliberate scope decision.
- **Recommended fix**: Add the missing routes, delegating directly to the existing, already-tested service
  methods — no new business logic required.
- **Estimated effort**: S
- **Recommended milestone**: v1.1 (low effort, closes an obviously-missing capability)

### M-8. Inconsistent foreign-key cascade behavior between "core" and business tables

- **Description**: `OrganizationMixin` (used by User, Project, Role) sets `organization_id` FK with
  `ondelete="RESTRICT"`. Every other module with an `organization_id` column (Ticket, Team, Customer, Comment,
  Attachment, Notification, AuditLog, SLAPolicy, File, Email, Workflow) hand-declares its own column, typically
  with `ondelete="CASCADE"` instead.
- **Why it matters**: Deleting an Organization currently behaves inconsistently depending on which tables
  reference it — some deletions would be blocked (RESTRICT), others would cascade-delete potentially large
  amounts of data silently. This is a correctness and data-safety concern for an operation ("delete a tenant")
  that should have one deliberate, well-understood behavior.
- **Recommended fix**: Decide the intended behavior for organization deletion (likely: block if any live
  business data exists, i.e. RESTRICT everywhere, paired with an explicit soft-delete-first workflow) and
  standardize all `organization_id` FKs to match.
- **Estimated effort**: M
- **Recommended milestone**: v1.3

### M-9. Background workers are entirely unimplemented

- **Description**: All 5 files in `app/workers/` (`celery_app.py`, `analytics_tasks.py`, `document_tasks.py`,
  `email_tasks.py`, `ticket_tasks.py`) are 3-line stubs — a docstring and a future-annotations import. No
  `Celery(...)` app instance exists, no `@app.task` is defined, and nothing wires them to the already-provisioned
  `redis` service.
- **Why it matters**: Any operation that should not block an HTTP request — bulk analytics computation,
  document ingestion processing, outbound email sending, scheduled SLA-breach sweeps — currently has no
  asynchronous execution path at all. As the AI pipeline (H-3) and email delivery (M-4) are built out, this
  becomes a harder blocker, since ingestion/embedding generation are naturally long-running operations that
  should not run synchronously inside a request.
- **Recommended fix**: Stand up a real Celery app bound to `Settings.REDIS_URL`, starting with the task that
  will be needed soonest (likely document ingestion, once H-3 requires it).
- **Estimated effort**: L
- **Recommended milestone**: v1.2 (aligned with AI pipeline work) or v1.3 if deferred

---

## Low

Cleanup, consistency, and quality-of-life items. None are urgent; bundle them opportunistically alongside
related work above rather than scheduling dedicated time.

### L-1. Dead code: three unused "manager" classes in `analytics`

- **Description**: `analytics/dashboard.py`, `metrics.py`, and `reports.py` each define a class
  (`DashboardManager`, etc.) that duplicates logic already present in `AnalyticsService`, but none are called
  from the router or service — confirmed zero callers.
- **Why it matters**: Dead code adds reading and maintenance overhead, and risks a future engineer editing the
  wrong (unused) copy and wondering why their change has no effect.
- **Recommended fix**: Delete the three files once confirmed still unreferenced.
- **Estimated effort**: S
- **Recommended milestone**: Backlog

### L-2. Duplicate service-factory definitions in `teams` and `tickets` routers

- **Description**: Both modules define a `get_<x>_service`-equivalent factory inline in `router.py` in addition
  to the one already defined in `dependencies.py` — functionally identical, just written twice.
- **Why it matters**: Minor inconsistency with every other module's convention; harmless today but a small trap
  for a future edit that updates one copy and not the other.
- **Recommended fix**: Remove the inline router-level definitions; use the existing `dependencies.py` alias like
  every other module.
- **Estimated effort**: S
- **Recommended milestone**: Backlog

### L-3. Declared observability dependencies are not wired up

- **Description**: `structlog` is declared as a dependency but `app/config/logging.py` uses plain stdlib
  `logging.config.dictConfig`. `prometheus-client` is declared but no metrics endpoint exists anywhere in the
  router surface.
- **Why it matters**: No blast radius today, but production operability (structured, queryable logs; scrapeable
  metrics) is currently unavailable despite the dependencies already being paid for in the manifest.
- **Recommended fix**: Either wire both in, or remove them from the manifest until they're actually planned for
  near-term work.
- **Estimated effort**: M
- **Recommended milestone**: v1.4

### L-4. `app/ai/prompts` (root-level) is fully unused

- **Description**: `PromptLibrary` (canned system prompts) is implemented but imported by nothing — `chat` uses
  its own separate, independent `chat/prompts/` package instead.
- **Why it matters**: Purely a duplication/clarity issue; two competing "prompt template" concepts exist with no
  clear guidance on which a new AI feature should use.
- **Recommended fix**: Either fold `PromptLibrary` into `chat/prompts/` (if its canned prompts are still useful)
  or remove it if fully superseded.
- **Estimated effort**: S
- **Recommended milestone**: Backlog

### L-5. Soft-delete mechanism is duplicated rather than shared across 11 modules

- **Description**: `BaseModel(TimestampMixin, Base)` provides `id`/`is_deleted`/`deleted_at`/`soft_delete()`/
  `restore()` once, used by 6 entities. The other 11 module-owned entities hand-roll the identical fields and
  method directly on `TimestampMixin` + `Base` instead of inheriting `BaseModel`.
- **Why it matters**: Purely maintainability — a future improvement to soft-delete semantics (e.g. adding a
  `deleted_by` field) requires editing 11 copies instead of one shared base.
- **Recommended fix**: Migrate the 11 module-owned models to inherit `BaseModel` instead of hand-rolling the same
  fields; low risk since the resulting columns are identical, but touches every affected table's model file.
- **Estimated effort**: M
- **Recommended milestone**: Backlog

### L-6. No CI/CD pipeline despite fully-configured, currently-passing quality gates

- **Description**: Ruff, Black, and MyPy (strict) are fully configured and pass with zero issues; Pytest has a
  large, well-organized suite. None of this is currently automated on push/PR.
- **Why it matters**: Quality currently depends on every contributor remembering to run these tools locally;
  regressions are only caught if someone happens to run the full suite before merging.
- **Recommended fix**: Add a CI pipeline (GitHub Actions or equivalent) running `ruff check`, `black --check`,
  `mypy`, and `pytest` against a real Postgres service container on every PR.
- **Estimated effort**: M
- **Recommended milestone**: v1.4

---

## Summary Table

| ID | Item | Severity | Effort | Milestone |
|---|---|---|---|---|
| C-1 | Hardcoded JWT secret ignores config | Critical | S | v1.1 |
| C-2 | Organization isolation not systemically enforced | Critical | L/XL | v1.1 |
| C-3 | No committed database migrations | Critical | M | v1.1 |
| C-4 | Uploaded files not actually persisted | Critical | M | v1.1 |
| C-5 | Missing Dockerfile blocks documented deploy path | Critical | S | v1.1 |
| H-1 | RBAC guard adopted on only 4/21 routers | High | M | v1.1 |
| H-2 | Active-user status not enforced | High | S | v1.1 |
| H-3 | AI retrieval/RAG not functionally connected | High | XL | v1.2 |
| H-4 | Working chat router not mounted | High | S | v1.1 |
| H-5 | 5 of 6 AI providers are stubs | High | M each | v1.2 |
| M-1 | Dependency manifest drift | Medium | S | v1.1 |
| M-2 | Duplicate retrieval/vectorstore/rag query logic | Medium | M | v1.2 |
| M-3 | File/attachment validation never invoked | Medium | S | v1.1 |
| M-4 | Email delivery/templating stubbed | Medium | M | v1.3 |
| M-5 | Workflow execution simulated only | Medium | L | v1.3 |
| M-6 | Duplicate OrganizationRepository | Medium | M | v1.3 |
| M-7 | Ticket/SLA service methods not routed | Medium | S | v1.1 |
| M-8 | Inconsistent FK cascade behavior | Medium | M | v1.3 |
| M-9 | Background workers unimplemented | Medium | L | v1.2/v1.3 |
| L-1 | Dead code in analytics | Low | S | Backlog |
| L-2 | Duplicate service factories (teams/tickets) | Low | S | Backlog |
| L-3 | Observability deps declared, unused | Low | M | v1.4 |
| L-4 | Unused root-level prompts module | Low | S | Backlog |
| L-5 | Duplicated soft-delete implementation | Low | M | Backlog |
| L-6 | No CI/CD pipeline | Low | M | v1.4 |

---

*This document reflects findings as of `docs/ARCHITECTURE.pdf` v1.0. It should be revisited whenever the
architecture document is revised, and individual items should be marked resolved (not deleted) as they close,
so this remains a historical record of what was fixed and when.*
