/**
 * Landing page — introduces the platform and verifies backend connectivity.
 *
 * The backend status card demonstrates the full end-to-end integration:
 * Frontend (React) -> Vite proxy -> Backend (FastAPI) -> Response
 */

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"

interface HealthResponse {
  status: string
}

interface RootResponse {
  name: string
  version: string
  docs: string
}

function useBackendHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const response = await apiClient.get<HealthResponse>("/api/health")
      return response.data
    },
  })
}

function useBackendInfo() {
  return useQuery({
    queryKey: ["root"],
    queryFn: async () => {
      const response = await apiClient.get<RootResponse>("/api")
      return response.data
    },
  })
}

export default function HomePage() {
  const health = useBackendHealth()
  const info = useBackendInfo()

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold">Rasadhi Platform</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Cheminformatics platform for QSAR preprocessing, analysis, and modeling.
      </p>

      <div className="mt-12 rounded-lg border p-6">
        <h2 className="text-xl font-semibold">Backend Status</h2>
        <div className="mt-4 space-y-2 text-sm">
          {health.isLoading && (
            <p className="text-muted-foreground">Checking backend...</p>
          )}
          {health.isError && (
            <p className="text-destructive">
              Backend unreachable. Is the server running on port 8000?
            </p>
          )}
          {health.data && (
            <p>
              Status: <span className="font-mono">{health.data.status}</span>
            </p>
          )}
          {info.data && (
            <>
              <p>
                Service: <span className="font-mono">{info.data.name}</span>
              </p>
              <p>
                Version: <span className="font-mono">{info.data.version}</span>
              </p>
              <p>
                API docs:{" "}
                <a
                  href={`http://localhost:8000${info.data.docs}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {info.data.docs}
                </a>
              </p>
            </>
          )}
        </div>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Feature pages are placeholders. Real features begin in Week 2.
      </p>
    </div>
  )
}
