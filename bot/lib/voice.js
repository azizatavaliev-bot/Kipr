const OPENAI_API = "https://api.openai.com/v1";

function getApiKey() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY не задан (нужен для голоса)");
  return apiKey;
}

async function transcribe(audioBuffer, filename = "voice.ogg") {
  const apiKey = getApiKey();
  const form = new FormData();
  form.append("file", new Blob([audioBuffer]), filename);
  form.append("model", "whisper-1");
  const res = await fetch(`${OPENAI_API}/audio/transcriptions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Whisper error: ${err}`);
  }
  const data = await res.json();
  return data.text;
}

async function synthesize(text) {
  const apiKey = getApiKey();
  const res = await fetch(`${OPENAI_API}/audio/speech`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "tts-1",
      voice: "alloy",
      input: text,
      response_format: "opus",
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`TTS error: ${err}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

module.exports = { transcribe, synthesize };
