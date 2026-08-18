import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import WebSocket from 'ws';


const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, process.argv[2] || 'public/assets/img/team');
const D_LOCAL = Number(process.argv[3]) || 12;
const D_GLOBAL = Number(process.argv[4]) || 88;
const PORT = 9388;

const files = process.argv.slice(5).length
  ? process.argv.slice(5)
  : ['CEO2.png', 'Alonso.png', 'leyla.png'];

const CHROME =
  process.platform === 'win32'
    ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
    : process.platform === 'darwin'
      ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      : 'google-chrome';

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${path.join(ROOT, 'node_modules', '.cache', 'cut-profile')}`,
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ],
  { stdio: 'ignore' }
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let wsUrl;
for (let i = 0; i < 80 && !wsUrl; i++) {
  try {
    wsUrl = (await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json()).webSocketDebuggerUrl;
  } catch {
    await sleep(300);
  }
}
if (!wsUrl) {
  console.error('No se pudo iniciar Chrome.');
  process.exit(1);
}

const ws = new WebSocket(wsUrl, { maxPayload: 512 * 1024 * 1024 });
await new Promise((r) => ws.on('open', r));

let id = 0;
let sessionId = null;
const pending = new Map();

ws.on('message', (raw) => {
  const m = JSON.parse(raw.toString());
  if (!m.id || !pending.has(m.id)) return;
  const { resolve, reject } = pending.get(m.id);
  pending.delete(m.id);
  m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result);
});

const send = (method, params = {}, useSession = true) => {
  const msg = { id: ++id, method, params };
  if (useSession && sessionId) msg.sessionId = sessionId;
  return new Promise((resolve, reject) => {
    pending.set(msg.id, { resolve, reject });
    ws.send(JSON.stringify(msg));
  });
};

const { targetId } = await send('Target.createTarget', { url: 'about:blank' }, false);
({ sessionId } = await send('Target.attachToTarget', { targetId, flatten: true }, false));
await send('Runtime.enable');

const ALGO = (url, dLocal, dGlobal) => `
(async () => {
  const img = new Image();
  await new Promise((ok, no) => { img.onload = ok; img.onerror = no; img.src = ${JSON.stringify(url)}; });

  const w = img.naturalWidth, h = img.naturalHeight;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const x = c.getContext('2d', { willReadFrequently: true });
  x.drawImage(img, 0, 0);
  const data = x.getImageData(0, 0, w, h);
  const p = data.data;

  const at = (i) => [p[i], p[i + 1], p[i + 2]];
  const dist = (a, b) => Math.abs(a[0]-b[0]) + Math.abs(a[1]-b[1]) + Math.abs(a[2]-b[2]);

  // Referencia de fondo: mediana aproximada de las cuatro esquinas
  const muestras = [];
  for (const [ox, oy] of [[0,0],[w-20,0],[0,h-20],[w-20,h-20]]) {
    for (let y = 0; y < 20; y++) for (let xx = 0; xx < 20; xx++) {
      muestras.push(at(((oy+y)*w + ox+xx) * 4));
    }
  }
  const ref = [0,1,2].map(k => Math.round(muestras.reduce((s,m)=>s+m[k],0) / muestras.length));

  // Saturacion de la referencia: si el fondo es un croma (magenta, verde...)
  // no hace falta contiguidad, basta la distancia de color. Eso ademas limpia
  // los huecos de fondo encerrados, a los que el relleno no llega desde el
  // borde.
  const sat = Math.max(...ref) - Math.min(...ref);
  const croma = sat > 90;

  const fondo = new Uint8Array(w*h);
  const cola = new Int32Array(w*h);
  let cab = 0, fin = 0;
  const push = (idx) => { if (!fondo[idx]) { fondo[idx] = 1; cola[fin++] = idx; } };

  for (let xx = 0; xx < w; xx++) {
    if (dist(at(xx*4), ref) <= ${dGlobal}) push(xx);
    const b = (h-1)*w + xx;
    if (dist(at(b*4), ref) <= ${dGlobal}) push(b);
  }
  for (let y = 0; y < h; y++) {
    const l = y*w, r = y*w + w-1;
    if (dist(at(l*4), ref) <= ${dGlobal}) push(l);
    if (dist(at(r*4), ref) <= ${dGlobal}) push(r);
  }

  if (croma) {
    // Clave de color: todo lo cercano al croma es fondo, este donde este
    for (let i = 0; i < w*h; i++) {
      if (dist(at(i*4), ref) <= 150) fondo[i] = 1;
    }
    cab = fin; // no hace falta propagar
  }

  while (cab < fin) {
    const idx = cola[cab++];
    const cx = idx % w, cy = (idx - cx) / w;
    const col = at(idx*4);
    const vecinos = [[1,0],[-1,0],[0,1],[0,-1]];
    for (const [dx, dy] of vecinos) {
      const nx = cx+dx, ny = cy+dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const nidx = ny*w + nx;
      if (fondo[nidx]) continue;
      const ncol = at(nidx*4);
      // Sigue el degradado del fondo (vecino parecido) pero se para en el
      // contorno, y nunca se aleja demasiado del color de fondo original
      if (dist(ncol, col) <= ${dLocal} && dist(ncol, ref) <= ${dGlobal}) push(nidx);
    }
  }

  // Alfa: 0 en el fondo, 255 en la figura
  for (let i = 0; i < w*h; i++) p[i*4+3] = fondo[i] ? 0 : 255;

  // Erosion: los pixeles del borde llevan croma mezclado y dejan un halo de
  // color. Quitar una franja de 2px lo elimina; a estos tamanos no se nota.
  if (croma) {
    for (let paso = 0; paso < 2; paso++) {
      const prev = Uint8Array.from(fondo);
      for (let y = 1; y < h-1; y++) for (let xx = 1; xx < w-1; xx++) {
        const i = y*w + xx;
        if (prev[i]) continue;
        if (prev[i-1] || prev[i+1] || prev[i-w] || prev[i+w]) fondo[i] = 1;
      }
    }
    for (let i = 0; i < w*h; i++) p[i*4+3] = fondo[i] ? 0 : 255;
  }

  // Suaviza solo el borde para que no quede en escalera
  const copia = new Uint8Array(w*h);
  for (let i = 0; i < w*h; i++) copia[i] = p[i*4+3];
  for (let y = 1; y < h-1; y++) for (let xx = 1; xx < w-1; xx++) {
    const i = y*w + xx;
    const a = copia[i];
    let borde = false;
    for (const d of [-1, 1, -w, w]) if (copia[i+d] !== a) { borde = true; break; }
    if (!borde) continue;
    let s = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) s += copia[i + dy*w + dx];
    p[i*4+3] = Math.round(s / 9);
  }

  x.putImageData(data, 0, 0);

  let recortados = 0;
  for (let i = 0; i < w*h; i++) if (fondo[i]) recortados++;

  return c.toDataURL('image/webp', 0.9).split(',')[1] + '|' + w + 'x' + h + '|' + Math.round(100*recortados/(w*h));
})()`;

console.log(`Recortando ${files.length} retratos · tolerancia vecino ${D_LOCAL} · global ${D_GLOBAL}\n`);

for (const file of files) {
  const src = path.join(DIR, file);
  if (!fs.existsSync(src)) {
    console.error(`  no existe ${file}`);
    continue;
  }
  const raw = fs.readFileSync(src);
  const url = `data:image/png;base64,${raw.toString('base64')}`;

  const r = await send('Runtime.evaluate', {
    expression: ALGO(url, D_LOCAL, D_GLOBAL),
    awaitPromise: true,
    returnByValue: true,
  });
  if (!r.result?.value) {
    console.error(`  fallo al procesar ${file}`);
    continue;
  }

  const [b64, dims, pct] = r.result.value.split('|');
  const buf = Buffer.from(b64, 'base64');
  const out = file.replace(/\.[^.]+$/, '') + '-cut.webp';
  fs.writeFileSync(path.join(DIR, out), buf);
  console.log(
    `  ${file}  →  ${out}   ${dims}   ${Math.round(buf.length / 1024)} KB   fondo recortado: ${pct}%`
  );
}

ws.close();
chrome.kill();
console.log('\nSalida en', path.relative(ROOT, DIR).replace(/\\/g, '/'));
