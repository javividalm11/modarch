import * as THREE from 'three';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

export function initInteriorModel(container) {
  if (!container || container.dataset.modelReady) return null;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    container.classList.add('is-fallback');
    return null;
  }

  container.dataset.modelReady = 'true';
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.append(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-6, 6, 5, -5, 0.1, 80);
  camera.position.set(10.5, 12.5, 11.5);
  camera.lookAt(0, 0.25, 0);

  const model = new THREE.Group();
  model.position.set(0.65, -0.1, 0.25);
  model.rotation.y = -0.16;
  scene.add(model);

  const materials = [];
  const geometries = [];
  const makeMaterial = (color, roughness = 0.82, metalness = 0) => {
    const value = new THREE.MeshStandardMaterial({ color, roughness, metalness });
    materials.push(value);
    return value;
  };
  const clay = makeMaterial(0xc56b3c);
  const clayDark = makeMaterial(0x8e3d20);
  const clayLight = makeMaterial(0xe4a170);
  const cream = makeMaterial(0xf2d4ad);
  const ivory = makeMaterial(0xffe9ca);
  const wood = makeMaterial(0x74331f);
  const woodLight = makeMaterial(0xa9522d);
  const textile = makeMaterial(0xe7b27e, 0.96);
  const green = makeMaterial(0x55715c);
  const charcoal = makeMaterial(0x382a25);
  const glass = makeMaterial(0x9fc4be, 0.2, 0.08);
  glass.transparent = true;
  glass.opacity = 0.48;

  const addMesh = (geometry, material, x, y, z, parent = model) => {
    geometries.push(geometry);
    const object = new THREE.Mesh(geometry, material);
    object.position.set(x, y, z);
    object.castShadow = true;
    object.receiveShadow = true;
    parent.add(object);
    return object;
  };
  const box = (w, h, d, material, x, y, z, parent) =>
    addMesh(new THREE.BoxGeometry(w, h, d), material, x, y, z, parent);
  const cylinder = (radius, height, material, x, y, z, sides = 24, parent) =>
    addMesh(new THREE.CylinderGeometry(radius, radius, height, sides), material, x, y, z, parent);

  box(9.7, 0.34, 7.7, clayDark, 0, -0.22, 0);
  box(9.25, 0.12, 7.25, clayLight, 0, 0.01, 0);
  box(3.5, 0.035, 3.5, cream, -2.72, 0.09, -1.68);
  box(3.45, 0.035, 3.5, clay, 0.82, 0.09, -1.68);
  box(2, 0.035, 3.5, cream, 3.48, 0.09, -1.68);
  box(4.7, 0.035, 3.35, clayLight, -1.75, 0.09, 1.77);
  box(4.35, 0.035, 3.35, cream, 2.68, 0.09, 1.77);

  box(9.45, 2.15, 0.18, clay, 0, 1.1, -3.56);
  box(0.18, 2.15, 7.3, clayDark, -4.63, 1.1, 0);
  box(0.18, 1.28, 7.3, clay, 4.63, 0.66, 0);
  box(3, 1.82, 0.13, clayDark, -3.1, 0.96, 0.05);
  box(2.2, 1.82, 0.13, clayDark, 3.55, 0.96, 0.05);
  box(0.13, 1.82, 2.55, clay, -0.96, 0.96, -2.25);
  box(0.13, 1.82, 2.3, clay, 2.52, 0.96, -2.38);

  box(2, 0.76, 0.04, glass, -2.55, 1.36, -3.44);
  box(1.5, 0.7, 0.04, glass, 0.9, 1.38, -3.44);
  box(0.76, 0.9, 0.04, wood, -4.49, 1.28, 1.45).rotation.y = Math.PI / 2;
  box(0.58, 0.7, 0.035, ivory, -4.38, 1.28, 1.45).rotation.y = Math.PI / 2;

  box(2.18, 0.42, 2.35, wood, -2.82, 0.34, -1.88);
  box(2.08, 0.28, 2.05, textile, -2.82, 0.68, -1.74);
  box(2.18, 1, 0.18, wood, -2.82, 0.58, -3.02);
  box(0.78, 0.17, 0.48, ivory, -3.32, 0.9, -2.48);
  box(0.78, 0.17, 0.48, ivory, -2.34, 0.9, -2.48);
  box(0.52, 0.38, 0.52, woodLight, -4.02, 0.29, -2.62);
  cylinder(0.16, 0.45, ivory, -4.02, 0.7, -2.62, 18);

  box(3.05, 0.16, 2.15, cream, 0.64, 0.18, 1.63);
  box(2.55, 0.55, 0.72, textile, 0.65, 0.42, 0.72);
  box(0.72, 0.55, 1.65, textile, -0.28, 0.42, 1.56);
  box(2.55, 0.62, 0.18, woodLight, 0.65, 0.7, 0.39);
  box(0.18, 0.62, 1.65, woodLight, -0.62, 0.7, 1.56);
  box(1.18, 0.19, 0.72, wood, 1.15, 0.39, 1.7);
  [[0.69, 1.43], [1.61, 1.43], [0.69, 1.97], [1.61, 1.97]].forEach(([x, z]) =>
    box(0.11, 0.31, 0.11, wood, x, 0.22, z));

  box(2.7, 0.72, 0.55, woodLight, 0.72, 0.42, -3.02);
  box(2.74, 0.09, 0.62, ivory, 0.72, 0.83, -3.02);
  box(1.55, 0.74, 0.68, clayDark, 1.03, 0.43, -1.72);
  box(1.65, 0.1, 0.78, cream, 1.03, 0.85, -1.72);
  cylinder(0.24, 0.47, wood, 0.24, 0.3, -0.95, 20);
  cylinder(0.24, 0.47, wood, 1.82, 0.3, -0.95, 20);

  box(1.55, 0.38, 2.05, wood, 3.48, 0.31, -1.7);
  box(1.47, 0.24, 1.85, cream, 3.48, 0.61, -1.63);
  box(1.55, 0.82, 0.15, woodLight, 3.48, 0.52, -2.67);
  box(0.55, 0.15, 0.38, ivory, 3.48, 0.82, -2.27);

  box(1.75, 0.17, 0.95, wood, -2.72, 0.68, 1.52);
  [[-3.37, 1.17], [-2.07, 1.17], [-3.37, 1.87], [-2.07, 1.87]].forEach(([x, z]) =>
    box(0.13, 0.58, 0.13, wood, x, 0.38, z));
  [-3.45, -2].forEach((x) => {
    [0.66, 2.36].forEach((z) => {
      box(0.48, 0.12, 0.48, cream, x, 0.46, z);
      box(0.12, 0.45, 0.12, woodLight, x, 0.24, z);
    });
  });

  box(1.55, 0.5, 0.68, ivory, 3.48, 0.33, 2.57);
  cylinder(0.3, 0.48, ivory, 3.48, 0.29, 0.72, 24);
  cylinder(0.18, 0.3, clayDark, 3.88, 0.24, 1.55, 18);
  const plant = new THREE.Group();
  plant.position.set(3.88, 0.42, 1.55);
  model.add(plant);
  for (let i = 0; i < 7; i += 1) {
    const leaf = addMesh(new THREE.SphereGeometry(0.22, 12, 9), green, 0, 0.22 + (i % 3) * 0.16, 0, plant);
    leaf.scale.set(0.62, 1.45, 0.42);
    leaf.rotation.z = (i - 3) * 0.34;
    leaf.position.x = Math.sin(i * 1.7) * 0.28;
    leaf.position.z = Math.cos(i * 1.4) * 0.22;
  }

  [[-2.72, 1.52], [0.85, 1.56]].forEach(([x, z]) => {
    cylinder(0.025, 0.68, charcoal, x, 1.68, z, 10);
    const shade = addMesh(new THREE.ConeGeometry(0.3, 0.42, 24, 1, true), cream, x, 1.25, z);
    shade.rotation.x = Math.PI;
  });

  scene.add(new THREE.HemisphereLight(0xffead2, 0x6f2f1d, 2.25));
  const sun = new THREE.DirectionalLight(0xffe1bd, 4.3);
  sun.position.set(-5, 10, 7);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8 });
  scene.add(sun);
  const fill = new THREE.PointLight(0xffa866, 2.1, 18);
  fill.position.set(4, 5, 1);
  scene.add(fill);

  let visible = true;
  let frame = 0;
  let pointerX = 0;
  let pointerY = 0;
  let targetY = -0.16;
  let dragging = false;
  let previousX = 0;
  let hinting = true;

  const resize = () => {
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);
    const aspect = width / height;
    const view = aspect < 1 ? 5.55 : 4.75;
    camera.left = -view * aspect;
    camera.right = view * aspect;
    camera.top = view;
    camera.bottom = -view;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };

  const updatePointer = (event) => {
    const rect = container.getBoundingClientRect();
    pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    if (dragging) {
      targetY = THREE.MathUtils.clamp(targetY + (event.clientX - previousX) * 0.006, -0.62, 0.34);
      previousX = event.clientX;
    }
  };
  const onPointerDown = (event) => {
    dragging = true;
    hinting = false;
    previousX = event.clientX;
    container.setPointerCapture?.(event.pointerId);
  };
  const onPointerUp = (event) => {
    dragging = false;
    container.releasePointerCapture?.(event.pointerId);
  };
  container.addEventListener('pointermove', updatePointer, { passive: true });
  container.addEventListener('pointerdown', onPointerDown);
  container.addEventListener('pointerup', onPointerUp);
  container.addEventListener('pointercancel', onPointerUp);
  container.addEventListener('pointerleave', () => {
    pointerX = 0;
    pointerY = 0;
  });

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  }, { rootMargin: '150px' });
  observer.observe(container);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  resize();

  const render = (time = 0) => {
    if (visible) {
      const still = reducedMotion.matches;
      const sway = hinting && !still ? Math.sin(time * 0.0006) * 0.12 : 0;
      const desiredY = targetY + sway + (still ? 0 : pointerX * 0.055);
      const desiredX = 0.025 + (still ? 0 : pointerY * 0.025);
      model.rotation.y += (desiredY - model.rotation.y) * 0.045;
      model.rotation.x += (desiredX - model.rotation.x) * 0.045;
      model.position.y = -0.1 + (still ? 0 : Math.sin(time * 0.00055) * 0.035);
      renderer.render(scene, camera);
    }
    frame = requestAnimationFrame(render);
  };

  container.classList.add('is-ready');
  render();

  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    resizeObserver.disconnect();
    renderer.dispose();
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((item) => item.dispose());
  };
}
