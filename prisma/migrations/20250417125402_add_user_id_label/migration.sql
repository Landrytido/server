/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Label` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Label` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Label_name_key` ON `Label`;

-- AlterTable
ALTER TABLE `Label` ADD COLUMN `userId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Label_name_userId_key` ON `Label`(`name`, `userId`);

-- AddForeignKey
ALTER TABLE `Label` ADD CONSTRAINT `Label_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
