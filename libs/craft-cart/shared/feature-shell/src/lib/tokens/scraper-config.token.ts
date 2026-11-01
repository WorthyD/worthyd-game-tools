import { InjectionToken } from '@angular/core';
import { ScraperConfig } from '@crafting-cart/shared/models';

export const ScraperConfigToken = new InjectionToken<ScraperConfig>('ScraperConfig');
