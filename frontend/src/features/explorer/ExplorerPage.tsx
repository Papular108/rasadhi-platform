/**
 * Molecule Explorer feature page.
 *
 * Accepts one or several molecules (via the batch endpoint) and branches on the
 * result: a single molecule renders the full two-column report; several render
 * a comparison table with expandable per-molecule detail. Handles the idle,
 * loading, network-error, and success states.
 */

import { SmilesInput } from "@/features/explorer/components/SmilesInput"
import { MoleculeReport } from "@/features/explorer/components/MoleculeReport"
import { BatchResultsTable } from "@/features/explorer/components/BatchResultsTable"
import { useMoleculeAnalysis } from "@/features/explorer/hooks/useMoleculeAnalysis"
import type { ParsedEntry } from "@/features/explorer/lib/parseSmilesInput"
import type { MoleculeBatchResponse } from "@/features/explorer/types"

export default function ExplorerPage() {
  const analysis = useMoleculeAnalysis()

  const handleAnalyze = (entries: ParsedEntry[]) => {
    analysis.mutate(entries)
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

      {analysis.isError ? <NetworkErrorMessage /> : null}

      {analysis.isSuccess ? <SuccessView response={analysis.data} /> : null}
    </div>
  )
}

function SuccessView({ response }: { response: MoleculeBatchResponse }) {
  // A single-molecule request keeps the full-page report experience.
  if (response.items.length === 1) {
    const item = response.items[0]
    if (item.success && item.result) {
      return <MoleculeReport result={item.result} name={item.name} />
    }
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        {item.error ?? "That molecule could not be analyzed."} Check the SMILES
        syntax, or try one of the examples.
      </div>
    )
  }

  return <BatchResultsTable response={response} />
}

function NetworkErrorMessage() {
  // The batch endpoint returns 200 even when individual molecules fail (those
  // come back as failed items), so reaching this branch means the request never
  // completed — the backend is unreachable.
  return (
    <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
      Could not reach the analysis server. The backend may not be running —
      start it and try again.
    </div>
  )
}
