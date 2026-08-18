
const DUR = 1100;

export function initCrew() {
  const root = document.querySelector('#crew');
  if (!root) return null;

  const figs = [...root.querySelectorAll('[data-crew-fig]')];
  if (figs.length < 2) return null;

  const el = {
    role: root.querySelector('#crewRole'),
    name: root.querySelector('#crewName'),
    prev: root.querySelector('#crewPrev'),
    next: root.querySelector('#crewNext'),
    bio: root.querySelector('#crewBio'),
    lead: [...root.querySelectorAll('[data-crew-lead]')],
  };

  const total = figs.length;
  let index = 0;
  let animando = false;

  const rolDe = (i) => {
    if (i === index) return 'center';
    if (i === (index + 1) % total) return 'right';
    return 'left';
  };

  function pintar() {
    figs.forEach((f, i) => f.setAttribute('data-role', rolDe(i)));

    const activa = figs[index];
    if (!activa) return;
    const d = activa.dataset;
    if (el.role) el.role.textContent = d.cargo || '';
    if (el.name) el.name.textContent = d.name || '';

    if (el.bio) {
      el.bio.textContent = d.bio || '';
      el.bio.hidden = !d.bio;
    }
    el.lead.forEach((n) => {
      n.hidden = !d.lead;
    });
  }

  function laQueDaLaVuelta(paso) {
    if (total < 3) return -1;
    return paso > 0 ? (index + total - 1) % total : (index + 1) % total;
  }

  function mover(paso) {
    if (animando) return;
    animando = true;

    const salta = figs[laQueDaLaVuelta(paso)];
    salta?.classList.add('is-enter');

    index = (index + paso + total) % total;
    pintar();

    if (salta) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => salta.classList.remove('is-enter'));
      });
    }

    setTimeout(() => {
      animando = false;
    }, DUR);
  }

  el.prev?.addEventListener('click', () => mover(-1));
  el.next?.addEventListener('click', () => mover(1));

  figs.forEach((f, i) => {
    f.addEventListener('click', () => {
      if (i === index) {
        if (f.dataset.lead) root.querySelector('[data-crew-lead] [data-ceo-open]')?.click();
        return;
      }
      mover(i === (index + 1) % total ? 1 : -1);
    });
  });

  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') mover(-1);
    else if (e.key === 'ArrowRight') mover(1);
    else return;
    e.preventDefault();
  });
  root.tabIndex = 0;

  pintar();
  return { next: () => mover(1), prev: () => mover(-1) };
}
