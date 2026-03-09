# Upgrading

This document describes upgrade steps between major or notable versions of SelectAllChoiceBundle.


## Table of contents

- [1.0.0 (first release)](#100-first-release)
- [1.0.0 → 1.0.1](#100-101)
- [1.0.1 → 1.1.0](#101-110)
- [1.x → 2.x (future)](#1x-2x-future)
- [General](#general)

## 1.0.0 (first release)

No upgrade steps required. This is the first stable release.

## 1.0.0 → 1.0.1

No upgrade steps required. Patch release (demo Docker/pnpm fixes, root `make build` behaviour, docs).

## 1.0.1 → 1.1.0

- **Optional:** If you use a Symfony form layout other than the default (`form_div_layout.html.twig`), add `form_theme` to your bundle config so the "Select all" theme matches. In `config/packages/nowo_select_all_choice.yaml` set `form_theme` to the same template name you use in `twig.form_themes` (e.g. `bootstrap_5_layout.html.twig`). See [CONFIGURATION.md](CONFIGURATION.md).
- If you previously added the bundle’s form theme manually to `twig.form_themes`, you can remove it; the bundle now prepends it automatically based on `form_theme`.
- No other breaking changes. Translations for 60 languages are included; existing EN/ES keys are unchanged.

## 1.x → 2.x (future)

No upgrades yet. When breaking changes are introduced, they will be listed here with migration steps.

## General

- Keep the bundle and Symfony dependencies updated (e.g. `composer update nowo-tech/select-all-choice-bundle`).
- After upgrading, run your test suite and optionally `make test` (or `composer test`) in the bundle if you maintain a fork or contribute.
