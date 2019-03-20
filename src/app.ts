import dotenv from 'dotenv'

if(process.env.NODE_ENV === 'test'){
    dotenv.config({ path: '.env.test'})
} else {
    dotenv.config({ path: '.env' })
}

import express from 'express'
// import bodyParser from 'body-parser'
import { requestLogger, errorLogger } from './util/logging'

const app = express()
// app.use(bodyParser.json({ limit: '10240kb' }))

if(process.env.USE_REQUEST_LOGGING) {
    app.use(requestLogger)
}

app.set('port', process.env.PORT)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

import { getGcData } from './controllers/contacts/geocaching-controller'
app.get('/api/geocaching', getGcData)

import { getGhData } from './controllers/contacts/github-controller'
app.get('/api/github', getGhData)

import { processWebhook } from "./controllers/telegram/webhook-processor"
app.post('/api/telegram/processUpdate', processWebhook)

if(process.env.USE_ERROR_LOGGING) {
    app.use(errorLogger)
}

export default app
