# Кипр-бот для Telegram

Telegram-бот alfa про Кипр:
- консультирует по учёбе на Кипре (вузы, визы, стоимость) — как продолжение лендинга `index.html`;
- отвечает на любые вопросы про Кипр (туризм, переезд, жизнь);
- понимает голосовые сообщения (распознаёт речь) и умеет отвечать голосом.

Стек: Node.js serverless-функция на Vercel, Anthropic Claude для диалога, OpenAI Whisper/TTS для голоса.

## 1. Создать бота в Telegram

1. Открыть [@BotFather](https://t.me/BotFather) в Telegram.
2. Отправить `/newbot`, задать имя и username бота.
3. BotFather выдаст токен вида `123456:ABC-DEF...` — это `TELEGRAM_BOT_TOKEN`.

## 2. Получить ключи API

- **ANTHROPIC_API_KEY** — на [console.anthropic.com](https://console.anthropic.com) (для текстовых ответов).
- **OPENAI_API_KEY** — на [platform.openai.com](https://platform.openai.com) (нужен только для голосовых: распознавание Whisper и озвучка TTS). Если этот ключ не задать — бот продолжит работать текстом, а на голосовые сообщения ответит текстом.

## 3. Задеплоить на Vercel

```bash
cd bot
npm install
npx vercel        # первый деплой, привяжет проект
npx vercel --prod # деплой в прод
```

Либо через сайт vercel.com: импортировать репозиторий, указать Root Directory = `bot`.

В настройках проекта на Vercel (Settings → Environment Variables) задать:

| Переменная | Значение |
|---|---|
| `TELEGRAM_BOT_TOKEN` | токен от BotFather |
| `ANTHROPIC_API_KEY` | ключ Anthropic |
| `OPENAI_API_KEY` | ключ OpenAI (для голоса, опционально) |
| `TELEGRAM_WEBHOOK_SECRET` | любая случайная строка (защита webhook, опционально, но рекомендуется) |

После добавления переменных — передеплоить (`npx vercel --prod`), чтобы они подхватились.

## 4. Подключить webhook Telegram к боту

После деплоя Vercel даст URL вида `https://kipr-bot.vercel.app`. Зарегистрировать webhook:

```bash
cd bot
TELEGRAM_BOT_TOKEN=... TELEGRAM_WEBHOOK_SECRET=... node scripts/set-webhook.js https://kipr-bot.vercel.app
```

Проверить, что webhook встал:

```bash
curl "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getWebhookInfo"
```

## 5. Готово

Открыть бота в Telegram по username, отправить `/start`, задать вопрос текстом или голосом.

## Ограничения текущей версии

- История переписки не сохраняется между сообщениями (каждое сообщение обрабатывается независимо) — для памяти диалога понадобится добавить хранилище (например, Vercel KV).
- Точные цифры (цены, сроки подачи, конкретные вузы) бот не выдумывает и предлагает уточнить у менеджера alfa — их стоит донастроить в системном промпте (`lib/ai.js`) под актуальные данные.
