import { catalogo } from '../../shared/site-data.js';



const FADE_MS = 700;

const SEC_PER_PHOTO = 3.2;

const RAIL_RESUME_MS = 3000;

const $ = (s) => document.querySelector(s);

const S = { project: null, i: 0, busy: false, shots: [], open: false };
let el = null;
let railTimer = null;

function pauseRail() {
  if (!el) return;
  el.rail.classList.add('is-paused');
  clearTimeout(railTimer);
  railTimer = setTimeout(() => el.rail.classList.remove('is-paused'), RAIL_RESUME_MS);
}

export function initCine() {
  const root = $('#cine');
  if (!root) return;

  el = {
    root,
    stage: $('#cineStage'),
    rail: $('#cineRail'),
    tracks: [...document.querySelectorAll('#cineRail .cine-track')],
    projects: $('#cineProjects'),
    badge: $('#cineBadge'),
    title: $('#cineTitle'),
    sub: $('#cineSub'),
    close: $('#cineClose'),
  };

  el.projects.innerHTML = catalogo
    .map(
      (p) =>
        `<button type="button" data-cine-project="${p.id}" aria-label="${p.title}, ${p.photos.length} fotos">${p.title}</button>`
    )
    .join('');

  el.close.addEventListener('click', closeCine);

  root.addEventListener('click', (e) => {
    if (e.target === root) return closeCine();

    const slot = e.target.closest('[data-cine-go]');
    if (slot) {
      pauseRail();
      return show(Number(slot.dataset.cineGo));
    }

    const proj = e.target.closest('[data-cine-project]');
    if (proj) return openCine(proj.dataset.cineProject);
  });

  document.addEventListener('keydown', (e) => {
    if (!S.open) return;
    if (e.key === 'Escape') return closeCine();
    if (e.key === 'ArrowLeft') {
      pauseRail();
      show(S.i - 1);
    } else if (e.key === 'ArrowRight') {
      pauseRail();
      show(S.i + 1);
    }
  });

  return { openCine, closeCine };
}

export function openCine(id) {
  const p = catalogo.find((c) => c.id === id);
  if (!p || !el) return;

  S.project = p;
  S.i = 0;
  S.busy = false;

  el.stage.innerHTML = p.photos
    .map(
      (src, n) =>
        `<img class="cine-shot${n === 0 ? ' is-on' : ''}" src="${src}" alt="${n === 0 ? p.title : ''}" loading="${n < 2 ? 'eager' : 'lazy'}" decoding="async" />`
    )
    .join('');
  S.shots = [...el.stage.querySelectorAll('.cine-shot')];

  const slot = (src, n, copia) =>
    `<button class="cine-slot" type="button" data-cine-go="${n}" tabindex="${copia ? -1 : 0}" ${copia ? 'aria-hidden="true"' : ''} aria-label="Foto ${n + 1}">
      <img src="${src}" alt="" loading="lazy" decoding="async" />
    </button>`;

  el.tracks.forEach((track, t) => {
    const suyas = p.photos.map((src, n) => ({ src, n })).filter((_, n) => n % el.tracks.length === t);
    track.innerHTML =
      suyas.map(({ src, n }) => slot(src, n, false)).join('') +
      suyas.map(({ src, n }) => slot(src, n, true)).join('');
    track.style.setProperty('--rail-dur', `${Math.max(12, suyas.length * SEC_PER_PHOTO).toFixed(1)}s`);
  });

  el.title.textContent = p.title;
  el.badge.textContent = `${p.category} · ${p.photos.length} fotografías`;

  el.projects.querySelectorAll('[data-cine-project]').forEach((b) => {
    b.classList.toggle('is-on', b.dataset.cineProject === p.id);
  });

  el.root.hidden = false;
  requestAnimationFrame(() => el.root.classList.add('is-open'));

  S.open = true;
  document.body.classList.add('is-locked');
  window.__lenis?.stop();

  paint();
  el.close.focus();
}

export function closeCine() {
  if (!el || !S.open) return;

  S.open = false;
  clearTimeout(railTimer);
  el.rail.classList.remove('is-paused');
  el.root.classList.remove('is-open');
  document.body.classList.remove('is-locked');
  window.__lenis?.start();

  setTimeout(() => {
    if (S.open) return;
    el.root.hidden = true;
    el.stage.innerHTML = '';
    el.tracks.forEach((t) => (t.innerHTML = ''));
    S.shots = [];
  }, 420);
}

function show(next) {
  const p = S.project;
  if (!p || S.busy) return;

  const total = p.photos.length;
  const i = (next + total) % total;
  if (i === S.i) return;

  S.busy = true;
  setTimeout(() => (S.busy = false), FADE_MS);

  S.i = i;
  paint();
}

function paint() {
  const p = S.project;
  if (!p) return;

  S.shots.forEach((img, n) => img.classList.toggle('is-on', n === S.i));

  el.rail.querySelectorAll('[data-cine-go]').forEach((b) => {
    b.classList.toggle('is-on', Number(b.dataset.cineGo) === S.i);
  });

  el.sub.textContent = `Foto ${S.i + 1} de ${p.photos.length}`;

  const nextSrc = p.photos[(S.i + 1) % p.photos.length];
  if (nextSrc) new Image().src = nextSrc;
}
