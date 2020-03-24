import { client, Client, Events } from 'tmi.js';
import TwitchOptions from './TwitchOptions';

export default class TwitchClient {
	public static create(
		options: TwitchOptions, handlers: { event: keyof Events; listener: (...args: any[]) => void}[]): void {
		if (!TwitchClient.instance) {
			TwitchClient.instance = new TwitchClient(options, handlers);
		}
	}

	public static getInstance(): TwitchClient {
		return TwitchClient.instance;
	}

	private static instance: TwitchClient;
	private client: Client;

	private constructor(
		options: TwitchOptions, handlers: { event: keyof Events; listener: (...args: any[]) => void}[]) {
		this.client = client(options);
		handlers.map(handler => {
			this.client.on(handler.event, handler.listener);
		});
	}

	public connect(): Promise<[string, number]> {
		return this.client.connect();
	}

	public say(target: string, message: string): Promise<[string]> {
		return this.client.say(target, message);
	}
}
