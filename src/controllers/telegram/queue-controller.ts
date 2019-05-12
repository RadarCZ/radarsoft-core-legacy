import { logger } from '../../config/winston'
import path from 'path'
import fs from 'fs'

const url = require('url')

export const queue = async (req, res, next) => {
  const { fullLink, artistLink, postLink, origin } = req.data
  if(!(fullLink && artistLink && postLink && origin)){
    logger.error(`Invalid request => ${req}`)
    res.status(400).end()
    return
  }

  // add to queue
  const postPathSegments = url.parse(postLink).pathname.split("/")
  const postId = parseInt(postPathSegments[1])

  const queueFilePath = path.join(__dirname, `queue/${postId}.json`)
  const postedFilePath = path.join(__dirname, `posted/${postId}.json`)

  if(!fs.existsSync(postedFilePath)){
    fs.writeFileSync(queueFilePath, req.data)
  }

  logger.info(`Queue for post '${postId}' handled.`)
  res.status(200).end()
}
