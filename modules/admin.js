const fs = require('fs');

const loadUsers = () => {
    try{
        const users = fs.readFileSync('users.json').toString();
        return JSON.parse(users);
    } catch(e){
        return [];
    }
};

const saveUser = (users) => {
    fs.writeFileSync('users.json', JSON.stringify(users));
}

const loadSubscribers = () => {
    try{
        const subscribers = fs.readFileSync('subscribers.json').toString();
        return JSON.parse(subscribers);
    } catch(e){
        return [];
    }
};

const saveSubscriber = (subscribers) => {
    fs.writeFileSync('subscribers.json', JSON.stringify(subscribers));
}

const subscribe = (bot, msg) => {
    bot.sendMessage(
        msg.chat.id,
        `Do you want to get daily news update about Coronavirus (COVID-19). \nAfter your subscription you will get Coronavirus related news delivered to your inbox everyday. \nYou can /unsubscribe from the service any time`,
        {
            "reply_markup": {
                "inline_keyboard": [
                    [{text: "Subscribe", callback_data: 'subscribe'}]
                ]
            },
            parse_mode: "Markdown"
        }
    );
     
    bot.on("callback_query", function(data){
        if(data.data == 'subscribe'){
            const subscribers = loadSubscribers();
            const subscriberExist = subscribers.find((subscriber) => subscriber.id == msg.chat.id);
            if(!subscriberExist){
                const subscriber = {
                    id: msg.chat.id,
                    firstName: msg.chat.first_name,
                    lastName: msg.chat.last_name
                }
                subscribers.push(subscriber);
                saveSubscriber(subscribers);

                bot.sendMessage(
                    msg.chat.id,
                    `*${msg.chat.first_name}* thanks for your subscription! You have been successfully subscribe to our service`,
                    {parse_mode: "Markdown"}
                );
            }else{
                bot.sendMessage(
                    msg.chat.id,
                    `You have already subscribed to the service.`,
                    {parse_mode: "Markdown"}
                );
            }
        }
    });
}

const unsubscribe = (bot, msg) => {
    const subscribers = loadSubscribers();
    const subscriberExist = subscribers.find((subscriber) => subscriber.id == msg.chat.id);
    if(subscriberExist){
        const newSubscriber = subscribers.filter((subscriber) => {
            subscriber.id != msg.chat.id
        });
        saveSubscriber(newSubscriber);

        bot.sendMessage(
            msg.chat.id,
            `You have unsubscribed from the service. \nClick /subscribe to subscribe to our service`,
            {parse_mode: "Markdown"}
        );
    }else{
        bot.sendMessage(
            msg.chat.id,
            `You were not subscribed to the service`,
            {parse_mode: "Markdown"}
        );
    }
}

const start = (bot, msg) => {
    bot.sendMessage(
        msg.chat.id,
        "Welcome to *CoronaX* (COVID-19 information bot)."+
        "\n*CoronaX* provides you with news daily update, live cases count, search by country funtionality, videoes, tweets and many more. You can start using the bot with the command below:"+
        "\n\n/help - To get the list of command to use when interacting with the bot"+
        "\n/subscribe - To get a daily update about coronavirus (COVID-19)"+
        "\n/worldwide - To know the general statistics of the affected people "+
        "\n/country - To know the statistics of the affected people by country"+
        "\n/search - To know the statistics of  each country"+
        "\n/news - To get news update about coronavirus (COVID-19)"+
        "\n/about - To know more about coronavirus (COVID-19)"+
        "\n/symptom - To know the symptom of coronavirus (COVID-19)"+
        "\n/prevent - To know how to prevent coronavirus (COVID-19)"+
        "\n/video - To get video related to coronavirus (COVID-19)"+
        "\n/tweet - To get the latest tweet on coronavirus (COVID-19)"+
        "\n/contribute - To contribute to this project"+
        "\n/credit - To see list of contributor"+
        "\n/unsubscribe - Unsubscribe from the mailing list",
        {parse_mode: "Markdown"}
    );
}

const log = (bot, msg) => {
    const subscribers = loadSubscribers();
    const users = loadUsers();
    const userExist = users.find((user) => user.id == 1037393003);
    if(userExist){
        bot.sendMessage(
            msg.chat.id,
            `*Dashboard* \n\nUsers : *${users.length}* \n\nSubscribers : *${subscribers.length}*`,
            {parse_mode: "Markdown"}
        );
    }else{
        bot.sendMessage(
            msg.chat.id,
            "You don\'t have access to this information",
            {parse_mode: "Markdown"}
        );
    }   
}

const onMessage = (msg) => {
    const users = loadUsers();
    const userExist = users.find((user) => user.id == msg.chat.id);
    if(!userExist){
        const user = {
            id: msg.chat.id,
            firstName: msg.chat.first_name,
            lastName: msg.chat.last_name
        }
        users.push(user);
        saveUser(users);
    }
}

const dailyUpdate = (bot, msg) => {
    const subscribers = loadSubscribers();
    subscribers
        bot.sendMessage(
            msg.chat.id,
            `*Dashboard* \n\nUsers : *${users.length}* \n\nSubscribers : *${subscribers.length}*`,
            {parse_mode: "Markdown"}
        );
}

module.exports = {subscribe, unsubscribe, start, onMessage, log, dailyUpdate};