import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import path from 'path';

export default defineConfig({
  base: '/cartest/',
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver({
          importStyle: false, // 自动导入样式
        })],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    // Improve chunking strategy
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Group Vant components into a single chunk
          if (id.includes('node_modules/vant')) {
            return 'vendor-vant';
          }
          // Group other common dependencies
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    },
    // Improve dynamic import loading
    chunkSizeWarningLimit: 1000
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  server: {
    port: 5173,
    https: false, // 开发环境使用 HTTP，但可以配置 CSP
    cors: {
      origin: ['http://localhost:5173', 'https://localhost:5173'],
      credentials: true
    },
    proxy: {
      '/api': {
        target: 'https://cartest.douwifi.cn',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
        headers: {
          'Accept-Encoding': 'identity'
        }
      },
      '/v1': {
        target: 'https://cartest.douwifi.cn',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/v1/, 'artemis/v1'),
        headers: {
          'Accept-Encoding': 'identity',
          'Connection': 'keep-alive'
        },
        timeout: 30000,
        proxyTimeout: 30000
      },
      '/apiv1': {
        target: 'https://cartest.douwifi.cn',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/apiv1/, 'artemis/api/v1'),
        headers: {
          'Accept-Encoding': 'identity',
          'Connection': 'keep-alive'
        },
        timeout: 30000,
        proxyTimeout: 30000
      }
    }
  }
});