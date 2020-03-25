import axios from 'axios';

import TwitchClient from '../../TwitchClient';

import { ICommandHandler } from './ICommandHandler';

export const mmrCommand: ICommandHandler = channel => {
	const client = TwitchClient.getInstance();
	axios.get(`https://api.opendota.com/api/players/${process.env.STEAM64_ID}`).then(
		response => {
			const { estimate } = response.data['mmr_estimate'];
			let emote: string;

			const estimateInt = parseInt(`${estimate}`, 10);

			if (estimateInt <= 1000) {
				emote = 'OMEGALUL';
			} else if (estimateInt > 1000 && estimateInt <= 2000) {
				emote = 'KEKW';
			} else if (estimateInt > 2000 && estimateInt <= 3000) {
				emote = 'LULW';
			} else if (estimateInt > 3000 && estimateInt <= 4000) {
				emote = 'KKomrade';
			} else {
				emote = 'Pog';
			}

			client.say(channel, `Odhadované MMR streamera je ${estimate} ${emote}`);
		}
	);
};
