import url from 'url';
import { QueueEntry } from '../../entity/QueueEntry';
import { logger } from '../../config/winston';
import { getPackageJsonVersion } from '../../util/misc';
import { QueueEntryOrigin } from '../../util/enums';
import { IRadarsoftHandler } from '../IRadarsoftHandler';
import { Login, Submission } from 'radars-furaffinity-api';
import { Submission as SubmissionType } from 'radars-furaffinity-api/dist/interfaces';
import { getConnection, Connection } from 'typeorm';

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

export const bulkFaQueue: IRadarsoftHandler = async (req, res) => {
  if (req.params.botToken !== process.env.TG_BOT_TOKEN) {
    res.sendStatus(401);

    return;
  }

  const { postIds } = req.body;
  if (!postIds || postIds.length < 1) {
    logger.error(`Invalid request => ${req}`);
    res.sendStatus(400);

    return;
  }

  Login(`${process.env.FA_COOKIE_A}`, `${process.env.FA_COOKIE_B}`);

  // const lastRow = await getConnection()
  //   .createQueryBuilder()
  //   .select('queue_entry')
  //   .from<QueueEntry>(QueueEntry, 'queue_entry')
  //   .orderBy('queue_entry.id', 'DESC')
  //   .getOne();

  // let maxId = 0;
  // if (lastRow) {
  //   maxId = lastRow.id;
  // }

  const connection: Connection = getConnection();
  const queryRunner = connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    // let idSubstract = 0;
    for (let i = 0, j = postIds.length; i < j; i++) {
      const submission: SubmissionType | null = await Submission(postIds[i]);
      if (submission) {
        const existingResult = await getConnection()
          .createQueryBuilder()
          .select('queue_entry')
          .from<QueueEntry>(QueueEntry, 'queue_entry')
          .where('queue_entry.postOriginIdComb = :postId', { 'postId': `FA_${postIds[i]}` })
          .getOne();
        if (existingResult) {
          // idSubstract++;
          continue;
        }

        // const newId = maxId + (i + 1 - idSubstract);
        const newEntry = new QueueEntry();
        newEntry.postId = postIds[i];
        newEntry.origin = QueueEntryOrigin.FA;
        newEntry.postLink = submission.url;
        newEntry.artistLink = `http://furaffinity.net/user/${submission.author.id}`;
        newEntry.fullLink = submission.downloadUrl;
        newEntry.postOriginIdComb = `FA_${postIds[i]}`;
        newEntry.savedWithApiVer = `${getPackageJsonVersion()}-bulk`;
        newEntry.postName = submission.title;
        newEntry.posted = false;
        newEntry.tgImageLink = submission.downloadUrl;

        await queryRunner.manager.save(newEntry);
        if (!submission.favLink.includes('unfav')) {
          await submission.fave();
        }
      }
    }
    await queryRunner.commitTransaction();
    res.status(200).end();
  } catch (err) {
    await queryRunner.rollbackTransaction();
    logger.error(err);
    res.sendStatus(500);
  } finally {
    await queryRunner.release();
  }
};
