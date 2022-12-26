require("dotenv").config();
const express = require("express");
const app = express();
const ytdl = require("ytdl-core");
const TelegramBot = require("node-telegram-bot-api");

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const getVideoUrl = async (url, chatId) => {
  let videosName = [];
  let videos = [];
  try {
    const info = await ytdl.getInfo(url);
    info.formats.forEach((element) => {
      if (element.hasVideo && element.hasAudio) {
        videosName.push("/format " + element.qualityLabel);
        videos.push(element);
      } else if (
        element.hasAudio &&
        !element.hasVideo &&
        element.mimeType.includes("audio/mp4")
      ) {
        videosName.push("/format " + "mp3");
        videos.push(element);
      }
    });

    bot
      .sendMessage(chatId, "Choose video or audio format", {
        reply_markup: {
          keyboard: [videosName],
        },
      })
      .then((res) => {
        bot.onText(/\/format/, (msg) => {
          const format = msg.text.replace("/format ", "");

          videos.forEach((element) => {
            if (format === "mp3" && element.qualityLabel === null) {
              bot.sendMessage(chatId, element.url);
              videosName = [];
              videos = [];
            } else if (element.qualityLabel === format) {
              bot.sendMessage(chatId, element.url);
              videosName = [];
              videos = [];
            }
          });
        });
      });
  } catch (error) {
    bot.sendMessage(chatId, "Sorry no video found...");
    console.log(error.message);
  }
};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Welcome to YouTube video downloder");
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Use the correct format to get the video. Example: /url https://www.youtube.com/watch?v=PKKibX_baoo"
  );
});

bot.onText(/\/url/, async (msg) => {
  const chatId = msg.chat.id;
  const url = msg.text.replace("/url ", "");

  await getVideoUrl(url, chatId);
});

bot.on("message", (msg) => {
  if (!msg.text.includes("/")) {
    bot.sendMessage(msg.chat.id, "Sorry I don't understand...");
  }
});

const port = process.env.PORT || 3008;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
