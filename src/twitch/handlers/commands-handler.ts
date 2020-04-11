import { ChatUserstate } from 'tmi.js';

import TwitchClient from '../TwitchClient';

import { discordCommand } from './commands/discord';
import { lolCommand } from './commands/lol';
import { mmrCommand } from './commands/mmr';
import { steamCommand } from './commands/steam';

export const commandsHandler: (channel: string, userState: ChatUserstate, message: string, self: boolean) => void = (channel, userState, message, self) => {
	if (self) {
		return;
	}

	const cleanMessage: string = message.trim();

	if (!cleanMessage.startsWith('!')) {
		return;
	}

	const command: string = cleanMessage.substr(1);

	const client = TwitchClient.getInstance();

	switch (command) {
		case 'mmr':
			mmrCommand(channel);
			break;
		case 'steam':
			steamCommand(channel);
			break;
		case 'lol':
			lolCommand(channel);
			break;
		case 'discord':
			discordCommand(channel);
			break;
		default:
			client.say(channel, 'I don\'t know that command yet FeelsBadMan');
	}
};
