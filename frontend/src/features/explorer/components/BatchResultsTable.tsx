import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { MoleculeReport } from "@/features/explorer/components/MoleculeReport"

import type {
  DruglikenessResults,
  MedChemAlerts,
  MoleculeBatchItem,
  MoleculeBatchResponse,
} from "@/features/explorer/types"

interface BatchResultsTableProps {
  response: MoleculeBatchResponse
}

function rulesPassed(druglikeness: DruglikenessResults): number {
  return [
    druglikeness.lipinski,
    druglikeness.veber,
    druglikeness.ghose,
    druglikeness.egan,
    druglikeness.muegge,
  ].filter((rule) => rule.passed).length
}

function alertsMatched(alerts: MedChemAlerts): number {
  return [alerts.pains, alerts.brenk].filter((a) => a.matched).length
}

export function BatchResultsTable({ response }: BatchResultsTableProps) {
  const [expanded, setExpanded] = useState<number | null>(null)

  const { total, succeeded } = response
  const summary =
    succeeded === total
      ? `${total} molecule${total === 1 ? "" : "s"} analyzed`
      : `${succeeded} of ${total} analyzed`

  const toggle = (index: number) =>
    setExpanded((current) => (current === index ? null : index))

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{summary}</p>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full table-fixed text-[13px]">
          <colgroup>
            <col className="w-[40%]" />
            <col className="w-[13%]" />
            <col className="w-[12%]" />
            <col className="w-[13%]" />
            <col className="w-[11%]" />
            <col className="w-[11%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-border bg-muted text-left text-xs text-muted-foreground">
              <th className="px-3 py-1.5 font-medium">Molecule</th>
              <th className="px-3 py-1.5 text-right font-medium">MW (g/mol)</th>
              <th className="px-3 py-1.5 text-right font-medium">LogP</th>
              <th className="px-3 py-1.5 text-right font-medium">TPSA (Å²)</th>
              <th className="px-3 py-1.5 text-right font-medium">Rules</th>
              <th className="px-3 py-1.5 text-right font-medium">Alerts</th>
            </tr>
          </thead>
          <tbody>
            {response.items.map((item) => (
              <BatchRow
                key={item.index}
                item={item}
                isExpanded={expanded === item.index}
                onToggle={() => toggle(item.index)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface BatchRowProps {
  item: MoleculeBatchItem
  isExpanded: boolean
  onToggle: () => void
}

function BatchRow({ item, isExpanded, onToggle }: BatchRowProps) {
  const label = item.name ?? item.input_smiles

  // Failed item: a visible row so the user sees which input failed. Not
  // expandable — there is no report to show.
  if (!item.success || !item.result) {
    return (
      <tr className="border-b border-border last:border-0">
        <td className="px-3 py-1.5">
          <span className="block truncate" title={item.input_smiles}>
            {label}
          </span>
        </td>
        <td className="px-3 py-1.5 text-destructive" colSpan={5}>
          {item.error ?? "Analysis failed"}
        </td>
      </tr>
    )
  }

  const { properties, druglikeness, alerts } = item.result
  const matched = alertsMatched(alerts)

  return (
    <>
      <tr
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onToggle()
          }
        }}
        className="cursor-pointer border-b border-border last:border-0 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        <td className="px-3 py-1.5">
          <span className="flex items-center gap-1.5">
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5 shrink-0" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            )}
            <span className="truncate" title={item.input_smiles}>
              {label}
            </span>
          </span>
        </td>
        <td className="px-3 py-1.5 text-right font-mono tabular-nums">
          {properties.MW.toFixed(2)}
        </td>
        <td className="px-3 py-1.5 text-right font-mono tabular-nums">
          {properties.LogP.toFixed(2)}
        </td>
        <td className="px-3 py-1.5 text-right font-mono tabular-nums">
          {properties.TPSA.toFixed(1)}
        </td>
        <td className="px-3 py-1.5 text-right font-mono tabular-nums">
          {rulesPassed(druglikeness)}/5
        </td>
        <td
          className={cn(
            "px-3 py-1.5 text-right font-mono tabular-nums",
            matched > 0
              ? "text-amber-600 dark:text-amber-400"
              : "text-muted-foreground",
          )}
        >
          {matched}
        </td>
      </tr>

      {isExpanded ? (
        <tr className="border-b border-border last:border-0">
          <td colSpan={6} className="bg-muted/30 px-3 py-4">
            <MoleculeReport result={item.result} name={item.name} />
          </td>
        </tr>
      ) : null}
    </>
  )
}

export default BatchResultsTable
