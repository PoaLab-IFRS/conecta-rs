/*
  Warnings:

  - Made the column `description` on table `Capital` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nome_escola` on table `Capital` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nota_fiscal` on table `Capital` required. This step will fail if there are existing NULL values in that column.
  - Made the column `numero_serie` on table `Capital` required. This step will fail if there are existing NULL values in that column.
  - Made the column `valor` on table `Capital` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Capital` MODIFY `description` VARCHAR(191) NOT NULL,
    MODIFY `nome_escola` VARCHAR(191) NOT NULL,
    MODIFY `nota_fiscal` VARCHAR(191) NOT NULL,
    MODIFY `numero_serie` VARCHAR(191) NOT NULL,
    MODIFY `valor` DECIMAL(10, 2) NOT NULL;
