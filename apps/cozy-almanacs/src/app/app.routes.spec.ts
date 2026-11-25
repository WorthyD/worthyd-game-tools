import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { LandingPageComponent, provideAlmanacGames } from '@cozy-almanacs/landing';
import { getLocalStorageToken } from '@worthyd/shared/utils/local-storage';
import { appRoutes } from './app.routes';
import { almanacGames } from './games/games';

describe('appRoutes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(appRoutes),
        provideAlmanacGames({ games: almanacGames }),
        getLocalStorageToken('APP-ROUTES-TEST-')
      ]
    });
  });

  it('shows the landing page at the root instead of redirecting', async () => {
    const harness = await RouterTestingHarness.create();
    const page = await harness.navigateByUrl('/', LandingPageComponent);

    expect(page).toBeInstanceOf(LandingPageComponent);
    expect(TestBed.inject(Location).path()).toBe('');
  });

  it('keeps the shell routes', () => {
    expect(TestBed.inject(Router).config.length).toBeGreaterThan(1);
  });
});
