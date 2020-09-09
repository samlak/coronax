/* eslint-disable linebreak-style */
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const search = require('scrape-youtube');

const baseDirectory = path.join(__dirname, '../data/');

const loadUsers = () => {
  try {
    const users = fs.readFileSync(`${baseDirectory}users.json`).toString();
    return JSON.parse(users);
  } catch (e) {
    return [];
  }
};

const saveUser = (users) => {
  fs.writeFileSync(`${baseDirectory}users.json`, JSON.stringify(users));
};

const loadSubscribers = () => {
  try {
    const subscribers = fs.readFileSync(`${baseDirectory}subscribers.json`).toString();
    return JSON.parse(subscribers);
  } catch (e) {
    return [];
  }
};

const saveSubscriber = (subscribers) => {
  fs.writeFileSync(`${baseDirectory}subscribers.json`, JSON.stringify(subscribers));
};

const subscribe = (bot, msg) => {
  bot.sendMessage(
    msg.chat.id,
    'Do you want to get daily news update about Coronavirus (COVID-19). \nAfter your subscription you will get Coronavirus related news delivered to your inbox everyday. \nYou can /unsubscribe from the service any time',
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Subscribe', callback_data: 'subscribe' }]
        ]
      },
      parse_mode: 'Markdown'
    }
  );

  bot.on('callback_query', (data) => {
    if (data.data === 'subscribe') {
      const subscribers = loadSubscribers();
      const subscriberExist = subscribers.find((subscriber) => subscriber.id === msg.chat.id);
      if (!subscriberExist) {
        const subscriber = {
          id: msg.chat.id,
          firstName: msg.chat.first_name,
          lastName: msg.chat.last_name
        };

        subscribers.push(subscriber);
        saveSubscriber(subscribers);

        bot.sendMessage(
          msg.chat.id,
          `*${msg.chat.first_name}* thanks for your subscription! You have been successfully subscribe to our service`,
          { parse_mode: 'Markdown' }
        );
      } else {
        bot.sendMessage(
          msg.chat.id,
          'You have already subscribed to the service.',
          { parse_mode: 'Markdown' }
        );
      }
    }
  });
};

const unsubscribe = (bot, msg) => {
  const subscribers = loadSubscribers();
  const subscriberExist = subscribers.find((subscriber) => subscriber.id === msg.chat.id);
  if (subscriberExist) {
    const newSubscriber = subscribers.filter((subscriber) => subscriber.id !== msg.chat.id);
    saveSubscriber(newSubscriber);

    bot.sendMessage(
      msg.chat.id,
      'You have unsubscribed from the service. \nClick /subscribe to subscribe to our service',
      { parse_mode: 'Markdown' }
    );
  } else {
    bot.sendMessage(
      msg.chat.id,
      'You were not subscribed to the service',
      { parse_mode: 'Markdown' }
    );
  }
};

const start = (bot, msg) => {
  bot.sendMessage(
    msg.chat.id,
    'Welcome to *CoronaX* (COVID-19 information bot).'
    + '\n*CoronaX* provides you with daily news update, live cases count, search by country functionality, videos, and many more. You can start using the bot with the command below:'
    + '\n\n/help - To get the list of command to use when interacting with the bot'
    + '\n/subscribe - To get a daily update about coronavirus (COVID-19)'
    + '\n/worldwide - To know the general statistics of the affected people '
    + '\n/country - To know the statistics of the people affected in each country'
    + '\n/search - To know the statistics of a specific country'
    + '\n/news - To get news update about coronavirus (COVID-19)'
    + '\n/about - To know more about coronavirus (COVID-19)'
    + '\n/symptom - To know the symptom of coronavirus (COVID-19)'
    + '\n/prevent - To know how to prevent coronavirus (COVID-19)'
    + '\n/video - To get video related to coronavirus (COVID-19)'
    + '\n/contribute - To contribute to this project'
    + '\n/credit - To see list of contributor'
    + '\n/unsubscribe - Unsubscribe from the mailing list',
    { parse_mode: 'Markdown' }
  );
  const users = loadUsers();
  const userExist = users.find((user) => user.id === msg.chat.id);
  if (!userExist) {
    const user = {
      id: msg.chat.id,
      firstName: msg.chat.first_name,
      lastName: msg.chat.last_name
    };
    users.push(user);
    saveUser(users);
  }
};

