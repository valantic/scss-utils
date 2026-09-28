# Setup, basics, and globals

The module system this library uses, and the partials that emit actual CSS instead of just defining Sass members.

## The module system: `@use` and `@forward`

The library is built on Sass's module system (`@use`/`@forward`), not the legacy `@import`. `scss/` is the package
root a consumer points `@use` at. Four top-level entry files exist, three of them pure `@forward` barrels over a
same-named subfolder (one mixin/variable-group/function per file):

| Entry | Forwards | Emits CSS? |
| --- | --- | --- |
| `_mixins.scss` | `mixins/*.scss` | no |
| `_variables.scss` | `variables/*.scss` | no |
| `_functions.scss` | `functions/*.scss` | no |
| `_setup.scss` | `@use`s `setup/*.scss` | **yes** |

A consumer imports only the sub-entry it needs, then accesses members through that module's namespace:

```scss
@use '@valantic/scss-utils/variables';
@use '@valantic/scss-utils/functions';
@use '@valantic/scss-utils/mixins';

.card {
  font-size: functions.calc-em(16px);
  color: variables.$va-color-primary--1;

  @include mixins.line-clamp(2);

  @include mixins.container(sm, lg) {
    background-color: variables.$va-color-secondary--1;
  }
}
```

You can also `@use` a single sub-module directly, e.g. `@use '@valantic/scss-utils/variables/color';`, if you only
want that one group — there's no CSS cost to unused Sass members either way, so most consumers just pull in the
whole `variables`/`mixins`/`functions` barrel.

Two other root-level partials are **not** forwarded from any barrel and are not part of the public API:

- `_lib.scss` forwards `mixins/_sass-error.scss` (`lib.throw-error()`), the shared helper every validating mixin
  and function in this library uses to produce a consistently formatted Sass `@error` (prefixed
  `🚨🚨🚨 ERROR: @valantic-scss-utils 🚨🚨🚨`, naming the offending mixin/function and the bad value). It's
  internal plumbing, not something a consuming project calls.
- `_spacings.scss` — see [layout.md](./layout.md#the-spacings-entry-scss_spacingsscss); it emits CSS and, like
  `setup`, is opt-in and must be `@use`d directly by path.

## `setup` — the only barrel entry that emits CSS

```scss
@use '@valantic/scss-utils/setup';
```

Forwards four partials from `scss/setup/`, each applying opinionated base element styles:

- **`base`** — sets `html`/`body` height to `100%`, background to `var(--theme-color-grayscale--1000)`, font
  family/size/color to the `--theme-font-*` custom properties (see
  [colors-and-theming.md](./colors-and-theming.md)).
- **`form-fields`** — `all: revert` on unclassed `input`/`textarea`/`select`, so native browser styling is kept
  unless a project explicitly applies its own classed form-control styles.
- **`headings`** — wires `h1`–`h6` to the `heading()` mixin (see [typography.md](./typography.md#headinglevel)):
  `h1 { @include mixins.heading('h1'); }`, and so on through `h6`.
- **`text`** — styles inline/text elements: `mark` (padding + themed background), `s`/`del` (strikethrough),
  `u`/`ins` (underline), `small` (0.88rem), `b`/`strong` (bolder), `em` (italic), `abbr` (dotted underline,
  help cursor), a `p` bottom margin, and `.list-ordered`/`.list-unordered`/`.list-inline` list utility classes.

It's optional specifically because not every consumer wants opinionated base styles — a project with its own reset
simply never `@use`s `setup`, or `@use`s only the individual `setup/*` partial(s) it wants.

## `_basics.scss` and `_globals.scss`

Two more root-level, non-forwarded partials, `@use`d directly by path (`@use '@valantic/scss-utils/basics';` /
`@use '@valantic/scss-utils/globals';`) if a consuming project wants them:

- **`_basics.scss`** — cross-browser unification for native HTML elements (antialiasing, `sub`/`sup` alignment,
  `pre`/`code`/`kbd`/`samp` monospacing, native form-control appearance fixes for Safari/Firefox/Chrome/iOS, etc.).
  Kept deliberately minimal — element-level styling belongs in `setup` instead.
- **`_globals.scss`** — styles scoped by a globally used class rather than an element selector: `#app` (min-height
  100%), `.invisible` (applies the `invisible()` mixin, see [layout.md](./layout.md#invisible)), and `.wysiwyg`
  (spacing/typography rules for rendered rich-text content — headings, `hr`, `ol`/`ul`, `p`, `table`, links with
  disabled-state color).
