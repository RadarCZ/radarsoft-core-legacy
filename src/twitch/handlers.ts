import { Events } from 'tmi.js'
import { default as commandsHandler } from './handlers/commands-handler'
import { default as connectedHandler } from './handlers/connected-handler'

const Handlers: Array<{ event: keyof Events, listener: (...args: any[]) => void }> = [
    {
        'event': 'connected',
        'listener': connectedHandler
    },
    {
        'event': 'message',
        'listener': commandsHandler
    }
]

export default Handlers
