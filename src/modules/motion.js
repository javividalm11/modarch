import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export let lenis = null;

/* Ritmo Japandi: recorridos cortos, curvas largas, cero rebote */
export const M = {
  ease: 'power2.out',
  easeLong: 'expo.out',
  easeIO: 'power2.inOut',
  slow: 1.6,
  base: 1.15,
  quick: 0.75,
  shift: 22,
  stagger: 0.07,
};

export function initSmoothScroll() {
  if (reduced) return null;

  lenis = new Lenis({
    duration: 1.45,
    easing: (t) => 1 - Math.pow(1 - t, 3),
    smoothWheel: true,
    touchMultiplier: 1.4,
    wheelMultiplier: 0.9,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  window.__lenis = lenis;
  return lenis;
}

export function scrollTo(target, offset = -70) {
  if (lenis) lenis.scrollTo(target, { offset, duration: 1.6 });
  else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
}

export function splitWords(el) {
  if (!el || el.dataset.split === 'done') return [];
  const inner = [];

  const walk = (node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent;
        if (!text.trim()) continue;
        const frag = document.createDocumentFragment();
        text.split(/(\s+)/).forEach((chunk) => {
          if (!chunk) return;
          if (/^\s+$/.test(chunk)) {
            frag.appendChild(document.createTextNode(' '));
            return;
          }
          const outer = document.createElement('span');
          outer.className = 'w';
          const ins = document.createElement('span');
          ins.className = 'wi';
          ins.textContent = chunk;
          outer.appendChild(ins);
          frag.appendChild(outer);
          inner.push(ins);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
      }
    }
  };

  walk(el);
  el.dataset.split = 'done';
  return inner;
}

// Parte en caracteres conservando los espacios como separadores reales
export function splitChars(el) {
  if (!el || el.dataset.split === 'chars') return [];
  const text = el.textContent;
  el.textContent = '';
  const chars = [];

  for (const ch of text) {
    if (ch === ' ') {
      el.appendChild(document.createTextNode(' '));
      continue;
    }
    const span = document.createElement('span');
    span.className = 'ch';
    span.textContent = ch;
    el.appendChild(span);
    chars.push(span);
  }

  el.dataset.split = 'chars';
  return chars;
}

export function initReveals(root = document) {
  const targets = [...root.querySelectorAll('[data-reveal]')].filter((el) => !el.closest('.hero, .page-hero'));

  targets.forEach((el) => {
    const kind = el.dataset.reveal;
    const delay = parseFloat(el.dataset.delay || 0);
    const trigger = { trigger: el, start: 'top 88%', once: true };

    if (reduced) {
      gsap.set(el, { opacity: 1, clearProps: 'transform' });
      return;
    }

    if (kind === 'lines') {
      const words = splitWords(el);
      gsap.set(el, { opacity: 1 });
      gsap.from(words, {
        yPercent: 104,
        duration: M.slow,
        ease: M.easeLong,
        stagger: 0.05,
        delay,
        scrollTrigger: trigger,
      });
      return;
    }

    if (kind === 'clip') {
      gsap.set(el, { opacity: 1 });
      gsap.from(el, {
        clipPath: 'inset(14% 8% 14% 8% round 22px)',
        scale: 1.04,
        duration: M.slow,
        ease: M.easeLong,
        delay,
        scrollTrigger: trigger,
      });
      return;
    }

    const from = kind === 'up' ? { y: M.shift } : kind === 'left' ? { x: -M.shift } : { y: 12 };
    gsap.fromTo(
      el,
      { opacity: 0, ...from },
      { opacity: 1, x: 0, y: 0, duration: M.base, ease: M.ease, delay, scrollTrigger: trigger }
    );
  });
}

export function initParallax(root = document) {
  if (reduced) return;
  root.querySelectorAll('[data-parallax]').forEach((el) => {
    const amount = parseFloat(el.dataset.parallax) || 0.1;
    const inner = el.querySelector('img, video') || el;
    gsap.fromTo(
      inner,
      { yPercent: -amount * 34, scale: 1.08 },
      {
        yPercent: amount * 34,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
      }
    );
  });
}

export function initMagnetic(root = document) {
  if (reduced || window.matchMedia('(pointer: coarse)').matches) return;

  root.querySelectorAll('.btn, .dock-btn, .works-arrow').forEach((el) => {
    const strength = el.classList.contains('dock-btn') ? 0.2 : 0.13;
    const qx = gsap.quickTo(el, 'x', { duration: 0.9, ease: M.ease });
    const qy = gsap.quickTo(el, 'y', { duration: 0.9, ease: M.ease });

    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      qx((e.clientX - (r.left + r.width / 2)) * strength);
      qy((e.clientY - (r.top + r.height / 2)) * strength);
    });
    el.addEventListener('pointerleave', () => {
      qx(0);
      qy(0);
    });
  });
}

