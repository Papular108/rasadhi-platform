import { useEffect, useState } from "react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useRDKit } from "@/hooks/useRDKit"

interface MoleculeStructureProps {
  smiles: string
  width?: number
  height?: number
}

export function MoleculeStructure({
  smiles,
  width = 300,
  height = 300,
}: MoleculeStructureProps) {
  const { rdkit, isLoading, error } = useRDKit()
  const [svg, setSvg] = useState<string | null>(null)
  const [invalid, setInvalid] = useState(false)

  useEffect(() => {
    if (!rdkit) return

    setInvalid(false)

    // get_mol allocates a molecule in the WASM heap. JavaScript's garbage
    // collector cannot free it, so every get_mol() is paired with delete() in
    // a finally block — including the invalid path. Missing the delete leaks
    // WASM memory on every render.
    const mol = rdkit.get_mol(smiles)
    if (!mol) {
      setInvalid(true)
      setSvg(null)
      return
    }
    try {
      if (!mol.is_valid()) {
        setInvalid(true)
        setSvg(null)
        return
      }
      setSvg(mol.get_svg(width, height))
    } finally {
      mol.delete()
    }
  }, [rdkit, smiles, width, height])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Structure</CardTitle>
      </CardHeader>
      <CardContent>
        {/*
          The structure panel keeps a white background in BOTH themes. RDKit
          draws black bonds and dark atom labels on a transparent background,
          which is invisible on a dark page. White is also the conventional
          way structures are drawn, so this reads as intentional. A CSS invert
          filter was rejected: it corrupts heteroatom colors (O red, N blue).
        */}
        <div
          className="flex items-center justify-center rounded-md border border-border bg-white"
          style={{ width, height }}
        >
          <StructureBody
            isLoading={isLoading}
            error={error}
            invalid={invalid}
            svg={svg}
          />
        </div>
      </CardContent>
    </Card>
  )
}

interface StructureBodyProps {
  isLoading: boolean
  error: Error | null
  invalid: boolean
  svg: string | null
}

function StructureBody({ isLoading, error, invalid, svg }: StructureBodyProps) {
  if (error) {
    return (
      <p className="p-4 text-center text-sm text-muted-foreground">
        Structure rendering is unavailable.
      </p>
    )
  }
  if (isLoading || (!svg && !invalid)) {
    return (
      <p className="p-4 text-center text-sm text-muted-foreground">
        Loading structure viewer…
      </p>
    )
  }
  if (invalid) {
    return (
      <p className="p-4 text-center text-sm text-muted-foreground">
        Structure could not be drawn.
      </p>
    )
  }
  // Safe to inject: this SVG is generated locally by RDKit-JS from a SMILES the
  // backend already validated — it is not user-supplied HTML.
  return <div dangerouslySetInnerHTML={{ __html: svg as string }} />
}

export default MoleculeStructure
