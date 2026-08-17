import {
  company,
  stats,
  values,
  services,
  differentiators,
  process,
  projects,
  products,
  team,
  testimonials,
  clients,
  blog,
  faqs,
  pricing,
} from '../shared/site-data.js';
import { createRequire } from 'node:module';

const wa = `https://wa.me/${company.whatsapp}`;

// Lo escribe tools/hero.mjs; si falta se cae al archivo único de siempre
const HERO_IMG = (() => {
  try {
    return createRequire(import.meta.url)('../shared/hero-image.json');
  } catch {
    return { src: '/assets/img/hero-room.webp', srcset: '', width: 1535, height: 1024 };
  }
})();

export const NAV = [
  { label: 'Nosotros', href: '/nosotros/' },
  { label: 'Servicios', href: '/servicios/' },
  { label: 'Proyectos', href: '/proyectos/' },
  { label: 'Cotizador', href: '/cotizador/' },
  { label: 'Mobiliario', href: '/muebles/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Contacto', href: '/contacto/' },
];

const ICO = {
  arrow: '<svg class="btn-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  arrowLeft: '<svg class="btn-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9 9 0 0 1-4.2-1L3 20l1.1-4.4A8.4 8.4 0 0 1 3 11.5 8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4"/></svg>',
  arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 17 17 7M9 7h8v8"/></svg>',
};

const money = (n) => `${pricing.currency} ${n.toLocaleString('es-PE')}`;

/* ── Chrome ─────────────────────────────────────────── */

export function nav(active) {
  return `
<header class="nav" id="nav">
  <div class="nav-inner">
    <a class="brand" href="/" aria-label="ModArch inicio">
      <img src="/assets/img/brand/logo-dark.png" alt="ModArch — Arquitectura y Diseño de Interiores" />
    </a>
    <nav class="nav-links" aria-label="Principal">
      ${NAV.map((n) => `<a class="nav-link${n.href === active ? ' is-active' : ''}" href="${n.href}"${n.href === active ? ' aria-current="page"' : ''}>${n.label}</a>`).join('\n      ')}
    </nav>
    <div class="nav-actions">
      <button class="btn is-sm" data-open="voice">Llamar a Maia ${ICO.phone.replace('<svg', '<svg class="btn-ico"')}</button>
      <button class="burger" id="burger" aria-label="Abrir menú" aria-expanded="false"><i></i><i></i><i></i></button>
    </div>
  </div>
</header>

<div class="menu" id="menu" aria-hidden="true">
  <div></div>
  <div class="menu-body">
    <nav class="menu-list" aria-label="Menú completo">
      ${NAV.map((n, i) => `<a href="${n.href}"><span><em>0${i + 1}</em>${n.label}</span></a>`).join('\n      ')}
    </nav>
    <div class="menu-aside">
      <div><h4>Estudio</h4><p>${company.address.replace(' — ', '<br />')}</p></div>
      <div><h4>Contacto</h4><p><a href="mailto:${company.email}">${company.email}</a><br /><a href="tel:+${company.whatsapp}">${company.phones[0]}</a></p></div>
      <div><h4>Síguenos</h4><p>
        <a href="${company.social.instagram}" target="_blank" rel="noopener">Instagram</a> ·
        <a href="${company.social.facebook}" target="_blank" rel="noopener">Facebook</a> ·
        <a href="${company.social.tiktok}" target="_blank" rel="noopener">TikTok</a>
      </p></div>
    </div>
  </div>
  <div class="menu-foot">
    <span>${company.legal} · ${company.tagline}</span>
    <span>Lima — Perú</span>
  </div>
</div>`;
}

