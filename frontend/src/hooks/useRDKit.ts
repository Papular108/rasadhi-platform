/**
 * Hook exposing the RDKit-JS module and its load state.
 *
 * Initialization is shared across the app via the module-level promise cache in
 * lib/rdkit.ts, so mounting this hook in several components does not re-run the
 * ~1s WASM load. Three states are surfaced because initialization can fail
 * (e.g. the .wasm binary is missing), and a failure must not crash the page.
 */

import { useEffect, useState } from "react"

import { getRDKit } from "@/lib/rdkit"
import type { RDKitModule } from "@/lib/rdkit"

interface UseRDKitResult {
  rdkit: RDKitModule | null
  isLoading: boolean
  error: Error | null
}

export function useRDKit(): UseRDKitResult {
  const [rdkit, setRdkit] = useState<RDKitModule | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let active = true

    getRDKit()
      .then((module) => {
        if (!active) return
        setRdkit(module)
        setIsLoading(false)
      })
      .catch((err: unknown) => {
        if (!active) return
        setError(err instanceof Error ? err : new Error(String(err)))
        setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return { rdkit, isLoading, error }
}
