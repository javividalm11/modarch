/**
 * Genera el juego responsive del hero desde source/hero/hero-room.png.
 * Escribe los WebP en public/assets/img/ y el manifiesto que lee partials.mjs.
 * Nunca amplía por encima del ancho nativo: subir de ahí solo añade bytes.
 *
 *   node tools/hero.mjs [archivo] [calidad]
 *   npm run hero
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import WebSocket from 'ws';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, (process.argv[2] || 'source/hero/hero-room.png').replace(/\//g, path.sep));
const QUALITY = Number(process.argv[3]) || 0.86;

const OUT_DIR = path.join(ROOT, 'public', 'assets', 'img');
const MANIFEST = path.join(ROOT, 'shared', 'hero-image.json');
const BASE = 'hero-room';
const STEPS = [720, 1080, 1440, 2000, 2600, 3200];
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };
const PORT = 9378;

if (!fs.existsSync(SRC)) {
  console.error(`No existe ${path.relative(ROOT, SRC)}`);
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
    `--user-data-dir=${path.join(ROOT, 'node_modules', '.cache', 'hero-profile')}`,
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
  chrome.kill();
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

const bail = async (msg) => {
  console.error(msg);
  ws.close();
  chrome.kill();
  process.exit(1);
};

const { targetId } = await send('Target.createTarget', { url: 'about:blank' }, false);
({ sessionId } = await send('Target.attachToTarget', { targetId, flatten: true }, false));
await send('Runtime.enable');

const raw = fs.readFileSync(SRC);
const url = `data:${MIME[path.extname(SRC).toLowerCase()] || 'image/png'};base64,${raw.toString('base64')}`;

const load = await send('Runtime.evaluate', {
  expression: `(async () => {
    const img = new Image();
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = ${JSON.stringify(url)}; });
    window.__hero = img;
    return img.naturalWidth + 'x' + img.naturalHeight;
  })()`,
  awaitPromise: true,
  returnByValue: true,
});
if (!load.result?.value) await bail('No se pudo decodificar la imagen.');

const [natW, natH] = load.result.value.split('x').map(Number);
const widths = [...new Set([...STEPS.filter((w) => w < natW), natW])];

console.log(`Origen ${path.relative(ROOT, SRC)} · ${natW}×${natH} · ${Math.round(raw.length / 1024)} KB`);
console.log(`Anchos: ${widths.join(', ')} · webp q${Math.round(QUALITY * 100)}\n`);

for (const f of fs.readdirSync(OUT_DIR)) {
  if (new RegExp(`^${BASE}-\\d+\\.webp$`).test(f)) fs.unlinkSync(path.join(OUT_DIR, f));
}

const out = [];
let total = 0;

for (const w of widths) {
  const h = Math.round((natH / natW) * w);
  const r = await send('Runtime.evaluate', {
    expression: `(() => {
      const c = document.createElement('canvas');
      c.width = ${w}; c.height = ${h};
      const x = c.getContext('2d');
      x.imageSmoothingQuality = 'high';
      x.drawImage(window.__hero, 0, 0, ${w}, ${h});
      return c.toDataURL('image/webp', ${QUALITY}).split(',')[1];
    })()`,
    returnByValue: true,
  });
  if (!r.result?.value) await bail(`No se pudo generar el ancho ${w}.`);

  const buf = Buffer.from(r.result.value, 'base64');
  total += buf.length;
  const name = `${BASE}-${w}.webp`;
  fs.writeFileSync(path.join(OUT_DIR, name), buf);
  out.push({ name, w, h, bytes: buf.length });
  console.log(`  ${name.padEnd(24)} ${String(w).padStart(4)}×${String(h).padEnd(4)}  ${String(Math.round(buf.length / 1024)).padStart(4)} KB`);
}

const largest = out[out.length - 1];
fs.copyFileSync(path.join(OUT_DIR, largest.name), path.join(OUT_DIR, `${BASE}.webp`));

fs.writeFileSync(
  MANIFEST,
  JSON.stringify(
    {
      src: `/assets/img/${BASE}.webp`,
      srcset: out.map((o) => `/assets/img/${o.name} ${o.w}w`).join(', '),
      width: largest.w,
      height: largest.h,
      native: `${natW}x${natH}`,
    },
    null,
    2
  ) + '\n'
);

console.log(`\nListo · ${out.length} variantes · ${(total / 1024).toFixed(0)} KB en total`);
console.log(`Fallback: assets/img/${BASE}.webp  ·  manifiesto: shared/hero-image.json`);
if (natW < 2600) console.log(`\nAviso: el origen tiene ${natW}px. Para pantallas retina el hero pide ~3040px.`);

ws.close();
chrome.kill();
process.exit(0);
