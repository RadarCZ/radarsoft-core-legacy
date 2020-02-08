import { logger } from '../../config/winston';
import { Request, Response, NextFunction } from 'express';

export const requestLogger: (req: Request, res: Response, next: NextFunction) => void = (req, res, next ) => {
  logger.info(`${req.ip} - ${req.method} - url: ${req.url} - origUrl: ${req.originalUrl}`);
  logger.info('PARAMS');
  logger.info(JSON.stringify(req.params));
  logger.info('QUERY');
  logger.info(JSON.stringify(req.query));
  logger.info('REQUEST BODY:');

  logger.info('HEADERS:');

  res.on('finish', () => {
    logger.info(`${res.statusCode} ${res.statusMessage}; ${res.get('Content-Length') || 0}b sent`);
  });
  next();
};
