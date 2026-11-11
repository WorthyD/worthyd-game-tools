import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { shellProviders, shellRoutes, ScraperConfigToken } from '@cozy-almanacs/shell';
import { getLocalStorageToken } from '@worthyd/shared/utils/local-storage';
import { provideCatalogDatasets } from '@cozy-almanacs/state';
import { config } from './catalog/config';
import { catalogDatasets } from './catalog/datasets';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideMaterialSymbols } from './material-symbols';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    getLocalStorageToken('CC-Base'),
    provideRouter(shellRoutes),
    { provide: ScraperConfigToken, useValue: config },
    provideCatalogDatasets(catalogDatasets),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' }
    },
    provideMaterialSymbols(),
    ...shellProviders
  ]
};
