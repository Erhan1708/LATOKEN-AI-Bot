import dotenv from "dotenv";
import { Telegraf } from "telegraf";
import { OpenAI } from "openai";

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

if (!BOT_TOKEN || !OPENAI_API_KEY) {
  throw new Error("Необходимо указать токены в .env файле.");
}

const bot = new Telegraf(BOT_TOKEN);

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const testQuestions = [
  {
    question: "Почему LATOKEN помогает людям изучать и покупать активы?",
    answer: "Чтобы сделать их финансово независимыми.",
  },
  {
    question: "Зачем нужен Sugar Cookie тест?",
    answer: "Для оценки настойчивости и упорства.",
  },
  {
    question: "Зачем нужен Wartime CEO?",
    answer: "Для принятия быстрых решений в условиях неопределенности.",
  },
  {
    question: "В каких случаях стресс полезен и в каких вреден?",
    answer:
      "Полезен, когда стимулирует рост; вреден, если приводит к выгоранию.",
  },
];

const userTests: Record<number, { index: number; correct: number }> = {};

bot.start((ctx) => {
  ctx.reply(
    "Привет! Я бот LATOKEN. Задавайте вопросы о компании, хакатоне или начните тестирование с помощью команды /test."
  );
});

bot.command("test", (ctx) => {
  const chatId = ctx.chat.id;
  if (!userTests[chatId]) {
    userTests[chatId] = { index: 0, correct: 0 };
    ctx.reply("Начнем тест! Вот первый вопрос:");
    ctx.reply(testQuestions[0].question);
  } else {
    ctx.reply("Вы уже начали тест. Ответьте на текущий вопрос.");
  }
});

bot.on("text", async (ctx) => {
  const chatId = ctx.chat.id;
  const userMessage = ctx.message.text;

  if (userTests[chatId]) {
    const userTest = userTests[chatId];
    const currentQuestion = testQuestions[userTest.index];

    if (userMessage.toLowerCase() === currentQuestion.answer.toLowerCase()) {
      userTest.correct++;
      ctx.reply("Правильно!");
    } else {
      ctx.reply(`Неправильно. Правильный ответ: ${currentQuestion.answer}`);
    }

    userTest.index++;
    if (userTest.index < testQuestions.length) {
      ctx.reply(testQuestions[userTest.index].question);
    } else {
      ctx.reply(
        `Тест завершен! Вы ответили правильно на ${userTest.correct} из ${testQuestions.length} вопросов.`
      );
      delete userTests[chatId];
    }
    return;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Ты бот LATOKEN. Отвечай строго по теме." },
        { role: "user", content: userMessage },
      ],
    });
  
    const reply = completion.choices[0]?.message?.content;
    ctx.reply(reply || "Не смог найти ответ. Попробуй спросить иначе.");
  } catch (error) {
    console.error("Ошибка OpenAI:", error);
    ctx.reply("Произошла ошибка. Попробуйте позже.");
  }
});

bot.launch().then(() => {
  console.log("Бот запущен!");
});
