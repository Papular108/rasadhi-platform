import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    // Local-dev only: forward /api/* to the backend so the browser can use
    // relative paths without CORS. No rewrite — the backend serves everything
    // under /api, so paths pass through unchanged. In production there is no
    // proxy: VITE_API_URL points directly at the deployed backend origin.
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
