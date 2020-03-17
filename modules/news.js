'use strict'

const fs = require('fs')
const cheerio = require('cheerio')
const fetch = require('node-fetch')

const newsUpdate = (bot, msg) => {

    const keyword = "Coronavirus"
    const output = "news.json"
    const timeframe = '14d'

    if(fs.existsSync(output)){
        var fileModified = fs.statSync(output);
        var lastModifiedTimestamp = fileModified.mtime.getTime();
        var lastModified = Math.round((new Date() - lastModifiedTimestamp) / 60000);
    } else {
        var lastModified = "noFile";
    }

    if(lastModified >= 15 || lastModified == "noFile"){
        fetch(`https://news.google.com/search?q=${keyword} when:${timeframe}`).then(res => res.text()).then(data => {
            const $ = cheerio.load(data)
            const articles = $('c-wiz article')
            let results = []
            let i = 0
            $(articles).each(function() {
                results.push({
                    "title": $(this).find('h3').text() || false,
                    "subtitle": $(this).find('span').first().text() || false,
                    "link": $(this).find('a').first().attr('href').replace('./', 'https://news.google.com/') || false,
                    "source": $(this).find('div:last-child a').text() || false,
                    "time": $(this).find('div:last-child time').text() || false
                })
                i++
            })
            return results;
        }).then(results => {
            fs.writeFile(output, JSON.stringify(results), function(err) {
                if(err) {
                    return bot.sendMessage(msg.chat.id, "There was an error when fetching the data");
                }
            })
        }).catch((err) => {  
            return bot.sendMessage(msg.chat.id, "There was an error when fetching the data");
        });
    }
    
    var newsUpdate = fs.readFileSync(output).toString()
    var news = JSON.parse(newsUpdate)
    
    const newsData = (start, stop) => {

        var newsInfo = '';
        var stop = stop > news.length ? news.length : stop;
        for(var i = start; i < stop; i++) {
            const title = news[i].title;
            const subtitle = news[i].subtitle;
            const link = news[i].link;
            const source = news[i].source;
            const time = news[i].time;
            newsInfo += `\n\n*${title}* \n${subtitle} \n[${source}](${link}) \n${time}`;
        };

        var keyboard = [];
        var lastPage = news.length >= 10 ? 10 : news.length;

        for(let i = 0; i < lastPage; i++){
            keyboard.push({text: Number(i) + 1, callback_data: i});
        }

        bot.sendMessage(
            msg.chat.id,
            `*Coronavirus News update from Google News* ${newsInfo}`,
            {
                "reply_markup": {
                    "inline_keyboard": [
                        [{text: "Source (Google News)", url: `https://news.google.com/search?q=${keyword} when:${timeframe}`}],
                        keyboard
                    ]
                },
                parse_mode: "Markdown"
            }
        );
    } 
    
    bot.on("callback_query", function(data){
        let currentNum = data.data;
        let start = Number(currentNum) * 10;
        let stop = Number(start) +  10;

        return newsData(start, stop);
    });

    return newsData(0, 10);
}

module.exports = {newsUpdate}
