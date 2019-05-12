import { logger } from '../../config/winston'
import path from 'path'
import fs from 'fs'

const url = require('url')

export const queue = async (req, res, next) => {
  const { fullLink, artistLink, postLink, origin } = req.body
  if(!(fullLink && artistLink && postLink && origin)){
    logger.error(`Invalid request => ${req}`)
    res.status(400).end()
    return
  }

  // add to queue
  const postPathSegments = url.parse(postLink).pathname.split("/")
  const postId = parseInt(postPathSegments[2])

  const queueDirectory = path.join(process.cwd(), 'data/telegram/queue')
  const postedDirectory = path.join(process.cwd(),'data/telegram/posted')
  const queueFilePath = path.join(queueDirectory, `${postId}.json`)
  const postedFilePath = path.join(postedDirectory, `${postId}.json`)

  if(!fs.existsSync(queueDirectory)){
    fs.mkdirSync(queueDirectory, { recursive: true })
  }

  if(!fs.existsSync(postedDirectory)){
    fs.mkdirSync(postedDirectory, { recursive: true })
  }

  if(!fs.existsSync(postedFilePath)){
    fs.writeFileSync(queueFilePath, JSON.stringify(req.body))
  } else {
    logger.info('Image was already posted.')
  }

  logger.info(`Queue for post '${postId}' handled.`)
  res.status(200).end()
}
