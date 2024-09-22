import { Bot, CommandContext, Context } from "grammy";
import ClientBot from "./ClientBot";
import { BotCommand, User } from "grammy/types";
import StorageService from "./StorageService";

export class AdminBot {
    private bot: Bot;
    private client: ClientBot | null = null;
    private secret = "secret";
    private commands: BotCommand[] = [
        {
            command: "login",
            description: "login admin"
        }
    ] 

    private storage: StorageService;

    constructor(bot: Bot, storage: StorageService) {
        this.bot = bot;
        this.storage = storage;
    }

    async init(){
        this.bot.command("login",this.authenticateAdmin.bind(this))
        this.bot.on("message", (ctx) => {
            if (ctx.message.reply_to_message) {
                const repliedMessageText = ctx.message.reply_to_message.text ?? "";
                try {
                    const parsedMessage = this.parseRepliedMessage(repliedMessageText);
                    this.client?.replyInquiris(
                        parsedMessage.chatId,
                        parsedMessage.messageId,
                        ctx.message.text ?? ""
                    )
                } catch (error) {
                    // TODO: Handle this error
                }
            }
        })
        console.log("Admin bot is starting")
        this.bot.start({
            onStart(botInfo) {
                console.log("Admin bot is started, username " + botInfo.username)
            },
        });
    }

    setClient(client: ClientBot){
        this.client = client;
    }

    sendMessageToAdmins(message: string){
        this.storage.getAuthenticatedAdminChatIds().then(chatIds => {
            chatIds.forEach(chatId => {
                this.bot.api.sendMessage(chatId, message);
            })
        })
    }

    async stop(){
        console.log("Shutting down Admin bot")
        await this.bot.stop()
    }

    private authenticateAdmin(ctx: CommandContext<Context>){
        const secret = ctx.match;
        
        if (secret === this.secret) {
            const account = ctx.message?.from;
            const chatId = ctx.message?.chat.id ?? 0;
            if (account) {
                this.storage.saveAuthenticatedAdmin({
                    first_name: account.first_name,
                    id: account.id,
                    last_name: account.last_name ?? "",
                    username: account.username ?? ""
                }, chatId)
            }
            ctx.reply("Authenticated");
        }else{
            ctx.reply("Not Authenticated");
        }
    }

    
    private parseRepliedMessage(text: string): {messageId: number, chatId: number} {
        let messageId = 0;
        let chatId = 0;

        const regexPattern = /message_id:\s(?<message_id>\d+)\nchat_id:\s(?<chat_id>\d+)/gm;

        const match = regexPattern.exec(text);

        console.log(match);

        if (match && match.groups) {
            messageId = parseInt(match.groups["message_id"])
            chatId = parseInt(match.groups["chat_id"]);
        }

        if (!(messageId && chatId)) {
            throw new Error("Failed to parse the replied message, message: " + text);
        }

        return {
            messageId,
            chatId
        }
    }
}