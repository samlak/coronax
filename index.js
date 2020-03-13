var express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const axios = require("axios");
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TELEGRAM_API_TOKEN, {polling: true});

let openWeatherUrl = process.env.OPENWEATHER_API_URL;

const port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

bot.onText(/\/subscribe/, (msg) => {
    bot.sendMessage(msg.chat.id, "Hi");
});

bot.onText(/\/about/, (msg) => {
    bot.sendMessage(msg.chat.id, "Hi");
});

bot.onText(/\/symptom/, (msg) => {
    bot.sendMessage(msg.chat.id, "Hi");
});

bot.onText(/\/prevent/, (msg) => {
    bot.sendMessage(msg.chat.id, "Hi");
});

bot.onText(/\/worldwide/, (msg) => {
    bot.sendMessage(msg.chat.id, "Hi");
});

bot.onText(/\/countries/, (msg) => {
    bot.sendMessage(msg.chat.id, "Hi");
});

bot.onText(/\/today/, (msg) => {
    bot.sendMessage(msg.chat.id, "Hi");
});

bot.onText(/\/news/, (msg) => {
    bot.sendMessage(msg.chat.id, "Hi");
});

bot.onText(/\/video/, (msg) => {
    bot.sendMessage(msg.chat.id, "Hi");
});

bot.onText(/\/twitter/, (msg) => {
    bot.sendMessage(msg.chat.id, "Hi");
});

app.listen(port, () => console.log("Telegram bot is listening on port "+ port + "!"));