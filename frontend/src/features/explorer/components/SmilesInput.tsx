import { useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  parseSmilesInput,
  type ParsedEntry,
} from "@/features/explorer/lib/parseSmilesInput"

const MAX_MOLECULES = 50

interface SmilesInputProps {
  onAnalyze: (entries: ParsedEntry[]) => void
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

const PLACEHOLDER = [
  "CC(=O)Oc1ccccc1C(=O)O",
  "Cn1cnc2c1c(=O)n(C)c(=O)n2C  Caffeine",
].join("\n")

export function SmilesInput({ onAnalyze, isLoading }: SmilesInputProps) {
  const [value, setValue] = useState("")

  const entries = parseSmilesInput(value)
  const count = entries.length
  const overLimit = count > MAX_MOLECULES

  const submit = () => {
    if (isLoading || count === 0 || overLimit) return
    onAnalyze(entries)
  }

  // Examples replace the textarea and analyze immediately.
  const loadAndAnalyze = (text: string) => {
    if (isLoading) return
    setValue(text)
    onAnalyze(parseSmilesInput(text))
  }

  const runExample = (example: ExampleMolecule) =>
    loadAndAnalyze(`${example.smiles} ${example.name}`)

  const runAllFour = () =>
    loadAndAnalyze(EXAMPLES.map((e) => `${e.smiles} ${e.name}`).join("\n"))

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Molecule Explorer
        </h1>
        <p className="mt-1 text-muted-foreground">
          Analyze one molecule or several at once for their physicochemical
          properties and druglikeness. New to this? Pick an example below to see
          how it works.
        </p>
      </div>

      <div className="space-y-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={5}
          placeholder={PLACEHOLDER}
          aria-label="SMILES strings, one per line"
          className={cn(
            "flex w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          )}
        />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            One molecule per line, optionally followed by a space or tab and a
            name. Up to {MAX_MOLECULES} at a time.
          </p>
          {count > 0 ? (
            <span
              className={cn(
                "text-xs tabular-nums",
                overLimit ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {count} molecule{count === 1 ? "" : "s"}
            </span>
          ) : null}
        </div>

        {overLimit ? (
          <p className="text-xs text-destructive">
            That is more than {MAX_MOLECULES} molecules. Remove some lines — for
            larger sets, the dataset workflow (coming later) will handle files.
          </p>
        ) : null}

        <Button onClick={submit} disabled={isLoading || count === 0 || overLimit}>
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
        <Button
          variant="outline"
          size="sm"
          onClick={runAllFour}
          disabled={isLoading}
        >
          All four
        </Button>
      </div>
    </div>
  )
}

export default SmilesInput
