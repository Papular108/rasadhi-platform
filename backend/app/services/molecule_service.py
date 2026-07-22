"""Service layer for single-molecule analysis.

This module owns the chemistry. It calls rasadhi_core, unpacks its tuple
returns onto the Pydantic response models from app.models, and raises the
domain exceptions defined in rasadhi_core.exceptions when input cannot be
processed.

By design it imports nothing from fastapi: the service layer stays
framework-free so it can be reused (e.g. by a batch endpoint or a CLI)
without dragging HTTP concerns along. Mapping HTTP status codes onto these
domain exceptions is the route layer's job.
"""

from rdkit import Chem

from rasadhi_core.exceptions import InvalidSmilesError
from rasadhi_core.featurization import compute_descriptors, compute_esol
from rasadhi_core.preprocessing import (
    check_brenk,
    check_egan,
    check_ghose,
    check_lipinski,
    check_muegge,
    check_pains,
    check_veber,
    compute_qed,
    compute_synthetic_accessibility,
)

from app.models.common import AlertMatch, RuleResult
from app.models.molecule import (
    DrugLikenessResults,
    MedChemAlerts,
    MoleculeAnalysisResponse,
    PhysicoChemicalProperties,
    SolubilityResult,
)


def _rule_result(rule_fn, mol) -> RuleResult:
    """Run a rasadhi_core rule check and map its 3-tuple onto RuleResult.

    Each rule function returns (passes, descriptors, reason).
    """
    passed, descriptors, reason = rule_fn(mol)
    return RuleResult(passed=passed, descriptors=descriptors, reason=reason)


def _alert_match(alert_fn, mol) -> AlertMatch:
    """Run a rasadhi_core structural-alert check and map its 2-tuple.

    Each alert function returns (is_hit, matched_name).
    """
    is_hit, matched_name = alert_fn(mol)
    return AlertMatch(matched=is_hit, description=matched_name)


def analyze_molecule(smiles: str, name: str | None = None) -> MoleculeAnalysisResponse:
    """Run the full analysis pipeline for a single molecule.

    Parses the SMILES, computes physicochemical descriptors, aqueous
    solubility, the five druglikeness rule filters, structural-alert screens,
    QED, and synthetic accessibility, then assembles them into the response
    model.

    Raises:
        InvalidSmilesError: if the SMILES string cannot be parsed by RDKit.

    Unexpected errors from rasadhi_core are not caught here — they propagate
    so the route layer can surface them as HTTP 500.
    """
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        raise InvalidSmilesError(f"Could not parse SMILES: {smiles!r}")

    canonical_smiles = Chem.MolToSmiles(mol)

    properties = PhysicoChemicalProperties(**compute_descriptors(mol))

    log_s, solubility_mg_ml, solubility_mol_l, solubility_class, esol_error = (
        compute_esol(mol)
    )
    solubility = SolubilityResult(
        log_s=log_s,
        solubility_mg_ml=solubility_mg_ml,
        solubility_mol_l=solubility_mol_l,
        solubility_class=solubility_class,
        error=esol_error,
    )

    druglikeness = DrugLikenessResults(
        lipinski=_rule_result(check_lipinski, mol),
        veber=_rule_result(check_veber, mol),
        ghose=_rule_result(check_ghose, mol),
        egan=_rule_result(check_egan, mol),
        muegge=_rule_result(check_muegge, mol),
    )

    alerts = MedChemAlerts(
        pains=_alert_match(check_pains, mol),
        brenk=_alert_match(check_brenk, mol),
    )

    qed_score, qed_error = compute_qed(mol)
    qed = qed_score if qed_error is None else None

    sa_score, sa_error = compute_synthetic_accessibility(mol)
    sa_value = sa_score if sa_error is None else None

    return MoleculeAnalysisResponse(
        smiles=smiles,
        canonical_smiles=canonical_smiles,
        name=name,
        properties=properties,
        solubility=solubility,
        druglikeness=druglikeness,
        alerts=alerts,
        qed=qed,
        sa_score=sa_value,
        sa_score_note=sa_error if sa_value is None else None,
    )
