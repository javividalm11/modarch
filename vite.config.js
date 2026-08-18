import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { blog } from './shared/site-data.js';

const root = dirname(fileURLToPath(import.meta.url));

// Tiene que coincidir con las páginas que genera scripts/build-pages.mjs:
// lo que falte aquí se genera pero no entra en dist/ y acaba en un 404.
// Las de artículo salen de los mismos datos que el generador, para que añadir
// una entrada al blog no obligue a acordarse de tocar este archivo.
export const PAGES = [
  '',
  'nosotros',
  'servicios',
  'proyectos',
  'cotizador',
  'equipo',
  'muebles',
  'blog',
  'contacto',
  ...blog.map((post) => `blog/${post.slug}`),
];

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
