/**
 * Axios API client for the Rasadhi Platform backend.
 *
 * Configured to use environment variables for base URL, with sensible
 * defaults for local development.
 */

import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api"

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
