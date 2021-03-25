-- DropIndex
DROP INDEX "Config.key_guildId_unique";

-- AlterTable
ALTER TABLE "Config" ADD PRIMARY KEY ("key", "guildId");

-- CreateTable
CREATE TABLE "MessageMetadata" (
    "key" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "value" JSONB NOT NULL,

    PRIMARY KEY ("key","messageId")
);

-- AddForeignKey
ALTER TABLE "MessageMetadata" ADD FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
