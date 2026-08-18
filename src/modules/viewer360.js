const SCENES = [
  {
    slug: 'departamento',
    label: 'Departamento',
    images: [
      '/assets/panoramas/departamento/01.png',
      '/assets/panoramas/departamento/02.jpg',
      '/assets/panoramas/departamento/03.jpg',
      '/assets/panoramas/departamento/04.jpg',
      '/assets/panoramas/departamento/05.jpg',
      '/assets/panoramas/departamento/06.jpg',
    ],
    kind: 'DEPARTAMENTO · 85 M²',
    name: 'Refugio contemporáneo',
    desc: 'Una experiencia de interiorismo pensada para que cada rincón tenga una razón de ser.',
    start: 18,
    spots: [
      { a: 30, e: -3, title: 'Textiles y paleta neutra', text: 'Lino, madera clara y tonos cálidos para un espacio sereno y fácil de habitar.' },
      { a: 146, e: 2, title: 'Iluminación natural', text: 'Aberturas amplias que distribuyen la luz y reducen la necesidad de iluminación artificial.' },
      { a: 262, e: -2, title: 'Mobiliario de baja altura', text: 'Piezas proporcionadas para conservar amplitud visual y una circulación limpia.' },
    ],
  },
  {
    slug: 'residencial',
    label: 'Residencial',
    images: [
      '/assets/panoramas/casa/01.jpeg',
      '/assets/panoramas/casa/02.jpeg',
      '/assets/panoramas/casa/03.jpeg',
      '/assets/panoramas/casa/04.jpeg',
      '/assets/panoramas/casa/05.jpeg',
      '/assets/panoramas/casa/06.jpeg',
    ],
    kind: 'RESIDENCIAL · 18 M²',
    name: 'Habitación gamer',
    desc: 'Mobiliario a medida, iluminación ambiental y almacenamiento integrado en un solo lenguaje.',
    start: 86,
    spots: [
      { a: 72, e: 1, title: 'Luz ambiental regulable', text: 'Iluminación indirecta que acompaña distintas escenas de uso sin generar reflejos.' },
      { a: 176, e: -3, title: 'Estación a medida', text: 'Escritorio continuo y módulos superiores diseñados para aprovechar cada centímetro.' },
      { a: 294, e: 3, title: 'Panel acústico', text: 'Listones verticales que aportan textura y ayudan a controlar la reverberación.' },
    ],
  },
  {
    slug: 'gastronomia',
    label: 'Gastronomía',
    images: [
      '/assets/panoramas/gastronomia/01.jpg',
      '/assets/panoramas/gastronomia/02.jpg',
      '/assets/panoramas/gastronomia/03.jpg',
      '/assets/panoramas/gastronomia/04.jpg',
      '/assets/panoramas/gastronomia/05.jpg',
      '/assets/panoramas/gastronomia/06.jpg',
    ],
    kind: 'GASTRONOMÍA · CHIFA FUSIÓN',
    name: 'Sabor con carácter',
    desc: 'Una identidad comercial traducida en color, luz, materialidad y experiencia de recorrido.',
    start: 28,
    spots: [
      { a: 36, e: 2, title: 'Identidad luminosa', text: 'Neón y gráfica integrados al interiorismo para construir una experiencia reconocible.' },
      { a: 154, e: -2, title: 'Iluminación de mesa', text: 'Colgantes cálidos que delimitan cada mesa y conservan una atmósfera íntima.' },
      { a: 248, e: 0, title: 'Circulación operativa', text: 'Distribución pensada para equilibrar aforo, comodidad y eficiencia del servicio.' },
    ],
  },
];

const FACES = 24;
const TEX = { worldW: 6144, segmentW: 1024, h: 1120 };
const FOV_MIN = 48;
const FOV_MAX = 82;
const RAD = Math.PI / 180;

