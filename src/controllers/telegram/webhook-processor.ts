// import axios from 'axios'
export const processWebhook = (req, res, next) => {
  const { botToken } = req.query
  if (botToken === process.env.TG_BOT_TOKEN) {
    res.status(200).end()
  } else {
    res.status(401).end()
  }
}
