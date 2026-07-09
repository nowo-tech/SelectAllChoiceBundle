# Release process

This document describes how to cut a new release of SelectAllChoiceBundle.

## Pre-release (v1.4.9)

- [x] CHANGELOG: [1.4.9] with date and changes; [Unreleased] empty.
- [x] UPGRADING: 1.4.8 → 1.4.9 section.
- [x] Run `make release-check` from the bundle root (composer-sync, cs-fix, cs-check, rector-dry, phpstan, test-coverage, assets-test; demo verify skipped locally — `docker: Permission denied` in demo containers).
- [x] Commit all release-related file changes (docs, CHANGELOG, RELEASE, demos if lockfiles changed).

## Pre-release (every release)

1. Run full QA: `make release-check` (or `composer-sync`, `cs-fix`, `cs-check`, `test-coverage`, and optionally demo verification).
2. Update [CHANGELOG.md](CHANGELOG.md): move "Unreleased" changes under a new version and set the release date.
3. Bump version in `composer.json` if needed (and any other places that reference the version).

## Tag and release

1. Commit the changelog and version bumps.
2. Create an annotated tag: `git tag -a v1.4.9 -m "Release 1.4.9"`.
3. Push the tag: `git push origin v1.4.9` (or your default branch name, e.g. `main`).
4. If the project uses GitHub Releases or CI, the tag push may trigger release notes and artifact uploads; complete any manual steps required by your workflow.

**From the bundle repo root (if this is a standalone repo):**
```bash
git add docs/CHANGELOG.md docs/UPGRADING.md docs/RELEASE.md README.md composer.lock demo/ pnpm-workspace.yaml .specify/ .cursor/skills/ specs/ src/Resources/public/select-all-choice.js
git commit -m "Release v1.4.9: Spec Kit baseline, docs, and pnpm workspace"
git tag -a v1.4.9 -m "Release 1.4.9"
git push origin master
git push origin v1.4.9
```

## Post-release

1. In the repo, add a new "Unreleased" section at the top of CHANGELOG.md for the next development cycle.
2. Optionally announce the release (e.g. in project docs or packagist).
