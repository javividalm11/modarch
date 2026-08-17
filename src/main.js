import { company, projects } from '../shared/site-data.js';
import {
  gsap,
  initSmoothScroll,
  initReveals,
  initParallax,
  initMagnetic,
  initNav,
  initMenu,
  initCounters,
  initTilt,
  initMarquees,
  splitWords,
  playIntro,
  refresh,
  reduced,
  ScrollTrigger,
} from './modules/motion.js';
import {
  initServices,
  initFaq,
  initValuesToggle,
  initProductCards,
  initLightbox,
  initYear,
  openProject,
} from './modules/render.js';
import { initHero3D } from './modules/hero3d.js';
import { initQuoter, initQuoterTeaser } from './modules/quoter.js';
import { initScrollSequence } from './modules/scroll-sequence.js';
import { initHouseCube } from './modules/house-cube.js';
// La marca extruida en 3D vive en ./modules/preloader3d.js, de momento sin usar
import { initInteriorModel } from './modules/interior-model.js';
import { initChatbot } from './modules/chatbot.js';
import { initVoicebot } from './modules/voicebot.js';
import { initViewer360 } from './modules/viewer360.js';
import { initProjectsHive } from './modules/projects-hive.js';

// Escena 3D del hero desactivada. Cambia a true para volver a activarla.
const HERO_3D = false;

// Apertura del hero por el vano en la primera visita. Cambia a true para volver.
const INTRO = false;

const $ = (s) => document.querySelector(s);

// La apertura del hero se ve una sola vez por sesión: al navegar entre páginas estorba
function isFirstVisit() {
  try {
    if (sessionStorage.getItem('modarch:seen')) return false;
    sessionStorage.setItem('modarch:seen', '1');
    return true;
  } catch {
    return true;
  }
}

const lerp = (a, b, t) => a + (b - a) * t;

// Silueta de vano en píxeles, para que no se deforme con la proporción del hero
function archPath(t, w, h) {
  const ease = t * t * (3 - 2 * t);
  const cover = Math.hypot(w, h) * 1.15;

  const aw = lerp(Math.min(w, h) * 0.19, cover, ease);
  const ah = lerp(Math.min(w, h) * 0.42, cover * 1.25, ease);
  const cx = w / 2;
  const cy = lerp(h * 0.64, h * 0.5, ease);

  const r = aw / 2;
  const x0 = cx - r;
  const x1 = cx + r;
  const yb = cy + ah / 2;
  const yt = cy - ah / 2 + r;

  return `path("M${x0.toFixed(1)},${yb.toFixed(1)} L${x0.toFixed(1)},${yt.toFixed(1)} A${r.toFixed(1)},${r.toFixed(1)} 0 0 1 ${x1.toFixed(1)},${yt.toFixed(1)} L${x1.toFixed(1)},${yb.toFixed(1)} Z")`;
}

