import TwitchClient from '../../TwitchClient';
import { ICommandHandler } from './ICommandHandler';

export const steamCommand: ICommandHandler = channel => {
	const client = TwitchClient.getInstance();
	const account = 'https://steamcommunity.com/id/radarcz';
	client.say(channel, `Radarův steam účet sídlí na adrese ${account}`);
};
