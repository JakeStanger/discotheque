/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[channelId]` on the table `SyncHistory`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SyncHistory.channelId_unique" ON "SyncHistory"("channelId");
