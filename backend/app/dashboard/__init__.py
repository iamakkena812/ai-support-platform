"""Dashboard module."""

from app.dashboard.router import router
from app.dashboard.service import DashboardService

__all__ = [
    "DashboardService",
    "router",
]
