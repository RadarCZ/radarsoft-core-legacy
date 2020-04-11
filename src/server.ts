import axios from 'axios';
import { CronJob } from 'cron';
import { createConnection } from 'typeorm';

import app from './app';
import { logger } from './config/winston';
import { handleNewVersionStartup } from './telegram/announceNewVersion';
import { handlePost, resetQueueCounter } from './telegram/queue';
import Handlers from './twitch/handlers';
import TwitchClient from './twitch/TwitchClient';
import TwitchOptions from './twitch/TwitchOptions';
import NCovTracker from './util/2019nCov';

const server = app.listen(app.get('port'), () => {
	createConnection().then(() => {
		logger.info(`App is running at http://localhost:${app.get('port')} in ${app.get('env')} mode`);

		const postJob: CronJob = new CronJob('*/4 * * * *', handlePost);
		postJob.start();

		const savedQueueResetJob: CronJob = new CronJob('0 0 * * *', resetQueueCounter);
		savedQueueResetJob.start();

		// const bttvReminderJob: CronJob = new CronJob('10 * * * *', remindBttv);

		const wuhan = new NCovTracker();
		const wuhanReport = (): void => {
			wuhan.report().catch(error => {
				logger.error('Covid19 report failed');
				logger.error(error);
			});
		};
		const wuhanLocalReport = (): void => {
			wuhan.reportLocal().catch(error => {
				logger.error('Covid19 report for Czechia failed');
				logger.error(error);
			});
		};

		const jobWuhan: CronJob = new CronJob('0 8-20/4 * * *', wuhanReport);
		const jobWuhanLocal: CronJob = new CronJob('0 18 * * *', wuhanLocalReport);
		jobWuhan.start();
		jobWuhanLocal.start();

		if (process.env.TG_BOT_TOKEN) {
			handleNewVersionStartup();
			axios.post(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/setWebhook`, {
				'url' : `https://radarsoft.cz/api/telegram/processUpdate?botToken=${process.env.TG_BOT_TOKEN}`,
				'allowed_updates' : ['message']
			}).then(() => {
				logger.info('Telegram WebHook endpoint set.');
			}).catch(logger.error);
		} else {
			logger.warn('Unable to attach Telegram webhook, no token (TG_BOT_TOKEN)');
		}

		if (!!process.env.TWITCH_BOT_USERNAME
      		&& process.env.TWITCH_BOT_OAUTH
      		&& process.env.TWITCH_CHANNEL_NAME) {
			const options = new TwitchOptions(process.env.TWITCH_BOT_USERNAME, process.env.TWITCH_BOT_OAUTH, process.env.TWITCH_CHANNEL_NAME);
			TwitchClient.create(options, Handlers);
			TwitchClient.getInstance().connect();
		} else {
			logger.warn('Unable to connect to Twitch, missing credentials (TWITCH_BOT_USERNAME, TWITCH_BOT_OAUTH, TWITCH_CHANNEL_NAME)');
		}

		logger.info('Press CTRL-C to stop');
	});
});

export default server;
