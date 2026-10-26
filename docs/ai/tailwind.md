---
description: Tailwind CSS 4 in Craft Cart — CSS-first config, @source managed by nx-tailwind-sync, Material token mapping, class hygiene
globs: ["**/*.html", "**/*.css", "**/*.scss", "**/tailwind.config.*", "**/.postcssrc*", "**/postcss.config.*"]
---

# Tailwind CSS

Installed: **tailwindcss 4.2** with `@tailwindcss/postcss`.

## Where Tailwind is used

| App | Setup |
|---|---|
| `craft-cart` | **v4, CSS-first.** `apps/craft-cart/.postcssrc.json` loads `@tailwindcss/postcss`; `src/styles.scss` has `@import 'tailwindcss';`. Lib sources are added by the `@juristr/nx-tailwind-sync:source-directives` sync generator on build/serve. |
| `stardew-craft-cart` | Still has a **v3-style** `tailwind.config.js` and `@tailwind base/components/utilities` in `styles.scss`, which v4 doesn't process. Treat as legacy; if asked to fix, migrate it to the `craft-cart` setup. |
| DCD apps | **No Tailwind.** Use the SCSS theme and utilities in `apps/destiny-clan-dashboard/src/theme/`. Don't add Tailwind classes to `libs/dcd/**`. |

Libraries under `libs/craft-cart/**` and `libs/shared/**` used by Craft Cart can use Tailwind
classes in templates.

## v4 rules

- Config is **CSS-first** — add tokens with `@theme` in the app's global stylesheet, not a
  `tailwind.config.js`.
- **Library templates must be scanned.** In `craft-cart` that's automatic via the sync generator
  (it maintains `@source` lines for the app's lib dependencies). If classes from a lib don't
  appear, run `npx nx sync` before editing anything by hand.
- Never use v3 syntax (`@tailwind`, `theme.extend` in JS) in new code.
- Component stylesheets that need `@apply` or theme variables must `@reference` the global
  stylesheet; prefer utilities in the template instead.

## Theme: share Material's tokens

Map Tailwind colors to Material system variables so utilities follow the theme:

```css
@theme inline {
  --color-primary: var(--mat-sys-primary);
  --color-on-primary: var(--mat-sys-on-primary);
  --color-surface: var(--mat-sys-surface);
  --color-surface-container: var(--mat-sys-surface-container);
  --color-on-surface: var(--mat-sys-on-surface);
  --color-outline: var(--mat-sys-outline);
  --color-error: var(--mat-sys-error);
}
```

Then `bg-surface text-on-surface border-outline` — no raw hex or arbitrary colors.

## Class hygiene

- Utilities in templates by default; `@apply` only for markup you can't put classes on.
- **No dynamically built class names** (`'text-' + color`) — Tailwind can't see them. Map to full
  strings:

  ```ts
  protected readonly stateClass = computed(() =>
    ({ empty: 'opacity-50', partial: 'text-amber-700', complete: 'text-green-700' })[this.state()]
  );
  ```

- Conditionals: `[class.opacity-50]="disabled()"` or `[class]="stateClass()"`.
- Mobile-first responsive (`grid-cols-2 md:grid-cols-4`); `hover:`, `focus-visible:`,
  `disabled:`, `aria-*:` variants.
- Avoid arbitrary values (`w-[317px]`); add a `@theme` token instead.
- Repeated class clusters → extract a component, not a CSS class.
- Don't restyle Material internals with Tailwind (see `angular-material.md`).
