import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'sonner',
        '@blumnai-studio/blumnai-design-system',
      ],
    },
    resolve: {
      alias: {
        '@deskit/task-module': path.resolve(__dirname, 'packages/task-module/src'),
        '@deskit/team-chat': path.resolve(__dirname, 'packages/team-chat/src'),
      },
    },
    server: {
      proxy: {
        '/api/anthropic': {
          target: 'https://api.anthropic.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/anthropic/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('x-api-key', env.ANTHROPIC_API_KEY || '');
              proxyReq.setHeader('anthropic-version', '2023-06-01');
              proxyReq.removeHeader('origin');
              proxyReq.removeHeader('referer');
            });
          },
        },
      },
    },
  };
});
