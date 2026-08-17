import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const root = dirname(fileURLToPath(import.meta.url));

// Tiene que coincidir con las páginas que genera scripts/build-pages.mjs:
// lo que falte aquí se genera pero no entra en dist/ y acaba en un 404.
export const PAGES = ['', 'nosotros', 'servicios', 'proyectos', 'cotizador', 'equipo', 'muebles', 'blog', 'contacto'];

export default defineConfig({
  appType: 'mpa',
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://127.0.0.1:8791', changeOrigin: true },
    },
  },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 2048,
    rollupOptions: {
      input: Object.fromEntries(PAGES.map((p) => [p || 'index', resolve(root, p, 'index.html')])),
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap'],
        },
      },
    },
  },
});
