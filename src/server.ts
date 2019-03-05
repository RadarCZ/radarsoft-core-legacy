import app from './app'
import { logger } from './config/winston'

const server = app.listen(app.get('port'), () => {
  logger.info(`App is running at http://localhost:${app.get('port')} in ${app.get('env')} mode`)

  logger.info('Press CTRL-C to stop')
})

export default server
