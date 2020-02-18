import { logger } from '../../config/winston';
import { getRandomNumber } from '../../util/misc';
import { QueueEntry } from '../../entity/QueueEntry';
import { QueuePostTime } from '../../entity/QueuePostTime';
import { postToChannel } from './post';
import moment, { Moment } from 'moment-timezone';
import { getConnection, getRepository } from 'typeorm';

export const handlePost: () => void = async () => {
  const queuePostTime: QueuePostTime | undefined = await getConnection()
    .createQueryBuilder()
    .select('queue_post_time')
    .from<QueuePostTime>(QueuePostTime, 'queue_post_time')
    .getOne();

  const currentTime = moment.tz('Europe/Prague');
  let lastPostTime: Moment = currentTime;

  if (queuePostTime) {
    lastPostTime = moment.tz(queuePostTime.nextPostDatetime, 'Europe/Prague');
  }

  let nextPostMilliseconds = 0;

  if (lastPostTime.isSameOrBefore(currentTime)) {
    const queueEntriesAndCount: [QueueEntry[], number] = await getConnection()
      .createQueryBuilder()
      .select('queue_entry')
      .from<QueueEntry>(QueueEntry, 'queue_entry')
      .where('queue_entry.posted = false')
      .getManyAndCount();

    const queueEntries = queueEntriesAndCount[0];
    const queueLength = queueEntriesAndCount[1];
    if (queueLength < 1) {
      logger.info('Nothing to post, waiting 1 minute.');
      setTimeout(handlePost, 60000);

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

    const newInterval: number = generateInterval(queueLength);
    const nextPostTime: Moment = moment(currentTime).add(newInterval, 'm');
    const postResult: boolean | Error =
      await postToChannel(`${process.env.TG_MAIN_CHANNEL_ID}`, postIdToBePosted, nextPostTime, queueLength);
    nextPostMilliseconds = newInterval * 60 * 1000;
    if (postResult === true) {
      logger.info(`Post successful. Next post in ${newInterval} minutes.`);
    } else {
      logger.info(`Post failed${typeof postResult !== 'boolean' ? ' (error follows)' : ''}.`);
      logger.info(`Next post in ${newInterval} minutes.`);
      if (typeof postResult !== 'boolean') {
        logger.error(postResult as object);
      }
    }

    const newPostTime: QueuePostTime = {
      'id': 1,
      'nextPostDatetime': nextPostTime.toISOString(true)
    };

    const postTimeRepository = getRepository(QueuePostTime);
    await postTimeRepository.save<QueuePostTime>(newPostTime);

  } else {
    nextPostMilliseconds = lastPostTime.diff(currentTime);
  }

  setTimeout(handlePost, nextPostMilliseconds);
};

const generateInterval: (filesCount: number) => number = filesCount => {
  const randomSeedBase: number = moment().unix().valueOf();
  const randomForInterval = getRandomNumber(`${randomSeedBase}`, 101);
  const randomSeedFinal = `${randomSeedBase / randomForInterval}`;
  const filesInRegularInterval = (filesCount >= 200 && filesCount <= 1000);
  let randomDuration: number;
  if (filesInRegularInterval) {
    if (randomForInterval <= 12) {
      randomDuration = getRandomNumber(randomSeedFinal, 5) + 1;
    } else if (randomForInterval > 12 && randomForInterval <= 22) {
      randomDuration = getRandomNumber(randomSeedFinal, 10) + 5;
    } else {
      randomDuration = getRandomNumber(randomSeedFinal, 15) + 15;
    }
  } else {
    if (filesCount < 200) {
      randomDuration = getRandomNumber(randomSeedFinal, 15) + 15;
    } else {
      randomDuration = getRandomNumber(randomSeedFinal, 5) + 1;
    }
  }

  return randomDuration;
};
