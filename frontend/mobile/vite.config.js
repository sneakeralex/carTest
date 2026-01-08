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
      // Only proxy /artemis to the upstream Artemis host during development
      '/artemis': {
        target: 'https://cartest.douwifi.cn',
        changeOrigin: true,
        secure: false,
        // keep the /artemis prefix when forwarding
        rewrite: (path) => path.replace(/^\/artemis/, '/artemis'),
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