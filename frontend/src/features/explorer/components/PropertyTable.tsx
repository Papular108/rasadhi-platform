import { ReportSection } from "@/features/explorer/components/ReportSection"

import type { PhysicoChemicalProperties } from "@/features/explorer/types"

interface PropertyTableProps {
  properties: PhysicoChemicalProperties
}

interface PropertyRow {
  abbr: string
  name: string
  unit: string | null
  value: string
}

export function PropertyTable({ properties }: PropertyTableProps) {
  const rows: PropertyRow[] = [
    {
      abbr: "MW",
      name: "Molecular weight",
      unit: "g/mol",
      value: properties.MW.toFixed(2),
    },
    {
      abbr: "LogP",
      name: "Lipophilicity",
      unit: null,
      value: properties.LogP.toFixed(2),
    },
    {
      abbr: "TPSA",
      name: "Polar surface area",
      unit: "Å²",
      value: properties.TPSA.toFixed(1),
    },
    {
      abbr: "HBD",
      name: "Hydrogen bond donors",
      unit: null,
      value: String(properties.HBD),
    },
    {
      abbr: "HBA",
      name: "Hydrogen bond acceptors",
      unit: null,
      value: String(properties.HBA),
    },
    {
      abbr: "RotatableBonds",
      name: "Rotatable bonds",
      unit: null,
      value: String(properties.RotatableBonds),
    },
    {
      abbr: "AromaticRings",
      name: "Aromatic rings",
      unit: null,
      value: String(properties.AromaticRings),
    },
  ]

  return (
    <ReportSection title="Physicochemical properties">
      <table className="w-full text-[13px]">
        <tbody>
          {rows.map((row) => (
            <tr key={row.abbr} className="border-b border-border last:border-0">
              <td className="py-1.5 pr-4">
                <div className="font-medium">{row.name}</div>
                <div className="text-xs text-muted-foreground">{row.abbr}</div>
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
    </ReportSection>
  )
}

export default PropertyTable