export function footer() {
  return `
<footer class="footer">
  <div class="shell">
    <div class="footer-grid">
      <div>
        <img src="/assets/img/brand/logo-light.png" alt="ModArch" style="height:38px;width:auto" />
        <p style="margin-top:1.2rem;max-width:34ch;font-size:var(--step--1);color:#a49b8e">
          Estudio de arquitectura y diseño de interiores. ${company.tagline}, en Lima y todo el Perú.
        </p>
        <div class="socials" style="margin-top:1.6rem">
          <a href="${company.social.instagram}" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>
          <a href="${company.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1Z"/></svg></a>
          <a href="${company.social.tiktok}" target="_blank" rel="noopener" aria-label="TikTok"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 2h-3v13a2.5 2.5 0 1 1-2.5-2.5c.2 0 .4 0 .5.1v-3a5.5 5.5 0 1 0 5 5.4V8.7A6.6 6.6 0 0 0 20 10V7a3.5 3.5 0 0 1-3.5-3.5V2Z"/></svg></a>
        </div>
      </div>
      <div>
        <h4>Servicios</h4>
        <ul class="footer-list">${services.map((s) => `<li><a href="/servicios/#${s.id}">${s.title}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h4>Estudio</h4>
        <ul class="footer-list">
          <li><a href="/nosotros/">Nosotros</a></li>
          <li><a href="/proyectos/">Proyectos</a></li>
          <li><a href="/muebles/">Mobiliario</a></li>
          <li><a href="/cotizador/">Cotizador</a></li>
          <li><a href="/nosotros/#equipo">Equipo</a></li>
          <li><a href="/blog/">Blog</a></li>
        </ul>
      </div>
      <div>
        <h4>Contacto</h4>
        <ul class="footer-list">
          ${company.phones.map((p) => `<li><a href="${wa}" target="_blank" rel="noopener">${p}</a></li>`).join('')}
          <li><a href="mailto:${company.email}">${company.email}</a></li>
          <li>${company.address}</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span id="year">2026</span> ${company.legal}. Todos los derechos reservados.</span>
      <span>${company.tagline}</span>
    </div>
  </div>
  <div class="footer-world" aria-hidden="true">
    <video
      class="footer-world-video"
      muted
      loop
      playsinline
      preload="none"
      data-src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260613_180732_a54afbf6-b30d-470e-861f-669871f09f67.mp4"
    ></video>
    <span class="footer-world-shade"></span>
  </div>
  <div class="footer-mark" aria-hidden="true">${company.name}</div>
</footer>`;
}

export function widgets({ lightbox = false } = {}) {
  return `
<div class="dock">
  <button class="dock-btn is-voice is-maia-dock" data-open="voice" aria-label="Hablar con Maia por voz">
    <span class="ripple" aria-hidden="true"></span><span class="dock-tip">Hablar con Maia</span>${ICO.phone}
  </button>
  <button class="dock-btn is-primary is-maia-dock" data-open="chat" aria-label="Abrir chat con Maia">
    <span class="dock-tip">Chatea con Maia</span>${ICO.chat}
  </button>
</div>

<section class="panel maia-widget" id="chatPanel" aria-label="Chat con Maia" role="dialog" aria-modal="false">
  <video class="maia-widget-network" muted loop playsinline preload="metadata" aria-hidden="true"><source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260514_135830_bb6491d1-9b66-4aec-9722-13b4dfe3fb46.mp4" type="video/mp4" /></video>
  <header class="panel-head">
    <span class="panel-avatar is-maia" aria-hidden="true"><i></i></span>
    <div class="panel-title"><b>Maia · Asistente IA</b><span id="chatState">En línea</span></div>
    <button class="panel-close" data-close="chat" aria-label="Cerrar chat">${ICO.close}</button>
  </header>
  <div class="chat-log" id="chatLog"></div>
  <div>
    <div class="chat-quick" id="chatQuick"></div>
    <form class="chat-form" id="chatForm">
      <textarea class="chat-input" id="chatInput" rows="1" placeholder="Escribe tu consulta…" aria-label="Mensaje"></textarea>
      <button class="chat-send" type="submit" aria-label="Enviar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"/></svg></button>
    </form>
  </div>
</section>

<section class="panel maia-widget" id="voicePanel" aria-label="Conversación por voz con Maia" role="dialog" aria-modal="false">
  <header class="panel-head">
    <span class="panel-avatar is-maia is-clay" aria-hidden="true"><i></i></span>
    <div class="panel-title"><b>Maia · Asesora IA</b><span id="voiceState">Lista para conversar</span></div>
    <button class="panel-close" data-close="voice" aria-label="Cerrar llamada">${ICO.close}</button>
  </header>
  <div class="voice-body">
    <div class="voice-orb is-maia-video">
      <video class="voice-maia-video" id="voiceCore" muted loop playsinline preload="metadata" aria-hidden="true">
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260514_135830_bb6491d1-9b66-4aec-9722-13b4dfe3fb46.mp4" type="video/mp4" />
      </video>
      <canvas id="voiceViz" width="336" height="336" aria-hidden="true"></canvas>
    </div>
    <div class="voice-status"><b id="voiceHeadline">Habla con Maia</b><span id="voiceSub">Consultas, cotizaciones y citas</span></div>
    <div class="voice-timer" id="voiceTimer" hidden>00:00</div>
    <div class="voice-transcript" id="voiceTranscript" aria-live="polite" aria-label="Subtítulos de la conversación"></div>
    <p class="voice-hint" id="voiceHint">Responde en español sobre servicios, precios por m², plazos y disponibilidad. Necesita permiso de micrófono.</p>
    <div class="voice-err" id="voiceErr"></div>
  </div>
  <div class="voice-controls">
    <button class="voice-ctl" id="voiceMute" aria-label="Silenciar micrófono" hidden>${ICO.mic}</button>
    <button class="btn is-clay" id="voiceToggle">Llamar a Maia</button>
  </div>
</section>
${lightbox ? `
<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Detalle del proyecto">
  <button class="lb-close" id="lbClose" aria-label="Cerrar">${ICO.close}</button>
  <div class="lb-inner" id="lbInner"></div>
</div>` : ''}`;
}

/* ── Heros ──────────────────────────────────────────── */

const MASK_TOP =
  '<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M56 56V0C56 30.9279 30.9279 56 0 56H56Z" fill="currentColor"/></svg>';
const MASK_LEFT =
  '<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M56 56H0C30.9279 56 56 30.9279 56 0V56Z" fill="currentColor"/></svg>';

export function heroHome() {
  return `
<section class="hero" id="hero">
  <div class="hero-frame">
    <div class="hero-media" aria-hidden="true">
      <img id="heroImg" src="${HERO_IMG.src}"${
        HERO_IMG.srcset
          ? ` srcset="${HERO_IMG.srcset}" sizes="(min-width: 1560px) 1520px, 100vw"`
          : ''
      } width="${HERO_IMG.width}" height="${HERO_IMG.height}" alt="" fetchpriority="high" decoding="async" />
    </div>

    <div class="hero-inner">
      <p class="hero-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M17.7 6.3l-2.8 2.8M9.1 14.9l-2.8 2.8"/></svg>
        <span>${company.style}</span>
      </p>

      <h1 class="display hero-title">Espacios que <em>inspiran</em>, diseñados para vivirse</h1>

      <p class="hero-sub">
        Diseñamos, construimos y equipamos casas, oficinas y locales comerciales.
        Del concepto en 3D a la entrega llave en mano.
      </p>
    </div>

    <div class="hero-stat">
      <div class="hero-stat-head">
        <b>120+</b>
        <span>Proyectos entregados</span>
      </div>
      <a class="pill-btn" href="/proyectos/">
        <span class="pill-ico">${ICO.arrowUp}</span>
        Ver proyectos
      </a>
    </div>

    <a class="hero-corner" href="/cotizador/">
      <span class="corner-mask is-top" aria-hidden="true">${MASK_TOP}</span>
      <span class="corner-mask is-left" aria-hidden="true">${MASK_LEFT}</span>
      <span class="corner-ico">${ICO.arrowUp}</span>
      <span class="corner-body">
        <b>Cotizador</b>
        <span class="corner-link">por m² <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></span>
      </span>
    </a>
  </div>
</section>
`;
}

export function pageHero({ eyebrow, title, sub, label, clay = false, compact = false }) {
  return `
<section class="page-hero${compact ? ' is-compact' : ''}">
  <div class="shell">
    <nav class="crumbs" aria-label="Ruta"><a href="/">Inicio</a><span aria-hidden="true">/</span><span>${label}</span></nav>
    <h1 class="display page-hero-title" data-reveal="lines">${title}</h1>
    <div class="hero-line" aria-hidden="true"></div>
    <p class="lead page-hero-sub" data-reveal="fade" data-delay="0.15">${sub}</p>
  </div>
</section>`;
}

/* ── Secciones ──────────────────────────────────────── */

const PILLARS = [
  {
    n: '01',
    title: 'Líneas limpias',
    text: 'Funcionalidad escandinava y minimalismo oriental: geometrías francas, maderas de tono claro y una estética sobria pero acogedora.',
    img: '/assets/img/interiores-minimalistas.jpg',
    alt: 'Mobiliario a medida en madera clara con piezas de cerámica',
  },
  {
    n: '02',
    title: 'Minimalismo cálido',
    text: 'Espacios despejados de desorden, pero con texturas orgánicas —mármol, roble, microcemento— y luz cálida indirecta para que nunca se sientan fríos ni clínicos.',
    img: '/assets/img/interior-moderno.jpg',
    alt: 'Sala minimalista con luz natural, sofá modular y mesa de piedra',
  },
  {
    n: '03',
    title: 'Diseño biofílico',
    text: 'Naturaleza integrada al espacio: follaje colgante, luz natural, tonos tierra y materiales sin procesar como la piedra y el ratán.',
    img: '/assets/img/interiores-minimalistas-2.jpg',
    alt: 'Nicho de madera con vegetación y luz natural',
  },
];

export function styleSection() {
  return `
<section class="section is-oat" id="estilo">
  <div class="shell">
    ${head({
      eyebrow: 'Nuestro lenguaje',
      title: 'Materia, <em>calma</em> y naturaleza',
      sub: company.styleText,
      clay: true,
    })}
    <div class="cube" id="styleCube" data-reveal="fade">
      <div class="cube-stage" id="cubeStage">
        <svg class="cube-leader" id="cubeLeader" aria-hidden="true">
          <line x1="0" y1="0" x2="0" y2="0" />
          <circle cx="0" cy="0" r="3.5" />
        </svg>
      </div>

      <div class="cube-cards" id="cubeCards">
        ${PILLARS.map(
          (p, i) => `<article class="cube-card${i === 0 ? ' is-on' : ''}" data-face="${i}">
          <span class="pillar-n">${p.n}</span>
          <h3>${p.title}</h3>
          <p>${p.text}</p>
        </article>`
        ).join('')}
        <p class="cube-hint">para girar · apunta una cara para verla</p>
      </div>
    </div>

    <div class="pillars" id="pillarsFallback" hidden>
      ${PILLARS.map(
        (p, i) => `<article class="pillar" data-delay="${(i * 0.08).toFixed(2)}">
        <div class="pillar-img"><img src="${p.img}" alt="${p.alt}" loading="lazy" /></div>
        <div class="pillar-body">
          <span class="pillar-n">${p.n}</span>
          <h3>${p.title}</h3>
          <p>${p.text}</p>
        </div>
      </article>`
      ).join('')}
    </div>
    <div class="style-tags" data-reveal="fade">
      ${company.styleTags.map((t) => `<span class="tag">${t}</span>`).join('')}
    </div>
  </div>
</section>`;
}

// Sin `sub` el titular ocupa el ancho: a dos columnas dejaría media fila vacía
export function head({ eyebrow, title, sub, clay = false }) {
  return `
    <div class="section-head${sub ? ' is-split' : ''}">
      <div>
        <h2 class="display h-lg" data-reveal="lines">${title}</h2>
      </div>
      ${sub ? `<p class="lead" data-reveal="fade" data-delay="0.15">${sub}</p>` : ''}
    </div>`;
}

export function aboutSection({ full = false, withHead = true } = {}) {
  return `
<section class="section" id="nosotros"${withHead ? '' : ' style="padding-top:0"'}>
  <div class="shell">
    ${
      withHead
        ? head({
            eyebrow: 'Nosotros',
            title: 'Transformamos espacios en <em>experiencias</em>',
          })
        : ''
    }
    <div class="about-grid">
      <div class="about-media" data-reveal="clip">
        <video id="aboutVideo" data-src="/assets/video/modarch-nosotros.mp4" poster="/assets/img/about-poster.webp" muted loop playsinline preload="none"></video>
      </div>
      <div>
        <div class="mv-grid">
          <article class="mv-card" data-reveal="up"><h4>Misión</h4><p class="muted">${company.mission}</p></article>
          <article class="mv-card" data-reveal="up" data-delay="0.1"><h4>Visión</h4><p class="muted">${company.vision}</p></article>
        </div>
        ${full ? valuesList() : `
        <div class="about-more" data-reveal="up">
          <button class="btn is-ghost is-sm" type="button" id="valuesToggle" aria-expanded="false" aria-controls="valuesPanel">
            <span data-label>Conocer el estudio</span>${ICO.arrow}
          </button>
          <div class="values-panel" id="valuesPanel">${valuesList({ reveal: false })}</div>
        </div>`}
      </div>
    </div>
  </div>
</section>`;
}

export function aboutTextSection() {
  return `
<section class="section about-text-section" id="nosotros">
  <div class="shell">
    <div class="about-text-intro">
      <span class="role-label" data-reveal="fade">Quiénes somos</span>
      <p class="about-statement" data-scroll-highlight><strong>En Modarch, transformamos espacios en experiencias.</strong> Somos un estudio de arquitectura y diseño de interiores apasionado por crear ambientes funcionales, estéticos y personalizados que reflejen la identidad y necesidades de nuestros clientes.</p>
    </div>
    <div class="about-text-mv mv-grid">
      <article class="mv-card" data-reveal="up"><h4>Misión</h4><p class="muted">${company.mission}</p></article>
      <article class="mv-card" data-reveal="up" data-delay="0.1"><h4>Visión</h4><p class="muted">${company.vision}</p></article>
    </div>
  </div>
</section>`;
}

function valuesList({ reveal = true } = {}) {
  return `
        <div class="values-list">
          ${values
            .map(
              (v, i) => `<div class="value-row"${
                reveal ? ` data-reveal="fade" data-delay="${(i * 0.05).toFixed(2)}"` : ''
              }>
            <i>0${i + 1}</i><h5>${v.title}</h5><p>${v.text}</p>
          </div>`
            )
            .join('')}
        </div>`;
}

export function valuesSection() {
  return `
<section class="section">
  <div class="shell">
    ${head({
      eyebrow: 'Valores',
      title: 'Lo que sostiene <em>cada decisión</em>',
      sub: 'Seis principios que aplicamos desde la primera reunión hasta la entrega final.',
      clay: true,
    })}
    <div class="values-list">
      ${values
        .map(
          (v, i) => `<div class="value-row" data-reveal="fade" data-delay="${(i * 0.05).toFixed(2)}">
        <i>0${i + 1}</i><h5>${v.title}</h5><p>${v.text}</p>
      </div>`
        )
        .join('')}
    </div>
  </div>
</section>`;
}

const SEQ_STEPS = [
  { n: '01', title: 'Volumen', text: 'Definimos la envolvente y cómo entra la luz natural antes de decidir un solo material.' },
  { n: '02', title: 'Estructura', text: 'Losas, ritmo de circulación y alturas: la planta que ordena la vida del espacio.' },
  { n: '03', title: 'Materialidad', text: 'Roble de tono claro, microcemento y piedra. Texturas que se sienten al tacto.' },
  { n: '04', title: 'Atmósfera', text: 'Luz indirecta, vegetación y las piezas finales. El espacio ya se puede habitar.' },
];

export function sequenceSection({ frames = 72, length = 3.4 } = {}) {
  const span = 1 / SEQ_STEPS.length;
  return `
<section class="section seq" id="anatomia"
  data-seq-frames="${frames}"
  data-seq-path="/assets/frames/seq-"
  data-seq-ext=".webp"
  data-seq-pad="4"
  data-seq-length="${length}"
  data-seq-scrub="2.4">
  <div class="seq-stage">
    <div class="shell seq-inner">
      <div class="seq-aside">
        <div class="seq-head">
          <h2 class="display h-md">Del volumen <em>al detalle</em></h2>
        </div>
        <div class="seq-steps">
          ${SEQ_STEPS.map(
            (s, i) => `<article class="seq-step${i === 0 ? ' is-on' : ''}" data-seq-step="${(i * span).toFixed(4)},${((i + 1) * span).toFixed(4)}">
            <span class="seq-step-n">${s.n}</span>
            <h3>${s.title}</h3>
            <p>${s.text}</p>
          </article>`
          ).join('')}
        </div>
        <div class="seq-meta">
          <div class="seq-bar"><i></i></div>
          <span class="seq-count">01 / ${frames}</span>
        </div>
      </div>
      <div class="seq-media">
        <canvas class="seq-canvas" aria-hidden="true"></canvas>
        <img class="seq-poster" src="/assets/img/interiores-minimalistas.jpg" alt="Anatomía de un proyecto ModArch" />
      </div>
    </div>
  </div>
</section>`;
}

export function statsSection() {
  return `
<div class="stats">
  ${stats
    .map(
      (s) => `<div class="stat"><b><span data-count="${s.value}">0</span><em>${s.suffix}</em></b><span>${s.label}</span></div>`
    )
    .join('')}
</div>`;
}

function servicesSectionLegacy({ full = false, withHead = true } = {}) {
  const list = services;
  return `
<section class="section services-stack-section" id="servicios">
  <div class="shell">
    ${
      withHead
        ? head({
            eyebrow: 'Servicios',
            title: 'Todo el proyecto, <em>bajo un mismo techo</em>',
            sub: 'Del levantamiento de medidas al último acabado. Un solo equipo responsable de diseño, obra y mobiliario.',
          })
        : ''
    }
    <div class="svc-split" id="svcSplit">
      <div class="svc-deck" role="tablist" aria-label="Servicios">
        ${list
          .map(
            (s, i) => `<button class="svc-item${i === 0 ? ' is-on' : ''}" id="${s.id}" role="tab" aria-selected="${i === 0}" aria-controls="panel-${s.id}" data-index="${i}">
          <span class="svc-card-media"><img src="${s.image}" alt="${s.title}" loading="${i < 3 ? 'eager' : 'lazy'}" /></span>
          <span class="svc-card-shade" aria-hidden="true"></span>
          <span class="svc-card-label"><small>${s.n}</small><strong>${s.title}</strong></span>
        </button>`
          )
          .join('')}
      </div>

      <div class="svc-stage">
        ${list
          .map(
            (s, i) => `<article class="svc-panel${i === 0 ? ' is-on' : ''}" id="panel-${s.id}" role="tabpanel" data-index="${i}"${i === 0 ? '' : ' aria-hidden="true"'}>
          <div class="svc-panel-heading">
            <span>${s.n}</span>
            <div><h3>${s.title}</h3><p>${s.short}</p></div>
          </div>
          <div class="svc-panel-detail">
            <p class="lead">${s.text}</p>
            <div class="svc-bullets">${s.bullets.map((b) => `<span class="tag">${b}</span>`).join('')}</div>
          </div>
        </article>`
          )
          .join('')}
      </div>
    </div>
    ${full ? '' : `<div style="margin-top:2.4rem" data-reveal="fade"><a class="btn is-ghost" href="/servicios/">Ver todos los servicios ${ICO.arrow}</a></div>`}
  </div>
</section>`;
}

export function servicesSection({ full = false, withHead = true } = {}) {
  const list = services;
  return `
<section class="section services-stack-section" id="servicios">
  <div class="shell">
    ${withHead ? `<header class="services-stack-head">
      <div class="services-stack-intro">
        <h2 class="hero-heading display h-lg" data-reveal="lines">Todo el proyecto, <em>bajo un mismo techo</em></h2>
        <p class="lead" data-reveal="fade" data-delay="0.15">Del levantamiento de medidas al último acabado. Un solo equipo responsable de diseño, obra y mobiliario.</p>
      </div>
    </header>` : ''}
    <div class="service-stack" id="svcSplit">
      ${list.map((s, i) => {
        const targetScale = 1 - (list.length - 1 - i) * 0.03;
        const gallery = s.gallery || [s.image, s.image, s.image];
        return `<div class="service-stack-slot" data-service-stack-slot style="--service-index:${i}">
        <article class="service-stack-card" id="${s.id}" data-service-stack-card style="--service-index:${i};--target-scale:${targetScale}">
          <div class="service-stack-gallery">
            <div class="service-stack-left">
              <img src="${gallery[0]}" alt="${s.title}: vista principal" loading="${i < 2 ? 'eager' : 'lazy'}" />
              <img src="${gallery[1]}" alt="${s.title}: detalle del proyecto" loading="lazy" />
            </div>
            <img class="service-stack-main" src="${gallery[2]}" alt="${s.title}: resultado interior" loading="lazy" />
          </div>
          <div class="service-stack-copy">
            <div class="service-stack-title"><span>${s.n}</span><div><h3>${s.title}</h3><p>${s.short}</p></div></div>
            <div class="service-stack-description"><p>${s.text}</p><div class="service-stack-tags">${s.bullets.map((b) => `<span>${b}</span>`).join('')}</div></div>
          </div>
        </article>
      </div>`;
      }).join('')}
    </div>
    ${full ? '' : `<div class="service-stack-more" data-reveal="fade"><a class="btn is-ghost" href="/servicios/">Ver todos los servicios ${ICO.arrow}</a></div>`}
  </div>
</section>`;
}

// Roseta del panal: seis celdas en sentido horario desde arriba, en múltiplos
// del hexágono (±3/4 de ancho, ±1/2 de alto). El CSS los pasa a píxeles.
const HIVE_CELLS = [
  [0, -1],
  [0.75, -0.5],
  [0.75, 0.5],
  [0, 1],
  [-0.75, 0.5],
  [-0.75, -0.5],
];

export function worksSection({ grid = false, withHead = true } = {}) {
  if (!grid) {
    // Fuera de la sección animada: dentro restaría recorrido al anclaje
    return `
<div class="works-intro">
  <div class="shell">
    <h2 class="display h-lg" data-reveal="lines">Proyectos que ya <em>están funcionando</em>.</h2>
  </div>
</div>
<section class="project-cylinder" id="proyectos" aria-label="Proyectos realizados" tabindex="0" style="--project-scroll-height:${100 + (projects.length - 1) * 62}vh">
  <div class="project-cylinder-sticky">
    <div class="project-cylinder-camera" id="projectCylinder">
      <div class="project-cylinder-viewport" id="projectCylinderViewport">
      ${projects
        .map(
          (project, index) => `
      <div class="project-3d-card" data-project-card="${index}" role="button" tabindex="-1" aria-label="Ver ${project.title}">
        ${[-2, -1, 0, 1, 2].map((depth) => `<i class="project-card-edge" style="--depth:${depth}px" aria-hidden="true"></i>`).join('')}
        <article class="project-card-face is-front">
          <img src="${project.cover}" alt="" loading="lazy" />
          <div class="project-card-shade"></div>
          <div class="project-card-index">${String(index + 1).padStart(2, '0')}</div>
          <div class="project-card-front-copy">
            <span>${project.category}</span>
            <h3>${project.title}</h3>
            <p>${project.location} · ${project.area} · ${project.year}</p>
          </div>
        </article>
        <article class="project-card-face is-back" style="--project-image:url('${project.cover}')">
          <div class="project-card-back-copy">
            <span>Objetivo</span>
            <p>${project.objective}</p>
            <span>Resultado</span>
            <p>${project.result}</p>
            <b>Ver proyecto completo →</b>
          </div>
        </article>
      </div>`
        )
        .join('')}
      </div>
    </div>
  </div>
</section>`;
  }

  return `
<section class="section works" id="proyectos"${withHead ? '' : ' style="padding-top:0"'}>
  <div class="shell">
    ${
      withHead
        ? head({
            eyebrow: 'Proyectos',
            title: 'Obras que ya están <em>funcionando</em>',
            sub: 'Arrastra para recorrer la galería. Haz clic en un proyecto para ver el objetivo, el resultado y sus detalles.',
          })
        : ''
    }
    <div class="works-stage" id="worksStage" data-reveal="fade">
      <div class="hive">
        <span class="hive-core" aria-hidden="true"></span>
        ${projects
          .map((project, index) => {
            const [cx, cy] = HIVE_CELLS[index % HIVE_CELLS.length];
            return `<button class="hive-cell" type="button" data-hive="${index}" style="--cx:${cx};--cy:${cy}" aria-label="Ver ${project.title}">
          <span class="hive-hex"><img src="${project.cover}" alt="${project.title}" loading="lazy" /></span>
        </button>`;
          })
          .join('')}
      </div>
      <div class="works-dots" id="worksDots" aria-hidden="true"></div>
    </div>

    <div class="works-caption">
      <div class="works-info">
        <h3 id="worksTitle">${projects[0].title}</h3>
        <p id="worksMeta">${projects[0].category} · ${projects[0].style} · ${projects[0].area}</p>
      </div>
      <div class="works-nav">
        <button class="works-arrow" id="worksPrev" aria-label="Proyecto anterior"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M19 12H5M11 18l-6-6 6-6"/></svg></button>
        <button class="works-arrow" id="worksOpen" aria-label="Ver detalle del proyecto"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M15 3h6v6M10 14 21 3M21 14v7H3V3h7"/></svg></button>
        <button class="works-arrow" id="worksNext" aria-label="Proyecto siguiente"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
      </div>
    </div>
    <div class="works-fallback" id="worksFallback"${grid ? '' : ' hidden'}>
      ${projects
        .map(
          (p, i) => `<figure class="work-card" data-project="${i}">
        <img src="${p.cover}" alt="${p.title}" loading="lazy" />
        <figcaption><h4>${p.title}</h4><span>${p.category} · ${p.area}</span></figcaption>
      </figure>`
        )
        .join('')}
    </div>
    ${grid ? '' : `<div style="margin-top:2.4rem" data-reveal="fade"><a class="btn is-ghost" href="/proyectos/">Ver todos los proyectos ${ICO.arrow}</a></div>`}
  </div>
</section>`;
}

export function processSection() {
  return `
<section class="section" id="proceso">
  <div class="shell">
    ${head({
      eyebrow: 'Cómo trabajamos',
      title: 'Seis pasos, <em>cero sorpresas</em>',
      sub: 'Cronograma valorizado, reportes semanales y una sola persona responsable de tu proyecto.',
      clay: true,
    })}
    <div class="process-grid">
      ${process
        .map(
          (p, i) => `<article class="step" data-n="${p.n}" data-reveal="up" data-delay="${(i * 0.05).toFixed(2)}">
        <img src="${p.icon}" alt="" loading="lazy" /><h4>${p.title}</h4><p>${p.text}</p>
      </article>`
        )
        .join('')}
    </div>
  </div>
</section>`;
}

export function diffSection() {
  return `
<section class="section" style="padding-top:0">
  <div class="shell">
    <div class="diff-grid">
      ${differentiators
        .map(
          (d, i) => `<article class="card diff" data-reveal="up" data-delay="${(i * 0.05).toFixed(2)}">
        <span class="diff-ico">
          <img src="${d.icon}" alt="" loading="lazy" />
          <i class="diff-sheen" style="--ico:url('${d.icon}')" aria-hidden="true"></i>
        </span><h4>${d.title}</h4><p>${d.text}</p>
      </article>`
        )
        .join('')}
    </div>
  </div>
</section>`;
}

export function quoterTeaser() {
  return `
<section class="section" id="cotizador">
  <div class="shell">
    <div class="quoter-teaser" data-reveal="up">
      <div class="qt-media">
        <div
          class="qt-interior-model"
          id="qtInteriorModel"
          role="img"
          aria-label="Maqueta 3D de un departamento con sala, comedor, cocina y dormitorio"
        >
          <img class="qt-model-fallback" src="/assets/img/quoter-room.webp" alt="Ilustración isométrica de una sala de estar" loading="lazy" />
        </div>
        <p class="qt-claim">Tu espacio<br />empieza<br />aquí.</p>
      </div>

      <div class="qt-form">
        <h2 class="display h-lg">Empecemos por <em>tu idea</em></h2>
        <p class="qt-sub">Calcula una inversión referencial para el diseño de tu espacio.</p>

        <div class="qt-field">
          <label for="qtSpace">Tipo de proyecto</label>
          <select class="qt-select" id="qtSpace">
            ${Object.entries(pricing.spaces)
              .map(([k, v]) => `<option value="${k}">${v.label}</option>`)
              .join('')}
          </select>
        </div>

        <div class="qt-field">
          <div class="qt-range-head">
            <label for="qtRange">Área</label>
            <b><span id="qtM2">75</span> m²</b>
          </div>
          <input class="range" type="range" id="qtRange" min="10" max="400" step="5" value="75" />
        </div>

        <div class="qt-result" aria-live="polite">
          <span>Diseño desde</span>
          <b id="qtTotal">${pricing.currency} 0</b>
          <small>Estimado referencial, sujeto a evaluación de alcance.</small>
        </div>

        <a class="qt-cta" href="/cotizador/">
          Quiero una cotización detallada
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M7 17 17 7M9 7h8v8"/></svg>
        </a>
      </div>
    </div>
  </div>
</section>`;
}

export function viewer360Section() {
  return `
<section class="v360-section" id="recorrido-360" aria-labelledby="v360Title">
  <div class="shell">
    <header class="v360-head">
      <h2 class="display h-lg" id="v360Title">Camina antes de <em>construir.</em></h2>
      <p>Arrastra para mirar alrededor. Explora espacios de ModArch con sus materiales, iluminación y proporciones antes de tomar una decisión.</p>
    </header>

    <div class="v360-stage" id="v360Stage" tabindex="0" role="application" aria-label="Recorrido panorámico interactivo. Arrastra para girar y usa la rueda con control para acercar.">
      <div class="v360-world" id="v360World" aria-hidden="true"></div>
      <div class="v360-vignette" aria-hidden="true"></div>
      <div class="v360-spots" id="v360Spots"></div>

      <article class="v360-card" aria-live="polite">
        <span id="v360Kind">DEPARTAMENTO · 85 M²</span>
        <h3 id="v360Name">Refugio contemporáneo</h3>
        <p id="v360Desc">Una experiencia de interiorismo pensada para que cada rincón tenga una razón de ser.</p>
      </article>

      <div class="v360-tools" aria-label="Controles del recorrido">
        <button type="button" id="v360Auto" aria-label="Activar o detener giro automático" aria-pressed="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 12a8 8 0 1 0 2.3-5.7M4 4v5h5"/><path d="M12 8v4l3 2"/></svg>
        </button>
        <button type="button" id="v360Full" aria-label="Ver en pantalla completa" aria-pressed="false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/></svg>
        </button>
      </div>

      <div class="v360-map" id="v360Map" aria-hidden="true"><i></i></div>
      <div class="v360-hint" id="v360Hint" aria-hidden="true"><span>↔</span> Arrastra para recorrer</div>
      <div class="v360-load" id="v360Load" aria-hidden="true"><span></span><small>Preparando recorrido</small></div>
    </div>

    <footer class="v360-footer">
      <div class="v360-scenes" id="v360Scenes" aria-label="Seleccionar ambiente"></div>
      <p>ARRASTRA · RUEDA + CTRL PARA ACERCAR · PANTALLA COMPLETA</p>
    </footer>
  </div>
</section>`;
}

export function quoterSection() {
  return `
<section class="section quoter-section" id="cotizador" style="padding-top:0">
  <div class="shell">
    <div class="quoter">
      <div class="quoter-panel" data-reveal="up">
        <div class="q-steps" id="qSteps" aria-hidden="true"></div>
        <div class="q-panes">
          <div class="q-pane is-active" data-pane="1">
            <div class="q-group"><h4>¿Qué necesitas?</h4><div class="q-cards" id="qScopes" role="group" aria-label="Alcance del proyecto"></div></div>
            <div class="q-group"><h4>¿Qué tipo de espacio es?</h4><div class="q-cards" id="qSpaces" role="group" aria-label="Tipo de espacio"></div></div>
          </div>
          <div class="q-pane" data-pane="2">
            <div class="q-group q-m2">
              <h4>Superficie a intervenir</h4>
              <div class="q-m2-top">
                <div class="q-m2-value"><input type="number" id="qM2" value="80" min="5" max="3000" step="1" aria-label="Metros cuadrados" /><span>m²</span></div>
                <div class="q-m2-presets" id="qPresets"></div>
              </div>
              <input class="range" type="range" id="qM2Range" min="5" max="800" step="5" value="80" aria-label="Deslizador de metros cuadrados" />
            </div>
            <div class="q-group"><h4>Nivel de acabado</h4><div class="q-cards" id="qLevels" role="group" aria-label="Nivel de acabado"></div></div>
            <div class="q-group"><h4>Ritmo de ejecución</h4><div class="chips" id="qUrgency" role="group" aria-label="Ritmo de ejecución"></div></div>
          </div>
          <div class="q-pane" data-pane="3">
            <div class="q-group"><h4>Servicios adicionales</h4><div class="chips" id="qExtras" role="group" aria-label="Servicios adicionales"></div></div>
            <div class="q-group">
              <h4>¿A quién enviamos la propuesta?</h4>
              <div class="form-row">
                <div class="field"><label for="qName">Nombre</label><input class="input" id="qName" placeholder="Tu nombre" autocomplete="name" /></div>
                <div class="field"><label for="qPhone">WhatsApp</label><input class="input" id="qPhone" placeholder="+51 999 999 999" autocomplete="tel" /></div>
              </div>
              <div class="field"><label for="qEmail">Correo</label><input class="input" type="email" id="qEmail" placeholder="tucorreo@dominio.com" autocomplete="email" /></div>
              <div class="field"><label for="qNotes">Cuéntanos del proyecto (opcional)</label><textarea class="textarea" id="qNotes" placeholder="Ej. Quiero remodelar mi departamento de 90 m² en Miraflores, cocina y sala principalmente."></textarea></div>
              <p class="form-status" id="qStatus" role="status"></p>
            </div>
          </div>
        </div>
        <div class="q-actions">
          <button class="btn is-ghost is-sm" id="qBack">Atrás</button>
          <button class="btn is-sm" id="qNext">Continuar ${ICO.arrow}</button>
        </div>
      </div>

      <aside class="q-result" id="qResult" aria-live="polite">
        <div class="q-result-head"><h4>Estimado referencial</h4><span class="pill-live"><i></i> En vivo</span></div>
        <div class="q-total"><b id="qTotal">S/ 0</b><small id="qTotalNote">Incluye IGV (18%)</small></div>
        <div class="q-range"><span id="qLow">S/ 0</span><i></i><span id="qHigh">S/ 0</span></div>
        <div class="q-facts">
          <div class="q-fact"><b id="qPerM2">S/ 0</b><span>por m²</span></div>
          <div class="q-fact"><b id="qWeeks">—</b><span>plazo estimado</span></div>
        </div>
        <div class="q-lines" id="qLines"></div>
        <button class="btn is-clay is-block" id="qSend">Enviar y agendar visita ${ICO.arrow}</button>
        <button class="btn is-ghost is-block is-sm" id="qWhats">Enviar por WhatsApp</button>
        <p class="q-disclaimer">Cálculo referencial basado en tarifas promedio del estudio. El presupuesto formal se emite tras la visita técnica y el levantamiento de medidas, sin costo.</p>
      </aside>
    </div>
  </div>
</section>`;
}

export function teamSection({ full = false, withHead = true } = {}) {
  const lead = team.find((m) => m.lead) || team[0];
  // En portada solo va el CEO; el equipo completo vive dentro de /nosotros/.
  const shown = full ? team.filter((m) => m !== lead) : [];

  return `
<section class="section" id="equipo"${withHead ? '' : ' style="padding-top:0"'}>
  <div class="shell">
    ${
      withHead
        ? head({
            eyebrow: 'Nuestro equipo',
            title: 'Las personas detrás de <em>cada proyecto</em>',
            sub: 'Un equipo diverso y multidisciplinario que trabaja unido para hacer realidad tus ideas de diseño.',
            clay: true,
          })
        : ''
    }
    <div class="team-lead" data-reveal="up">
      <div class="team-lead-photo"><img src="${lead.photo}" alt="${lead.name}, ${lead.role}" loading="lazy" /></div>
      <div class="team-lead-body">
        <p class="role-label">${lead.role}</p>
        <h3 class="display h-md">${lead.name}</h3>
        <p class="lead">${lead.bio}</p>
        <div class="member-focus">${lead.focus.map((f) => `<span>${f}</span>`).join('')}</div>
        <div class="hero-cta">
          <a class="btn is-sm" href="/contacto/">Agendar reunión</a>
          <button class="btn is-ghost is-sm" data-open="voice">Hablar con el estudio</button>
        </div>
      </div>
    </div>
    ${
      shown.length
        ? `<div class="team-grid">
      ${shown
        .map(
          (m, i) => `<article class="member" data-tilt="7" data-reveal="up" data-delay="${(i * 0.06).toFixed(2)}">
        <div class="member-photo"><img src="${m.photo}" alt="${m.name}, ${m.role}" loading="lazy" /></div>
        <div class="member-body"><h4>${m.name}</h4><span>${m.role}</span></div>
        <div class="member-hover">
          <h4 style="font-family:var(--font-display);font-size:var(--step-1)">${m.name}</h4>
          <p>${m.bio}</p>
          <div class="member-focus">${m.focus.map((f) => `<span>${f}</span>`).join('')}</div>
        </div>
      </article>`
        )
        .join('')}
    </div>`
        : ''
    }
    ${full ? '' : `<div style="margin-top:2.4rem" data-reveal="fade"><a class="btn is-ghost" href="/nosotros/#equipo">Conocer al equipo completo ${ICO.arrow}</a></div>`}
  </div>
</section>`;
}

export function productsSection({ full = false, withHead = true } = {}) {
  // En portada solo la línea de sofás: el catálogo completo vive en /muebles/
  const shown = full ? products : products.slice(0, 4);

  return `
<section class="section" id="muebles"${withHead ? '' : ' style="padding-top:0"'}>
  <div class="shell">
    ${withHead ? head({ title: 'Muebles diseñados y <em>fabricados por nosotros</em>' }) : ''}
    <div class="cards" style="--cols:${full ? 3 : 4}">
      ${shown
        .map(
          (p, i) => `<article class="card-prod${p.cutout ? ' is-cutout' : ''}" data-reveal="up" data-delay="${(i * 0.06).toFixed(2)}">
        <div class="card-media">
          <img src="${p.photo}" alt="${p.name}" loading="lazy" />
          <img src="${p.scene}" alt="" loading="lazy" />
        </div>
        <span class="card-tag">${p.tag}</span>
        <div class="card-body">
          <h4>${p.name}</h4>
          <p>${p.text}</p>
        </div>
      </article>`
        )
        .join('')}
    </div>
    <div style="margin-top:2.4rem" data-reveal="fade">
      ${
        full
          ? `<a class="btn" href="/contacto/">Cotizar una pieza ${ICO.arrow}</a>`
          : `<a class="btn is-ghost" href="/muebles/">Ver todo el mobiliario ${ICO.arrow}</a>`
      }
    </div>
  </div>
</section>`;
}

export function quotesSection() {
  return `
<section class="section">
  <div class="shell">
    <div class="section-head">
      <h2 class="display h-md" data-reveal="lines">Clientes que <em>volverían a hacerlo</em></h2>
    </div>
    <div class="quotes">
      ${testimonials
        .map(
          (t, i) => `<blockquote class="card quote" data-reveal="up" data-delay="${(i * 0.08).toFixed(2)}">
        <p>${t.text}</p><footer><b>${t.author}</b>${t.role}</footer>
      </blockquote>`
        )
        .join('')}
    </div>
  </div>
</section>`;
}

export function clientsSection() {
  return `
<section class="section is-clients" id="clientes">
  <div class="shell">
    <p class="clients-cap" data-reveal="fade">Marcas y espacios que ya confiaron en nosotros</p>
  </div>
  <div class="marquee clients-marquee" style="--speed:46s" data-reveal="fade">
    <div class="marquee-track" data-marquee>
      ${clients
        .map((c) => `<img class="client-logo" src="${c.logo}" alt="${c.name}" loading="lazy" />`)
        .join('')}
    </div>
  </div>
</section>`;
}

export function maiaSection() {
  return `
<section class="maia-section" id="maia" aria-labelledby="maiaTitle">
  <div class="maia-noise" aria-hidden="true"></div>
  <div class="shell maia-shell">
    <button class="maia-radar" type="button" data-open="voice" aria-label="Iniciar conversación con Maia">
      <video class="maia-network-video" autoplay muted loop playsinline preload="metadata" aria-hidden="true">
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260514_135830_bb6491d1-9b66-4aec-9722-13b4dfe3fb46.mp4" type="video/mp4" />
      </video>
      <span class="maia-network-glow" aria-hidden="true"></span>
    </button>

    <div class="maia-content">
      <div class="maia-kicker"><span>Asistencia inmediata</span></div>
      <h2 class="maia-title" id="maiaTitle">Habla con <em>Maia.</em></h2>
      <p class="maia-copy">Nuestra asesora IA conoce los servicios de ModArch. Cuéntale tu idea por voz y recibe orientación al instante, las 24 horas.</p>
      <button class="maia-cta" type="button" data-open="voice">Iniciar conversación <span aria-hidden="true">↗</span></button>
      <small>La experiencia de voz depende de la compatibilidad del navegador.</small>
    </div>
  </div>
</section>`;
}

export function maiaAboutSection() {
  return `
<section class="section maia-about-section" id="maia" aria-labelledby="maiaAboutTitle">
  <div class="shell">
    <div class="maia-about-card">
      <button class="maia-about-visual" type="button" data-open="voice" aria-label="Llamar a Maia">
        <video class="maia-network-video" autoplay muted loop playsinline preload="metadata" aria-hidden="true">
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260514_135830_bb6491d1-9b66-4aec-9722-13b4dfe3fb46.mp4" type="video/mp4" />
        </video>
        <span class="maia-network-glow" aria-hidden="true"></span>
      </button>
      <div class="maia-about-content">
        <span class="maia-about-kicker">Asistencia inmediata · 24 horas</span>
        <h2 class="maia-about-title" id="maiaAboutTitle">Tu proyecto comienza hablando con <em>Maia.</em></h2>
        <p>Maia conoce nuestros servicios, procesos y rangos de inversión. Cuéntale qué espacio quieres transformar y recibe orientación al instante.</p>
        <div class="maia-about-actions">
          <button class="maia-cta" type="button" data-open="voice">Llamar a Maia <span aria-hidden="true">↗</span></button>
          <button class="maia-about-chat" type="button" data-open="chat">Escribirle a Maia</button>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

export function postsSection({ full = false, withHead = true } = {}) {
  return `
<section class="section" id="blog"${withHead ? '' : ' style="padding-top:0"'}>
  <div class="shell">
    ${
      withHead
        ? head({
            eyebrow: 'Blog',
            title: 'Ideas para tu <em>próximo espacio</em>',
            sub: 'Guías prácticas sobre diseño, materiales e iluminación escritas por nuestro equipo.',
          })
        : ''
    }
    <div class="posts">
      ${blog
        .map(
          (p, i) => `<article class="post" data-reveal="up" data-delay="${(i * 0.08).toFixed(2)}">
        <div class="post-img"><img src="${p.image}" alt="${p.title}" loading="lazy" /></div>
        <div class="post-meta"><b>${p.tag}</b><span>${p.date}</span></div>
        <h4>${p.title}</h4><p>${p.excerpt}</p><span class="link-sweep">Leer artículo</span>
      </article>`
        )
        .join('')}
    </div>
    ${full ? '' : `<div style="margin-top:2.4rem" data-reveal="fade"><a class="btn is-ghost" href="/blog/">Ver el blog ${ICO.arrow}</a></div>`}
  </div>
</section>`;
}

export function faqSection({ standalone = false } = {}) {
  const items = faqs
    .map(
      (f, i) => `<div class="acc-item">
      <button class="acc-trigger" aria-expanded="false" aria-controls="faq-${i}"><span>${f.q}</span><span class="acc-sign" aria-hidden="true"></span></button>
      <div class="acc-panel" id="faq-${i}"><div>${f.a}</div></div>
    </div>`
    )
    .join('');

  if (!standalone) return `<div id="faqList">${items}</div>`;

  return `
<section class="section" id="faq">
  <div class="shell">
    ${head({
      eyebrow: 'Preguntas frecuentes',
      title: 'Resolvemos tus dudas <em>antes de empezar</em>',
      sub: 'Y si te queda alguna, nuestro asistente responde al instante por chat o por llamada.',
    })}
    <div id="faqList" style="max-width:74ch">${items}</div>
  </div>
</section>`;
}

// El iframe va diferido: es contenido de terceros y no debe frenar la carga
function mapEmbed() {
  // La raya del texto confunde al geocodificador: se sustituye por coma
  const q = encodeURIComponent(company.address.replace(' — ', ', '));
  return `
        <div class="contact-map">
          <iframe
            src="https://www.google.com/maps?q=${q}&output=embed"
            title="Ubicación del estudio ModArch en ${company.address}"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen></iframe>
          <a class="map-open" href="https://www.google.com/maps/search/?api=1&query=${q}" target="_blank" rel="noopener">Abrir en Maps ${ICO.arrowUp}</a>
        </div>`;
}

export function contactSection({ withFaq = true } = {}) {
  return `
<section class="section${withFaq ? ' contact-page' : ' contact-compact'}" id="contacto">
  <div class="shell">
    <div class="contact-grid">
      <div>
        <h2 class="display h-md" data-reveal="lines"${withFaq ? '' : ' style="margin-bottom:2rem"'}>${
          withFaq ? 'Escríbenos <em>o visítanos</em>' : 'Conversemos sobre <em>tu proyecto</em>'
        }</h2>
        <div class="contact-list">
          <div class="contact-row"><span class="ico">${ICO.pin}</span><div><h5>Estudio</h5><p>${company.address}</p></div></div>
          <div class="contact-row"><span class="ico">${ICO.phone}</span><div><h5>Teléfono / WhatsApp</h5>${company.phones.map((p) => `<a href="${wa}" target="_blank" rel="noopener">${p}</a>`).join('<br />')}</div></div>
          <div class="contact-row"><span class="ico">${ICO.mail}</span><div><h5>Correo</h5><a href="mailto:${company.email}">${company.email}</a></div></div>
          <div class="contact-row"><span class="ico">${ICO.clock}</span><div><h5>Horario</h5><p>${company.hours}</p></div></div>
        </div>
        ${withFaq ? '' : mapEmbed()}
      </div>
      <div>
        <form class="form" id="contactForm" novalidate>
          <div>
            <h3 class="display h-sm" style="margin-top:0.9rem">Cuéntanos qué espacio quieres transformar</h3>
          </div>
          <div class="form-row">
            <div class="field"><label for="cName">Nombre</label><input class="input" id="cName" name="name" required autocomplete="name" /></div>
            <div class="field"><label for="cLast">Apellidos</label><input class="input" id="cLast" name="lastname" autocomplete="family-name" /></div>
          </div>
          <div class="form-row">
            <div class="field"><label for="cEmail">Correo</label><input class="input" type="email" id="cEmail" name="email" required autocomplete="email" /></div>
            <div class="field"><label for="cPhone">Teléfono</label><input class="input" id="cPhone" name="phone" autocomplete="tel" /></div>
          </div>
          <div class="field">
            <label for="cService">Servicio de interés</label>
            <select class="select" id="cService" name="service">
              ${services.map((s) => `<option value="${s.title}">${s.title}</option>`).join('')}
            </select>
          </div>
          <div class="field"><label for="cMsg">Mensaje</label><textarea class="textarea" id="cMsg" name="message" placeholder="Ubicación, metraje aproximado y qué te gustaría lograr."></textarea></div>
          <button class="btn is-block" type="submit">Enviar mensaje ${ICO.arrow}</button>
          <p class="form-status" id="cStatus" role="status"></p>
          <p class="form-note">También puedes hablar ahora con nuestro asistente por voz o escribirnos por WhatsApp.</p>
        </form>
      </div>
    </div>
    ${
      withFaq
        ? `<div class="contact-lower">
      ${mapEmbed()}
      <div class="contact-faq">
        <h2 class="display h-sm" data-reveal="lines">Resolvemos tus dudas <em>antes de empezar</em></h2>
        ${faqSection()}
      </div>
    </div>`
        : ''
    }
  </div>
</section>`;
}

export function ctaSection() {
  return `
<section class="section" style="padding-top:0">
  <div class="shell">
    <div class="cta" data-reveal="up">
      <h2 class="display h-lg">¿Listo para transformar tu espacio?</h2>
      <p class="lead" style="max-width:52ch">Agenda una visita técnica sin costo. Medimos, escuchamos y te entregamos una propuesta clara.</p>
      <div class="hero-cta" style="justify-content:center">
        <a class="btn" href="${wa}?text=Hola%20ModArch%2C%20quiero%20agendar%20una%20visita" target="_blank" rel="noopener">Agendar por WhatsApp</a>
        <button class="btn is-ghost" data-open="voice">Hablar con el agente IA</button>
      </div>
    </div>
  </div>
</section>`;
}

export const jsonLd = () =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: company.legal,
    alternateName: `${company.name} — ${company.claim}`,
    url: 'https://modarch.com.pe/',
    logo: 'https://modarch.com.pe/assets/img/brand/logo-dark.png',
    image: 'https://modarch.com.pe/assets/img/hero-arquitectura.jpg',
    email: company.email,
    telephone: `+${company.whatsapp}`,
    priceRange: '$$',
    slogan: company.tagline,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Venezuela 6023',
      addressLocality: 'San Miguel',
      addressRegion: 'Lima',
      addressCountry: 'PE',
    },
    areaServed: { '@type': 'Country', name: 'Perú' },
    sameAs: [company.social.instagram, company.social.facebook, company.social.tiktok],
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '18:30' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '13:00' },
    ],
  });

export const faqJsonLd = () =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  });
