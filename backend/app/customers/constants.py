"""Customer constants."""

from __future__ import annotations

from enum import StrEnum


class CustomerType(StrEnum):
    """Supported customer types."""

    INDIVIDUAL = "individual"
    BUSINESS = "business"


class CustomerStatus(StrEnum):
    """Supported customer statuses."""

    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"


MAX_CUSTOMER_NAME_LENGTH = 255
"""Maximum customer name length."""

MAX_COMPANY_NAME_LENGTH = 255
"""Maximum company name length."""

MAX_EMAIL_LENGTH = 255
"""Maximum email address length."""

MAX_PHONE_LENGTH = 20
"""Maximum phone number length."""

MAX_WEBSITE_LENGTH = 255
"""Maximum website URL length."""

MAX_ADDRESS_LENGTH = 500
"""Maximum address length."""

MAX_CITY_LENGTH = 100
"""Maximum city name length."""

MAX_STATE_LENGTH = 100
"""Maximum state/province name length."""

MAX_COUNTRY_LENGTH = 100
"""Maximum country name length."""

MAX_POSTAL_CODE_LENGTH = 20
"""Maximum postal code length."""

DEFAULT_PAGE_SIZE = 100
"""Default pagination page size."""

MAX_PAGE_SIZE = 500
"""Maximum pagination page size."""
