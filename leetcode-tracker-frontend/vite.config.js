import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // proxy any request starting with /companies, /questions or /users
      '/companies': 'http://localhost:3000',
      '/questions': 'http://localhost:3000',
      '/users':     'http://localhost:3000'
    }
  }
})