// El hero se abre a través del vano y la imagen aterriza en su escala final
function revealHero() {
  const media = $('.hero-media');
  const img = $('#heroImg');
  if (!media || !img || reduced) return null;

  const p = { v: 0 };
  const draw = () => {
    const r = media.getBoundingClientRect();
    media.style.clipPath = archPath(p.v, r.width, r.height);
  };

  draw();
  gsap.set(media, { autoAlpha: 0 });

  return gsap
    .timeline()
    .to(media, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' })
    .to(
      p,
      {
        v: 1,
        duration: 1.7,
        ease: 'expo.inOut',
        onUpdate: draw,
        onComplete: () => {
          media.style.clipPath = '';
        },
      },
      '+=0.2'
    )
    .fromTo(img, { scale: 1.5 }, { scale: 1.08, duration: 2.3, ease: 'expo.out' }, 0.25);
}

function initPanels() {
  const chat = initChatbot();
  const voice = initVoicebot();
  const widgetVideos = {
    chat: document.querySelector('#chatPanel .maia-widget-network'),
    voice: document.querySelector('#voicePanel .voice-maia-video'),
  };

  const setWidgetVideo = (name, active) => {
    const video = widgetVideos[name];
    if (!video) return;
    if (active && !reduced) video.play().catch(() => {});
    else video.pause();
  };

  Object.values(widgetVideos).forEach((video) => video?.pause());

  const openers = {
    chat: () => {
      voice?.close();
      setWidgetVideo('voice', false);
      chat?.open();
      setWidgetVideo('chat', true);
    },
    voice: () => {
      chat?.close();
      setWidgetVideo('chat', false);
      voice?.open();
      setWidgetVideo('voice', true);
    },
  };

  document.addEventListener('click', (e) => {
    const open = e.target.closest('[data-open]');
    if (open) {
      openers[open.dataset.open]?.();
      return;
    }
    const close = e.target.closest('[data-close]');
    if (close) {
      if (close.dataset.close === 'chat') {
        chat?.close();
        setWidgetVideo('chat', false);
      } else {
        voice?.close();
        setWidgetVideo('voice', false);
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    chat?.close();
    voice?.close();
    setWidgetVideo('chat', false);
    setWidgetVideo('voice', false);
  });
}

function initMaiaTheme() {
  const section = $('#maia');
  if (!section) return;

  const root = document.documentElement;
  const video = section.querySelector('.maia-network-video');
  const setTheme = (active) => root.classList.toggle('maia-theme', active);
  setTheme(false);

  // El vídeo solo corre mientras Maia está a la vista
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) video?.play().catch(() => {});
    else video?.pause();
  }, { threshold: [0, 0.35] });
  observer.observe(section);

  // Se mide en cada scroll, no con un disparador: las secciones ancladas se
  // crean después y dejarían las posiciones cacheadas 3.700 px arriba
  const from = $('#clientes') || section;
  const to = section.classList.contains('maia-about-section') ? $('footer') : $('#equipo');
  let queued = false;

  const update = () => {
    queued = false;
    const line = window.innerHeight * 0.62;
    const entered = from.getBoundingClientRect().top <= line;
    const left = to ? to.getBoundingClientRect().top <= line : false;
    setTheme(entered && !left);
  };

  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();

  window.addEventListener('pagehide', () => setTheme(false), { once: true });
}

