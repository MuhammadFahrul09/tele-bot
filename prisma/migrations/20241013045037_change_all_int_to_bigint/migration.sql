/*
  Warnings:

  - You are about to alter the column `chat_id` on the `AdminAccount` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `chat_id` on the `ClientAccount` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - The primary key for the `ClientMessage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `ClientMessage` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - The primary key for the `Inquiries` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `clientMessageId` on the `Inquiries` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `id` on the `Inquiries` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AdminAccount" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "chat_id" BIGINT NOT NULL
);
INSERT INTO "new_AdminAccount" ("chat_id", "first_name", "id", "last_name", "username") SELECT "chat_id", "first_name", "id", "last_name", "username" FROM "AdminAccount";
DROP TABLE "AdminAccount";
ALTER TABLE "new_AdminAccount" RENAME TO "AdminAccount";
CREATE TABLE "new_ClientAccount" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "chat_id" BIGINT NOT NULL
);
INSERT INTO "new_ClientAccount" ("chat_id", "first_name", "id", "last_name", "username") SELECT "chat_id", "first_name", "id", "last_name", "username" FROM "ClientAccount";
DROP TABLE "ClientAccount";
ALTER TABLE "new_ClientAccount" RENAME TO "ClientAccount";
CREATE TABLE "new_ClientMessage" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "text" TEXT NOT NULL,
    "clientAccountId" BIGINT NOT NULL,
    CONSTRAINT "ClientMessage_clientAccountId_fkey" FOREIGN KEY ("clientAccountId") REFERENCES "ClientAccount" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ClientMessage" ("clientAccountId", "date", "id", "text") SELECT "clientAccountId", "date", "id", "text" FROM "ClientMessage";
DROP TABLE "ClientMessage";
ALTER TABLE "new_ClientMessage" RENAME TO "ClientMessage";
CREATE TABLE "new_Inquiries" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "clientAccountId" BIGINT NOT NULL,
    "clientMessageId" BIGINT NOT NULL,
    CONSTRAINT "Inquiries_clientAccountId_fkey" FOREIGN KEY ("clientAccountId") REFERENCES "ClientAccount" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Inquiries_clientMessageId_fkey" FOREIGN KEY ("clientMessageId") REFERENCES "ClientMessage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Inquiries" ("clientAccountId", "clientMessageId", "id") SELECT "clientAccountId", "clientMessageId", "id" FROM "Inquiries";
DROP TABLE "Inquiries";
ALTER TABLE "new_Inquiries" RENAME TO "Inquiries";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
