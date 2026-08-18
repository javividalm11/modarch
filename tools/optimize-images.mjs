import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import WebSocket from 'ws';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry');

const ONLY = process.argv.slice(2).find((a) => !a.startsWith('--'));
const DIR = path.join(ROOT, 'public', 'assets', 'img', ONLY || '');
const PORT = 9388;

const MIN_BYTES = 90 * 1024; // por debajo de esto no vale la pena
const SKIP_DIRS = ['brand']; // logotipos y favicons: se dejan intactos

const rules = (rel) => {
  if (rel.includes('icons/')) return { maxW: 256, quality: 0.9 };
  if (rel.includes('clients/')) return { maxW: 600, quality: 0.9 };
  return { maxW: 1600, quality: 0.82 };
};

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.includes(entry.name)) walk(full, out);
    } else if (/\.(png|jpe?g|webp)$/i.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

const targets = walk(DIR)
  .filter((f) => fs.statSync(f).size > MIN_BYTES)
  .sort((a, b) => fs.statSync(b).size - fs.statSync(a).size);

if (!targets.length) {
  console.log('Nada que optimizar.');
  process.exit(0);
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
    `--user-data-dir=${path.join(ROOT, 'node_modules', '.cache', 'img-profile')}`,
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

const { targetId } = await send('Target.createTarget', { url: 'about:blank' }, false);
({ sessionId } = await send('Target.attachToTarget', { targetId, flatten: true }, false));
await send('Runtime.enable');

const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };
let before = 0;
let after = 0;
let changed = 0;

console.log(`${targets.length} imágenes por revisar${DRY ? ' (simulación)' : ''}\n`);

for (const file of targets) {
  const rel = path.relative(DIR, file).replace(/\\/g, '/');
  const raw = fs.readFileSync(file);
  const ext = path.extname(file).toLowerCase();
  const mime = MIME[ext];
  const { maxW, quality } = rules(rel);
  before += raw.length;

  const expr = `
    (async () => {
      const img = new Image();
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = "data:${mime};base64,${raw.toString('base64')}"; });
      const scale = Math.min(1, ${maxW} / img.naturalWidth);
      const w = Math.round(img.naturalWidth * scale);
      const h = Math.round(img.naturalHeight * scale);
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      const x = c.getContext('2d');
      x.imageSmoothingQuality = 'high';
      x.drawImage(img, 0, 0, w, h);
      return c.toDataURL("${mime}", ${quality}).split(',')[1] + '|' + w + 'x' + h;
    })()`;

  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  if (!r.result?.value) {
    console.log(`  ✕ ${rel} (no se pudo leer)`);
    after += raw.length;
    continue;
  }

  const [b64, dims] = r.result.value.split('|');
  const buf = Buffer.from(b64, 'base64');

  // Solo se reemplaza si el resultado pesa menos
  if (buf.length >= raw.length) {
    after += raw.length;
    continue;
  }

  if (!DRY) fs.writeFileSync(file, buf);
  after += buf.length;
  changed++;
  console.log(
    `  ${rel}  ${Math.round(raw.length / 1024)} → ${Math.round(buf.length / 1024)} KB  (${dims})`
  );
}

const mb = (n) => (n / 1024 / 1024).toFixed(2);
console.log(`\n${changed} optimizadas · ${mb(before)} MB → ${mb(after)} MB  (−${Math.round((1 - after / before) * 100)}%)`);

ws.close();
chrome.kill();
process.exit(0);
