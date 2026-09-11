-- CreateTable
CREATE TABLE `material` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` TEXT NULL,
    `tipo` ENUM('CAPITAL', 'CONSUMIVEL') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `atributo` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `tipo_valor` ENUM('TEXTO', 'INTEIRO', 'DECIMAL', 'BOOLEANO') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `variante_material` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `material_id` BIGINT NOT NULL,

    INDEX `variante_material_material_id_idx`(`material_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `material_atributo` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `material_id` BIGINT NOT NULL,
    `atributo_id` BIGINT NOT NULL,

    UNIQUE INDEX `material_atributo_material_id_atributo_id_key`(`material_id`, `atributo_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `item_capital` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `variante_material_id` BIGINT NOT NULL,
    `numero_patrimonio` VARCHAR(191) NOT NULL,
    `data_baixa` DATE NULL,

    UNIQUE INDEX `item_capital_numero_patrimonio_key`(`numero_patrimonio`),
    INDEX `item_capital_variante_material_id_idx`(`variante_material_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estoque` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `variante_material_id` BIGINT NOT NULL,
    `quantidade` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `estoque_variante_material_id_key`(`variante_material_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `variante_atributo` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `variante_material_id` BIGINT NOT NULL,
    `atributo_id` BIGINT NOT NULL,
    `valor_texto` VARCHAR(191) NULL,
    `valor_inteiro` BIGINT NULL,
    `valor_decimal` DECIMAL(18, 6) NULL,
    `valor_booleano` BOOLEAN NULL,

    UNIQUE INDEX `variante_atributo_variante_material_id_atributo_id_key`(`variante_material_id`, `atributo_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `variante_material` ADD CONSTRAINT `variante_material_material_id_fkey` FOREIGN KEY (`material_id`) REFERENCES `material`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `material_atributo` ADD CONSTRAINT `material_atributo_material_id_fkey` FOREIGN KEY (`material_id`) REFERENCES `material`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `material_atributo` ADD CONSTRAINT `material_atributo_atributo_id_fkey` FOREIGN KEY (`atributo_id`) REFERENCES `atributo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item_capital` ADD CONSTRAINT `item_capital_variante_material_id_fkey` FOREIGN KEY (`variante_material_id`) REFERENCES `variante_material`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estoque` ADD CONSTRAINT `estoque_variante_material_id_fkey` FOREIGN KEY (`variante_material_id`) REFERENCES `variante_material`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `variante_atributo` ADD CONSTRAINT `variante_atributo_variante_material_id_fkey` FOREIGN KEY (`variante_material_id`) REFERENCES `variante_material`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `variante_atributo` ADD CONSTRAINT `variante_atributo_atributo_id_fkey` FOREIGN KEY (`atributo_id`) REFERENCES `atributo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
