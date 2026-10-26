# AGENTS.md

Guidance for AI coding agents (Claude Code, GitHub Copilot, and any tool that reads `AGENTS.md`).
This file and `docs/ai/` are the **single source of truth**. `CLAUDE.md` imports this file, and
`.github/copilot-instructions.md`, `.github/instructions/` and `.claude/rules/` are generated from
them — edit the sources, then run `npm run ai:sync`.

## Repository at a glance

`worthyd-game-tools` is an **Nx 22** monorepo of **Angular 21** apps for video-game tooling.

| Product | Apps | Libs | Import alias | Selector prefix |
|---|---|---|---|---|
| Destiny Clan Dashboard (DCD) | `destiny-clan-dashboard`, `destiny-clan-dashboard-demo` | `libs/dcd/**` | `@dcd/...` | `dcd-` |
| Craft Cart | `craft-cart`, `stardew-craft-cart` | `libs/craft-cart/**` | `@crafting-cart/...` | `lib-` / `app-` |
| Shared | — | `libs/shared/**` | `@worthyd/shared/...` | `lib-` |

Each app has a matching `<app>-e2e` Cypress project. `libs/dcd-plugin` is a local Nx plugin with
the `dcd-lib-generator` generator. `scrapers/` holds `tsx` scripts that produce the Craft Cart
catalog data (`npm run stardew`, `npm run craft-cart`); `reference-json/` is their source data.

**Installed versions** (check `package.json` before relying on newer APIs): Angular 21.2,
Angular Material/CDK 21.2 (M3 theming), NgRx 21 (Store, Effects, Entity, SignalStore,
ComponentStore), Tailwind 4, Jest 30 + `jest-preset-angular` 16, Cypress 15, Storybook 10,
TypeScript 5.9, Node 22 (`.nvmrc`), npm.

**Important realities of this codebase:**

- **All apps use zone.js** (`provideZoneChangeDetection`). Don't write code that only works zoneless,
  and don't migrate apps to zoneless unless asked.
- **DCD is the older codebase**: many libs are NgModule-based (`*.module.ts`, `*-routes.module.ts`),
  routes lazy-load modules, and services often use constructor injection. Craft Cart is newer and
  fully standalone.
- **TypeScript `strict` is not enabled** in `tsconfig.base.json`. Write strict-safe code anyway
  (no implicit `any`, handle `undefined`).
- DCD needs `npm run config` (writes `apps/destiny-clan-dashboard/src/environments/secrets.ts`
  from the `API_KEY` env var) before it builds. Never commit that file or print its contents.

## Topic guides (read the relevant one before writing code in that area)

| Area | Guide | Auto-loaded for |
|---|---|---|
| Nx workspace, generators, tags | [docs/ai/nx-workspace.md](docs/ai/nx-workspace.md) | always |
| Angular components, DI, signals, routing | [docs/ai/angular.md](docs/ai/angular.md) | `*.ts`, `*.html` |
| Angular Material / CDK, theming | [docs/ai/angular-material.md](docs/ai/angular-material.md) | `*.html`, `*.scss` |
| Tailwind CSS | [docs/ai/tailwind.md](docs/ai/tailwind.md) | `*.html`, `*.css`, `*.scss`, tailwind/postcss config |
| NgRx Store, facades, SignalStore | [docs/ai/ngrx.md](docs/ai/ngrx.md) | state files (`*.actions.ts`, `*.facade.ts`, `*-store.ts`, …) |
| Jest unit tests | [docs/ai/jest.md](docs/ai/jest.md) | `*.spec.ts`, jest config |
| Cypress E2E / component tests | [docs/ai/cypress.md](docs/ai/cypress.md) | `*.cy.ts`, `cypress/`, `*-e2e/` |

These guides exist so you **don't need to fetch external docs** for routine work. Only go to the
web (or the Nx / Angular CLI MCP servers) for APIs the guides don't cover.

## Commands (always go through Nx)

```bash
npm start                                  # DCD dev server on :4321
npx nx serve craft-cart                    # Craft Cart dev server on :4322
npx nx show projects
npx nx show project <name> --json          # real targets — many are inferred by plugins
npx nx test <project>                      # Jest
npx nx lint <project>
npx nx build <project>
npx nx e2e <app>-e2e                       # Cypress E2E
npx nx component-test <lib>                # Cypress component tests (some ui libs)
npx nx storybook <lib>                     # Storybook (some ui libs)
npx nx affected -t lint test build         # verify everything your change touched
```

Don't call `ng`, `jest` or `cypress` directly. The old `ng ...` scripts in `package.json`
(prefixed with underscores) are dead — ignore them.

## Golden rules

1. **Match the surrounding code.** Follow the conventions of the lib you're editing. Use modern
   patterns for *new* files, but don't refactor or migrate existing code (NgModule → standalone,
   Store → SignalStore, constructor → `inject()`) unless asked.
2. **Use generators** for new libs and components so tags, Jest config and lint are wired correctly.
3. **Respect module boundaries.** Import other libs only via their `tsconfig.base.json` alias,
   never relative paths or deep imports. Every lib needs a `type:*` tag (see the Nx guide).
4. **Tests ship with code.** New behavior needs a Jest spec; new user flows need a Cypress test.
5. **Formatting** follows `.prettierrc`: single quotes, 120-char lines, no trailing commas, 2 spaces.
6. **No secrets.** Don't read `.env*` or `secrets.ts`; never hard-code API keys.

## Definition of done

- `npx nx affected -t lint test build` passes (add `e2e` when UI flows changed).
- No new `any`; no disabled lint rules without a comment explaining why.
- A touched lib's `src/index.ts` exports only what consumers need.
- Summarize what changed and anything you couldn't verify.
