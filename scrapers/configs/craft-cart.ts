import { ScraperConfig } from './config.model';
import { config as SDConfig } from './stardew';

export const config: ScraperConfig = {
  ...SDConfig,
  configOutputPath:'./apps/craft-cart/src/app/catalog/items.ts',
  imagePath: './apps/craft-cart/src/assets/images/'
};
