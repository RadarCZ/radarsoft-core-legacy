import fs from 'fs'
import moment, { Moment } from 'moment-timezone'
import path from 'path'
import { logger } from '../../config/winston'
import { getRandomNumber } from '../../util/misc'
import { postToChannel } from './post'

export const handlePost: () => void = async () => {
  const queueNextPostTimeFile = path.join(process.cwd(), 'data/telegram/queue/.data.json')
  const queueFolder = path.join(process.cwd(), 'data/telegram/queue')
  const currentTime = moment.tz('Europe/Prague')
  let lastPostTime: Moment = currentTime

  if (fs.existsSync(queueNextPostTimeFile)) {
    const rawData = fs.readFileSync(queueNextPostTimeFile, 'utf8')
    const jsonData = JSON.parse(rawData)
    lastPostTime = moment.tz(jsonData.nextPost, 'Europe/Prague')
  }

  let nextPostMilliseconds: number = 0

  if (lastPostTime.isSameOrBefore(currentTime)) {
    let files: fs.Dirent[] = []
    if (fs.existsSync(queueFolder)) {
      files = fs.readdirSync(queueFolder, { 'withFileTypes': true }).filter((fsEntry) => {
        return (!fsEntry.name.startsWith('.') && fsEntry.isFile())
      })
    }

    if (files.length < 1) {
      logger.info('Nothing to post, waiting 1 minute.')
      setTimeout(handlePost, 60000)

      return
    }

    const filesCount = files.length
    const fileIndex = Math.floor(Math.random() * filesCount)
    const newInterval: number = generateInterval(filesCount)
    const nextPostTime: Moment = moment(currentTime).add(newInterval, 'm')
    const postResult: boolean | Error =
      await postToChannel(`${process.env.TG_MAIN_CHANNEL_ID}`, files[fileIndex].name, nextPostTime, filesCount)
    nextPostMilliseconds = newInterval * 60 * 1000
    if (postResult === true) {
      logger.info(`Post successful. Next post in ${newInterval} minutes.`)
    } else {
      logger.info(`Post failed${typeof postResult !== 'boolean' ? ' (error follows)' : ''}.`)
      logger.info(`Next post in ${newInterval} minutes.`)
      if (typeof postResult !== 'boolean') {
        logger.error(postResult as object)
      }
    }

    const writeData = {
      'nextPost': nextPostTime.format()
    }
    fs.writeFileSync(queueNextPostTimeFile, JSON.stringify(writeData))

  } else {
    nextPostMilliseconds = lastPostTime.diff(currentTime)
  }

  setTimeout(handlePost, nextPostMilliseconds)
}

const generateInterval: (filesCount: number) => number = (filesCount) => {
  const randomSeed: number = moment().unix().valueOf()
  const randomForInterval = getRandomNumber(`${randomSeed}`, 101)
  const filesInRegularInterval = (filesCount >= 200 && filesCount <= 1500)
  let randomDuration: number
  if (filesInRegularInterval) {
    if (randomForInterval <= 12) {
      randomDuration = getRandomNumber(`${randomSeed / randomForInterval}`, 5) + 1
    } else if (randomForInterval > 12 && randomForInterval <= 22) {
      randomDuration = getRandomNumber(`${randomSeed / randomForInterval}`, 10) + 5
    } else {
      randomDuration = getRandomNumber(`${randomSeed / randomForInterval}`, 15) + 15
    }
  } else {
    if (filesCount < 200) {
      randomDuration = getRandomNumber(`${randomSeed / randomForInterval}`, 15) + 15
    } else {
      randomDuration = getRandomNumber(`${randomSeed / randomForInterval}`, 5) + 1
    }
  }

  return randomDuration
}
