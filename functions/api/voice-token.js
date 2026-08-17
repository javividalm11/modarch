import { voiceSystemPrompt } from '../../shared/knowledge.js';

// Acuña un token efímero de la Live API. El navegador se conecta directo a
// Gemini con él, sin puente: Cloudflare no puede sostener un WebSocket server.
//
// El modelo, la voz y el prompt viajan dentro del token
// (bidiGenerateContentSetup), asi que el cliente no puede alterarlos.

const DEFAULT_MODEL = 'gemini-3.1-flash-live-preview';
const DEFAULT_VOICE = 'Kore';

// Margen para conectar. La llamada en si puede durar mas: el limite de sesion
// lo marca expireTime.
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

  // `name` llega como "auth_tokens/<hash>" y va literal en la URL: codificar la
  // barra rompe la autenticacion.
  return json({ token: data.name, expiresInMs: SESSION_MAX_MS });
}
