import axios from 'axios'
import app from './app'
import { logger } from './config/winston'
import { handlePost } from './telegram/queue';

const server = app.listen(app.get('port'), () => {
  logger.info(`App is running at http://localhost:${app.get('port')} in ${app.get('env')} mode`)

  handlePost()

  axios.post(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/setWebhook`, {
    'url' : `https://radarsoft.cz/api/telegram/processUpdate?botToken=${process.env.TG_BOT_TOKEN}`,
    'allowed_updates' : ['message']
  }).then((data) => {
    logger.info('Telegram WebHook endpoint set.')
  }).catch(logger.info)

  logger.info('Press CTRL-C to stop')
})

export default server
