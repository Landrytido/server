/*
  Warnings:

  - You are about to drop the column `clickcounter` on the `Note` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Note` DROP COLUMN `clickcounter`,
    ADD COLUMN `clickCounter` INTEGER NOT NULL DEFAULT 0;
