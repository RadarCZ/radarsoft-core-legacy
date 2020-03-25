import { Events } from 'tmi.js';

import { commandsHandler } from './handlers/commands-handler';
import { connectedHandler } from './handlers/connected-handler';

const Handlers: { event: keyof Events; listener: (...args: any[]) => void }[] = [
	{
		'event': 'connected',
		'listener': connectedHandler
	},
	{
		'event': 'message',
		'listener': commandsHandler
	}
];

export default Handlers;
