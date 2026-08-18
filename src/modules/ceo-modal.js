import { lockScroll } from './render.js';

export function initCeoModal() {
  const modal = document.querySelector('#ceoModal');
  if (!modal) return;

  const close = modal.querySelector('[data-ceo-close]');
  let opener = null;

  const open = (trigger) => {
    opener = trigger;
    modal.classList.add('is-open');
    lockScroll(true);
    modal.querySelector('.ceo-panel')?.scrollTo({ top: 0 });
    close?.focus();
  };

  const hide = () => {
    if (!modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    lockScroll(false);
    opener?.focus();
    opener = null;
  };

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-ceo-open]');
    if (trigger) {
      e.preventDefault();
      open(trigger);
      return;
    }
    if (e.target.closest('[data-ceo-close]') || e.target === modal) hide();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !modal.classList.contains('is-open')) return;
    hide();
  });

  modal.querySelector('[data-open]')?.addEventListener('click', hide);
}
