import axios from 'axios';

import { IAsyncRadarsoftHandler } from '../IRadarsoftHandler';

export const getGcData: IAsyncRadarsoftHandler = async (req, res) => {
	const { u } = req.query;
	const url = `https://www.geocaching.com/p/default.aspx?u=${u}`;
	const gcResponse = await axios.get(url);

	if (gcResponse.status === 200 || gcResponse.status === 300) {
		const resultData = {
			'icon': 'https://img.geocaching.com/user/square250/6632b799-e189-4ea1-9072-a2d48c03452f.png',
			'name': u,
			'site': 'geocaching',
			'stat1': 75,
			'stat2': 5,
			'targetUrl': url
		};

		res.send(resultData);
	} else {
		res.send(new Error(gcResponse.statusText));
	}
};
