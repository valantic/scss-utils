# Layout, spacing, and visual utilities

Container/media query helpers, the spacing scale and its utility-class generator, the z-index registry, and small
visual-utility mixins (`invisible`, `icon`). Entry points: `@use '@valantic/scss-utils/mixins';` and
`@use '@valantic/scss-utils/variables';`.

## Breakpoints (`scss/variables/_breakpoints.scss`)

`$va-breakpoints` is the map both `container()` and `media()` default to:

```scss
$va-breakpoints: (
  xxs: 0,
  xs: 480px,
  sm: 768px,
  md: 1024px,
  lg: 1200px,
  xl: 1440px,
) !default;
```

## `media($up: null, $down: null, $media: all, $breakpoints: variables.$va-breakpoints)`

Viewport-width media query helper. `$up`/`$down` each accept a breakpoint key from `$breakpoints` or a raw length;
`$up` is inclusive, `$down` is exclusive (compiles to `max-width: <next-breakpoint-or-value> - 1px`). `$media` sets
the media type (`screen`, `print`, …), defaulting to `all`. Throws if both `$up`/`$down`/non-default `$media` are
all omitted, if a key/value is invalid, if `$down <= $up`, or if the resulting query would be meaningless (e.g.
`$up` resolves to `0` with nothing else set).

```scss
@use '@valantic/scss-utils/mixins';

@include mixins.media('sm', 'lg') { ... } // Between 768px and 1199px.
@include mixins.media(null, 'md') { ... } // Up to 1023px.
@include mixins.media('lg', null) { ... } // From 1200px.
```

## `container($up: null, $down: null, $breakpoints: variables.$va-breakpoints, $dimension: width)`

CSS `@container` query helper — the same argument shape as `media()`, but scopes styles to a containing element's
size instead of the viewport. `$dimension` selects which dimension to query (`width` by default, e.g. `height`).
At least one of `$up`/`$down` must be given; throws on an invalid key/value or if `$up >= $down`.

```scss
@use '@valantic/scss-utils/variables';
@use '@valantic/scss-utils/mixins';

.card {
  @include mixins.container(sm, lg) {
    background-color: variables.$va-color-secondary--1;
  }

  // Query the container's height instead of its width
  @include mixins.container(300px, null, variables.$va-breakpoints, height) {
    background-color: green;
  }
}
```

## Spacing

### Variables (`scss/variables/_spacing.scss`)

- Pixel-based steps `$va-spacing--0` through `$va-spacing--200` (`0`, `1px`, `2px`, `5px`, `10px`, `15px`, `20px`,
  `25px`, `30px`, `35px`, `40px`, `45px`, `50px`, `55px`, `60px`, `70px`, `80px`, `90px`, `100px`, `200px`).
- `$va-spacings` — the list `spacings()` (below) iterates: `$va-spacing--0`, `--5`, `--10`, `--15`, `--20`, `--25`,
  `--30`, `--40`, `--50`, `--55`, `--60`, `--70`, `--80`, `--90`, `--100`, `--200` (note: `--1`, `--2`, and `--35`/
  `--45` exist as individual step variables but are **not** included in this list).
- `rem`-based steps `$va-spacing-rem--0`, `--0-25` (0.25rem), `--0-5` (0.5rem), `--0-755` (0.75rem — note the typo
  in the variable name, it is not `--0-75`), `--1` through `--5` (1rem–5rem).

### `spacings($class, $property, $spacings: variables.$va-spacings, $breakpoints: variables.$va-breakpoints)`

Generates utility classes for every value in `$spacings`: a base class `.#{$class}-<value>` plus, for every
breakpoint in `$breakpoints` except `xxs`, a responsive class `.#{$class}-<breakpoint>-<value>` wrapped in
`media($breakpoint)`. `<value>` is the spacing with its unit stripped. A `0` entry is skipped (no `-0` class is
generated). Throws if `$spacings` isn't a list or `$breakpoints` isn't a map.

```scss
@use '@valantic/scss-utils/mixins';

@include mixins.spacings('gap', 'gap');
// .gap-5 { gap: 5px; }
// .gap-sm-5 { gap: 5px; } (inside @include media(sm) { ... })
// ...
```

### The `spacings` entry (`scss/_spacings.scss`)

Not forwarded from any barrel — the second entry (besides `setup`) that emits CSS on its own, so it must be
`@use`d directly by path:

```scss
@use '@valantic/scss-utils/spacings';
```

It calls `spacings()` twice, generating `.spacing--bottom-<value>` / `.spacing--bottom-<breakpoint>-<value>` classes
for `margin-bottom` and `.spacing--top-<value>` / `.spacing--top-<breakpoint>-<value>` classes for `margin-top`,
across every value in `$va-spacings` and every breakpoint in `$va-breakpoints`. It's entirely optional — only pull
it in if you want these generated spacing utility classes instead of setting margins by hand.

## Z-index

### Variable (`scss/variables/_z-index.scss`)

```scss
$va-z-index: (
  back: -1,
  front: 1,
  contentOverlay: 2,
  navigation: 10,
  dropdown: 15,
  focusItem: 30,
  datePicker: 700,
  globalNotification: 900,
  modal: 1000,
) !default;
```

### `z-index($key)`

Looks `$key` up in `$va-z-index` and sets `z-index` to the matching value. Throws if the key doesn't exist — this
is the point of the mixin: a shared registry so no project hardcodes a raw `z-index` number, and a typo fails the
build instead of silently emitting nothing.

```scss
@use '@valantic/scss-utils/mixins';

.modal {
  @include mixins.z-index('modal'); // z-index: 1000;
}
```

## `invisible()`

No parameters. Visually hides an element (`position: absolute`, `1px` × `1px`, `overflow: hidden`,
`white-space: nowrap`, `clip-path: inset(50%)`) while keeping it in the accessibility tree — the standard
screen-reader-only pattern.

```scss
@use '@valantic/scss-utils/mixins';

.skip-link {
  @include mixins.invisible;
}
```

`_globals.scss` (see [setup.md](./setup.md)) exposes this as a ready-to-use `.invisible` class.

## `icon($icon, $size: 24px 24px, $backgroundPosition: center center, $mask: true, $color: currentColor)`

Applies an SVG icon (looked up by `#`-fragment `$icon` in `variables.$va-icon-base-path`, `'../assets/icons.svg'`
by default — note this path variable is **not** declared with `!default`, so it cannot be overridden the normal
way) as a `background` image. `$size` accepts a single value (applied to both axes) or a two-value list. When
`$mask` is `true` (the default) and the browser supports `mask` (`@supports (mask: no-repeat)`), the icon is
additionally applied as a CSS mask filled with `$color`, so it can be recolored — browsers without `mask` support
fall back to the plain background image with no color applied. Throws if `$icon` isn't a string.

```scss
@use '@valantic/scss-utils/mixins';

.icon {
  @include mixins.icon('arrow-left', 32px, center center, true, red);
}
```
