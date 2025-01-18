# LATOKEN AI Bot

LATOKEN AI Bot — это телеграм-бот, который помогает кандидатам на работу узнать детали о компании LATOKEN, процессе интервью и внутренней культуре компании.

## Установка

1. Клонируйте репозиторий:

ssh
   ```bash
   git clone git@github.com:Erhan1708/LATOKEN-AI-Bot.git 
``` 

https
   ```bash
    git clone [git@github.com:Erhan1708/LATOKEN-AI-Bot.git](https://github.com/Erhan1708/LATOKEN-AI-Bot.git)
```
Для запуска бота выполните следующие шаги:

Установите зависимости:
```bash
npm install
```

Для запуска бота выполните команду:
```bash
npm start
```

Бот доступен в Telegram по следующей ссылке:
👉 [LATOKEN AI Bot](https://t.me/latoken_ai25_bot)


Вы можете задать боту вопросы о компании LATOKEN, её хакатонах, процессе интервью и культуре.

Функциональность
	•	Ответы на вопросы о компании LATOKEN.

	•	Объяснение процесса интервью.

	•	Информация о Culture Deck компании.

	•	Проведение тестов для кандидатов.

Переменные окружения

Для работы бота необходимо создать файл .env в корне проекта со следующим содержимым:

```
TELEGRAM_BOT_TOKEN=ваш_токен_бота
OPENAI_API_KEY=ваш_ключ_OpenAI
```