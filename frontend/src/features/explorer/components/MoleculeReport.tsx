/**
 * The full two-column report for a single molecule.
 *
 * Extracted verbatim from ExplorerPage's success branch so it can be reused
 * both as the single-molecule view and as the expanded detail of a batch
 * results row. Layout, spacing, and the set of rendered components are
 * unchanged from Session 1.7.
 */

import { MoleculeStructure } from "@/features/explorer/components/MoleculeStructure"
import { PropertyTable } from "@/features/explorer/components/PropertyTable"
import { SolubilityCard } from "@/features/explorer/components/SolubilityCard"
import { DruglikenessCard } from "@/features/explorer/components/DruglikenessCard"
import { AlertsCard } from "@/features/explorer/components/AlertsCard"
import { ScoresCard } from "@/features/explorer/components/ScoresCard"

import type { MoleculeAnalysisResponse } from "@/features/explorer/types"

interface MoleculeReportProps {
  result: MoleculeAnalysisResponse
  name?: string | null
}

export function MoleculeReport({ result, name }: MoleculeReportProps) {
  return (
    <div className="space-y-4">
      {name ? <h2 className="text-xl font-semibold">{name}</h2> : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {/* Left rail: visuals. The radar joins the structure here later. */}
        <aside className="space-y-3">
          <MoleculeStructure smiles={result.canonical_smiles} />
          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Canonical SMILES
            </p>
            <p className="break-all font-mono text-[11px] text-muted-foreground">
              {result.canonical_smiles}
            </p>
          </div>
        </aside>

        {/* Right column: the bordered container; ReportSections band it. */}
        <div className="overflow-hidden rounded-lg border border-border">
          <PropertyTable properties={result.properties} />
          <SolubilityCard solubility={result.solubility} />
          <DruglikenessCard druglikeness={result.druglikeness} />
          <AlertsCard alerts={result.alerts} />
          <ScoresCard
            qed={result.qed}
            saScore={result.sa_score}
            saScoreNote={result.sa_score_note}
          />
        </div>
      </div>
    </div>
  )
}

export default MoleculeReport
