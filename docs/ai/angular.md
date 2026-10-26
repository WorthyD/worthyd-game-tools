---
description: Angular 21 in this repo — standalone + signals for new code, coexisting with DCD NgModules; zone.js; routing, DI, HTTP, forms
globs: ["**/*.ts", "**/*.html"]
---

# Angular

Installed: **Angular 21.2**, with **zone.js** in every app.

## Two eras in one repo

| | Craft Cart + shared (newer) | DCD (older) |
|---|---|---|
| Components | standalone | many declared in NgModules (`*.module.ts`) |
| Routing | `Routes` arrays (`shellRoutes`) | lazy `loadChildren` of `*RoutingModule` / `*ShellModule` |
| DI | `inject()` | often constructor injection |
| Templates | `@if` / `@for` | mostly migrated to `@if` / `@for` |

**Rules:**

- **New** components, directives and pipes are standalone, use `inject()`, signals and `OnPush`,
  in either product.
- When adding to an **existing DCD NgModule lib**, write the new component as standalone and add it
  to the module's `imports`/`exports`. Don't convert the rest of the module unless asked.
- Don't add `standalone: true` (it's the default); leave existing occurrences alone.

## File naming

Use the repo's existing style: `foo.component.ts|html|scss`, `foo.service.ts`, `foo.guard.ts`,
`foo.pipe.ts`, class names with type suffixes (`ItemCardComponent`). `nx.json` configures
generators to produce this — don't switch to the suffix-less v20+ style.

## Components (new code)

```ts
@Component({
  selector: 'lib-item-card',                     // dcd- for DCD libs, app- in apps
  imports: [MatCardModule, DecimalPipe],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemCardComponent {
  private readonly cart = inject(CartFacade);

  readonly item = input.required<CatalogItem>();
  readonly compact = input(false);
  readonly added = output<string>();

  protected readonly label = computed(() => `${this.item().name} (${this.item().quantity})`);
}
```

- `ChangeDetectionStrategy.OnPush` always.
- Signal APIs: `input()`, `input.required()`, `output()`, `model()`, `viewChild()`,
  `viewChildren()`, `contentChild()`, `contentChildren()`. No new `@Input`/`@Output`/`@ViewChild`.
- `host: {}` metadata instead of `@HostBinding` / `@HostListener`.
- **ui** libs are presentational: inputs in, outputs out, no store/facade/HTTP injection.
- `protected` for template-only members; `readonly` where possible.
- Component styles budget in apps is 4 kB warn / 8 kB error — keep component SCSS small and use
  Tailwind (Craft Cart) or shared theme utilities (DCD).

## Templates

- `@if`, `@for (x of xs; track x.id)`, `@empty`, `@switch`, `@let`, `@defer`. No new
  `*ngIf`/`*ngFor`.
- `track` a stable id, not `$index`, unless items are primitives.
- `[class.x]`/`[style.x]` bindings over `ngClass`/`ngStyle`.
- No method calls for derived values — use `computed()` or a pure pipe. Reading signals is fine.
- Observables from facades/stores: `async` pipe or `toSignal()` — don't `subscribe()` in
  components without `takeUntilDestroyed()`.
- Self-closing tags for empty components (`<lib-item-card [item]="i" />`).
- Accessibility: `<button>` for actions, labels on inputs, `aria-label` on icon-only buttons.

## Signals and RxJS

- `signal()` local state, `computed()` derived, `linkedSignal()` for state that resets with a
  source.
- `effect()` only for side effects leaving Angular (storage, analytics, imperative APIs). Never to
  sync one signal into another.
- Async data in v21: `resource()` / `rxResource()` / `httpResource()` are available; check their
  stability in the installed version before using in shared libs. RxJS + `toSignal()` is always fine.
- Interop: `toSignal(obs$, { initialValue })`, `toObservable()`, `takeUntilDestroyed()`.
- `untracked()` to read without creating a dependency.

## Dependency injection

- `inject()` in new code (components, services, guards, interceptors, factories).
- `@Injectable({ providedIn: 'root' })` for app-wide services. Libs that need app-specific setup
  expose `provideXxx()` / `xxxProviders` functions (e.g. `providePlayerSidebar()`,
  `shellProviders`) and `InjectionToken`s (e.g. `ScraperConfigToken`, `getLocalStorageToken()`).
  Follow that pattern rather than adding `forRoot()` modules.

## Routing

- New feature areas: export `Routes` from the feature/shell lib and lazy-load with
  `loadChildren: () => import('@scope/lib').then((m) => m.routes)` or `loadComponent`.
- DCD's existing `loadChildren` → `*Module` routes stay as they are unless you're asked to migrate.
- New guards/resolvers are functional (`CanActivateFn`, `ResolveFn<T>`) using `inject()`.

## HTTP and data

- Components never call `HttpClient` directly — go through a `data-access` service.
- DCD talks to the Bungie API via `bungie-api-angular` and caches in IndexedDB (`idb`,
  `idb-keyval`, `@dcd/shared/utils/storage`); reuse those services rather than adding new caching.
- Type every response; map API DTOs to models from a `type:model` lib.
- Functional interceptors (`HttpInterceptorFn`) for new interceptors.

## Forms

- Typed reactive forms (`NonNullableFormBuilder` via `inject`). Signal Forms are experimental in
  v21 — don't introduce them.
- `MAT_FORM_FIELD_DEFAULT_OPTIONS` is set at app level; don't override per field without reason.

## TypeScript

- `strict` is off, but write as if it were on: no `any` (use `unknown` + narrowing), handle
  `undefined`, avoid `!` assertions.
- Type-only libs go in `type:model` libs; don't put interfaces in feature libs that others import.
