-- CreateTable
CREATE TABLE "Config" (
    "key" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "value" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Config.key_clientId_unique" ON "Config"("key", "clientId");

-- AddForeignKey
ALTER TABLE "Config" ADD FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
