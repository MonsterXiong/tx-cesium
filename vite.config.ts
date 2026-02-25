import { defineConfig } from 'vite'
import reactSwc from '@vitejs/plugin-react-swc'
import UnoCSS from 'unocss/vite'
import cesium from 'vite-plugin-cesium'
import path from 'path'
import glsl from 'vite-plugin-glsl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    reactSwc(),
    UnoCSS(),
    cesium(),
    glsl(), // 添加这一行
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true, // 允许局域网访问，等同于 host: '0.0.0.0'
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:8080', // 后端地址
        changeOrigin: true,
        // 如果后端不需要 /api 前缀，取消注释下面这行
        // rewrite: (path) => path.replace(/^\/api/, ''),
        // configure: (proxy, options) => {
        //   proxy.on('proxyReq', (proxyReq, req, res) => {
        //     // 添加认证头
        //     proxyReq.setHeader('Authorization', 'Bearer your-token')
        //   })
        // },
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'antd-vendor': ['antd'],
        },
      },
    },
  },
})
