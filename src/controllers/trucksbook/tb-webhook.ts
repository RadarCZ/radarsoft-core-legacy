import axios from 'axios'

export const resendETS = (req, res, next) => {
    const game = `${req.params.game}`.toUpperCase()
    const requestData = req.body
    const contentParts = requestData.content.split('<')
    const detailsUrl = contentParts[1].replace(/>/g, '')

    const tgData = {
        'chat_id': `${process.env[`TG_${game}_CHAT`]}`,
        'parse_mode': 'HTML'
    }
    tgData['text'] = `<b>${requestData.username}<b> odjel zakázku:\n`
    tgData['text'] += `${contentParts[0].replace(/>/g, '&gt;')}\n`
    tgData['text'] += `<a href='${detailsUrl}'>Delivery details</a>`

    const discordData = {
        username: requestData.username,
        embeds: [
            {
                title: contentParts[0],
                color: 65280
            },
            {
                title: 'Delivery details',
                url: detailsUrl
            }
        ]
    }

    axios.post(`${process.env[`TB_${game}_DISCORD`]}`, discordData)
    axios.post(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`, tgData)
    res.status(200).end()
}
