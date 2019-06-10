import fs from 'fs'
import path from 'path'

export const kofiDongnation = (req, res, next) => {
    const { from_name, amount, timestamp } = req.body.data
    const donationsFile = path.join(process.cwd(), 'data/donations.json')

    if (!fs.existsSync(donationsFile)) {
        fs.writeFileSync(donationsFile, '{}')
    }

    const rawData = fs.readFileSync(donationsFile, 'utf8')
    const jsonData = JSON.parse(rawData)

    const amountNumber = parseInt(amount, 10)
    const amountWeeks = Math.floor(amountNumber / 3)
    const amountDays = amountWeeks * 7

    if (!jsonData[from_name]) {
        jsonData[from_name] = {
            'timestamp': '',
            'last_amount': 0,
            'total_amount': 0,
            'days_remaining': 7
        }
    }

    jsonData[from_name] = {
        timestamp,
        'last_amount': amountNumber
    }

    jsonData[from_name].totalAmount += amountNumber
    jsonData[from_name].days_remaining += amountDays

    fs.writeFileSync(donationsFile, jsonData)

    res.status(200).end()
}
