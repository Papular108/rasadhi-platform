/**
 * Molecule Explorer feature page.
 *
 * Composes the full single-molecule report — SMILES input, physicochemical
 * properties, water solubility, druglikeness rules, structural alerts, and
 * druglikeness scores — and handles the idle, loading, error, and success
 * UI states. Cards are ordered from raw measurement to interpretation.
 */

import { SmilesInput } from "@/features/explorer/components/SmilesInput"
import { MoleculeStructure } from "@/features/explorer/components/MoleculeStructure"
import { PropertyTable } from "@/features/explorer/components/PropertyTable"
import { SolubilityCard } from "@/features/explorer/components/SolubilityCard"
import { DruglikenessCard } from "@/features/explorer/components/DruglikenessCard"
import { AlertsCard } from "@/features/explorer/components/AlertsCard"
import { ScoresCard } from "@/features/explorer/components/ScoresCard"
import { useMoleculeAnalysis } from "@/features/explorer/hooks/useMoleculeAnalysis"

export default function ExplorerPage() {
  const analysis = useMoleculeAnalysis()

  const handleAnalyze = (smiles: string, name?: string) => {
    analysis.mutate({ smiles, name })
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <SmilesInput onAnalyze={handleAnalyze} isLoading={analysis.isPending} />

      {analysis.isIdle ? (
        <p className="text-sm text-muted-foreground">
          Results will appear here after you run an analysis.
        </p>
      ) : null}

      {analysis.isPending ? (
        <p className="text-sm text-muted-foreground">Analyzing…</p>
      ) : null}

      {analysis.isError ? <ErrorMessage error={analysis.error} /> : null}

      {analysis.isSuccess ? (
        <div className="space-y-4">
          {analysis.data.name ? (
            <h2 className="text-xl font-semibold">{analysis.data.name}</h2>
          ) : null}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            {/* Left rail: visuals. The radar joins the structure here later. */}
            <aside className="space-y-3">
              <MoleculeStructure smiles={analysis.data.canonical_smiles} />
              <div className="space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Canonical SMILES
                </p>
                <p className="break-all font-mono text-[11px] text-muted-foreground">
                  {analysis.data.canonical_smiles}
                </p>
              </div>
            </aside>

            {/* Right column: the bordered container; ReportSections band it. */}
            <div className="overflow-hidden rounded-lg border border-border">
              <PropertyTable properties={analysis.data.properties} />
              <SolubilityCard solubility={analysis.data.solubility} />
              <DruglikenessCard druglikeness={analysis.data.druglikeness} />
              <AlertsCard alerts={analysis.data.alerts} />
              <ScoresCard
                qed={analysis.data.qed}
                saScore={analysis.data.sa_score}
                saScoreNote={analysis.data.sa_score_note}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

interface ErrorMessageProps {
  error: ReturnType<typeof useMoleculeAnalysis>["error"]
}

function ErrorMessage({ error }: ErrorMessageProps) {
  // A response with a status code means the backend was reached. A 400 here is
  // an invalid SMILES, and the backend supplies a human-readable `detail`.
  // No response object means the request never arrived — backend unreachable.
  const isInvalidSmiles = error?.response?.status === 400
  const detail = error?.response?.data?.detail

  const message = isInvalidSmiles
    ? (detail ??
      "That SMILES string could not be parsed. Check the syntax, or try one of the example molecules.")
    : "Could not reach the analysis server. The backend may not be running — start it and try again."

  return (
    <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
      {message}
    </div>
  )
}
