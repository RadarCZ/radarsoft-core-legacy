import { TelegramLocation } from './telegramLocation';
import { TelegramUser } from './telegramUser';

export type TelegramWebhookInlineQuery = {
	id: string;
	from: TelegramUser;
	location?: TelegramLocation;
	query: string;
	offset: string;
};

export type TelegramInlineQueryAnswer = {
	inline_query_id: string;
	results: TelegramInlineQueryResult[];
	cache_time?: number;
	is_personal?: boolean;
	next_offset?: string;
	switch_pm_text?: string;
	switch_pm_parameter?: string;
};

export interface TelegramInlineQueryResult {
	type: string;
	id: string;
	[key: string]: any;
}
