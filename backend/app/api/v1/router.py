"""API V1 router for all modules."""

from __future__ import annotations

from app.ai.documents.router import router as document_router
from app.ai.embeddings.router import router as embeddings_router
from app.ai.ingestion.router import router as ingestion_router
from app.ai.knowledge.router import router as ai_knowledge_router
from app.ai.providers.router import router as ai_router
from app.ai.rag.router import router as rag_router
from app.ai.retrieval.router import router as retrieval_router
from app.ai.vectorstore.router import router as vectorstore_router
from app.analytics.router import router as analytics_router
from app.attachments.router import router as attachment_router
from app.audit.router import router as audit_router
from app.auth.router import router as auth_router
from app.comments.router import router as comment_router
from app.customers.router import router as customer_router
from app.email.router import router as email_router
from app.files.router import router as file_router
from app.notifications.router import router as notification_router
from app.organizations.router import router as organization_router
from app.projects.router import router as project_router
from app.sla.router import router as sla_router
from app.teams.router import router as teams_router
from app.tickets.router import router as ticket_router
from app.users.router import router as user_router
from app.workflows.router import router as workflows_router
from fastapi import APIRouter

api_router = APIRouter(prefix="/api/v1")

# ============================================================================
# Core
# ============================================================================

api_router.include_router(auth_router)
api_router.include_router(organization_router)
api_router.include_router(teams_router)
api_router.include_router(user_router)
api_router.include_router(project_router)

# ============================================================================
# Support
# ============================================================================

api_router.include_router(customer_router)
api_router.include_router(ticket_router)
api_router.include_router(comment_router)
api_router.include_router(attachment_router)
api_router.include_router(notification_router)

# ============================================================================
# Business
# ============================================================================

api_router.include_router(email_router)
api_router.include_router(file_router)
api_router.include_router(sla_router)
api_router.include_router(workflows_router)
api_router.include_router(audit_router)
api_router.include_router(analytics_router)

# ============================================================================
# AI
# ============================================================================

api_router.include_router(ai_router)
api_router.include_router(ai_knowledge_router)
api_router.include_router(embeddings_router)
api_router.include_router(vectorstore_router)
api_router.include_router(rag_router)
api_router.include_router(retrieval_router)
api_router.include_router(document_router)
api_router.include_router(ingestion_router)
