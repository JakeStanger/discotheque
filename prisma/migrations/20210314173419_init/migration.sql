-- CreateIndex
CREATE INDEX "Config.key_guildId_index" ON "Config"("key", "guildId");

-- CreateIndex
CREATE INDEX "MessageMetadata.key_messageId_index" ON "MessageMetadata"("key", "messageId");
