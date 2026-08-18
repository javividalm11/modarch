import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import WebSocket from 'ws';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SRC_REL = (process.argv[2] || 'source/scroll3d').replace(/\\/g, '/');
const MAX_W = Number(process.argv[3]) || 1600;
const QUALITY = Number(process.argv[4]) || 0.82;

const SRC_DIR = path.join(ROOT, SRC_REL);
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };
const OUT = path.join(ROOT, 'public', 'assets', 'frames');
const PORT = 9377;

// Orden natural: v2 va antes que v10
const files = fs
  .readdirSync(SRC_DIR)
  .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
  .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));

if (!files.length) {
  console.error(`No hay imágenes en ${SRC_REL}`);
  process.exit(1);
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

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
    `--user-data-dir=${path.join(ROOT, 'node_modules', '.cache', 'opt-profile')}`,
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
await send('Runtime.enable');

console.log(`Optimizando ${files.length} imágenes · máx ${MAX_W}px · webp q${Math.round(QUALITY * 100)}\n`);

let before = 0;
let after = 0;

for (let i = 0; i < files.length; i++) {
  const file = path.join(SRC_DIR, files[i]);
  const raw = fs.readFileSync(file);
  before += raw.length;
  const mime = MIME[path.extname(files[i]).toLowerCase()] || 'image/png';
  const url = `data:${mime};base64,${raw.toString('base64')}`;

  const expr = `
    (async () => {
      const img = new Image();
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = ${JSON.stringify(url)}; });
      const scale = Math.min(1, ${MAX_W} / img.naturalWidth);
      const w = Math.round(img.naturalWidth * scale);
      const h = Math.round(img.naturalHeight * scale);
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      const x = c.getContext('2d');
      x.imageSmoothingQuality = 'high';
      x.drawImage(img, 0, 0, w, h);
      return c.toDataURL('image/webp', ${QUALITY}).split(',')[1] + '|' + w + 'x' + h;
    })()`;

  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  if (!r.result?.value) {
    console.error(`  no se pudo procesar ${files[i]}`);
    ws.close();
    chrome.kill();
    process.exit(1);
  }

  const [b64, dims] = r.result.value.split('|');
  const buf = Buffer.from(b64, 'base64');
  after += buf.length;
  const name = `seq-${String(i + 1).padStart(4, '0')}.webp`;
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log(`  ${files[i]}  →  ${name}   ${dims}   ${Math.round(buf.length / 1024)} KB`);
}

const mb = (n) => (n / 1024 / 1024).toFixed(2);
console.log(`\nListo · ${mb(before)} MB → ${mb(after)} MB  (−${Math.round((1 - after / before) * 100)}%)`);
console.log('Salida: public/assets/frames/');

ws.close();
chrome.kill();
process.exit(0);