export function initNav() {
  const nav = document.getElementById('nav');
  const progress = document.getElementById('progress');
  let last = 0;

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      const y = self.scroll();
      nav.classList.toggle('is-stuck', y > 40);
      if (y > 520 && y > last + 4) nav.classList.add('is-hidden');
      else if (y < last - 4) nav.classList.remove('is-hidden');
      last = y;
      if (progress) progress.style.transform = `scaleX(${self.progress})`;
    },
  });

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      scrollTo(target);
    });
  });
}

let menuTl = null;

export function initMenu() {
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');
  if (!burger || !menu) return;

  const links = menu.querySelectorAll('.menu-list a span');
  const aside = menu.querySelectorAll('.menu-aside > div, .menu-foot span');

  menuTl = gsap
    .timeline({ paused: true })
    .set(menu, { visibility: 'visible' })
    .to(menu, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: M.easeLong })
    .from(links, { yPercent: 104, opacity: 0, duration: 0.9, stagger: 0.05, ease: M.easeLong }, '-=0.5')
    .from(aside, { y: 14, opacity: 0, duration: 0.8, stagger: 0.06, ease: M.ease }, '-=0.6');

  burger.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    if (open) {
      menuTl.play();
      lenis?.stop();
    } else {
      menuTl.reverse();
      lenis?.start();
    }
  });
}

export function closeMenu() {
  if (!document.body.classList.contains('menu-open')) return;
  document.body.classList.remove('menu-open');
  document.getElementById('burger')?.setAttribute('aria-expanded', 'false');
  document.getElementById('menu')?.setAttribute('aria-hidden', 'true');
  menuTl?.reverse();
  lenis?.start();
}

export function initCounters(root = document) {
  root.querySelectorAll('[data-count]').forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const obj = { v: 0 };
    gsap.to(obj, {
      v: end,
      duration: reduced ? 0 : 2.4,
      ease: M.easeLong,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => {
        el.textContent = Math.round(obj.v).toLocaleString('es-PE');
      },
    });
  });
}

export function initTilt(root = document) {
  if (reduced || window.matchMedia('(pointer: coarse)').matches) return;

  root.querySelectorAll('[data-tilt]').forEach((el) => {
    const max = parseFloat(el.dataset.tilt) || 4;
    const rx = gsap.quickTo(el, 'rotationX', { duration: 1, ease: M.ease });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 1, ease: M.ease });

    gsap.set(el, { transformPerspective: 1200 });

    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      ry((((e.clientX - r.left) / r.width) - 0.5) * max * 2);
      rx((((e.clientY - r.top) / r.height) - 0.5) * -max * 2);
    });

    el.addEventListener('pointerleave', () => {
      rx(0);
      ry(0);
    });
  });
}

