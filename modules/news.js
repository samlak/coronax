const fs = require('fs')
const cheerio = require('cheerio')
const fetch = require('node-fetch')

const newsUpdate = (bot, msg) => {
    var country =  msg.text.split('/news ')[1];
    if(country){
        var location = `in ${country}`;
        const keyword = `Coronavirus news `;
        const timeframe = '7d';
        const output = "specific_news.json";
        
        const fetchFromGoogleNews = () => {
            fetch(`https://news.google.com/search?q=${keyword}${location} when:${timeframe}`).then(res => res.text()).then(data => {
                const $ = cheerio.load(data);
                const articles = $('c-wiz article');
                let results = [];
                let i = 0;
                $(articles).each(function() {
                    results.push({
                        "title": $(this).find('h3').text() || false,
                        "subtitle": $(this).find('span').first().text() || false,
                        "link": $(this).find('a').first().attr('href').replace('./', 'https://news.google.com/') || false,
                        "source": $(this).find('div:last-child a').text() || false,
                        "time": $(this).find('div:last-child time').text() || false
                    });
                    i++;
                });
                return Promise.all(results.map(article => {
                    return fetch(article.link).then(res => res.text()).then(data => {
                        const _$ = cheerio.load(data)
                        article.link = _$('c-wiz a[rel=nofollow]').attr('href')
                        return article
                    })
                })).then(articles => {
                    return articles
                }).catch((err) => {
                    return results;
                })
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
        
        if(fs.existsSync(output)){
            var fileModified = fs.statSync(output);
            var lastModifiedTimestamp = fileModified.mtime.getTime();
            var lastModified = Math.round((new Date() - lastModifiedTimestamp) / 60000);
        } else {
            var lastModified = "noFile";
        }
    
        if(lastModified >= 0 || lastModified == "noFile"){
            fetchFromGoogleNews();
        }
        
        
        var newsUpdate = fs.readFileSync(output).toString();
        var news = JSON.parse(newsUpdate);
    
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
            var pages =  news.length / 10;
            var lastPage = pages >= 8 ? 8 : pages;
    
            for(let i = 0; i < lastPage; i++){
                keyboard.push({text: Number(i) + 1, callback_data: i});
            }
    
            bot.sendMessage(
                msg.chat.id,
                `*Coronavirus news ${location}* ${newsInfo}`,
                {
                    "reply_markup": {
                        "inline_keyboard": [
                            [{text: "Source (Google News)", url: `https://news.google.com/search?q=${keyword}${location} when:${timeframe}`}],
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
    
        
    }else{
        var location = 'around the world';
        const keyword = "Coronavirus news ";
        const output = "news.json";
        const timeframe = '7d';
        
        const fetchFromGoogleNews = () => {
            fetch(`https://news.google.com/search?q=${keyword}${location} when:${timeframe}`).then(res => res.text()).then(data => {
                const $ = cheerio.load(data);
                const articles = $('c-wiz article');
                let results = [];
                let i = 0;
                $(articles).each(function() {
                    results.push({
                        "title": $(this).find('h3').text() || false,
                        "subtitle": $(this).find('span').first().text() || false,
                        "link": $(this).find('a').first().attr('href').replace('./', 'https://news.google.com/') || false,
                        "source": $(this).find('div:last-child a').text() || false,
                        "time": $(this).find('div:last-child time').text() || false
                    });
                    i++;
                });
                return Promise.all(results.map(article => {
                    return fetch(article.link).then(res => res.text()).then(data => {
                        const _$ = cheerio.load(data)
                        article.link = _$('c-wiz a[rel=nofollow]').attr('href')
                        return article
                    })
                })).then(articles => {
                    return articles
                }).catch((err) => {
                    return results;
                })
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
        
        if(fs.existsSync(output)){
            var fileModified = fs.statSync(output);
            var lastModifiedTimestamp = fileModified.mtime.getTime();
            var lastModified = Math.round((new Date() - lastModifiedTimestamp) / 60000);
        } else {
            var lastModified = "noFile";
        }
    
        if(lastModified >= 15 || lastModified == "noFile"){
            fetchFromGoogleNews();
        }
        
        var newsUpdate = fs.readFileSync(output).toString();
        var news = JSON.parse(newsUpdate);
    
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
            var pages =  news.length / 10;
            var lastPage = pages >= 8 ? 8 : pages;
    
            for(let i = 0; i < lastPage; i++){
                keyboard.push({text: Number(i) + 1, callback_data: i});
            }
    
            bot.sendMessage(
                msg.chat.id,
                `*Coronavirus news ${location}* ${newsInfo} \n\nTo access country specific news, use */news country* e.g */news Canada*`,
                {
                    "reply_markup": {
                        "inline_keyboard": [
                            [{text: "Source (Google News)", url: `https://news.google.com/search?q=${keyword}${location} when:${timeframe}`}],
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
}

module.exports = {newsUpdate}
