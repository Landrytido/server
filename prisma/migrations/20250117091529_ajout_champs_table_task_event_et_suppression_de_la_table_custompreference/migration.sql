/*
  Warnings:

  - You are about to drop the column `notificationCustomId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `notificationCustomId` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `notificationCustomId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `NotificationCustom` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[token]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Event` DROP FOREIGN KEY `Event_notificationCustomId_fkey`;

-- DropForeignKey
ALTER TABLE `Meeting` DROP FOREIGN KEY `Meeting_notificationCustomId_fkey`;

-- DropForeignKey
ALTER TABLE `Task` DROP FOREIGN KEY `Task_notificationCustomId_fkey`;

-- DropIndex
DROP INDEX `Event_notificationCustomId_key` ON `Event`;

-- DropIndex
DROP INDEX `Meeting_notificationCustomId_key` ON `Meeting`;

-- DropIndex
DROP INDEX `Task_notificationCustomId_key` ON `Task`;

-- AlterTable
ALTER TABLE `Event` DROP COLUMN `notificationCustomId`,
    ADD COLUMN `link` VARCHAR(191) NULL,
    ADD COLUMN `place` VARCHAR(191) NULL,
    ADD COLUMN `token` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Meeting` DROP COLUMN `notificationCustomId`;

-- AlterTable
ALTER TABLE `Task` DROP COLUMN `notificationCustomId`,
    ADD COLUMN `token` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `NotificationCustom`;

-- CreateIndex
CREATE UNIQUE INDEX `Event_token_key` ON `Event`(`token`);

-- CreateIndex
CREATE UNIQUE INDEX `Task_token_key` ON `Task`(`token`);
