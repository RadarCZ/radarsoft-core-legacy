import { logger } from '../config/winston';
import NCovStats from './structs/nCovStats';
import TelegramChatData from './structs/telegramChatData';
import { NCovStatType } from './enums';
import applyConverters from 'axios-case-converter';
import axios from 'axios';

export default class NCovTracker {
    private urlConfirmed: string;
    private urlDeaths: string;
    private urlRecovered: string;

    public constructor () {
        this.urlConfirmed = this.constructURL(NCovStatType.Confirmed);
        this.urlDeaths = this.constructURL(NCovStatType.Deaths);
        this.urlRecovered = this.constructURL(NCovStatType.Recovered);
    }

    public async report(): Promise<boolean> {
        if (!process.env.TG_BOT_TOKEN) {
            logger.warn('Skipping 2019-nCov update, no Telegram token (TG_BOT_TOKEN)');

            return false;
        }

        const confirmedResponse = await axios.get(this.urlConfirmed);
        const deathsResponse = await axios.get(this.urlDeaths);
        const recoveredResponse = await axios.get(this.urlRecovered);

        const finalResults = new NCovStats(
            confirmedResponse.data.features[0].attributes.value,
            deathsResponse.data.features[0].attributes.value,
            recoveredResponse.data.features[0].attributes.value
        );

        const telegramData = new TelegramChatData(
            parseInt(`${process.env.TG_HOOSKWOOF_UPDATES_ID}`, 10),
            `<b>2019-nCoV status report</b>\n Confirmed: ${finalResults.Confirmed}\n Deaths: ${finalResults.Deaths}\n Recovered: ${finalResults.Recovered}`,
            'HTML'
        );

        const client = applyConverters(axios.create());
        await client.post(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`, telegramData);

        return true;
    }

    private constructURL(type: NCovStatType): string {
        let strType: string;
        switch (type) {
            case NCovStatType.Confirmed:
                strType = 'Confirmed';
                break;
            case NCovStatType.Deaths:
                strType = 'Deaths';
                break;
            case NCovStatType.Recovered:
                strType = 'Recovered';
                break;
            default:
                throw new Error(`Invalid NCov statistic type: ${type}`);
        }
        const url = `https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/1/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22${strType}%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&outSR=102100&cacheHint=true`;

        return url;
    }
}
