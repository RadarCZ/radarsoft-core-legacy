import { logger } from '../../config/winston'

export default (req, res, next) => {
  logger.info(`${req.ip} - ${req.method} - url: ${req.url} - origUrl: ${req.originalUrl}`)
  logger.info('PARAMS')
  logger.info(JSON.stringify(req.params))
  logger.info('QUERY')
  logger.info(JSON.stringify(req.query))
  logger.info('REQUEST BODY:')

  logger.info(`HEADERS:`)

  res.on('finish', () => {
    logger.info('Getting RESPONSE')
    logger.info(JSON.stringify(res.body))
    logger.info(`${res.statusCode} ${res.statusMessage}; ${res.get('Content-Length') || 0}b sent`)
  })
  next()
}
