import TwitchClient from '../../TwitchClient';
import { ICommandHandler } from './ICommandHandler';

export const lolCommand: ICommandHandler = channel => {
	const client = TwitchClient.getInstance();
	const account = 'RadarCZ';
	const server = 'EUW';
	client.say(channel, `Jméno vyvolávače je ${account} a hraje na serveru ${server}`);
};
