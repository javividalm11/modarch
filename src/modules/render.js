import { projects } from '../../shared/site-data.js';
import { openCine } from './cine.js';
import { gsap, ScrollTrigger, M } from './motion.js';

const $ = (s, r = document) => r.querySelector(s);

function initServicesLegacy() {
  const split = $('#svcSplit');
  if (!split) return;

  const items = [...split.querySelectorAll('.svc-item')];
  const panels = [...split.querySelectorAll('.svc-panel')];
  if (!items.length) return;
  const deck = split.querySelector('.svc-deck');

  let active = 0;
  let flowPosition = 0;
  let intent = null;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const drag = { active: false, startX: 0, startPosition: 0, moved: 0, ignoreClick: false };

  const positionCards = (position = flowPosition) => {
    const deckWidth = deck?.clientWidth || split.clientWidth;
    const cardWidth = items[0]?.offsetWidth || 280;
    const gap = Math.min(cardWidth * 0.76, deckWidth * 0.17);

    items.forEach((item, index) => {
      let offset = index - position;
      const half = items.length / 2;
      if (offset >= half) offset -= items.length;
      if (offset < -half) offset += items.length;

      const distance = Math.abs(offset);
      const x = offset * gap;
      const y = distance * 22;
      const rotate = offset * 7.5;
      const turn = offset * -13;
      const scale = 1 - Math.min(distance, 3) * 0.075;

      item.style.zIndex = String(20 - distance);
      item.style.opacity = String(Math.max(0.34, 1 - distance * 0.2));
      item.style.filter = `saturate(${Math.max(0.58, 1 - distance * 0.13)}) brightness(${Math.max(0.72, 1 - distance * 0.08)})`;
      item.style.transform = `translate3d(calc(-50% + ${x}px), ${y}px, ${distance * -115}px) rotateY(${turn}deg) rotateZ(${rotate}deg) scale(${scale})`;
    });
  };

  const select = (index, reposition = true) => {
    if (reposition) {
      flowPosition = index;
      positionCards();
    }
    if (index === active) return;
    active = index;
    items.forEach((el, i) => {
      el.classList.toggle('is-on', i === index);
      el.setAttribute('aria-selected', String(i === index));
    });
    panels.forEach((el, i) => {
      const on = i === index;
      el.classList.toggle('is-on', on);
      if (on) el.removeAttribute('aria-hidden');
      else el.setAttribute('aria-hidden', 'true');
    });
  };

  const pick = (i) => {
    clearTimeout(intent);
    select(i);
  };

  items.forEach((item, i) => {
    if (fine) {
      item.addEventListener('pointerenter', () => {
        clearTimeout(intent);
        if (!drag.active) intent = setTimeout(() => select(i), 120);
      });
      item.addEventListener('pointerleave', () => clearTimeout(intent));
    }
    item.addEventListener('click', () => {
      if (!drag.ignoreClick) pick(i);
    });
    item.addEventListener('focus', () => {
      if (!drag.active) pick(i);
    });
    item.addEventListener('keydown', (e) => {
      const dir = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      items[(i + dir + items.length) % items.length].focus();
    });
  });

  positionCards();
  window.addEventListener('resize', positionCards);

  const clampPosition = (value) => Math.min(items.length - 1, Math.max(0, value));
  const pointerDown = (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    clearTimeout(intent);
    drag.active = true;
    drag.startX = event.clientX;
    drag.startPosition = flowPosition;
    drag.moved = 0;
    deck.classList.add('is-dragging');
    deck.setPointerCapture?.(event.pointerId);
  };
  const pointerMove = (event) => {
    if (!drag.active) return;
    const step = Math.max(150, (items[0]?.offsetWidth || 280) * 0.7);
    const delta = event.clientX - drag.startX;
    drag.moved = Math.max(drag.moved, Math.abs(delta));
    flowPosition = clampPosition(drag.startPosition - delta / step);
    positionCards();
    select(Math.round(flowPosition), false);
  };
  const pointerUp = (event) => {
    if (!drag.active) return;
    drag.active = false;
    drag.ignoreClick = drag.moved > 7;
    deck.classList.remove('is-dragging');
    deck.releasePointerCapture?.(event.pointerId);
    select(Math.round(flowPosition));
    setTimeout(() => { drag.ignoreClick = false; }, 0);
  };
  deck?.addEventListener('pointerdown', pointerDown);
  deck?.addEventListener('pointermove', pointerMove);
  deck?.addEventListener('pointerup', pointerUp);
  deck?.addEventListener('pointercancel', pointerUp);

  let wheelTimer;
  deck?.addEventListener('wheel', (event) => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    event.preventDefault();
    flowPosition = clampPosition(flowPosition + event.deltaX * 0.0045);
    positionCards();
    select(Math.round(flowPosition), false);
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => select(Math.round(flowPosition)), 110);
  }, { passive: false });

  const fromHash = decodeURIComponent(location.hash.slice(1));
  const target = items.findIndex((el) => el.id === fromHash);
  if (target > 0) {
    select(target);
    setTimeout(() => split.scrollIntoView({ behavior: 'smooth', block: 'center' }), 800);
  }
}

