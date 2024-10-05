import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // 자동 업데이트 설정
      devOptions: {
        enabled: true, // 개발 환경에서도 PWA 작동하게 설정
      },
      includeAssets: [
        'favicon.svg',
        'robots.txt',
        'apple-touch-icon.png',
        'assets/icons/*',
        'icons/*',
        'screenshots/*',
      ], // 캐싱할 자산 목록

      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB 이하 파일 캐싱
      },
      manifest: {
        name: 'Challet',
        short_name: 'Challet',
        description: 'Your Challet Application',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/icons/favicon-196x196.png',
            sizes: '196x196',
            type: 'image/png',
          },
          {
            src: '/icons/apple-touch-icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/favicon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'any',
          },
        ],
      },
    }),
  ],
  server: {
    hmr: {
      overlay: false,
      protocol: 'ws',
    },
    // proxy: {
    //   '/api/challet/': {
    //     target: 'http://localhost:8000', // 실제 API 서버 주소
    //     changeOrigin: true, // 요청 헤더의 Origin을 백엔드 서버 주소로 변경
    //     rewrite: (path) => path.replace(/^\/challet-service/, ''),
    //   },
    // },
  },
});
