import url from 'url';

import { QueueEntry } from '../../entity/QueueEntry';
import { logger } from '../../config/winston';
import { getPackageJsonVersion } from '../../util/misc';
import { IRadarsoftHandler } from '../IRadarsoftHandler';
import { getConnection } from 'typeorm';

export const queue: IRadarsoftHandler = async (req, res) => {
  if (req.params.botToken !== process.env.TG_BOT_TOKEN) {
    res.sendStatus(401);

    return;
  }

  const { fullLink, artistLink, postLink, origin, postId } = req.body;
  if (!(fullLink && artistLink && postLink && origin)) {
    logger.error(`Invalid request => ${req}`);
    res.sendStatus(400);

    return;
  }

  // add to queue
  const postPath = url.parse(postLink).pathname;
  const postPathSegments = (!!postPath ? postPath.split('/') : []);
  if (postPathSegments.length < 3) {
    logger.error('not a valid queue link');
    res.sendStatus(400);

    return;
  }

  await getConnection()
    .createQueryBuilder()
    .insert()
    .into(QueueEntry)
    .values({
      fullLink,
      artistLink,
      postLink,
      'postName': req.body.postName,
      origin,
      postId,
      'tgImageLink': (req.body.tgImageLink || fullLink),
      'tipLink' : req.body.tipLink,
      'postOriginIdComb': `${origin}_${postId}`,
      'savedWithApiVer': getPackageJsonVersion()
    })
    .onConflict('("postOriginIdComb") DO NOTHING')
    .execute();

  logger.info(`Queue for post '${postId}' handled.`);
  res.status(200).end();
};
