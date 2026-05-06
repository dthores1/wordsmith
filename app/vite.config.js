import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// to test locally, run `gunicorn -b 0.0.0.0:8080 server:app` from the repo root in another terminal
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/submit-score': 'http://localhost:8080',
      '/leaderboard': 'http://localhost:8080',
    },
  },
})
