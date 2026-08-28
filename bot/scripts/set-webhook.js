// Регистрирует webhook Telegram-бота на задеплоенный URL.
// Использование: TELEGRAM_BOT_TOKEN=... TELEGRAM_WEBHOOK_SECRET=... node scripts/set-webhook.js https://ваш-домен.vercel.app

const token = process.env.TELEGRAM_BOT_TOKEN;
const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
const baseUrl = process.argv[2];

if (!token) {
  console.error("Задайте TELEGRAM_BOT_TOKEN в окружении");
  process.exit(1);
}
if (!baseUrl) {
  console.error("Укажите URL деплоя первым аргументом, например:\n  node scripts/set-webhook.js https://your-app.vercel.app");
  process.exit(1);
}

const webhookUrl = `${baseUrl.replace(/\/$/, "")}/api/webhook`;

(async () => {
  const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: secret || undefined,
    }),
  });
  const data = await res.json();
  console.log(data);
  if (!data.ok) process.exit(1);
})();
