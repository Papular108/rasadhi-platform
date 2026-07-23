import { Check, X } from "lucide-react"

import { ReportSection } from "@/features/explorer/components/ReportSection"

import type { DruglikenessResults, RuleResult } from "@/features/explorer/types"

interface DruglikenessCardProps {
  druglikeness: DruglikenessResults
}

interface RuleRow {
  name: string
  result: RuleResult
}

function RuleRowView({ name, result }: RuleRow) {
  return (
    <div className="border-b border-border py-1.5 text-[13px] last:border-0">
      <div className="flex items-center justify-between">
        <span className="font-medium">{name}</span>
        {result.passed ? (
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <Check className="h-4 w-4" />
            <span>Passes</span>
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-destructive">
            <X className="h-4 w-4" />
            <span>Fails</span>
          </span>
        )}
      </div>
      {!result.passed && result.reason ? (
        <p className="mt-1 text-xs text-muted-foreground">{result.reason}</p>
      ) : null}
    </div>
  )
}

export function DruglikenessCard({ druglikeness }: DruglikenessCardProps) {
  const rows: RuleRow[] = [
    { name: "Lipinski", result: druglikeness.lipinski },
    { name: "Veber", result: druglikeness.veber },
    { name: "Ghose", result: druglikeness.ghose },
    { name: "Egan", result: druglikeness.egan },
    { name: "Muegge", result: druglikeness.muegge },
  ]

  return (
    <ReportSection
      title="Druglikeness rules"
      description="Published rule sets that estimate whether a compound is likely to behave like an oral drug. When a rule fails, the reason names the property that broke it."
    >
      {rows.map((row) => (
        <RuleRowView key={row.name} name={row.name} result={row.result} />
      ))}
    </ReportSection>
  )
}

export default DruglikenessCard
