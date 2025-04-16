-- DropIndex
DROP INDEX `CalendarEvent_googleEventId_key` ON `CalendarEvent`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `deleteSharedNotesOnRelationEnd` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `SharedNote` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `noteId` INTEGER NOT NULL,
    `sharedWithUserId` INTEGER NOT NULL,
    `sharedBy` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserGoogleAccount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `accessToken` TEXT NULL,
    `refreshToken` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `UserGoogleAccount_userId_isDefault_idx`(`userId`, `isDefault`),
    UNIQUE INDEX `UserGoogleAccount_userId_email_key`(`userId`, `email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SharedNote` ADD CONSTRAINT `SharedNote_noteId_fkey` FOREIGN KEY (`noteId`) REFERENCES `Note`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SharedNote` ADD CONSTRAINT `SharedNote_sharedWithUserId_fkey` FOREIGN KEY (`sharedWithUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SharedNote` ADD CONSTRAINT `SharedNote_sharedBy_fkey` FOREIGN KEY (`sharedBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserGoogleAccount` ADD CONSTRAINT `UserGoogleAccount_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
