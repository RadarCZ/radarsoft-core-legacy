import axios from 'axios'

export const resendETS = (req, res, next) => {
    const game = `${req.params.game}`.toUpperCase()
    const requestData = req.body
    const data = {
        'chat_id': `${process.env[`TG_${game}_CHAT`]}`,
        'parse_mode': 'Markdown'
    }
    data['text'] = `*${requestData.username}* odjel zakázku:\n`
    data['text'] += `${requestData.content}`

    axios.post(`${process.env[`TB_${game}_DISCORD`]}`, requestData)
    axios.post(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`, data)
    res.status(200).end()
}
