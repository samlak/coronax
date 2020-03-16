const axios = require("axios");

const generalStatistics = "https://corona.lmao.ninja/all";
const countryStatistics = "https://corona.lmao.ninja/countries";

const worldwide = (bot, msg) => {
    axios.get(generalStatistics).then((result) => {
        const cases = result.data.cases;
        const deaths = result.data.deaths;
        const recovered = result.data.recovered;
        
        axios.get(countryStatistics).then((country) => {
            var todayNewCases = country.data.filter((newCases) => newCases.todayCases)
                .map((affected) => affected.todayCases)
                .reduce((start, stop) => {
                    return start + stop;
                }, 0);
            var todayDeathCases = country.data.filter((deathCases) => deathCases.todayDeaths)
                .map((affected) => affected.todayDeaths)
                .reduce((start, stop) => {
                    return start + stop;
                }, 0);
                
            var criticalCases = country.data.filter((criticalCases) => criticalCases.critical)
                .map((affected) => affected.critical)
                .reduce((start, stop) => {
                    return start + stop;
                }, 0);
                
            var countryAffected = country.data.length;
            bot.sendMessage(
                msg.chat.id,
                `*Coronavirus Global Statistics* \n\nTotal country affected *${countryAffected}*  \n\nTotal cases *${cases}* \nTotal deaths *${deaths}* \nTotal recovered *${recovered}* \nTotal critical *${criticalCases}* \n\nToday's cases *${todayNewCases}* \nToday's deaths *${todayDeathCases}* `,       
                {
                    "reply_markup": {
                        "inline_keyboard": [
                            [{text: "Source (Worldometers)", url: "https://www.worldometers.info/coronavirus/"}],
                        ]
                    },
                    parse_mode: "Markdown"
                }
            );
        });
    }).catch((error) => {
        console.log(error);
        bot.sendMessage(msg.chat.id, "There was an error when fetching the data");
    });

}

const country = (bot, msg) => {
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

}

const search = (bot, msg) => {
    var country =  msg.text.split('/search ')[1];
    if(country){
        axios.get(countryStatistics).then((result) => {
            const newData = result.data.map((country) => {
                return {
                    country: country.country.toLowerCase(),
                    cases: country.cases,
                    todayCases: country.todayCases,
                    deaths: country.deaths,
                    todayDeaths: country.todayDeaths,
                    recovered: country.recovered,
                    critical: country.critical
                };
            });
            const countryFound = newData.find((affected) => affected.country == country.toLowerCase());
            if(!countryFound){
                return  bot.sendMessage(
                    msg.chat.id, 
                    `No data found for *${country}*. \nYou might have made mistake when typing the country name or the country has no cases of coronavirus confirmed yet. If you made mistake when searching click /search for more information on how to search`,
                    {parse_mode: "Markdown"}
                );
            }
            const countryName = countryFound.country;
            const cases = countryFound.cases;
            const todayCases = countryFound.todayCases;
            const deaths = countryFound.deaths;
            const todayDeaths = countryFound.todayDeaths;
            const recovered = countryFound.recovered;
            const critical = countryFound.critical;
            let countryInfo = `\nSearch result for *${countryName}* \n\nTotal cases *${cases}* \nToday's cases *${todayCases}* \nTotal deaths *${deaths}* \nToday's deaths *${todayDeaths}* \nTotal recovered *${recovered}*  \nTotal critical *${critical}* \n`;
         
            return  bot.sendMessage(
                msg.chat.id, 
                countryInfo,
                {
                    "reply_markup": {
                        "inline_keyboard": [
                            [{text: "Source (Worldometers)", url: "https://www.worldometers.info/coronavirus/"}],
                        ]
                    },
                    parse_mode: "Markdown"
                }
            );
            
        }).catch((error) => {
            console.log(error);
            bot.sendMessage(msg.chat.id, "There was an error when fetching the data.");
        });

    }else{
        bot.sendMessage(
            msg.chat.id,
            `You can search the data of the affected countries. Type /search with space and the name of the country. For example, "*/search Nigeria*" `,
            {parse_mode: "Markdown"}
        );
    }

}

const news = (bot, msg) => {
    bot.sendMessage(msg.chat.id, "Hi");
}

const video = (bot, msg) => {
    bot.sendMessage(msg.chat.id, "Hi");
}

const tweet = (bot, msg) => {
    bot.sendMessage(msg.chat.id, "Hi");
}

module.exports = {worldwide, country, search, news, video, tweet};