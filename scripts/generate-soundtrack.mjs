// Генерация саундтрека для KiprPromo: тёплый эмбиент-пад, «морской» шум,
// вуши на переходах сцен и колокольный акцент на CTA.
// Держать тайминги в синхроне с src/KiprPromo/timeline.ts:
//   FPS=30, SCENES=[120,150,145,125], TRANSITION=18 → длительность 486 кадров (16.2s),
//   переходы центрированы на кадрах 111, 243, 370.
import { writeFileSync, mkdirSync } from "node:fs";

const SR = 44100;
const FPS = 30;
const DURATION_FRAMES = 486;
const DUR = DURATION_FRAMES / FPS;
const N = Math.round(SR * DUR);

const L = new Float64Array(N);
const R = new Float64Array(N);

// --- утилиты ---------------------------------------------------------------
const TAU = Math.PI * 2;
let seed = 1;
const rand = () => {
  // xorshift — детерминированный шум
  seed ^= seed << 13;
  seed ^= seed >>> 17;
  seed ^= seed << 5;
  return ((seed >>> 0) / 4294967295) * 2 - 1;
};

// Однополюсный lowpass с изменяемой частотой среза.
const makeLowpass = () => {
  let y = 0;
  return (x, cutoff) => {
    const a = Math.min(1, (TAU * cutoff) / SR);
    y += a * (x - y);
    return y;
  };
};

const smoothstep = (a, b, t) => {
  const x = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
};

// --- 1. Эмбиент-пад: детюненные синусы (Am add9 колорит) -------------------
const padFreqs = [55, 110, 164.81, 220, 246.94];
const padDetune = [0, 0.4, -0.6, 0.7, -0.3];
for (let i = 0; i < N; i++) {
  const t = i / SR;
  let s = 0;
  for (let v = 0; v < padFreqs.length; v++) {
    const f = padFreqs[v];
    const lfo = 1 + 0.002 * Math.sin(TAU * 0.11 * t + v);
    s += Math.sin(TAU * f * lfo * t) * (1 / (v + 2));
    s += Math.sin(TAU * (f + padDetune[v]) * t + v) * (0.6 / (v + 2));
  }
  // Медленное «дыхание» громкости пада
  const breathe = 0.75 + 0.25 * Math.sin(TAU * (1 / 8) * t - Math.PI / 2);
  const master = smoothstep(0, 1.2, t) * (1 - smoothstep(DUR - 1.6, DUR, t));
  const v = s * 0.045 * breathe * master;
  L[i] += v * (1 + 0.06 * Math.sin(TAU * 0.07 * t));
  R[i] += v * (1 - 0.06 * Math.sin(TAU * 0.07 * t));
}

// --- 2. «Море»: фильтрованный шум с медленной волной ------------------------
{
  const lpL = makeLowpass();
  const lpR = makeLowpass();
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    const wave = 0.5 + 0.5 * Math.sin(TAU * (1 / 7) * t);
    const cutoff = 300 + 500 * wave;
    const master = smoothstep(0, 2, t) * (1 - smoothstep(DUR - 1.6, DUR, t));
    const n = rand();
    L[i] += lpL(n, cutoff) * 0.05 * (0.5 + 0.5 * wave) * master;
    R[i] += lpR(rand(), cutoff * 1.1) * 0.05 * (0.5 + 0.5 * wave) * master;
  }
}

// --- 3. Вуши на переходах ---------------------------------------------------
const whooshCenters = [111, 243, 370].map((f) => f / FPS);
for (const c of whooshCenters) {
  const lp = makeLowpass();
  const start = c - 0.65;
  const end = c + 0.45;
  const i0 = Math.max(0, Math.round(start * SR));
  const i1 = Math.min(N, Math.round(end * SR));
  for (let i = i0; i < i1; i++) {
    const t = i / SR;
    const p = (t - start) / (end - start); // 0..1
    // Нарастание к центру, резкий спад после
    const env = p < 0.6 ? smoothstep(0, 0.6, p) : 1 - smoothstep(0.6, 1, p);
    const cutoff = 200 + 2600 * Math.pow(p, 2.2);
    const v = lp(rand(), cutoff) * env * env * 0.34;
    const pan = Math.sin(p * Math.PI - Math.PI / 2) * 0.35; // лёгкий проезд слева направо
    L[i] += v * (1 - pan);
    R[i] += v * (1 + pan);
  }
}

// --- 4. Колокольный акцент на появлении лого в CTA -------------------------
{
  const t0 = (361 + 0.7 * FPS) / FPS; // чуть после начала CTA-сцены (кадр 361)
  const i0 = Math.round(t0 * SR);
  const freqs = [440, 660, 880, 1320];
  for (let i = i0; i < Math.min(N, i0 + SR * 3); i++) {
    const t = (i - i0) / SR;
    let s = 0;
    for (let h = 0; h < freqs.length; h++) {
      s += Math.sin(TAU * freqs[h] * t) * Math.exp(-t * (1.6 + h * 1.2)) * (1 / (h + 1));
    }
    const v = s * 0.11 * Math.exp(-t * 0.9);
    L[i] += v;
    R[i] += v * 0.92;
  }
}

// --- 5. Мягкий tick на появление каждой карточки ---------------------------
{
  // Сцена карточек начинается на кадре 234; карточки — на локальных 27/42/57.
  const cardStarts = [234 + 27, 234 + 42, 234 + 57].map((f) => f / FPS);
  for (const ts of cardStarts) {
    const i0 = Math.round(ts * SR);
    for (let i = i0; i < Math.min(N, i0 + SR * 0.25); i++) {
      const t = (i - i0) / SR;
      const v =
        (Math.sin(TAU * 1200 * t) * 0.4 + Math.sin(TAU * 1800 * t) * 0.2) *
        Math.exp(-t * 40) *
        0.12;
      L[i] += v;
      R[i] += v;
    }
  }
}

// --- нормализация + WAV -----------------------------------------------------
let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const gain = peak > 0 ? 0.85 / peak : 1;

const bytesPerSample = 2;
const dataSize = N * 2 * bytesPerSample;
const buf = Buffer.alloc(44 + dataSize);
buf.write("RIFF", 0);
buf.writeUInt32LE(36 + dataSize, 4);
buf.write("WAVE", 8);
buf.write("fmt ", 12);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20); // PCM
buf.writeUInt16LE(2, 22); // stereo
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 2 * bytesPerSample, 28);
buf.writeUInt16LE(2 * bytesPerSample, 32);
buf.writeUInt16LE(16, 34);
buf.write("data", 36);
buf.writeUInt32LE(dataSize, 40);
for (let i = 0; i < N; i++) {
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * gain)) * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * gain)) * 32767), 46 + i * 4);
}

mkdirSync("public/audio", { recursive: true });
writeFileSync("public/audio/soundtrack.wav", buf);
console.log(`OK: public/audio/soundtrack.wav (${DUR.toFixed(1)}s, ${(buf.length / 1e6).toFixed(1)} MB)`);
