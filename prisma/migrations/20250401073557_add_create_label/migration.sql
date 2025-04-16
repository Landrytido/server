/*
  Warnings:

  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_NoteTags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_NoteTags` DROP FOREIGN KEY `_NoteTags_A_fkey`;

-- DropForeignKey
ALTER TABLE `_NoteTags` DROP FOREIGN KEY `_NoteTags_B_fkey`;

-- AlterTable
ALTER TABLE `Note` ADD COLUMN `clickCounter` INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `Tag`;

-- DropTable
DROP TABLE `_NoteTags`;

-- CreateTable
CREATE TABLE `Label` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Label_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_NoteLabels` (
    `A` VARCHAR(191) NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_NoteLabels_AB_unique`(`A`, `B`),
    INDEX `_NoteLabels_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_NoteLabels` ADD CONSTRAINT `_NoteLabels_A_fkey` FOREIGN KEY (`A`) REFERENCES `Label`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_NoteLabels` ADD CONSTRAINT `_NoteLabels_B_fkey` FOREIGN KEY (`B`) REFERENCES `Note`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;