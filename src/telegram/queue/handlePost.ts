import moment from 'moment-timezone';
import { getConnection } from 'typeorm';
import { logger } from '../../config/winston';
import { getRandomNumber } from '../../util/misc';
import { QueueEntry } from '../../entity/QueueEntry';
import { postToChannel } from '.';

export const handlePost: () => void = async () => {
	const queueEntriesAndCount: [QueueEntry[], number] = await getConnection()
		.createQueryBuilder()
		.select('queue_entry')
		.from<QueueEntry>(QueueEntry, 'queue_entry')
		.where('queue_entry.posted = false')
		.getManyAndCount();

	const queueEntries = queueEntriesAndCount[0];
	const queueLength = queueEntriesAndCount[1];
	if (queueLength < 1) {
		logger.info('Nothing to post.');

		return;
	}

	const availableOrigins: string[] = queueEntries.reduce((origins, entry) => {
		const origin = entry.origin;
		if (origins.includes(origin)) {
			return origins;
		}

		return [ ...origins, origin ];
	}, [] as string[]);

	let chosenOrigin = '';

	const random = getRandomNumber(`${+moment()}`, 1000);
	let chanceMin = 0;
	let chanceMax = Math.floor(1000 / availableOrigins.length);

	for (const origin of availableOrigins) {
		if (random > chanceMin && random <= chanceMax) {
			chosenOrigin = origin;
			break;
		}

		chanceMin = chanceMax;
		chanceMax += chanceMin;
	}

	const applicableEntries: QueueEntry[] = queueEntries.filter(entry => entry.origin === chosenOrigin);
	const applicablePostIds: number[] = applicableEntries.map(entry => entry.postId);

	const postIdToBePosted = Math.min(...applicablePostIds);

	if (!postIdToBePosted) {
		logger.info('Bot made fucky wucky uwu Twying in wone minwute 0w0');
		setTimeout(handlePost, 60000);

		return;
	}

	const postResult: boolean | Error =
		await postToChannel(`${process.env.TG_MAIN_CHANNEL_ID}`, postIdToBePosted, queueLength);

	if (postResult === true) {
		logger.info('Post successful.');
	} else {
		logger.info(`Post failed${typeof postResult !== 'boolean' ? ' (error follows)' : ''}.`);
		if (typeof postResult !== 'boolean') {
			logger.error(postResult as object);
		}
	}
};
