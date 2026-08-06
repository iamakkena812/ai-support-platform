"""Constants for the analytics module."""

from __future__ import annotations

ANALYTICS_PREFIX = "/api/v1/analytics"
ANALYTICS_TAG = "Analytics"

DEFAULT_PAGE = 1
DEFAULT_PAGE_SIZE = 25
MAX_PAGE_SIZE = 100

DASHBOARD_ENDPOINT = "/dashboard"
METRICS_ENDPOINT = "/metrics"

REPORTS_PREFIX = "/reports"

TICKETS_REPORT = "/tickets"
SLA_REPORT = "/sla"
USERS_REPORT = "/users"
PROJECTS_REPORT = "/projects"
ORGANIZATIONS_REPORT = "/organizations"
WORKFLOWS_REPORT = "/workflows"

ANALYTICS_NOT_FOUND = "Analytics data not found."
INVALID_DATE_RANGE = "Invalid date range."
