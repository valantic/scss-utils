# Functions

General-purpose Sass functions. Entry point: `@use '@valantic/scss-utils/functions';`. For `calc-rgb()`, the
theming-specific color-channel function, see [colors-and-theming.md](./colors-and-theming.md).

## `calc-em($values, $context: 16px)` (`scss/functions/_calc-em.scss`)

Converts pixel value(s) to `em`, relative to a context font size. `$values` accepts a single number or a list;
`$context` must be a positive number with a `px` unit. Always returns a list (a list of one when given a single
value). Throws if `$context` isn't a positive `px` number, or `$values` isn't a number or list.

```scss
@use '@valantic/scss-utils/functions';

.card {
  // single value, default 16px context
  font-size: functions.calc-em(16px); // 1em

  // list of values, explicit context
  padding: functions.calc-em((8px, 16px, 24px), 20px); // 0.4em 0.8em 1.2em
}
```

## `strip-unit($number)` (`scss/functions/_strip-unit.scss`)

Removes the unit from a number (`10px` → `10`); a unitless number is returned unchanged. Throws if `$number` isn't
a number at all. Used internally by several mixins (`font-size`, `line-height`, `line-clamp`, `spacings`) to do
arithmetic across mismatched units before re-attaching a unit.

```scss
@use 'sass:math';
@use '@valantic/scss-utils/functions';

$ratio: math.div(functions.strip-unit(24px), functions.strip-unit(16px)); // 1.5
```
