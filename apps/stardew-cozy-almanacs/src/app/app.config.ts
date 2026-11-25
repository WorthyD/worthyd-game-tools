import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { shellProviders, shellRoutes } from '@cozy-almanacs/shell';
import { getLocalStorageToken } from '@worthyd/shared/utils/local-storage';
import { provideCatalogDatasets } from '@cozy-almanacs/state';
import { catalogDatasets } from './catalog/datasets';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideMaterialSymbols } from './material-symbols';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    getLocalStorageToken('CC-Base'),
    provideHttpClient(withFetch()),
    provideRouter(shellRoutes),
    provideCatalogDatasets(catalogDatasets),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' }
    },
    provideMaterialSymbols(),
    ...shellProviders
  ]
};
