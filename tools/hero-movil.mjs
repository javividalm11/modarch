import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import WebSocket from 'ws';

/**
 * Convierte el retrato del hero movil a WebP en los anchos que pide el marco.
 *
 * El marco vertical mide entre 336 y 406 px de CSS, asi que con pantallas de
 * 2x y 3x hacen falta hasta 1218 px. El original tiene 1122, que es el techo.
 *
 * Uso:  node tools/hero-movil.mjs
 */

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'public', 'assets', 'img');
const ORIGEN = path.join(DIR, 'heromovil.png');
const ANCHOS = [720, 1122];
const CALIDAD = 0.82;
const PORT = 9391;

if (!fs.existsSync(ORIGEN)) {
  console.error('No existe', ORIGEN);
  process.exit(1);
}

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
    `--user-data-dir=${path.join(ROOT, 'node_modules', '.cache', 'hero-movil')}`,
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

const url = `data:image/png;base64,${fs.readFileSync(ORIGEN).toString('base64')}`;
const original = Math.round(fs.statSync(ORIGEN).size / 1024);
console.log(`heromovil.png  ${original} KB\n`);

for (const ancho of ANCHOS) {
  const r = await send('Runtime.evaluate', {
    expression: `
(async () => {
  const img = new Image();
  await new Promise((ok, no) => { img.onload = ok; img.onerror = no; img.src = ${JSON.stringify(url)}; });
  const w = Math.min(${ancho}, img.naturalWidth);
  const h = Math.round(img.naturalHeight * (w / img.naturalWidth));
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const x = c.getContext('2d');
  x.imageSmoothingQuality = 'high';
  x.drawImage(img, 0, 0, w, h);
  return c.toDataURL('image/webp', ${CALIDAD}).split(',')[1] + '|' + w + 'x' + h;
})()`,
    awaitPromise: true,
    returnByValue: true,
  });

  const [b64, dims] = r.result.value.split('|');
  const buf = Buffer.from(b64, 'base64');
  const nombre = ancho === Math.max(...ANCHOS) ? 'heromovil.webp' : `heromovil-${ancho}.webp`;
  fs.writeFileSync(path.join(DIR, nombre), buf);
  console.log(`  ${nombre.padEnd(22)} ${dims.padEnd(10)} ${Math.round(buf.length / 1024)} KB`);
}

ws.close();
chrome.kill();
