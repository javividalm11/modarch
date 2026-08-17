/**
 * Renderiza la secuencia de frames de tools/sequence/scene.html a public/assets/frames/.
 * Requiere el servidor de desarrollo corriendo.
 *
 *   node tools/sequence/render.mjs [urlBase] [frames] [ancho] [alto] [calidad]
 *   node tools/sequence/render.mjs http://localhost:5174 72 1200 900 80
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import WebSocket from 'ws';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const BASE = process.argv[2] || 'http://localhost:5174';
const FRAMES = Number(process.argv[3]) || 72;
const W = Number(process.argv[4]) || 1200;
const H = Number(process.argv[5]) || 900;
const QUALITY = Number(process.argv[6]) || 80;

const OUT = path.join(ROOT, 'public', 'assets', 'frames');
const PORT = 9366;

const CHROME =
  process.platform === 'win32'
    ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
    : process.platform === 'darwin'
      ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      : 'google-chrome';

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const profile = path.join(ROOT, 'node_modules', '.cache', 'seq-profile');
const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    `--window-size=${W},${H}`,
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

const ws = new WebSocket(wsUrl, { maxPayload: 256 * 1024 * 1024 });
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

await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: `${BASE}/tools/sequence/scene.html` });

// Espera a que la escena declare que está lista
let ready = false;
for (let i = 0; i < 100 && !ready; i++) {
  await sleep(300);
  const r = await send('Runtime.evaluate', { expression: 'Boolean(window.__sceneReady)', returnByValue: true });
  ready = r.result.value === true;
}
if (!ready) {
  console.error('La escena no cargó. ¿Está corriendo el servidor de desarrollo en ' + BASE + '?');
  ws.close();
  chrome.kill();
  process.exit(1);
}

console.log(`Renderizando ${FRAMES} frames a ${W}x${H} (webp q${QUALITY})…`);
let bytes = 0;

for (let i = 0; i < FRAMES; i++) {
  const t = FRAMES === 1 ? 0 : i / (FRAMES - 1);
  await send('Runtime.evaluate', { expression: `window.setProgress(${t})` });
  const { data } = await send('Page.captureScreenshot', { format: 'webp', quality: QUALITY, fromSurface: true });
  const buf = Buffer.from(data, 'base64');
  bytes += buf.length;
  fs.writeFileSync(path.join(OUT, `seq-${String(i + 1).padStart(4, '0')}.webp`), buf);
  if ((i + 1) % 12 === 0 || i === FRAMES - 1) {
    process.stdout.write(`  ${i + 1}/${FRAMES}\n`);
  }
}

console.log(`\nListo · ${FRAMES} frames · ${(bytes / 1024 / 1024).toFixed(2)} MB total · ${Math.round(bytes / FRAMES / 1024)} KB por frame`);
console.log(`Salida: public/assets/frames/`);

ws.close();
chrome.kill();
process.exit(0);
