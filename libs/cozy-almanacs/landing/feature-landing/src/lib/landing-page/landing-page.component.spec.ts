import { TestBed } from '@angular/core/testing';
import { AlmanacGame } from '@cozy-almanacs/models';
import { provideAlmanacGames } from '../almanac-games';
import { LandingPageComponent } from './landing-page.component';

const game = (overrides: Partial<AlmanacGame>): AlmanacGame => ({
  id: 'stardew-valley',
  name: 'Stardew Valley',
  subdomain: 'stardew-valley',
  tagline: 'Pelican Town and beyond',
  description: 'Crafting and bundles.',
  icon: 'agriculture',
  features: ['Catalog', 'Crafting Cart'],
  status: 'available',
  ...overrides
});

const render = (games: AlmanacGame[], urlPattern?: string): HTMLElement => {
  TestBed.configureTestingModule({
    imports: [LandingPageComponent],
    providers: [provideAlmanacGames({ games, urlPattern })]
  });
  const fixture = TestBed.createComponent(LandingPageComponent);
  fixture.detectChanges();
  return fixture.nativeElement;
};

const cards = (page: HTMLElement) => Array.from(page.querySelectorAll<HTMLElement>('[data-testid="game-card"]'));

describe('LandingPageComponent', () => {
  it('describes the project and its features', () => {
    const page = render([]);

    expect(page.querySelector('h1')?.textContent).toContain('cozy almanac');
    const features = Array.from(page.querySelectorAll('[data-testid="feature"] h3')).map((h) => h.textContent?.trim());
    expect(features).toEqual(['Catalog', 'Crafting Cart', 'Bundle Tracker', 'Remembers your place']);
  });

  it('lists one card per configured game, in order', () => {
    const page = render([game({}), game({ id: 'mistria', name: 'Fields of Mistria', subdomain: 'fields-of-mistria' })]);

    expect(cards(page).map((card) => card.querySelector('h3')?.textContent?.trim())).toEqual([
      'Stardew Valley',
      'Fields of Mistria'
    ]);
    expect(cards(page)[0].textContent).toContain('Pelican Town and beyond');
    expect(cards(page)[0].querySelectorAll('li').length).toBe(2);
  });

  it('links each available game to its subdomain using the default pattern', () => {
    const page = render([game({})]);

    const link = cards(page)[0].querySelector<HTMLAnchorElement>('[data-testid="game-link"]');
    expect(link?.getAttribute('href')).toBe('https://stardew-valley.cozyalmanacs.com');
    expect(link?.textContent).toContain('Open the almanac');
  });

  it('builds links from a configured URL pattern', () => {
    const page = render([game({})], 'https://{subdomain}.example.test');

    expect(page.querySelector('[data-testid="game-link"]')?.getAttribute('href')).toBe(
      'https://stardew-valley.example.test'
    );
  });

  it('lists coming-soon games without a link', () => {
    const page = render([game({ status: 'coming-soon' })]);

    expect(cards(page)[0].querySelector('[data-testid="game-link"]')).toBeNull();
    expect(cards(page)[0].textContent).toContain('Coming soon');
  });
});
