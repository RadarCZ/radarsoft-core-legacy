import fs from 'fs';
import path from 'path';
import { IRadarsoftHandler } from '../IRadarsoftHandler';

export const kofiDongnation: IRadarsoftHandler = (req, res) => {
    const { 'from_name': fromName, amount, timestamp } = req.body.data;
    const donationsFile = path.join(process.cwd(), 'data/donations.json');

    if (!fs.existsSync(donationsFile)) {
        fs.writeFileSync(donationsFile, '{}');
    }

    const rawData = fs.readFileSync(donationsFile, 'utf8');
    const jsonData = JSON.parse(rawData);

    const amountNumber = parseInt(amount, 10);
    const amountWeeks = Math.floor(amountNumber / 3);
    const amountDays = amountWeeks * 7;

    if (!jsonData[fromName]) {
        jsonData[fromName] = {
            'timestamp': '',
            'lastAmount': 0,
            'totalAmount': 0,
            'daysRemaining': 7
        };
    }

    jsonData[fromName] = {
        timestamp,
        'lastAmount': amountNumber
    };

    jsonData[fromName].totalAmount += amountNumber;
    jsonData[fromName].daysRemaining += amountDays;

    fs.writeFileSync(donationsFile, jsonData);

    res.status(200).end();
};
