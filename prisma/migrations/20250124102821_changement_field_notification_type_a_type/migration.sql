/*
  Warnings:

  - You are about to drop the column `notificationType` on the `NotificationPreferenceType` table. All the data in the column will be lost.
  - Added the required column `type` to the `NotificationPreferenceType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `NotificationPreferenceType` DROP COLUMN `notificationType`,
    ADD COLUMN `type` ENUM('EMAIL', 'PUSH') NOT NULL;
