import { logger } from '../../config/winston';

export const connectedHandler: (address: string, port: number) => void = (address, port) => {
	logger.info(`Connected to ${address}:${port}`);
};
