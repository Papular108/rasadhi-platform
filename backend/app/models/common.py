"""Common response types shared across endpoints.

Holds building-block models reused by multiple endpoints: a standard error
envelope, a single druglikeness-rule outcome, and a structural-alert hit.
These carry validation constraints and OpenAPI documentation only — no
business logic. The values they hold are produced by the service layer
(Session 1.2) from rasadhi_core return values.
"""

from pydantic import BaseModel, Field


class ErrorResponse(BaseModel):
    """Standard error envelope returned on a failed request."""

    detail: str = Field(
        ...,
        description="Human-readable explanation of what went wrong.",
    )
    error_type: str = Field(
        ...,
        description="Machine-readable error category (e.g. 'invalid_smiles').",
    )


class RuleResult(BaseModel):
    """Outcome of a single druglikeness rule (Lipinski, Veber, etc.).

    Mirrors the ``(passes, descriptors, reason)`` tuple returned by the
    rasadhi_core rule-check functions.
    """

    passed: bool = Field(
        ...,
        description="True if the molecule satisfies this rule within its "
        "allowed violation threshold.",
    )
    descriptors: dict[str, float] = Field(
        ...,
        description="The descriptor values this rule evaluated (keys vary by "
        "rule, e.g. MW, LogP, HBD, HBA, violations).",
    )
    reason: str | None = Field(
        None,
        description="Explanation of why the rule failed; None when the rule "
        "passed.",
    )


class AlertMatch(BaseModel):
    """Result of screening a molecule against a structural-alert catalog.

    Mirrors the ``(is_hit, matched_name)`` tuple returned by check_pains and
    check_brenk in rasadhi_core.
    """

    matched: bool = Field(
        ...,
        description="True if the molecule matches at least one pattern in the "
        "alert catalog.",
    )
    description: str | None = Field(
        None,
        description="Name of the matched alert pattern (e.g. 'phenol_ester'); "
        "None when there is no match.",
    )
