# Colors and theming

How the color scale is defined, why it resolves to CSS custom properties instead of literal colors, and how a
consuming project supplies and swaps a theme. Entry points: `@use '@valantic/scss-utils/variables';` and
`@use '@valantic/scss-utils/functions';`.

## Why custom properties, not plain Sass colors

A plain Sass `!default` override only takes effect at build time — whatever value wins gets baked into the
compiled CSS. That's fine for spacing, breakpoints, or transitions, but colors are the one category where a
project routinely needs to swap a whole palette at runtime (light/dark mode, a white-label theme picked by a
`data-` attribute, a preview mode) without recompiling Sass. So every color variable in
`scss/variables/_color.scss` resolves to a `var(--theme-color-*)` reference instead of a literal value:

```scss
$va-color-primary--1: var(--theme-color-primary--1) !default;
```

Writing `variables.$va-color-primary--1` in a stylesheet compiles to `var(--theme-color-primary--1)` — the actual
color is resolved by the browser at paint time from whichever `--theme-color-primary--1` is in scope, so it can be
swapped instantly (e.g. by toggling a class or `data-` attribute) with no rebuild.

## Color variables (`scss/variables/_color.scss`)

All entries use `!default`. Each group has one Sass variable per swatch plus a collecting map (keyed by the suffix,
as a string):

- Grayscale — `$va-color-grayscale--0`, `--100`, `--200`, `--300`, `--400`, `--500`, `--600`, `--700`, `--800`,
  `--900`, `--1000`; collecting map `$va-color-greyscale` (note the British spelling — the map name differs from
  the variable prefix).
- Primary — `$va-color-primary--1`, `--2`, `--3`; collecting map `$va-color-primary`.
- Secondary — `$va-color-secondary--1` through `--5`; collecting map `$va-color-secondary`.
- Status — `$va-color-status--success`, `--danger`, `--error`, `--info`; collecting map `$va-color-status` (keyed
  `'success'`/`'danger'`/`'error'`/`'info'`).
- Gradient — `$va-color-gradient--1-0`, `--1-1`, `--2-0`, `--2-1`; collecting map `$va-color-gradient`.

```scss
@use '@valantic/scss-utils/variables';

.button {
  background-color: variables.$va-color-primary--1; // → background-color: var(--theme-color-primary--1);
}
```

Reach for the `--N` variable directly when you know which value you want, or look one up dynamically via
`map.get(variables.$va-color-status, 'success')` when the key is programmatic.

## Where the values come from: `scss/themes/`

`variables/_color.scss` only *references* the custom properties — it doesn't define them. `scss/themes/` holds the
theme partials that do, as selector blocks setting `--theme-color-*` on a scope. Both shipped files are entirely
**commented out**; they are a starting template, not an active default baked into the package. A consumer copies
one (or writes its own following the same shape), uncomments it, and adjusts the values.

`theme-default.scss` is the full template — every custom property the library references, scoped to
`:root, .use-theme--default, [data-use-theme='DEFAULT']`, including non-color font properties
(`--theme-font-family--headline`, `--theme-font-family--text`, `--theme-font-color--headline`,
`--theme-font-color--text`, `--theme-font-size--base`) that `variables/_font.scss` (see
[typography.md](./typography.md)) also references via `var(...)`.

`theme-example.scss` shows a second, opt-in theme scoped to `.use-theme--example, [data-use-theme='EXAMPLE']` that
only overrides the properties that differ from the default, relying on CSS cascade/inheritance to fall back to
`theme-default`'s values for everything else.

```scss
// A project's own theme partial, following the shipped template's shape
@use '@valantic/scss-utils/functions';

:root {
  --theme-color-primary--1: #ff4b4b;
  --theme-color-primary--1-rgb: #{functions.calc-rgb(#ff4b4b)};
  // ...remaining custom properties
}
```

## `calc-rgb($color, $output: 'string')` (`scss/functions/_calc-rgb.scss`)

Extracts the red/green/blue channels of a Sass color. `$output: 'string'` (default) returns a comma-separated
triplet suitable for embedding directly (e.g. `255, 75, 75`); `$output: 'list'` returns the same three numbers as a
Sass list. Throws if `$color` isn't a valid color, or if `$output` is neither `'string'` nor `'list'`.

This exists because a `var()` reference can't be decomposed into channels in CSS — to apply alpha transparency to a
themed color (`rgba(var(--theme-color-primary--1-rgb), 0.5)`), the raw channel numbers need to be computed once at
Sass build time, from the same source color used for the solid `--theme-color-*` value, and exposed as a separate
`-rgb` custom property:

```scss
@use '@valantic/scss-utils/functions';

// in a theme partial
--theme-color-primary--1-rgb: #{functions.calc-rgb(#ff4b4b)};
```

```scss
// in a consumer stylesheet
.overlay {
  background-color: rgba(var(--theme-color-primary--1-rgb), 0.5);
}
```

Note there is no Sass variable for the `-rgb` custom properties in `variables/_color.scss` — they only exist as
custom properties defined in a theme partial, following the pattern shown above.

## Applying and switching a theme

1. Copy or write a theme partial defining `--theme-color-*` (and its `-rgb` companions) on `:root` — this is the
   app's default theme.
2. Optionally add more theme partials scoped to a class or `data-use-theme` value, overriding only what differs
   (as `theme-example.scss` demonstrates).
3. `@use '@valantic/scss-utils/variables';` as usual and write `variables.$va-color-primary--1` etc. normally — the
   fact that it resolves to a custom property is invisible at the call site.
4. Switch themes at runtime by toggling the class or `data-use-theme` attribute on `<html>`/`<body>` (or any
   ancestor) — no rebuild needed.

Non-color variables (spacing, breakpoints, z-index, transitions, border) are plain Sass values, overridden at
compile time via `!default` — see [variables.md](./variables.md). Theming applies to colors (and the font
custom-property variables above) specifically because those are the values a project is most likely to need to
swap without a rebuild.
