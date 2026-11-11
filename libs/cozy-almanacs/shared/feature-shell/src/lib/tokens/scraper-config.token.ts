import { InjectionToken } from '@angular/core';
import { ScraperConfig } from '@cozy-almanacs/models';

export const ScraperConfigToken = new InjectionToken<ScraperConfig>('ScraperConfig');
