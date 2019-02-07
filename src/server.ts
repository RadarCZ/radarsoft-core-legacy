import app from './app'
import { logger } from './config/winston'

const server = app.listen(app.get('port'), () => {
  logger.info(`App si running at http://localhost:${app.get('port')} in ${app.get('env')} mode\n`)

  logger.info('Press CTRL-C to stop\n')
})

export default server
