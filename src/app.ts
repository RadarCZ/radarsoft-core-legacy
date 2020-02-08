import path from 'path';
import { errorLogger, requestLogger } from './util/logging';
import { getGcData } from './controllers/contacts/geocaching-controller';
import { getGhData } from './controllers/contacts/github-controller';
import { processWebhook } from './controllers/telegram/webhook-processor';
import { queue } from './controllers/telegram/queue-controller';
import { kofiDongnation } from './controllers/dongnations/kofi-webhook';
import { relayETSPayload } from './controllers/trucksbook/tb-webhook';
import express, { Application } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

if (process.env.NODE_ENV === 'test') {
    dotenv.config({ 'path': path.join(process.cwd(), '.env.test') });
} else {
    dotenv.config({ 'path': path.join(process.cwd(), '.env') });
}

const app: Application = express();
app.use(bodyParser.json({ 'limit': '10240kb' }));
app.use(bodyParser.urlencoded({ 'extended': true }));

if (process.env.USE_REQUEST_LOGGING) {
    app.use(requestLogger);
}

app.set('port', process.env.PORT);
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/api/geocaching', getGcData);

app.get('/api/github', getGhData);

app.post('/api/telegram/processUpdate', processWebhook);

app.post('/api/telegram/:botToken/queue', queue);

if (process.env.USE_ERROR_LOGGING) {
    app.use(errorLogger);
}

app.post('/api/kofi/dongnation', kofiDongnation);

app.post('/api/trucksbook/:game', relayETSPayload);

export default app;
