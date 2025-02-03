-- DropForeignKey
ALTER TABLE `NotificationPreferenceType` DROP FOREIGN KEY `NotificationPreferenceType_notificationPreferenceId_fkey`;

-- AddForeignKey
ALTER TABLE `NotificationPreferenceType` ADD CONSTRAINT `NotificationPreferenceType_notificationPreferenceId_fkey` FOREIGN KEY (`notificationPreferenceId`) REFERENCES `NotificationPreference`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
