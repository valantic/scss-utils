# General variables

Border, general, and transition variables that don't fit a more specific doc. Entry point:
`@use '@valantic/scss-utils/variables';`. See also [typography.md](./typography.md) (font variables),
[colors-and-theming.md](./colors-and-theming.md) (color variables), and [layout.md](./layout.md) (breakpoints,
spacing, z-index).

## Border (`scss/variables/_border.scss`)

```scss
$va-border-width--100: 1px !default;
$va-border-radius--100: 3px !default;
```

## Transitions (`scss/variables/_transitions.scss`)

Durations in milliseconds, plus a collecting map keyed by the duration in ms as a string:

```scss
$va-transition-duration--100: 100ms !default;
$va-transition-duration--200: 200ms !default;
$va-transition-duration--300: 300ms !default;
$va-transition-duration--500: 500ms !default;
$va-transition-duration--700: 700ms !default;

$va-transition-duration: (
  '100': $va-transition-duration--100,
  '200': $va-transition-duration--200,
  '300': $va-transition-duration--300,
  '500': $va-transition-duration--500,
  '700': $va-transition-duration--700,
) !default;
```

```scss
@use '@valantic/scss-utils/variables';

.fade {
  transition: opacity variables.$va-transition-duration--200;
}
```

## General (`scss/variables/_general.scss`)

```scss
$va-icon-base-path: '../assets/icons.svg';
```

Used by the `icon()` mixin (see [layout.md](./layout.md)) to resolve an icon's `#`-fragment URL. Unlike every other
variable in this library, it is **not** declared with `!default`, so it cannot be overridden the usual way (via a
prior assignment or `@use ... with`) — a consuming project that ships icons at a different path needs its own copy
of the `icon()` mixin, or an issue/PR against this library.
