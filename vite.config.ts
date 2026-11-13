import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

const MOTION_LAB_ROUTES = [
  {
    id: 'liquid-metal-ball',
    title: 'Liquid Metal Ball — Motion Lab | Yogananth J',
    description:
      'Interactive fluid chrome surface tension and radial harmonic oscillator physics experiment in Canvas 2D by Yogananth J.',
  },
  {
    id: 'atomic-network',
    title: 'Atomic Network — Motion Lab | Yogananth J',
    description:
      'Interactive molecular spring lattice with electrostatic repulsion, spatial bonds, and shockwave propagation in Canvas 2D.',
  },
  {
    id: 'chaotic-typography',
    title: 'Chaotic Typography — Motion Lab | Yogananth J',
    description:
      'Interactive per-character physics playground with bounce, explosion, elastic stretch, and baseline recovery using GSAP 3.',
  },
  {
    id: 'infinite-tunnel',
    title: 'Infinite Tunnel — Motion Lab | Yogananth J',
    description:
      'Continuous modulo-depth geometric perspective tunnel with damped camera parallax and vertex fog in Canvas 2D.',
  },
  {
    id: 'galactic-core',
    title: 'Galactic Particle Core — Motion Lab | Yogananth J',
    description:
      'Interactive 2,600+ particle barred spiral galaxy simulation with Keplerian rotation, stellar repulsion, and 3D camera tilt.',
  },
  {
    id: 'helium-balloon',
    title: 'Helium Balloon Playground — Motion Lab | Yogananth J',
    description:
      'Interactive Verlet string chain, Archimedean buoyancy, and draggable cardboard tag physics simulation in Canvas 2D.',
  },
];

function escapeHtmlAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function motionLabRouteHtmlPlugin(): Plugin {
  return {
    name: 'motion-lab-route-html',
    closeBundle() {
      const distDir = path.resolve(import.meta.dirname, 'dist');
      const indexHtmlPath = path.join(distDir, 'index.html');
      if (!fs.existsSync(indexHtmlPath)) return;

      const baseHtml = fs.readFileSync(indexHtmlPath, 'utf8');
      const baseOrigin = 'https://iam-mjyogananth.pages.dev';

      for (const route of MOTION_LAB_ROUTES) {
        const routeUrl = `${baseOrigin}/motion-lab/${route.id}`;
        const safeTitle = escapeHtmlAttr(route.title);
        const safeDesc = escapeHtmlAttr(route.description);

        const routeHtml = baseHtml
          .replace(/<title>[\s\S]*?<\/title>/, `<title>${safeTitle}</title>`)
          .replace(
            /<meta name="description" content="[^"]*"\s*\/>/,
            `<meta name="description" content="${safeDesc}" />`
          )
          .replace(
            /<link rel="canonical" href="[^"]*"\s*\/>/,
            `<link rel="canonical" href="${routeUrl}" />`
          )
          .replace(
            /<meta property="og:title" content="[^"]*"\s*\/>/,
            `<meta property="og:title" content="${safeTitle}" />`
          )
          .replace(
            /<meta property="og:description" content="[^"]*"\s*\/>/,
            `<meta property="og:description" content="${safeDesc}" />`
          )
          .replace(
            /<meta property="og:url" content="[^"]*"\s*\/>/,
            `<meta property="og:url" content="${routeUrl}" />`
          )
          .replace(
            /<meta name="twitter:url" content="[^"]*"\s*\/>/,
            `<meta name="twitter:url" content="${routeUrl}" />`
          )
          .replace(
            /<meta name="twitter:title" content="[^"]*"\s*\/>/,
            `<meta name="twitter:title" content="${safeTitle}" />`
          )
          .replace(
            /<meta name="twitter:description" content="[^"]*"\s*\/>/,
            `<meta name="twitter:description" content="${safeDesc}" />`
          );

        const outDir = path.join(distDir, 'motion-lab', route.id);
        fs.mkdirSync(outDir, {recursive: true});
        fs.writeFileSync(path.join(outDir, 'index.html'), routeHtml, 'utf8');
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), motionLabRouteHtmlPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    build: {
      rolldownOptions: {
        output: {
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
