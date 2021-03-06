/* eslint-disable linebreak-style */
require('dotenv').config();

const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const schedule = require('node-schedule');

const bot = new TelegramBot(process.env.TELEGRAM_API_TOKEN, {
  polling: true,
  onlyFirstMatch: true
});

const port = process.env.PORT || 3100;

const Admin = require('./modules/admin');
const Info = require('./modules/info');
const Data = require('./modules/data');
const News = require('./modules/news');
const Video = require('./modules/video');

const app = express();

// Admin
bot.onText(/\/subscribe/, (msg) => {
  Admin.subscribe(bot, msg);
});

bot.onText(/\/unsubscribe/, (msg) => {
  Admin.unsubscribe(bot, msg);
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
  News.newsUpdate(bot, msg);
});

bot.onText(/\/video/, (msg) => {
  Video.videoUpdate(bot, msg);
});

bot.onText(/\/help/, (msg) => {
  Data.help(bot, msg);
});

// On start
bot.onText(/\/start/, (msg) => {
  Admin.start(bot, msg);
});

bot.onText(/\/log/, (msg) => {
  Admin.log(bot, msg);
});

bot.onText(/.+/, (msg) => {
  Data.notFound(bot, msg);
});

app.get('');

schedule.scheduleJob({ hour: 12, minute: 0 }, () => {
  Admin.dailyUpdate(bot);
});

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Telegram bot is listening on port ${port}!`));
