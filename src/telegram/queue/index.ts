import fs from 'fs';
import path from 'path';
import { logger } from '../../config/winston';
import { getRandomNumber } from '../../util/misc';
import { postToChannel } from './post';
import moment, { Moment } from 'moment-timezone';

export const handlePost: () => void = async () => {
  const queueNextPostTimeFile = path.join(process.cwd(), 'data/telegram/queue/.data.json');
  const queueFolder = path.join(process.cwd(), 'data/telegram/queue');
  const currentTime = moment.tz('Europe/Prague');
  let lastPostTime: Moment = currentTime;

  if (fs.existsSync(queueNextPostTimeFile)) {
    const rawData = fs.readFileSync(queueNextPostTimeFile, 'utf8');
    const jsonData = JSON.parse(rawData);
    lastPostTime = moment.tz(jsonData.nextPost, 'Europe/Prague');
  }

  let nextPostMilliseconds = 0;

  if (lastPostTime.isSameOrBefore(currentTime)) {
    let allFiles: fs.Dirent[] = [];
    if (fs.existsSync(queueFolder)) {
      allFiles = fs.readdirSync(queueFolder, { 'withFileTypes': true }).filter(fsEntry => {
        return (!fsEntry.name.startsWith('.') && fsEntry.isFile());
      });
    }

    if (allFiles.length < 1) {
      logger.info('Nothing to post, waiting 1 minute.');
      setTimeout(handlePost, 60000);

      return;
    }

    const availableOrigins: string[] = allFiles.reduce((origins, file) => {
      const origin = file.name.substring(0, 2);
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

    const applicableFiles: fs.Dirent[] = allFiles.filter(file => file.name.startsWith(chosenOrigin));
    const applicableFileIds: number[] = applicableFiles.map(file => {
      const fileName = file.name;
      const idString = fileName.substring(fileName.lastIndexOf('_') + 1, fileName.lastIndexOf('.'));

      return parseInt(idString, 10);
    });

    const idToBePosted = Math.min(...applicableFileIds);
    const chosenFile = allFiles.find(file => file.name === `${chosenOrigin}_${idToBePosted}.json`);

    if (!chosenFile) {
      logger.info('Bot made fucky wucky uwu Twying in wone minwute 0w0');
      setTimeout(handlePost, 60000);

      return;
    }

    const filesCount = allFiles.length;
    const newInterval: number = generateInterval(filesCount);
    const nextPostTime: Moment = moment(currentTime).add(newInterval, 'm');
    const postResult: boolean | Error =
      await postToChannel(`${process.env.TG_MAIN_CHANNEL_ID}`, chosenFile.name, nextPostTime, filesCount);
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

    const writeData = {
      'nextPost': nextPostTime.format()
    };
    fs.writeFileSync(queueNextPostTimeFile, JSON.stringify(writeData));

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
