import { Bot, CommandContext, Context } from "grammy";
import { BotCommand } from "grammy/types";
import { AdminBot } from "./AdminBot";
import StorageService from "./StorageService";

export default class ClientBot {
    private bot: Bot;

    private adminBot: AdminBot | null = null;

    private storage: StorageService;

    private commands: BotCommand[] = [
        {
            command: "cp",
            description: "Lacak nomor telepon"
        }
    ]

    constructor(bot: Bot,storage: StorageService ) {
        this.bot = bot;
        this.storage = storage;
    }

    async init(){
        await this.bot.api.setMyCommands(this.commands);
        this.setListeners();
        console.log("Client bot is starting")
        this.bot.start({
            onStart(botInfo) {
                console.log("Client bot is started, username " + botInfo.username)
            },
        });
    }

    setAdmin(admin: AdminBot){
        this.adminBot = admin;
    }

    async replyInquiris(chatId: number, messageId: number, text: string){
        await this.bot.api.sendMessage(chatId,text,{
            reply_parameters: {
                message_id: messageId
            }
        })
    }

    async stop(){
        console.log("Shutting down Client bot")
        await this.bot.stop()
    }

    private setListeners(){
        this.bot.command("cp", this.handleCpCommand.bind(this))
        this.bot.command("start", this.registerClient.bind(this))
    }

    private registerClient(ctx: CommandContext<Context>){
        const from = ctx.message?.from;
        console.log(from)
        if (from) {
            this.storage.saveClient({
                id: from.id,
                first_name: from.first_name,
                last_name: from.last_name ?? "",
                username: from.username ?? ""
            },ctx.chat.id)
        }

        ctx.reply("Halo")
    }

    private handleCpCommand(ctx: CommandContext<Context>){
        const param = ctx.match
        const message = ctx.message;
        const formatedMessage = `command: ${message?.text}\nfrom: ${message?.from.username}\nmessage_id: ${message?.message_id}\nchat_id: ${message?.chat.id}`

        this.adminBot?.sendMessageToAdmins(formatedMessage);

        ctx.reply("Silahkan tunggu");
    }


}