// import axios from 'axios'
import fs from 'fs'
import path from 'path'

export const processWebhook = (req, res, next) => {
  const { botToken } = req.query
  const { from, text } = req.body
  if (botToken === process.env.TG_BOT_TOKEN && !from['is_bot']) {
    if (text.startsWith('/subscribe')) {
      const subscribersFile = path.join(process.cwd(), 'data/subscribers.json')
      if (!fs.existsSync(subscribersFile)) {
        fs.writeFileSync(subscribersFile, '[]')
      }

      const rawData = fs.readFileSync(subscribersFile, 'utf8')
      const jsonData: string[] = JSON.parse(rawData)

      jsonData.push(`${from.id}`)

      fs.writeFileSync(subscribersFile, jsonData)
    }
    res.status(200).end()
  } else {
    res.status(401).end()
  }
}
