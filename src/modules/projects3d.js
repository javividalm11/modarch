import * as THREE from 'three';

const RADIUS = 3.55;

function accentSegments(wire) {
  const src = wire.attributes.position.array;
  const selected = [];
  for (let i = 0; i < src.length; i += 6) {
    const segment = i / 6;
    if (segment % 13 < 2 || segment % 29 === 0) {
      selected.push(src[i], src[i + 1], src[i + 2], src[i + 3], src[i + 4], src[i + 5]);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(selected, 3));
  return geo;
}

export function initProjectsGallery(stage, projects, callbacks) {
  if (!stage || !projects?.length) return null;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    return null;
  }
  if (!renderer.getContext()) return null;

  const W = () => stage.clientWidth;
  const H = () => stage.clientHeight;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W(), H());
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const FOV = 38;
  const camera = new THREE.PerspectiveCamera(FOV, W() / H(), 0.1, 100);
  const root = new THREE.Group();
  scene.add(root);

  // Esfera triangulada: una piel tenue, una red oscura y trazos cálidos.
  const shellGeo = new THREE.IcosahedronGeometry(RADIUS, 3);
  const shell = new THREE.Mesh(
    shellGeo,
    new THREE.MeshBasicMaterial({
      color: 0xf0ece4,
      transparent: true,
      opacity: 0.055,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  root.add(shell);

  const wireGeo = new THREE.WireframeGeometry(shellGeo);
  const wire = new THREE.LineSegments(
    wireGeo,
    new THREE.LineBasicMaterial({ color: 0x17261e, transparent: true, opacity: 0.34 })
  );
  root.add(wire);

  const accentGeo = accentSegments(wireGeo);
  const accents = new THREE.LineSegments(
    accentGeo,
    new THREE.LineBasicMaterial({
      color: 0xc99552,
      transparent: true,
      opacity: 0.86,
      blending: THREE.AdditiveBlending,
    })
  );
  accents.scale.setScalar(1.006);
  root.add(accents);

  // Nodos de la red. Las posiciones repetidas intensifican las intersecciones.
  const pointGeo = new THREE.BufferGeometry();
  pointGeo.setAttribute('position', shellGeo.attributes.position.clone());
  const nodes = new THREE.Points(
    pointGeo,
    new THREE.PointsMaterial({
      color: 0xd8f26d,
      size: 0.052,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  nodes.scale.setScalar(1.012);
  root.add(nodes);

  // Fragmentos translúcidos que rompen la regularidad de la esfera.
  const shardGeo = new THREE.CircleGeometry(0.22, 3);
  const shardMaterial = new THREE.MeshBasicMaterial({
    color: 0x6f806f,
    transparent: true,
    opacity: 0.11,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const up = new THREE.Vector3(0, 0, 1);
  for (let i = 0; i < 34; i++) {
    const y = 1 - (i / 33) * 2;
    const radial = Math.sqrt(Math.max(0, 1 - y * y));
    const angle = i * 2.399963;
    const dir = new THREE.Vector3(Math.cos(angle) * radial, y, Math.sin(angle) * radial);
    const shard = new THREE.Mesh(shardGeo, shardMaterial);
    shard.position.copy(dir).multiplyScalar(RADIUS * 1.006);
    shard.quaternion.setFromUnitVectors(up, dir);
    shard.rotation.z = angle * 0.37;
    shard.scale.setScalar(0.55 + ((i * 37) % 70) / 100);
    root.add(shard);
  }

  const directions = [
    [0.72, 0.5, 1],
    [-0.48, 0.7, 1],
    [-0.88, -0.08, 0.82],
    [-0.18, -0.78, 1],
    [0.72, -0.5, 0.9],
    [0.08, 0.92, 0.82],
  ].map(([x, y, z]) => new THREE.Vector3(x, y, z).normalize());

  const loader = new THREE.TextureLoader();
  const panelGeo = new THREE.CircleGeometry(0.72, 6);
  const ringGeo = new THREE.RingGeometry(0.73, 0.77, 6);
  const panels = [];
  const holders = [];
  const textures = [];
  const panelMaterials = [];
  const ringMaterials = [];

  projects.forEach((project, index) => {
    const dir = directions[index % directions.length];
    const holder = new THREE.Group();
    holder.position.copy(dir).multiplyScalar(RADIUS + 0.035);
    holder.quaternion.setFromUnitVectors(up, dir);
    holder.userData.direction = dir;

    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.58,
      side: THREE.DoubleSide,
      depthWrite: false,
      toneMapped: false,
    });
    panelMaterials.push(mat);
    loader.load(project.cover, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      mat.map = texture;
      mat.needsUpdate = true;
      textures.push(texture);
    });

    const panel = new THREE.Mesh(panelGeo, mat);
    panel.userData.index = index;
    panel.renderOrder = 4;
    holder.add(panel);

    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xd8f26d,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    ringMaterials.push(ringMat);
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.z = 0.012;
    ring.renderOrder = 5;
    holder.add(ring);

    root.add(holder);
    panels.push(panel);
    holders.push(holder);
  });

  const state = {
    index: 0,
    yaw: 0,
    pitch: 0,
    yawT: 0,
    pitchT: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
    downX: 0,
    acc: 0,
    manual: false,
  };
  let current = -1;
  let hop;

  function setIndex(value, manual = false) {
    const index = ((value % projects.length) + projects.length) % projects.length;
    if (manual) state.manual = true;
    state.index = index;
    if (index !== current) {
      current = index;
      callbacks?.onChange?.(index);
    }
  }

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  function pick(event) {
    const box = stage.getBoundingClientRect();
    ndc.x = ((event.clientX - box.left) / (box.width || 1)) * 2 - 1;
    ndc.y = -((event.clientY - box.top) / (box.height || 1)) * 2 + 1;
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects(panels, false)[0];
    return hit ? hit.object.userData.index : -1;
  }

  const down = (event) => {
    state.dragging = true;
    state.manual = true;
    state.lastX = state.downX = event.clientX;
    state.lastY = event.clientY;
    state.acc = 0;
    stage.classList.add('is-dragging');
    stage.setPointerCapture?.(event.pointerId);
  };
  const move = (event) => {
    if (!state.dragging) {
      const hit = pick(event);
      stage.style.cursor = hit >= 0 ? 'pointer' : '';
      if (hit >= 0) setIndex(hit);
      return;
    }
    const dx = event.clientX - state.lastX;
    const dy = event.clientY - state.lastY;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    state.acc += dx;
    state.yawT += dx * 0.006;
    state.pitchT = THREE.MathUtils.clamp(state.pitchT + dy * 0.004, -0.58, 0.58);
    while (state.acc <= -120) { state.acc += 120; setIndex(state.index + 1, true); }
    while (state.acc >= 120) { state.acc -= 120; setIndex(state.index - 1, true); }
  };
  const upPointer = () => {
    if (!state.dragging) return;
    state.dragging = false;
    stage.classList.remove('is-dragging');
  };

  stage.addEventListener('pointerdown', down);
  window.addEventListener('pointermove', move, { passive: true });
  window.addEventListener('pointerup', upPointer);
  window.addEventListener('pointercancel', upPointer);
  stage.addEventListener('pointerleave', () => {
    stage.style.cursor = '';
  });
  stage.addEventListener('click', (event) => {
    if (Math.abs(event.clientX - state.downX) > 7) return;
    const index = pick(event);
    if (index < 0) return;
    setIndex(index, true);
    callbacks?.onSelect?.(index);
  });
  stage.addEventListener('wheel', (event) => {
    if (Math.abs(event.deltaX) < Math.abs(event.deltaY)) return;
    event.preventDefault();
    state.manual = true;
    state.yawT += event.deltaX * 0.0025;
  }, { passive: false });

  const api = {
    next: () => setIndex(state.index + 1, true),
    prev: () => setIndex(state.index - 1, true),
    goTo: (index) => setIndex(index, true),
    currentIndex: () => state.index,
  };

  const resize = () => {
    if (!W() || !H()) return;
    camera.aspect = W() / H();
    const narrow = W() < 720;
    const viewHeight = narrow ? 8.6 : 7.75;
    camera.position.z = (viewHeight / 2) / Math.tan((FOV * Math.PI / 180) / 2);
    root.position.x = narrow ? 0 : 0.5;
    root.scale.setScalar(narrow ? 0.91 : 1);
    camera.updateProjectionMatrix();
    renderer.setSize(W(), H());
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  resize();

  let visible = true;
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  }, { threshold: 0.05 });
  intersection.observe(stage);

  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const clock = new THREE.Clock();
  let raf;

  const cycle = () => {
    hop = setTimeout(() => {
      if (!state.manual && !reduce.matches) setIndex(state.index + 1);
      cycle();
    }, 3600);
  };
  cycle();
  setIndex(0);

  const tick = () => {
    raf = requestAnimationFrame(tick);
    if (!visible) return;
    const time = clock.getElapsedTime();
    const ambientYaw = reduce.matches || state.manual ? 0 : Math.sin(time * 0.18) * 0.34;
    const ambientPitch = reduce.matches ? 0 : Math.sin(time * 0.14) * 0.1;
    state.yaw += (state.yawT + ambientYaw - state.yaw) * 0.045;
    state.pitch += (state.pitchT + ambientPitch - state.pitch) * 0.045;
    root.rotation.y = state.yaw;
    root.rotation.x = state.pitch;
    accents.material.opacity = 0.68 + Math.sin(time * 1.4) * 0.18;
    nodes.material.opacity = 0.55 + Math.sin(time * 1.1) * 0.15;

    holders.forEach((holder, index) => {
      const active = index === state.index ? 1 : 0;
      const targetScale = active ? 1.38 : 0.92;
      holder.scale.x += (targetScale - holder.scale.x) * 0.085;
      holder.scale.y += (targetScale - holder.scale.y) * 0.085;
      holder.scale.z += (targetScale - holder.scale.z) * 0.085;
      const targetRadius = RADIUS + 0.035 + active * 0.46;
      const target = holder.userData.direction.clone().multiplyScalar(targetRadius);
      holder.position.lerp(target, 0.085);
      panelMaterials[index].opacity += ((active ? 1 : 0.5) - panelMaterials[index].opacity) * 0.08;
      ringMaterials[index].opacity += ((active ? 0.95 : 0.22) - ringMaterials[index].opacity) * 0.08;
    });

    renderer.render(scene, camera);
  };
  tick();

  return {
    ...api,
    destroy() {
      cancelAnimationFrame(raf);
      clearTimeout(hop);
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', upPointer);
      window.removeEventListener('pointercancel', upPointer);
      textures.forEach((texture) => texture.dispose());
      panelMaterials.forEach((material) => material.dispose());
      ringMaterials.forEach((material) => material.dispose());
      shell.material.dispose();
      wire.material.dispose();
      accents.material.dispose();
      nodes.material.dispose();
      shardMaterial.dispose();
      shellGeo.dispose();
      wireGeo.dispose();
      accentGeo.dispose();
      pointGeo.dispose();
      shardGeo.dispose();
      panelGeo.dispose();
      ringGeo.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
