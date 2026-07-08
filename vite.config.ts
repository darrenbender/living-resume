import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served at the domain root (product-counsel.darrenbender.com), not a
// project subpath, so base is '/'.
export default defineConfig({
  base: '/',
  plugins: [react()],
})
