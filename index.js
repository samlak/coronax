var express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const axios = require("axios");
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TELEGRAM_API_TOKEN, {polling: true});

const port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  }),
//   express.static(path.join(__dirname, '/public'))
);

const generalStatistics = "https://corona.lmao.ninja/all";
const countryStatistics = "https://corona.lmao.ninja/countries";

bot.onText(/\/subscribe/, (msg) => {
    bot.sendMessage(msg.chat.id, "Hi");
});

bot.onText(/\/about/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        "Hi",
        {parse_mode: "Markdown"}
    );
});

bot.onText(/\/symptom/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        "Hi",
        {parse_mode: "Markdown"}
    );
});

bot.onText(/\/prevent/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        "Hi",
        {parse_mode: "Markdown"}
    );
});

bot.onText(/\/worldwide/, (msg) => {
    axios.get(generalStatistics).then((result) => {
        const cases = result.data.cases;
        const deaths = result.data.deaths;
        const recovered = result.data.recovered;

        bot.sendMessage(
            msg.chat.id,
            `*Coronavirus Global Statistics* \nTotal cases *${cases}* \nTotal deaths *${deaths}* \nTotal recovered *${recovered}*`,
            {parse_mode: "Markdown"}
        );
    }).catch((error) => {
        bot.sendMessage(msg.chat.id, "There was an error when fetching the data");
    });
});

bot.onText(/\/countries/, (msg) => {
    axios.get(countryStatistics).then((result) => {
        
        const countryData = (start, stop, currentNum, next, previous) => {
            let countriesInfo = '';
            let countries = result.data;
            let totalPage = Math.ceil(Number(countries.length) / 10);
            var stop = stop > countries.length ? countries.length : stop;
            for(var i = start; i < stop; i++) {
                const countryName = countries[i].country;
                const cases = countries[i].cases;
                const todayCases = countries[i].todayCases;
                const deaths = countries[i].deaths;
                const todayDeaths = countries[i].todayDeaths;
                const recovered = countries[i].recovered;
                const critical = countries[i].critical;
                let countryInfo = `\nData for *${countryName}* \n\nTotal cases *${cases}* \nToday's cases *${todayCases}* \nTotal deaths *${deaths}* \nToday's deaths *${todayDeaths}* \nTotal recovered *${recovered}*  \nTotal critical *${critical}* \n`;
                countriesInfo += countryInfo;
            };

            
            if(currentNum == 0){
                var keyboard = [
                    {text: "First Page", callback_data: 0},
                    {text: "Next", callback_data: next}, 
                    {text: "Last Page", callback_data: Number(totalPage) - 1 }
                ]
            }else if (currentNum == Number(totalPage) - 1){
                var keyboard = [
                    {text: "First Page", callback_data: 0},
                    {text: "Previous", callback_data: previous}, 
                    {text: "Last Page", callback_data: Number(totalPage) - 1 }
                ]
            }else{
                var keyboard = [
                    {text: "First Page", callback_data: 0},
                    {text: "Previous", callback_data: previous}, 
                    {text: "Next", callback_data: next}, 
                    {text: "Last Page", callback_data: Number(totalPage) - 1 }
                ]
            }

            bot.sendMessage(
                msg.chat.id,
                `*Coronavirus Statistics by Country* \n*${countries.length}* countries has been affected by Coronavirus \nPage *${Number(currentNum) + 1}* of *${Number(totalPage) - 1}*\n ${countriesInfo} `,
                {
                    "reply_markup": {
                        "inline_keyboard": [keyboard]
                    },
                    parse_mode: "Markdown"
                }
            );
        }

        
        
        bot.on("callback_query", function(data){
            let currentNum = data.data;
            let start = Number(currentNum) * 10;
            let stop = Number(start) +  10;
            let next = Number(currentNum) + 1;
            let previous = Number(currentNum) - 1;

            return countryData(start, stop, currentNum, next, previous);
        });

        return countryData(0, 10, 0, 1, 0);
    }).catch((error) => {
        bot.sendMessage(msg.chat.id, "There was an error when fetching the data");
    });
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

// app.get('/worldwide', (req, res) => {
//     let url = 
//     axios.get(newUrl).then
// });

app.listen(port, () => console.log("Telegram bot is listening on port "+ port + "!"));