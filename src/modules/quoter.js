import { pricing, quote, company } from '../../shared/site-data.js';
import { gsap } from './motion.js';

const $ = (s) => document.querySelector(s);

const state = {
  step: 1,
  scope: 'diseno',
  space: 'departamento',
  level: 'premium',
  urgency: 'estandar',
  m2: 80,
  extras: ['renders'],
};

const money = (n) => `${pricing.currency} ${Math.round(n).toLocaleString('es-PE')}`;
const withIgv = (n) => n * (1 + pricing.igv);
let last = null;

// Mini-cotizador del teaser: solo tipo de espacio y m², usando el mismo motor
export function initQuoterTeaser() {
  const range = $('#qtRange');
  const space = $('#qtSpace');
  if (!range || !space) return;

  const out = $('#qtTotal');
  const label = $('#qtM2');

  const paint = () => {
    const m2 = Number(range.value);
    label.textContent = m2;
    range.style.setProperty('--fill', `${((m2 - range.min) / (range.max - range.min)) * 100}%`);

    const r = quote({ m2, scope: 'diseno', space: space.value, level: 'premium', extras: [] });
    const from = Math.round(withIgv(r.low) / 500) * 500;
    out.textContent = money(from);
  };

  range.addEventListener('input', paint);
  space.addEventListener('change', paint);
  paint();
}

export function initQuoter() {
  if (!$('#qScopes')) return;
  buildScopes();
  buildSpaces();
  buildLevels();
  buildUrgency();
  buildExtras();
  buildPresets();
  buildSteps();
  bindM2();
  bindNav();
  bindSend();
  compute();
}

function buildSteps() {
  const el = $('#qSteps');
  const labels = ['Alcance', 'Medidas', 'Detalles'];
  el.innerHTML = labels
    .map((l, i) => `<span class="q-step-dot" data-step="${i + 1}"><i>${i + 1}</i>${l}</span>`)
    .join('<span class="q-step-line"></span>');
  syncSteps();
}

function syncSteps() {
  document.querySelectorAll('.q-step-dot').forEach((d) => {
    const n = Number(d.dataset.step);
    d.classList.toggle('is-on', n === state.step);
    d.classList.toggle('is-done', n < state.step);
  });
  document.querySelectorAll('.q-pane').forEach((p) => {
    p.classList.toggle('is-active', Number(p.dataset.pane) === state.step);
  });
  $('#qBack').disabled = state.step === 1;
  $('#qNext').innerHTML =
    state.step === 3
      ? 'Ver resumen'
      : 'Continuar <svg class="btn-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
}

// Cada grupo se pinta como tarjetas y como desplegable; el CSS enseña uno u
// otro según el ancho. Los dos escriben en el mismo estado, así que girar el
// teléfono no pierde la selección.
function buildChoice({ id, field, entries, card, option, note }) {
  const el = $(id);
  if (!el) return;

  el.innerHTML = entries
    .map(([k, v]) => `<button class="q-card" type="button" data-key="${k}" aria-pressed="${k === state[field]}">${card(v)}</button>`)
    .join('');

  const select = document.createElement('select');
  select.className = 'select q-select';
  select.setAttribute('aria-label', el.getAttribute('aria-label') || '');
  select.innerHTML = entries.map(([k, v]) => `<option value="${k}">${option(v)}</option>`).join('');
  select.value = state[field];
  el.insertAdjacentElement('afterend', select);

  // La descripción no cabe en un <option>: acompaña al desplegable
  let hint = null;
  if (note) {
    hint = document.createElement('p');
    hint.className = 'q-select-note';
    select.insertAdjacentElement('afterend', hint);
  }

  const byKey = Object.fromEntries(entries);

  const sync = (key) => {
    state[field] = key;
    el.querySelectorAll('[data-key]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.key === key)));
    select.value = key;
    if (hint) hint.textContent = note(byKey[key]);
  };

  el.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-key]');
    if (!btn) return;
    sync(btn.dataset.key);
    pop(btn);
    compute();
  });

  select.addEventListener('change', () => {
    sync(select.value);
    pop(select);
    compute();
  });

  // Estado inicial sin recalcular: initQuoter ya llama a compute() al final
  sync(state[field]);
}

