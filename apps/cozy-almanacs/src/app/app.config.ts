import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { shellProviders } from '@cozy-almanacs/shell';
import { provideAlmanacGames } from '@cozy-almanacs/landing';
import { getLocalStorageToken } from '@worthyd/shared/utils/local-storage';
import { provideCatalogDatasets } from '@cozy-almanacs/state';
import { catalogDatasets } from './catalog/datasets';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideMaterialSymbols } from './material-symbols';
import { appRoutes } from './app.routes';
import { almanacGames, gameUrlPattern } from './games/games';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    getLocalStorageToken('CC-Base'),
    provideRouter(appRoutes),
    provideAlmanacGames({ games: almanacGames, urlPattern: gameUrlPattern }),
    provideCatalogDatasets(catalogDatasets),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' }
    },
    provideMaterialSymbols(),
    ...shellProviders
  ]
};
