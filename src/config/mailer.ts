import nodemailer from 'nodemailer'
import os from 'os'
import { filterKeys } from '../util/misc'

const getTransport = async () => {
  let mailConfig: any
  if (process.env.NODE_ENV === 'test') {
    const account = await nodemailer.createTestAccount()
    mailConfig = {
      'host': account.smtp.host,
      'port': account.smtp.port,
      'secure': account.smtp.secure,
      'auth': {
        'user': account.user,
        'pass': account.pass
      }
    }
  } else {
    mailConfig = {
      'service': process.env.NODEMAILER_SERVICE,
      'auth': {
        'user': process.env.NODEMAILER_USER,
        'pass': process.env.NODEMAILER_PASS
      }
    }
  }

  return nodemailer.createTransport(mailConfig)
}

const defaultOptions = {
  'from': `"${process.env.NODEMAILER_SENDER_NAME}" <${process.env.NODEMAILER_SENDER_EMAIL}>`, // sender address
  'to': [process.env.NODEMAILER_RECIPIENT_EMAIL], // list of default receivers
}

export const sendErrorEmail = async (errorObj) => {
  const req = errorObj.message.req
  const statusCode = errorObj.message.res.statusCode
  let errorBody = `There was an error in app:
  ERROR: ${JSON.stringify(filterKeys(['item'], errorObj.message.error, true))}
  TIMESTAMP: ${errorObj.timestamp}
  `
  if (req) {
    errorBody += `
    REQUEST INFO: ${req.ip} - ${req.method} - url: ${req.url} - origUrl: ${req.originalUrl}
    PARAMS: ${JSON.stringify(req.params)}
    BODY: ${JSON.stringify(filterKeys(['password'], req.body, true))}
    `
  }

  if (errorObj.message.error) {
    errorBody += `
    ERROR STACK:
    ${JSON.stringify(errorObj.message.error.stack)}
    `
  }

  const statusMsg = statusCode.toString()[0] === '4' ? 'info' : 'error'

  const errorOpts = {
    'subject': `[${statusMsg}][${os.hostname()}] Problem accessing ${req.url}`,
    'text': errorBody,
    ...defaultOptions
  }

  const transporter = await getTransport()
  transporter.sendMail(errorOpts, (error, info) => {
    console.log('Message sent: %s', info.messageId)
    // Preview only available when sending through an Ethereal account
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
    }

    if (error) {
      return console.log(error);
    }
  })
}
