import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5174,
    proxy: {
      '/auth': {
        target: 'http://localhost:8080/',
        changeOrigin: true,
        secure: false,
      },
      '/events': {
        target: 'http://localhost:8080/',
        changeOrigin: true,
        secure: false,
      },
      '/oauth': {
        target: 'http://localhost:8080/',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})