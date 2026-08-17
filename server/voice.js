import { WebSocketServer, WebSocket } from 'ws';
import { voiceSystemPrompt } from './knowledge.js';

const LIVE_HOST =
  'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent';

const MAX_SESSION_MS = 10 * 60 * 1000;
const MAX_CONCURRENT = 8;

let active = 0;

export function attachVoiceBridge(server) {
  const wss = new WebSocketServer({ server, path: '/ws/voice', maxPayload: 2 * 1024 * 1024 });

  wss.on('connection', (client) => {
    const key = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_LIVE_MODEL || 'gemini-3.1-flash-live-preview';
    const voice = process.env.GEMINI_VOICE || 'Kore';

    const fail = (message) => {
      safeSend(client, { type: 'error', message });
      client.close();
    };

    if (!key) return fail('Falta configurar GEMINI_API_KEY en el servidor.');
    if (active >= MAX_CONCURRENT) return fail('Todas nuestras líneas de voz están ocupadas. Intenta en unos minutos.');

    active++;
    let closed = false;
    const queue = [];

    const upstream = new WebSocket(`${LIVE_HOST}?key=${encodeURIComponent(key)}`);

    const shutdown = (reason) => {
      if (closed) return;
      closed = true;
      active = Math.max(0, active - 1);
      clearTimeout(timer);
      if (reason) safeSend(client, { type: 'ended', reason });
      try { upstream.close(); } catch { /* ya cerrado */ }
      try { client.close(); } catch { /* ya cerrado */ }
    };

    const timer = setTimeout(() => shutdown('Se alcanzó el límite de 10 minutos por llamada.'), MAX_SESSION_MS);

    upstream.on('open', () => {
      upstream.send(
        JSON.stringify({
          setup: {
            model: `models/${model}`,
            generationConfig: {
              responseModalities: ['AUDIO'],
              temperature: 0.8,
              // Latencia baja: en una llamada no se puede esperar a que razone
              thinkingConfig: { thinkingLevel: 'low' },
              speechConfig: {
                languageCode: 'es-US',
                voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } },
              },
            },
            systemInstruction: { parts: [{ text: voiceSystemPrompt() }] },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            realtimeInputConfig: { automaticActivityDetection: {} },
          },
        })
      );
      while (queue.length) upstream.send(queue.shift());
    });

    upstream.on('message', (raw) => {
      let msg;
      try {
        msg = JSON.parse(raw.toString('utf8'));
      } catch {
        return;
      }

      if (msg.setupComplete) {
        safeSend(client, { type: 'ready' });
        // Pide al agente que salude primero
        upstream.send(
          JSON.stringify({
            clientContent: {
              turns: [{ role: 'user', parts: [{ text: 'Saluda brevemente con esta identidad exacta: "Soy Maia, la asesora IA de ModArch". Nunca digas que te llamas Valeria ni uses otro nombre.' }] }],
              turnComplete: true,
            },
          })
        );
        return;
      }

      if (process.env.VOICE_DEBUG) {
        console.error('[voice] rx', JSON.stringify(msg).slice(0, 260));
      }

      const sc = msg.serverContent;
      if (!sc) {
        if (msg.goAway) shutdown('La sesión de voz expiró.');
        return;
      }

      if (sc.interrupted) safeSend(client, { type: 'interrupted' });

      if (sc.inputTranscription?.text) {
        safeSend(client, { type: 'transcript', role: 'user', text: sc.inputTranscription.text });
      }
      if (sc.outputTranscription?.text) {
        safeSend(client, { type: 'transcript', role: 'agent', text: sc.outputTranscription.text });
      }

      for (const part of sc.modelTurn?.parts || []) {
        const data = part.inlineData?.data;
        if (data && (part.inlineData.mimeType || '').startsWith('audio/')) {
          safeSend(client, { type: 'audio', data });
        }
        if (part.text) safeSend(client, { type: 'transcript', role: 'agent', text: part.text });
      }

      if (sc.turnComplete) safeSend(client, { type: 'turnComplete' });
    });

    upstream.on('error', (err) => {
      console.error('[voice] upstream', err?.message || err);
      safeSend(client, { type: 'error', message: 'No se pudo conectar con el agente de voz.' });
      shutdown();
    });

    upstream.on('close', (code) => {
      if (code && code !== 1000 && !closed) {
        safeSend(client, { type: 'error', message: `La llamada se cerró (código ${code}).` });
      }
      shutdown();
    });

    client.on('message', (raw) => {
      let msg;
      try {
        msg = JSON.parse(raw.toString('utf8'));
      } catch {
        return;
      }

      let payload = null;

      if (msg.type === 'audio' && typeof msg.data === 'string') {
        payload = JSON.stringify({
          realtimeInput: { audio: { data: msg.data, mimeType: 'audio/pcm;rate=16000' } },
        });
      } else if (msg.type === 'text' && typeof msg.text === 'string') {
        payload = JSON.stringify({
          clientContent: {
            turns: [{ role: 'user', parts: [{ text: msg.text.slice(0, 1500) }] }],
            turnComplete: true,
          },
        });
      } else if (msg.type === 'end') {
        payload = JSON.stringify({ realtimeInput: { audioStreamEnd: true } });
      } else if (msg.type === 'hangup') {
        return shutdown();
      }

      if (!payload) return;
      if (upstream.readyState === WebSocket.OPEN) upstream.send(payload);
      else if (upstream.readyState === WebSocket.CONNECTING && queue.length < 120) queue.push(payload);
    });

    client.on('close', () => shutdown());
    client.on('error', () => shutdown());
  });

  return wss;
}

function safeSend(ws, obj) {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(obj));
}
