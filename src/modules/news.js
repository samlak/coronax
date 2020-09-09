const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

const baseDirectory = path.join(__dirname, '../data/');

// eslint-disable-next-line consistent-return
const newsUpdate = async (bot, msg) => {
  const country = msg.text.split('/news ')[1];

  const fetchFromGoogleNews = (keyword, location, timeframe, output, callback) => {
    fetch(`https://news.google.com/search?q=${keyword}${location} when:${timeframe}`).then((res) => res.text()).then((data) => {
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

      if (output) {
        return Promise.all(results.map(
          (article) => fetch(article.link).then((res) => res.text())
            .then((articleData) => {
              const load = cheerio.load(articleData);
              article.link = load('c-wiz a[rel=nofollow]').attr('href');
              return article;
            })
        ))
          .then((finalData) => finalData)
          .catch(() => results);
      // eslint-disable-next-line no-else-return
      } else {
        return results;
      }
    })
      .then((results) => {
        if (output) {
          // eslint-disable-next-line consistent-return
          fs.writeFile(output, JSON.stringify(results), (err) => {
            if (err) {
              return bot.sendMessage(msg.chat.id, 'There was an error when fetching the data');
            }
          });
        } else {
          callback(results);
        }
      })
      .catch(() => bot.sendMessage(msg.chat.id, 'There was an error when fetching the data'));

    if (output) {
      if (!fs.existsSync(output)) {
        bot.sendMessage(msg.chat.id, 'There was an error when fetching the data. Please try again');
      }
    }
  };

  if (country) {
    const location = `in ${country}`;
    const keyword = 'Coronavirus news ';
    const timeframe = '7d';

    fetchFromGoogleNews(keyword, location, timeframe, null, (news) => {
      const newsData = (start, stop) => {
        let newsInfo = '';
        const newStop = stop > news.length ? news.length : stop;
        for (let i = start; i < newStop; i++) {
          const { title } = news[i];
          const { subtitle } = news[i];
          const { link } = news[i];
          const { source } = news[i];
          const { time } = news[i];
          newsInfo += `\n\n*${title}* \n${subtitle} \n[${source}](${link}) \n${time}`;
        }

        const keyboard = [];
        const pages = news.length / 10;
        const lastPage = pages >= 8 ? 8 : pages;

        for (let i = 0; i < lastPage; i++) {
          keyboard.push({ text: Number(i) + 1, callback_data: i });
        }

        bot.sendMessage(
          msg.chat.id,
          `*Coronavirus news ${location}* ${newsInfo}`,
          {
            reply_markup: {
              inline_keyboard: [
                [{ text: 'Source (Google News)', url: `https://news.google.com/search?q=${keyword}${location} when:${timeframe}` }],
                keyboard
              ]
            },
            parse_mode: 'Markdown'
          }
        );
      };

      bot.on('callback_query', (data) => {
        const currentNum = data.data;
        const start = Number(currentNum) * 10;
        const stop = Number(start) + 10;

        return newsData(start, stop);
      });

      return newsData(0, 10);
    });
  } else {
    const location = 'around the world';
    const keyword = 'Coronavirus news ';
    const output = `${baseDirectory}news.json`;
    const timeframe = '7d';

    let lastModified;
    if (fs.existsSync(output)) {
      const fileModified = fs.statSync(output);
      const lastModifiedTimestamp = fileModified.mtime.getTime();
      lastModified = Math.round((new Date() - lastModifiedTimestamp) / 60000);
    } else {
      lastModified = 'noFile';
    }

    if (lastModified >= 15 || lastModified === 'noFile') {
      return fetchFromGoogleNews(keyword, location, timeframe, output, null);
    }

    const newsUpdateFromFile = fs.readFileSync(output).toString();
    const news = JSON.parse(newsUpdateFromFile);

    const newsData = (start, stop) => {
      let newsInfo = '';
      const newStop = stop > news.length ? news.length : stop;
      for (let i = start; i < newStop; i++) {
        const { title } = news[i];
        const { subtitle } = news[i];
        const { link } = news[i];
        const { source } = news[i];
        const { time } = news[i];
        newsInfo += `\n\n*${title}* \n${subtitle} \n[${source}](${link}) \n${time}`;
      }

      const keyboard = [];
      const pages = news.length / 10;
      const lastPage = pages >= 8 ? 8 : pages;

      for (let i = 0; i < lastPage; i++) {
        keyboard.push({ text: Number(i) + 1, callback_data: i });
      }

      bot.sendMessage(
        msg.chat.id,
        `*Coronavirus news ${location}* ${newsInfo} \n\nTo access country specific news, use */news country* e.g */news Canada*`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Source (Google News)', url: `https://news.google.com/search?q=${keyword}${location} when:${timeframe}` }],
              keyboard
            ]
          },
          parse_mode: 'Markdown'
        }
      );
    };

    bot.on('callback_query', (data) => {
      const currentNum = data.data;
      const start = Number(currentNum) * 10;
      const stop = Number(start) + 10;

      return newsData(start, stop);
    });

    return newsData(0, 10);
  }
};

module.exports = { newsUpdate };
