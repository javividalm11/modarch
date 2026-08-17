// Panal de proyectos: seis hexágonos en roseta. El markup y la posición los
// resuelven HTML y CSS; aquí solo vive el estado, el paso automático y el arrastre.

const AUTOPLAY = 3600;
const SWIPE_STEP = 120;

export function initProjectsHive(stage, projects, callbacks) {
  if (!stage || !projects?.length) return null;

  const cells = [...stage.querySelectorAll('[data-hive]')];
  if (!cells.length) return null;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const state = { index: -1, manual: false, visible: true, hovering: false };
  const drag = { active: false, lastX: 0, downX: 0, acc: 0 };
  let timer;

  function setIndex(value, manual = false) {
    const index = ((value % cells.length) + cells.length) % cells.length;
    if (manual) state.manual = true;
    if (index === state.index) return;
    state.index = index;
    cells.forEach((cell, i) => cell.classList.toggle('is-on', i === index));
    callbacks?.onChange?.(index);
  }

  // Se detiene al tomar el control y con el puntero encima: si no, la tarjeta
  // que el visitante está mirando se le escapa sola
  function schedule() {
    clearTimeout(timer);
    if (state.manual || reduce.matches || !state.visible || state.hovering) return;
    timer = setTimeout(() => {
      setIndex(state.index + 1);
      schedule();
    }, AUTOPLAY);
  }

  cells.forEach((cell, index) => {
    cell.addEventListener('pointerenter', () => {
      state.hovering = true;
      schedule();
      setIndex(index);
    });
    cell.addEventListener('focus', () => setIndex(index));
    cell.addEventListener('click', () => {
      setIndex(index, true);
      callbacks?.onSelect?.(index);
    });
  });

  stage.addEventListener('pointerleave', () => {
    state.hovering = false;
    schedule();
  });

  const down = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    drag.active = true;
    drag.lastX = drag.downX = event.clientX;
    drag.acc = 0;
    stage.classList.add('is-dragging');
  };

  const move = (event) => {
    if (!drag.active) return;
    drag.acc += event.clientX - drag.lastX;
    drag.lastX = event.clientX;
    while (drag.acc <= -SWIPE_STEP) {
      drag.acc += SWIPE_STEP;
      setIndex(state.index + 1, true);
    }
    while (drag.acc >= SWIPE_STEP) {
      drag.acc -= SWIPE_STEP;
      setIndex(state.index - 1, true);
    }
  };

  const up = () => {
    if (!drag.active) return;
    drag.active = false;
    stage.classList.remove('is-dragging');
  };

  // Bloquea el clic sintético del pointerup: terminar un swipe sobre un
  // hexágono abriría ese proyecto
  stage.addEventListener('click', (event) => {
    if (Math.abs(event.clientX - drag.downX) > 7) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  stage.addEventListener('pointerdown', down);
  window.addEventListener('pointermove', move, { passive: true });
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', up);

  const intersection = new IntersectionObserver(
    ([entry]) => {
      state.visible = entry.isIntersecting;
      schedule();
    },
    { threshold: 0.05 }
  );
  intersection.observe(stage);

  setIndex(0);
  schedule();

  return {
    next: () => setIndex(state.index + 1, true),
    prev: () => setIndex(state.index - 1, true),
    goTo: (index) => setIndex(index, true),
    currentIndex: () => state.index,
    destroy() {
      clearTimeout(timer);
      intersection.disconnect();
      stage.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    },
  };
}
