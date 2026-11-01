---
status: accepted
date: 2026-11-01
decision-makers: Daniel
summary: A library's folder and Nx project name start with its type (feature-, ui-, data-access-, util-, models-), e.g. libs/craft-cart/feature-catalog; existing libs are renamed only when asked.
globs: ["libs/**/project.json", "tsconfig.base.json", "libs/dcd-plugin/**"]
enforced-by: review
superseded-by:
---

# Prefix library names with their library type

## Context and Problem Statement

Library names don't say what kind of library they are. `catalog`, `state` and `shell` could be
anything, and DCD mixes styles (`activities-data-access`, `seals-feature-seals-dashboard`,
`shared-ui-icons`). You have to open `project.json` to find a lib's `type:*` tag, which decides what it
may import ([ADR 0007](0007-enforce-module-boundaries-with-type-tags.md)).

## Considered Options

- Prefix the folder and project name with the library type
- Suffix with the type (`catalog-feature`), as most DCD libs do today
- Leave naming free and rely on tags

## Decision Outcome

Chosen option: "Prefix the folder and project name with the library type", because the type is the
first thing you need to know about a lib, and a shared prefix sorts libs of one type together.

**Name format:** `<type prefix>-<descriptor>`. The lib's folder name and its Nx project name are the same.

| Tag | Prefix |
|---|---|
| `type:feature` | `feature-` |
| `type:ui` | `ui-` |
| `type:data-access` | `data-access-` |
| `type:util` | `util-` |
| `type:model` | `models-` |

**Descriptor:** what the lib is about, in kebab-case. Usually it's the lib's own folder name. If that
folder name is only a type word (`models`, `ui`, `data-access`, `utils`, `feature`), use the parent
folder's name instead.

**Location:** only the lib's own folder gets the prefix. Parent folders stay where they are.

| Today | Under this ADR |
|---|---|
| `libs/craft-cart/catalog` (`catalog`, feature) | `libs/craft-cart/feature-catalog` |
| `libs/craft-cart/shared/models` (`craft-cart-models`, model) | `libs/craft-cart/shared/models-shared` |
| `libs/craft-cart/shared/state` (`state`, data-access) | `libs/craft-cart/shared/data-access-state` |
| `libs/craft-cart/shared/ui/item-card` (`item-card`, ui) | `libs/craft-cart/shared/ui/ui-item-card` |
| `libs/dcd/activities/data-access` (`activities-data-access`) | `libs/dcd/activities/data-access-activities` |

**Unique names:** Nx project names must be unique in the workspace. If the name is already taken, add
parent folder names in path order until it's unique. For example, DCD has many `shell` libs, so
`libs/dcd/activities/shell` becomes `feature-activities-shell`.

**New libs:** create them with the generator, passing the prefixed name as the folder and project name.
Check the generated `project.json` `name` and folder before committing.

**Existing libs:** keep their current names until a rename is asked for. Renaming changes the project
name, folder, `tsconfig.base.json` paths and every reference in `nx.json`, configs and CI. Do it with
`nx g @nx/workspace:move`, one product at a time, as its own change. Don't rename libs in passing
([ADR 0003](0003-migrate-angular-code-incrementally.md)).

### Consequences

- Good: a lib's type is obvious from its folder, project name and `nx show projects` output.
- Good: libs of the same type sort together.
- Bad: the repo is mixed until existing libs are renamed.
- Bad: `models-` doesn't match the singular `type:model` tag. It follows the agreed example `models-shared`.

### Confirmation

Code review of new and renamed libs. A future check could compare each lib's `type:*` tag with its
name prefix.

## More Information

Import aliases (`@crafting-cart/...`, `@dcd/...`, `@worthyd/shared/...`) aren't covered by this ADR.
`libs/dcd-plugin`'s `dcd-lib-generator` may still produce the old names and needs updating before it's
used for new DCD libs.
