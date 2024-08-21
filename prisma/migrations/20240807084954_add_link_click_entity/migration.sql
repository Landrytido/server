-- CreateTable
CREATE TABLE `LinkClick` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clicks` INTEGER NOT NULL DEFAULT 0,
    `linkId` INTEGER NULL,
    `userId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LinkClick` ADD CONSTRAINT `LinkClick_linkId_fkey` FOREIGN KEY (`linkId`) REFERENCES `Link`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LinkClick` ADD CONSTRAINT `LinkClick_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
