/*
  Warnings:

  - You are about to alter the column `type` on the `Notification` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(4))` to `Json`.
  - You are about to alter the column `type` on the `NotificationPreference` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Json`.

*/
-- AlterTable
ALTER TABLE `Notification` MODIFY `type` JSON NOT NULL;

-- AlterTable
ALTER TABLE `NotificationPreference` MODIFY `type` JSON NOT NULL;
