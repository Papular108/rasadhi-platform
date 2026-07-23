import { ReportSection } from "@/features/explorer/components/ReportSection"

import type { SolubilityResult } from "@/features/explorer/types"

interface SolubilityCardProps {
  solubility: SolubilityResult
}

/** Three significant figures, without trailing scientific notation. */
function toThreeSigFigs(value: number): string {
  if (value === 0) return "0"
  return Number(value.toPrecision(3)).toString()
}

/** Exponential below 0.001, otherwise three significant figures. */
function molPerLitre(value: number): string {
  if (value !== 0 && Math.abs(value) < 0.001) {
    return value.toExponential(2)
  }
  return toThreeSigFigs(value)
}

interface Row {
  label: string
  note?: string
  value: string
  unit?: string
}

export function SolubilityCard({ solubility }: SolubilityCardProps) {
  return (
    <ReportSection
      title="Water solubility"
      description="Estimated with the ESOL model (Delaney, 2004) — a prediction from structure, not a measured value."
    >
      {solubility.error ? (
        <p className="py-1.5 text-xs text-muted-foreground">
          {solubility.error}
        </p>
      ) : (
        <SolubilityRows solubility={solubility} />
      )}
    </ReportSection>
  )
}

function SolubilityRows({ solubility }: SolubilityCardProps) {
  const rows: Row[] = [
    {
      label: "Log S",
      note: "log₁₀ of solubility in mol/L",
      value: solubility.log_s.toFixed(2),
    },
    {
      label: "Solubility (mass)",
      value: toThreeSigFigs(solubility.solubility_mg_ml),
      unit: "mg/mL",
    },
    {
      label: "Solubility (molar)",
      value: molPerLitre(solubility.solubility_mol_l),
      unit: "mol/L",
    },
    {
      label: "Class",
      value: solubility.solubility_class,
    },
  ]

  return (
    <table className="w-full text-[13px]">
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={`${row.label}-${i}`}
            className="border-b border-border last:border-0"
          >
            <td className="py-1.5 pr-4">
              <div className="font-medium">{row.label}</div>
              {row.note ? (
                <div className="text-xs text-muted-foreground">{row.note}</div>
              ) : null}
            </td>
            <td className="py-1.5 text-right font-mono tabular-nums">
              {row.value}
              {row.unit ? (
                <span className="text-muted-foreground">{" "}{row.unit}</span>
              ) : null}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default SolubilityCard
