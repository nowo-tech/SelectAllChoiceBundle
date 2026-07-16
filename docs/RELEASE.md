# Release process

This document describes how to cut a new release of SelectAllChoiceBundle.

## Pre-release (v1.4.11)

- [x] CHANGELOG: [1.4.11] with date and changes; [Unreleased] empty.
- [x] UPGRADING: 1.4.10 → 1.4.11 section.
- [x] Run `make release-check` from the bundle root (check-no-cursor-coauthor, composer-sync, cs-fix, cs-check, rector-dry, phpstan, test-coverage, assets-test; demo verify skipped locally — `docker: Permission denied` in nested demo `update-bundle`).
- [x] Commit all release-related file changes (docs, CHANGELOG, RELEASE, demos if lockfiles changed).

## Pre-release (every release)

1. Run full QA: `make release-check` (or `composer-sync`, `cs-fix`, `cs-check`, `test-coverage`, and optionally demo verification).
2. Update [CHANGELOG.md](CHANGELOG.md): move "Unreleased" changes under a new version and set the release date.
3. Bump version in `composer.json` if needed (and any other places that reference the version).

## Tag and release

1. Commit the changelog and version bumps.
2. Create an annotated tag: `git tag -a v1.4.11 -m "Release 1.4.11"`.
3. Push the tag: `git push origin v1.4.11` (or your default branch name, e.g. `main`).
4. If the project uses GitHub Releases or CI, the tag push may trigger release notes and artifact uploads; complete any manual steps required by your workflow.

**From the bundle repo root (if this is a standalone repo):**
```bash
git add docs/CHANGELOG.md docs/UPGRADING.md docs/RELEASE.md docs/DEMO-FRANKENPHP.md README.md Makefile demo/
git commit -m "Release v1.4.11: remove Symfony 7 demo"
git tag -a v1.4.11 -m "Release 1.4.11"
git push origin master
git push origin v1.4.11
```

## Post-release

1. In the repo, add a new "Unreleased" section at the top of CHANGELOG.md for the next development cycle.
2. Optionally announce the release (e.g. in project docs or packagist).

After creating the release commit and tag, run `make check-no-cursor-coauthor` again **before** `git push` (REQ-GIT-001). The release commit itself is not covered by an earlier `release-check` run.
