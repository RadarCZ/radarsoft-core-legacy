import path from 'path';
import csv from 'csvtojson';
import axios from 'axios';
import moment from 'moment';
import AdmZip from 'adm-zip';
import fs from 'fs';

import { IAsyncRadarsoftHandler } from '../../IRadarsoftHandler';

export const getOrp: IAsyncRadarsoftHandler = async (req, res, next) => {
	const zipFilePath = path.join(process.cwd(), 'cdn', 'latest.zip');
	if (fs.existsSync(zipFilePath)) {
		fs.unlinkSync(zipFilePath);
	}

	const orpCodePopDataFile = path.join(process.cwd(), 'src', 'controllers', 'covid', 'cz', 'orp.csv');
	const orpCodePopData = await csv().fromFile(orpCodePopDataFile);
	// orpCodePopData.sort((a, b) => {
	// 	const intA = parseInt(a.kod);
	// 	const intB = parseInt(b.kod);
	// 	return intA - intB;
	// });

	// console.log(orpCodePopData);

	const orpCovidUrl = 'https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/orp.json';
	const orpCovidJson = (await (await axios.get(orpCovidUrl)).data);
	const orpCovidData = orpCovidJson.data;
	const lastUpdatedMoment = moment(orpCovidJson.modified);

	const validDates: string[] = [];
	for (let i = 6; i >= 0; i--) {
		const newMoment = moment(lastUpdatedMoment).subtract(i, 'days');
		validDates.push(newMoment.format('YYYY-MM-DD'));
	}

	const filteredOrpData = orpCovidData.reduce((filtered, value) => {
		if (validDates.includes(value.datum)) {
			const orpPopulation = orpCodePopData.find(orpPop => `${value.orp_kod}` === `${orpPop.code}` || `${value.orp_nazev}` === `${orpPop.name}`);
			if (orpPopulation) {
				return [...filtered, value];
			}
		}
		return filtered;
	}, []);

	const maxIncidentsPer100k = Math.max(...filteredOrpData.map((orp) => {
		const orpPopulation = orpCodePopData.find(orpPop => `${orp.orp_kod}` === `${orpPop.code}` || `${orp.orp_nazev}` === `${orpPop.name}`);
		return (parseInt(orp.incidence_7) / parseInt(orpPopulation.population)) * 100000;
	}));

	const incidentsByDate = validDates.reduce((incidents, date) => {
		const incidentsForDate = filteredOrpData.reduce((incidents, value) => {
			if (value.datum === date) {
				const orpPopulation = orpCodePopData.find(orpPop => `${value.orp_kod}` === `${orpPop.code}` || `${value.orp_nazev}` === `${orpPop.name}`);
				const incPer100k = (parseInt(value.incidence_7) / parseInt(orpPopulation.population)) * 100000;
				return [...incidents, {
					orp_kod: value.orp_kod,
					incidence_7: value.incidence_7,
					population: orpPopulation.population,
					incidence_7_per_100k: incPer100k,
					incidence_percentage: (incPer100k / maxIncidentsPer100k) * 100
				}];
			}
			return incidents;
		}, []);

		incidentsForDate.sort((a, b) => {
			return a.orp_kod - b.orp_kod;
		})

		return {
			...incidents,
			[`${date}`]: incidentsForDate
		};
	}, {});

	let orpOrder = 6;
	const zip = new AdmZip();
	for (let date of validDates) {
		let text = `ORP-${orpOrder}\r\n${date}\r\n`;
		for (let orp of incidentsByDate[date]) {
			text += `${orp.orp_kod}\r\n${orp.incidence_percentage.toPrecision(3)}\r\n`;
		}
		zip.addFile(`ORP-${orpOrder}.txt`, Buffer.alloc(text.length, text));
		orpOrder--;
	}

	res.writeHead(200, {
		'Content-Type': 'application/zip'
	});
	res.end(zip.toBuffer());
};
