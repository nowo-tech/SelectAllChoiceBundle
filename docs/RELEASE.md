# Release process

This document describes how to cut a new release of SelectAllChoiceBundle.

## Pre-release (v1.5.5)

- [x] CHANGELOG: [1.5.5] with date and changes; [Unreleased] empty.
- [x] UPGRADING: 1.5.4 → 1.5.5 section (FrankenPHP worker / `FRANKENPHP_RESET_KERNEL` unset).
- [x] FRANKENPHP-WORKER-AUDIT.md committed; PHPStan classic + worker-no-kernel-reset + hardening.
- [ ] Run `make release-check` from the bundle root when Docker is available.
- [ ] Commit all release-related file changes; tag `v1.5.5`; push.

## Pre-release (every release)

1. Run full QA: `make release-check` (or `composer-sync`, `cs-fix`, `cs-check`, `test-coverage`, and optionally demo verification).
2. Update [CHANGELOG.md](CHANGELOG.md): move "Unreleased" changes under a new version and set the release date.
3. Bump version in `composer.json` if needed (and any other places that reference the version).

## Tag and release

1. Commit the changelog and version bumps.
2. Create an annotated tag: `git tag -a v1.5.5 -m "Release 1.5.5"`.
3. Push the tag: `git push origin v1.5.5`.
4. If the project uses GitHub Releases or CI, the tag push may trigger release notes and artifact uploads; complete any manual steps required by your workflow.

**From the bundle repo root:**
```bash
git add -A
git commit -m "Release v1.5.5: FrankenPHP worker (FRANKENPHP_RESET_KERNEL unset) compatibility."
git tag -a v1.5.5 -m "Release v1.5.5 - FrankenPHP worker / FRANKENPHP_RESET_KERNEL unset"
git push origin master
git push origin v1.5.5
```

## Post-release

1. In the repo, add a new "Unreleased" section at the top of CHANGELOG.md for the next development cycle.
2. Optionally announce the release (e.g. in project docs or packagist).

After creating the release commit and tag, run `make check-no-cursor-coauthor` again **before** `git push` (REQ-GIT-001). The release commit itself is not covered by an earlier `release-check` run.
