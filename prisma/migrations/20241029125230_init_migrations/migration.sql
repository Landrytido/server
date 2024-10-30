/*
  Warnings:

  - You are about to drop the column `isChecked` on the `Task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `NoteTask` DROP FOREIGN KEY `NoteTask_noteId_fkey`;

-- AlterTable
ALTER TABLE `Task` DROP COLUMN `isChecked`;

-- AddForeignKey
ALTER TABLE `NoteTask` ADD CONSTRAINT `NoteTask_noteId_fkey` FOREIGN KEY (`noteId`) REFERENCES `Note`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
