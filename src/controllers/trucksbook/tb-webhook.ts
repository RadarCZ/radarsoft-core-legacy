import axios from 'axios'

export const resendETS = (req, res, next) => {
    const requestData = JSON.parse(Object.keys(req.body)[0])
    const data = {
        'chat_id': `${process.env.TG_ETS_CHAT}`
    }
    data['text'] = `*${requestData.username}* odjel zakázku:\n`
    data['text'] += `${requestData.content}`

    axios.post(`${process.env.TB_ETS_DISCORD}`, req.body)
    axios.post(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`, data)
    res.status(200).end()
}
