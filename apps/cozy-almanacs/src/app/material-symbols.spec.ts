import { ApplicationInitStatus } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material/icon';
import { MATERIAL_SYMBOLS_FONT_SET, provideMaterialSymbols } from './material-symbols';

describe('provideMaterialSymbols', () => {
  it('should make Material Symbols the default mat-icon font set', async () => {
    TestBed.configureTestingModule({ providers: [provideMaterialSymbols()] });
    await TestBed.inject(ApplicationInitStatus).donePromise;

    expect(TestBed.inject(MatIconRegistry).getDefaultFontSetClass()).toEqual([MATERIAL_SYMBOLS_FONT_SET]);
  });
});
