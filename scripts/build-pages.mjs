import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as P from './partials.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://modarch.com.pe';

function layout({ slug, title, description, body, ld = [], lightbox = false, image = '/assets/img/hero-arquitectura.jpg', redirect = '' }) {
  const url = slug === '' ? `${SITE}/` : `${SITE}/${slug}/`;
  const active = slug === '' ? '/' : `/${slug}/`;

  if (redirect) {
    const canonical = `${SITE}${redirect.split('#')[0]}`;
    return `<!doctype html>
<html lang="es-PE">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<meta name="robots" content="noindex, follow" />
<link rel="canonical" href="${canonical}" />
<meta http-equiv="refresh" content="0; url=${redirect}" />
<script>location.replace('${redirect}');</script>
</head>
<body><p>El equipo ahora forma parte de <a href="${redirect}">Nosotros</a>.</p></body>
</html>`;
  }

  return `<!doctype html>
<html lang="es-PE">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>${title}</title>
<meta name="description" content="${description}" />
<meta name="theme-color" content="#f7f4ee" />
<link rel="canonical" href="${url}" />

<meta property="og:type" content="website" />
<meta property="og:locale" content="es_PE" />
<meta property="og:site_name" content="ModArch" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${SITE}${image}" />
<meta name="twitter:card" content="summary_large_image" />

<link rel="icon" href="/assets/img/brand/favicon-32.png" sizes="32x32" />
<link rel="apple-touch-icon" href="/assets/img/brand/favicon-180.png" />

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
<link rel="preload" as="image" href="/assets/img/brand/logo-dark.png" />

<style>
  html { background: #f7f4ee; }
  body { margin: 0; visibility: hidden; }
  .css-ready body, .no-motion body { visibility: visible; }
</style>
<link rel="stylesheet" href="/src/styles/main.css" onload="document.documentElement.classList.add('css-ready')" />
<script>document.addEventListener('DOMContentLoaded',function(){document.documentElement.classList.add('css-ready')});</script>

<noscript><style>
  #preloader, #curtains { display: none !important; }
  [data-reveal] { opacity: 1 !important; }
</style></noscript>
</head>

<body>
<a class="skip-link" href="#main">Saltar al contenido</a>

<div class="preloader" id="preloader">
  <img class="pre-logo" id="preLogo" src="/assets/img/brand/logo-dark.png" alt="ModArch" />
  <span class="pre-bar" aria-hidden="true"><i></i></span>
</div>

<div class="grain" aria-hidden="true"></div>
<div class="progress" id="progress" aria-hidden="true"></div>
${P.nav(active)}

<main id="main">
${body}
</main>
${P.footer()}
${P.widgets({ lightbox })}
${ld.map((j) => `<script type="application/ld+json">${j}</script>`).join('\n')}
<script>
  setTimeout(function () {
    if (document.body.dataset.booted) return;
    document.documentElement.classList.add('no-motion', 'css-ready');
    var p = document.getElementById('preloader');
    if (p) p.style.display = 'none';
  }, 9000);
</script>
<script type="module" src="/src/main.js"></script>
</body>
</html>
`;
}

