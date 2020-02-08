import TwitchClient from '../TwitchClient';
import { lolCommand } from './commands/lol';
import { mmrCommand } from './commands/mmr';
import { steamCommand } from './commands/steam';
import { ChatUserstate } from 'tmi.js';

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
        default:
            client.say(channel, `Příkaz ${command} (ještě) neumím FeelsBadMan`);
    }
};
