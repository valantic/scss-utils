# Contributing to this repository

## Getting started

- Clone this repository.
- Use the Node.js version from `.nvmrc` (e.g. `nvm use`) and install the dependencies with `npm ci`.

## Developing

- Create a branch from `main`: `feature/<name>` or `bugfix/<name>`.
- Add new mixins, functions or variable groups as their own file in the matching `scss/` subfolder, forward them from
  the top-level entry file and document them with SassDoc `///` comments.
- Run `npm test` and fix all issues.
- Add or update the feature doc in `docs/` if a feature changed (index: `docs/README.md`).
- Add a changelog entry (see below).
- Open a pull request using the pull request template.

## Changelog

Every change gets an entry under `## unreleased` in [CHANGELOG.md](CHANGELOG.md), e.g. `- [fix] Description.`.
Breaking changes go under `### Breaking Changes` with a **Migration:** note. The full convention is described in
[AGENTS.md](AGENTS.md#changelog-required-for-every-task).

## Releasing

Releases are made directly from `main`. Tags are always `vX.Y.Z`.

1. Make sure all changes are merged into `main` and described under `## unreleased` in
   [CHANGELOG.md](CHANGELOG.md).
2. On an up-to-date `main`, run one of these (see [SemVer](https://semver.org/)):
   - `npm run release` — patch
   - `npm run release:minor` — minor
   - `npm run release:major` — major

   `scripts/release.mjs` aborts without changing anything if the working tree is not clean, `main` is behind
   `origin/main`, or `## unreleased` is empty. Otherwise it bumps the version in `package.json` and
   `package-lock.json`, renames `## unreleased` to `## vX.Y.Z` (adding a fresh `## unreleased` above it), updates
   the version pin in `README.md` if there is one, commits `Release vX.Y.Z`, creates the annotated tag `vX.Y.Z` and
   pushes both.

3. The `Release` workflow (`.github/workflows/release.yml`) creates the GitHub release for the pushed tag, using that
   version's `CHANGELOG.md` section as release notes. Check it on
   [GitHub releases](https://github.com/valantic/scss-utils/releases).

`scripts/release.mjs` is shared by all valantic shared-frontend repos — keep the copies identical.
