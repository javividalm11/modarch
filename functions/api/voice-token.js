import { voiceSystemPrompt } from '../../shared/knowledge.js';

const DEFAULT_MODEL = 'gemini-3.1-flash-live-preview';
const DEFAULT_VOICE = 'Kore';

const CONNECT_WINDOW_MS = 2 * 60 * 1000;
const SESSION_MAX_MS = 15 * 60 * 1000;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

export async function onRequestPost({ env }) {
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) return json({ error: 'Falta configurar GEMINI_API_KEY en el servidor.' }, 503);

  const model = env.GEMINI_LIVE_MODEL || DEFAULT_MODEL;
  const voice = env.GEMINI_VOICE || DEFAULT_VOICE;
  const now = Date.now();

  const body = JSON.stringify({
    uses: 1,
    expireTime: new Date(now + SESSION_MAX_MS).toISOString(),
    newSessionExpireTime: new Date(now + CONNECT_WINDOW_MS).toISOString(),
    bidiGenerateContentSetup: {
      model: `models/${model}`,
      generationConfig: {
        responseModalities: ['AUDIO'],
        temperature: 0.8,
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
  });

  let res;
  try {
    res = await fetch('https://generativelanguage.googleapis.com/v1alpha/auth_tokens', {
      method: 'POST',
      headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
      body,
    });
  } catch (err) {
    console.error('[voice-token] red', err);
    return json({ error: 'No se pudo contactar con el servicio de voz.' }, 502);
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data?.name) {
    console.error('[voice-token] upstream', res.status, JSON.stringify(data).slice(0, 300));
    return json({ error: 'El servicio de voz no está disponible en este momento.' }, 502);
  }

  return json({ token: data.name, expiresInMs: SESSION_MAX_MS });
}
