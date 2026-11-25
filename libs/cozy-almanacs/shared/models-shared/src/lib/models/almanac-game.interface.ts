/** Whether a game's almanac is live. Coming-soon games are listed on the landing page but not linked. */
export type AlmanacGameStatus = 'available' | 'coming-soon';

/**
 * A game listed on the Cozy Almanacs landing page. Each game's almanac is its own app on its own subdomain,
 * e.g. stardew-valley.cozyalmanacs.com.
 */
export interface AlmanacGame {
  id: string;
  name: string;
  /** Filled into the landing page's game URL pattern, e.g. 'stardew-valley'. */
  subdomain: string;
  /** One short line under the game's name. */
  tagline: string;
  description: string;
  /** Material Symbols ligature shown on the game's card, e.g. 'agriculture'. */
  icon: string;
  /** Feature names shown on the game's card, e.g. 'Crafting Cart'. */
  features: string[];
  status: AlmanacGameStatus;
  /** A full URL that wins over the URL pattern, e.g. a local dev server. */
  url?: string;
}
