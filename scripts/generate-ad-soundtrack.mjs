// Саундтрек для таргет-роликов (KiprAdRoute / KiprAdEntry).
// Синхрон с src/ads/timeline.ts: FPS=30, SCENES=[105,150,135,140], TRANSITION=18
// → длительность 476 кадров (15.87s), старты сцен 0/87/219/336,
// центры переходов 96/228/345.
import { writeFileSync, mkdirSync } from "node:fs";

const SR = 44100;
const FPS = 30;
const DURATION_FRAMES = 476;
const DUR = DURATION_FRAMES / FPS;
const N = Math.round(SR * DUR);
const TAU = Math.PI * 2;

const L = new Float64Array(N);
const R = new Float64Array(N);

let seed = 3;
const rand = () => {
  seed ^= seed << 13;
  seed ^= seed >>> 17;
  seed ^= seed << 5;
  return ((seed >>> 0) / 4294967295) * 2 - 1;
};
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
const fr = (f) => f / FPS; // кадр → секунды

// --- Гармония: Am → F → C → G, по 4 секунды --------------------------------
const CHORDS = [
  { root: 55.0, tones: [110, 164.81, 220, 261.63, 329.63] }, // Am
  { root: 43.65, tones: [87.31, 130.81, 174.61, 220, 261.63] }, // F
  { root: 65.41, tones: [130.81, 196, 261.63, 329.63, 392] }, // C
  { root: 49.0, tones: [98, 146.83, 196, 246.94, 293.66] }, // G
];
const CHORD_LEN = 4; // секунд на аккорд
const chordAt = (t) => CHORDS[Math.floor(t / CHORD_LEN) % CHORDS.length];

const BPM = 96;
const BEAT = 60 / BPM;

// --- 1. Пад с сайдчейн-пульсацией ------------------------------------------
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const ch = chordAt(t);
  let s = 0;
  for (let v = 0; v < ch.tones.length; v++) {
    const f = ch.tones[v];
    s += Math.sin(TAU * f * t) * (1 / (v + 2));
    s += Math.sin(TAU * (f * 1.003) * t + v) * (0.5 / (v + 2));
  }
  // Сайдчейн: мягкий провал громкости на каждую долю
  const beatPos = (t % BEAT) / BEAT;
  const duck = 1 - 0.16 * Math.exp(-beatPos * 9);
  // Кроссфейд между аккордами (устраняет щелчки на границах)
  const chPos = (t % CHORD_LEN) / CHORD_LEN;
  const edge = smoothstep(0, 0.04, chPos) * (1 - smoothstep(0.97, 1, chPos));
  const master = smoothstep(0, 0.9, t) * (1 - smoothstep(DUR - 0.9, DUR, t));
  const v = s * 0.05 * duck * (0.7 + 0.3 * edge) * master;
  L[i] += v * (1 + 0.07 * Math.sin(TAU * 0.09 * t));
  R[i] += v * (1 - 0.07 * Math.sin(TAU * 0.09 * t));
}

// --- 2. Суб-бас: корень аккорда, пульс на 1 и 3 доли -----------------------
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const ch = chordAt(t);
  const barPos = (t % (BEAT * 2)) / (BEAT * 2);
  const env = Math.exp(-barPos * 3.2) * smoothstep(0, 0.01, barPos);
  const master = smoothstep(0.3, 1.2, t) * (1 - smoothstep(DUR - 0.9, DUR, t));
  const v = Math.sin(TAU * ch.root * t) * env * 0.16 * master;
  L[i] += v;
  R[i] += v;
}

// --- 3. Мягкий арпеджио-пласк на восьмых -----------------------------------
{
  const eighth = BEAT / 2;
  const steps = Math.floor(DUR / eighth);
  for (let k = 0; k < steps; k++) {
    const t0 = k * eighth;
    const ch = chordAt(t0);
    const tone = ch.tones[(k * 2) % ch.tones.length] * 2; // октавой выше
    const i0 = Math.round(t0 * SR);
    const len = Math.min(N - i0, Math.round(SR * 0.5));
    const vel = 0.05 + 0.025 * Math.sin(k * 1.7); // лёгкая «человечность»
    for (let i = 0; i < len; i++) {
      const t = i / SR;
      const env = Math.exp(-t * 9) * smoothstep(0, 0.004, t);
      const v =
        (Math.sin(TAU * tone * t) + 0.35 * Math.sin(TAU * tone * 2 * t)) *
        env *
        vel;
      const pan = 0.25 * Math.sin(k * 0.9);
      L[i0 + i] += v * (1 - pan);
      R[i0 + i] += v * (1 + pan);
    }
  }
}

