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
- `npm run release[:minor|:major]` — runs `scripts/release.mjs` (shared, identical in every shared-frontend repo):
  checks for a clean, up-to-date `main` and a non-empty `## unreleased`, bumps the version, renames
  `## unreleased` to `## vX.Y.Z`, updates the README version pin, commits, creates the annotated `vX.Y.Z` tag and
  pushes. The `Release` workflow (`.github/workflows/release.yml`) then creates the GitHub release from that
  changelog section. See `CONTRIBUTING.md`. **Never run a release script or `npm publish` unless explicitly
  asked.**

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

## Working rules

These rules are identical in every valantic shared-frontend repo.

- Git: never commit unless explicitly asked. Never push unless explicitly asked in that request. Never pull or
  create/switch branches (`git pull`, `git checkout`, `git switch`, `git branch`, …). Branch names are
  `feature/<name>` or `bugfix/<name>`.
- Never run a release script or `npm publish` unless explicitly asked.
- Never install, update or remove npm packages without approval. Never edit generated or vendored files
  (`node_modules/`, `dist/`, lock files by hand).
- Priorities: correctness, simplicity, consistency with the existing code, maintainability, minimal changes. Prefer the
  smallest correct change.
- Understand the existing code and search for existing implementations before adding new ones; reuse over new
  abstractions. Do not refactor unrelated code, change public APIs, or change behavior outside the task's scope.
- Before finishing, run `npm test` and fix failures caused by the change. Every change gets a changelog entry and,
  where a feature changes, a doc update (see Changelog and Documentation below).
- If a requirement is unclear, ask. If only an implementation detail is unclear, follow the existing patterns in this
  repo.

## Changelog (required for every task)

`CHANGELOG.md` follows the convention shared by all valantic shared-frontend repos.

- Every change that alters behavior, fixes a bug, or adds/removes something consumers can see gets one entry under
  `## unreleased` in the same change — do not defer it to a follow-up task.
- Format: `- [type] Description.` — one entry per logical change, kept as a flat list (no "Added"/"Fixed" category
  subheadings), so each entry stays self-contained and merge conflicts can be resolved line by line.
- Allowed prefixes ([Conventional Commits](https://www.conventionalcommits.org/) types): `[feat]`, `[fix]`,
  `[refactor]`, `[perf]`, `[docs]`, `[test]`, `[build]`, `[ci]`, `[chore]`, `[revert]`. Older prefixes in released
  sections (`[ENHANCEMENT]`, `(Change)`, …) are history — do not reuse them and do not rewrite old entries.
- Write the description so it is understandable without the diff: name the affected module and the effect for
  consumers.
- Breaking changes are grouped under a `### Breaking Changes` subheading placed directly under `## unreleased`, above
  the regular entries. They keep their prefix and must end with a **Migration:** sentence stating what consumers
  have to do.
- A change is breaking if it removes/renames a public variable, mixin, function or entry file, changes a mixin's or
  function's parameters, changes the meaning of a `!default` value, or changes CSS emitted by `setup` that consumers
  could rely on.
- Headings: title `# Changelog`, unreleased section `## unreleased` (exact, lowercase — release tooling matches it
  literally), released sections `## vX.Y.Z`. Only the unreleased section is edited; released sections stay as they
  are.

## Documentation

This repo keeps its own feature docs in a `docs/` folder (with an index at `docs/README.md`) — this is separate from
the workspace-level `docs/` at the root of `valantic/` and must not be skipped in favor of it.

- Docs are grouped by topic, not one file per partial (e.g. typography, layout, colors & theming, functions,
  variables, setup). Every public mixin, function and variable group is covered by exactly one of these docs, which
  describes its purpose, public members, and usage examples beyond what the SassDoc `///` comments cover. A new
  mixin/function/variable group goes into the doc of its topic; only a new topic gets a new file.
- When adding, changing, or removing a mixin/function/variable group, update the matching doc in the same change —
  do not defer it to a follow-up task.
- `docs/README.md` is the index; add a one-line link to every new doc file there.
