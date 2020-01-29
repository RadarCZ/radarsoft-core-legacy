import TwitchClient from '../../TwitchClient'

export default (channel: string) => {
    const client = TwitchClient.getInstance()
    const account = 'RadarCZ'
    const server = 'EUW'
    client.say(channel, `Jméno vyvolávače je ${account} a hraje na serveru ${server}`)
}
