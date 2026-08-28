const { sendMessage, sendChatAction, sendVoice, getFileUrl, downloadFile } = require("../lib/telegram");
const { chat } = require("../lib/ai");
const { transcribe, synthesize } = require("../lib/voice");

const WELCOME = `Привет! Я бот alfa про Кипр 🇨🇾

Расскажу про учёбу на Кипре (вузы, визы, стоимость) и отвечу на любые вопросы про жизнь, туризм и переезд на Кипр. Можно писать текстом или присылать голосовые.`;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(200).json({ ok: true });
    return;
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret && req.headers["x-telegram-bot-api-secret-token"] !== secret) {
    res.status(401).end();
    return;
  }
  if (!token) {
    console.error("TELEGRAM_BOT_TOKEN не задан");
    res.status(500).end();
    return;
  }

  const update = req.body;
  const message = update && update.message;

  // Отвечаем Telegram сразу, чтобы избежать повторной доставки update при долгой обработке
  res.status(200).json({ ok: true });

  if (!message) return;
  const chatId = message.chat.id;

  try {
    if (message.text === "/start") {
      await sendMessage(token, chatId, WELCOME);
      return;
    }

    let userText = message.text;
    let replyWithVoice = false;

    if (!userText && message.voice) {
      replyWithVoice = true;
      await sendChatAction(token, chatId, "typing");
      const fileUrl = await getFileUrl(token, message.voice.file_id);
      const audioBuffer = await downloadFile(fileUrl);
      userText = await transcribe(audioBuffer, "voice.ogg");
      if (!userText || !userText.trim()) {
        await sendMessage(token, chatId, "Не удалось распознать голосовое сообщение, попробуй ещё раз или напиши текстом.");
        return;
      }
    }

    if (!userText) {
      await sendMessage(token, chatId, "Пока умею отвечать на текст и голосовые сообщения.");
      return;
    }

    await sendChatAction(token, chatId, "typing");
    const answer = await chat([{ role: "user", content: userText }]);

    if (replyWithVoice) {
      try {
        const audio = await synthesize(answer);
        await sendVoice(token, chatId, audio);
      } catch (err) {
        console.error("TTS failed, falling back to text:", err);
        await sendMessage(token, chatId, answer);
      }
    } else {
      await sendMessage(token, chatId, answer);
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    try {
      await sendMessage(token, chatId, "Что-то пошло не так, попробуй ещё раз чуть позже 🙏");
    } catch (_) {}
  }
};