function buildScopes() {
  buildChoice({
    id: '#qScopes',
    field: 'scope',
    entries: Object.entries(pricing.scopes),
    card: (v) => `
        <em>desde ${pricing.currency} ${v.rate.toLocaleString('es-PE')}/m²</em>
        <b>${v.label}</b>
        <span>${v.desc}</span>`,
    option: (v) => `${v.label} — desde ${pricing.currency} ${v.rate.toLocaleString('es-PE')}/m²`,
    note: (v) => v.desc,
  });
}

function buildSpaces() {
  buildChoice({
    id: '#qSpaces',
    field: 'space',
    entries: Object.entries(pricing.spaces),
    card: (v) => `<b>${v.label}</b>`,
    option: (v) => v.label,
  });
}

function buildLevels() {
  buildChoice({
    id: '#qLevels',
    field: 'level',
    entries: Object.entries(pricing.levels),
    card: (v) => `
        <b>${v.label}</b>
        <span>${v.desc}</span>`,
    option: (v) => v.label,
    note: (v) => v.desc,
  });
}

function buildUrgency() {
  const el = $('#qUrgency');
  el.innerHTML = Object.entries(pricing.urgency)
    .map(
      ([k, v]) => `
      <button class="chip" type="button" data-key="${k}" aria-pressed="${k === state.urgency}">
        ${v.label} · ${v.note}
      </button>`
    )
    .join('');
  bindGroup(el, 'urgency');
}

function buildExtras() {
  const el = $('#qExtras');
  el.innerHTML = Object.entries(pricing.extras)
    .map(([k, v]) => {
      const price = v.fixed
        ? `${pricing.currency} ${v.fixed.toLocaleString('es-PE')}`
        : v.pct
          ? `+${Math.round(v.pct * 100)}%`
          : `${pricing.currency} ${v.perM2}/m²`;
      return `<button class="chip" type="button" data-key="${k}" aria-pressed="${state.extras.includes(k)}">${v.label} · ${price}</button>`;
    })
    .join('');

  el.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-key]');
    if (!btn) return;
    const key = btn.dataset.key;
    const on = state.extras.includes(key);
    state.extras = on ? state.extras.filter((k) => k !== key) : [...state.extras, key];
    btn.setAttribute('aria-pressed', String(!on));
    pop(btn);
    compute();
  });
}

function buildPresets() {
  const el = $('#qPresets');
  el.innerHTML = [45, 80, 120, 250, 500].map((v) => `<button type="button" data-m2="${v}">${v} m²</button>`).join('');
  el.addEventListener('click', (e) => {
    const b = e.target.closest('[data-m2]');
    if (!b) return;
    setM2(Number(b.dataset.m2));
  });
}

function bindGroup(el, field) {
  el.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-key]');
    if (!btn) return;
    state[field] = btn.dataset.key;
    el.querySelectorAll('[data-key]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    pop(btn);
    compute();
  });
}

function pop(el) {
  gsap.fromTo(el, { opacity: 0.55 }, { opacity: 1, duration: 0.55, ease: 'power2.out' });
}

function bindM2() {
  const input = $('#qM2');
  const range = $('#qM2Range');

  input.addEventListener('input', () => setM2(Number(input.value), 'input'));
  range.addEventListener('input', () => setM2(Number(range.value), 'range'));
  input.addEventListener('blur', () => setM2(Number(input.value) || 10));
}

function setM2(v, src) {
  state.m2 = Math.min(3000, Math.max(5, Math.round(v || 0)));
  if (src !== 'input') $('#qM2').value = state.m2;
  if (src !== 'range') $('#qM2Range').value = Math.min(800, state.m2);
  const range = $('#qM2Range');
  const pct = ((Math.min(800, state.m2) - 5) / (800 - 5)) * 100;
  range.style.setProperty('--fill', `${pct}%`);
  compute();
}

function bindNav() {
  $('#qNext').addEventListener('click', () => {
    if (state.step < 3) {
      state.step++;
      syncSteps();
    } else {
      $('#qResult').scrollIntoView({ behavior: 'smooth', block: 'center' });
      gsap.fromTo('#qResult', { scale: 0.985 }, { scale: 1, duration: 0.9, ease: 'power2.out' });
    }
  });

  $('#qBack').addEventListener('click', () => {
    if (state.step > 1) {
      state.step--;
      syncSteps();
    }
  });
}

