import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/model-viewer-3d/', // 👈 这句很关键！
  plugins: [vue()],
  server: {
    host: true, // 👈 允许局域网访问
    port: 5173  // 可根据你实际端口调整
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
