import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './', // 使用相对路径
  build: {
    outDir: 'docs', // 改为 docs
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    host: true
  }
})
