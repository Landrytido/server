/*
  Warnings:

  - You are about to drop the column `noteId` on the `Task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Task` DROP FOREIGN KEY `Task_noteId_fkey`;

-- AlterTable
ALTER TABLE `Task` DROP COLUMN `noteId`;