function initWorks() {
  const galleryStage = $('#worksStage');

  // El panal lo dibuja el CSS; la cuadrícula WebGL queda solo como respaldo
  if (galleryStage) {
    const fallback = $('#worksFallback');
    const title = $('#worksTitle');
    const meta = $('#worksMeta');
    const dots = $('#worksDots');
    const prev = $('#worksPrev');
    const next = $('#worksNext');
    const open = $('#worksOpen');

    if (dots) {
      dots.innerHTML = projects
        .map((project, index) => `<i data-work-dot="${index}" aria-label="${project.title}"></i>`)
        .join('');
    }

    const updateProject = (index) => {
      const project = projects[index];
      if (!project) return;
      if (title) title.textContent = project.title;
      if (meta) meta.textContent = `${project.category} · ${project.style} · ${project.area}`;
      dots?.querySelectorAll('[data-work-dot]').forEach((dot, dotIndex) => {
        dot.classList.toggle('is-on', dotIndex === index);
      });
    };

    const gallery = initProjectsHive(galleryStage, projects, {
      onChange: updateProject,
      onSelect: openProject,
    });

    if (!gallery) {
      galleryStage.hidden = true;
      galleryStage.nextElementSibling?.setAttribute('hidden', '');
      fallback?.removeAttribute('hidden');
      return;
    }

    fallback?.setAttribute('hidden', '');
    updateProject(0);
    prev?.addEventListener('click', gallery.prev);
    next?.addEventListener('click', gallery.next);
    open?.addEventListener('click', () => openProject(gallery.currentIndex()));
    galleryStage.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') gallery.prev();
      else if (event.key === 'ArrowRight') gallery.next();
      // Solo con el foco en el escenario: en un hexágono se abriría dos veces
      else if (event.key === 'Enter' && event.target === galleryStage) openProject(gallery.currentIndex());
      else return;
      event.preventDefault();
    });
    galleryStage.tabIndex = 0;
    return;
  }

  const section = $('.project-cylinder');
  const sticky = section?.querySelector('.project-cylinder-sticky');
  const viewport = $('#projectCylinderViewport');
  if (!section || !sticky || !viewport) return;

  const cards = [...viewport.querySelectorAll('[data-project-card]')];
  const state = {
    progress: 0,
    target: 0,
    cardW: 400,
    cardH: 270,
    visible: true,
    active: -1,
  };
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const sectionMetrics = () => {
    const top = window.scrollY + section.getBoundingClientRect().top;
    return { top, range: Math.max(1, section.offsetHeight - window.innerHeight) };
  };
  const scrollToIndex = (index) => {
    const next = clamp(index, 0, cards.length - 1);
    const { top, range } = sectionMetrics();
    window.scrollTo({
      top: top + (next / Math.max(1, cards.length - 1)) * range,
      behavior: reduced ? 'auto' : 'smooth',
    });
  };

  const resize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const compact = width < 640;
    state.compact = compact;
    const horizontalRoom = width - (compact ? 28 : 72);
    // En vertical mandan las tres tarjetas apiladas: de ahí el 0.42
    const verticalRoom = compact ? height * 0.42 : (height - 80) * 1.48;
    const desiredWidth = compact ? width * 0.86 : width * 0.52;
    state.cardW = Math.max(
      compact ? 220 : 420,
      Math.min(compact ? 420 : 720, desiredWidth, horizontalRoom, verticalRoom),
    );
    state.cardH = state.cardW / 1.48;
    viewport.style.width = `${state.cardW}px`;
    viewport.style.height = `${state.cardH}px`;
  };
  resize();
  window.addEventListener('resize', resize);

  sticky.addEventListener('pointermove', (event) => {
    const box = sticky.getBoundingClientRect();
    mouse.targetX = clamp(((event.clientX - box.left) / box.width) * 2 - 1, -1, 1);
    mouse.targetY = clamp(((event.clientY - box.top) / box.height) * 2 - 1, -1, 1);
  });
  sticky.addEventListener('pointerleave', () => {
    mouse.targetX = 0;
    mouse.targetY = 0;
  });

  cards.forEach((card, index) => {
    card.addEventListener('click', (event) => {
      event.stopPropagation();
      if (index === state.active) openProject(index);
    });
  });

  section.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') scrollToIndex(state.active + 1);
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') scrollToIndex(state.active - 1);
    else if (event.key === 'Enter') openProject(state.active);
    else return;
    event.preventDefault();
  });
  const observer = new IntersectionObserver(([entry]) => {
    state.visible = entry.isIntersecting;
  }, { threshold: 0.01 });
  observer.observe(sticky);

  const smoothstep = (value) => value * value * (3 - 2 * value);
  const render = () => {
    requestAnimationFrame(render);
    if (!state.visible) return;

    const { top, range } = sectionMetrics();
    state.target = clamp((window.scrollY - top) / range, 0, 1) * (cards.length - 1);
    state.progress += (state.target - state.progress) * (reduced ? 1 : 0.075);
    mouse.x += (mouse.targetX - mouse.x) * 0.07;
    mouse.y += (mouse.targetY - mouse.y) * 0.07;

    const rounded = Math.round(state.progress);
    const gap = Math.max(22, state.cardH * 0.11);
    const step = state.cardH + gap;

    cards.forEach((card, index) => {
      const offset = index - state.progress;
      const distance = Math.abs(offset);
      const sign = Math.sign(offset);

      if (distance > 2.45) {
        card.style.visibility = 'hidden';
        return;
      }
      card.style.visibility = 'visible';

      let y;
      let z;
      let rotation;
      let opacity;

      if (distance <= 1) {
        const eased = smoothstep(distance);
        y = sign * eased * step;
        z = 105 - eased * 125;
        rotation = sign * eased * 38;
        opacity = 1 - distance * 0.32;
      } else {
        const eased = smoothstep(Math.min(distance - 1, 1));
        y = sign * (step + eased * step * 0.82);
        z = -20 - eased * 115;
        rotation = sign * (38 + eased * 20);
        opacity = Math.max(0, 0.68 - (distance - 1) * 0.62);
      }

      const center = Math.max(0, 1 - distance);
      const tiltX = reduced ? 0 : -mouse.y * 5 * center;
      const tiltY = reduced ? 0 : mouse.x * 7 * center;

      card.style.zIndex = String(Math.round(300 - distance * 100));
      card.style.opacity = opacity.toFixed(3);
      card.style.pointerEvents = distance < 0.42 ? 'auto' : 'none';
      card.style.transform = `translateY(${y.toFixed(2)}px) translateZ(${z.toFixed(2)}px) rotateX(${(rotation + tiltX).toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) rotateZ(-1deg)`;
    });

    const active = clamp(rounded, 0, cards.length - 1);
    if (active !== state.active) {
      state.active = active;
      cards.forEach((card, index) => {
        const isActive = index === active;
        card.classList.toggle('is-active', isActive);
        card.tabIndex = isActive ? 0 : -1;
      });
    }
  };
  requestAnimationFrame(render);
}

