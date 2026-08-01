/**
 * Обработчик заявок из приложения «Кипр — гид».
 *
 * Принимает POST { name, phone, city, when, people, comment, text }
 * и отправляет сообщение в WhatsApp менеджеру — автоматически,
 * без участия клиента.
 *
 * Работает как serverless-функция на Vercel (api/lead.js),
 * Netlify (netlify/functions/lead.js) или Cloudflare Workers
 * с минимальной адаптацией сигнатуры.
 *
 * Переменные окружения — см. server/README.md.
 */

const MANAGER = process.env.MANAGER_WHATSAPP || '996500054367'; // куда слать заявки
const PROVIDER = process.env.WA_PROVIDER || 'meta';             // meta | twilio | telegram

export default async function handler(req, res) {
  // CORS: разрешаем вызов со страницы приложения
  const origin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  const lead = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

  // Минимальная валидация — чтобы в WhatsApp не летел мусор
  const name = String(lead.name || '').trim().slice(0, 80);
  const phone = String(lead.phone || '').replace(/[^\d+]/g, '').slice(0, 20);
  if (name.length < 2 || phone.replace(/\D/g, '').length < 9) {
    return res.status(400).json({ error: 'invalid_lead' });
  }

  const text = buildText({ ...lead, name, phone });

  try {
    await send(text, lead);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('lead send failed', e);
    return res.status(502).json({ error: 'send_failed' });
  }
}

function buildText(l) {
  const rows = [
    '🇨🇾 Новая заявка на Кипр',
    '',
    `Имя: ${l.name}`,
    `Телефон: ${l.phone}`,
  ];
  if (l.city) rows.push(`Направление: ${String(l.city).slice(0, 60)}`);
  if (l.when) rows.push(`Даты: ${String(l.when).slice(0, 60)}`);
  if (l.people) rows.push(`Человек: ${String(l.people).slice(0, 10)}`);
  if (l.comment) rows.push(`Комментарий: ${String(l.comment).slice(0, 400)}`);
  rows.push('', `Источник: ${String(l.source || 'cyprus-guide').slice(0, 40)}`);
  return rows.join('\n');
}

async function send(text) {
  if (PROVIDER === 'meta') return sendMeta(text);
  if (PROVIDER === 'twilio') return sendTwilio(text);
  if (PROVIDER === 'telegram') return sendTelegram(text);
  throw new Error('unknown provider: ' + PROVIDER);
}

/* --- WhatsApp Cloud API (Meta) --- */
async function sendMeta(text) {
  const id = must('META_PHONE_NUMBER_ID');
  const token = must('META_TOKEN');
  const r = await fetch(`https://graph.facebook.com/v21.0/${id}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: MANAGER,
      type: 'text',
      text: { body: text },
    }),
  });
  if (!r.ok) throw new Error('meta ' + r.status + ' ' + (await r.text()));
}

/* --- Twilio WhatsApp --- */
async function sendTwilio(text) {
  const sid = must('TWILIO_ACCOUNT_SID');
  const token = must('TWILIO_AUTH_TOKEN');
  const from = must('TWILIO_WHATSAPP_FROM'); // например whatsapp:+14155238886
  const body = new URLSearchParams({ From: from, To: `whatsapp:+${MANAGER}`, Body: text });
  const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
  if (!r.ok) throw new Error('twilio ' + r.status + ' ' + (await r.text()));
}

/* --- Telegram: самый быстрый способ начать, без модерации WhatsApp --- */
async function sendTelegram(text) {
  const token = must('TELEGRAM_BOT_TOKEN');
  const chat = must('TELEGRAM_CHAT_ID');
  const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chat, text }),
  });
  if (!r.ok) throw new Error('telegram ' + r.status + ' ' + (await r.text()));
}

function must(key) {
  const v = process.env[key];
  if (!v) throw new Error('missing env ' + key);
  return v;
}
