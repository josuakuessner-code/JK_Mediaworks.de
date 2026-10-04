import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Vorschau-Build (VITE_PREVIEW=1) bettet Bilder als data-URI ein
  build: {
    assetsInlineLimit: process.env.VITE_PREVIEW === '1' ? 10_000_000 : 4096,
    // Die Vorschau ist eine einzelne HTML-Datei, daher dort keine nachgeladenen Chunks
    rollupOptions: { output: { inlineDynamicImports: process.env.VITE_PREVIEW === '1' } },
  },
})
