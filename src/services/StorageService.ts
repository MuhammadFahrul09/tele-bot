import { PrismaClient } from "@prisma/client";
import { TelegramAccount } from "../types";

export default class StorageService {
    private db: PrismaClient;

    constructor(db: PrismaClient){
        this.db = db;
    }

    async saveAuthenticatedAdmin(account: TelegramAccount, chatId: number){
        await this.db.adminAccount.create({
            data: {
                ...account,
                chat_id: chatId
            }
        })
    }

    async getAuthenticatedAdmins(){
        const admins = await this.db.adminAccount.findMany();

        return admins;
    }

    async getAuthenticatedAdminChatIds(): Promise<number[]> {
        const admins = await this.getAuthenticatedAdmins();

        return admins.map(admin => admin.chat_id);
    }

    async saveClient(account: TelegramAccount, chatId: number){
        await this.db.clientAccount.create({
            data: {
                ...account,
                chat_id: chatId
            }
        })
    }
}