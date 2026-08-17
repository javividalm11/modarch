// SOLO DESARROLLO. En producción manda Cloudflare (functions/api/chat.js).
// Sobrevive porque el voicebot aún necesita el puente WebSocket de voice.js.
import 'dotenv/config';
import http from 'node:http';
import express from 'express';
import cors from 'cors';
import { chatSystemPrompt } from '../shared/knowledge.js';
import { attachVoiceBridge } from './voice.js';

const PORT = Number(process.env.PORT) || 8787;
const API_KEY = process.env.GEMINI_API_KEY || '';
const CHAT_MODEL = process.env.GEMINI_CHAT_MODEL || 'gemini-3.6-flash';

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '256kb' }));
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || true }));

// Límite simple por IP para las rutas de IA
const buckets = new Map();
function rateLimit(max, windowMs) {
  return (req, res, next) => {
    const ip = req.ip || 'anon';
    const now = Date.now();
    const b = buckets.get(ip) || { count: 0, reset: now + windowMs };
    if (now > b.reset) {
      b.count = 0;
      b.reset = now + windowMs;
    }
    b.count++;
    buckets.set(ip, b);
    if (b.count > max) return res.status(429).json({ error: 'Demasiadas solicitudes. Intenta en un minuto.' });
    next();
  };
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    chat: Boolean(API_KEY),
    voice: Boolean(API_KEY),
    chatModel: CHAT_MODEL,
    liveModel: process.env.GEMINI_LIVE_MODEL || 'gemini-3.1-flash-live-preview',
  });
});

app.post('/api/chat', rateLimit(30, 60_000), async (req, res) => {
  if (!API_KEY) {
    return res.status(503).json({ error: 'Falta configurar GEMINI_API_KEY en el servidor.' });
  }

  const history = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const contents = history
    .filter((m) => m && typeof m.text === 'string' && m.text.trim())
    .slice(-16)
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m.text).slice(0, 4000) }],
    }));

  if (!contents.length) return res.status(400).json({ error: 'Mensaje vacío.' });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${CHAT_MODEL}:streamGenerateContent?alt=sse`;

  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const send = (event, data) => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

  // Se escucha en `res`, no en `req`: desde Node 16 `req` emite 'close' al
  // acabar de leer el cuerpo y abortaría antes del primer token
  const controller = new AbortController();
  res.on('close', () => controller.abort());

  const payload = JSON.stringify({
    contents,
    systemInstruction: { parts: [{ text: chatSystemPrompt() }] },
    generationConfig: {
      temperature: 0.75,
      topP: 0.95,
      maxOutputTokens: 1200,
      // Sin esto los modelos con razonamiento gastan el presupuesto pensando
      thinkingConfig: { thinkingLevel: 'low' },
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
    ],
  });

  // La API devuelve 500 transitorios con cierta frecuencia: se reintenta
  const call = async () => {
    let last;
    for (let attempt = 0; attempt < 3; attempt++) {
      const r = await fetch(url, {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': API_KEY },
        body: payload,
      });
      if (r.ok && r.body) return r;
      last = r;
      if (r.status < 500) break;
      await new Promise((ok) => setTimeout(ok, 400 * (attempt + 1)));
    }
    return last;
  };

  try {
    const upstream = await call();

    if (!upstream?.ok || !upstream.body) {
      const detail = await upstream?.text().catch(() => '');
      console.error('[chat] upstream', upstream?.status, String(detail).slice(0, 300));
      send('error', { message: 'El asistente no está disponible en este momento.' });
      return res.end();
    }

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // Google separa los eventos con \r\n\r\n, no con \n\n
      const frames = buffer.split(/\r?\n\r?\n/);
      buffer = frames.pop() || '';

      for (const frame of frames) {
        for (const line of frame.split(/\r?\n/)) {
          if (!line.startsWith('data:')) continue;
          const raw = line.slice(5).trim();
          if (!raw || raw === '[DONE]') continue;
          try {
            const json = JSON.parse(raw);
            const parts = json?.candidates?.[0]?.content?.parts || [];
            // Los modelos con razonamiento intercalan partes de pensamiento
            const text = parts.filter((p) => !p.thought).map((p) => p.text || '').join('');
            if (text) send('delta', { text });
          } catch {
            /* fragmento incompleto */
          }
        }
      }
    }

    send('done', { ok: true });
    res.end();
  } catch (err) {
    if (err?.name !== 'AbortError') {
      console.error('[chat]', err);
      send('error', { message: 'Se cortó la conexión con el asistente.' });
    }
    res.end();
  }
});

const server = http.createServer(app);
attachVoiceBridge(server);

server.listen(PORT, () => {
  console.log(`\n  ModArch API  ·  http://localhost:${PORT}`);
  console.log(`  Chat  : ${API_KEY ? CHAT_MODEL : 'DESACTIVADO (falta GEMINI_API_KEY)'}`);
  console.log(`  Voz   : ${API_KEY ? process.env.GEMINI_LIVE_MODEL || 'gemini-3.1-flash-live-preview' : 'DESACTIVADO'}`);
  console.log(`  Web   : http://localhost:5173  (npm run dev)\n`);
});
