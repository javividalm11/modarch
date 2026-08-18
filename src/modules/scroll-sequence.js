import { gsap, ScrollTrigger, reduced } from './motion.js';

const pad = (n, len) => String(n).padStart(len, '0');

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(src));
    img.src = src;
  });
}

async function preload(urls, concurrency, onProgress) {
  const out = new Array(urls.length);
  let next = 0;
  let done = 0;

  const worker = async () => {
    while (next < urls.length) {
      const i = next++;
      try {
        out[i] = await loadImage(urls[i]);
      } catch {
        out[i] = null;
      }
      onProgress?.(++done / urls.length);
    }
  };

  await Promise.all(Array.from({ length: Math.min(concurrency, urls.length) }, worker));
  return out;
}

export function initScrollSequence(section) {
  if (!section) return null;

  const stage = section.querySelector('.seq-stage');
  const canvas = section.querySelector('.seq-canvas');
  const bar = section.querySelector('.seq-bar i');
  const counter = section.querySelector('.seq-count');
  const steps = [...section.querySelectorAll('[data-seq-step]')];
  if (!stage || !canvas) return null;

  const total = Number(section.dataset.seqFrames) || 0;
  const base = section.dataset.seqPath || '/assets/frames/seq-';
  const ext = section.dataset.seqExt || '.webp';
  const digits = Number(section.dataset.seqPad) || 4;
  const scrub = Number(section.dataset.seqScrub) || 3;
  if (!total) return null;

  const urls = Array.from({ length: total }, (_, i) => `${base}${pad(i + 1, digits)}${ext}`);
  const ctx = canvas.getContext('2d', { alpha: true });

  const blend = section.dataset.seqBlend === '1' || total <= 24;
  const push = Number(section.dataset.seqPush ?? 0.045);

  let frames = [];
  let current = -1;
  let ready = false;

  const media = canvas.parentElement;

  const sizeCanvas = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = media.getBoundingClientRect();
    if (!r.width || !r.height) return;
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    current = -1;
  };

  const drawImage = (img, alpha) => {
    if (!img) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.min(cw / img.width, ch / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.globalAlpha = alpha;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    ctx.globalAlpha = 1;
  };

  const paint = (pos) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!blend) {
      drawImage(frames[Math.round(pos)], 1);
      return;
    }
    const i = Math.floor(pos);
    const f = pos - i;
    drawImage(frames[i] || frames[total - 1], 1);
    if (f > 0.002 && frames[i + 1]) drawImage(frames[i + 1], f);
  };

  const show = (pos) => {
    const p = Math.max(0, Math.min(total - 1, pos));
    if (Math.abs(p - current) < (blend ? 0.004 : 0.5)) return;
    current = p;
    paint(p);
    if (counter) counter.textContent = `${pad(Math.round(p) + 1, 2)} / ${pad(total, 2)}`;
  };

  const setStep = (progress) => {
    for (const el of steps) {
      const [from, to] = el.dataset.seqStep.split(',').map(Number);
      el.classList.toggle('is-on', progress >= from && progress < to);
    }
  };

  const ro = new ResizeObserver(() => {
    const prev = current;
    sizeCanvas();
    if (ready) paint(Math.max(0, prev));
  });
  ro.observe(media);
  sizeCanvas();

  const state = { frame: 0 };
  let trigger = null;

  const build = () => {
    section.classList.add('is-ready');
    show(0);
    setStep(0);

    if (reduced) return;

    trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${Math.round(window.innerHeight * (section.dataset.seqLength || 3.2))}`,
      pin: stage,
      pinSpacing: true,
      scrub,
      anticipatePin: 1,
      onUpdate: (self) => {
        show(self.progress * (total - 1));
        setStep(self.progress);
        if (bar) bar.style.transform = `scaleX(${self.progress})`;
        if (push) canvas.style.transform = `scale(${1 + self.progress * push})`;
      },
    });
  };

  preload(urls, 6, (p) => {
    if (bar) bar.style.transform = `scaleX(${p})`;
    section.style.setProperty('--seq-load', p);
  })
    .then((imgs) => {
      frames = imgs;
      const loaded = frames.filter(Boolean).length;

      if (loaded < total * 0.5) {
        section.classList.add('is-missing');
        console.warn(`[scroll-sequence] solo ${loaded}/${total} frames disponibles en ${base}`);
        return;
      }

      ready = true;
      build();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    })
    .catch(() => section.classList.add('is-missing'));

  return {
    destroy() {
      trigger?.kill();
      ro.disconnect();
      frames = [];
    },
  };
}