export function initServices() {
  const stack = $('#svcSplit');
  if (!stack) return;

  const slots = [...stack.querySelectorAll('[data-service-stack-slot]')];
  const cards = [...stack.querySelectorAll('[data-service-stack-card]')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  cards.forEach((card, index) => {
    card.style.zIndex = String(index + 1);
    gsap.set(card, { transformOrigin: 'top center' });
    if (reduceMotion || index === cards.length - 1) return;

    const targetScale = 1 - (cards.length - 1 - index) * 0.03;
    gsap.to(card, {
      scale: targetScale,
      ease: 'none',
      scrollTrigger: {
        trigger: slots[index + 1],
        start: 'top bottom-=8%',
        end: () => `top top+=${64 + (index + 1) * 28}`,
        scrub: 0.55,
        invalidateOnRefresh: true,
      },
    });
  });

  const fromHash = decodeURIComponent(location.hash.slice(1));
  const target = cards.find((card) => card.id === fromHash);
  if (target) setTimeout(() => target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }), 650);
}

export function initProductCards() {
  if (!window.matchMedia('(hover: none)').matches) return;

  const cards = [...document.querySelectorAll('.card-prod')];
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const open = card.classList.contains('is-open');
      cards.forEach((c) => c.classList.remove('is-open'));
      if (!open) card.classList.add('is-open');
    });
  });
}

export function initFaq() {
  const list = $('#faqList');
  if (!list) return;

  list.querySelectorAll('.acc-item').forEach((item) => {
    const trigger = item.querySelector('.acc-trigger');
    const panel = item.querySelector('.acc-panel');

    trigger.addEventListener('click', () => {
      const open = item.classList.contains('is-open');
      list.querySelectorAll('.acc-item').forEach((o) => {
        if (o === item) return;
        o.classList.remove('is-open');
        o.querySelector('.acc-trigger').setAttribute('aria-expanded', 'false');
        gsap.to(o.querySelector('.acc-panel'), { height: 0, duration: 0.75, ease: 'expo.out' });
      });
      item.classList.toggle('is-open', !open);
      trigger.setAttribute('aria-expanded', String(!open));
      gsap.to(panel, { height: open ? 0 : 'auto', duration: 0.85, ease: 'expo.out' });
    });
  });
}

export function initValuesToggle() {
  const btn = $('#valuesToggle');
  const panel = $('#valuesPanel');
  if (!btn || !panel) return;

  const label = btn.querySelector('[data-label]');
  const rows = [...panel.querySelectorAll('.value-row')];
  let open = false;

  btn.addEventListener('click', () => {
    open = !open;
    btn.setAttribute('aria-expanded', String(open));
    label.textContent = open ? 'Ver menos' : 'Conocer el estudio';

    gsap.killTweensOf([panel, rows]);

    if (open) {
      panel.classList.add('is-open');
      gsap.to(panel, {
        height: 'auto',
        duration: M.base,
        ease: M.easeLong,
        onComplete: () => ScrollTrigger.refresh(),
      });
      gsap.fromTo(
        rows,
        { opacity: 0, y: M.shift },
        { opacity: 1, y: 0, duration: M.quick, ease: M.ease, stagger: M.stagger, delay: 0.12 }
      );
    } else {
      gsap.to(panel, {
        height: 0,
        duration: M.quick,
        ease: M.easeIO,
        onComplete: () => {
          panel.classList.remove('is-open');
          ScrollTrigger.refresh();
        },
      });
    }
  });
}

export function lockScroll(on) {
  document.body.classList.toggle('is-locked', on);
  const lenis = window.__lenis;
  if (on) lenis?.stop();
  else lenis?.start();
}

export function openProject(index) {
  const p = projects[index];
  const lb = $('#lightbox');
  if (!p || !lb) return;

  $('#lbInner').innerHTML = `
    <div class="lb-gallery">
      <img src="${p.gallery[0]}" alt="${p.title}" />
      <div class="lb-thumbs">${p.gallery.slice(1).map((g) => `<img src="${g}" alt="${p.title} detalle" />`).join('')}</div>
    </div>
    <div class="lb-body">
      <p class="role-label">${p.category}</p>
      <h3>${p.title}</h3>
      <div><h5>Estilo</h5><p>${p.style}</p></div>
      <div class="lb-specs">
        <span class="tag">${p.location}</span><span class="tag">${p.area}</span><span class="tag">${p.year}</span>
      </div>
      <div><h5>Objetivo</h5><p>${p.objective}</p></div>
      <div><h5>Resultado</h5><p>${p.result}</p></div>
      <div class="lb-specs">${p.tags.map((t) => `<span class="tag">${t}</span>`).join('')}</div>
      <a class="btn is-sm" href="/cotizador/">Quiero algo así</a>
    </div>`;

  lb.classList.add('is-open');
  lockScroll(true);
}

export function closeProject() {
  $('#lightbox')?.classList.remove('is-open');
  lockScroll(false);
}

export function initLightbox() {
  const lb = $('#lightbox');
  if (!lb) return;

  $('#lbClose').addEventListener('click', closeProject);
  lb.addEventListener('click', (e) => {
    if (e.target === lb) closeProject();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeProject();
  });
  document.querySelectorAll('[data-project]').forEach((el) => {
    el.addEventListener('click', () => openProject(Number(el.dataset.project)));
  });

  document.querySelectorAll('[data-catalogo]').forEach((el) => {
    el.addEventListener('click', () => openCine(el.dataset.catalogo));
  });
}

export function initYear() {
  const el = $('#year');
  if (el) el.textContent = new Date().getFullYear();
}
