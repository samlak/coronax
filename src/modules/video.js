const search = require('scrape-youtube');
const fs = require('fs');
const path = require('path');

const baseDirectory = path.join(__dirname, '../data/');

const videoUpdate = (bot, msg) => {
  const keyword = 'Coronavirus video';
  const output = `${baseDirectory}video.json`;

  const fetchFromYoutube = () => {
    search(keyword, { type: 'video', limit: 50 }).then((results) => {
      // eslint-disable-next-line consistent-return
      fs.writeFile(output, JSON.stringify(results), (err) => {
        if (err) {
          return bot.sendMessage(msg.chat.id, 'There was an error when fetching the data');
        }
      });
    }).catch(() => bot.sendMessage(msg.chat.id, 'There was an error when fetching the data'));
  };

  let lastModified;
  if (fs.existsSync(output)) {
    const fileModified = fs.statSync(output);
    const lastModifiedTimestamp = fileModified.mtime.getTime();
    lastModified = Math.round((new Date() - lastModifiedTimestamp) / 60000);
  } else {
    lastModified = 'noFile';
  }

  if (lastModified >= 15 || lastModified === 'noFile') {
    fetchFromYoutube();
  }

  const videoUpdateFromFile = fs.readFileSync(output).toString();
  const video = JSON.parse(videoUpdateFromFile);

  const videoData = (start, stop) => {
    let videoInfo = '';
    const newStop = stop > video.length ? video.length : stop;
    for (let i = start; i < newStop; i++) {
      const { title } = video[i];
      const { description } = video[i];
      const { link } = video[i];
      const { channel } = video[i];
      const channelLink = video[i].channel_link;
      const uploadDate = video[i].upload_date;
      videoInfo += `\n\n*${title}* \n${description} \nBy [${channel}](${channelLink}) uploaded *${uploadDate}* \n[Watch now](${link})`;
    }
    const keyboard = [];
    const pages = video.length / 10;
    const lastPage = pages >= 10 ? 10 : pages;

    for (let i = 0; i < lastPage; i++) {
      keyboard.push({ text: Number(i) + 1, callback_data: i });
    }

    bot.sendMessage(
      msg.chat.id,
      `*Coronavirus related videos* ${videoInfo}`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Source (Youtube)', url: 'https://www.youtube.com' }],
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

    return videoData(start, stop);
  });

  return videoData(0, 10);
};

module.exports = { videoUpdate };
