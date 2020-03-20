import { TelegramParseMode } from '../enums';

export default class TelegramChatData {
    public ChatId: number | string;
    public Text: string;
    public ParseMode: TelegramParseMode;

    public constructor (
        chatId: number | string,
        text: string,
        parseMode: TelegramParseMode
    ) {
        this.ChatId = chatId;
        this.Text = text;
        this.ParseMode = parseMode;
    }
};
