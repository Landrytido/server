/*
  Warnings:

  - Made the column `notificationSent` on table `CalendarEvent` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `CalendarEvent` MODIFY `description` VARCHAR(191) NULL,
    MODIFY `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `endDate` DATETIME(3) NOT NULL DEFAULT (NOW() + INTERVAL 15 MINUTE),
    MODIFY `notificationSent` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `completed` BOOLEAN NULL DEFAULT false,
    MODIFY `location` ENUM('DISTANCE', 'ONSITE') NULL;
