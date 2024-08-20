/*
  Warnings:

  - You are about to drop the column `isRealtion` on the `invitation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `invitation` DROP COLUMN `isRealtion`,
    ADD COLUMN `isRelation` BOOLEAN NOT NULL DEFAULT false;
