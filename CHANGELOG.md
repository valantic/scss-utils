# valantic scss utils

## unreleased

- [DOCS] Restructured `README.md` to follow the `vue-styleguide` schema (centered header with tagline/links, `About
  this project`, `Quickstart`) and added the shared "from valantic - with love" footer.

- [CHORE] Reordered `package.json` top-level keys to match the `vue-styleguide` boilerplate ordering.

- [CHORE] Bumped `engines` to `node": ">=22 <26"` / `"npm": ">=10 <12"` (was `node">=22"` / `npm">=10"`) to allow
  Node 25. Updated `.nvmrc` from `24` to `25`. Added `min-release-age=7` and `ignore-scripts=true` to `.npmrc`.

- [CI] Added `.github/workflows/test.yml` (previously missing), a "CI Test" workflow running on
  `actions/checkout@v7` / `actions/setup-node@v7` with Node 25.
- [DOCS] Streamlined `.github/PULL_REQUEST_TEMPLATE.md` by removing the obsolete checklist sections.
- [DOCS] Added `AGENTS.md` documenting the package structure and conventions, with `CLAUDE.md` reduced to a pointer to
  it, matching the pattern used in `frontend-utils`.
- [DOCS] Added a Documentation section to `AGENTS.md` requiring feature docs to live in this repo's own `docs/` folder
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
