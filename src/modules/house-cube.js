import * as THREE from 'three';

const SAND = 0xd8cfbe;
const STONE = 0xc4bbaa;
const OAK = 0xc2a177;

// Núcleo macizo con tres paneles que sobresalen. Al apuntar uno se avisa con
// su índice y su posición en pantalla, para trazar la línea guía en HTML.
export function initHouseCube(stage, faces, { onHover } = {}) {
  if (!stage || !faces?.length) return null;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    return null;
  }

  const W = () => stage.clientWidth;
  const H = () => stage.clientHeight;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W(), H());
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, W() / H(), 0.1, 60);
  camera.position.set(4.4, 3.2, 5.6);
  camera.lookAt(0, 0, 0);

  const world = new THREE.Group();
  scene.add(world);

  // Núcleo
  const core = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 2.5, 2.5),
    new THREE.MeshStandardMaterial({ color: STONE, roughness: 0.88, metalness: 0.02 })
  );
  core.castShadow = core.receiveShadow = true;
  world.add(core);

  // Zócalo y coronación: dan lectura de edificio sin romper el cubo
  const slabMat = new THREE.MeshStandardMaterial({ color: SAND, roughness: 0.8, metalness: 0.03 });
  [-1.36, 1.36].forEach((y) => {
    const slab = new THREE.Mesh(new THREE.BoxGeometry(2.78, 0.22, 2.78), slabMat);
    slab.position.y = y;
    slab.castShadow = slab.receiveShadow = true;
    world.add(slab);
  });

  const loader = new THREE.TextureLoader();
  const frameMat = new THREE.MeshStandardMaterial({ color: OAK, roughness: 0.5, metalness: 0.18 });

  // Frente (+Z), costado (+X) y cubierta (+Y)
  const SLOTS = [
    { pos: [0, -0.12, 1.42], rot: [0, 0, 0], size: [2.1, 1.9] },
    { pos: [1.42, -0.12, 0], rot: [0, Math.PI / 2, 0], size: [2.1, 1.9] },
    { pos: [-1.42, -0.12, 0], rot: [0, -Math.PI / 2, 0], size: [2.1, 1.9] },
  ];

  const panels = [];

  faces.slice(0, 3).forEach((face, i) => {
    const slot = SLOTS[i];
    const [w, h] = slot.size;
    const group = new THREE.Group();

    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.62, metalness: 0.04 });
    loader.load(face.img, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      mat.map = tex;
      mat.needsUpdate = true;
    });

    // Marco de roble ligeramente mayor que la lámina
    const frame = new THREE.Mesh(new THREE.BoxGeometry(w + 0.14, h + 0.14, 0.16), frameMat);
    frame.castShadow = frame.receiveShadow = true;
    group.add(frame);

    const plate = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    plate.position.z = 0.085;
    group.add(plate);

    group.position.set(...slot.pos);
    group.rotation.set(...slot.rot);
    group.userData = { index: i, home: group.position.clone(), offset: 0, target: 0 };

    world.add(group);
    panels.push(group);
  });

  // Luz
  scene.add(new THREE.HemisphereLight(0xfff8ef, 0xbfb4a3, 1.5));

  const key = new THREE.DirectionalLight(0xfff4e6, 2.1);
  key.position.set(5, 7, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 24;
  key.shadow.camera.left = -5;
  key.shadow.camera.right = 5;
  key.shadow.camera.top = 5;
  key.shadow.camera.bottom = -5;
  key.shadow.bias = -0.0015;
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xe8f0e9, 0.55);
  fill.position.set(-5, 2, 4);
  scene.add(fill);

  // Interacción
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const pointer = { x: 0, y: 0, tx: 0, ty: 0, inside: false };
  let hovered = -1;
  let locked = -1;

  const project = (obj) => {
    const v = new THREE.Vector3();
    obj.getWorldPosition(v);
    v.project(camera);
    const r = stage.getBoundingClientRect();
    return { x: ((v.x + 1) / 2) * r.width, y: ((-v.y + 1) / 2) * r.height };
  };

  const emit = () => {
    const i = locked >= 0 ? locked : hovered;
    if (i < 0) {
      onHover?.(null, null);
      return;
    }
    onHover?.(i, project(panels[i]));
  };

  // Arrastre libre con inercia
  const drag = { on: false, x: 0, y: 0, moved: 0 };

  const onDown = (e) => {
    drag.on = true;
    drag.x = e.clientX;
    drag.y = e.clientY;
    drag.moved = 0;
    stage.setPointerCapture?.(e.pointerId);
    stage.style.cursor = 'grabbing';
  };

  const onUp = () => {
    if (!drag.on) return;
    drag.on = false;
    stage.style.cursor = hovered >= 0 ? 'pointer' : '';
  };

  const onMove = (e) => {
    const r = stage.getBoundingClientRect();
    pointer.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    pointer.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    pointer.inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;

    if (!drag.on) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    drag.x = e.clientX;
    drag.y = e.clientY;
    drag.moved += Math.abs(dx) + Math.abs(dy);
    vSpin = dx * 0.007;
    vTilt = dy * 0.005;
    spin += vSpin;
    tilt += vTilt;
  };

  // Se traza cada frame: gira solo, así que la cara cambia sin mover el cursor
  const pick = () => {
    if (!pointer.inside) {
      if (hovered !== -1) hovered = -1;
      return;
    }
    ndc.set(pointer.tx, -pointer.ty);
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects(panels, true)[0];
    const next = hit ? hit.object.parent.userData.index : -1;
    if (next !== hovered) {
      hovered = next;
      stage.style.cursor = next >= 0 ? 'pointer' : 'grab';
    }
  };

  const onLeave = () => {
    if (drag.on) return;
    pointer.inside = false;
    hovered = -1;
    stage.style.cursor = '';
  };

  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);
  stage.addEventListener('pointerdown', onDown);
  stage.addEventListener('pointerleave', onLeave);

  // Un clic sin arrastre fija la cara; el arrastre no debe seleccionar
  stage.addEventListener('click', () => {
    if (drag.moved > 6) return;
    locked = hovered >= 0 && hovered !== locked ? hovered : -1;
  });

  const resize = () => {
    if (!W() || !H()) return;
    camera.aspect = W() / H();
    camera.updateProjectionMatrix();
    renderer.setSize(W(), H());
  };
  const ro = new ResizeObserver(resize);
  ro.observe(stage);
  resize();

  let visible = true;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.05 });
  io.observe(stage);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clock = new THREE.Clock();
  let spin = 0.5;
  let tilt = -0.06;
  let vSpin = 0;
  let vTilt = 0;
  let raf;

  const tick = () => {
    raf = requestAnimationFrame(tick);
    if (!visible) return;

    const dt = clock.getDelta();
    const t = clock.getElapsedTime();
    const base = reduced ? 0.1 : 1;

    if (!drag.on) pick();
    const focus = drag.on ? -1 : locked >= 0 ? locked : hovered;

    if (drag.on) {
      // El arrastre manda: no hay giro automático mientras se sujeta
      stage.style.cursor = 'grabbing';
    } else {
      // Inercia tras soltar y vuelta suave al giro de exhibición
      spin += vSpin;
      tilt += vTilt;
      vSpin *= 0.93;
      vTilt *= 0.93;
      if (Math.abs(vSpin) < 0.0006) vSpin = 0;
      if (Math.abs(vTilt) < 0.0006) vTilt = 0;

      spin += dt * 0.11 * base * (focus >= 0 ? 0.12 : 1);
      tilt += (-0.06 - tilt) * 0.015;
    }

    tilt = Math.max(-0.85, Math.min(0.7, tilt));

    world.rotation.y = spin;
    world.rotation.x = tilt;
    world.position.y = Math.sin(t * 0.5 * base) * 0.05;

    // El panel apuntado se separa del núcleo
    for (const p of panels) {
      p.userData.target = p.userData.index === focus ? 0.3 : 0;
      p.userData.offset += (p.userData.target - p.userData.offset) * 0.09;
      const o = p.userData.offset;
      p.position.set(
        p.userData.home.x * (1 + o * 0.24),
        p.userData.home.y,
        p.userData.home.z * (1 + o * 0.24)
      );
    }

    emit();
    renderer.render(scene, camera);
  };
  tick();

  return {
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