export function initMarquees(root = document) {
  root.querySelectorAll('[data-marquee]').forEach((track) => {
    if (track.dataset.cloned) return;
    const clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.dataset.cloned = '1';
    clone.dataset.cloned = '1';
    track.parentElement.appendChild(clone);
  });

  root.querySelectorAll('[data-client-flow]').forEach((flow) => {
    if (flow.dataset.flowReady || reduced) return;
    flow.dataset.flowReady = 'true';
    const surfaces = [...flow.querySelectorAll('.client-card-surface')];
    let visible = true;

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    }, { rootMargin: '120px' });
    observer.observe(flow);

    const update = () => {
      if (visible) {
        const area = flow.getBoundingClientRect();
        const center = area.left + area.width / 2;
        surfaces.forEach((surface, index) => {
          const slot = surface.parentElement.getBoundingClientRect();
          const position = (slot.left + slot.width / 2 - center) / Math.max(area.width / 2, 1);
          const distance = Math.min(Math.abs(position), 1.35);
          const focus = Math.max(0, 1 - distance);
          const lift = Math.sin(position * Math.PI) * 13 - focus * 9;
          const depth = focus * 74 - distance * 42;
          const turn = position * -24;
          const roll = Math.sin((position + index * 0.08) * Math.PI) * 2.2;
          const scale = 0.88 + focus * 0.14;

          surface.style.transform = `translate3d(0, ${lift}px, ${depth}px) rotateY(${turn}deg) rotateZ(${roll}deg) scale(${scale})`;
          surface.style.opacity = String(Math.max(0.28, 0.52 + focus * 0.48 - Math.max(0, distance - 1) * 0.8));
          surface.style.filter = `grayscale(${1 - focus * 0.72}) blur(${Math.max(0, distance - 0.48) * 2.8}px)`;
        });
      }
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  });
}

export function playIntro({ full = true } = {}) {
  const tl = gsap.timeline();
  const root = document.querySelector('.hero') || document.querySelector('.page-hero');

  // La barra no se anima al entrar: se ve desde el primer frame
  tl.fromTo(
    '.dock-btn',
    { opacity: 0, scale: 0.86, y: 10 },
    { opacity: 1, scale: 1, y: 0, duration: 0.9, stagger: 0.09, ease: M.ease },
    full ? 0.9 : 0.15
  );

  if (!root) return tl;
  if (!full) tl.timeScale(1.5);

  const pick = (sel) => {
    const found = [...root.querySelectorAll(sel)];
    return found.length ? found : null;
  };

  const revealed = pick('[data-reveal]');
  if (revealed) gsap.set(revealed, { opacity: 1 });

  const add = (targets, from, to, at) => {
    if (targets) tl.fromTo(targets, from, to, at);
  };

  // El hero de portada entra en bloque; los heros de página, palabra a palabra
  const isCard = root.classList.contains('hero') && root.querySelector('.hero-frame');

  if (isCard) {
    add(pick('.hero-badge'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0);
    add(pick('.hero-title'), { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.8, ease: M.ease }, 0.2);
    add(pick('.hero-sub'), { opacity: 0 }, { opacity: 1, duration: 0.8, ease: M.ease }, 0.4);
    add(pick('.hero-stat'), { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.8, ease: M.ease }, 0.2);
    add(pick('.hero-corner'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: M.ease }, 0.4);
    return tl;
  }

  const words = splitWords(root.querySelector('.hero-title, .page-hero-title'));
  if (words.length) {
    tl.from(words, { yPercent: 104, duration: 1.7, ease: M.easeLong, stagger: 0.055 }, 0.1);
  }

  add(pick('.crumbs'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.9, ease: M.ease }, 0.1);
  add(pick('.eyebrow'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1, ease: M.ease }, 0.15);
  add(pick('.hero-line'), { scaleX: 0 }, { scaleX: 1, duration: 1.7, ease: M.easeLong, transformOrigin: 'left' }, 0.45);
  add(pick('.hero-sub, .page-hero-sub'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.1, ease: M.ease }, 0.6);
  add(pick('.hero-cta > *'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1, stagger: 0.09, ease: M.ease }, 0.72);

  return tl;
}

export function refresh() {
  ScrollTrigger.refresh();
}

export { gsap, ScrollTrigger };