export function initViewer360() {
  const root = document.getElementById('recorrido-360');
  const stage = document.getElementById('v360Stage');
  if (!root || !stage) return null;

  const world = document.getElementById('v360World');
  const spotLayer = document.getElementById('v360Spots');
  const sceneBar = document.getElementById('v360Scenes');
  const map = document.getElementById('v360Map');
  const load = document.getElementById('v360Load');
  const hint = document.getElementById('v360Hint');
  const autoButton = document.getElementById('v360Auto');
  const fullButton = document.getElementById('v360Full');
  const pickButton = document.getElementById('v360Pick');
  const rotate = document.getElementById('v360Rotate');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  const portrait = matchMedia('(orientation: portrait)');
  const handheld = matchMedia('(hover: none) and (pointer: coarse)');

  let scene = null;
  let spots = [];
  let yaw = 0;
  let pitch = 0;
  let fov = 68;
  let velocityYaw = 0;
  let velocityPitch = 0;
  let dragging = false;
  let touched = false;
  let autoRotate = !reduce.matches;
  let visible = true;
  let geometry = { p: 1000, r: TEX.worldW / (2 * Math.PI), sw: TEX.worldW / FACES, sh: TEX.h };
  let lastFrame = 0;
  let lastX = 0;
  let lastY = 0;
  let lastMove = 0;
  let pinchDistance = 0;
  let pinchFov = fov;
  const pointers = new Map();

  const markTouched = () => {
    if (touched) return;
    touched = true;
    hint?.classList.add('is-off');
  };

  const maxPitch = () => {
    const textureHalf = Math.atan((geometry.sh / 2) / geometry.r) / RAD;
    const viewportHalf = Math.atan(stage.clientHeight / (2 * geometry.p)) / RAD;
    return Math.max(0, textureHalf * 0.94 - viewportHalf);
  };

  const clampPitch = () => {
    const max = maxPitch();
    pitch = Math.max(-max, Math.min(max, pitch));
  };

  const fit = () => {
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    if (!width || !height) return;

    const radius = TEX.worldW / (2 * Math.PI);
    const textureHalf = Math.atan((TEX.h / 2) / radius);
    const horizontal = width / (2 * Math.tan((fov * RAD) / 2));
    const vertical = height / (2 * Math.tan(textureHalf * 0.94));
    const perspective = Math.max(horizontal, vertical);

    geometry = { p: perspective, r: radius, sw: TEX.worldW / FACES, sh: TEX.h };
    root.style.setProperty('--p', `${perspective.toFixed(2)}px`);
    root.style.setProperty('--r', `${radius.toFixed(2)}px`);
    root.style.setProperty('--nr', `${(-radius).toFixed(2)}px`);
    root.style.setProperty('--sw', `${geometry.sw.toFixed(3)}px`);
    root.style.setProperty('--hsw', `${(-geometry.sw / 2).toFixed(3)}px`);
    root.style.setProperty('--sh', `${TEX.h}px`);
    root.style.setProperty('--hsh', `${-TEX.h / 2}px`);
    root.style.setProperty('--tw', `${TEX.segmentW}px`);
    root.style.setProperty('--n', String(FACES));
    clampPitch();
  };

  const buildFaces = () => {
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < FACES; index += 1) {
      const face = document.createElement('div');
      face.className = 'v360-face';
      face.style.setProperty('--i', String(index));
      face.style.transform = `rotateY(${(-index * 360) / FACES}deg) translateZ(var(--nr))`;
      fragment.appendChild(face);
    }
    world.appendChild(fragment);
  };

  const closeSpots = () => {
    spots.forEach(({ element }) => element.setAttribute('aria-expanded', 'false'));
  };

  const buildSpots = () => {
    spotLayer.replaceChildren();
    spots = scene.spots.map((spot) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'v360-spot';
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', spot.title);
      button.innerHTML = '<span class="v360-dot"></span><span class="v360-tip"><b></b><span></span></span>';
      button.querySelector('b').textContent = spot.title;
      button.querySelector('.v360-tip > span').textContent = spot.text;
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const open = button.getAttribute('aria-expanded') === 'true';
        closeSpots();
        button.setAttribute('aria-expanded', String(!open));
      });
      spotLayer.appendChild(button);
      return { element: button, data: spot };
    });
  };

  const setScene = (index) => {
    const next = SCENES[index];
    if (!next || next === scene) return;
    scene = next;
    load?.classList.remove('is-off');
    closeSpots();

    [...sceneBar.children].forEach((button, buttonIndex) => {
      button.setAttribute('aria-pressed', String(buttonIndex === index));
    });

    document.getElementById('v360Kind').textContent = scene.kind;
    document.getElementById('v360Name').textContent = scene.name;
    document.getElementById('v360Desc').textContent = scene.desc;

    const requestedScene = scene;
    const requests = scene.images.map((src) => new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => resolve(image);
      image.src = src;
    }));

    Promise.all(requests).then((images) => {
      if (scene !== requestedScene) return;
      const faces = [...world.children];
      faces.forEach((face, faceIndex) => {
        const segmentIndex = Math.floor(faceIndex / 4);
        const localFace = faceIndex % 4;
        const source = images[segmentIndex];
        const naturalWidth = source.naturalWidth || TEX.segmentW;
        const naturalHeight = source.naturalHeight || TEX.h;
        const scale = Math.max(TEX.segmentW / naturalWidth, TEX.h / naturalHeight);
        const scaledWidth = naturalWidth * scale;
        const scaledHeight = naturalHeight * scale;
        const cropX = (scaledWidth - TEX.segmentW) / 2;
        const cropY = (scaledHeight - TEX.h) / 2;
        face.style.backgroundImage = `url("${requestedScene.images[segmentIndex]}")`;
        face.style.backgroundSize = `${scaledWidth.toFixed(2)}px ${scaledHeight.toFixed(2)}px`;
        face.style.backgroundPosition = `${(-cropX - localFace * geometry.sw).toFixed(2)}px ${(-cropY).toFixed(2)}px`;
        face.style.backgroundRepeat = 'no-repeat';
        // Primera y última cara de cada foto: ahí está la junta
        face.toggleAttribute('data-seam-start', localFace === 0);
        face.toggleAttribute('data-seam-end', localFace === 3);
      });
      map.style.backgroundImage = `url("${requestedScene.images[0]}")`;
      yaw = scene.start;
      pitch = 0;
      velocityYaw = 0;
      velocityPitch = 0;
      buildSpots();
      fit();
      requestAnimationFrame(() => load?.classList.add('is-off'));
    });
  };

  const buildScenes = () => {
    SCENES.forEach((item, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.role = 'menuitemradio';
      button.textContent = item.label;
      button.setAttribute('aria-pressed', String(index === 0));
      button.addEventListener('click', () => {
        setScene(index);
        closePick();
      });
      sceneBar.appendChild(button);
    });
  };

  const openPick = () => {
    sceneBar.hidden = false;
    pickButton?.setAttribute('aria-expanded', 'true');
  };

  const closePick = () => {
    sceneBar.hidden = true;
    pickButton?.setAttribute('aria-expanded', 'false');
  };

  if (pickButton) {
    pickButton.addEventListener('click', (event) => {
      event.stopPropagation();
      if (sceneBar.hidden) openPick();
      else closePick();
    });

    // Un clic en cualquier otro sitio lo cierra, como cualquier desplegable
    document.addEventListener('click', (event) => {
      if (sceneBar.hidden) return;
      if (!event.target.closest('.v360-pick')) closePick();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !sceneBar.hidden) closePick();
    });
  }

  const projectSpots = () => {
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    const cosYaw = Math.cos(yaw * RAD);
    const sinYaw = Math.sin(yaw * RAD);
    const cosPitch = Math.cos(pitch * RAD);
    const sinPitch = Math.sin(pitch * RAD);

    spots.forEach(({ element, data }) => {
      const elevation = data.e * RAD;
      const azimuth = -data.a * RAD;
      const cosElevation = Math.cos(elevation);
      const x = -Math.sin(azimuth) * cosElevation;
      const y = -Math.sin(elevation);
      const z = -Math.cos(azimuth) * cosElevation;
      const x1 = x * cosYaw + z * sinYaw;
      const z1 = -x * sinYaw + z * cosYaw;
      const y2 = y * cosPitch - z1 * sinPitch;
      const z2 = y * sinPitch + z1 * cosPitch;

      if (z2 > -0.12) {
        element.style.visibility = 'hidden';
        return;
      }

      const scale = geometry.p / -z2;
      const screenX = width / 2 + x1 * scale;
      const screenY = height / 2 + y2 * scale;
      if (screenX < -70 || screenX > width + 70 || screenY < -70 || screenY > height + 70) {
        element.style.visibility = 'hidden';
        return;
      }

      element.style.visibility = 'visible';
      element.style.transform = `translate(${screenX.toFixed(1)}px, ${screenY.toFixed(1)}px)`;
      element.style.opacity = Math.min(1, (-z2 - 0.12) * 4).toFixed(2);
      element.classList.toggle('is-flip', screenX > width * 0.62);
    });
  };

  const updateMap = () => {
    if (!map.clientWidth) return;
    const fraction = (((yaw % 360) + 360) % 360) / 360;
    const imageWidth = map.clientWidth * 3;
    map.style.backgroundSize = `${imageWidth}px 100%`;
    map.style.backgroundPositionX = `${map.clientWidth / 2 - fraction * imageWidth}px`;
  };

  const frame = (time) => {
    const delta = Math.min(64, time - lastFrame) || 16;
    lastFrame = time;
    if (visible && !dragging) {
      if (Math.abs(velocityYaw) > 0.001 || Math.abs(velocityPitch) > 0.001) {
        yaw += velocityYaw;
        pitch += velocityPitch;
        clampPitch();
        velocityYaw *= 0.93;
        velocityPitch *= 0.93;
      } else if (autoRotate) {
        yaw += delta * 0.0022;
      }
    }

    world.style.transform = `translateZ(var(--p)) rotateX(${pitch.toFixed(3)}deg) rotateY(${yaw.toFixed(3)}deg)`;
    projectSpots();
    updateMap();
    requestAnimationFrame(frame);
  };

  stage.addEventListener('pointerdown', (event) => {
    if (event.target.closest('.v360-tools, .v360-scenes, .v360-spot, .v360-rotate')) return;

    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 1) {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      velocityYaw = 0;
      velocityPitch = 0;
      stage.classList.add('is-grabbing');
      stage.setPointerCapture(event.pointerId);
      markTouched();
    } else if (pointers.size === 2) {
      const points = [...pointers.values()];
      pinchDistance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
      pinchFov = fov;
    }
  });

  stage.addEventListener('pointermove', (event) => {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 2 && pinchDistance) {
      const points = [...pointers.values()];
      const distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
      fov = Math.max(FOV_MIN, Math.min(FOV_MAX, (pinchFov * pinchDistance) / Math.max(distance, 1)));
      fit();
      return;
    }
    if (!dragging) return;
    const sensitivity = fov / stage.clientWidth;
    const dx = (event.clientX - lastX) * sensitivity;
    const dy = (event.clientY - lastY) * sensitivity;
    lastX = event.clientX;
    lastY = event.clientY;
    yaw -= dx;
    pitch += dy;
    clampPitch();
    velocityYaw = -dx;
    velocityPitch = dy;
    lastMove = event.timeStamp;
  });

  const endPointer = (event) => {
    pointers.delete(event.pointerId);
    if (pointers.size < 2) pinchDistance = 0;
    if (!pointers.size) {
      dragging = false;
      stage.classList.remove('is-grabbing');
      if (event.timeStamp - lastMove > 90) velocityYaw = velocityPitch = 0;
    }
  };
  stage.addEventListener('pointerup', endPointer);
  stage.addEventListener('pointercancel', endPointer);
  stage.addEventListener('lostpointercapture', endPointer);

  stage.addEventListener('wheel', (event) => {
    if (!event.ctrlKey) return;
    event.preventDefault();
    markTouched();
    fov = Math.max(FOV_MIN, Math.min(FOV_MAX, fov + event.deltaY * 0.045));
    fit();
  }, { passive: false });

  stage.addEventListener('keydown', (event) => {
    const step = fov / 22;
    if (event.key === 'ArrowLeft') yaw -= step;
    else if (event.key === 'ArrowRight') yaw += step;
    else if (event.key === 'ArrowUp') pitch += step * 0.6;
    else if (event.key === 'ArrowDown') pitch -= step * 0.6;
    else if (event.key === '+' || event.key === '=') fov = Math.max(FOV_MIN, fov - 4);
    else if (event.key === '-') fov = Math.min(FOV_MAX, fov + 4);
    else return;
    event.preventDefault();
    markTouched();
    clampPitch();
    fit();
  });

  stage.addEventListener('click', (event) => {
    if (!event.target.closest('.v360-spot')) closeSpots();
  });

  autoButton.setAttribute('aria-pressed', String(autoRotate));
  autoButton.addEventListener('click', (event) => {
    event.stopPropagation();
    autoRotate = !autoRotate;
    autoButton.setAttribute('aria-pressed', String(autoRotate));
  });

  const nativeFs = () =>
    stage.requestFullscreen?.bind(stage) || stage.webkitRequestFullscreen?.bind(stage);

  const isFs = () =>
    document.fullscreenElement === stage ||
    document.webkitFullscreenElement === stage ||
    stage.classList.contains('is-faux-full');

  // El aviso de girar es una sugerencia, no un bloqueo: se retira al tocar la
  // pantalla o solo, a los 5 segundos
  let rotateOff = false;
  let rotateTimer = 0;

  const checkRotate = () => {
    if (!rotate) return;
    rotate.hidden = rotateOff || !(handheld.matches && portrait.matches && isFs());
  };

  const dismissRotate = () => {
    if (rotateOff) return;
    rotateOff = true;
    clearTimeout(rotateTimer);
    checkRotate();
  };

  const armRotate = (on) => {
    clearTimeout(rotateTimer);
    rotateOff = false;
    if (on) rotateTimer = setTimeout(dismissRotate, 5000);
  };

  stage.addEventListener('pointerdown', dismissRotate);

  let saved = 0;

  // En iOS `overflow:hidden` en el body ni frena el scroll ni evita que se
  // recorten los elementos fijos: hay que fijarlo y devolver la posición
  const lockPage = (on) => {
    const body = document.body;
    if (on === body.classList.contains('v360-locked')) return;
    if (on) {
      saved = window.scrollY;
      body.style.top = `-${saved}px`;
      body.classList.add('v360-locked');
      window.__lenis?.stop();
    } else {
      body.classList.remove('v360-locked');
      body.style.top = '';
      window.__lenis?.start();
      window.scrollTo(0, saved);
      window.__lenis?.scrollTo(saved, { immediate: true });
    }
  };

  const syncFs = () => {
    const on = isFs();
    fullButton.setAttribute('aria-pressed', String(on));
    fullButton.setAttribute('aria-label', on ? 'Salir de pantalla completa' : 'Ver en pantalla completa');
    lockPage(on);
    armRotate(on);
    checkRotate();
    // El lienzo se remide una vez asentado el cambio de tamaño
    setTimeout(fit, 80);
    setTimeout(fit, 320);
  };

  const enter = async () => {
    const request = nativeFs();
    if (request) {
      try {
        await request();
        return;
      } catch {
      }
    }
    stage.classList.add('is-faux-full');
    syncFs();
  };

  const exit = () => {
    if (stage.classList.contains('is-faux-full')) {
      stage.classList.remove('is-faux-full');
      syncFs();
      return;
    }
    (document.exitFullscreen?.() || document.webkitExitFullscreen?.() || Promise.resolve())?.catch?.(() => {});
  };

  fullButton.addEventListener('click', (event) => {
    event.stopPropagation();
    if (isFs()) exit();
    else enter();
  });

  // Escapar de la simulada: sin API nativa, el navegador no la cierra solo
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && stage.classList.contains('is-faux-full')) exit();
  });

  document.addEventListener('fullscreenchange', syncFs);
  document.addEventListener('webkitfullscreenchange', syncFs);

  // Al girar el teléfono el aviso tiene que desaparecer solo
  portrait.addEventListener('change', () => {
    checkRotate();
    setTimeout(fit, 250);
  });

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  }, { threshold: 0.05 });
  observer.observe(root);

  addEventListener('resize', fit, { passive: true });
  reduce.addEventListener?.('change', (event) => {
    autoRotate = !event.matches;
    autoButton.setAttribute('aria-pressed', String(autoRotate));
  });

  buildFaces();
  buildScenes();
  setScene(0);
  fit();
  requestAnimationFrame(frame);
  return { fit, setScene };
}
