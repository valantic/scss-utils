# scss-utils docs

Feature docs for this package, grouped by topic. See [AGENTS.md](../AGENTS.md) for the convention.

## How to consume

`@valantic/scss-utils` emits no CSS by itself — install it via its GitHub dependency reference (see the root
[README](../README.md)) and `@use` only the entry points you need:

```scss
@use '@valantic/scss-utils/variables';
@use '@valantic/scss-utils/functions';
@use '@valantic/scss-utils/mixins';
```

Members are then accessed through that module's namespace, e.g. `variables.$va-color-primary--1`,
`functions.calc-em(16px)`, `@include mixins.line-clamp(2)`. `setup` and `spacings` are two additional, optional
entries that actually emit CSS — see [setup.md](./setup.md).

## Docs

- [typography.md](./typography.md) — font, font-size, headings, hyphens, line-height, line-clamp mixins, and the
  font variables
- [layout.md](./layout.md) — container/media queries, spacing scale and utility classes, z-index registry,
  invisible, icon
- [colors-and-theming.md](./colors-and-theming.md) — color variables and how they resolve to CSS custom properties
  via `themes/`
- [functions.md](./functions.md) — `calc-em`, `strip-unit`
- [variables.md](./variables.md) — border, transition, and general (icon path) variables
- [setup.md](./setup.md) — the module system (`@use`/`@forward`), and the `setup`/`_basics`/`_globals` partials
