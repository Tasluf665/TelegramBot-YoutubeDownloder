require("dotenv").config();
const express = require("express");
const app = express();
const ytdl = require("ytdl-core");
const TelegramBot = require("node-telegram-bot-api");

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const getVideoUrl = async (url, chatId) => {
  try {
    const info = await ytdl.getInfo(url);

    for (let i = 0; i < info.formats.length; i++) {
      if (
        info.formats[i].hasAudio &&
        info.formats[i].hasVideo &&
        info.formats[i].qualityLabel === "720p"
      ) {
        bot.sendMessage(chatId, info.formats[i].url).catch((error) => {
          console.log(error.message);
          process.exit(1);
        });
        break;
      } else if (
        info.formats[i].hasAudio &&
        info.formats[i].hasVideo &&
        info.formats[i].qualityLabel === "480p"
      ) {
        bot.sendMessage(chatId, info.formats[i].url).catch((error) => {
          console.log(error.message);
          process.exit(1);
        });
        break;
      } else if (
        info.formats[i].hasAudio &&
        info.formats[i].hasVideo &&
        info.formats[i].qualityLabel === "360p"
      ) {
        bot.sendMessage(chatId, info.formats[i].url).catch((error) => {
          console.log(error.message);
          process.exit(1);
        });
        break;
      } else if (
        info.formats[i].hasAudio &&
        info.formats[i].hasVideo &&
        info.formats[i].qualityLabel === "240p"
      ) {
        bot.sendMessage(chatId, info.formats[i].url).catch((error) => {
          console.log(error.message);
          process.exit(1);
        });
        break;
      }
    }
  } catch (error) {
    await bot.sendMessage(chatId, "No video found. Sorry");
  }
};

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  if (msg.text.includes("/start")) {
    bot.sendMessage(chatId, "Welcome");
  } else {
    getVideoUrl(msg.text, chatId);
  }
});

const port = process.env.PORT || 3008;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
