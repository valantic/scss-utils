# AGENTS.md

This file provides guidance to AI coding agents (Claude Code, Codex, Cursor, Copilot, etc.) when working with code in
this repository.

## What this is

`@valantic/scss-utils` is a library of reusable SCSS mixins, functions, and variables (container queries, typography,
spacing, etc.). It emits no CSS output by itself — consumers `@use` only what they need. It is consumed by other
valantic projects (e.g. `vue-template`) via a GitHub dependency reference (`github:valantic/scss-utils#v1.1.0`), not
published to the npm registry — `package.json` has no `main`, `exports`, or `sass` field, only `"files": ["scss"]`,
which controls what ships when installed straight from GitHub. Consumers `@use` files directly out of the `scss/`
directory, e.g. `@use '@valantic/scss-utils/variables';`.

## Commands

- `npm test` — alias for `npm run lint`.
- `npm run lint` / `npm run lint:stylelint` — runs stylelint over `scss/**/*.scss` (config in `.stylelintrc.mjs`,
  extending `stylelint-config-valantic`). This is the check to run before considering work done.
- `npm run fix:stylelint` — runs stylelint with `--fix` using `.stylelintrc.fix.js` and cache disabled.
- `npm run clean:caches` — removes `.stylelintcache` and `node_modules/.cache`.
- `npm run release[:minor|:major]` — bumps the version via `npm version`, commits, and `git push --follow-tags`. Do not
  run these unless explicitly asked.

## Architecture

- `scss/` is the package root exposed to consumers. Each top-level entry file (`_mixins.scss`, `_variables.scss`,
  `_functions.scss`, `_setup.scss`) is a pure `@forward` barrel over a same-named subfolder (`mixins/`, `variables/`,
  `functions/`, `setup/`) — one partial per mixin/variable-group/function. New mixins, functions, or variable groups
  go in their own file under the matching subfolder and get forwarded from the top-level file.
- `_basics.scss`, `_globals.scss`, and `_lib.scss` are top-level, non-forwarded partials: `_lib.scss` holds shared
  internal helpers (e.g. `lib.throw-error`, used by mixins for validation errors) and is `@use`d internally, not part
  of the public API surface described in the README. `_basics.scss`/`_globals.scss` are for cross-browser-unification
  styles and class-applicable global styles respectively, per the comment in `_setup.scss`.
- `themes/` holds example theme files (`theme-default.scss`, `theme-example.scss`) — these define the CSS custom
  properties (`--theme-color-*`) that `variables/_color.scss` etc. reference via `var(...)`, so a consumer can theme
  the library without overriding Sass variables.
- Naming convention: all public Sass variables are prefixed `$va-` (e.g. `$va-color-primary`, `$va-breakpoints`).
  Multi-part/scale variables use a double-dash suffix for the individual value (`$va-color-primary--1`) and a
  same-named map without the suffix collecting them (`$va-color-primary: (...)`).
  All variables use `!default` so consuming projects can override them.
- Mixins/functions are documented with SassDoc-style `///` comment blocks above each definition (`@param`, `@throws`,
  `@example`) — follow this pattern for new ones (see `scss/mixins/_container.scss`).
- Consumers use the Sass module system (`@use`/`@forward`), not the legacy `@import`. Import only the sub-entry
  needed (`@use '@valantic/scss-utils/variables';`, `.../functions`, `.../mixins`), then reference members via the
  module namespace (`variables.$va-color-primary`, `functions.calc-em(16px)`, `@include mixins.line-clamp(2)`).
  `@use '@valantic/scss-utils/setup';` is optional and the only entry that emits actual CSS output.
- `CHANGELOG.md` documents its own entry-prefix convention (`[ENHANCEMENT]`, `[BUGFIX]`, `[UPDATE]`, `[DOCS]`, etc.
  under an `## unreleased` heading) — check it before adding an entry.

## Documentation

This repo keeps its own feature docs in a `docs/` folder (with an index at `docs/README.md`) — this is separate from
the workspace-level `docs/` at the root of `valantic/` and must not be skipped in favor of it.

- Every mixin/function/variable group (e.g. `container`, `typography`, `spacing`) and cross-cutting feature (e.g.
  theming via `themes/`) gets one Markdown file under `docs/` describing its purpose, public members, and usage
  examples beyond what the SassDoc `///` comments cover.
- When adding, changing, or removing a mixin/function/variable group, update the matching doc in the same change —
  do not defer it to a follow-up task.
- `docs/README.md` is the index; add a one-line link to every new doc file there.
