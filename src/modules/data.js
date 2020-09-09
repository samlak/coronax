/* eslint-disable linebreak-style */
const axios = require('axios');

const generalStatistics = 'https://disease.sh/v3/covid-19/all';
const countryStatistics = 'https://disease.sh/v3/covid-19/countries';

const worldwide = (bot, msg) => {
  axios.get(generalStatistics).then((result) => {
    const { cases } = result.data;
    const { deaths } = result.data;
    const { recovered } = result.data;

    axios.get(countryStatistics).then((country) => {
      const todayNewCases = country.data.filter((newCases) => newCases.todayCases)
        .map((affected) => affected.todayCases)
        .reduce((start, stop) => start + stop, 0);
      const todayDeathCases = country.data.filter((deathCases) => deathCases.todayDeaths)
        .map((affected) => affected.todayDeaths)
        .reduce((start, stop) => start + stop, 0);

      const criticalCases = country.data.filter((casesData) => casesData.critical)
        .map((affected) => affected.critical)
        .reduce((start, stop) => start + stop, 0);

      const countryAffected = country.data.length;
      bot.sendMessage(
        msg.chat.id,
        `*Coronavirus Global Statistics* \n\nTotal countries and territories affected *${countryAffected}*  \n\nTotal cases *${cases}* \nTotal deaths *${deaths}* \nTotal recovered *${recovered}* \nTotal critical *${criticalCases}* \n\nToday's cases *${todayNewCases}* \nToday's deaths *${todayDeathCases}* `,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Source (Disease.sh)', url: 'https://www.disease.sh' }]
            ]
          },
          parse_mode: 'Markdown'
        }
      );
    });
  }).catch(() => {
    bot.sendMessage(msg.chat.id, 'There was an error when fetching the data');
  });
};

const country = (bot, msg) => {
  axios.get(countryStatistics).then((result) => {
    const countryData = (start, stop, currentNum, next, previous) => {
      let countriesInfo = '';
      const countries = result.data;
      const totalPage = Math.ceil(Number(countries.length) / 10);
      const newStop = stop > countries.length ? countries.length : stop;
      for (let i = start; i < newStop; i++) {
        const countryName = countries[i].country;
        const { cases } = countries[i];
        const { todayCases } = countries[i];
        const { deaths } = countries[i];
        const { todayDeaths } = countries[i];
        const { recovered } = countries[i];
        const { critical } = countries[i];
        const countryInfo = `\nData for *${countryName}* \n\nTotal cases *${cases}* \nToday's cases *${todayCases}* \nTotal deaths *${deaths}* \nToday's deaths *${todayDeaths}* \nTotal recovered *${recovered}*  \nTotal critical *${critical}* \n`;
        countriesInfo += countryInfo;
      }

      let keyboard = [];

      if (currentNum === 0) {
        keyboard = [
          { text: 'First Page', callback_data: 0 },
          { text: 'Next', callback_data: next },
          { text: 'Last Page', callback_data: Number(totalPage) - 1 }
        ];
      } else if (currentNum === Number(totalPage) - 1) {
        keyboard = [
          { text: 'First Page', callback_data: 0 },
          { text: 'Previous', callback_data: previous },
          { text: 'Last Page', callback_data: Number(totalPage) - 1 }
        ];
      } else {
        keyboard = [
          { text: 'First Page', callback_data: 0 },
          { text: 'Previous', callback_data: previous },
          { text: 'Next', callback_data: next },
          { text: 'Last Page', callback_data: Number(totalPage) - 1 }
        ];
      }

      bot.sendMessage(
        msg.chat.id,
        `*Coronavirus Statistics by Country* \n*${countries.length}* countries has been affected by Coronavirus \nPage *${Number(currentNum) + 1}* of *${Number(totalPage) - 1}*\n ${countriesInfo} `,
        {
          reply_markup: {
            inline_keyboard: [keyboard]
          },
          parse_mode: 'Markdown'
        }
      );
    };

    bot.on('callback_query', (data) => {
      const currentNum = data.data;
      const start = Number(currentNum) * 10;
      const stop = Number(start) + 10;
      const next = Number(currentNum) + 1;
      const previous = Number(currentNum) - 1;

      return countryData(start, stop, currentNum, next, previous);
    });

    return countryData(0, 10, 0, 1, 0);
  }).catch(() => {
    bot.sendMessage(msg.chat.id, 'There was an error when fetching the data');
  });
};

const search = (bot, msg) => {
  const countryInput = msg.text.split('/search ')[1];
  if (countryInput) {
    axios.get(countryStatistics).then((result) => {
      const newData = result.data.map((countryData) => ({
        country: countryData.country.toLowerCase(),
        cases: countryData.cases,
        todayCases: countryData.todayCases,
        deaths: countryData.deaths,
        todayDeaths: countryData.todayDeaths,
        recovered: countryData.recovered,
        critical: countryData.critical
      }));

      const countryFound = newData.find(
        (affected) => affected.country === countryInput.toLowerCase()
      );

      if (!countryFound) {
        return bot.sendMessage(
          msg.chat.id,
          `No data found for *${country}*. \nYou might have made mistake when typing the country name or the country has no cases of coronavirus confirmed yet. If you made mistake when searching click /search for more information on how to search`,
          { parse_mode: 'Markdown' }
        );
      }
      const countryName = countryFound.country;
      const { cases } = countryFound;
      const { todayCases } = countryFound;
      const { deaths } = countryFound;
      const { todayDeaths } = countryFound;
      const { recovered } = countryFound;
      const { critical } = countryFound;
      const countryInfo = `\nSearch result for *${countryName}* \n\nTotal cases *${cases}* \nToday's cases *${todayCases}* \nTotal deaths *${deaths}* \nToday's deaths *${todayDeaths}* \nTotal recovered *${recovered}*  \nTotal critical *${critical}* \n`;

      return bot.sendMessage(
        msg.chat.id,
        countryInfo,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Source (Disease.sh)', url: 'https://www.disease.sh' }]
            ]
          },
          parse_mode: 'Markdown'
        }
      );
    }).catch(() => {
      bot.sendMessage(msg.chat.id, 'There was an error when fetching the data.');
    });
  } else {
    bot.sendMessage(
      msg.chat.id,
      'You can search the data of the affected countries. Type /search with space and the name of the country. For example, \'*/search Nigeria*\'',
      { parse_mode: 'Markdown' }
    );
  }
};

const help = (bot, msg) => {
  bot.sendMessage(
    msg.chat.id,
    'Welcome to *CoronaX* (COVID-19 information bot).'
    + '\nThis is *CoronaX* help portal. You can start using the bot with the command below:'
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
};

const notFound = (bot, msg) => {
  bot.sendMessage(
    msg.chat.id,
    'Sorry! I can\'t understand you. Please use /help to see the list of available command',
    { parse_mode: 'Markdown' }
  );
};

module.exports = {
  worldwide,
  country,
  search,
  help,
  notFound
};
