import { Provider } from '@angular/core';

// CartStore and CatalogStore are providedIn: 'root'; apps still need getLocalStorageToken() for cart persistence.
export const shellProviders: Provider[] = [];
