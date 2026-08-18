import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import WebSocket from 'ws';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const PAGE = process.argv[2] || '/tools/quoter/room.html';
const OUT_NAME = process.argv[3] || 'quoter-room.webp';
const W = Number(process.argv[4]) || 1400;
const H = Number(process.argv[5]) || 1500;
const QUALITY = Number(process.argv[6]) || 86;
const BASE = process.argv[7] || 'http://localhost:5174';
const PORT = 9399;

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
    `--user-data-dir=${path.join(ROOT, 'node_modules', '.cache', 'quoter-profile')}`,
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
await send('Page.navigate', { url: `${BASE}${PAGE}` });

let ready = false;
for (let i = 0; i < 100 && !ready; i++) {
  await sleep(300);
  const r = await send('Runtime.evaluate', { expression: 'Boolean(window.__sceneReady)', returnByValue: true });
  ready = r.result.value === true;
}
if (!ready) {
  console.error(`La escena no cargó. ¿Está el servidor de desarrollo en ${BASE}?`);
  ws.close();
  chrome.kill();
  process.exit(1);
}

await sleep(500);
const { data } = await send('Page.captureScreenshot', { format: 'webp', quality: QUALITY, fromSurface: true });
const buf = Buffer.from(data, 'base64');
const out = path.join(ROOT, 'public', 'assets', 'img', OUT_NAME);
fs.writeFileSync(out, buf);

console.log(`${OUT_NAME} · ${W}x${H} · ${Math.round(buf.length / 1024)} KB`);
console.log(`Salida: public/assets/img/${OUT_NAME}`);

ws.close();
chrome.kill();
process.exit(0);
