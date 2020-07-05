import { TelegramUser } from './telegramUser';

export type TelegramSticker = {
	file_id: string;
	file_unique_id: string;
	width: number;
	height: number;
	is_animated: boolean;
	thumb?: {
		file_id: string;
		file_unique_id: string;
		width: number;
		height: number;
		file_size?: number;
	};
	emoji?: string;
	set_name?: string;
	mask_position?: {
		point: string;
		x_shift: number;
		y_shift: number;
		scale: number;
	};
	file_size?: number;
};

export type StickerResult = {
	ok: boolean;
	result: {
		message_id: number;
		from: TelegramUser;
		chat: {
			id: number;
			first_name: string;
			last_name?: string;
			username?: string;
			type?: string;
		};
		date: number;
		sticker: TelegramSticker;
	};
};
