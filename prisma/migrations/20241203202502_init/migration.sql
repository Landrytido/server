-- DropForeignKey
ALTER TABLE `Invitation` DROP FOREIGN KEY `Invitation_receiverId_fkey`;

-- AlterTable
ALTER TABLE `Invitation` MODIFY `receiverId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Invitation` ADD CONSTRAINT `Invitation_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
