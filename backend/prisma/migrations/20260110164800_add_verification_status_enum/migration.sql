/*
  Warnings:

  - You are about to alter the column `isVerified` on the `ongs` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `ongs` MODIFY `isVerified` ENUM('pending', 'verified', 'rejected') NOT NULL DEFAULT 'pending';
