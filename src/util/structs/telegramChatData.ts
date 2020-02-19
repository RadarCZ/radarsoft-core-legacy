import { TelegramParseMode } from '../enums';

export default class TelegramChatData {
    public ChatId: number;
    public Text: string;
    public ParseMode: TelegramParseMode;

    public constructor (
        chatId: number,
        text: string,
        parseMode: TelegramParseMode
    ) {
        this.ChatId = chatId;
        this.Text = text;
        this.ParseMode = parseMode;
    }
};
