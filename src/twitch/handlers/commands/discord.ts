import TwitchClient from '../../TwitchClient';

import { ICommandHandler } from './ICommandHandler';

export const discordCommand: ICommandHandler = channel => {
	const client = TwitchClient.getInstance();

	client.say(channel, 'Be sure to join our Discord server: https://discord.gg/zvkxdy4 !');
};
