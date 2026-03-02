# Upgrading

This document describes upgrade steps between major or notable versions of SelectAllChoiceBundle.

## 1.0.0 (first release)

No upgrade steps required. This is the first stable release.

## 1.0.0 → 1.0.1

No upgrade steps required. Patch release (demo Docker/pnpm fixes, root `make build` behaviour, docs).

## 1.x → 2.x (future)

No upgrades yet. When breaking changes are introduced, they will be listed here with migration steps.

## General

- Keep the bundle and Symfony dependencies updated (e.g. `composer update nowo-tech/select-all-choice-bundle`).
- After upgrading, run your test suite and optionally `make test` (or `composer test`) in the bundle if you maintain a fork or contribute.
