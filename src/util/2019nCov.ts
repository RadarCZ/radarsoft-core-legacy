import { logger } from '../config/winston';
import axios from 'axios';

class NCovStats {
    public Confirmed = 0;
    public Deaths = 0;
    public Recovered = 0;
}

export const post2019nCovUpdate: () => void = async () => {
    if (!process.env.TG_BOT_TOKEN) {
        logger.warn('Skipping 2019-nCov update, no Telegram token (TG_BOT_TOKEN)');

        return;
    }

    const confirmedResponse = await axios.get('https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/1/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22Confirmed%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&outSR=102100&cacheHint=true');
    const deathsResponse = await axios.get('https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/1/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22Deaths%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&outSR=102100&cacheHint=true');
    const recoveredResponse = await axios.get('https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/1/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22Recovered%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&outSR=102100&cacheHint=true');

    const finalResults = new NCovStats();
    finalResults.Confirmed = confirmedResponse.data.features[0].attributes.value;
    finalResults.Deaths = deathsResponse.data.features[0].attributes.value;
    finalResults.Recovered = recoveredResponse.data.features[0].attributes.value;
    const telegramData = {
        'chat_id': parseInt(`${process.env.TG_HOOSKWOOF_UPDATES_ID}`, 10),
        'text': `<b>2019-nCoV status report</b>\n Confirmed: ${finalResults.Confirmed}\n Deaths: ${finalResults.Deaths}\n Recovered: ${finalResults.Recovered}`,
        'parse_mode': 'HTML'
    };

    await axios.post(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`, telegramData);
    setTimeout(post2019nCovUpdate, 14400000);
};
