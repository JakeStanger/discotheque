/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[channelId,date]` on the table `SyncHistory`. If there are existing duplicate values, the migration will fail.

*/
-- DropIndex
DROP INDEX "SyncHistory.date_unique";

-- DropIndex
DROP INDEX "SyncHistory.channelId_unique";

-- CreateIndex
CREATE UNIQUE INDEX "SyncHistory.channelId_date_unique" ON "SyncHistory"("channelId", "date");
