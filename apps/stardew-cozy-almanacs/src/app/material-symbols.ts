import { EnvironmentProviders, inject, provideAppInitializer } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';

export const MATERIAL_SYMBOLS_FONT_SET = 'material-symbols-outlined';

/**
 * Renders ligature `<mat-icon>`s with Google's Material Symbols font (https://fonts.google.com/icons),
 * which index.html loads, instead of the classic Material Icons font.
 */
export const provideMaterialSymbols = (): EnvironmentProviders =>
  provideAppInitializer(() => {
    inject(MatIconRegistry).setDefaultFontSetClass(MATERIAL_SYMBOLS_FONT_SET);
  });
