/*
  Warnings:

  - You are about to drop the column `isVerified` on the `ongs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `donations` MODIFY `materialDescription` TEXT NULL;

-- AlterTable
ALTER TABLE `ongs` DROP COLUMN `isVerified`,
    ADD COLUMN `rejectionReason` TEXT NULL,
    ADD COLUMN `verificationStatus` ENUM('pending', 'verified', 'rejected') NOT NULL DEFAULT 'pending',
    ADD COLUMN `verifiedAt` DATETIME(3) NULL,
    ADD COLUMN `verifiedById` INTEGER NULL;

-- CreateIndex
CREATE INDEX `donations_donationStatus_idx` ON `donations`(`donationStatus`);

-- CreateIndex
CREATE INDEX `ongs_verificationStatus_idx` ON `ongs`(`verificationStatus`);

-- AddForeignKey
ALTER TABLE `ongs` ADD CONSTRAINT `ongs_verifiedById_fkey` FOREIGN KEY (`verifiedById`) REFERENCES `admins`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `donations` RENAME INDEX `donations_donorId_fkey` TO `donations_donorId_idx`;

-- RenameIndex
ALTER TABLE `donations` RENAME INDEX `donations_ongId_fkey` TO `donations_ongId_idx`;
