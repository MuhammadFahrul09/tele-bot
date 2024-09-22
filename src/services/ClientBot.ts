import { Bot, CommandContext, Context, session, SessionFlavor } from "grammy";
import { BotCommand } from "grammy/types";
import { AdminBot } from "./AdminBot";
import StorageService from "./StorageService";
import { commandList } from "../const/commands";
import {
    type Conversation,
    type ConversationFlavor,
    conversations,
    createConversation,
  } from "@grammyjs/conversations";

  import { EmojiFlavor, emojiParser } from "@grammyjs/emoji";

export type ClientBotContext = Context & SessionFlavor<{}> & ConversationFlavor & EmojiFlavor;

export default class ClientBot {
    private bot: Bot<ClientBotContext>;

    private adminBot: AdminBot | null = null;

    private storage: StorageService;

    constructor(bot: Bot<ClientBotContext>,storage: StorageService ) {
        this.bot = bot;
        this.storage = storage;
    }

    async init(){
        await this.bot.api.setMyCommands(commandList.map(command => ({
            command: command.command,
            description: command.description.trim() + " contoh: " + command.example 
        })));


        this.bot.use(session({
            initial: () => ({}),
        }))

        this.bot.use(conversations())

        this.bot.use(emojiParser());

        // @ts-ignore
        this.bot.use(createConversation(this.frCommandConversation.bind(this)))

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

    getHelpMessage(){
        let message = "Command yang tersedia: \n\n"
        commandList.forEach(command => {
            message += `/${command.command}\n${command.description}\nContoh: ${command.example}\n\n`
        })

        return message;
    }

    private setListeners(){
        const genericCommands = commandList.filter(command => {
            return command.command !== "fr"; // this commands is handled diffrently
        })

        this.bot.command(genericCommands.map(command => command.command),(ctx) => {
            if (ctx.hasCommand("help")) {
                this.handleHelpCommand(ctx)
                return
            }

            this.handleCommand(ctx);
        });

        this.bot.command("start", this.handleStartCommand.bind(this))
        this.bot.command("fr", this.handleCommandWithFile.bind(this))
    }

    private handleStartCommand(ctx: CommandContext<Context>){
        this.registerClient(ctx);
        const welcomeMessage = this.getHelpMessage();
        ctx.reply(welcomeMessage);
    }

    private handleHelpCommand(ctx: CommandContext<Context>){
        ctx.reply(this.getHelpMessage())
    }

    private registerClient(ctx: CommandContext<Context>){
        const from = ctx.message?.from;
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

    private handleCommand(ctx: CommandContext<Context>){
        const message = ctx.message;
        const formatedMessage = `command: ${message?.text}\nfrom: ${message?.from.username}\nmessage_id: ${message?.message_id}\nchat_id: ${message?.chat.id}`

        this.adminBot?.sendMessageToAdmins(formatedMessage);

        this.sendWaitMessage(ctx);
    }

    private sendWaitMessage(ctx: CommandContext<Context>){
        ctx.reply('⏳')
        ctx.reply("Silahkan tunggu 3-4 menit");
    }

    private async handleCommandWithFile(ctx: CommandContext<ClientBotContext>){
        await ctx.conversation.enter("bound frCommandConversation");
    }

    private async frCommandConversation(conversation: Conversation<ClientBotContext>, ctx: CommandContext<ClientBotContext>){
        await ctx.reply("Silahkan kirim foto");
        const { message } = await conversation.wait();

        if (message?.photo) {
            const photo = message.photo.pop()
            if (photo) {
                const { file_path } = await ctx.api.getFile(photo.file_id);
                if (file_path) {
                    const formatedMessage = `command: /fr\nfrom: ${message?.from.username}\nmessage_id: ${message?.message_id}\nchat_id: ${message?.chat.id}`
                    const fileUrl = `https://api.telegram.org/file/bot${this.bot.token}/${file_path}`;

                    this.adminBot?.sendMediaMessageToAdmins(formatedMessage,fileUrl);
    
                    this.sendWaitMessage(ctx);
                }
                return;
            }
        }else{
            ctx.reply("Gagal, balas dengan foto, silahkan ulang command")
            return
        }
    }

}