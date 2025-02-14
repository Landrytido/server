/*
  Warnings:

  - A unique constraint covering the columns `[googleEventId]` on the table `CalendarEvent` will be added. If there are existing duplicate values, this will fail.
  - Made the column `recurrence` on table `CalendarEvent` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `CalendarEvent` ADD COLUMN `googleEventId` VARCHAR(191) NULL,
    ADD COLUMN `isRecurring` BOOLEAN NULL DEFAULT false,
    MODIFY `recurrence` ENUM('NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'ANNUAL') NOT NULL DEFAULT 'NONE';

-- CreateIndex
CREATE UNIQUE INDEX `CalendarEvent_googleEventId_key` ON `CalendarEvent`(`googleEventId`);
