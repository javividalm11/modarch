import { lockScroll } from './render.js';
import { services } from '../../shared/site-data.js';



const SWIPE = 50;

let el = null;
let shots = [];
let index = 0;

function build() {
  const root = document.createElement('div');
  root.className = 'photo-view';
  root.id = 'photoView';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'Foto ampliada');
  root.innerHTML = `
    <button class="photo-view-close" type="button" aria-label="Cerrar foto">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>
    <button class="photo-view-nav is-prev" type="button" aria-label="Foto anterior">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <figure class="photo-view-frame">
      <img alt="" />
      <figcaption></figcaption>
    </figure>
    <button class="photo-view-nav is-next" type="button" aria-label="Foto siguiente">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 6l6 6-6 6"/></svg>
    </button>`;
  document.body.appendChild(root);

  el = {
    root,
    img: root.querySelector('img'),
    cap: root.querySelector('figcaption'),
    prev: root.querySelector('.is-prev'),
    next: root.querySelector('.is-next'),
  };

  el.prev.addEventListener('click', () => show(index - 1));
  el.next.addEventListener('click', () => show(index + 1));
  root.querySelector('.photo-view-close').addEventListener('click', close);

  // Solo el fondo cierra: un toque sobre la foto no debe descartarla
  root.addEventListener('click', (e) => {
    if (e.target === root || e.target.tagName === 'FIGURE') close();
  });

  document.addEventListener('keydown', (e) => {
    if (!root.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(index - 1);
    else if (e.key === 'ArrowRight') show(index + 1);
    else return;
    e.preventDefault();
  });

  let startX = null;
  root.addEventListener('pointerdown', (e) => {
    startX = e.clientX;
  });
  root.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) < SWIPE) return;
    show(index + (dx < 0 ? 1 : -1));
  });

  return el;
}

function show(next) {
  if (!shots.length) return;
  index = ((next % shots.length) + shots.length) % shots.length;
  const shot = shots[index];
  el.img.src = shot.src;
  el.img.alt = shot.alt;
  el.cap.textContent = shot.alt;
  const single = shots.length < 2;
  el.prev.hidden = single;
  el.next.hidden = single;
}

function close() {
  el?.root.classList.remove('is-open');
  lockScroll(false);
}

function open(list, start) {
  if (!el) build();
  shots = list;
  show(start);
  el.root.classList.add('is-open');
  lockScroll(true);
}

export function initPhotoView() {
  const cards = [...document.querySelectorAll('.service-stack-card')];
  if (!cards.length) return;

  cards.forEach((card) => {
    const media = card.querySelector('.service-stack-gallery');
    if (!media) return;

    const servicio = services.find((s) => s.id === card.id);
    const galeria = servicio?.gallery?.length ? servicio.gallery : null;

    const imgs = [...media.querySelectorAll('img')];
    const shotsOf = () =>
      galeria
        ? galeria.map((src) => ({ src, alt: servicio.title }))
        : imgs.map((img) => ({ src: img.currentSrc || img.src, alt: img.alt || card.id }));

    imgs.forEach((img, i) => {
      // La foto pasa a ser accionable: sin esto no llega por teclado
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', `Ver fotos de ${servicio?.title || card.id}`);
      const abrir = () => open(shotsOf(), galeria ? Math.min(i, galeria.length - 1) : i);

      img.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        abrir();
      });
      img.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        abrir();
      });
    });
  });
}
