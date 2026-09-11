import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// NOTE: `base` is '/' because this is a React Router SPA — asset URLs must
// stay absolute so a direct/refreshed load of a nested route (e.g.
// /admin/login) still finds /assets/*.js instead of resolving it relative
// to the current path (which would 404). Deploying to the domain root on
// HostAfrica (the standard case for a company's main site) needs no
// change. If this build is ever placed in a sub-folder instead (e.g.
// public_html/preview/), set base to that sub-folder path (e.g.
// '/preview/') before building — see docs/DEPLOYMENT.md.
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 4173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 900,
  },
})
