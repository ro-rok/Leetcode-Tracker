import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/companies': process.env.VITE_API_URL || 'http://localhost:3000',
      '/questions': process.env.VITE_API_URL || 'http://localhost:3000',
      '/users':     process.env.VITE_API_URL || 'http://localhost:3000',
    }
  }
})
