import { createLogger, format, transports } from "winston"
import Transport from 'winston-transport'
import * as SystemMailer from './mailer'

const { combine } = format

const tsFormat = () => (new Date()).toLocaleTimeString()

const options = {
    console: {
        timestamp: tsFormat,
        level: 'debug',
        handleExceptions: true
    },
    mail: {
        timestamp: tsFormat,
        level: "error",
        handleExceptions: true
    }
}

class MailTransport extends Transport {
    constructor(opts) {
        super(opts);
        // Consume any custom options here. e.g.:
        // - Connection information for databases
        // - Authentication information for APIs (e.g. loggly, papertrail,
        //   logentries, etc.).
    }

    log(info, callback) {
        setImmediate(() => {
            this.emit("logged", info);
        });
        SystemMailer.sendErrorEmail(info)
        // send info to mail
        // Perform the writing to the remote service
        callback();
    }
}

export const logger = createLogger({
    exitOnError: false,
    transports: [
        new transports.Console(options.console)
    ],
    format: combine(
        format.colorize(),
        format.timestamp(),
        format.align(),
        format.printf(info => `${info.level} - ${info.timestamp}: ${info.message}`)
    )
})

export const mailLogger = createLogger({
    exitOnError: false,
    transports: [
        new MailTransport(options.mail)
    ],
    format: combine(
      format.timestamp(),
      format.simple(),
    ),
})