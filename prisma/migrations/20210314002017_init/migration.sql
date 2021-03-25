/*
  Warnings:

  - Added the required column `updatedAt` to the `Config` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Config" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "attachments" TEXT[],
    "timestamp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Message.id_index" ON "Message"("id");

-- CreateIndex
CREATE INDEX "Message.authorId_index" ON "Message"("authorId");

-- CreateIndex
CREATE INDEX "Message.channelId_index" ON "Message"("channelId");
