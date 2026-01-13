-- AlterTable
ALTER TABLE `donations` ADD COLUMN `proofOfPaymentUrl` VARCHAR(255) NULL,
    ADD COLUMN `verifiedAt` DATETIME(3) NULL;
