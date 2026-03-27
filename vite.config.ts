import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  base: '/krneldatabase/',  // 👈 THIS is the fix

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
