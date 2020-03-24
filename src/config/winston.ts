import { createLogger, format, transports } from 'winston';

const { combine } = format;

const tsFormat: () => string = () => (new Date()).toLocaleTimeString();

const options = {
	'console': {
		'timestamp': tsFormat,
		'level': 'debug',
		'handleExceptions': true
	},
	'mail': {
		'timestamp': tsFormat,
		'level': 'error',
		'handleExceptions': true
	}
};

export const logger = createLogger({
	'exitOnError': false,
	'transports': [
		new transports.Console(options.console)
	],
	'format': combine(
		format.colorize(),
		format.timestamp(),
		format.align(),
		format.printf(info => `${info.level} - ${info.timestamp}: ${info.message}`)
	)
});
