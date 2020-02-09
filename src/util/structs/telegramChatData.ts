export default class TelegramChatData {
    public ChatId: number;
    public Text: string;
    public ParseMode: string;

    public constructor (
        chatId: number,
        text: string,
        parseMode: string
    ) {
        this.ChatId = chatId;
        this.Text = text;
        this.ParseMode = parseMode;
    }
};
