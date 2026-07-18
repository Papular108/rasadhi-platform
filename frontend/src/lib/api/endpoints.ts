/**
 * API endpoint definitions.
 *
 * Centralizes endpoint paths so they can be updated in one place
 * when backend routes change.
 */

export const ENDPOINTS = {
  health: "/health",
  molecule: {
    analyze: "/api/molecule/analyze",
  },
  preprocessing: {
    run: "/api/preprocessing/run",
  },
  clustering: {
    run: "/api/clustering/run",
  },
  splitting: {
    run: "/api/splitting/run",
  },
  similarity: {
    search: "/api/similarity/search",
  },
  converter: {
    convert: "/api/converter/convert",
  },
} as const
