/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[name]` on the table `Client`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Client.name_unique" ON "Client"("name");
