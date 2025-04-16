import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// ✅ 判断是否为 GitHub Pages 构建模式
const isGithubPages = process.env.NODE_ENV === 'production' && process.env.MODE === 'ghpages'


// https://vite.dev/config/
export default defineConfig({
  base: '/model-viewer-3d/', // 👈 这句很关键！
  plugins: [vue()],
  server: {
    host: true, // 👈 允许局域网访问
    port: 5173,  // 可根据你实际端口调整
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  define: {
    // ✅ 注入全局变量，在 router 里可以判断用什么 history 模式
    __IS_GHPAGES__: JSON.stringify(isGithubPages)
  }
})
