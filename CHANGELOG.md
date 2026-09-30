# Changelog

## unreleased

- [chore] `scripts/release.mjs`: dropped the temporary `master` fallback from `RELEASE_BRANCHES` now that
  `stylelint-config-valantic` has moved its default branch to `main`.
- [fix] `.editorconfig`: removed a stray space in the `[{*.js, *.ts}]` glob (`[{*.js,*.ts}]`) that prevented it from
  matching `*.ts` files.
- [fix] `generate-vuln-report.py`: `worst_severity()` no longer raises `ValueError` and aborts the report step when
  every vulnerability for a package has a severity outside `SEVERITIES` — it now falls back to the lowest rank.

- [docs] `AGENTS.md`: feature docs are now grouped by topic (typography, layout, colors & theming, …) instead of one
  file per partial.
- [docs] Added grouped feature docs under `docs/` (`typography`, `layout`, `colors-and-theming`, `functions`,
  `variables`, `setup`), indexed by `docs/README.md`, covering every public mixin, function, and variable group
  with parameters, defaults, and usage examples.
- [ci] Aligned `.github/workflows/test.yml` with the other shared-frontend repos: job `test`, step "Run tests"
  (the old label claimed checks that don't run here), Node version read from `.nvmrc`, token limited to
  `contents: read`.
- [ci] Added the shared `Security Scan` workflow (`.github/workflows/security.yml`, Trivy): scans the dependencies
  daily and on pull requests, opens/updates a `security` issue on CRITICAL/HIGH findings, closes it when clean, and
  uploads the results to the GitHub Security tab.
- [ci] `security.yml` now posts (and keeps updated) a pull request comment with the vulnerability breakdown when the
  Trivy scan fails a PR check, instead of only failing the job with no feedback beyond the raw log.
- [fix] `security.yml`: steps gated on `steps.trivy-sarif.outcome` now also require `always()`. Without it,
  GitHub Actions implicitly ANDs a bare `if:` with `success()`, so those steps were skipped exactly when the
  Trivy step failed — the case they exist to handle.
- [chore] Added the missing `LICENSE` file (MIT, as already declared in `package.json` and the README).
- [docs] Restructured `AGENTS.md` to the shared outline and added the shared `## Working rules` section (git rules, no
  release/publish or dependency changes without approval, engineering priorities, `npm test` before finishing).
- [docs] Completed `CONTRIBUTING.md` with the shared outline (Getting started / Developing / Changelog / Releasing).
- [docs] Added a `## Contributing` section to `README.md` linking `CONTRIBUTING.md` (contribution and release steps).
- [build] `npm run release[:minor|:major]` now runs the shared `scripts/release.mjs` instead of plain `npm version`. It
  releases from an up-to-date `main` only, aborts on uncommitted changes or an empty `## unreleased` section, renames
  that section to `## vX.Y.Z`, updates the README version pin, and commits, tags (`vX.Y.Z`, annotated) and pushes.
- [ci] Added the `Release` workflow (`.github/workflows/release.yml`): pushing a `vX.Y.Z` tag creates the GitHub
  release, using that version's `CHANGELOG.md` section as release notes. It fails if the section is empty.
- [docs] Added `CONTRIBUTING.md` describing the release process.
- [docs] Adopted the shared shared-frontend changelog convention (`# Changelog` title, `unreleased` / `vX.Y.Z`
  headings, `[feat]`/`[fix]`/… prefixes, `### Breaking Changes` with migration notes), documented in `AGENTS.md`.
  Unreleased entries were moved to the new prefixes; released entries are unchanged.
- [docs] Added a repo banner (`.github/assets/banner.jpeg`) to the top of `README.md`, matching the `vue-styleguide`
  convention.

- [docs] Restructured `README.md` to follow the `vue-styleguide` schema (centered header with tagline/links, `About
  this project`, `Quickstart`) and added the shared "from valantic - with love" footer.

- [chore] Reordered `package.json` top-level keys to match the `vue-styleguide` boilerplate ordering.

- [chore] Bumped `engines` to `node": ">=22 <26"` / `"npm": ">=10 <12"` (was `node">=22"` / `npm">=10"`) to allow
  Node 25. Updated `.nvmrc` from `24` to `25`. Added `min-release-age=7` and `ignore-scripts=true` to `.npmrc`.

- [ci] Added `.github/workflows/test.yml` (previously missing), a "CI Test" workflow running on
  `actions/checkout@v7` / `actions/setup-node@v7` with Node 25.
- [docs] Streamlined `.github/PULL_REQUEST_TEMPLATE.md` by removing the obsolete checklist sections.
- [docs] Added `AGENTS.md` documenting the package structure and conventions, with `CLAUDE.md` reduced to a pointer to
  it, matching the pattern used in `frontend-utils`.
- [docs] Added a Documentation section to `AGENTS.md` requiring feature docs to live in this repo's own `docs/` folder
  (indexed by `docs/README.md`), separate from the workspace-level `docs/`.

## v1.1.0

- [ENHANCEMENT] Updated to sass `1.98.0`

## v1.0.0

- [UPDATE] Updated scss, stylelint and package.json.
- [BUGFIX] Fixed stylelint script path and fixed all issues.
- [DOCS] Updated README file.

## v0.0.5

- [ENHANCEMENT] Exposed `container` mixin through main `@valantic/scss-utils/mixins` entry.
- [ENHANCEMENT] Added usage examples to README.
- [BUGFIX] Fixed `lint:stylelint` script path in `package.json`.
- [DOCS] Updated README installation examples to reference version 0.0.5.

## v0.0.4

- [BUGFIX] Fixed container mixin.
- [BUGFIX] Fixed header mixin.
- [BUGFIX] Fixed sass error mixin.

## v0.0.3

- [BUGFIX] It is now possible to overwrite all variables in a project.
- [ENHANCEMENT] Added doc headers for all functions and mixins.
- [ENHANCEMENT] Improved mixins.

## v0.0.2

- Added container queries.
