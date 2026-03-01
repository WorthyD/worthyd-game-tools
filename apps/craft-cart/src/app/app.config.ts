import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { shellProviders, shellRoutes, ScraperConfigToken } from '@crafting-cart/shell';
import { getLocalStorageToken } from '@worthyd/shared/utils/local-storage';
import { config } from './catalog/config';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    getLocalStorageToken('CC-Base'),
    provideRouter(shellRoutes),
    { provide: ScraperConfigToken, useValue: config },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' }
    },
    ...shellProviders
  ]
};
