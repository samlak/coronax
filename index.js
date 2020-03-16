var express = require("express");
require("dotenv").config();
const axios = require("axios");
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TELEGRAM_API_TOKEN, {polling: true});
const port = process.env.PORT || 3000;

const Subscription = require('./modules/subscription');
const Info = require('./modules/info');
const Data = require('./modules/data');

var app = express();

// Subscription
bot.onText(/\/subscribe/, (msg) => {
    Subscription.subscribe(bot, msg);
});

bot.onText(/\/unsubscribe/, (msg) => {
    Subscription.unsubscribe(bot, msg);
});

// General Information
bot.onText(/\/about/, (msg) => {
    Info.aboutInfo(bot, msg);
});

bot.onText(/\/symptom/, (msg) => {
    Info.symptom(bot, msg);
});

bot.onText(/\/prevent/, (msg) => {
    Info.prevent(bot, msg);
});

bot.onText(/\/contribute/, (msg) => {
    Info.contribute(bot, msg);
});

bot.onText(/\/credit/, (msg) => {
    Info.credit(bot, msg);
});

// Data
bot.onText(/\/worldwide/, (msg) => {
    Data.worldwide(bot, msg);
});

bot.onText(/\/country/, (msg) => {
    Data.country(bot, msg);
});

bot.onText(/\/search/, (msg) => {
    Data.search(bot, msg);
});

bot.onText(/\/news/, (msg) => {
    Data.news(bot, msg);
});

bot.onText(/\/video/, (msg) => {
    Data.video(bot, msg);
});

bot.onText(/\/tweet/, (msg) => {
    Data.tweet(bot, msg);
});

//User count
bot.on('message', (msg) => {
    Subscription.start(msg);
});

app.listen(port, () => console.log("Telegram bot is listening on port "+ port + "!"));