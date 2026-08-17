import { company } from '../../shared/site-data.js';

const $ = (s) => document.querySelector(s);
const WA = `https://wa.me/${company.whatsapp}`;

const QUICK = [
  '¿Cuánto cuesta diseñar 90 m²?',
  '¿Qué incluye la remodelación integral?',
  '¿Cuánto demora un proyecto?',
  'Quiero agendar una visita',
  '¿Hacen muebles a medida?',
];

const WELCOME =
  '¡Hola! Soy **Maia**, la asistente IA de **ModArch**. Te ayudo con precios por m², plazos, servicios y a agendar tu visita técnica sin costo.\n\n¿Qué espacio quieres transformar?';

const history = [];
let streaming = false;

function esc(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function md(text) {
  const safe = esc(text);
  const blocks = safe.split(/\n{2,}/);

  return blocks
    .map((block) => {
      const lines = block.split('\n');
      if (lines.every((l) => /^\s*[-•*]\s+/.test(l))) {
        return `<ul>${lines.map((l) => `<li>${inline(l.replace(/^\s*[-•*]\s+/, ''))}</li>`).join('')}</ul>`;
      }
      return `<p>${lines.map(inline).join('<br>')}</p>`;
    })
    .join('');
}

function inline(s) {
  return s
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
    .replace(/(\+?51\s?\d{3}\s?\d{3}\s?\d{3})/g, `<a href="${WA}" target="_blank" rel="noopener">$1</a>`);
}

function bubble(role, content = '') {
  const el = document.createElement('div');
  el.className = `msg is-${role}`;
  if (role === 'user') el.textContent = content;
  else el.innerHTML = content ? md(content) : '<span class="typing"><i></i><i></i><i></i></span>';
  $('#chatLog').appendChild(el);
  scrollDown();
  return el;
}

function scrollDown() {
  const log = $('#chatLog');
  log.scrollTop = log.scrollHeight;
}

function setState(text) {
  $('#chatState').textContent = text;
}

async function ask(text) {
  if (streaming || !text.trim()) return;
  streaming = true;

  history.push({ role: 'user', text });
  bubble('user', text);
  $('#chatQuick').hidden = true;

  const node = bubble('bot');
  setState('Escribiendo…');

  let answer = '';

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history }),
    });

    if (!res.ok || !res.body) {
      const info = await res.json().catch(() => ({}));
      throw new Error(info.error || 'sin respuesta');
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const frames = buffer.split('\n\n');
      buffer = frames.pop() || '';

      for (const frame of frames) {
        const ev = frame.match(/^event:\s*(.+)$/m)?.[1];
        const dataLine = frame.match(/^data:\s*(.+)$/m)?.[1];
        if (!dataLine) continue;
        const payload = JSON.parse(dataLine);

        if (ev === 'delta' && payload.text) {
          answer += payload.text;
          node.innerHTML = md(answer);
          scrollDown();
        } else if (ev === 'error') {
          throw new Error(payload.message);
        }
      }
    }

    if (!answer) throw new Error('El asistente no devolvió respuesta.');
    history.push({ role: 'assistant', text: answer });
  } catch (err) {
    node.className = 'msg is-err';
    node.innerHTML = md(
      `${err.message || 'No pude responder ahora.'}\n\nEscríbenos por WhatsApp al **${company.phones[0]}** y te atendemos al toque.`
    );
  } finally {
    streaming = false;
    setState('En línea');
    scrollDown();
  }
}

export function initChatbot() {
  const panel = $('#chatPanel');
  const input = $('#chatInput');
  if (!panel) return;

  $('#chatQuick').innerHTML = QUICK.map((q) => `<button type="button">${q}</button>`).join('');
  bubble('bot', WELCOME);

  $('#chatQuick').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b) ask(b.textContent);
  });

  $('#chatForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    input.style.height = 'auto';
    ask(text);
  });

  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 120)}px`;
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      $('#chatForm').requestSubmit();
    }
  });

  return {
    open() {
      panel.classList.add('is-open');
      setTimeout(() => input.focus(), 320);
      scrollDown();
    },
    close() {
      panel.classList.remove('is-open');
    },
    ask,
  };
}
