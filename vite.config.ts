import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('node_modules/@react-three/fiber')) {
            return 'vendor-three'
          }

          if (id.includes('node_modules/gsap')) {
            return 'vendor-gsap'
          }
        },
      },
    },
  },
  plugins: [react()],
})