const pages = [
  {
    slug: '',
    title: 'ModArch — Arquitectura y Diseño de Interiores en Perú',
    description:
      'Estudio de arquitectura y diseño de interiores en Lima. Proyectos residenciales y comerciales, remodelación integral y mobiliario a medida. Cotiza por m² en línea.',
    lightbox: true,
    ld: [P.jsonLd()],
    body: [
      P.heroHome(),
      P.aboutSection(),
      P.sequenceSection({ frames: 6, length: 3.6 }),
      P.servicesSection(),
      P.worksSection(),
      P.clientsSection(),
      P.maiaSection(),
      P.quoterTeaser(),
      P.viewer360Section(),
      P.teamSection(),
      P.productsSection(),
      P.postsSection(),
      P.contactSection({ withFaq: false }),
    ].join('\n'),
  },

  {
    slug: 'nosotros',
    title: 'Nosotros — ModArch | Estudio de arquitectura en Lima',
    description:
      'Conoce ModArch: misión, visión y los seis valores que guían nuestros proyectos de arquitectura e interiorismo en todo el Perú.',
    image: '/assets/img/interiores-minimalistas.jpg',
    body: [
      P.pageHero({
        label: 'Nosotros',
        eyebrow: 'El estudio',
        title: 'Transformamos espacios en <em>experiencias</em>',
        sub: 'Arquitectura e interiores con identidad, función y propósito.',
      }),
      P.aboutTextSection(),
      P.teamSection({ full: true }),
      P.valuesSection(),
      P.styleSection(),
      P.processSection(),
      P.diffSection(),
      P.maiaAboutSection(),
    ].join('\n'),
  },

  {
    slug: 'servicios',
    title: 'Servicios — ModArch | Diseño de interiores, obra y mobiliario',
    description:
      'Diseño de interiores, proyectos residenciales y comerciales, remodelación integral, construcción y mobiliario a medida. Un solo equipo para todo el proyecto.',
    image: '/assets/img/espacios-comerciales.jpg',
    body: [
      P.pageHero({
        label: 'Servicios',
        eyebrow: 'Qué hacemos',
        title: 'Todo el proyecto, <em>bajo un mismo techo</em>',
        sub: 'Del levantamiento de medidas al último acabado. Diseño, obra y mobiliario con un solo responsable.',
      }),
      P.servicesSection({ full: true, withHead: false }),
      P.styleSection(),
      P.sequenceSection({ frames: 6, length: 3.6 }),
      P.processSection(),
      P.diffSection(),
      P.quoterTeaser(),
      P.ctaSection(),
    ].join('\n'),
  },

  {
    slug: 'proyectos',
    title: 'Proyectos — ModArch | Restaurantes, retail y espacios residenciales',
    description:
      'Chifa Fusión, Colchones Paraíso, Bar Deportivo, El Pez On y más. Objetivo, resultado y detalles de cada proyecto entregado por ModArch.',
    image: '/assets/img/projects/chifa-fusion.jpg',
    lightbox: true,
    body: [
      P.pageHero({
        label: 'Proyectos',
        eyebrow: 'Portafolio',
        title: 'Obras que ya están <em>funcionando</em>',
        sub: 'Arrastra la galería o abre cualquier proyecto para ver el objetivo, el resultado y sus detalles.',
      }),
      P.worksSection({ grid: true, withHead: false }),
      P.clientsSection(),
      P.quotesSection(),
      P.ctaSection(),
    ].join('\n'),
  },

  {
    slug: 'cotizador',
    title: 'Cotizador por m² — ModArch | Presupuesto de diseño de interiores',
    description:
      'Calcula en 30 segundos el costo referencial de tu proyecto de interiorismo, remodelación o llave en mano según metraje, tipo de espacio y nivel de acabado.',
    ld: [P.faqJsonLd()],
    body: [
      P.pageHero({
        label: 'Cotizador',
        eyebrow: 'Cotizador automático',
        title: 'Cotiza tu proyecto en <em>30 segundos</em>',
        sub: 'Elige el alcance, indica los metros cuadrados y recibe al instante un rango referencial con el plazo estimado.',
        compact: true,
      }),
      P.quoterSection(),
      P.faqSection({ standalone: true }),
      P.ctaSection(),
    ].join('\n'),
  },

  {
    slug: 'equipo',
    title: 'Equipo — ModArch',
    description: 'El equipo de ModArch ahora forma parte de la página Nosotros.',
    redirect: '/nosotros/#equipo',
    body: '',
  },

  {
    slug: 'muebles',
    title: 'Mobiliario — ModArch | Sofás y muebles a medida en Lima',
    description:
      'Sofás Cirrus, Nival, Velours y Zenit, sistema de estantería Acenea y piezas a medida. Diseñamos y fabricamos cada mueble en nuestro taller.',
    image: '/assets/img/products/629-Sofa-Cirrus-1.jpg',
    body: [
      P.pageHero({
        label: 'Mobiliario',
        eyebrow: 'Nuestras piezas',
        title: 'Muebles diseñados y <em>fabricados por nosotros</em>',
        sub: 'Cada pieza se produce en nuestro taller y se adapta a las medidas de tu espacio. Pasa el cursor sobre una para verla colocada en un ambiente real.',
        clay: true,
      }),
      P.productsSection({ full: true, withHead: false }),
      P.diffSection(),
      P.ctaSection(),
    ].join('\n'),
  },

  {
    slug: 'blog',
    title: 'Blog — ModArch | Ideas de diseño de interiores',
    description:
      'Guías prácticas sobre tendencias, iluminación, materiales y decisiones de remodelación escritas por el equipo de ModArch.',
    image: '/assets/img/blog/blog-1.jpg',
    body: [
      P.pageHero({
        label: 'Blog',
        eyebrow: 'Blog',
        title: 'Ideas para tu <em>próximo espacio</em>',
        sub: 'Guías prácticas sobre diseño, materiales e iluminación escritas por nuestro equipo.',
      }),
      P.postsSection({ full: true, withHead: false }),
      P.ctaSection(),
    ].join('\n'),
  },

  {
    slug: 'contacto',
    title: 'Contacto — ModArch | Agenda tu visita técnica sin costo',
    description:
      'Av. Venezuela 6023, San Miguel — Lima. Escríbenos por WhatsApp, correo o el formulario y agenda tu visita técnica sin costo.',
    ld: [P.faqJsonLd()],
    body: [
      P.pageHero({
        label: 'Contacto',
        eyebrow: 'Hablemos',
        title: 'Conversemos sobre <em>tu proyecto</em>',
        sub: 'Agenda una visita técnica sin costo. Medimos, escuchamos y te entregamos una propuesta clara.',
        clay: true,
      }),
      P.contactSection(),
      P.ctaSection(),
    ].join('\n'),
  },
];

function sitemap() {
  const today = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .filter((p) => !p.redirect)
  .map(
    (p) => `  <url>
    <loc>${p.slug === '' ? `${SITE}/` : `${SITE}/${p.slug}/`}</loc>
    <lastmod>${today}</lastmod>
    <priority>${p.slug === '' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
}

const written = [];

for (const page of pages) {
  const dir = page.slug ? path.join(ROOT, page.slug) : ROOT;
  await fs.mkdir(dir, { recursive: true });
  const file = path.join(dir, 'index.html');
  await fs.writeFile(file, layout(page), 'utf8');
  written.push(path.relative(ROOT, file).replace(/\\/g, '/'));
}

await fs.mkdir(path.join(ROOT, 'public'), { recursive: true });
await fs.writeFile(path.join(ROOT, 'public', 'sitemap.xml'), sitemap(), 'utf8');
await fs.writeFile(
  path.join(ROOT, 'public', 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`,
  'utf8'
);

console.log(`Páginas generadas (${written.length}):`);
for (const w of written) console.log(`  ${w}`);
console.log('  public/sitemap.xml\n  public/robots.txt');
