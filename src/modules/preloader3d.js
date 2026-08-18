import * as THREE from 'three';

const M_OUTLINE = [
  [13, 29],
  [81, 29],
  [135, 172],
  [189, 29],
  [256, 29],
  [256, 172],
  [206, 172],
  [206, 114],
  [157, 241],
  [113, 241],
  [65, 116],
  [65, 171],
  [13, 171],
];

const SQUARE = { x: 13, y: 185, w: 52, h: 51 };
const DOT = { cx: 230.5, cy: 211, r: 24.5 };

const GREEN = 0x6e8f76;
const TERRA = 0xc97f55;

// Del sistema de 270 px a un espacio centrado de -1 a 1, con la Y hacia arriba
const nx = (x) => (x - 135) / 135;
const ny = (y) => (135 - y) / 135;

function markShapes() {
  const m = new THREE.Shape();
  M_OUTLINE.forEach(([x, y], i) => {
    if (i === 0) m.moveTo(nx(x), ny(y));
    else m.lineTo(nx(x), ny(y));
  });
  m.closePath();

  const sq = new THREE.Shape();
  sq.moveTo(nx(SQUARE.x), ny(SQUARE.y));
  sq.lineTo(nx(SQUARE.x + SQUARE.w), ny(SQUARE.y));
  sq.lineTo(nx(SQUARE.x + SQUARE.w), ny(SQUARE.y + SQUARE.h));
  sq.lineTo(nx(SQUARE.x), ny(SQUARE.y + SQUARE.h));
  sq.closePath();

  const dot = new THREE.Shape();
  dot.absarc(nx(DOT.cx), ny(DOT.cy), DOT.r / 135, 0, Math.PI * 2, false);

  return { m, sq, dot };
}

export function initPreloader3D(canvas) {
  if (!canvas) return null;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return null;
  }
  if (!renderer.getContext()) return null;

  // Hasta 2x: por encima el coste sube sin ganancia visible
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0, 4.6);

  const group = new THREE.Group();
  scene.add(group);

  const { m, sq, dot } = markShapes();
  const extrude = { depth: 0.3, bevelEnabled: true, bevelThickness: 0.022, bevelSize: 0.016, bevelSegments: 4, curveSegments: 48 };

  const surface = (color) =>
    new THREE.MeshStandardMaterial({ color, roughness: 0.42, metalness: 0.12, envMapIntensity: 0.9 });

  const meshes = [
    new THREE.Mesh(new THREE.ExtrudeGeometry(m, extrude), surface(GREEN)),
    new THREE.Mesh(new THREE.ExtrudeGeometry(sq, extrude), surface(TERRA)),
    new THREE.Mesh(new THREE.ExtrudeGeometry(dot, extrude), surface(TERRA)),
  ];
  meshes.forEach((mesh) => {
    mesh.position.z = -extrude.depth / 2;
    group.add(mesh);
  });

  // Luz de estudio: clave cálida, relleno frío y contra para dibujar los cantos
  const key = new THREE.DirectionalLight(0xfff4e6, 2.5);
  key.position.set(3.2, 4.2, 5);
  const fill = new THREE.DirectionalLight(0xd9e6dd, 0.85);
  fill.position.set(-4, -1.5, 2.5);
  const rim = new THREE.DirectionalLight(0xffffff, 1.6);
  rim.position.set(-1.5, 2.5, -4);
  scene.add(key, fill, rim, new THREE.AmbientLight(0xf3efe6, 0.55));

  const host = canvas.parentElement || canvas;

  const resize = () => {
    const r = host.getBoundingClientRect();
    const w = Math.max(Math.round(r.width), 1);
    const h = Math.max(Math.round(r.height), 1);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width === Math.round(w * dpr) && canvas.height === Math.round(h * dpr)) return;
    camera.aspect = w / h;
    // Encaja la marca en anchos estrechos sin recortarla
    camera.fov = w / h < 1 ? 30 / Math.max(w / h, 0.55) : 30;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(host);

  const state = { spin: 0, settle: 0 };
  let frame = 0;
  let running = true;

  const tick = (time = 0) => {
    if (!running) return;
    resize();
    const t = time * 0.001;
    // Balanceo suave que sigue vivo mientras carga
    group.rotation.y = state.spin + Math.sin(t * 0.9) * 0.16 * state.settle;
    group.rotation.x = Math.sin(t * 0.7) * 0.07 * state.settle;
    renderer.render(scene, camera);
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);

  const dispose = () => {
    running = false;
    cancelAnimationFrame(frame);
    ro.disconnect();
    meshes.forEach((mesh) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
    });
    renderer.dispose();
  };

  return { group, state, dispose };
}
