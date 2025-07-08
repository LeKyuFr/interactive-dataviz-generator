import { defineConfig } from 'vite'

// Configuration Vite pour GitHub Pages
export default defineConfig({
  base: '/interactive-dataviz-generator/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          chartjs: ['chart.js'],
          utils: ['canvas-confetti']
        }
      }
    }
  },
  server: {
    port: 5173,
    open: true
  },
  preview: {
    port: 4173,
    open: true
  }
})
