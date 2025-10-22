import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './', // 确保资源使用相对路径
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
