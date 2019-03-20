import app from './app'
import { logger } from './config/winston'
import axios from 'axios'

const server = app.listen(app.get('port'), () => {
  logger.info(`App is running at http://localhost:${app.get('port')} in ${app.get('env')} mode`)

  axios.post(`https://api.telegram.org/bot360519519:AAElpulEf9vY-cDU5AEJ0rri57GhWFk2COY/setWebhook`, {
    "url" : `https://radarsoft.cz/api/telegram/processUpdate?botToken=${process.env.TG_BOT_TOKEN}`,
    "allowed_updates" : ["message"]
  }).then((data) => {
    logger.info('Telegram WebHook endpoint set.')
  }).catch(logger.info)

  logger.info('Press CTRL-C to stop')
})

export default server
