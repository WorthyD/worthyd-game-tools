# WorthyD Game Tools

A collection of video game tools I've been building, kept together in one [Nx](https://nx.dev) monorepo of Angular apps.

| Product | Apps | Status |
|---|---|---|
| [Destiny Clan Dashboard](#destiny-clan-dashboard) | `destiny-clan-dashboard`, `destiny-clan-dashboard-demo` | Live at [destinyclan.report](https://destinyclan.report/) |
| [Cozy Almanacs](#cozy-almanacs) | `cozy-almanacs`, `stardew-cozy-almanacs` | In development |

## The projects

### Destiny Clan Dashboard

I've been working on this since 2019. It helps Destiny clan members see member activity, clan seasonal progress and other statistics that help keep a group active. The original version tracked one clan at a time; it now lets you monitor several clans at once.

- `apps/destiny-clan-dashboard`: the live app, deployed to [destinyclan.report](https://destinyclan.report/). It talks to the Bungie API.
- `apps/destiny-clan-dashboard-demo`: a static snapshot of the dashboard for demos, so there's still something to show if Bungie ever shuts down their API.
- `libs/dcd/**` (`@dcd/...`): the dashboard's feature, UI, data-access and model libs. This is the older part of the codebase, so many libs are still NgModule-based.

### Cozy Almanacs

A collection of almanacs for cozy crafting and farming sims, served at [cozyalmanacs.com](https://cozyalmanacs.com) (and [stardew.cozyalmanacs.com](https://stardew.cozyalmanacs.com) for the Stardew-themed app). The first almanac is the Crafting Cart (`/crafting-cart`), a planner that helps you plan resources. Want to make every recipe in a game? Add all the food to your cart and see which resources you need, and how many. How much wood do you need for 10 sheds? Add 10 sheds and look at the totals. It's a simple idea that I'm using to brush up on newer Angular patterns and learn Tailwind.

- `apps/cozy-almanacs` (cozyalmanacs.com): the base app for trying out layouts and features. Defaults to Stardew Valley's item lists.
- `apps/stardew-cozy-almanacs` (stardew.cozyalmanacs.com): a version themed for Stardew Valley.
- `libs/cozy-almanacs/**` (`@cozy-almanacs/...`): standalone components, NgRx state and UI libs. `shared/` holds the app frame, state, models and the item card; `crafting-cart/` holds the Crafting Cart features (`@cozy-almanacs/crafting-cart/...`).
- `scrapers/` and `reference-json/`: the scripts and source data that produce the item catalogs (see [Cozy Almanacs data](#cozy-almanacs-data)).

Code shared by both products lives in `libs/shared/**` (`@worthyd/shared/...`).

## Tech stack

Nx 24 · Angular 22.1 with Angular Material / CDK (M3 theming) · NgRx 22 · Tailwind 4 · TypeScript 6 · Jest 30 · Cypress 16 · Storybook 10 · Node 22 · npm

`package.json` has the exact versions. All apps use zone.js change detection ([ADR 0002](docs/decisions/0002-keep-zone-js-change-detection.md)).

## Getting started

You'll need Node 22 (see `.nvmrc`) and npm.

```bash
nvm use
npm install
```

The Destiny Clan Dashboard needs a [Bungie API key](https://www.bungie.net/en/Application) before it will build or serve. Put it in the `API_KEY` environment variable and generate the secrets file:

```bash
API_KEY=<your-bungie-api-key> npm run config
```

This writes `apps/destiny-clan-dashboard/src/environments/secrets.ts`, which is gitignored. Don't commit it. Cozy Almanacs doesn't need a key.

### Run an app

```bash
npm start                              # Destiny Clan Dashboard on http://localhost:4321
npx nx serve destiny-clan-dashboard-demo
npx nx serve cozy-almanacs             # http://localhost:4322
npx nx serve stardew-cozy-almanacs
```

## Everyday commands

Always run tasks through Nx (not `ng`, `jest` or `cypress` directly). Many targets are inferred by Nx plugins, so check what a project actually has with `npx nx show project <name>`.

```bash
npx nx show projects                   # list every app and lib
npx nx test <project>                  # Jest unit tests
npx nx lint <project>
npx nx build <project>
npx nx e2e <app>-e2e                   # Cypress E2E
npx nx component-test <lib>            # Cypress component tests (some UI libs)
npx nx storybook <lib>                 # Storybook (some UI libs)
npx nx affected -t lint test build     # everything your change touched
npx nx graph                           # browse the project graph
```

`npm test` runs every Jest project one worker at a time. While you're iterating, `affected` is much faster.

The `npm` scripts that start with underscores (`___test`, `____lint`, and so on) are leftovers from the pre-Nx setup and no longer work.

### Creating libs and components

Use generators so tags, Jest and lint are wired up correctly, and always `--dry-run` first. The full list, including which `type:*` tag to use, is in the [Nx workspace guide](docs/ai/nx-workspace.md#generators).

```bash
# New DCD lib (local plugin in libs/dcd-plugin)
npx nx g dcd-plugin:dcd-lib-generator activities/new-thing --libType=type:ui --dry-run

# New Cozy Almanacs or shared lib
npx nx g @nx/angular:library libs/cozy-almanacs/crafting-cart/ui-thing \
  --importPath=@cozy-almanacs/crafting-cart/ui/thing --tags=type:ui --changeDetection=OnPush --dry-run
```

### Cozy Almanacs data

```bash
npm run stardew            # scrape Stardew Valley items into the catalog
npm run stardew-validate   # check the scraped Stardew data
npm run cozy-almanacs      # build the Cozy Almanacs catalog data
```

## Repo layout

```
apps/                    apps and their <app>-e2e Cypress projects
libs/dcd/                Destiny Clan Dashboard libs        (@dcd/...)
libs/cozy-almanacs/      Cozy Almanacs libs                  (@cozy-almanacs/...)
libs/shared/             libs shared across products         (@worthyd/shared/...)
libs/dcd-plugin/         local Nx plugin with the dcd-lib-generator
scrapers/                tsx scripts that build Cozy Almanacs catalog data
reference-json/          source data for the scrapers
docs/decisions/          architecture decision records (ADRs)
docs/ai/                 coding guides for AI agents (and humans)
tools/ai/                scripts behind npm run ai:sync and npm run adr:new
```

Libs import each other only through the aliases in `tsconfig.base.json`, and every lib has one `type:*` tag that lint uses to enforce module boundaries ([ADR 0007](docs/decisions/0007-enforce-module-boundaries-with-type-tags.md)).

## Architecture decisions

Decisions about how the repo is built (zone.js, standalone vs NgModules, test tooling, module boundaries) are recorded as ADRs in [docs/decisions/](docs/decisions/README.md). The README there has the full index and explains how to write, accept and supersede one.

```bash
npm run adr:new -- "Short decision title"   # scaffold the next ADR as proposed
npm run ai:sync                             # refresh the ADR index and agent rules
```

## Working with AI agents

The repo is set up for Claude Code and GitHub Copilot from a single set of instructions:

- [AGENTS.md](AGENTS.md): repo overview, commands, golden rules and the accepted ADRs. `CLAUDE.md` imports it, and Copilot reads it directly.
- [docs/ai/](docs/ai/README.md): topic guides for Nx, Angular, Material, Tailwind, NgRx, Jest and Cypress, scoped to the files they apply to.
- `.claude/rules/`, `.github/copilot-instructions.md` and `.github/instructions/` are **generated**. Edit the sources above, then run:

```bash
npm run ai:sync    # regenerate the agent files
npm run ai:check   # fail if they're out of date (also runs in CI)
```

`.mcp.json` (Claude Code) and `.vscode/mcp.json` (Copilot) connect the Nx and Angular CLI MCP servers. See [docs/ai/README.md](docs/ai/README.md) for how the pieces fit together.

## CI/CD

GitHub Actions in `.github/workflows/`:

- `main-cicd.yml` builds the Destiny Clan Dashboard on pull requests and pushes to `main`, then deploys it to Netlify. PRs deploy to dev; `main` deploys to stage and production.
- `ai-instructions.yml` runs `npm run ai:check` on PRs that touch the agent instructions.

## Upgrading Nx and Angular

Use Nx migrations rather than bumping `@nx/*`, `@angular/*` or `@ngrx/*` by hand:

```bash
npx nx migrate latest
npm install
npx nx migrate --run-migrations
```
