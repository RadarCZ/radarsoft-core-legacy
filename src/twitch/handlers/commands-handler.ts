import { ChatUserstate } from 'tmi.js'
import TwitchClient from '../TwitchClient'
import { default as lolCommand } from './commands/lol'
import { default as mmrCommand } from './commands/mmr'
import { default as steamCommand } from './commands/steam'

export default (channel: string, userState: ChatUserstate, message: string, self: boolean) => {
    if (self) {
        return
    }

    const cleanMessage: string = message.trim()

    if (!cleanMessage.startsWith('!')) {
        return
    }

    const command: string = cleanMessage.substr(1)

    const client = TwitchClient.getInstance()

    switch (command) {
        case 'mmr':
            mmrCommand(channel)
            break
        case 'steam':
            steamCommand(channel)
            break
        case 'lol':
            lolCommand(channel)
            break
        default:
            client.say(channel, `Příkaz ${command} (ještě) neumím FeelsBadMan`)
    }
}
