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
