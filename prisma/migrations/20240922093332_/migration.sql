-- CreateTable
CREATE TABLE "ClientAccount" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "chat_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "ClientMessage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "text" TEXT NOT NULL,
    "clientAccountId" INTEGER NOT NULL,
    CONSTRAINT "ClientMessage_clientAccountId_fkey" FOREIGN KEY ("clientAccountId") REFERENCES "ClientAccount" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Inquiries" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clientAccountId" INTEGER NOT NULL,
    "clientMessageId" INTEGER NOT NULL,
    CONSTRAINT "Inquiries_clientAccountId_fkey" FOREIGN KEY ("clientAccountId") REFERENCES "ClientAccount" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Inquiries_clientMessageId_fkey" FOREIGN KEY ("clientMessageId") REFERENCES "ClientMessage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
