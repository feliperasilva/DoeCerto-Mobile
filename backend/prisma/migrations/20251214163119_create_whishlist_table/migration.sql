-- CreateTable
CREATE TABLE `wishlist_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ongId` INTEGER NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `quantity` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `wishlist_items` ADD CONSTRAINT `wishlist_items_ongId_fkey` FOREIGN KEY (`ongId`) REFERENCES `ongs`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
