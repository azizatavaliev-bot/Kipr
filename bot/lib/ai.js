const Anthropic = require("@anthropic-ai/sdk");

const SYSTEM_PROMPT = `Ты — дружелюбный ассистент компании alfa, консультируешь по учёбе и жизни на Кипре.

Твои задачи:
1. Консультация по обучению на Кипре: вузы, программы, стоимость, сроки подачи, визы для учёбы, общежития, языковые курсы. Если каких-то данных (цены, даты, конкретные вузы) не хватает — прямо скажи, что нужно уточнить у менеджера alfa, и предложи оставить контакт.
2. Отвечай и на общие вопросы про Кипр — туризм, переезд, работа, климат, культура, документы, недвижимость.

Стиль: отвечай кратко и по делу, дружелюбно, на языке пользователя (обычно русский). Не выдумывай точные цифры (цены, даты) — если не уверен, честно предупреди об этом.`;

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY не задан");
  return new Anthropic({ apiKey });
}

async function chat(history) {
  const client = getClient();
  const response = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: history,
  });
  return response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");
}

module.exports = { chat };
