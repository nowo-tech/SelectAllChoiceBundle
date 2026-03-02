# Release process

This document describes how to cut a new release of SelectAllChoiceBundle.

## Pre-release (v1.0.0)

- [x] CHANGELOG: [1.0.0] with date and full feature list; [Unreleased] empty.
- [x] UPGRADING: 1.0.0 (first release) and 1.x → 2.x (future) sections.
- [ ] Run `make release-check` from the bundle root (composer-sync, cs-fix, cs-check, test-coverage, demo verify).
- [ ] Commit all release-related file changes.

## Pre-release (every release)

1. Run full QA: `make release-check` (or `composer-sync`, `cs-fix`, `cs-check`, `test-coverage`, and optionally demo verification).
2. Update [CHANGELOG.md](CHANGELOG.md): move "Unreleased" changes under a new version and set the release date.
3. Bump version in `composer.json` if needed (and any other places that reference the version).

## Tag and release

1. Commit the changelog and version bumps.
2. Create an annotated tag, e.g. `git tag -a v1.0.0 -m "Release 1.0.0"`.
3. Push the tag: `git push origin v1.0.0`.
4. If the project uses GitHub Releases or CI, the tag push may trigger release notes and artifact uploads; complete any manual steps required by your workflow.

## Post-release

1. In the repo, add a new "Unreleased" section at the top of CHANGELOG.md for the next development cycle.
2. Optionally announce the release (e.g. in project docs or packagist).
