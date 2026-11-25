import { TestBed } from '@angular/core/testing';
import { AlmanacGame } from '@cozy-almanacs/models';
import {
  ALMANAC_GAME_URL_PATTERN,
  ALMANAC_GAMES,
  DEFAULT_GAME_URL_PATTERN,
  almanacGameUrl,
  provideAlmanacGames
} from './almanac-games';

const stardew: AlmanacGame = {
  id: 'stardew-valley',
  name: 'Stardew Valley',
  subdomain: 'stardew-valley',
  tagline: '',
  description: '',
  icon: 'agriculture',
  features: [],
  status: 'available'
};

describe('almanacGameUrl', () => {
  it('fills the subdomain into the pattern', () => {
    expect(almanacGameUrl(stardew, 'https://{subdomain}.cozyalmanacs.com')).toBe(
      'https://stardew-valley.cozyalmanacs.com'
    );
    expect(almanacGameUrl(stardew, 'https://cozyalmanacs.com/{subdomain}/')).toBe(
      'https://cozyalmanacs.com/stardew-valley/'
    );
  });

  it("prefers the game's own url", () => {
    expect(almanacGameUrl({ ...stardew, url: 'http://localhost:4323' }, DEFAULT_GAME_URL_PATTERN)).toBe(
      'http://localhost:4323'
    );
  });
});

describe('provideAlmanacGames', () => {
  it('defaults to no games and the cozyalmanacs.com subdomain pattern', () => {
    TestBed.configureTestingModule({});
    expect(TestBed.inject(ALMANAC_GAMES)).toEqual([]);
    expect(TestBed.inject(ALMANAC_GAME_URL_PATTERN)).toBe('https://{subdomain}.cozyalmanacs.com');
  });

  it('provides the games and URL pattern', () => {
    TestBed.configureTestingModule({
      providers: [provideAlmanacGames({ games: [stardew], urlPattern: 'https://{subdomain}.example.com' })]
    });
    expect(TestBed.inject(ALMANAC_GAMES)).toEqual([stardew]);
    expect(TestBed.inject(ALMANAC_GAME_URL_PATTERN)).toBe('https://{subdomain}.example.com');
  });

  it('falls back to the default pattern', () => {
    TestBed.configureTestingModule({ providers: [provideAlmanacGames({ games: [stardew] })] });
    expect(TestBed.inject(ALMANAC_GAME_URL_PATTERN)).toBe(DEFAULT_GAME_URL_PATTERN);
  });
});
