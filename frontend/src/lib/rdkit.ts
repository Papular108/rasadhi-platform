/**
 * RDKit-JS module initialization.
 *
 * RDKit-JS is RDKit compiled to WebAssembly. Initialization is async (~1s) and
 * must happen exactly once for the whole app, so the promise is cached at
 * module scope: every caller of getRDKit() awaits the same initialization.
 *
 * Import shape: @rdkit/rdkit's runtime entry (RDKit_minimal.js) is a UMD module
 * whose default export IS the async loader. Its shipped .d.ts declares only
 * named types (RDKitModule, RDKitLoader, ...) with no default export, so we
 * import the namespace and pull the loader off `.default`, typed via
 * RDKitLoader. Verified against @rdkit/rdkit 2025.3.4-1.0.0.
 */

import type { RDKitLoader, RDKitModule } from "@rdkit/rdkit"
import * as rdkitModule from "@rdkit/rdkit"

const initRDKitModule = (rdkitModule as unknown as { default: RDKitLoader })
  .default

let rdkitPromise: Promise<RDKitModule> | null = null

export function getRDKit(): Promise<RDKitModule> {
  if (!rdkitPromise) {
    // locateFile tells RDKit-JS where to fetch the .wasm binary. The file is
    // served from public/ (see frontend/README.md). Without this the loader
    // looks in the wrong place and initialization fails silently.
    rdkitPromise = initRDKitModule({
      locateFile: () => "/RDKit_minimal.wasm",
    })
  }
  return rdkitPromise
}

export type { RDKitModule }
