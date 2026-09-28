# Typography

Font, heading, and text-flow mixins, plus the font-related Sass variables they build on. Entry points:
`@use '@valantic/scss-utils/mixins';` and `@use '@valantic/scss-utils/variables';`.

## Variables (`scss/variables/_font.scss`)

All values use `!default`, so a consuming project can override any of them.

- `$va-font-family--headline` / `$va-font-family--text` — resolve to `var(--theme-font-family--headline)` /
  `var(--theme-font-family--text)`. Set the actual font stack in a theme partial (see
  [colors-and-theming.md](./colors-and-theming.md)).
- `$va-font-color--headline` / `$va-font-color--text` — resolve to `var(--theme-font-color--headline)` /
  `var(--theme-font-color--text)`.
- `$va-font-weight--light` (200), `--regular` (400), `--semi-bold` (600), `--bold` (700), `--heavy` (900), and the
  collecting map `$va-font-weight` (keyed `'light'`, `'regular'`, `'semi-bold'`, `'bold'`, `'heavy'`).
- `$va-font-size--base` (16px) and fixed pixel steps `$va-font-size--8`/`--10`/`--12`/`--14`/`--16`/`--18`/`--24`/
  `--30`/`--32`.
- Four responsive type-scale maps, each keyed `'regular'`, `'h1'`–`'h6'`, `'small'`, `'extra-small'`:
  `$va-font-size-major--third` and `$va-font-size-minor--third` (desktop-oriented scales), and
  `$va-font-size-major--second` and `$va-font-size-minor--second` (tablet/phone-oriented scales).
- `$va-font-size--desktop: $va-font-size-major--third`, `$va-font-size--tablet: $va-font-size-minor--third`,
  `$va-font-size--phone: $va-font-size-major--second` — these three are what `font-size-by-map()` (below) actually
  reads; override them (not the `-major`/`-minor` maps directly) to swap the active scale per breakpoint tier.
- `$va-line-height--default` (1.15em), `--text` (1.45em), `--headline` (1.15em), and fixed pixel steps `--18`/`--20`/
  `--25`/`--30`.

## Mixins (`scss/mixins/`)

### `font-size($size-value: 16px, $base-size: 16px)`

Converts a pixel font size into `rem`, relative to a base size. Both arguments are stripped of their unit
internally (via `functions.strip-unit()`), so passing a value without a unit works the same as with `px`.

```scss
@use '@valantic/scss-utils/mixins';

.text {
  @include mixins.font-size(32px); // font-size: 2rem;
}
```

### `font-size-by-map($keyName: 'regular')`

Looks `$keyName` up in `variables.$va-font-size--phone` as the base value, then overrides it at the `sm` breakpoint
from `variables.$va-font-size--tablet` and at the `md` breakpoint from `variables.$va-font-size--desktop` (via
`media()`, see [layout.md](./layout.md)). Throws (`lib.throw-error`) if `$keyName` is missing from any of the three
maps.

```scss
@use '@valantic/scss-utils/mixins';

.heading {
  @include mixins.font-size-by-map('h1');
}
```

### `font($font-size: 16px, $line-height: null, $font-weight: null)`

Convenience wrapper that calls `font-size()` and, when given, `line-height()` (see below), and sets `font-weight`
directly. `$line-height` and `$font-weight` are only applied when not `null`. Throws if `$font-size`/`$line-height`
aren't numbers, or `$font-weight` isn't a number or string.

```scss
@use '@valantic/scss-utils/mixins';

.text {
  @include mixins.font(16px, 1.5, 700); // font-size: 1rem; line-height: 1.5; font-weight: 700;
}

.light-text {
  @include mixins.font(14px, null, 300); // font-size: 0.875rem; font-weight: 300;
}
```

### `line-height($line-height: 1.15, $font-size: 16px)`

Computes the unitless `line-height` CSS expects from a pixel-based `$line-height`/`$font-size` pair (both stripped
of units internally). Throws if either argument isn't a number, or if `$font-size` is `<= 0`.

```scss
@use '@valantic/scss-utils/mixins';

.text {
  @include mixins.line-height(24px, 16px); // line-height: 1.5;
}
```

### `heading($level)`

`$level` must be one of `'h1'`–`'h6'` (throws otherwise). Extends a shared `%heading-base` placeholder
(`font-family: var(--theme-font-family--headline)`, `font-weight: $va-font-weight--heavy`,
`line-height: $va-line-height--headline`) and applies `font-size-by-map($level)`.

```scss
@use '@valantic/scss-utils/mixins';

h2 {
  @include mixins.heading('h2');
}
```

`heading-h1()` through `heading-h6()` are deprecated wrappers kept for backward compatibility — each emits a
`@warn` pointing at `heading('h1')` etc. and should not be used in new code.

Setup's `setup/_headings.scss` wires `h1`–`h6` to `heading()` directly — see [setup.md](./setup.md).

### `hyphens()`

No parameters. Sets `overflow-wrap: break-word` and `hyphens: auto` for automatic browser hyphenation with a
graceful fallback on browsers that don't support it.

```scss
@use '@valantic/scss-utils/mixins';

.text {
  @include mixins.hyphens;
}
```

### `line-clamp($clamp, $line-height: 1)`

Truncates text to `$clamp` lines using `-webkit-line-clamp`, computing `max-height` from `$clamp * $line-height`
(in `em`). `$clamp` must be a positive, unitless number; `$line-height` must be a positive number. Webkit-only
(Chrome, Edge, Safari) — not supported in Firefox.

```scss
@use '@valantic/scss-utils/mixins';

.clamped-text {
  @include mixins.line-clamp(3, 1.5); // Clamp to 3 lines with line-height of 1.5
}
```
