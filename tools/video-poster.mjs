/**
 * Extrae un fotograma de un vídeo y lo guarda como póster WebP.
 * Requiere el servidor de desarrollo corriendo.
 *
 *   node tools/video-poster.mjs [rutaVideo] [segundo] [salida] [ancho] [calidad] [urlBase]
 *   npm run poster
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import WebSocket from 'ws';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VIDEO = process.argv[2] || '/assets/video/modarch-nosotros.mp4';
const AT = Number(process.argv[3]) || 2.5;
const OUT_NAME = process.argv[4] || 'about-poster.webp';
const MAX_W = Number(process.argv[5]) || 1200;
const QUALITY = Number(process.argv[6]) || 0.82;
const BASE = process.argv[7] || 'http://localhost:5174';
const PORT = 9401;

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
    `--user-data-dir=${path.join(ROOT, 'node_modules', '.cache', 'poster-profile')}`,
    '--autoplay-policy=no-user-gesture-required',
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

const { targetId } = await send('Target.createTarget', { url: `${BASE}/` }, false);
({ sessionId } = await send('Target.attachToTarget', { targetId, flatten: true }, false));
await send('Runtime.enable');
await sleep(1500);

const expr = `
  (async () => {
    const v = document.createElement('video');
    v.muted = true;
    v.playsInline = true;
    v.crossOrigin = 'anonymous';
    v.src = ${JSON.stringify(VIDEO)};
    await new Promise((res, rej) => {
      v.onloadedmetadata = res;
      v.onerror = () => rej(new Error('no se pudo cargar el vídeo'));
    });
    v.currentTime = Math.min(${AT}, Math.max(0, v.duration - 0.2));
    await new Promise((res) => { v.onseeked = res; });
    const scale = Math.min(1, ${MAX_W} / v.videoWidth);
    const w = Math.round(v.videoWidth * scale);
    const h = Math.round(v.videoHeight * scale);
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    c.getContext('2d').drawImage(v, 0, 0, w, h);
    return c.toDataURL('image/webp', ${QUALITY}).split(',')[1] + '|' + w + 'x' + h + '|' + v.duration.toFixed(1);
  })()`;

const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
if (!r.result?.value) {
  console.error(`No se pudo extraer el fotograma. ¿Está el servidor en ${BASE}?`);
  ws.close();
  chrome.kill();
  process.exit(1);
}

const [b64, dims, dur] = r.result.value.split('|');
const buf = Buffer.from(b64, 'base64');
fs.writeFileSync(path.join(ROOT, 'public', 'assets', 'img', OUT_NAME), buf);

console.log(`${OUT_NAME} · segundo ${AT} de ${dur}s · ${dims} · ${Math.round(buf.length / 1024)} KB`);

ws.close();
chrome.kill();
process.exit(0);
