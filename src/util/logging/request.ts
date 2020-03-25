import { Request, Response, NextFunction } from 'express';

import { logger } from '../../config/winston';

export const requestLogger: (req: Request, res: Response, next: NextFunction) => void = (req, res, next ) => {
	logger.info(`${req.ip} - ${req.method} - url: ${req.url} - origUrl: ${req.originalUrl}`);

	res.on('finish', () => {
		logger.info(`${res.statusCode} ${res.statusMessage}; ${res.get('Content-Length') || 0}b sent`);
	});
	next();
};
