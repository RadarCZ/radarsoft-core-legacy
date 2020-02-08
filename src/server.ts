import app from './app';
import { logger } from './config/winston';
import { handlePost } from './telegram/queue';
import Handlers from './twitch/handlers';
import TwitchClient from './twitch/TwitchClient';
import TwitchOptions from './twitch/TwitchOptions';
import { post2019nCovUpdate } from './util/2019nCov';
import axios from 'axios';

const server = app.listen(app.get('port'), () => {
  logger.info(`App is running at http://localhost:${app.get('port')} in ${app.get('env')} mode`);

  handlePost();
  post2019nCovUpdate();

  if (process.env.TG_BOT_TOKEN) {
    axios.post(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/setWebhook`, {
      'url' : `https://radarsoft.cz/api/telegram/processUpdate?botToken=${process.env.TG_BOT_TOKEN}`,
      'allowed_updates' : ['message']
    }).then(() => {
      logger.info('Telegram WebHook endpoint set.');
    }).catch(logger.info);
  } else {
    logger.warn('Unable to attach Telegram webhook, no token (TG_BOT_TOKEN)');
  }

  if (!!process.env.TWITCH_BOT_USERNAME
    && process.env.TWITCH_BOT_OAUTH
    && process.env.TWITCH_CHANNEL_NAME) {
      const options = new TwitchOptions(
        process.env.TWITCH_BOT_USERNAME,
        process.env.TWITCH_BOT_OAUTH,
        process.env.TWITCH_CHANNEL_NAME);
      TwitchClient.create(options, Handlers);
      TwitchClient.getInstance().connect();
    } else {
      logger.warn('Unable to connect to Twitch, missing credentials (TWITCH_BOT_USERNAME, TWITCH_BOT_OAUTH, TWITCH_CHANNEL_NAME)');
    }

  logger.info('Press CTRL-C to stop');
});

export default server;
