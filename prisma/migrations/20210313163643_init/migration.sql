/*
  Warnings:

  - You are about to drop the column `logChannels` on the `Guild` table. All the data in the column will be lost.
  - Changed the type of `value` on the `Config` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Config" DROP COLUMN "value",
ADD COLUMN     "value" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Guild" DROP COLUMN "logChannels";
