const ARRANQUE = 0.15;
const FINAL = 0.85;

export function initProcessRail() {
  const viewport = document.getElementById('processViewport');
  const track = document.getElementById('processTrack');
  if (!viewport || !track) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const activo = () => !reduceMotion;
  let queued = false;

  const update = () => {
    queued = false;
    if (!activo()) {
      track.style.transform = '';
      return;
    }

    const cs = getComputedStyle(viewport);
    const relleno = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    const sobra = track.scrollWidth - (viewport.clientWidth - relleno);
    if (sobra <= 0) {
      track.style.transform = '';
      return;
    }

    const r = viewport.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = Math.min(Math.max((vh - r.top) / (r.height + vh), 0), 1);
    const t = Math.min(Math.max((p - ARRANQUE) / (FINAL - ARRANQUE), 0), 1);

    track.style.transform = `translate3d(${-sobra * t}px,0,0)`;
  };

  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', update);
  // Las fuentes entran tarde y cambian scrollWidth
  document.fonts?.ready.then(update);
  setTimeout(update, 200);
}
