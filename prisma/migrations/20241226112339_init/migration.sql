/*
  Warnings:

  - You are about to alter the column `type` on the `Notification` table. The data in that column could be lost. The data in that column will be cast from `Json` to `Enum(EnumId(6))`.
  - You are about to alter the column `type` on the `NotificationPreference` table. The data in that column could be lost. The data in that column will be cast from `Json` to `Enum(EnumId(6))`.

*/
-- AlterTable
ALTER TABLE `Notification` MODIFY `type` ENUM('EMAIL', 'PUSH') NOT NULL;

-- AlterTable
ALTER TABLE `NotificationPreference` MODIFY `type` ENUM('EMAIL', 'PUSH') NOT NULL;
