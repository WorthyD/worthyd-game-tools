---
description: "Nx workspace conventions for worthyd-game-tools — layout, type tags, generators (incl. dcd-lib-generator), inferred targets, affected"
applyTo: "**"
---
<!-- GENERATED from docs/ai/nx-workspace.md by tools/ai/sync-ai-rules.mjs — edit the source, then run `npm run ai:sync`. -->

# Nx workspace

Nx 24.0, Nx Cloud disabled (`neverConnectToCloud`), npm.

## Mental model

- Projects (apps + libs) form a graph; Nx caches and parallelizes **targets**.
- Some targets are written in `project.json` (`build`, `serve`, `test`, `lint`), others are
  **inferred** by plugins in `nx.json`:
  - `@nx/cypress/plugin` → `e2e`, `open-cypress`, `e2e-ci`, `component-test`
  - `@nx/eslint/plugin` → `lint`
  - `@nx/storybook/plugin` → `storybook`, `build-storybook`, `test-storybook`, `static-storybook`
- **Never guess targets** — run `npx nx show project <name> --json`.
- Shared target settings are in `nx.json` → `targetDefaults` (Jest uses `passWithNoTests`; a `ci`
  configuration adds coverage).

## Layout

```
apps/<app>/                      # bootstrapping, app config, top-level routes
apps/<app>-e2e/                  # Cypress E2E for <app> (cypressDir: src)
libs/dcd/<domain>/<lib>          # e.g. dcd/activities/{shell,dashboard,data-access,models,ui,table}
libs/dcd/shared/...              # DCD-wide data-access, models, ui, utils
libs/cozy-almanacs/shared/<lib>  # feature-shell, data-access-state, models-shared, ui-item-card
libs/cozy-almanacs/crafting-cart/<lib>  # feature-catalog, feature-shopping-list, feature-cart-item-config,
                                 # feature-cart-widget, ui-cart-item-card, ui-cart-quantity
libs/shared/{ui,utils}/...       # cross-product (@worthyd/shared/...)
libs/dcd-plugin                  # local Nx plugin (generators)
```

Keep app projects thin; put features in libs.

## Tags and boundaries

`eslint.config.cjs` enforces `@nx/enforce-module-boundaries` with **type tags only** (no scope tags):

| Tag | May depend on |
|---|---|
| `type:app` | feature, ui, data-access, util, model |
| `type:feature` | feature, ui, data-access, util, model |
| `type:ui` | ui, util, data-access, model |
| `type:data-access` | data-access, util, model |
| `type:util` | util, model |
| `type:model` | model |

- Every new lib **must** have exactly one of these tags. Note the spelling: **`type:util`**
  (not `type:utils`) and **`type:model`** for interface/type-only libs.
- `enforceBuildableLibDependency` is on.
- Don't loosen the rule to make an import pass — move the code to the right lib type instead.
- Cross-product imports (DCD ↔ Cozy Almanacs) aren't enforced by tags but should not happen; share
  through `libs/shared` (`@worthyd/shared/...`).

## Imports

- Only through aliases in `tsconfig.base.json` (`@dcd/activities/models`,
  `@cozy-almanacs/state`, `@worthyd/shared/utils/local-storage`).
- Never relative-import across libs (`../../../libs/...`) or deep-import into `src/lib/...`.
  Export what consumers need from the lib's `src/index.ts`.

## Generators

Always `--dry-run` first.

```bash
# New DCD lib (local plugin: sets libs/dcd/<name>, @dcd/<name>, prefix dcd, tag, jest)
npx nx g dcd-plugin:dcd-lib-generator activities/new-thing --libType=type:ui --dry-run

# Other libs: give path, import alias, tag explicitly
npx nx g @nx/angular:library libs/cozy-almanacs/crafting-cart/ui-thing \
  --importPath=@cozy-almanacs/crafting-cart/ui/thing --tags=type:ui --changeDetection=OnPush --dry-run
npx nx g @nx/angular:library libs/shared/utils/thing \
  --importPath=@worthyd/shared/utils/thing --tags=type:util --dry-run

# Components, Storybook, Cypress component tests
npx nx g @nx/angular:component libs/<path>/src/lib/foo/foo --changeDetection=OnPush --dry-run
npx nx g @nx/angular:stories <project>
npx nx g @nx/angular:cypress-component-configuration --project=<project> --build-target=cozy-almanacs:build
```

`nx.json` already defaults generators to SCSS, Jest, Cypress and ESLint, and to the `.component.ts`
/ `.service.ts` / `.directive.ts` file-name style.

## Running tasks

```bash
npx nx run <project>:<target>[:config]
npx nx run-many -t test -p a b
npx nx affected -t lint test build          # use after changes
npx nx reset                                # stale cache/daemon
```

`npm test` runs all Jest projects with `--maxWorkers=1`; prefer `affected` while iterating.

## Tooling notes

- Cozy Almanacs' `build`/`serve` run the `@juristr/nx-tailwind-sync:source-directives` **sync
  generator**, which maintains Tailwind `@source` directives for lib dependencies. Run `npx nx sync`
  if Nx reports the workspace is out of sync; don't hand-edit what it manages.
- Nx Console writes `.github/instructions/nx.instructions.md` (gitignored). It's separate from
  these guides — leave it alone.
- Upgrades: `npx nx migrate latest` → `npm install` → `npx nx migrate --run-migrations`.
  Don't bump `@nx/*`, `@angular/*` or `@ngrx/*` by hand.
- Don't edit `.nx/`, `.angular/`, `dist/`, `coverage/` or `node_modules/`.

## Nx MCP server

If the `nx-mcp` server is connected, prefer its tools for workspace questions (project details,
generator schemas, Nx docs) over guessing from files.
