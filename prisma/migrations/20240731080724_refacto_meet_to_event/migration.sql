/*
  Warnings:

  - You are about to drop the `meet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `meetsharedwithmember` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `meet` DROP FOREIGN KEY `Meet_userId_fkey`;

-- DropForeignKey
ALTER TABLE `meetsharedwithmember` DROP FOREIGN KEY `MeetSharedWithMember_meetId_fkey`;

-- DropForeignKey
ALTER TABLE `meetsharedwithmember` DROP FOREIGN KEY `MeetSharedWithMember_userId_fkey`;

-- DropTable
DROP TABLE `meet`;

-- DropTable
DROP TABLE `meetsharedwithmember`;

-- CreateTable
CREATE TABLE `Event` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `isRecurring` BOOLEAN NULL DEFAULT false,
    `recurrence` ENUM('NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'ANNUAL') NULL DEFAULT 'NONE',
    `location` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventSharedWithMember` (
    `eventId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`eventId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventSharedWithMember` ADD CONSTRAINT `EventSharedWithMember_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventSharedWithMember` ADD CONSTRAINT `EventSharedWithMember_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
