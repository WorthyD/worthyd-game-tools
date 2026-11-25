import { almanacGameUrl } from '@cozy-almanacs/landing';
import { almanacGames, gameUrlPattern } from './games';

describe('almanacGames', () => {
  it('gives every game a unique id and subdomain', () => {
    expect(new Set(almanacGames.map((game) => game.id)).size).toBe(almanacGames.length);
    expect(new Set(almanacGames.map((game) => game.subdomain)).size).toBe(almanacGames.length);
  });

  it('links Stardew Valley to its subdomain', () => {
    const stardew = almanacGames.find((game) => game.id === 'stardew-valley');
    expect(stardew && almanacGameUrl(stardew, gameUrlPattern)).toBe('https://stardew-valley.cozyalmanacs.com');
  });
});
