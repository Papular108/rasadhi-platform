import { Check, TriangleAlert } from "lucide-react"

import { ReportSection } from "@/features/explorer/components/ReportSection"

import type { AlertMatch, MedChemAlerts } from "@/features/explorer/types"

interface AlertsCardProps {
  alerts: MedChemAlerts
}

interface AlertRow {
  name: string
  gloss: string
  result: AlertMatch
}

// NOTE: colour semantics are INVERTED relative to DruglikenessCard.
// There, passed=true is good (green). Here, matched=true means the molecule
// HIT a structural alert, which is a concern — so no-match is green and a
// match is amber (a flag for review, not a failure, hence not red).
function AlertRowView({ name, gloss, result }: AlertRow) {
  return (
    <div className="border-b border-border py-1.5 text-[13px] last:border-0">
      <div className="flex items-center justify-between gap-4">
        <span className="font-medium">{name}</span>
        {result.matched ? (
          <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
            <TriangleAlert className="h-4 w-4" />
            <span>1 alert</span>
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <Check className="h-4 w-4" />
            <span>No alerts</span>
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{gloss}</p>
      {result.matched && result.description ? (
        <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
          Matched pattern:{" "}
          <span className="font-mono">{result.description}</span>
        </p>
      ) : null}
    </div>
  )
}

export function AlertsCard({ alerts }: AlertsCardProps) {
  const rows: AlertRow[] = [
    {
      name: "PAINS",
      gloss:
        "Pan-assay interference compounds, which often produce false positives in screening.",
      result: alerts.pains,
    },
    {
      name: "Brenk",
      gloss:
        "Fragments considered reactive, metabolically unstable, or toxicophoric.",
      result: alerts.brenk,
    },
  ]

  return (
    <ReportSection
      title="Structural alerts"
      description="These flag substructures associated with assay interference or with reactive, unstable, or toxic behaviour. A match warrants a closer look — it is not a failure."
    >
      {rows.map((row) => (
        <AlertRowView
          key={row.name}
          name={row.name}
          gloss={row.gloss}
          result={row.result}
        />
      ))}
    </ReportSection>
  )
}

export default AlertsCard
