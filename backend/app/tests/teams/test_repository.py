"""Tests for TeamRepository."""

from __future__ import annotations

from uuid import uuid4

import pytest
from sqlalchemy.orm import Session

from app.models.team import Team
from app.teams.repository import TeamRepository


@pytest.fixture
def repository(db_session: Session) -> TeamRepository:
    """Create a team repository."""
    return TeamRepository(db_session)


@pytest.fixture
def team(db_session: Session) -> Team:
    """Create a sample team."""
    team = Team(
        id=uuid4(),
        name="Engineering",
        description="Engineering Team",
        organization_id=uuid4(),
    )

    db_session.add(team)
    db_session.commit()
    db_session.refresh(team)

    return team
