/**
 * TanStack Query mutation wrapping POST /api/molecule/analyze.
 *
 * useMutation (not useQuery) because analysis fires on a user action, not on
 * mount. The request path is "/api/molecule/analyze": apiClient's baseURL is
 * "/api", and the Vite dev proxy strips the FIRST "/api" before forwarding, so
 * the browser path "/api/api/molecule/analyze" reaches the backend as
 * "/api/molecule/analyze". Verified empirically against the running server.
 */

import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"

import { apiClient } from "@/lib/api/client"

import type {
  MoleculeAnalysisRequest,
  MoleculeAnalysisResponse,
} from "@/features/explorer/types"

export function useMoleculeAnalysis() {
  return useMutation<
    MoleculeAnalysisResponse,
    AxiosError<{ detail: string }>,
    MoleculeAnalysisRequest
  >({
    mutationFn: async (request) => {
      const { data } = await apiClient.post<MoleculeAnalysisResponse>(
        "/api/molecule/analyze",
        request,
      )
      return data
    },
  })
}
