# Upgrading

This document describes upgrade steps between major or notable versions of SelectAllChoiceBundle.


## Table of contents

- [1.0.0 (first release)](#100-first-release)
- [1.0.0 → 1.0.1](#100-101)
- [1.0.1 → 1.1.0](#101-110)
- [1.1.0 → 1.2.0](#110-120)
- [1.2.0 → 1.3.0](#120-130)
- [1.3.0 → 1.4.0](#130-140)
- [1.4.0 → 1.4.1](#140-141)
- [1.4.1 → 1.4.2](#141-142)
- [1.4.2 → 1.4.3](#142-143)
- [1.4.3 → 1.4.4](#143-144)
- [1.4.4 → 1.4.5](#144-145)
- [1.x → 2.x (future)](#1x-2x-future)
- [General](#general)

## 1.0.0 (first release)

No upgrade steps required. This is the first stable release.

## 1.0.0 → 1.0.1

No upgrade steps required. Patch release (demo Docker/pnpm fixes, root `make build` behaviour, docs).

## 1.0.1 → 1.1.0

- **Optional:** If you use a Symfony form layout other than the default (`form_div_layout.html.twig`), add `form_theme` to your bundle config so the "Select all" theme matches. In `config/packages/nowo_select_all_choice.yaml` set `form_theme` to the same template name you use in `twig.form_themes` (e.g. `bootstrap_5_layout.html.twig`). See [CONFIGURATION.md](CONFIGURATION.md).
- If you previously added the bundle’s form theme manually to `twig.form_themes`, remove it; the bundle now prepends it automatically based on `form_theme`. Do not re-add any `@NowoSelectAllChoiceBundle/Form/select_all_choice_theme*.html.twig` to `twig.form_themes` (see [CONFIGURATION.md](CONFIGURATION.md#form-theme-symfony-layouts)).
- No other breaking changes. Translations for 60 languages are included; existing EN/ES keys are unchanged.

## 1.1.0 → 1.2.0

- **No breaking changes.** The upgrade is safe and requires no code changes in consumer projects.
- The `ChoiceTypeSelectAllExtension` now normalizes submitted data for `ChoiceType` fields with `multiple=true` by removing `null` entries before Symfony’s core `ChoiceType` processes it. This prevents warnings such as `array_flip(): Can only flip string and integer values, entry skipped` when browsers submit sparse arrays.
- If you previously added your own `FormEvents::PRE_SUBMIT` listeners just to clean up `null` entries for multi-select fields controlled by this bundle, you can remove those listeners and rely on the built-in normalization instead.
- The bundle’s internal Docker image now includes Node.js + pnpm and the root `Makefile` runs asset tests/build **inside the PHP container**. If you contribute to the bundle or maintain a fork, re-build the Docker image (`make build`) before running `make assets-test`.

## 1.2.0 → 1.3.0

- **No breaking changes.** Safe to upgrade; no required code changes in consumer projects.
- The shared logger is now defined inside the Stimulus controller (no separate `selectAllLogger` module). If you forked or extended the bundle and imported from `selectAllLogger`, switch to importing `setBundleLogger` / `getLogger` / `ATTR_DEBUG` from the controller module (e.g. `controllers/select_all_controller.ts`).
- Demos that bundle the repo’s TypeScript import the controller from `src/Resources/assets/controllers/select_all_controller.ts` and register it with `application.register('select-all', SelectAllController)`. Alternatively, use the standalone script `select-all-choice.js` (see [USAGE.md](USAGE.md#including-the-frontend-script)).
- Demos use Bootstrap 5 form theme and Bootstrap form classes; you can align your app the same way by setting `form_theme: 'bootstrap_5_layout.html.twig'` and using `form-check-input`, `form-check`, `form-check-label` for select-all options.

## 1.3.0 → 1.4.0

- **No breaking changes.** Safe to upgrade; no required code changes in consumer projects.
- **Form theme:** If you had added `@NowoSelectAllChoiceBundle/Form/select_all_choice_theme*.html.twig` to `twig.form_themes` manually, remove it. Define the bundle form theme only in `nowo_select_all_choice.form_theme`; see [CONFIGURATION.md](CONFIGURATION.md#form-theme-symfony-layouts). Keeping it in both places can override the correct theme and cause missing labels on expanded choices with Bootstrap.
- **Demos:** New [DEMO-FRANKENPHP.md](DEMO-FRANKENPHP.md) explains development vs production FrankenPHP setup (worker mode, Twig cache, OPcache). The `demo/` folder is not included when the bundle is installed via Composer.

## 1.4.0 → 1.4.1

- **No breaking changes.** Safe to upgrade; no required code changes in consumer projects.
- The Twig extension now registers the `nowo_select_all_choice_asset_path` function via `getFunctions()` instead of the `#[AsTwigFunction]` attribute, fixing compatibility on environments where extending `AbstractExtension` and using the attribute together is not allowed.
- From this version onward, the Composer dist package (e.g. from Packagist) no longer includes the `demo/` folder, thanks to `.gitattributes` `export-ignore`. If you had relied on the demo being present under `vendor/nowo-tech/select-all-choice-bundle/`, clone or download the repository from GitHub instead.

## 1.4.1 → 1.4.2

- **No breaking changes.** Safe to upgrade; no required code changes in consumer projects.
- Frontend: the bundle logger now properly enables debug/info/warn/error output after `setDebug(true)`, aligning the behavior with the controller/lib and the `data-select-all-debug-value="1"` development workflow.
- QA/dev tooling: improved `make assets-test` TS coverage reporting and added `validate-translations` linting target. These affect the repo workflow, not consuming apps.

## 1.4.2 → 1.4.3

- **No breaking changes.** Safe to upgrade; no required code changes in consumer projects.
- Frontend logs in demo and Stimulus-driven contexts are more consistent: startup now reports configured `data-select-all` container counts and script-load messages in the expected flow.
- If you use custom logging in your app, no migration is required; existing `setBundleLogger()` and debug toggle behavior remain unchanged.

## 1.4.3 → 1.4.4

- **No breaking changes.** Safe to upgrade; no required code changes in consumer projects.
- Twig integration is now strictly compatible with `twig.extension` service expectations: the bundle extension is explicitly a Twig `AbstractExtension` and declares functions via `getFunctions()`.
- The `nowo_select_all_choice_asset_path` function name and `assetPath()` behavior are unchanged, so template usage remains fully backward compatible.

## 1.4.4 → 1.4.5

- **No breaking changes.** Safe to upgrade; no required code changes in consumer projects.
- This release refreshes lockfiles and repository tooling (CI, Dependabot, Cursor rules, demo Docker Compose DNS options) and rebuilds the published `select-all-choice.js`. Behaviour and public APIs are unchanged for consuming applications.

## 1.x → 2.x (future)

No upgrades yet. When breaking changes are introduced, they will be listed here with migration steps.

## General

- Keep the bundle and Symfony dependencies updated (e.g. `composer update nowo-tech/select-all-choice-bundle`).
- After upgrading, run your test suite and optionally `make test` (or `composer test`) in the bundle if you maintain a fork or contribute.
