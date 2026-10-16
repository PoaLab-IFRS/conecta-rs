ALTER TABLE `Capital`
    ADD UNIQUE INDEX `capital_asset_num_unique` (`assetNum`),
    ADD UNIQUE INDEX `capital_numero_serie_unique` (`numero_serie`);
