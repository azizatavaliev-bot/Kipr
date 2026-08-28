const TELEGRAM_API = "https://api.telegram.org";

function apiUrl(token, method) {
  return `${TELEGRAM_API}/bot${token}/${method}`;
}

async function callTelegram(token, method, body) {
  const res = await fetch(apiUrl(token, method), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.ok) {
    console.error(`Telegram API error on ${method}:`, data);
  }
  return data;
}

function sendMessage(token, chatId, text, extra = {}) {
  return callTelegram(token, "sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "Markdown",
    ...extra,
  });
}

function sendChatAction(token, chatId, action) {
  return callTelegram(token, "sendChatAction", { chat_id: chatId, action });
}

async function sendVoice(token, chatId, buffer, filename = "reply.ogg") {
  const form = new FormData();
  form.append("chat_id", String(chatId));
  form.append("voice", new Blob([buffer], { type: "audio/ogg" }), filename);
  const res = await fetch(apiUrl(token, "sendVoice"), {
    method: "POST",
    body: form,
  });
  return res.json();
}

async function getFileUrl(token, fileId) {
  const data = await callTelegram(token, "getFile", { file_id: fileId });
  if (!data.ok) throw new Error("getFile failed");
  return `${TELEGRAM_API}/file/bot${token}/${data.result.file_path}`;
}

async function downloadFile(url) {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

module.exports = {
  sendMessage,
  sendChatAction,
  sendVoice,
  getFileUrl,
  downloadFile,
};
