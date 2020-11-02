import path from 'path';

import axios, { AxiosResponse } from 'axios';
import moment from 'moment-timezone';
import { getConnection } from 'typeorm';

import { logger } from '../../config/winston';
import { QueueEntry } from '../../entity/QueueEntry';
import { getRandomNumber, getPackageJsonVersion } from '../../util/misc';

export const postToChannel:
(channelId: string, postId: number, queueLength: number) => Promise<boolean | Error>
  = async (channelId, postId, queueLength) => {
  	const data: object = {
  		'chat_id': channelId,
  	};

  	const random = getRandomNumber(`${+moment()}`, 100);
  	const kofi = random > 95;

  	logger.info(`Trying to post entry with postId == ${postId}`);
  	const queueEntry: QueueEntry | undefined = await getConnection()
  		.createQueryBuilder()
  		.select('queue_entry')
  		.from<QueueEntry>(QueueEntry, 'queue_entry')
  		.where('queue_entry.postId = :postId', { postId })
  		.getOne();

  	if (queueEntry) {
  		const { fullLink, artistLink, postLink, postName, tipLink } = queueEntry;
  		const postNameEscaped = (!!postName) ? postName.replace(/</g, '&lt;').replace(/>/g, '&gt;') : postLink;
  		const sendType = path.extname(fullLink) === '.gif' ? 'Document' : 'Photo';
  		const dataSendType = {
  			'Document': encodeURI(fullLink),
  			'Photo': encodeURI(fullLink)
  		};

  		data[sendType.toLowerCase()] = dataSendType[sendType];
  		// data['reply_markup'] = {
  		// 	'inline_keyboard': [
  		// 		[{ 'text': 'Full res', 'url': encodeURI(fullLink)}, { 'text': 'Poster\'s profile', 'url': artistLink}]
  		// 	]
		  // };
		  
		const captionSuffix = `\n<a href="${encodeURI(fullLink)}">Full resolution</a>\n<a href="${artistLink}">Poster's Profile</a>\n`; 
		data['caption'] = `<a href="${postLink}">${postNameEscaped}</a>\n`;
		data['caption'] += captionSuffix;
  		logger.info(`Submissions in queue: ${queueLength - 1}\n`);

  		if (tipLink) {
  			data['caption'] += `<a href="${tipLink}">Tip the artist!</a>\n`;
  		}

  		if (!tipLink && kofi) {
  			data['caption'] += '<a href="https://ko-fi.com/D1D0WKOS">Support me on Ko-fi</a> | <a href="https://paypal.me/HueHueRadar">Paypal.Me</a>';
  		}
  		data['parse_mode'] = 'HTML';

  		let postResult!: AxiosResponse;
  		try {
  			postResult =
        await axios.post(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/send${sendType}`, data);
  			if (postResult.status === 200) {
  				await getConnection()
  					.createQueryBuilder()
  					.update(QueueEntry)
  					.set({
  						'posted': true
  					})
  					.where('postId = :postId', { postId })
  					.execute();
  			}
  		} catch (error) {
  			if (error.response.data.error_code >= 400 && error.response.data.error_code < 500) {
  				const failedData = {
  					'chat_id': data['chat_id'],
  					'parse_mode': data['parse_mode'],
  					// 'reply_markup': data['reply_markup']
  				};

  				failedData['text'] = `<a href="${postLink}">${postNameEscaped}</a>\n`;
				  failedData['text'] += 'Image too big or FA down again. Click the above link to see the image.\n';
				  failedData['text'] += captionSuffix;

  				if (tipLink) {
  					failedData['text'] += `<a href="${tipLink}">Tip the artist!</a>\n`;
  				}

  				if (!tipLink && kofi) {
  					failedData['text'] += '<a href="https://ko-fi.com/D1D0WKOS">Support me on Ko-fi</a>\n';
  				}

  				postResult =
          await axios.post(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`, failedData);
  				if (postResult.status === 200) {
  					await getConnection()
  						.createQueryBuilder()
  						.update(QueueEntry)
  						.set({
  							'posted': true
  						})
  						.where('postId = :postId', { postId })
  						.execute();
  				}
  			}
  		} finally {
  			if (postResult?.data?.ok) {
  				const queueEntriesAndCount: [QueueEntry[], number] = await getConnection()
  					.createQueryBuilder()
  					.select('queue_entry')
  					.from<QueueEntry>(QueueEntry, 'queue_entry')
  					.where('queue_entry.posted = false')
  					.getManyAndCount();

  				const infoData = {
  					'chat_id': `${process.env.TG_INFO_CHANNEL_ID}`,
  					'parse_mode': 'HTML'
  				};

  				infoData['text'] = `<a href="https://t.me/RadarsPronz/${postResult.data.result.message_id}">New post in Radar\'s Image Stash</a>!\n`;
  				infoData['text'] += `Submissions in queue: ${queueEntriesAndCount[1]}\n\n`;
  				infoData['text'] += `<i>Saved with API v${queueEntry.savedWithApiVer}</i>\n`;
  				infoData['text'] += `<i>Current API version: ${getPackageJsonVersion()}</i>`;
  				await axios.post(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`, infoData);
  			}
  		}

  		return true;
  	}

  	return new Error(`There's no post with id '${postId}'`);
  };
