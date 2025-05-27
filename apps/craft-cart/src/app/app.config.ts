import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { shellProviders, shellRoutes } from '@crafting-cart/shell';
import { getLocalStorageToken } from '@worthyd/shared/utils/local-storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    getLocalStorageToken('CC-Base'),
    provideRouter(shellRoutes),
    ...shellProviders
  ]
};