function compute() {
  const r = quote(state);
  last = r;

  animateNumber('#qTotal', r.total, money);
  $('#qLow').textContent = money(withIgv(r.low));
  $('#qHigh').textContent = money(withIgv(r.high));
  $('#qPerM2').textContent = money(r.perM2);
  $('#qWeeks').textContent = r.weeksRange;
  $('#qTotalNote').textContent = r.belowMin
    ? `Proyecto mínimo para ${r.scope.toLowerCase()} · IGV incluido`
    : 'Incluye IGV (18%)';

  $('#qLines').innerHTML =
    r.lines.map((l) => `<div class="q-line"><span>${l.label}</span><b>${money(l.amount)}</b></div>`).join('') +
    `<div class="q-line"><span>Subtotal</span><b>${money(r.net)}</b></div>` +
    `<div class="q-line"><span>IGV 18%</span><b>${money(r.igv)}</b></div>` +
    `<div class="q-line is-total"><span>Total referencial</span><b>${money(r.total)}</b></div>`;
}

function animateNumber(sel, value, fmt) {
  const el = $(sel);
  const from = Number(el.dataset.v || 0);
  const obj = { v: from };
  gsap.to(obj, {
    v: value,
    duration: 0.95,
    ease: 'power2.out',
    onUpdate: () => (el.textContent = fmt(obj.v)),
  });
  el.dataset.v = value;
}

export function summaryText() {
  if (!last) return '';
  return [
    `Cotización ModArch`,
    `Alcance: ${last.scope}`,
    `Espacio: ${last.space}`,
    `Superficie: ${last.area} m²`,
    `Nivel: ${last.level}`,
    `Ritmo: ${last.urgency}`,
    state.extras.length ? `Adicionales: ${state.extras.map((k) => pricing.extras[k].label).join(', ')}` : null,
    `Estimado: ${money(withIgv(last.low))} a ${money(withIgv(last.high))} (IGV incluido)`,
    `Plazo estimado: ${last.weeksRange}`,
  ]
    .filter(Boolean)
    .join('\n');
}

export function currentQuote() {
  return { ...state, result: last };
}

function bindSend() {
  $('#qWhats').addEventListener('click', () => {
    const msg = encodeURIComponent(`Hola ModArch, hice una cotización en la web:\n\n${summaryText()}\n\nMe gustaría agendar una visita.`);
    window.open(`https://wa.me/${company.whatsapp}?text=${msg}`, '_blank', 'noopener');
  });

  // Como el formulario de contacto: abre WhatsApp, síncrono para que no lo bloqueen
  $('#qSend').addEventListener('click', () => {
    const status = $('#qStatus');
    const lead = {
      name: $('#qName').value.trim(),
      phone: $('#qPhone').value.trim(),
      email: $('#qEmail').value.trim(),
      notes: $('#qNotes').value.trim(),
    };

    if (!lead.name || (!lead.phone && !lead.email)) {
      state.step = 3;
      syncSteps();
      status.className = 'form-status is-err';
      status.textContent = 'Déjanos tu nombre y un WhatsApp o correo para enviarte la propuesta.';
      $('#qName').focus();
      return;
    }

    const msg = [
      'Hola ModArch, hice una cotización en la web y me gustaría recibir la propuesta:',
      '',
      `Nombre: ${lead.name}`,
      lead.phone ? `Teléfono: ${lead.phone}` : null,
      lead.email ? `Correo: ${lead.email}` : null,
      '',
      summaryText(),
      lead.notes ? `\nNotas:\n${lead.notes}` : null,
    ]
      .filter((l) => l !== null)
      .join('\n');

    const url = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(msg)}`;
    const win = window.open(url, '_blank', 'noopener');

    if (win) {
      status.className = 'form-status is-ok';
      status.textContent = 'Abrimos WhatsApp con tu cotización. Solo pulsa enviar.';
      gsap.fromTo('#qResult', { scale: 0.98 }, { scale: 1, duration: 0.9, ease: 'power2.out' });
    } else {
      status.className = 'form-status is-err';
      status.innerHTML = `Tu navegador bloqueó la ventana. <a href="${url}" target="_blank" rel="noopener">Abre WhatsApp aquí</a>.`;
    }
  });
}
