/*
  Warnings:

  - The values [cancelled] on the enum `donations_donationStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `donations` MODIFY `donationStatus` ENUM('pending', 'completed', 'canceled') NOT NULL DEFAULT 'pending';
