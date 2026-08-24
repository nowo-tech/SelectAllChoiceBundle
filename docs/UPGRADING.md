# Upgrading

This document describes upgrade steps between major or notable versions of SelectAllChoiceBundle.


## Table of contents


- [From 1.5.3 to 1.5.4](#from-153-to-154)
- [Unreleased](#unreleased)
- [To 1.5.2](#to-152)
- [To 1.5.1](#to-151)
- [To 1.5.0](#to-150)
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
- [1.4.5 → 1.4.6](#145-146)
- [1.4.6 → 1.4.7](#146-147)
- [1.4.7 → 1.4.8](#147-148)
- [1.4.8 → 1.4.9](#148-149)
- [1.4.9 → 1.4.10](#149-1410)
- [1.4.10 → 1.4.11](#1410-1411)
- [1.4.11 → 1.4.12](#1411-1412)
- [1.x → 2.x (future)](#1x-2x-future)
- [General](#general)

## From 1.5.3 to 1.5.4

Review the [CHANGELOG](CHANGELOG.md) entry. PHP **8.2+** may now be required.

```bash
composer update nowo-tech/select-all-choice-bundle
```

## From 1.5.3 to 1.5.4

Review the [CHANGELOG](CHANGELOG.md) entry. PHP **8.2+** may now be required.

```bash
composer update nowo-tech/select-all-choice-bundle
```


## Unreleased

## To 1.5.3

From **1.5.2** — No application upgrade steps (dev/demo frontend Dependabot bumps only).

```bash
composer update nowo-tech/select-all-choice-bundle
```

## To 1.5.2

From **1.5.1** — No application upgrade steps.

```bash
composer update nowo-tech/select-all-choice-bundle
```

## To 1.5.1

From **1.5.0** — No application upgrade steps. **Demos only:** Hot Reload Bundle `^1.4` (FrankenPHP Mercure/`hot_reload`, `dev`/`test`).

```bash
composer update nowo-tech/select-all-choice-bundle
```

## To 1.5.0

From **1.4.12** — Adds required Twig Extra (REQ-TWIG-004) and Twig-CS-Fixer. Register TwigExtraBundle if Flex did not.

```bash
composer update nowo-tech/select-all-choice-bundle
php bin/console cache:clear
```

### Twig Extra Bundle (REQ-TWIG-004)

Hosts that render this bundle's Twig templates must install:

```bash
composer require twig/extra-bundle twig/string-extra
```

and enable `Twig\Extra\TwigExtraBundle\TwigExtraBundle`. Flex recipes usually register it automatically.

### Twig-CS-Fixer (maintainers)

Package maintainers: `composer twig:lint` / `composer twig:fix` use `.twig-cs-fixer.php` over `src/` (and `templates/` when present).


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

## 1.4.5 → 1.4.6

- **No breaking changes.** Safe to upgrade; no required code changes in consumer projects.
- If you load the bundle’s **standalone** `select-all-choice.js` from `Resources/public/`, you get improved console logging and initialization messaging only; Stimulus-driven apps that compile from the bundle TypeScript are unchanged unless you rebuild assets from this version.

## 1.4.6 → 1.4.7

- **No breaking changes** for normal Symfony form usage: the bundle still outputs `data-controller="select-all"` and `data-select-all-target="choices"`; only the **outer host tag** of the default wrapper is now `<nowo-select-all-choice>` (a registered autonomous custom element) instead of `<div>`.
- If you **overrode** `_select_all_choice_wrapper.html.twig` or your own form theme copied the old outer `<div>`, you can keep that markup; the library still finds `[data-controller*="select-all"]`. Optionally align with the bundle default by using `<nowo-select-all-choice …>` as the outer host for consistency.
- **Custom themes / CSS**: if selectors assumed a literal `div` wrapper (e.g. `form > div > …`), review them; class names and inner structure are unchanged.

## 1.4.7 → 1.4.8

- **No breaking changes.** Safe to upgrade; no required code changes in consumer projects.
- This release refreshes CI (Symfony 7.4 / 8.1 matrix), repository tooling (CodeRabbit, shared `update-deps` Make targets, Scrutinizer), demo lockfiles and Flex constraints (7.4.* / 8.1.*), and contributor docs ([SPEC-DRIVEN-DEVELOPMENT.md](SPEC-DRIVEN-DEVELOPMENT.md)). Behaviour and public APIs are unchanged for consuming applications.

## 1.4.8 → 1.4.9

- **No breaking changes.** Safe to upgrade; no required code changes in consumer projects.
- Adds **GitHub Spec Kit** scaffolding (`.specify/`, Cursor skills, `specs/001-baseline/`) and [`SPEC-KIT.md`](SPEC-KIT.md) for maintainers; expands [SPEC-DRIVEN-DEVELOPMENT.md](SPEC-DRIVEN-DEVELOPMENT.md). These are contributor/maintainer assets — not part of the Composer dist contract for consuming apps.
- **`pnpm-workspace.yaml`** at the bundle root allows esbuild builds when using pnpm in this repo; consumer apps are unaffected unless they vendor and build from source.
- Demo `public/bundles/` symlinks are no longer in git (ignored; recreated in FrankenPHP containers at runtime). Forks that run demos locally should follow [DEMO-FRANKENPHP.md](DEMO-FRANKENPHP.md).

## 1.4.9 → 1.4.10

- **No breaking changes.** Safe to upgrade; no required code changes in consumer projects.
- Repository hygiene only: CI job and scripts enforce **no Cursor co-author trailers** in git history ([GITHUB_CI.md](GITHUB_CI.md), REQ-GIT-001); Contributor Covenant in [`CODE_OF_CONDUCT.md`](../CODE_OF_CONDUCT.md). Contributors should run `make setup-hooks` once per clone.

## 1.4.10 → 1.4.11

- **No breaking changes** for consuming applications. Public API, configuration, and Symfony 7/8 package constraints are unchanged.
- **Repository demos only:** `demo/symfony7` was removed. Use `demo/symfony8` (`make up-symfony8`, http://localhost:8008). Forks that still referenced `make up-symfony7` or `demo/symfony7` should switch to the Symfony 8 demo; see [demo/README.md](../demo/README.md) and [DEMO-FRANKENPHP.md](DEMO-FRANKENPHP.md).

## 1.4.11 → 1.4.12

### Asset package (REQ-ASSETS-004)

- The bundle registers Symfony asset package `nowo_select_all_choice` (`base_path` `/bundles/nowoselectallchoice`).
- `nowo_select_all_choice_asset_path()` now returns a **relative** filename (e.g. `select-all-choice.js`), not `bundles/nowoselectallchoice/...`.
- New helper: `nowo_select_all_choice_asset_package()`.
- Update templates:

```twig
{# Before #}
<script src="{{ asset(nowo_select_all_choice_asset_path('select-all-choice.js')) }}" defer></script>

{# After #}
<script src="{{ asset(nowo_select_all_choice_asset_path('select-all-choice.js'), nowo_select_all_choice_asset_package()) }}" defer></script>
```

Or: `asset('select-all-choice.js', 'nowo_select_all_choice')`.

## 1.x → 2.x (future)

No upgrades yet. When breaking changes are introduced, they will be listed here with migration steps.

## General

- Keep the bundle and Symfony dependencies updated (e.g. `composer update nowo-tech/select-all-choice-bundle`).
- After upgrading, run your test suite and optionally `make test` (or `composer test`) in the bundle if you maintain a fork or contribute.
