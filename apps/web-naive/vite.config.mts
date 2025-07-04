import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '/v1'),
            // mock代理目标地址
            target: 'http://localhost:8080/api',
            ws: true,
          },
        },
      },
    },
  };
});
