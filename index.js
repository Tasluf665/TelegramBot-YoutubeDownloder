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

    info.formats.forEach((format) => {
      if (
        format.hasAudio &&
        format.mimeType.split(";")[0] === "video/mp4" &&
        format.qualityLabel === "720p"
      ) {
        bot.sendMessage(chatId, format.url).catch((error) => {
          bot.sendMessage(chatId, format.url).catch((error) => {
            bot.sendMessage(chatId, "Sorry error occure. Try again");
          });
        });
      }
    });
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

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
