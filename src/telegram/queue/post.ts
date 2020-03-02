import path from 'path';
import { getRandomNumber } from '../../util/misc';
import { QueueEntry } from '../../entity/QueueEntry';
import { logger } from '../../config/winston';
import moment, { Moment } from 'moment-timezone';
import axios from 'axios';
import { getConnection } from 'typeorm';

export const postToChannel:
  (channelId: string, postId: number, nextPostTime: Moment, queueLength: number) => Promise<boolean | Error>
  = async (channelId, postId, nextPostTime, queueLength) => {
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
    data['reply_markup'] = {
      'inline_keyboard': [
        [{ 'text': 'Full res', 'url': encodeURI(fullLink)}, { 'text': 'Poster\'s profile', 'url': artistLink}]
      ]
    };
    data['caption'] = `<a href="${postLink}">${postNameEscaped}</a>\n\n`;
    logger.info(`Submissions in queue: ${queueLength - 1}\n`);

    if (tipLink) {
      data['caption'] += `\n\n<a href="${tipLink}">Tip the artist!</a>\n`;
    }

    if (!tipLink && kofi) {
      data['caption'] += '\n\n<a href="https://ko-fi.com/D1D0WKOS">Support me on Ko-fi</a>\n';
    }
    data['parse_mode'] = 'HTML';

    try {
      const postResult =
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

        return Promise.resolve(true);
      }
    } catch (error) {
      if (error.response.data.error_code >= 400 && error.response.data.error_code < 500) {
        const failedData = {
          'chat_id': data['chat_id'],
          'parse_mode': data['parse_mode'],
          'reply_markup': data['reply_markup']
        };

        failedData['text'] = `<a href="${postLink}">${postNameEscaped}</a>\n\n`;
        failedData['text'] += 'Image too big or FA down again. Click the above link to see the image.';

        if (tipLink) {
          failedData['text'] += `\n\n<a href="${tipLink}">Tip the artist!</a>\n`;
        }

        if (!tipLink && kofi) {
          failedData['text'] += '\n\n<a href="https://ko-fi.com/D1D0WKOS">Support me on Ko-fi</a>\n';
        }

        const postResult =
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

        return Promise.resolve(true);
      }

      return Promise.resolve(error);
    }
  }

  return new Error(`There's no post with id '${postId}'`);
};