// Volumen 3D de la sección de estilo, con línea guía hacia la ficha activa
function initStyleCube() {
  const wrap = $('#styleCube');
  const stage = $('#cubeStage');
  if (!wrap || !stage) return;

  const cards = [...wrap.querySelectorAll('.cube-card')];
  const leader = $('#cubeLeader');
  const line = leader.querySelector('line');
  const dot = leader.querySelector('circle');

  const faces = cards.map((card, i) => ({
    img: document.querySelectorAll('#pillarsFallback .pillar-img img')[i]?.getAttribute('src'),
  }));

  let current = 0;

  const cube = initHouseCube(stage, faces, {
    onHover(index, point) {
      wrap.classList.toggle('is-active', index !== null);

      if (index !== null && index !== current) {
        current = index;
        cards.forEach((c, i) => c.classList.toggle('is-on', i === index));
      }

      if (!point) return;
      const r = stage.getBoundingClientRect();
      // La guía sale de la cara y termina en el borde derecho, a la altura de la ficha
      const endX = r.width;
      const endY = r.height * 0.5;
      line.setAttribute('x1', point.x);
      line.setAttribute('y1', point.y);
      line.setAttribute('x2', endX);
      line.setAttribute('y2', endY);
      dot.setAttribute('cx', point.x);
      dot.setAttribute('cy', point.y);
    },
  });

  if (!cube) {
    wrap.hidden = true;
    $('#pillarsFallback')?.removeAttribute('hidden');
  }
}

// Los botones flotantes se revelan al dejar atrás el hero, que ya lleva el suyo
function initDockReveal() {
  const dock = $('.dock');
  const hero = $('.hero');
  if (!dock || !hero) return;

  dock.classList.add('is-hidden');

  ScrollTrigger.create({
    trigger: hero,
    start: 'bottom 75%',
    onEnter: () => dock.classList.remove('is-hidden'),
    onLeaveBack: () => dock.classList.add('is-hidden'),
  });
}

// Hero cinematográfico: push-in continuo, parallax de puntero y de scroll
function initHeroMedia() {
  const img = $('#heroImg');
  if (!img || reduced) return;

  gsap.to(img, {
    scale: 1.16,
    duration: 22,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
  });

  // En píxeles para no chocar con el parallax de puntero, que usa porcentajes
  gsap.to(img, {
    y: 110,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.1 },
  });

  if (window.matchMedia('(pointer: coarse)').matches) return;

  const px = gsap.quickTo(img, 'xPercent', { duration: 1.6, ease: 'power2.out' });
  const py = gsap.quickTo(img, 'yPercent', { duration: 1.6, ease: 'power2.out' });

  window.addEventListener(
    'pointermove',
    (e) => {
      px((e.clientX / window.innerWidth - 0.5) * -2.4);
      py((e.clientY / window.innerHeight - 0.5) * -1.6);
    },
    { passive: true }
  );
}

// El vídeo pesa varios MB: solo se descarga si el usuario llega a la sección
function initAboutVideo() {
  const video = $('#aboutVideo');
  if (!video) return;

  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        video.pause();
        return;
      }
      if (!video.src && video.dataset.src) video.src = video.dataset.src;
      video.play().catch(() => {});
    },
    { threshold: 0.25 }
  );
  io.observe(video);
}

