import { ScraperConfig } from './config.model';
import { config as SDConfig } from './stardew';

export const config: ScraperConfig = {
  ...SDConfig,
  configOutputPath:'./apps/cozy-almanacs/src/app/catalog/items.ts',
  imagePath: './apps/cozy-almanacs/src/assets/images/'
};
