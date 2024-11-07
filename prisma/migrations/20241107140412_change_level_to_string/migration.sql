/*
  Warnings:

  - You are about to alter the column `level` on the `Score` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `Score` MODIFY `level` VARCHAR(191) NOT NULL;
