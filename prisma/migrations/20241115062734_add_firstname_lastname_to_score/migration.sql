/*
  Warnings:

  - You are about to alter the column `firstName` on the `Score` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - Made the column `lastName` on table `Score` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Score` MODIFY `firstName` VARCHAR(191) NOT NULL,
    MODIFY `lastName` VARCHAR(191) NOT NULL;
