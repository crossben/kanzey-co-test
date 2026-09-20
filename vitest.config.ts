import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    // Le build Next.js et les tests ne se marchent pas dessus.
    exclude: ['node_modules/**', '.next/**'],
    // Les premiers tests arrivent en phase 1 ; d'ici là `pnpm test` ne doit
    // pas échouer sur un dépôt fraîchement cloné.
    passWithNoTests: true,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
