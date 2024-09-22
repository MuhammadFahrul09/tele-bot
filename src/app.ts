import { Bot } from "grammy";
import ClientBot, { ClientBotContext } from './services/ClientBot'
import { AdminBot } from "./services/AdminBot";
import StorageService from "./services/StorageService";
import { PrismaClient } from "@prisma/client";

const USER_BOT_TOKEN = process.env.USER_BOT_TOKEN as string;
const ADMIN_BOT_TOKEN = process.env.ADMIN_BOT_TOKEN as string;

const db = new PrismaClient();

const bot = new Bot<ClientBotContext>(USER_BOT_TOKEN);
const adminBot = new Bot(ADMIN_BOT_TOKEN);
const storage = new StorageService(db);

const client = new ClientBot(bot, storage)
const admin = new AdminBot(adminBot, storage);

client.setAdmin(admin);
admin.setClient(client);


const stopBots = async () => {
    console.log("Shutting down");
    await client.stop();
    await admin.stop();
}

process.once("SIGINT", stopBots);
process.once("SIGTERM", stopBots);

client.init();
admin.init();