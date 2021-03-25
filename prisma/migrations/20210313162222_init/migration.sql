/*
  Warnings:

  - You are about to drop the column `clientId` on the `Config` table. All the data in the column will be lost.
  - The migration will add a unique constraint covering the columns `[key,guildId]` on the table `Config`. If there are existing duplicate values, the migration will fail.
  - Added the required column `guildId` to the `Config` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Config.key_clientId_unique";

-- DropForeignKey
ALTER TABLE "Config" DROP CONSTRAINT "Config_clientId_fkey";

-- AlterTable
ALTER TABLE "Config" DROP COLUMN "clientId",
ADD COLUMN     "guildId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Config.key_guildId_unique" ON "Config"("key", "guildId");

-- AddForeignKey
ALTER TABLE "Config" ADD FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;
