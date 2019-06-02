import { logger, mailLogger } from '../../config/winston'

export default (err, req, res, next) => {
  logger.error(JSON.stringify(err.stack))

  // HANDLE ERROR ACCORDING TO ITS KIND
  if (err.kind === 'not-found') {
    res.status(404)
    res.send({ 'item': err.item, 'errors': ['Not found'] })
  } else {
    res.status(err.status || 500)
    res.send({ 'message': err.stack })
  }

  if (process.env.FORWARD_ERRORS_TO_EMAIL) {
    mailLogger.error({ 'error': err, 'req': req, 'res': res })
  }
}
