import dotenv from 'dotenv'

if(process.env.NODE_ENV === 'test'){
    dotenv.config({ path: '.env.test'})
} else {
    dotenv.config({ path: '.env' })
}

import express from 'express'
import cors from 'cors'
// import bodyParser from 'body-parser'
import { requestLogger, errorLogger } from './util/logging'

const app = express()
// app.use(bodyParser.json({ limit: '10240kb' }))

if(process.env.USE_REQUEST_LOGGING) {
    app.use(requestLogger)
}

app.set('port', process.env.PORT)
app.use(cors())

app.get('/', async (req, res) => res.send('Hello from Express.TS!'))

if(process.env.USE_ERROR_LOGGING) {
    app.use(errorLogger)
}

export default app
