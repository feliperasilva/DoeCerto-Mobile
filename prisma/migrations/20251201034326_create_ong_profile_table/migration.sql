-- CreateTable
CREATE TABLE `ong_profiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bio` VARCHAR(500) NULL,
    `avatarUrl` VARCHAR(255) NULL,
    `contactNumber` VARCHAR(20) NULL,
    `websiteUrl` VARCHAR(255) NULL,
    `address` VARCHAR(255) NULL,
    `ongId` INTEGER NOT NULL,

    UNIQUE INDEX `ong_profiles_ongId_key`(`ongId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ong_profiles` ADD CONSTRAINT `ong_profiles_ongId_fkey` FOREIGN KEY (`ongId`) REFERENCES `ongs`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
