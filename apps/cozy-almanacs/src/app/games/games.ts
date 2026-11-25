import { AlmanacGame } from '@cozy-almanacs/models';

/**
 * Where each game's almanac lives; `{subdomain}` is replaced with the game's `subdomain`.
 * The domain layout isn't final, so change it here (a game's own `url` still wins over it).
 */
export const gameUrlPattern = 'https://{subdomain}.cozyalmanacs.com';

/**
 * The games listed on the landing page, in display order. To add a game, add an entry here; use
 * `status: 'coming-soon'` to list it before its almanac is live.
 */
export const almanacGames: AlmanacGame[] = [
  {
    id: 'stardew-valley',
    name: 'Stardew Valley',
    subdomain: 'stardew-valley',
    tagline: 'Pelican Town and beyond',
    description:
      'Crafting recipes for sprinklers, machines, fertilizer and more, with a combined shopping list and Community Center bundle tracking.',
    icon: 'agriculture',
    features: ['Catalog', 'Crafting Cart', 'Bundle Tracker'],
    status: 'available'
  }
];
