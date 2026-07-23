"""Request and response models for single-molecule analysis endpoints.

Defines the request/response contract for POST /api/molecule/analyze. Field
shapes here were derived by inspecting the actual return values of
rasadhi_core (preprocessing and featurization modules), not assumed — the
property and solubility keys match what compute_descriptors and compute_esol
really return for an RDKit molecule.

These models carry validation constraints and OpenAPI documentation only.
The service layer that populates the response from rasadhi_core lives in a
later session (1.2); nothing here computes chemistry.
"""

from pydantic import BaseModel, Field

from app.models.common import AlertMatch, RuleResult


class MoleculeAnalysisRequest(BaseModel):
    """Input for a single-molecule analysis request."""

    smiles: str = Field(
        ...,
        min_length=1,
        max_length=1000,
        description="SMILES string of the molecule to analyze.",
    )
    name: str | None = Field(
        None,
        description="Optional display label for the molecule (e.g. 'Aspirin'). "
        "Does not affect the analysis.",
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "smiles": "CC(=O)Oc1ccccc1C(=O)O",
                "name": "Aspirin",
            }
        }
    }


class PhysicoChemicalProperties(BaseModel):
    """Key physicochemical descriptors.

    Matches the dict returned by rasadhi_core.featurization.compute_descriptors.
    """

    MW: float = Field(..., description="Molecular weight (g/mol).")
    LogP: float = Field(
        ..., description="Calculated octanol-water partition coefficient (LogP)."
    )
    TPSA: float = Field(
        ..., description="Topological polar surface area (Angstrom^2)."
    )
    HBD: int = Field(..., description="Number of hydrogen-bond donors.")
    HBA: int = Field(..., description="Number of hydrogen-bond acceptors.")
    RotatableBonds: int = Field(
        ..., description="Number of rotatable bonds."
    )
    AromaticRings: int = Field(
        ..., description="Number of aromatic rings."
    )


class SolubilityResult(BaseModel):
    """Predicted aqueous solubility from the ESOL model (Delaney, 2004).

    Matches the (log_s, solubility_mg_ml, solubility_mol_l, solubility_class,
    error) tuple returned by rasadhi_core.featurization.compute_esol.
    """

    log_s: float = Field(
        ..., description="Predicted log solubility (LogS) in mol/L."
    )
    solubility_mg_ml: float = Field(
        ..., description="Predicted solubility in mg/mL."
    )
    solubility_mol_l: float = Field(
        ..., description="Predicted solubility in mol/L."
    )
    solubility_class: str = Field(
        ...,
        description="Qualitative solubility category (e.g. 'Moderately "
        "soluble').",
    )
    error: str | None = Field(
        None,
        description="Error message if the ESOL computation failed; None on "
        "success.",
    )


class DrugLikenessResults(BaseModel):
    """Outcomes of the five druglikeness rule filters."""

    lipinski: RuleResult = Field(
        ..., description="Lipinski's Rule of Five outcome."
    )
    veber: RuleResult = Field(
        ..., description="Veber's oral-bioavailability rules outcome."
    )
    ghose: RuleResult = Field(
        ..., description="Ghose drug-like property-range filter outcome."
    )
    egan: RuleResult = Field(
        ..., description="Egan egg-boundary (LogP vs TPSA) outcome."
    )
    muegge: RuleResult = Field(
        ..., description="Muegge pharmacophore-like rules outcome."
    )


class MedChemAlerts(BaseModel):
    """Structural-alert screening results (medicinal-chemistry liabilities)."""

    pains: AlertMatch = Field(
        ..., description="PAINS (pan-assay interference) filter result."
    )
    brenk: AlertMatch = Field(
        ...,
        description="Brenk filter result (structural alerts for unwanted "
        "groups).",
    )


class MoleculeAnalysisResponse(BaseModel):
    """Full analysis result for a single molecule."""

    smiles: str = Field(
        ..., description="The input SMILES, echoed back unchanged."
    )
    canonical_smiles: str = Field(
        ...,
        description="RDKit canonical SMILES of the molecule.",
    )
    name: str | None = Field(
        None,
        description="Display label from the request, if one was provided.",
    )
    properties: PhysicoChemicalProperties = Field(
        ..., description="Computed physicochemical descriptors."
    )
    solubility: SolubilityResult = Field(
        ..., description="Predicted aqueous solubility (ESOL)."
    )
    druglikeness: DrugLikenessResults = Field(
        ..., description="Druglikeness rule-filter outcomes."
    )
    alerts: MedChemAlerts = Field(
        ..., description="Structural-alert screening results."
    )
    qed: float | None = Field(
        None,
        description="Quantitative Estimate of Druglikeness (0-1); None if the "
        "computation failed.",
    )
    sa_score: float | None = Field(
        None,
        description="Synthetic accessibility score (1 = easy, 10 = difficult); "
        "None if unavailable.",
    )
    sa_score_note: str | None = Field(
        None,
        description="Explanation for a missing sa_score (e.g. sascorer "
        "unavailable); None when sa_score is present.",
    )


class MoleculeBatchRequest(BaseModel):
    """Input for a batch analysis request (several molecules at once)."""

    molecules: list[MoleculeAnalysisRequest] = Field(
        ...,
        min_length=1,
        max_length=50,
        description="The molecules to analyze. Capped at 50 to keep response "
        "times reasonable; larger sets belong in the dataset workflow, which "
        "handles files, filtering, and export.",
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "molecules": [
                    {"smiles": "CC(=O)Oc1ccccc1C(=O)O", "name": "Aspirin"},
                    {"smiles": "Cn1cnc2c1c(=O)n(C)c(=O)n2C"},
                ]
            }
        }
    }


class MoleculeBatchItem(BaseModel):
    """One molecule's outcome within a batch.

    Carries either a full analysis (when success is true) or an error string
    (when success is false), so a single malformed molecule does not fail the
    whole batch.
    """

    index: int = Field(
        ...,
        description="Zero-based position of this molecule in the submitted "
        "list, so callers can match results to inputs regardless of ordering.",
    )
    input_smiles: str = Field(
        ..., description="The submitted SMILES string, echoed back."
    )
    name: str | None = Field(
        None,
        description="Display label from the request, if one was provided.",
    )
    success: bool = Field(
        ...,
        description="True if this molecule was analyzed; false if it failed.",
    )
    result: MoleculeAnalysisResponse | None = Field(
        None,
        description="The full analysis; populated only when success is true.",
    )
    error: str | None = Field(
        None,
        description="Why this molecule failed; populated only when success is "
        "false.",
    )


class MoleculeBatchResponse(BaseModel):
    """Result of a batch analysis request.

    The summary counts let a caller show, for example, '18 of 20 analyzed'
    without walking the items list.
    """

    total: int = Field(..., description="Number of molecules submitted.")
    succeeded: int = Field(
        ..., description="Number analyzed successfully."
    )
    failed: int = Field(..., description="Number that failed to analyze.")
    items: list[MoleculeBatchItem] = Field(
        ...,
        description="Per-molecule outcomes, in the order submitted.",
    )
