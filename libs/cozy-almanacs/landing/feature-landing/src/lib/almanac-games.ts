import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { AlmanacGame } from '@cozy-almanacs/models';

/** Placeholder filled with each game's `subdomain` when building its link. */
export const SUBDOMAIN_PLACEHOLDER = '{subdomain}';

export const DEFAULT_GAME_URL_PATTERN = `https://${SUBDOMAIN_PLACEHOLDER}.cozyalmanacs.com`;

/** The games the landing page lists, in display order. */
export const ALMANAC_GAMES = new InjectionToken<AlmanacGame[]>('ALMANAC_GAMES', { factory: () => [] });

/** Where a game's almanac lives, with `{subdomain}` standing in for the game's subdomain. */
export const ALMANAC_GAME_URL_PATTERN = new InjectionToken<string>('ALMANAC_GAME_URL_PATTERN', {
  factory: () => DEFAULT_GAME_URL_PATTERN
});

export interface AlmanacGamesConfig {
  games: AlmanacGame[];
  /** Defaults to {@link DEFAULT_GAME_URL_PATTERN}. */
  urlPattern?: string;
}

/** Registers the games the landing page lists and the URL pattern their links are built from. */
export const provideAlmanacGames = ({ games, urlPattern }: AlmanacGamesConfig): EnvironmentProviders =>
  makeEnvironmentProviders([
    { provide: ALMANAC_GAMES, useValue: games },
    { provide: ALMANAC_GAME_URL_PATTERN, useValue: urlPattern ?? DEFAULT_GAME_URL_PATTERN }
  ]);

/** A game's link: its own `url` when set, otherwise the pattern with its subdomain filled in. */
export const almanacGameUrl = (game: AlmanacGame, urlPattern: string): string =>
  game.url ?? urlPattern.replaceAll(SUBDOMAIN_PLACEHOLDER, game.subdomain);
