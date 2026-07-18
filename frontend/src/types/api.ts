/**
 * Shared TypeScript types for API requests and responses.
 *
 * Will grow as endpoints are implemented.
 */

export interface HealthResponse {
  status: string
}

export interface RootResponse {
  name: string
  version: string
  docs: string
}

// Placeholder — will be replaced with real types as endpoints are built
export interface Molecule {
  smiles: string
  name?: string
}
