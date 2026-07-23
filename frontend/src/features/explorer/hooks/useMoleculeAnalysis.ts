/**
 * TanStack Query mutation wrapping POST /api/molecule/analyze-batch.
 *
 * The Explorer always calls the batch endpoint, even for a single molecule —
 * one code path, and the number of items in the response decides how the UI
 * renders. useMutation (not useQuery) because analysis fires on a user action.
 *
 * Path: "/api/molecule/analyze-batch". apiClient's baseURL is "/api" and the
 * Vite dev proxy strips only the FIRST "/api", so the browser path
 * "/api/api/molecule/analyze-batch" reaches the backend as
 * "/api/molecule/analyze-batch". Verified in Session 1.4.
 */

import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"

import { apiClient } from "@/lib/api/client"
import type { ParsedEntry } from "@/features/explorer/lib/parseSmilesInput"

import type { MoleculeBatchResponse } from "@/features/explorer/types"

export function useMoleculeAnalysis() {
  return useMutation<
    MoleculeBatchResponse,
    AxiosError<{ detail: string }>,
    ParsedEntry[]
  >({
    mutationFn: async (entries) => {
      const { data } = await apiClient.post<MoleculeBatchResponse>(
        "/api/molecule/analyze-batch",
        { molecules: entries },
      )
      return data
    },
  })
}
