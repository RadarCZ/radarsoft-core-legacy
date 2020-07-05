// import axios from 'axios'
import fs from 'fs';
import path from 'path';

import { logger } from '../../config/winston';
import { Niclus } from '../../telegram/niclus/Niclus';
import { WebhookBodyTypes } from '../../util/enums';
import { TelegramWebhookInlineQuery } from '../../util/structs/telegramWebhookInlineQuery';
import { IAsyncRadarsoftHandler } from '../IRadarsoftHandler';

export const processWebhook: IAsyncRadarsoftHandler = async (req, res) => {
	const { botToken } = req.query;
	let bodyObjectName = WebhookBodyTypes.MESSAGE;
	switch (botToken) {
		case process.env.TG_BOT_TOKEN:
			break;
		case process.env.TG_STICKER_BOT_TOKEN:
			bodyObjectName = WebhookBodyTypes.INLINE_QUERY;
			break;
	}

	const { from } = req.body[bodyObjectName];

	logger.info(JSON.stringify(from));

	if (!from['is_bot']) {
		switch (bodyObjectName) {
			case WebhookBodyTypes.MESSAGE:
				const { text } = req.body.message;
				if (from['is_bot']) {
					res.status(401).end();

					return;
				}
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
				break;
			case WebhookBodyTypes.INLINE_QUERY:
				const niclus = new Niclus(req.body['inline_query'] as TelegramWebhookInlineQuery);
				await niclus.processInlineQuery();
				res.status(200).end();
				break;
		}
	} else {
		res.status(401).end();
	}
};