function initScrollTextHighlight() {
  document.querySelectorAll('[data-scroll-highlight]').forEach((el) => {
    const words = splitWords(el);
    if (!words.length) return;

    gsap.set(el, { opacity: 1 });
    if (reduced) {
      gsap.set(words, { opacity: 1 });
      return;
    }

    gsap.fromTo(
      words,
      { opacity: 0.16 },
      {
        opacity: 1,
        duration: 0.2,
        stagger: { each: 0.065 },
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 78%',
          end: 'bottom 40%',
          scrub: 0.35,
        },
      }
    );
  });
}

// El mundo del footer se descarga y reproduce solo al acercarse al final.
function initFooterWorld() {
  const video = $('.footer-world-video');
  if (!video) return;

  video.addEventListener('canplay', () => video.classList.add('is-ready'), { once: true });

  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        video.pause();
        return;
      }
      if (!video.src && video.dataset.src) video.src = video.dataset.src;
      video.play().catch(() => {});
    },
    { rootMargin: '240px 0px', threshold: 0.04 }
  );
  io.observe(video);
}

function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;
  const status = $('#cStatus');

  // Abre WhatsApp con el mensaje redactado. Síncrono: si no, lo bloquean
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));

    if (!data.name?.trim() || !data.email?.trim()) {
      status.className = 'form-status is-err';
      status.textContent = 'Necesitamos al menos tu nombre y correo.';
      return;
    }

    const nombre = [data.name, data.lastname].map((v) => v?.trim()).filter(Boolean).join(' ');
    const msg = [
      'Hola ModArch, escribo desde la web:',
      '',
      `Nombre: ${nombre}`,
      `Correo: ${data.email.trim()}`,
      data.phone?.trim() ? `Teléfono: ${data.phone.trim()}` : null,
      data.service ? `Servicio de interés: ${data.service}` : null,
      data.message?.trim() ? `\nMensaje:\n${data.message.trim()}` : null,
    ]
      .filter((l) => l !== null)
      .join('\n');

    const url = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(msg)}`;
    const win = window.open(url, '_blank', 'noopener');

    if (win) {
      status.className = 'form-status is-ok';
      status.textContent = 'Abrimos WhatsApp con tus datos. Solo pulsa enviar y te respondemos al toque.';
    } else {
      // Popup bloqueado: se deja el enlace a mano en lugar de perder el mensaje
      status.className = 'form-status is-err';
      status.innerHTML = `Tu navegador bloqueó la ventana. <a href="${url}" target="_blank" rel="noopener">Abre WhatsApp aquí</a>.`;
    }
  });
}

async function boot() {
  document.body.dataset.booted = '1';
  document.documentElement.classList.add('css-ready');
  const first = isFirstVisit();

  initYear();
  initSmoothScroll();
  initNav();
  initMenu();
  initMarquees();
  initServices();
  initFaq();
  initValuesToggle();
  initProductCards();
  initLightbox();
  initQuoter();
  initQuoterTeaser();
  initViewer360();
  initPanels();
  initMaiaTheme();
  initAboutVideo();
  initScrollTextHighlight();
  initFooterWorld();
  initContactForm();
  initDockReveal();

  if (HERO_3D) initHero3D($('#heroCanvas'));

  gsap.ticker.lagSmoothing(500, 33);

  // La apertura por el vano solo en la primera visita; después el hero ya está puesto
  const heroTl = INTRO && first ? revealHero() : null;
  // Se retrasa el titular para que el vano se lea solo antes de abrirse
  const introTl = playIntro({ full: first });
  if (heroTl) introTl.delay(1);
  initReveals();
  initParallax();
  initMagnetic();
  initCounters();
  initTilt();

  // Lo pesado arranca tras la intro, para no robarle frames
  const startHeavy = () => {
    gsap.ticker.lagSmoothing(0);
    initHeroMedia();
    initWorks();
    initStyleCube();
    initInteriorModel($('#qtInteriorModel'));
    initScrollSequence($('.seq'));
    requestAnimationFrame(refresh);
  };

  if (heroTl) heroTl.eventCallback('onComplete', startHeavy);
  else startHeavy();

  window.addEventListener('load', refresh);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
