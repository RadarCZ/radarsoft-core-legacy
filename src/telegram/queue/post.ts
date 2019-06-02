import axios, { AxiosResponse } from 'axios'
import fs from 'fs'
import moment, { Moment } from 'moment-timezone'
import path from 'path'
import { getRandomNumber } from '../../util/misc'

const post: (data: object, contentType: string) => Promise<AxiosResponse<any>> = async (data, contentType) => {
  return await axios.post(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/send${contentType}`, data)
}

export const postToChannel:
  (channelId: string, postFile: string, nextPostTime: Moment, filesCount: number) => Promise<boolean | Error>
  = async (channelId, postFile, nextPostTime, filesCount) => {
  const data: object = {
    'chat_id': channelId,
  }

  const random = getRandomNumber(`${+moment()}`, 100)
  const kofi = random > 75

  const queueFilePath = path.join(process.cwd(), 'data/telegram/queue', postFile)
  const postedFilePath = path.join(process.cwd(), 'data/telegram/posted', postFile)

  if (fs.existsSync(queueFilePath)) {
    const rawData = fs.readFileSync(queueFilePath, { 'encoding': 'utf8' })
    const { fullLink, artistLink, postLink, postName } = JSON.parse(rawData)
    const sendType = path.extname(fullLink) === '.gif' ? 'Document' : 'Photo'
    data[sendType.toLowerCase()] = fullLink
    data['reply_markup'] = {
      'inline_keyboard': [
        [{ 'text': 'Full res', 'url': fullLink}, { 'text': 'Poster\'s profile', 'url': artistLink}]
      ]
    }
    data['caption'] = '<code>Radar\'s Butt 2.0</code>\n'
    data['caption'] += `Next post at ${nextPostTime.format('LT')} (${nextPostTime.zoneAbbr()}).\n`
    data['caption'] += `Submissions in queue: ${filesCount - 1}\n`
    data['caption'] += `<a href="${postLink}">${(!!postName) ? postName : postLink}</a>`
    if (kofi) {
      data['caption'] += '\n<a href="https://ko-fi.com/D1D0WKOS">Support Me on Ko-fi</a>'
    }
    data['parse_mode'] = 'HTML'

    try {
      const postResult = await post(data, sendType)
      if (postResult.status === 200) {
        fs.writeFileSync(postedFilePath, rawData)
        fs.unlinkSync(queueFilePath)

        return Promise.resolve(true)
      }
    } catch (error) {
      if (error.response.error_code >= 400 && error.response.error_code < 500) {
        data['caption'] = `<code>Radar's Butt 2.0</code>\n`
        data['caption'] += `Post failed. Next at ${nextPostTime.format('LT')} (${nextPostTime.zoneAbbr()}.\n`
        data['caption'] += `Submissions in queue: ${filesCount - 1}\n`
        data['caption'] += `<a href="${postLink}">${(!!postName) ? postName : postLink}</a>`
        if (kofi) {
          data['caption'] += '\n<a href="https://ko-fi.com/D1D0WKOS">Support Me on Ko-fi</a>'
        }
        await post(data, sendType)

        return Promise.resolve(false)
      }

      return Promise.resolve(error)
    }
  }

  return new URIError(`File '${postFile}' does not exist`)
}