const log = (bot, msg) => {
  const subscribers = loadSubscribers();
  const users = loadUsers();
  bot.sendMessage(
    msg.chat.id,
    `*Dashboard* \n\nUsers : *${users.length}* \n\nSubscribers : *${subscribers.length}*`,
    { parse_mode: 'Markdown' }
  );
};

const dailyUpdate = (bot) => {
  const fetchFromGoogleNews = () => {
    const keyword = 'Coronavirus news';
    const timeframe = '14d';
    const output = `${baseDirectory}news.json`;

    fetch(`https://news.google.com/search?q=${keyword} when:${timeframe}`).then((res) => res.text()).then((data) => {
      const $ = cheerio.load(data);
      const articles = $('c-wiz article');
      const results = [];
      let i = 0;
      $(articles).each(() => {
        results.push({
          title: $(this).find('h3').text() || false,
          subtitle: $(this).find('span').first().text() || false,
          link: $(this).find('a').first().attr('href')
            .replace('./', 'https://news.google.com/') || false,
          source: $(this).find('div:last-child a').text() || false,
          time: $(this).find('div:last-child time').text() || false
        });
        // eslint-disable-next-line no-unused-vars
        i++;
      });
      return results;
    }).then((results) => {
      // eslint-disable-next-line consistent-return
      fs.writeFile(output, JSON.stringify(results), (err) => {
        if (err) {
          return 'There was an error when fetching the data';
        }
      });
    })
      .catch(() => 'There was an error when fetching the data');
  };

  fetchFromGoogleNews();

  const newsData = () => {
    const output = `${baseDirectory}news.json`;
    const newsUpdate = fs.readFileSync(output).toString();
    const news = JSON.parse(newsUpdate);
    let newsInfo = '';
    for (let i = 0; i < 10; i++) {
      const { title } = news[i];
      const { subtitle } = news[i];
      const { link } = news[i];
      const { source } = news[i];
      const { time } = news[i];
      newsInfo += `\n\n*${title}* \n${subtitle} \n[${source}](${link}) \n${time}`;
    }
    return newsInfo;
  };

  const fetchFromYoutube = () => {
    const keyword = 'Coronavirus video';
    const output = `${baseDirectory}video.json`;

    search(keyword, { type: 'video', limit: 50 }).then((results) => {
      // eslint-disable-next-line consistent-return
      fs.writeFile(output, JSON.stringify(results), (err) => {
        if (err) {
          return 'There was an error when fetching the data';
        }
      });
    }).catch(() => 'There was an error when fetching the data');
  };

  fetchFromYoutube();

  const videoData = () => {
    const output = `${baseDirectory}video.json`;
    const videoUpdate = fs.readFileSync(output).toString();
    const video = JSON.parse(videoUpdate);

    let videoInfo = '';
    for (let i = 0; i < 10; i++) {
      const { title } = video[i];
      const { description } = video[i];
      const { link } = video[i];
      const { channel } = video[i];
      const channelLink = video[i].channel_link;
      const uploadDate = video[i].upload_date;
      videoInfo += `\n\n*${title}* \n${description} \nBy [${channel}](${channelLink}) uploaded *${uploadDate}* \n[Watch now](${link})`;
    }
    return videoInfo;
  };

  const subscribers = loadSubscribers();
  subscribers.forEach((subscriber) => {
    bot.sendMessage(
      subscriber.id,
      `*CoronaX Daily News Update* ${newsData()}`,
      { parse_mode: 'Markdown' }
    );
    bot.sendMessage(
      subscriber.id,
      `*CoronaX Daily Video Update* \n${videoData()}`,
      { parse_mode: 'Markdown' }
    );
  });
};

module.exports = {
  subscribe,
  unsubscribe,
  start,
  log,
  dailyUpdate
};
