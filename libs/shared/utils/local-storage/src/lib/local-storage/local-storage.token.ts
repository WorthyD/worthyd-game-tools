import { InjectionToken, ValueProvider } from '@angular/core';

export const LOCAL_STORAGE_TOKEN = new InjectionToken<string>('local_storage_token');

export const getLocalStorageToken = (value: string): ValueProvider => ({
  provide: LOCAL_STORAGE_TOKEN,
  useValue: value
});
