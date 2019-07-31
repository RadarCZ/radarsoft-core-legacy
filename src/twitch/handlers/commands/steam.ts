import TwitchClient from '../../TwitchClient'

export default (channel: string) => {
    const client = TwitchClient.getInstance()
    const account = 'https://steamcommunity.com/id/radarcz'
    client.say(channel, `Radarův steam účet sídlí na adrese ${account}`)
}
