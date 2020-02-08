import { Options } from 'tmi.js';

export default class TwitchOptions implements Options {

    public identity: { username: string; password: string };
    public channels: string[];

    public constructor(username: string, password: string, channel: string) {
        this.identity = {
            username,
            password
        };
        this.channels = [channel];
    }
}
