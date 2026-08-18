import { products, company } from '../../shared/site-data.js';

const $ = (s) => document.querySelector(s);

let el = null;
let current = null;

export function initProduct() {
  const root = $('#prod');
  const cards = [...document.querySelectorAll('.card-prod')];
  if (!root || !cards.length) return;

  el = {
    root,
    photo: $('#prodPhoto'),
    thumbs: $('#prodThumbs'),
    tag: $('#prodTag'),
    name: $('#prodName'),
    text: $('#prodText'),
    form: $('#prodForm'),
    status: $('#prodStatus'),
    close: $('#prodClose'),
  };

  cards.forEach((card, i) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => open(i));
  });

  el.close.addEventListener('click', close);
  root.addEventListener('click', (e) => {
    if (e.target === root) close();
    const thumb = e.target.closest('[data-prod-img]');
    if (thumb) showPhoto(thumb.dataset.prodImg);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !root.hidden) close();
  });

  el.form.addEventListener('submit', send);
}

function open(i) {
  const p = products[i];
  if (!p || !el) return;

  current = p;
  el.tag.textContent = p.tag;
  el.name.textContent = p.name;
  el.text.textContent = p.text;

  // La de catálogo primero y la de ambiente después: se entiende mejor la pieza
  const fotos = [p.photo, p.scene].filter(Boolean);
  el.thumbs.innerHTML = fotos
    .map(
      (src, n) =>
        `<button class="prod-thumb${n === 0 ? ' is-on' : ''}" type="button" data-prod-img="${src}" aria-label="Foto ${n + 1}"><img src="${src}" alt="" loading="lazy" /></button>`
    )
    .join('');
  showPhoto(fotos[0]);

  el.status.textContent = '';
  el.status.className = 'form-status';
  el.form.reset();

  el.root.hidden = false;
  requestAnimationFrame(() => el.root.classList.add('is-open'));
  document.body.classList.add('is-locked');
  window.__lenis?.stop();
  el.close.focus();
}

function close() {
  if (!el || el.root.hidden) return;
  el.root.classList.remove('is-open');
  document.body.classList.remove('is-locked');
  window.__lenis?.start();
  setTimeout(() => {
    el.root.hidden = true;
    current = null;
  }, 320);
}

function showPhoto(src) {
  if (!src) return;
  el.photo.src = src;
  el.photo.alt = current ? current.name : '';
  el.thumbs.querySelectorAll('[data-prod-img]').forEach((b) => {
    b.classList.toggle('is-on', b.dataset.prodImg === src);
  });
}

function send(e) {
  e.preventDefault();
  if (!current) return;

  const data = Object.fromEntries(new FormData(el.form));
  if (!data.nombre?.trim() || !data.contacto?.trim()) {
    el.status.className = 'form-status is-err';
    el.status.textContent = 'Necesitamos tu nombre y un WhatsApp o correo.';
    return;
  }

  const msg = [
    `Hola ModArch, me interesa el ${current.tag.toLowerCase()} "${current.name}".`,
    '',
    `Nombre: ${data.nombre.trim()}`,
    `Contacto: ${data.contacto.trim()}`,
    data.mensaje?.trim() ? `\n${data.mensaje.trim()}` : null,
  ]
    .filter((l) => l !== null)
    .join('\n');

  const url = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(msg)}`;
  const win = window.open(url, '_blank', 'noopener');

  if (win) {
    el.status.className = 'form-status is-ok';
    el.status.textContent = 'Abrimos WhatsApp con tu consulta. Solo pulsa enviar.';
  } else {
    // Popup bloqueado: se deja el enlace en lugar de perder lo escrito
    el.status.className = 'form-status is-err';
    el.status.innerHTML = `Tu navegador bloqueó la ventana. <a href="${url}" target="_blank" rel="noopener">Abre WhatsApp aquí</a>.`;
  }
}
