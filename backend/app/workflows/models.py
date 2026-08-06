"""Database models for workflow automation."""

from __future__ import annotations

from uuid import UUID

from sqlalchemy import Boolean, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.types import GUID
from app.models.base import BaseModel


class Workflow(BaseModel):
    """Workflow automation definition."""

    __tablename__ = "workflows"

    organization_id: Mapped[UUID] = mapped_column(
        GUID(),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    trigger: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        index=True,
    )

    conditions: Mapped[list[WorkflowCondition]] = relationship(
        "WorkflowCondition",
        back_populates="workflow",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    actions: Mapped[list[WorkflowAction]] = relationship(
        "WorkflowAction",
        back_populates="workflow",
        cascade="all, delete-orphan",
        lazy="selectin",
    )


class WorkflowCondition(BaseModel):
    """Workflow execution condition."""

    __tablename__ = "workflow_conditions"

    workflow_id: Mapped[UUID] = mapped_column(
        GUID(),
        ForeignKey("workflows.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    field: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    operator: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    value: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    workflow: Mapped[Workflow] = relationship(
        "Workflow",
        back_populates="conditions",
    )


class WorkflowAction(BaseModel):
    """Workflow action."""

    __tablename__ = "workflow_actions"

    workflow_id: Mapped[UUID] = mapped_column(
        GUID(),
        ForeignKey("workflows.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    action: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    value: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    execution_order: Mapped[int] = mapped_column(
        Integer,
        default=1,
        nullable=False,
    )

    workflow: Mapped[Workflow] = relationship(
        "Workflow",
        back_populates="actions",
    )


__all__ = [
    "Workflow",
    "WorkflowCondition",
    "WorkflowAction",
]
