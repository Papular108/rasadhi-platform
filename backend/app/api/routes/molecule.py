"""Single-molecule analysis endpoints.

This is the HTTP layer for single-molecule operations. It calls the service
layer, translates domain exceptions into HTTP status codes, and contains no
chemistry logic of its own.
"""

from fastapi import APIRouter, HTTPException

from rasadhi_core.exceptions import InvalidSmilesError

from app.models.common import ErrorResponse
from app.models.molecule import MoleculeAnalysisRequest, MoleculeAnalysisResponse
from app.services import molecule_service

router = APIRouter(prefix="/api/molecule", tags=["molecule"])


@router.post(
    "/analyze",
    response_model=MoleculeAnalysisResponse,
    responses={400: {"model": ErrorResponse}},
)
async def analyze(request: MoleculeAnalysisRequest) -> MoleculeAnalysisResponse:
    """Analyze a single molecule from its SMILES string.

    Returns physicochemical descriptors, predicted aqueous solubility, the
    five druglikeness rule filters (Lipinski, Veber, Ghose, Egan, Muegge),
    PAINS and Brenk structural-alert screens, the QED druglikeness score, and
    a synthetic-accessibility score.

    Returns HTTP 400 if the SMILES string cannot be parsed.
    """
    try:
        return molecule_service.analyze_molecule(request.smiles, request.name)
    except InvalidSmilesError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
