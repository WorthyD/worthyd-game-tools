---
description: Jest 30 + jest-preset-angular 16 in Nx — zone test env, strict template errors, signal inputs, HTTP, harnesses, mocks, running via nx
globs: ["**/*.spec.ts", "**/jest.config.*", "**/jest.preset.*", "**/test-setup.ts"]
---

# Jest

Installed: **Jest 30**, **jest-preset-angular 16**, `@nx/jest`, `jest-environment-jsdom`,
`jasmine-marbles`. Every Angular project has its own `jest.config.ts` extending the root
`jest.preset.js` (coverage on by default) and a `src/test-setup.ts`.

Don't migrate to Vitest (the Angular CLI default for new projects) unless asked. `jest.base.config.js`
at the root is unused legacy.

## Running

```bash
npx nx test <project>
npx nx test <project> --testFile=item-card        # one file (pattern)
npx nx test <project> -t "adds item to cart"      # by name
npx nx test <project> --watch
npx nx affected -t test
npm run test                                       # everything, maxWorkers=1
```

## Test setup (zone.js)

All apps use zone.js, so test setups use the zone environment and fail on unknown elements and
properties:

```ts
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv({
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true
});
```

New projects from the generator get this; keep the error flags on. Because of them, a test fails
if you forget to import a component/directive the template uses — fix the imports, don't turn the
flags off. `fakeAsync`/`tick` work (zone.js is present).

## Component tests

```ts
describe('ItemCardComponent', () => {
  let fixture: ComponentFixture<ItemCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemCardComponent],                       // standalone: import, don't declare
      providers: [{ provide: CartFacade, useValue: { addItemToCart: jest.fn() } }]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemCardComponent);
    fixture.componentRef.setInput('item', anItem({ name: 'Iron Bar' }));   // signal inputs
    fixture.detectChanges();
  });

  it('shows the item name', () => {
    expect(fixture.nativeElement.textContent).toContain('Iron Bar');
  });
});
```

- Set inputs with `fixture.componentRef.setInput()` (works for signal and decorator inputs).
- For DCD NgModule components: `declarations: [Comp]` + `imports: [the module's deps]`, or import
  the module itself.
- Assert on rendered DOM and emitted outputs, not private fields.
- Query with stable hooks (`[data-testid="..."]`, text, role) — not Material/Tailwind classes.
- Material components → harnesses (see `angular-material.md`).
- Snapshot serializers are configured, but don't add markup snapshots — assert specific behavior.

## Services, HTTP, DI functions

```ts
TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
const http = TestBed.inject(HttpTestingController);
const result = firstValueFrom(TestBed.inject(ThingApi).getAll());
http.expectOne('/api/things').flush([{ id: '1' }]);
expect(await result).toEqual([{ id: '1' }]);
afterEach(() => http.verify());
```

- Guards/resolvers/interceptors using `inject()`: `TestBed.runInInjectionContext(() => fn(...))`.
- Effects for signals: `TestBed.tick()`.
- Observables: `readFirst(obs$)` from `@nx/angular/testing`, `firstValueFrom`, or
  `jasmine-marbles` for timing-sensitive streams.
- IndexedDB/local storage (`idb`, `idb-keyval`, `LocalStorageService`): mock the wrapping service
  through DI; jsdom has no IndexedDB.

## Mocks

- `jest.fn()`, `jest.spyOn(obj, 'm').mockReturnValue(...)`, `mockResolvedValue` for promises.
- Type doubles: `const facade: jest.Mocked<Pick<CartFacade, 'addItemToCart'>> = { addItemToCart: jest.fn() };`
  — no `as any`.
- Mock at the DI level; avoid `jest.mock()` on Angular or NgRx modules.
- `jest.useFakeTimers()` for timers/dates; no real network.

## Style

- One behavior per `it`, named for the behavior ("removes the item when quantity reaches 0").
- Arrange/Act/Assert; small builders (`anItem({...})`) over large fixtures.
- Specs sit next to the code (`foo.component.spec.ts`).
- Several existing specs are commented out or still the generated default; don't count those as
  coverage — when you touch that code, give it real tests.