// --- 4. Вуши на переходах (96 / 228 / 345) ---------------------------------
for (const c of [96, 228, 345].map(fr)) {
  const lp = makeLowpass();
  const start = c - 0.7;
  const end = c + 0.4;
  const i0 = Math.max(0, Math.round(start * SR));
  const i1 = Math.min(N, Math.round(end * SR));
  for (let i = i0; i < i1; i++) {
    const t = i / SR;
    const p = (t - start) / (end - start);
    const env = p < 0.64 ? smoothstep(0, 0.64, p) : 1 - smoothstep(0.64, 1, p);
    const cutoff = 250 + 3200 * Math.pow(p, 2.4);
    const v = lp(rand(), cutoff) * env * env * 0.4;
    const pan = Math.sin(p * Math.PI - Math.PI / 2) * 0.4;
    L[i] += v * (1 - pan);
    R[i] += v * (1 + pan);
  }
}

// --- 5. Импакты (суб-удар + клик) на слэмах текста -------------------------
// Хуки: 0.45s, 1.0s; заголовок 3-й сцены: кадр 232; CTA-заголовок: кадр 351.
for (const ts of [0.45, 1.0, fr(232), fr(351)]) {
  const i0 = Math.round(ts * SR);
  for (let i = i0; i < Math.min(N, i0 + SR * 0.6); i++) {
    const t = (i - i0) / SR;
    const sweep = 92 * Math.exp(-t * 6) + 38;
    const body = Math.sin(TAU * sweep * t) * Math.exp(-t * 7) * 0.5;
    const click = rand() * Math.exp(-t * 220) * 0.22;
    const v = body + click;
    L[i] += v;
    R[i] += v * 0.94;
  }
}

// --- 6. Тики на остановках маршрута / сегментах (102 / 128 / 153) ----------
for (const f of [102, 128, 153]) {
  const i0 = Math.round(fr(f) * SR);
  for (let i = i0; i < Math.min(N, i0 + SR * 0.22); i++) {
    const t = (i - i0) / SR;
    const v =
      (Math.sin(TAU * 1400 * t) * 0.4 + Math.sin(TAU * 2100 * t) * 0.2) *
      Math.exp(-t * 46) *
      0.14;
    L[i] += v;
    R[i] += v;
  }
}

// --- 7. Райзер в CTA + колокол на появлении кнопки (кадр 369) --------------
{
  // Райзер: шум + восходящий тон в 1.6s перед переходом на CTA (кадр 345)
  const end = fr(345);
  const start = end - 1.6;
  const lp = makeLowpass();
  const i0 = Math.max(0, Math.round(start * SR));
  const i1 = Math.min(N, Math.round(end * SR));
  for (let i = i0; i < i1; i++) {
    const t = i / SR;
    const p = (t - start) / (end - start);
    const tone = 180 + 620 * p * p;
    const v =
      (lp(rand(), 400 + 2600 * p) * 0.5 + Math.sin(TAU * tone * t) * 0.18) *
      p *
      p *
      0.3;
    L[i] += v;
    R[i] += v;
  }
  // Колокол
  const b0 = Math.round(fr(369) * SR);
  const freqs = [523.25, 784.99, 1046.5, 1568];
  for (let i = b0; i < Math.min(N, b0 + SR * 2.4); i++) {
    const t = (i - b0) / SR;
    let s = 0;
    for (let h = 0; h < freqs.length; h++) {
      s += Math.sin(TAU * freqs[h] * t) * Math.exp(-t * (1.8 + h * 1.3)) * (1 / (h + 1));
    }
    const v = s * 0.1 * Math.exp(-t * 0.8);
    L[i] += v;
    R[i] += v * 0.92;
  }
}

// --- нормализация + WAV -----------------------------------------------------
let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const gain = peak > 0 ? 0.88 / peak : 1;

const dataSize = N * 4;
const buf = Buffer.alloc(44 + dataSize);
buf.write("RIFF", 0);
buf.writeUInt32LE(36 + dataSize, 4);
buf.write("WAVE", 8);
buf.write("fmt ", 12);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28);
buf.writeUInt16LE(4, 32);
buf.writeUInt16LE(16, 34);
buf.write("data", 36);
buf.writeUInt32LE(dataSize, 40);
for (let i = 0; i < N; i++) {
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * gain)) * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * gain)) * 32767), 46 + i * 4);
}

mkdirSync("public/audio", { recursive: true });
writeFileSync("public/audio/ad-soundtrack.wav", buf);
console.log(`OK: public/audio/ad-soundtrack.wav (${DUR.toFixed(2)}s)`);
