import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SmilesInputProps {
  onAnalyze: (smiles: string, name?: string) => void
  isLoading: boolean
}

interface ExampleMolecule {
  name: string
  smiles: string
}

const EXAMPLES: ExampleMolecule[] = [
  { name: "Aspirin", smiles: "CC(=O)Oc1ccccc1C(=O)O" },
  { name: "Caffeine", smiles: "Cn1cnc2c1c(=O)n(C)c(=O)n2C" },
  { name: "Ibuprofen", smiles: "CC(C)Cc1ccc(cc1)C(C)C(=O)O" },
  { name: "Paracetamol", smiles: "CC(=O)Nc1ccc(O)cc1" },
]

export function SmilesInput({ onAnalyze, isLoading }: SmilesInputProps) {
  const [value, setValue] = useState("")

  const submit = () => {
    const smiles = value.trim()
    if (!smiles || isLoading) return
    onAnalyze(smiles)
  }

  const runExample = (example: ExampleMolecule) => {
    if (isLoading) return
    setValue(example.smiles)
    onAnalyze(example.smiles, example.name)
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Molecule Explorer
        </h1>
        <p className="mt-1 text-muted-foreground">
          Enter a molecule and get its physicochemical properties and
          druglikeness at a glance. New to this? Pick one of the examples below
          to see how it works.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit()
          }}
          placeholder="Paste a SMILES string, e.g. CC(=O)Oc1ccccc1C(=O)O"
          aria-label="SMILES string"
          className="font-mono"
        />
        <Button onClick={submit} disabled={isLoading || !value.trim()}>
          {isLoading ? "Analyzing…" : "Analyze"}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Or try an example:</span>
        {EXAMPLES.map((example) => (
          <Button
            key={example.name}
            variant="outline"
            size="sm"
            onClick={() => runExample(example)}
            disabled={isLoading}
          >
            {example.name}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default SmilesInput
