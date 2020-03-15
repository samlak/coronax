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

const start = (msg) => {
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

module.exports = {subscribe, unsubscribe, start};