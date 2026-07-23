/**
 * Axios API client for the Rasadhi Platform backend.
 *
 * Configured to use environment variables for base URL, with sensible
 * defaults for local development.
 */

import axios from "axios"

// Empty in dev: paths stay relative (e.g. "/api/health") and the Vite proxy
// forwards /api/* to the backend. In production VITE_API_URL is the deployed
// backend origin, so the same relative path becomes an absolute request.
// Callers always write the full backend path, including the /api prefix.
const API_BASE_URL = import.meta.env.VITE_API_URL ?? ""

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
})

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling can be added here
    return Promise.reject(error)
  }
)
