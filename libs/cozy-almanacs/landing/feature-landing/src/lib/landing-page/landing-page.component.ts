import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AlmanacGame } from '@cozy-almanacs/models';
import { ALMANAC_GAME_URL_PATTERN, ALMANAC_GAMES, almanacGameUrl } from '../almanac-games';

interface LandingFeature {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface LandingStep {
  id: string;
  title: string;
  description: string;
}

/** A listed game plus its link, or `null` while its almanac is still being written. */
export interface GameCard extends AlmanacGame {
  href: string | null;
}

/**
 * Cozy Almanacs' front page: what the almanacs are, what's inside them and which games have one. The games come
 * from {@link ALMANAC_GAMES} (see `provideAlmanacGames()`), so adding a game is a data change, not a template change.
 */
@Component({
  selector: 'lib-landing-page',
  imports: [MatIconModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingPageComponent {
  private readonly urlPattern = inject(ALMANAC_GAME_URL_PATTERN);

  protected readonly games: GameCard[] = inject(ALMANAC_GAMES).map((game) => ({
    ...game,
    href: game.status === 'available' ? almanacGameUrl(game, this.urlPattern) : null
  }));

  protected readonly features: LandingFeature[] = [
    {
      id: 'catalog',
      name: 'Catalog',
      icon: 'auto_stories',
      description:
        'Browse every craftable item with its ingredients, categories and tags, plus a link back to the wiki when you want the whole story.'
    },
    {
      id: 'crafting-cart',
      name: 'Crafting Cart',
      icon: 'shopping_basket',
      description:
        'Add what you want to make, set how many, and get one combined shopping list of the raw materials to gather.'
    },
    {
      id: 'bundles',
      name: 'Bundle Tracker',
      icon: 'checklist',
      description:
        "Follow each bundle's requirements, tick items off as you hand them in, and see what's still missing."
    },
    {
      id: 'progress',
      name: 'Remembers your place',
      icon: 'bookmark',
      description:
        'Your cart and bundle progress stay in your browser. No account, no sign-up, just pick up where you left off.'
    }
  ];

  protected readonly steps: LandingStep[] = [
    {
      id: 'pick',
      title: 'Pick your game',
      description: 'Every game gets an almanac of its own, filled with that game’s recipes and bundles.'
    },
    {
      id: 'plan',
      title: 'Plan your crafting',
      description: 'Drop what you want to make into your cart and let the almanac add up the ingredients.'
    },
    {
      id: 'gather',
      title: 'Gather and tick off',
      description: 'Check items off as you collect them and watch your bundles fill up, one cozy evening at a time.'
    }
  ];

  protected readonly year = new Date().getFullYear();
}
