import fs from 'fs'
import path from 'path'
import url from 'url'

import { logger } from '../../config/winston'

export const queue = async (req, res, next) => {
  const { fullLink, artistLink, postLink, origin } = req.body
  if (!(fullLink && artistLink && postLink && origin)) {
    logger.error(`Invalid request => ${req}`)
    res.status(400).end()

    return
  }

  // add to queue
  const postPath = url.parse(postLink).pathname
  const postPathSegments = (!!postPath ? postPath.split('/') : [])
  if (postPathSegments.length < 3) {
    logger.error('not a valid queue link')
    res.status(400).end()

    return
  }

  const postId = parseInt(postPathSegments[2], 10)

  const queueDirectory = path.join(process.cwd(), 'data/telegram/queue')
  const postedDirectory = path.join(process.cwd(), 'data/telegram/posted')
  const queueFilePath = path.join(queueDirectory, `${postId}.json`)
  const postedFilePath = path.join(postedDirectory, `${postId}.json`)

  if (!fs.existsSync(queueDirectory)) {
    fs.mkdirSync(queueDirectory, { 'recursive': true })
  }

  if (!fs.existsSync(postedDirectory)) {
    fs.mkdirSync(postedDirectory, { 'recursive': true })
  }

  if (!fs.existsSync(postedFilePath)) {
    fs.writeFileSync(queueFilePath, JSON.stringify(req.body))
  } else {
    logger.info('Image was already posted.')
  }

  logger.info(`Queue for post '${postId}' handled.`)
  res.status(200).end()
}
