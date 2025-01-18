"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const telegraf_1 = require("telegraf");
const openai_1 = require("openai");
dotenv_1.default.config();
const BOT_TOKEN = process.env.BOT_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!BOT_TOKEN || !OPENAI_API_KEY) {
    throw new Error("Необходимо указать токены в .env файле.");
}
const bot = new telegraf_1.Telegraf(BOT_TOKEN);
const openai = new openai_1.OpenAI({
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
        answer: "Полезен, когда стимулирует рост; вреден, если приводит к выгоранию.",
    },
];
const userTests = {};
bot.start((ctx) => {
    ctx.reply("Привет! Я бот LATOKEN. Задавайте вопросы о компании, хакатоне или начните тестирование с помощью команды /test.");
});
bot.command("test", (ctx) => {
    const chatId = ctx.chat.id;
    if (!userTests[chatId]) {
        userTests[chatId] = { index: 0, correct: 0 };
        ctx.reply("Начнем тест! Вот первый вопрос:");
        ctx.reply(testQuestions[0].question);
    }
    else {
        ctx.reply("Вы уже начали тест. Ответьте на текущий вопрос.");
    }
});
bot.on("text", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const chatId = ctx.chat.id;
    const userMessage = ctx.message.text;
    if (userTests[chatId]) {
        const userTest = userTests[chatId];
        const currentQuestion = testQuestions[userTest.index];
        if (userMessage.toLowerCase() === currentQuestion.answer.toLowerCase()) {
            userTest.correct++;
            ctx.reply("Правильно!");
        }
        else {
            ctx.reply(`Неправильно. Правильный ответ: ${currentQuestion.answer}`);
        }
        userTest.index++;
        if (userTest.index < testQuestions.length) {
            ctx.reply(testQuestions[userTest.index].question);
        }
        else {
            ctx.reply(`Тест завершен! Вы ответили правильно на ${userTest.correct} из ${testQuestions.length} вопросов.`);
            delete userTests[chatId];
        }
        return;
    }
    try {
        const completion = yield openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "Ты бот LATOKEN. Отвечай строго по теме." },
                { role: "user", content: userMessage },
            ],
        });
        const reply = (_b = (_a = completion.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content;
        ctx.reply(reply || "Не смог найти ответ. Попробуй спросить иначе.");
    }
    catch (error) {
        console.error("Ошибка OpenAI:", error);
        ctx.reply("Произошла ошибка. Попробуйте позже.");
    }
}));
bot.launch().then(() => {
    console.log("Бот запущен!");
});
