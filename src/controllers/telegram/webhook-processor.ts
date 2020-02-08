// import axios from 'axios'
import fs from 'fs';
import path from 'path';
import { IRadarsoftHandler } from '../IRadarsoftHandler';

export const processWebhook: IRadarsoftHandler = (req, res) => {
  const { botToken } = req.query;
  const { from, text } = req.body.message;
  if (botToken === process.env.TG_BOT_TOKEN && !from['is_bot']) {
    if (text && text.startsWith('/subscribe')) {
      const subscribersFile = path.join(process.cwd(), 'data/subscribers.json');
      if (!fs.existsSync(subscribersFile)) {
        fs.writeFileSync(subscribersFile, '[]');
      }

      const rawData = fs.readFileSync(subscribersFile, 'utf8');
      const jsonData: string[] = JSON.parse(rawData);

      jsonData.push(`${from.id}`);

      fs.writeFileSync(subscribersFile, JSON.stringify(jsonData));
    }
    res.status(200).end();
  } else {
    res.status(401).end();
  }
};
