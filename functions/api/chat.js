import { chatSystemPrompt } from '../../shared/knowledge.js';

const DEFAULT_MODEL = 'gemini-3.6-flash';

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

export async function onRequestPost({ request, env, waitUntil }) {
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) return json({ error: 'Falta configurar GEMINI_API_KEY en el servidor.' }, 503);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Cuerpo inválido.' }, 400);
  }

  const history = Array.isArray(body?.messages) ? body.messages : [];
  const contents = history
    .filter((m) => m && typeof m.text === 'string' && m.text.trim())
    .slice(-16)
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m.text).slice(0, 4000) }],
    }));

  if (!contents.length) return json({ error: 'Mensaje vacío.' }, 400);

  const model = env.GEMINI_CHAT_MODEL || DEFAULT_MODEL;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`;

  const payload = JSON.stringify({
    contents,
    systemInstruction: { parts: [{ text: chatSystemPrompt() }] },
    generationConfig: {
      temperature: 0.75,
      topP: 0.95,
      maxOutputTokens: 1200,
      thinkingConfig: { thinkingLevel: 'low' },
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
    ],
  });

  const call = async () => {
    let last;
    for (let attempt = 0; attempt < 3; attempt++) {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: payload,
      });
      if (r.ok && r.body) return r;
      last = r;
      if (r.status < 500) break;
      await new Promise((ok) => setTimeout(ok, 400 * (attempt + 1)));
    }
    return last;
  };

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  const send = async (event, data) => {
    try {
      await writer.write(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      return true;
    } catch {
      return false;
    }
  };

  const pump = async () => {
    try {
      const upstream = await call();

      if (!upstream?.ok || !upstream.body) {
        const detail = await upstream?.text().catch(() => '');
        console.error('[chat] upstream', upstream?.status, String(detail).slice(0, 300));
        await send('error', { message: 'El asistente no está disponible en este momento.' });
        return;
      }

      const reader = upstream.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const frames = buffer.split(/\r?\n\r?\n/);
        buffer = frames.pop() || '';

        for (const frame of frames) {
          for (const line of frame.split(/\r?\n/)) {
            if (!line.startsWith('data:')) continue;
            const raw = line.slice(5).trim();
            if (!raw || raw === '[DONE]') continue;
            try {
              const parsed = JSON.parse(raw);
              const parts = parsed?.candidates?.[0]?.content?.parts || [];
              const text = parts.filter((p) => !p.thought).map((p) => p.text || '').join('');
              if (text && !(await send('delta', { text }))) return;
            } catch {
            }
          }
        }
      }

      await send('done', { ok: true });
    } catch (err) {
      console.error('[chat]', err);
      await send('error', { message: 'Se cortó la conexión con el asistente.' });
    } finally {
      try {
        await writer.close();
      } catch {
      }
    }
  };

  waitUntil(pump());

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
    },
  });
}
