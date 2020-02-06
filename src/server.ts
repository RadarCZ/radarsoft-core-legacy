import axios from 'axios'
import app from './app'
import { logger } from './config/winston'
import { handlePost } from './telegram/queue';
import Handlers from './twitch/handlers'
import TwitchClient from './twitch/TwitchClient';
import TwitchOptions from './twitch/TwitchOptions';
import { post2019nCovUpdate } from './util/2019nCov';

const server = app.listen(app.get('port'), () => {
  logger.info(`App is running at http://localhost:${app.get('port')} in ${app.get('env')} mode`)

  handlePost()
  post2019nCovUpdate()

  axios.post(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/setWebhook`, {
    'url' : `https://radarsoft.cz/api/telegram/processUpdate?botToken=${process.env.TG_BOT_TOKEN}`,
    'allowed_updates' : ['message']
  }).then((data) => {
    logger.info('Telegram WebHook endpoint set.')
  }).catch(logger.info)

  if (!!process.env.TWITCH_BOT_USERNAME
    && process.env.TWITCH_BOT_OAUTH
    && process.env.TWITCH_CHANNEL_NAME) {
      const options = new TwitchOptions(
        process.env.TWITCH_BOT_USERNAME,
        process.env.TWITCH_BOT_OAUTH,
        process.env.TWITCH_CHANNEL_NAME)
      TwitchClient.create(options, Handlers)
      TwitchClient.getInstance().connect()
    }

  logger.info('Press CTRL-C to stop')
})

export default server
