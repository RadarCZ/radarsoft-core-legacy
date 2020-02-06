import axios from 'axios'

class nCovStats {
    Confirmed: number = 0;
    Deaths: number = 0;
    Recovered: number = 0;
    LastUpdate: number = 0;
}

export const post2019nCovUpdate: () => void = () => {
    axios.get('https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/1/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=Confirmed%20desc%2CCountry_Region%20asc%2CProvince_State%20asc&outSR=102100&resultOffset=0&resultRecordCount=250&cacheHint=true').then((data) => {
        const { features } = data.data
        if (features && features.length > 0) {
            const finalResults: nCovStats = new nCovStats()

            for(let i = 0, j = features.length; j < i; i++) {
                const attrs = features[i].attributes
                finalResults.Confirmed += parseInt(`${attrs.Confirmed}`, 10)
                finalResults.Deaths += parseInt(`${attrs.Deaths}`, 10)
                finalResults.Recovered += parseInt(`${attrs.Recovered}`, 10)

                if(parseInt(`${attrs.LastUpdate}`) > finalResults.LastUpdate) {
                    finalResults.LastUpdate = parseInt(`${attrs.LastUpdate}`, 10)
                }
            }

            if(finalResults.Confirmed === 0) return;

            const telegramData = {
                'chat_id': parseInt(`${process.env.TG_HOOSKWOOF_UPDATES_ID}`, 10),
                'text': `<b>2019-nCoV status report</b>\n Confirmed: ${finalResults.Confirmed}\n Deaths: ${finalResults.Deaths}\n Recovered: ${finalResults.Recovered}\n\n<i>Last update: ${finalResults.LastUpdate.toString()}</i>`,
                'parse_mode': 'HTML'
            }

            axios.post(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`, telegramData).then(() => setTimeout(post2019nCovUpdate, 14400000))
        }
    })
}
