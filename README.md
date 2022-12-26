# TelegramBot-YoutubeDownloder

<b>Descrition</b><br>
This is a telegram bot to download youTube videos. This bot will provide a download link for the video. This bot is non profitable and free to use for personal use.

<br>
<b>How to use it?</b><br>
1. Go to the telegram<br>
2. Search for @YouTubeVideoDownloder665Bot or visit https://t.me/YouTubeVideoDownloder665Bot<br>
3. Start the bot<br>
4. To download any youtube video send /url VideoLink. Example: /url https://www.youtube.com/watch?v=hwNWx1GTSKo<br>
5. Select which formate you want to download.<br>
6. Click the downloadable link and download the video.<br>
<br>
<img src="https://github.com/Tasluf665/TelegramBot-YoutubeDownloder/blob/master/Project%20Images/Screenshot%20from%202022-12-26%2021-18-13.png">
<img src="https://github.com/Tasluf665/TelegramBot-YoutubeDownloder/blob/master/Project%20Images/Screenshot%20from%202022-12-26%2021-19-41.png">
<img src="https://github.com/Tasluf665/TelegramBot-YoutubeDownloder/blob/master/Project%20Images/Screenshot%20from%202022-12-26%2021-19-55.png">
<img src="https://github.com/Tasluf665/TelegramBot-YoutubeDownloder/blob/master/Project%20Images/Screenshot%20from%202022-12-26%2021-20-07.png">

<br>
<h2>Requirement</h2><br>
1. Nodejs<br>
2. Telegram account<br>
3. Server for Hosting.<br>
<br>
<h2>Dependence</h2><br>
1. Express<br>
2. node-telegram-bot-api<br>
3. dotenv<br>
4. ytdl-core<br>
5. ejs<br>
<br>

<h2>Project workflow description</h2><br>
<b>Create the bot</b><br> 
1. Go the telegram<br>
2. Search for BotFather<br>
3. /start<br>
4. /newbot - create a new bot<br>
5. Choose a name for the bot. Example: YouTube Video Downloader<br>
6. Choose a username for the bot. Example: YouTubeVideoDownloder665Bot<br>
7. Copy the token to access the HTTP API. Example: 59726595.............<br>
8. /setcommands<br>
9. Select the @YouTubeVideoDownloder665Bot<br>
10. Send the command description. <br>
Example:<br> 
help - Help<br>
format - Format<br>
url - URL <br>

<br><b>Create the server</b><br> 
``` 
npm init -y
```
``` 
npm i node-telegram-bot-api express dotenv ytdl-core ejs
```
Create .env file and paste the token from BotFather.
```
TELEGRAM_BOT_TOKEN=59726595.............
PORT=3008
NTBA_FIX_319=1
```
Create the .gitignore file
```
/node_modules
.env
```
Create the server
```nodejs
require("dotenv").config();
const express = require("express");
const app = express();

const port = process.env.PORT || 3008;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
```
Create the telegram bot
```nodejs
require("dotenv").config();
const express = require("express");
const app = express();
const ytdl = require("ytdl-core");
const TelegramBot = require("node-telegram-bot-api");

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const port = process.env.PORT || 3007;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
```
Define diffrenet routes
```nodejs
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Welcome to YouTube video downloder");
});
```
```nodejs
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Use the correct format to get the video. Example: /url https://www.youtube.com/watch?v=PKKibX_baoo"
  );
});
```
```nodejs
bot.on("message", (msg) => {
  if (!msg.text.includes("/")) {
    bot.sendMessage(msg.chat.id, "Sorry I don't understand...");
  }
});
```
Define getVideoUrl function
```nodejs
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

```
```nodejs
bot.onText(/\/url/, async (msg) => {
  const chatId = msg.chat.id;
  const url = msg.text.replace("/url ", "");

  await getVideoUrl(url, chatId);
});
```

Finally run the project<br>
```nodejs
node index.js
```
