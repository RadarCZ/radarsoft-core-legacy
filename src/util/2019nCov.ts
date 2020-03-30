import axios from 'axios';
import applyConverters from 'axios-case-converter-updated';
import { getConnection, getRepository } from 'typeorm';

import { logger } from '../config/winston';
import { WuhanTracker } from '../entity/WuhanTracker';

import { NCovStatType, TelegramParseMode } from './enums';
import TelegramChatData from './structs/telegramChatData';

export default class NCovTracker {
	private urlConfirmed: string;
	private urlDeaths: string;
	private urlRecovered: string;
	private urlLocalTesting: string;
	private urlLocalInfections: string;

	public constructor () {
		this.urlConfirmed = this.constructURL(NCovStatType.Confirmed);
		this.urlDeaths = this.constructURL(NCovStatType.Deaths);
		this.urlRecovered = this.constructURL(NCovStatType.Recovered);
		this.urlLocalTesting = 'https://onemocneni-aktualne.mzcr.cz/api/v1/covid-19/testy.json';
		this.urlLocalInfections = 'https://onemocneni-aktualne.mzcr.cz/api/v1/covid-19/nakaza.json';
	}

	public async report(): Promise<boolean> {
		if(!this.checkTelegramEligibility()) {
			return false;
		}

		const confirmedResponse = await axios.get(this.urlConfirmed);
		const deathsResponse = await axios.get(this.urlDeaths);
		const recoveredResponse = await axios.get(this.urlRecovered);

		const finalResult: WuhanTracker = {
			'id': 1,
			'confirmed': parseInt(confirmedResponse.data.features[0].attributes.value, 10),
			'deaths': parseInt(deathsResponse.data.features[0].attributes.value, 10),
			'recovered': parseInt(recoveredResponse.data.features[0].attributes.value, 10)
		};

		const oldResult: WuhanTracker | undefined = await getConnection()
			.createQueryBuilder()
			.select('wuhan_tracker')
			.from<WuhanTracker>(WuhanTracker, 'wuhan_tracker')
			.getOne();

		let confirmedString = '';
		let deathsString = '';
		let recoveredString = '';

		if (oldResult) {
			const confirmedPercentage = ((finalResult.confirmed - oldResult.confirmed) / (finalResult.confirmed)) * 100;
			const deathsPercentage = ((finalResult.deaths - oldResult.deaths) / (finalResult.deaths)) * 100;
			const recoveredPercentage = ((finalResult.recovered - oldResult.recovered) / (finalResult.recovered)) * 100;
			confirmedString = ` Confirmed: ${finalResult.confirmed} (${confirmedPercentage > 0 ? '+' : ''} ${confirmedPercentage.toFixed(4)} %)`;
			deathsString = ` Deaths: ${finalResult.deaths} (${deathsPercentage > 0 ? '+' : ''} ${deathsPercentage.toFixed(4)} %)`;
			recoveredString = ` Recovered: ${finalResult.recovered} (${recoveredPercentage > 0 ? '+' : ''} ${recoveredPercentage.toFixed(4)} %)`;
		} else {
			confirmedString = ` Confirmed: ${finalResult.confirmed}`;
			deathsString = ` Deaths: ${finalResult.deaths}`;
			recoveredString = ` Recovered: ${finalResult.recovered}`;
		}

		const telegramData = new TelegramChatData(
			parseInt(`${process.env.TG_HOOSKWOOF_UPDATES_ID}`, 10),
			`<b>Covid19 status report</b>\n${confirmedString}\n${deathsString}\n${recoveredString}`,
			TelegramParseMode.HTML
		);

		const client = applyConverters(axios.create());
		await client.post(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`, telegramData);


		const infoTelegramData = {
			'chat_id': `${process.env.TG_INFO_CHANNEL_ID}`,
			'text': `<b>Covid19 status report</b>\n${confirmedString}\n${deathsString}\n${recoveredString}`,
			'parse_mode': 'HTML'
		};
		await axios.post(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`, infoTelegramData);

		const wuhanTrackerRepository = getRepository(WuhanTracker);
		await wuhanTrackerRepository.save<WuhanTracker>(finalResult);

		return true;
	}

	public async reportLocal(): Promise<boolean> {
		if(!this.checkTelegramEligibility()) {
			return false;
		}

		try {
			const responseTesting = await axios.get(this.urlLocalTesting);
			const responseInfections = await axios.get(this.urlLocalInfections);

			const latestTestObject = responseTesting.data.data.slice(-1)[0];
			const latestInfectionObject = responseInfections.data.slice(-1)[0];

			const infectionIncrement = latestInfectionObject['pocetDen'];
			const totalTests = latestTestObject['testy-den'];
			const date = latestInfectionObject['datum'];

			const positiveTestPercentage = (infectionIncrement / totalTests) * 100;
			const positiveTestPercentageFmt = positiveTestPercentage.toFixed(2);

			const message = [
				`<b>Czechia COVID-19 report for ${date}<b>`,
				` Tests this day: ${totalTests}`,
				` Positive tests: ${infectionIncrement} (${positiveTestPercentageFmt}%)`
			].join('\n');

			const infoTelegramData = {
				'chat_id': `${process.env.TG_INFO_CHANNEL_ID}`,
				'text': message,
				'parse_mode': 'HTML'
			};
			const postResult = await axios.post(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`, infoTelegramData);
			logger.info(postResult);
			// console.log here

			return true;
		} catch (error) {
			console.trace();
			console.error(error);

			return false;
		}
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

	private checkTelegramEligibility(): boolean {
		if (!process.env.TG_BOT_TOKEN) {
			logger.warn('Skipping Covid19 update, no Telegram token (TG_BOT_TOKEN)');

			return false;
		}

		return true;
	}
}
