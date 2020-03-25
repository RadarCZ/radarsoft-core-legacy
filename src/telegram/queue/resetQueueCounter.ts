import axios from 'axios';
import moment from 'moment';
import { getConnection, getRepository } from 'typeorm';

import { SavedQueueEntries } from '../../entity/SavedQueueEntries';

export const resetQueueCounter: () => void = async () => {
	const lastDayCounter: SavedQueueEntries | undefined = await getConnection()
		.createQueryBuilder()
		.select('saved_queue_entries')
		.from<SavedQueueEntries>(SavedQueueEntries, 'saved_queue_entries')
		.orderBy('saved_queue_entries.id', 'DESC')
		.limit(1)
		.getOne();
	if (lastDayCounter) {
		const yesterdayDate: moment.Moment = moment().subtract(1, 'day');
		const telegramData = {
			'chat_id': `${process.env.TG_INFO_CHANNEL_ID}`,
			'text': `<b>${yesterdayDate.format('YYYY-MM-DD')}</b>\nSubmissions added to queue: ${lastDayCounter.entries}`,
			'parse_mode': 'HTML'
		};
		await axios.post(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`, telegramData);
	}

	const newCounter = new SavedQueueEntries();
	await getRepository(SavedQueueEntries).insert(newCounter);
};
