import axios from 'axios'

export const resendETS = (req, res, next) => {
    const requestData = JSON.parse(Object.keys(req.body)[0])
    const data = {
        'chat_id': '414159721',
        'text': requestData
    }

    axios.post(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`, data)
    res.status(200).end()
}
