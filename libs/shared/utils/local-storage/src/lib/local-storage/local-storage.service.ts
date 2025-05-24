import { Inject, Injectable } from '@angular/core';
// import { tryJSONParse } from '@dcd/shared/utils';
import {tryJSONParse} from '@worthyd/shared/utils/generic';
import { LOCAL_STORAGE_TOKEN } from './local-storage.token';

// const APP_PREFIX = 'D2DASH-';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly APP_PREFIX: string;
  constructor(@Inject(LOCAL_STORAGE_TOKEN) private readonly app_prefix: string) {
    this.APP_PREFIX = this.app_prefix;
  }

  static loadInitialState() {
    return Object.keys(localStorage).reduce((state: any, storageKey) => {
      if (storageKey.includes()) {
        const stateKeys = storageKey
          .replace(APP_PREFIX, '')
          .toLowerCase()
          .split('.')
          .map((key) =>
            key
              .split('-')
              .map((token, index) => (index === 0 ? token : token.charAt(0).toUpperCase() + token.slice(1)))
              .join('')
          );
        let currentStateRef = state;
        stateKeys.forEach((key, index) => {
          if (index === stateKeys.length - 1) {
            currentStateRef[key] = JSON.parse(localStorage.getItem(storageKey) ?? '');
            return;
          }
          currentStateRef[key] = currentStateRef[key] || {};
          currentStateRef = currentStateRef[key];
        });
      }
      return state;
    }, {});
  }

  setItem(key: string, value: any) {
    localStorage.setItem(`${this.APP_PREFIX}${key}`, JSON.stringify(value));
  }

  getItem<T>(key: string): T | undefined {
    return tryJSONParse<T>(localStorage.getItem(`${this.APP_PREFIX}${key}`) ?? '');
  }

  removeItem(key: string) {
    localStorage.removeItem(`${this.APP_PREFIX}${key}`);
  }

  /** Tests that localStorage exists, can be written to, and read from. */
  testLocalStorage() {
    const testValue = 'testValue';
    const testKey = 'testKey';
    let retrievedValue: string | undefined;
    const errorMessage = 'localStorage did not return expected value';

    this.setItem(testKey, testValue);
    retrievedValue = this.getItem(testKey);
    this.removeItem(testKey);

    if (retrievedValue !== testValue) {
      throw new Error(errorMessage);
    }
  }
}
