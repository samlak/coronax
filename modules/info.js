const aboutInfo = (bot, msg) => {
    const about = (fullName, content, shortName, url) => {
        bot.sendMessage(
            msg.chat.id,
            `*Coronavirus (COVID-19) according to ${fullName}* \n${content}`,
            {
                "reply_markup": {
                    "inline_keyboard": [
                        [{text: "Read More at "+ shortName, url: url}],
                        [{text: "Wikipedia Defination", callback_data: 'wikipedia'}]
                    ]
                },
                parse_mode: "Markdown"
            }
        );
    }

    bot.on("callback_query", function(data){
        if(data.data == "wikipedia"){
            return about(
                "WHO (World Health Organization)",
                "Coronavirus",
                "WHO",
                "https://learnershood.com"
            );
        }else if(data.data == "WHO"){
            return about(
                "WHO (World Health Organization)",
                "Coronavirus",
                "WHO",
                "https://learnershood.com"
            );
        }
    });

    return about(
        "WHO (World Health Organization)",
        "Coronavirus",
        "WHO",
        "https://learnershood.com"
    );
}

const symptom = (bot, msg) => {
    bot.sendMessage(
        msg.chat.id,
        `*Symptom of coronavirus (COVID-19)* \n `,
        {
            "reply_markup": {
                "inline_keyboard": [
                    [{text: "Source ()", url: "https://learnershood.com"}],
                ]
            },
            parse_mode: "Markdown"
        }
    );
}

const prevent = (bot, msg) => {
    bot.sendMessage(
        msg.chat.id,
        `*How to protect against coronavirus (COVID-19)* \n `,
        {
            "reply_markup": {
                "inline_keyboard": [
                    [{text: "Source ()", url: "https://learnershood.com"}],
                ]
            },
            parse_mode: "Markdown"
        }
    );
}

const contribute = (bot, msg) => {
    bot.sendMessage(
        msg.chat.id,
        `Do have anything that you wants to add to this bot to make it better. \nYou can contact @devsamlak to submit your feedback. \nYou can also fork my code on github.`,
        {
            "reply_markup": {
                "inline_keyboard": [
                    [{text: "Fork my code on Github", url: 'http://github.com/samlak/coronax'}]
                ]
            },
            parse_mode: "Markdown"
        }
    );
}

const credit = (bot, msg) => {
    bot.sendMessage(
        msg.chat.id,
        `I will like to appreciate the following for providing data that drive this bot: \n[inline URL](http://www.example.com/)`,
        {parse_mode: "Markdown"}
    );
}

module.exports = {aboutInfo, symptom, prevent, contribute, credit};