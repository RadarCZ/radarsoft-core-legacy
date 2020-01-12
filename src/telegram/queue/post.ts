import axios from 'axios'
import fs from 'fs'
import moment, { Moment } from 'moment-timezone'
import path from 'path'
import { getRandomNumber } from '../../util/misc'

export const postToChannel:
  (channelId: string, postFile: string, nextPostTime: Moment, filesCount: number) => Promise<boolean | Error>
  = async (channelId, postFile, nextPostTime, filesCount) => {
  const data: object = {
    'chat_id': channelId,
  }

  const random = getRandomNumber(`${+moment()}`, 100)
  const kofi = random > 95

  const queueFilePath = path.join(process.cwd(), 'data/telegram/queue', postFile)
  const postedFilePath = path.join(process.cwd(), 'data/telegram/posted', postFile)

  const pjsonPath = path.join(process.cwd(), 'package.json')
  const pjsonRaw = fs.readFileSync(pjsonPath, { 'encoding': 'utf8' })
  const { version } = JSON.parse(pjsonRaw)

  if (fs.existsSync(queueFilePath)) {
    const rawData = fs.readFileSync(queueFilePath, { 'encoding': 'utf8' })
    const { fullLink, artistLink, postLink, postName, tgImageLink, tipLink } = JSON.parse(rawData)
    const postNameEscaped = (!!postName) ? postName.replace(/</g, '&lt;').replace(/>/g, '&gt;') : postLink;
    const sendType = path.extname(fullLink) === '.gif' ? 'Document' : 'Photo'
    data[sendType.toLowerCase()] = encodeURI(tgImageLink || fullLink)
    data['reply_markup'] = {
      'inline_keyboard': [
        [{ 'text': 'Full res', 'url': encodeURI(fullLink)}, { 'text': 'Poster\'s profile', 'url': artistLink}]
      ]
    }
    data['caption'] = `<a href="${postLink}">${postNameEscaped}</a>\n\n`
    data['caption'] += `<code>Radar\'s Butt 2.0</code> <i>(api: ${version})</i>\n`
    data['caption'] += `Next post at ${nextPostTime.format('LT')} (${nextPostTime.zoneAbbr()}).\n`
    data['caption'] += `Submissions in queue: ${filesCount - 1}\n`
    
    if (tipLink) {
      data['caption'] += `\n\n<a href="${tipLink}">Tip the artist!</a>`
    }

    if (!tipLink && kofi) {
      data['caption'] += '\n\n<a href="https://ko-fi.com/D1D0WKOS">Support me on Ko-fi</a>'
    }
    data['parse_mode'] = 'HTML'

    try {
      const postResult =
        await axios.post(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/send${sendType}`, data)
      if (postResult.status === 200) {
        fs.writeFileSync(postedFilePath, rawData)
        fs.unlinkSync(queueFilePath)

        return Promise.resolve(true)
      }
    } catch (error) {
      if (error.response.data.error_code >= 400 && error.response.data.error_code < 500) {
        const failedData = {
          'chat_id': data['chat_id'],
          'parse_mode': data['parse_mode'],
          'reply_markup': data['reply_markup']
        }

        failedData['text'] = `<a href="${postLink}">${postNameEscaped}</a>\n\n`
        failedData['text'] += `<code>Radar\'s Butt 2.0</code> <i>(api: ${version})</i>\n`
        failedData['text'] += `Post failed. Next at ${nextPostTime.format('LT')} (${nextPostTime.zoneAbbr()}).\n`
        failedData['text'] += `Submissions in queue: ${filesCount - 1}\n`
        
        if (kofi) {
          failedData['text'] += '\n\n<a href="https://ko-fi.com/D1D0WKOS">Support Me on Ko-fi</a>'
        }
        const postResult =
          await axios.post(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`, failedData)
        if (postResult.status === 200) {
          fs.writeFileSync(postedFilePath, rawData)
          fs.unlinkSync(queueFilePath)
        }

        return Promise.resolve(true)
      }

      return Promise.resolve(error)
    }
  }

  return new URIError(`File '${postFile}' does not exist`)
}
