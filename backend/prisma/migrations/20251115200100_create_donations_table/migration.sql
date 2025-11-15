/*
  Warnings:

  - The primary key for the `admins` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `admins` table. All the data in the column will be lost.
  - The primary key for the `donors` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `donors` table. All the data in the column will be lost.
  - The primary key for the `ongs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ongs` table. All the data in the column will be lost.
  - You are about to drop the column `tipoCausa` on the `ongs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `admins` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`userId`);

-- AlterTable
ALTER TABLE `donors` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`userId`);

-- AlterTable
ALTER TABLE `ongs` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `tipoCausa`,
    ADD PRIMARY KEY (`userId`);

-- CreateTable
CREATE TABLE `donations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `donationType` ENUM('monetary', 'material') NOT NULL,
    `donationStatus` ENUM('pending', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    `monetaryAmount` DOUBLE NULL,
    `monetaryCurrency` VARCHAR(3) NULL,
    `materialDescription` VARCHAR(191) NULL,
    `materialQuantity` INTEGER NULL,
    `donorId` INTEGER NOT NULL,
    `ongId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `donations` ADD CONSTRAINT `donations_donorId_fkey` FOREIGN KEY (`donorId`) REFERENCES `donors`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `donations` ADD CONSTRAINT `donations_ongId_fkey` FOREIGN KEY (`ongId`) REFERENCES `ongs`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
