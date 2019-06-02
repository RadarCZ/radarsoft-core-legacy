import axios, { AxiosResponse } from 'axios'
import { Moment } from 'moment-timezone'
import path from 'path'
import fs from 'fs'

const post: (data: object, contentType: string) => Promise<AxiosResponse<any>> = async (data, contentType) => {
  return await axios.post(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/send${contentType}`, data)
}

export const postToChannel: (channelId: string, postFile: string, nextPostTime: Moment) => Promise<boolean | Error> = async (channelId, postFile, nextPostTime) => {
  let data: object = {
    'chat_id': channelId,
  }

  const queueFilePath = path.join(process.cwd(), 'data/telegram/queue', postFile)
  const postedFilePath = path.join(process.cwd(), 'data/telegram/posted', postFile)

  if(fs.existsSync(queueFilePath)){
    const rawData = fs.readFileSync(queueFilePath, { encoding: 'utf8' })
    const { fullLink, artistLink, postLink, postName } = JSON.parse(rawData)
    const sendType = path.extname(fullLink) === '.gif' ? 'Document' : 'Photo'
    data[sendType.toLowerCase()] = fullLink
    data['reply_markup'] = {
      'inline_keyboard': [
        [{text: 'Full res', url: fullLink}, {text: "Poster's profile", url: artistLink}]
      ]
    }
    data['caption'] = '<code>Radar\'s Butt 2.0</code>\n'
    data['caption'] += `Next post at ${nextPostTime.format('LT')} (${nextPostTime.zoneAbbr()}).\n\n`
    data['caption'] += `<a href="${postLink}">${(!!postName)?postName:postLink}</a>`
    data['parse_mode'] = 'HTML'

    try {
      const postResult = await post(data, sendType)
      if(postResult.status === 200){
        fs.writeFileSync(postedFilePath, rawData)
        fs.unlinkSync(queueFilePath)
        return Promise.resolve(true)
      }
    } catch(error) {
      if (error.response.error_code >= 400 && error.response.error_code < 500) {
        data['caption'] = `<code>Radar's Butt 2.0</code>\nPost failed. Next at ${nextPostTime.format('LT')} (${nextPostTime.zoneAbbr()}.\n\n${postLink}`
        await post(data, sendType)
        return Promise.resolve(false)
      }
      return Promise.resolve(error)
    }
  }

  return new URIError(`File '${postFile}' does not exist`)
}