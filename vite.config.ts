import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
      dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-dom/client',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'framer-motion',
        'lucide-react',
        'gsap',
        'gsap/ScrollTrigger',
        'd3',
        'firebase/app',
        'firebase/auth',
        'firebase/firestore/lite',
        'qrcode',
        'html2canvas',
        'jspdf',
      ],
    },
    build: {
      rolldownOptions: {
        output: {
          chunkFileNames(chunkInfo) {
            const safeName = chunkInfo.name
              .replace(/ServerErrorPage/g, 'Status500Page')
              .replace(/ErrorHubModal/g, 'StatusHubModal')
              .replace(/error/gi, 'status');
            return `assets/${safeName}-[hash].js`;
          },
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('/react-dom/') || id.includes('/react/') || id.includes('/scheduler/')) {
              return 'vendor-react';
            }
            if (id.includes('/framer-motion/')) {
              return 'vendor-motion';
            }
            if (id.includes('/gsap/')) {
              return 'vendor-gsap';
            }
            if (id.includes('/firebase/') || id.includes('/@firebase/')) {
              return 'vendor-firebase';
            }
            if (id.includes('/d3') || id.includes('/d3-')) {
              return 'vendor-d3';
            }
            if (id.includes('/lucide-react/')) {
              return 'vendor-icons';
            }
            return undefined;
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
