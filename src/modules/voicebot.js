const $ = (s) => document.querySelector(s);

const RECORDER_WORKLET = `
class Rec extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buf = new Float32Array(2048);
    this.n = 0;
  }
  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (!ch) return true;
    for (let i = 0; i < ch.length; i++) {
      this.buf[this.n++] = ch[i];
      if (this.n === this.buf.length) {
        this.port.postMessage(this.buf.slice(0));
        this.n = 0;
      }
    }
    return true;
  }
}
registerProcessor('rec', Rec);
`;

const IN_RATE = 16000;
const OUT_RATE = 24000;

function toBase64(bytes) {
  let bin = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}

function fromBase64(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function resample(input, from, to) {
  if (from === to) return input;
  const ratio = from / to;
  const out = new Float32Array(Math.round(input.length / ratio));
  for (let i = 0; i < out.length; i++) {
    const pos = i * ratio;
    const idx = Math.floor(pos);
    const frac = pos - idx;
    const a = input[idx] ?? 0;
    const b = input[idx + 1] ?? a;
    out[i] = a + (b - a) * frac;
  }
  return out;
}

function floatToPcm16(input) {
  const out = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return out;
}

export function initVoicebot() {
  const panel = $('#voicePanel');
  if (!panel) return null;

  const els = {
    core: $('#voiceCore'),
    state: $('#voiceState'),
    headline: $('#voiceHeadline'),
    sub: $('#voiceSub'),
    timer: $('#voiceTimer'),
    hint: $('#voiceHint'),
    err: $('#voiceErr'),
    transcript: $('#voiceTranscript'),
    toggle: $('#voiceToggle'),
    mute: $('#voiceMute'),
    canvas: $('#voiceViz'),
  };

  const S = {
    ws: null,
    micCtx: null,
    outCtx: null,
    stream: null,
    node: null,
    analyserIn: null,
    analyserOut: null,
    outGain: null,
    playAt: 0,
    sources: new Set(),
    live: false,
    muted: false,
    speaking: false,
    startedAt: 0,
    timerId: null,
    raf: null,
    lastRole: null,
    lastLine: null,
  };

  function status(main, sub, head) {
    els.state.textContent = main;
    if (sub) els.sub.textContent = sub;
    if (head) els.headline.textContent = head;
  }

  function error(msg) {
    els.err.textContent = msg || '';
  }

  function line(role, text) {
    if (!text?.trim()) return;
    if (S.lastRole === role && S.lastLine) {
      S.lastLine.querySelector('p').textContent += text;
    } else {
      const el = document.createElement('div');
      el.className = `voice-line is-${role}`;
      el.innerHTML = `<span>${role === 'user' ? 'Tú' : 'Maia'}</span><p></p>`;
      el.querySelector('p').textContent = text;
      els.transcript.appendChild(el);
      S.lastRole = role;
      S.lastLine = el;
    }
    els.transcript.scrollTop = els.transcript.scrollHeight;
  }

  function tickTimer() {
    const s = Math.floor((Date.now() - S.startedAt) / 1000);
    els.timer.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  }

  // ── Visualizador ──
  const ctx2d = els.canvas.getContext('2d');
  const BARS = 72;

  function draw() {
    S.raf = requestAnimationFrame(draw);
    const w = els.canvas.width;
    const h = els.canvas.height;
    ctx2d.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const r0 = w * 0.29;

    let inData = null;
    let outData = null;
    if (S.analyserIn) {
      inData = new Uint8Array(S.analyserIn.frequencyBinCount);
      S.analyserIn.getByteFrequencyData(inData);
    }
    if (S.analyserOut) {
      outData = new Uint8Array(S.analyserOut.frequencyBinCount);
      S.analyserOut.getByteFrequencyData(outData);
    }

    const t = performance.now() / 1000;

    for (let i = 0; i < BARS; i++) {
      const a = (i / BARS) * Math.PI * 2 - Math.PI / 2;
      const bin = Math.floor((i / BARS) * 48) + 2;
      const inV = inData ? inData[bin] / 255 : 0;
      const outV = outData ? outData[bin] / 255 : 0;
      const idle = S.live ? 0.05 + Math.sin(t * 1.6 + i * 0.3) * 0.03 : 0.035 + Math.sin(t * 0.9 + i * 0.24) * 0.022;
      const v = Math.max(idle, outV * 0.85, inV * 0.6);

      const len = v * w * 0.19;
      const x1 = cx + Math.cos(a) * r0;
      const y1 = cy + Math.sin(a) * r0;
      const x2 = cx + Math.cos(a) * (r0 + len);
      const y2 = cy + Math.sin(a) * (r0 + len);

      const agentLoud = outV > inV;
      ctx2d.strokeStyle = agentLoud ? `rgba(162,95,56,${0.24 + v * 0.66})` : `rgba(78,114,89,${0.22 + v * 0.64})`;
      ctx2d.lineWidth = w * 0.011;
      ctx2d.lineCap = 'round';
      ctx2d.beginPath();
      ctx2d.moveTo(x1, y1);
      ctx2d.lineTo(x2, y2);
      ctx2d.stroke();
    }

    const pulse = outData ? outData.reduce((a, b) => a + b, 0) / outData.length / 255 : 0;
    els.core.style.transform = `scale(${1 + pulse * 0.16})`;
    panel.classList.toggle('is-listening', S.live && !S.speaking);
  }

  // ── Reproducción ──
  function playChunk(b64) {
    if (!S.outCtx) return;
    const bytes = fromBase64(b64);
    const pcm = new Int16Array(bytes.buffer, bytes.byteOffset, Math.floor(bytes.byteLength / 2));
    const f32 = new Float32Array(pcm.length);
    for (let i = 0; i < pcm.length; i++) f32[i] = pcm[i] / 0x8000;

    const buffer = S.outCtx.createBuffer(1, f32.length, OUT_RATE);
    buffer.copyToChannel(f32, 0);

    const src = S.outCtx.createBufferSource();
    src.buffer = buffer;
    src.connect(S.outGain);

    const now = S.outCtx.currentTime;
    if (S.playAt < now + 0.06) S.playAt = now + 0.06;
    src.start(S.playAt);
    S.playAt += buffer.duration;

    S.speaking = true;
    S.sources.add(src);
    src.onended = () => {
      S.sources.delete(src);
      if (!S.sources.size) S.speaking = false;
    };
  }

  function stopPlayback() {
    for (const src of S.sources) {
      try { src.stop(); } catch { /* ya detenido */ }
    }
    S.sources.clear();
    S.playAt = 0;
    S.speaking = false;
  }

  // ── Llamada ──
  async function start() {
    error('');
    els.toggle.disabled = true;
    status('Conectando…', 'Preparando la línea', 'Conectando');

    try {
      S.stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
    } catch {
      els.toggle.disabled = false;
      status('Sin micrófono', 'Permiso denegado', 'Habla con Maia');
      error('Necesitamos permiso de micrófono para la llamada. Actívalo en el candado de la barra de direcciones y vuelve a intentar.');
      return;
    }

    try {
      S.micCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: IN_RATE });
      S.outCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: OUT_RATE });
      await S.micCtx.resume();
      await S.outCtx.resume();

      S.outGain = S.outCtx.createGain();
      S.analyserOut = S.outCtx.createAnalyser();
      S.analyserOut.fftSize = 256;
      S.outGain.connect(S.analyserOut);
      S.analyserOut.connect(S.outCtx.destination);

      const source = S.micCtx.createMediaStreamSource(S.stream);
      S.analyserIn = S.micCtx.createAnalyser();
      S.analyserIn.fftSize = 256;
      source.connect(S.analyserIn);

      const blob = new Blob([RECORDER_WORKLET], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      await S.micCtx.audioWorklet.addModule(url);
      URL.revokeObjectURL(url);

      S.node = new AudioWorkletNode(S.micCtx, 'rec');
      S.node.port.onmessage = (e) => {
        if (S.muted || !S.live || S.ws?.readyState !== WebSocket.OPEN) return;
        const pcm = floatToPcm16(resample(e.data, S.micCtx.sampleRate, IN_RATE));
        S.ws.send(JSON.stringify({ type: 'audio', data: toBase64(new Uint8Array(pcm.buffer)) }));
      };
      source.connect(S.node);
      S.node.connect(S.micCtx.destination);
    } catch (err) {
      console.error(err);
      els.toggle.disabled = false;
      error('Tu navegador no pudo iniciar el audio. Prueba con Chrome o Edge actualizados.');
      return cleanup();
    }

    const proto = location.protocol === 'https:' ? 'wss' : 'ws';
    S.ws = new WebSocket(`${proto}://${location.host}/ws/voice`);

    S.ws.onopen = () => status('Enlazando con Maia…', 'Un momento', 'Conectando');

    S.ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);

      if (msg.type === 'ready') {
        S.live = true;
        panel.classList.add('is-live');
        S.startedAt = Date.now();
        S.timerId = setInterval(tickTimer, 500);
        els.timer.hidden = false;
        els.mute.hidden = false;
        els.toggle.disabled = false;
        els.toggle.textContent = 'Colgar';
        els.toggle.classList.remove('is-clay');
        els.hint.textContent = 'Habla con normalidad. Maia te escucha y puede interrumpirse si hablas encima.';
        status('En llamada', 'Habla cuando quieras', 'Estás en llamada');
      } else if (msg.type === 'audio') {
        playChunk(msg.data);
      } else if (msg.type === 'interrupted') {
        stopPlayback();
      } else if (msg.type === 'transcript') {
        line(msg.role, msg.text);
      } else if (msg.type === 'turnComplete') {
        S.lastRole = null;
      } else if (msg.type === 'error') {
        error(msg.message);
      } else if (msg.type === 'ended') {
        error(msg.reason);
        stop();
      }
    };

    S.ws.onerror = () => error('Se perdió la conexión con el servidor de voz.');
    S.ws.onclose = () => {
      if (S.live) stop();
      else {
        els.toggle.disabled = false;
        status('Lista para conversar', 'Consultas, cotizaciones y citas', 'Habla con Maia');
      }
    };
  }

  function cleanup() {
    S.node?.port?.close?.();
    S.node?.disconnect?.();
    S.stream?.getTracks().forEach((t) => t.stop());
    S.micCtx?.close?.().catch(() => {});
    S.outCtx?.close?.().catch(() => {});
    S.node = S.stream = S.micCtx = S.outCtx = S.analyserIn = S.analyserOut = null;
  }

  function stop() {
    if (S.ws?.readyState === WebSocket.OPEN) S.ws.send(JSON.stringify({ type: 'hangup' }));
    S.ws?.close();
    S.ws = null;
    S.live = false;
    S.muted = false;
    clearInterval(S.timerId);
    stopPlayback();
    cleanup();

    els.timer.hidden = true;
    els.mute.hidden = true;
    els.mute.classList.remove('is-muted');
    els.toggle.textContent = 'Llamar a Maia';
    els.toggle.classList.add('is-clay');
    els.toggle.disabled = false;
    els.hint.textContent = 'Responde en español sobre servicios, precios por m², plazos y disponibilidad. Necesita permiso de micrófono.';
    status('Conversación finalizada', 'Consultas, cotizaciones y citas', 'Habla con Maia');
    panel.classList.remove('is-listening');
    panel.classList.remove('is-live');
  }

  els.toggle.addEventListener('click', () => (S.live || S.ws ? stop() : start()));

  els.mute.addEventListener('click', () => {
    S.muted = !S.muted;
    els.mute.classList.toggle('is-muted', S.muted);
    els.mute.setAttribute('aria-label', S.muted ? 'Activar micrófono' : 'Silenciar micrófono');
    status(S.muted ? 'Micrófono silenciado' : 'En llamada');
  });

  draw();

  return {
    open() {
      panel.classList.add('is-open');
    },
    close() {
      panel.classList.remove('is-open');
      if (S.live || S.ws) stop();
    },
    isLive: () => S.live,
  };
}
