"""Analytics models.

This module intentionally does not define SQLAlchemy ORM models.

The Analytics module is a read-only aggregation layer that queries
existing domain models (tickets, users, organizations, projects,
workflows, SLA, knowledge base, etc.) to produce dashboards,
metrics, and reports.

Persistent models should only be added here if analytics introduces
database-backed features such as:

- Saved dashboards
- Scheduled reports
- Report exports
- Analytics snapshots
- Cached analytics results
"""

from __future__ import annotations
