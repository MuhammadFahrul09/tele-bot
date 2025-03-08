import { Bot, CommandContext, Context } from "grammy";
import ClientBot from "./ClientBot";
import { BotCommand, InputFile, Message, User } from "grammy/types";
import StorageService from "./StorageService";
import * as Sentry from "@sentry/node"

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

    async init() {
        this.bot.command("login", this.authenticateAdmin.bind(this))
        this.bot.on("message", async (ctx) => {
            if (ctx.message.reply_to_message) {
                const repliedMessageText = this.getRepliedMessageText(ctx.message);
                try {
                    const parsedRepliedMessage = this.parseRepliedMessage(repliedMessageText);
                    const replyText = ctx.message.text ?? "";
                    const replyPhoto = ctx.message.photo;

                    if (replyPhoto?.length) {
                        const photo = replyPhoto.pop();
                        if (photo) {
                            const { file_path } = await ctx.api.getFile(photo?.file_id);
                            const fileUrl = `https://api.telegram.org/file/bot${this.bot.token}/${file_path}`;

                            this.client?.replyInquirisWithPhoto(
                                parsedRepliedMessage.chatId,
                                parsedRepliedMessage.messageId,
                                fileUrl
                            )
                        }
                        return;
                    }

                    this.client?.replyInquiris(
                        parsedRepliedMessage.chatId,
                        parsedRepliedMessage.messageId,
                        replyText
                    )
                } catch (error) {
                    // TODO: Handle this error
                    Sentry.captureException(error);
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

    setClient(client: ClientBot) {
        this.client = client;
    }

    sendMessageToAdmins(message: string) {
        this.storage.getAuthenticatedAdminChatIds().then(chatIds => {
            chatIds.forEach(chatId => {
                try {
                    this.bot.api.sendMessage(chatId.toString(), message);
                } catch (error) {
                    Sentry.captureException(error);
                }
            })
        })
    }

    sendMediaMessageToAdmins(message: string, fileUrl: string) {
        this.storage.getAuthenticatedAdminChatIds().then(chatIds => {
            chatIds.forEach(chatId => {
                try {
                    this.bot.api.sendPhoto(chatId.toString(), new InputFile({ url: fileUrl }), {
                        caption: message
                    });
                } catch (error) {
                    Sentry.captureException(error);
                }
            })
        })
    }

    async stop() {
        console.log("Shutting down Admin bot")
        await this.bot.stop()
    }

    private authenticateAdmin(ctx: CommandContext<Context>) {
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
        } else {
            ctx.reply("Not Authenticated");
        }
    }


    private parseRepliedMessage(text: string): { messageId: number, chatId: number } {
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

    private getRepliedMessageText(message: Message){
        if (message.reply_to_message) {
            if (message.reply_to_message.text) {
                return message.reply_to_message.text;
            }

            if (message.reply_to_message.caption) {
                return message.reply_to_message.caption;
            }
        }

        return "";
    }
}