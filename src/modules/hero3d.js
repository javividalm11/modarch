import * as THREE from 'three';

const SAGE = 0x689779;
const CLAY = 0xd59a71;
const BONE = 0xf2efe9;

function gradientEnv(renderer) {
  const c = document.createElement('canvas');
  c.width = 32;
  c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, '#1b241e');
  g.addColorStop(0.42, '#4d6d59');
  g.addColorStop(0.62, '#8a6b52');
  g.addColorStop(1, '#080b09');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 32, 256);

  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;

  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromEquirectangular(tex).texture;
  pmrem.dispose();
  tex.dispose();
  return env;
}

function dustSprite() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.5)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

export function initHero3D(container) {
  if (!container) return null;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    container.style.background = 'url(/assets/img/hero-arquitectura.jpg) center/cover';
    return null;
  }

  const lowPower = window.matchMedia('(max-width: 760px)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.5 : 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = !lowPower;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0f0c, 0.0155);
  scene.environment = gradientEnv(renderer);

  const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 300);
  camera.position.set(0, 4.6, 22);

  const world = new THREE.Group();
  world.position.x = 7.5;
  scene.add(world);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(400, 400),
    new THREE.MeshStandardMaterial({ color: 0x0c110e, metalness: 0.94, roughness: 0.28 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -4;
  floor.receiveShadow = true;
  world.add(floor);

  const concrete = new THREE.MeshStandardMaterial({ color: 0xe6e1d6, roughness: 0.62, metalness: 0.04 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x35443b, roughness: 0.5, metalness: 0.3 });
  const brass = new THREE.MeshStandardMaterial({
    color: CLAY,
    roughness: 0.18,
    metalness: 0.95,
    emissive: CLAY,
    emissiveIntensity: 0.35,
  });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xbfd6c8,
    transmission: lowPower ? 0 : 0.92,
    thickness: 1.4,
    roughness: 0.08,
    ior: 1.42,
    metalness: 0,
    transparent: true,
    opacity: lowPower ? 0.3 : 1,
  });

  const BAYS = lowPower ? 7 : 11;
  const BAY_Z = 8.2;
  const HALF = 5.6;
  const COL_H = 15;

  const colGeo = new THREE.BoxGeometry(1.05, COL_H, 1.05);
  const columns = new THREE.InstancedMesh(colGeo, concrete, BAYS * 2);
  const lintelGeo = new THREE.BoxGeometry(HALF * 2 + 1.05, 0.85, 1.05);
  const lintels = new THREE.InstancedMesh(lintelGeo, stone, BAYS);
  const dummy = new THREE.Object3D();

  for (let i = 0; i < BAYS; i++) {
    const z = -4 - i * BAY_Z;
    [-1, 1].forEach((side, s) => {
      dummy.position.set(side * HALF, COL_H / 2 - 4, z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      columns.setMatrixAt(i * 2 + s, dummy.matrix);
    });
    dummy.position.set(0, COL_H - 4.2, z);
    dummy.updateMatrix();
    lintels.setMatrixAt(i, dummy.matrix);
  }
  columns.castShadow = lintels.castShadow = !lowPower;
  columns.receiveShadow = true;
  world.add(columns, lintels);

  const core = new THREE.Group();
  core.position.set(0, 1.4, -7);
  core.scale.setScalar(0.72);
  world.add(core);

  const slabs = [
    { w: 6.4, h: 0.32, d: 5.2, y: -2.4 },
    { w: 5, h: 0.26, d: 4, y: 0.9 },
    { w: 3.4, h: 0.22, d: 2.8, y: 3.8 },
  ];
  for (const s of slabs) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(s.w, s.h, s.d), concrete);
    m.position.y = s.y;
    m.castShadow = m.receiveShadow = true;
    core.add(m);
  }

  const pillar = new THREE.Mesh(new THREE.BoxGeometry(1.1, 6.6, 1.1), stone);
  pillar.position.set(-1.5, 0.5, -0.8);
  pillar.castShadow = true;
  core.add(pillar);

  const glassBlock = new THREE.Mesh(new THREE.BoxGeometry(1.9, 2.8, 1.9), glassMat);
  glassBlock.position.set(1.3, 2.4, 0.6);
  core.add(glassBlock);

  const arch = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.14, 18, 80, Math.PI), brass);
  arch.position.set(0, 1, 0.2);
  arch.rotation.y = Math.PI * 0.14;
  arch.castShadow = true;
  core.add(arch);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.035, 10, 120), brass);
  ring.rotation.set(Math.PI / 2.35, 0, 0.22);
  ring.position.y = 1.2;
  core.add(ring);

  const floaters = [];
  const floatMat = new THREE.MeshStandardMaterial({ color: 0x9fb8a8, roughness: 0.38, metalness: 0.6 });
  for (let i = 0; i < (lowPower ? 4 : 8); i++) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(1.1 + Math.random() * 1.8, 0.1, 0.7 + Math.random() * 1.2), floatMat);
    m.position.set((Math.random() - 0.5) * 8, 1.5 + Math.random() * 8, -8 - Math.random() * 48);
    m.rotation.set(Math.random() * 0.25, Math.random() * Math.PI, Math.random() * 0.18);
    m.userData.speed = 0.12 + Math.random() * 0.3;
    m.userData.offset = Math.random() * Math.PI * 2;
    floaters.push(m);
    world.add(m);
  }

  const dustCount = lowPower ? 320 : 900;
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 26;
    dustPos[i * 3 + 1] = Math.random() * 20 - 3.5;
    dustPos[i * 3 + 2] = -Math.random() * 92 + 6;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(
    dustGeo,
    new THREE.PointsMaterial({
      size: 0.11,
      map: dustSprite(),
      color: 0xdfe7e0,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  world.add(dust);

  const beamMat = new THREE.MeshBasicMaterial({
    color: SAGE,
    transparent: true,
    opacity: 0.055,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  for (let i = 0; i < (lowPower ? 3 : 5); i++) {
    const beam = new THREE.Mesh(new THREE.ConeGeometry(2.6, 20, 20, 1, true), beamMat.clone());
    beam.material.color.setHex(i % 2 ? CLAY : SAGE);
    beam.material.opacity = 0.07;
    beam.position.set((i % 2 ? 1 : -1) * 2.6, 7.5, -6 - i * BAY_Z * 1.6);
    beam.rotation.z = (i % 2 ? 1 : -1) * 0.1;
    world.add(beam);
  }

  scene.add(new THREE.HemisphereLight(0xa8c4b3, 0x121a15, 1.15));

  const bounce = new THREE.DirectionalLight(0x9fc0ac, 0.9);
  bounce.position.set(world.position.x - 14, 6, 16);
  scene.add(bounce);

  const key = new THREE.DirectionalLight(BONE, 3.4);
  key.position.set(world.position.x + 12, 22, 16);
  key.castShadow = !lowPower;
  if (key.shadow) {
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 60;
    key.shadow.camera.left = -20;
    key.shadow.camera.right = 20;
    key.shadow.camera.top = 20;
    key.shadow.camera.bottom = -20;
    key.shadow.bias = -0.0012;
  }
  scene.add(key);

  const rimSage = new THREE.PointLight(SAGE, 420, 44, 2);
  rimSage.position.set(world.position.x - 5.5, 3.5, 1);
  scene.add(rimSage);

  const rimClay = new THREE.PointLight(CLAY, 380, 46, 2);
  rimClay.position.set(world.position.x + 5.5, 2, -14);
  scene.add(rimClay);

  const deep = new THREE.PointLight(0xbfd6c8, 300, 60, 2);
  deep.position.set(world.position.x, 6, -46);
  scene.add(deep);

  const fill = new THREE.SpotLight(0xe8f0ea, 420, 40, 0.8, 0.7, 1.5);
  fill.position.set(world.position.x + 1, 15, 4);
  fill.target = core;
  scene.add(fill);

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const onMove = (e) => {
    const r = container.getBoundingClientRect();
    pointer.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    pointer.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
  };
  window.addEventListener('pointermove', onMove, { passive: true });

  let scrollY = 0;
  const onScroll = () => {
    scrollY = window.scrollY || 0;
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  const resize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  let visible = true;
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  io.observe(container);

  const clock = new THREE.Clock();
  let raf;

  const render = () => {
    raf = requestAnimationFrame(render);
    if (!visible) return;

    const t = clock.getElapsedTime();
    const speed = reduced ? 0.15 : 1;

    pointer.x += (pointer.tx - pointer.x) * 0.045;
    pointer.y += (pointer.ty - pointer.y) * 0.045;

    core.rotation.y = t * 0.075 * speed + pointer.x * 0.22;
    core.position.y = Math.sin(t * 0.55 * speed) * 0.16;
    arch.rotation.z = Math.sin(t * 0.3 * speed) * 0.09;
    ring.rotation.z = -t * 0.14 * speed;
    glassBlock.rotation.y = -t * 0.2 * speed;

    for (const m of floaters) {
      m.position.y += Math.sin(t * m.userData.speed + m.userData.offset) * 0.006 * speed;
      m.rotation.y += 0.0016 * m.userData.speed * speed;
    }

    dust.rotation.y = t * 0.012 * speed;
    dust.position.y = Math.sin(t * 0.16 * speed) * 0.7;

    const scrollFactor = Math.min(scrollY / (window.innerHeight || 900), 1);
    camera.position.x += (pointer.x * 1.8 - camera.position.x) * 0.05;
    camera.position.y += (4.6 - pointer.y * 1.2 + scrollFactor * 3.2 - camera.position.y) * 0.05;
    camera.position.z += (22 - scrollFactor * 6 - camera.position.z) * 0.05;
    camera.lookAt(world.position.x - 1.5, 3.4 - scrollFactor * 1.6, -10);

    rimSage.intensity = 220 + Math.sin(t * 0.9) * 60;
    rimClay.intensity = 170 + Math.cos(t * 1.2) * 45;

    renderer.render(scene, camera);
  };
  render();

  return {
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
