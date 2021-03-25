-- DropIndex
DROP INDEX "Message.channelId_index";

-- DropIndex
DROP INDEX "Message.authorId_index";

-- CreateIndex
CREATE INDEX "Message.authorId_timestamp_index" ON "Message"("authorId", "timestamp");

-- CreateIndex
CREATE INDEX "Message.channelId_timestamp_index" ON "Message"("channelId", "timestamp");
