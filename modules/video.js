var search = require('scrape-youtube');
var fs = require('fs');

const videoUpdate = (bot, msg) => {
    const keyword = "Coronavirus video"
    const output = "video.json"
    
    const fetchFromYoutube = () => {
        search(keyword, { type : "video", limit : 50}).then(results => {
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
        fetchFromYoutube();
    }
    
    var videoUpdate = fs.readFileSync(output).toString();
    var video = JSON.parse(videoUpdate);
    
    const videoData = (start, stop) => {

        var videoInfo = '';
        var stop = stop > video.length ? video.length : stop;
        for(var i = start; i < stop; i++) {
            const title = video[i].title;
            const description = video[i].description;
            const link = video[i].link;
            const channel = video[i].channel;
            const channel_link = video[i].channel_link;
            const upload_date = video[i].upload_date;
            videoInfo += `\n\n*${title}* \n${description} \nBy [${channel}](${channel_link}) uploaded *${upload_date}* \n[Watch now](${link})`;
        };
        var keyboard = [];
        var pages =  video.length / 10;
        var lastPage = pages >= 10 ? 10 : pages;

        for(let i = 0; i < lastPage; i++){
            keyboard.push({text: Number(i) + 1, callback_data: i});
        }

        bot.sendMessage(
            msg.chat.id,
            `*Coronavirus related videos* ${videoInfo}`,
            {
                "reply_markup": {
                    "inline_keyboard": [
                        [{text: "Source (Youtube)", url: `https://www.youtube.com`}],
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

        
        return videoData(start, stop);
        // bot.answerCallbackQuery(msg.chat.id);
    });

    return videoData(0, 10);
}

module.exports = {videoUpdate}

