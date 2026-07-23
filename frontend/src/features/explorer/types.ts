/**
 * TypeScript types mirroring the backend POST /api/molecule/analyze contract.
 *
 * Hand-written to match the FastAPI response schema exactly (verified against
 * /openapi.json). Fields this session renders (properties, druglikeness) and
 * the deferred ones (solubility, alerts, qed, sa_score) are all typed here so
 * Session 1.5 does not have to revisit this file.
 */

export interface MoleculeAnalysisRequest {
  smiles: string
  name?: string
}

export interface PhysicoChemicalProperties {
  MW: number
  LogP: number
  TPSA: number
  HBD: number
  HBA: number
  RotatableBonds: number
  AromaticRings: number
}

export interface RuleResult {
  passed: boolean
  descriptors: Record<string, number>
  reason: string | null
}

export interface DruglikenessResults {
  lipinski: RuleResult
  veber: RuleResult
  ghose: RuleResult
  egan: RuleResult
  muegge: RuleResult
}

// --- Deferred to Session 1.5: typed but not yet rendered ---

export interface SolubilityResult {
  log_s: number
  solubility_mg_ml: number
  solubility_mol_l: number
  solubility_class: string
  error: string | null
}

export interface AlertMatch {
  matched: boolean
  description: string | null
}

export interface MedChemAlerts {
  pains: AlertMatch
  brenk: AlertMatch
}

// --- Full response ---

export interface MoleculeAnalysisResponse {
  smiles: string
  canonical_smiles: string
  name: string | null
  properties: PhysicoChemicalProperties
  druglikeness: DruglikenessResults
  // Deferred (Session 1.5) — present in the payload, not yet displayed:
  solubility: SolubilityResult
  alerts: MedChemAlerts
  qed: number | null
  sa_score: number | null
  sa_score_note: string | null
}
