
export function onRequestGet({ env }) {
  return new Response(
    JSON.stringify({
      ok: true,
      chat: Boolean(env.GEMINI_API_KEY),
      chatModel: env.GEMINI_CHAT_MODEL || 'gemini-3.6-flash',
    }),
    { headers: { 'Content-Type': 'application/json; charset=utf-8' } }
  );
}
