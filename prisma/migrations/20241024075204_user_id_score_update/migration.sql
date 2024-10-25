/*
  Warnings:

  - You are about to drop the column `player` on the `Score` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Score` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Score` DROP COLUMN `player`,
    ADD COLUMN `userId` INTEGER NOT NULL;
