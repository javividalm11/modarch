const ORIGEN = 'https://www.youtube-nocookie.com';

const todos = [];

function nuevoMarco(destino, id, titulo, conSonido) {
  const p = new URLSearchParams({
    autoplay: '1',
    mute: conSonido ? '0' : '1',
    playsinline: '1',
    rel: '0',
    modestbranding: '1',
    enablejsapi: '1',
    origin: location.origin,
  });
  const f = document.createElement('iframe');
  f.src = `${ORIGEN}/embed/${id}?${p}`;
  f.title = titulo || 'Video';
  f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  f.allowFullscreen = true;
  destino.appendChild(f);
  destino.classList.add('is-on');
  return f;
}

function orden(marco, cual) {
  if (!marco?.contentWindow) return;
  marco.contentWindow.postMessage(JSON.stringify({ event: 'command', func: cual, args: [] }), ORIGEN);
}

function silenciarAlResto(mio) {
  for (const otro of todos) if (otro !== mio) otro.pausar();
}

export function initYouTube() {
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;

  for (const caja of document.querySelectorAll('[data-yt]')) {
    const id = caja.dataset.yt;
    const marco16 = caja.querySelector('.yt');
    const portada = caja.querySelector('.yt-cover');
    const sonido = caja.querySelector('.yt-sound');
    let marco = null;

    const yo = {
      pausar: () => orden(marco, 'pauseVideo'),
    };
    todos.push(yo);

    function montar(conSonido) {
      if (marco) return;
      marco = nuevoMarco(marco16, id, portada?.getAttribute('aria-label'), conSonido);
      if (sonido && !conSonido) sonido.hidden = false;
    }

    portada?.addEventListener('click', () => {
      silenciarAlResto(yo);
      montar(true);
    });

    sonido?.addEventListener('click', () => {
      silenciarAlResto(yo);
      orden(marco, 'unMute');
      orden(marco, 'playVideo');
      sonido.hidden = true;
    });

    if (quieto) continue;

    const ojo = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) {
            if (marco) orden(marco, 'playVideo');
            else montar(false);
          } else if (marco) {
            orden(marco, 'pauseVideo');
          }
        }
      },
      { threshold: 0.5 }
    );
    ojo.observe(marco16);
  }

  // No arrancan solos: cuatro a la vez es ruido, y con clic hay sonido
  for (const tarjeta of document.querySelectorAll('[data-yt-short]')) {
    const id = tarjeta.dataset.ytShort;
    const marco9 = tarjeta.querySelector('.short-box');
    const portada = tarjeta.querySelector('.short-cover');
    let marco = null;

    const yo = {
      pausar: () => {
        orden(marco, 'pauseVideo');
        tarjeta.classList.remove('is-live');
        marco9.classList.remove('is-on');
      },
    };
    todos.push(yo);

    portada?.addEventListener('click', () => {
      silenciarAlResto(yo);
      tarjeta.classList.add('is-live');
      marco9.classList.add('is-on');
      if (marco) {
        orden(marco, 'unMute');
        orden(marco, 'playVideo');
        return;
      }
      marco = nuevoMarco(marco9, id, portada.getAttribute('aria-label'), true);
    });
  }

  // Al perder de vista la tira, se callan
  const tira = document.querySelector('.shorts');
  if (tira) {
    new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) continue;
          for (const t of tira.querySelectorAll('[data-yt-short].is-live')) {
            orden(t.querySelector('iframe'), 'pauseVideo');
            t.classList.remove('is-live');
            t.querySelector('.short-box')?.classList.remove('is-on');
          }
        }
      },
      { threshold: 0 }
    ).observe(tira);
  }
}
