/*
  Warnings:

  - You are about to drop the column `type` on the `NotificationPreference` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `NotificationPreference` DROP COLUMN `type`;

-- CreateTable
CREATE TABLE `NotificationPreferenceType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `notificationType` ENUM('EMAIL', 'PUSH') NOT NULL,
    `notificationPreferenceId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `NotificationPreferenceType` ADD CONSTRAINT `NotificationPreferenceType_notificationPreferenceId_fkey` FOREIGN KEY (`notificationPreferenceId`) REFERENCES `NotificationPreference`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
