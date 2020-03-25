import { Request, NextFunction, Response } from 'express';

import { logger } from '../../config/winston';

declare type ErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => void;

export const errorLogger: ErrorHandler = (err, req, res, next) => {
	logger.error(JSON.stringify(err.stack));

	// HANDLE ERROR ACCORDING TO ITS KIND
	if (err.kind === 'not-found') {
		res.status(404);
		res.send({ 'item': err.item, 'errors': ['Not found'] });
	} else {
		res.status(err.status || 500);
		res.send({ 'message': err.stack });
	}

	next();
};
