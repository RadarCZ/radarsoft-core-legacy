import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import { errorLogger, requestLogger } from './util/logging'

if (process.env.NODE_ENV === 'test') {
    dotenv.config({ 'path': path.join(process.cwd(), '.env.test') })
} else {
    dotenv.config({ 'path': path.join(process.cwd(), '.env') })
}

const app = express()
app.use(bodyParser.json({ 'limit': '10240kb' }))
app.use(bodyParser.urlencoded({ 'extended': true }))

if (process.env.USE_REQUEST_LOGGING) {
    app.use(requestLogger)
}

app.set('port', process.env.PORT)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

import { getGcData } from './controllers/contacts/geocaching-controller'
app.get('/api/geocaching', getGcData)

import { getGhData } from './controllers/contacts/github-controller'
app.get('/api/github', getGhData)

import { processWebhook } from './controllers/telegram/webhook-processor'
app.post('/api/telegram/processUpdate', processWebhook)

import { queue } from './controllers/telegram/queue-controller'
app.post('/api/telegram/queue', queue)

if (process.env.USE_ERROR_LOGGING) {
    app.use(errorLogger)
}

import { kofiDongnation } from './controllers/dongnations/kofi-webhook'
app.post('/api/kofi/dongnation', kofiDongnation)

export default app
