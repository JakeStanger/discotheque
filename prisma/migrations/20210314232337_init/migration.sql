-- CreateTable
CREATE TABLE "SyncHistory" (
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "channelId" INTEGER NOT NULL,
    "lowerBound" INTEGER NOT NULL,
    "upperBound" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SyncHistory.date_unique" ON "SyncHistory"("date");
