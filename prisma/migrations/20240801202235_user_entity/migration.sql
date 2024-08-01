/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `workspace` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "workspace_name_key" ON "workspace"("name");
