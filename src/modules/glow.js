
export function initGlow(selector = '.process-grid') {
  const grid = document.querySelector(selector);
  if (!grid) return;

  if (window.matchMedia('(hover: none)').matches) return;

  let queued = false;
  let last = null;

  const paint = () => {
    queued = false;
    if (!last) return;
    const { card, x, y } = last;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${x - r.left}px`);
    card.style.setProperty('--my', `${y - r.top}px`);
  };

  grid.addEventListener(
    'pointermove',
    (e) => {
      const card = e.target.closest('.step');
      if (!card) return;
      last = { card, x: e.clientX, y: e.clientY };
      if (queued) return;
      queued = true;
      requestAnimationFrame(paint);
    },
    { passive: true }
  );

  grid.addEventListener('pointerleave', () => {
    last = null;
  });
}
