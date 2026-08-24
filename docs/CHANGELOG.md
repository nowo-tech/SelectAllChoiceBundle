# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]


## [1.5.4] - 2026-08-24

### Changed

- Raise minimum PHP to **8.2** and sync README badge (REQ-SF-001).
- **Docs:** PHP-FIG PSR evaluation (REQ-CS-007).

### Notes

- **No API or configuration changes** for integrators unless noted above.

[1.5.4]: https://github.com/nowo-tech/SelectAllChoiceBundle/releases/tag/v1.5.4

## [1.5.3] - 2026-08-20

### Security

- **Dev/demo frontend:** `vite` **^6.4.3**, `vitest` **^3.2.6**; demo + root pnpm overrides for `postcss`/`nanoid` (Dependabot High on lockfiles).

## [1.5.2] - 2026-08-19

### Security

- **CI:** run `composer audit --locked` after dependency install (REQ-SEC / P3).

## [1.5.1] - 2026-08-18

### Changed

- **Demos:** pin `nowo-tech/hot-reload-bundle` to `^1.4` with FrankenPHP Mercure/`hot_reload` (`dev`/`test` only).

[1.5.1]: https://github.com/nowo-tech/SelectAllChoiceBundle/releases/tag/v1.5.1

## [1.5.0] - 2026-08-04

### Added
- **REQ-TWIG-004:** require `twig/extra-bundle` + `twig/string-extra`; `make check-twig-extra` in `release-check`; demos register `TwigExtraBundle`.
- **Twig-CS-Fixer:** `vincentlanglet/twig-cs-fixer`, `.twig-cs-fixer.php`, `composer twig:lint` / `twig:fix`.

[1.5.0]: https://github.com/nowo-tech/SelectAllChoiceBundle/releases/tag/v1.5.0

## [1.4.12] - 2026-07-29

### Added

- Named Symfony asset package `nowo_select_all_choice` + `nowo_select_all_choice_asset_package()` (REQ-ASSETS-004); direct `symfony/asset` dependency.
- `make check-open-prs`, `coverage-check`, `down-dev`, `demo-smoke`; `release-check` gates open PRs and PHP coverage.
- `SYMFONY_DEPRECATIONS_HELPER=max[direct]=0` (REQ-SF-005); PHPStan `ignoreErrors: []` (REQ-CS-006).
- FrankenPHP Friendly banner (REQ-DOCS-017); demo image `frankenphp:1-php8.5`.
- **REQ-CS-005:** `nowo-tech/phpstan-frankenphp` in `require-dev`.

### Changed

- `nowo_select_all_choice_asset_path()` returns a relative filename for use with the named package (see [UPGRADING.md](UPGRADING.md)).

### Documentation

- [UPGRADING.md](UPGRADING.md) **1.4.11 → 1.4.12**; README / USAGE / INSTALLATION asset examples updated.

## [1.4.11] - 2026-07-16

### Removed

- **Demo Symfony 7** (`demo/symfony7/`): the repository now ships only the Symfony 8 demo (`demo/symfony8`, port 8008). Bundle support for Symfony 7 in consuming apps is unchanged (CI matrix and `composer.json` constraints remain).

### Changed

- **Demo tooling**: root and `demo/Makefile` targets are Symfony 8–only (`up-symfony8`, etc.).
- **Docs**: [README](../README.md), [demo/README.md](../demo/README.md), and [DEMO-FRANKENPHP.md](DEMO-FRANKENPHP.md) updated to describe the single Symfony 8 demo.

## [1.4.10] - 2026-07-16

### Added

- **REQ-GIT-001**: `.scripts/check-no-cursor-coauthor.sh`, `.githooks/commit-msg`, Cursor rule `.cursor/rules/01-git-commits.mdc`, and CI job `git-hygiene` so commit history must not contain Cursor co-author trailers.
- **`docs/GITHUB_CI.md`**: operator and CI reference for GitHub Actions hygiene (REQ-GIT-001).
- **`CODE_OF_CONDUCT.md`**: Contributor Covenant; linked from README and CONTRIBUTING.
- **Makefile**: `setup-hooks`, `check-no-cursor-coauthor`, `strip-cursor-coauthor-from-history`; `release-check` now runs the co-author check first.

### Changed

- **CONTRIBUTING**: Code of Conduct section and Git hooks guidance (`make setup-hooks`).
- **RELEASE**: remind maintainers to re-run `make check-no-cursor-coauthor` after the release commit, before push.
- **`.gitignore`**: ignore `.cursor/sandbox.json` (REQ-IDE-005).
- **Dependencies**: refreshed root and demo `composer.lock` files during release QA.

## [1.4.9] - 2026-07-09

### Added

- **GitHub Spec Kit**: `.specify/` scaffolding, Cursor Agent skills (`.cursor/skills/speckit-*`), baseline spec [`specs/001-baseline/`](../../specs/001-baseline/) (`spec.md`, `code-inventory.md` covering 100% of `src/`).
- **`docs/SPEC-KIT.md`**: operator manual for installing Specify CLI, initializing Spec Kit, folder layout, Cursor skills, and maintainer checklist.
- **`pnpm-workspace.yaml`**: allows esbuild build scripts under pnpm supply-chain policies.

### Changed

- **`docs/SPEC-DRIVEN-DEVELOPMENT.md`**: three-layer model (Spec Kit baseline, product behavior, `REQ-*` anchors); bundle-specific user stories and functional scope table; Vitest validation notes; Spec Kit maintainer workflow.
- **README**: link to [SPEC-KIT.md](SPEC-KIT.md).
- **Demos**: `public/bundles/` added to demo `.gitignore` (symlinks no longer committed; created at container runtime); refreshed demo lockfiles.
- **Dependencies**: refreshed root `composer.lock`.
- **Public script**: rebuilt `select-all-choice.js` (build artifact sync only; no behaviour change).

## [1.4.8] - 2026-06-30

### Added

- **CodeRabbit**: `.coderabbit.yaml` and GitHub workflow for automated PR reviews on bundle source, tests, docs, and demo paths.
- **`docs/SPEC-DRIVEN-DEVELOPMENT.md`**: product scope, user stories, `REQ-*` traceability anchors, and validation workflow (complements [ENGRAM.md](ENGRAM.md)).
- **Makefile `update-deps`**: shared `REQ-MAKE-008` target (root Makefile and demo aggregate) via `.scripts/Makefile.update-deps.mk`.

### Changed

- **CI matrix**: PHPUnit now runs against Symfony **7.4** and **8.1** in addition to 7.0 and 8.0 (PHP 8.2–8.5; Symfony 8.x excluded on PHP 8.2–8.3).
- **GitHub Release workflow**: `softprops/action-gh-release` bumped from v2 to v3.
- **Demos**: Symfony 7 demo Flex constraint **7.4.***; Symfony 8 demo **8.1.***; refreshed lockfiles and Flex `config/reference.php`; `public/bundles/` symlinks for bundle assets in FrankenPHP containers.
- **README**: Symfony compatibility badge aligned with supported ranges; link to spec-driven development doc.
- **Dependencies**: refreshed root and demo `composer.lock` files.
- **Scrutinizer**: environment and filter tweaks for the current PHP toolchain.
- **`docs/ENGRAM.md`**: cross-link to spec-driven development.

## [1.4.7] - 2026-05-12

### Added

- **`nowo-select-all-choice` custom element**: autonomous Web Component root used by the default Twig wrapper; registers once and runs the same `initSelectAllContainer` logic as Stimulus/standalone (with `display: block` to match former `<div>` layout).

### Changed

- **Default markup**: `_select_all_choice_wrapper.html.twig` now wraps the widget in `<nowo-select-all-choice …>` instead of an outer `<div>`, while keeping `data-controller="select-all"` and `data-select-all-target="choices"` unchanged.
- **Discovery selector**: `runInit` / `MutationObserver` now treat both `nowo-select-all-choice` and `[data-controller*="select-all"]` as containers (see `SELECTOR_CONTAINER` in the library).
- **Standalone and Stimulus entry**: both call `ensureNowoSelectAllChoiceDefined()` so the custom element upgrades as soon as the script loads.
- **Public script**: rebuilt `select-all-choice.js` after the above asset changes.

### Added (tests)

- **`nowo-select-all-choice-element.test.ts`**: covers custom element registration, `connectedCallback` init, and idempotent `ensureNowoSelectAllChoiceDefined()`.

## [1.4.6] - 2026-05-12

### Changed

- **Standalone script** (`select-all-choice.js`): clearer debug/info logging and a slightly streamlined initialization path for `data-select-all` containers (no API or attribute changes for consuming apps).
- **Bundle root**: refreshed `composer.lock` after Composer sync during release QA.
- **Demos (Symfony 7 and 8)**: refreshed `composer.lock` and Flex `config/reference.php` after dependency updates and code style alignment.

## [1.4.5] - 2026-04-15

### Changed

- **Repository tooling**: `.cursorignore`, Cursor rules for bundle development, GitHub workflows (`pr-lint`, stale issues), Dependabot tweaks, and Copilot instructions for contributors.
- **Dependencies**: Refreshed `composer.lock` (bundle root and Symfony 7/8 demos) and npm/pnpm lockfiles; demo `docker-compose` adds DNS-related options to improve reliability on Docker/WSL.
- **Public script**: Rebuilt `select-all-choice.js` after the dependency and build pipeline updates.

## [1.4.4] - 2026-03-31

### Fixed

- **Twig extension compatibility**: `NowoSelectAllChoiceTwigExtension` is now a proper Twig extension (`AbstractExtension` + `getFunctions()`), preventing `Twig\Environment::addExtension()` type errors in consumer apps.
- **Rector stability for this bundle**: disabled automatic conversion from `getFunctions()` to `#[AsTwigFunction]` in bundle Rector config so release QA does not re-introduce the compatibility issue.

### Added

- **Twig extension unit test coverage**: verifies that `getFunctions()` exposes `nowo_select_all_choice_asset_path` and keeps `assetPath()` behavior validated.

## [1.4.3] - 2026-03-31

### Changed

- **Select-all initialization logs**: the frontend now reports how many `data-select-all` containers are fully configured (wrapper attributes + choices target) during startup, with improved visibility in debug workflows.
- **Stimulus integration in demos**: Symfony demo `app.ts` and controller wiring were adjusted so script-load and container-count logs are emitted consistently in demo environments.
- **Tests and compatibility metadata**: updated TypeScript tests around logger/select-all behavior and refreshed demo lock/reference files for broader Symfony compatibility.

## [1.4.2] - 2026-03-30

### Changed

- **Frontend logger**: `SelectAllChoiceBundle` logger now supports a real debug toggle (`setDebug(true)` enables debug/info/warn/error) matching the controller/lib expectations.
- **Assets & QA**: `make assets-test` now reports global TS coverage percentage and fails on thresholds; added translation YAML validation target and coverage extraction script.
- **Docs**: release tooling and usage notes were clarified (see `USAGE.md`, `docs/RELEASE.md`, and `docs/UPGRADING.md`).

## [1.4.1] - 2026-03-19

### Added

- **USAGE.md**: Section “Overriding templates and translations” with subsections for overriding translations (domain, locale, example) and overriding templates (bundle template files and form theme blocks).

### Fixed

- **Twig extension**: `NowoSelectAllChoiceTwigExtension` no longer uses the `#[AsTwigFunction]` attribute; the Twig function is registered via `getFunctions()` to avoid the conflict “cannot extend AbstractExtension and use AsTwigFunction, choose one or the other” on some Twig/Symfony versions.
- **Dist package**: The `demo/` folder is no longer included when the bundle is installed via Composer. Added `.gitattributes` with `export-ignore` for `/demo` and `/.cursor` so `git archive` (used by GitHub/Packagist for dist) excludes them. The `composer.json` `archive.exclude` is not applied to git-archive–based dists.

## [1.4.0] - 2026-03-14

### Added

- **[DEMO-FRANKENPHP.md](DEMO-FRANKENPHP.md)**: Documentation for running demos with FrankenPHP in development (no worker, template changes visible on refresh) and production (worker mode, cache enabled). Includes Web Profiler, Debug bundle and Nowo Twig Inspector; states that the `demo/` folder is not shipped when the bundle is installed (excluded via Composer archive). Reusable for other bundles.
- **Demo development setup**: FrankenPHP without worker mode so each request uses a fresh PHP process; Twig cache disabled in `config/packages/dev/twig.yaml`; `docker/php-dev.ini` with `opcache.revalidate_freq=0` mounted in Compose; Caddyfile and php-dev.ini mounted as volumes; no-cache HTTP headers; Symfony cache cleared on container startup in dev. Template and config changes are visible on browser refresh.
- **Documentation**: CONFIGURATION.md and INSTALLATION.md now warn that the bundle form theme must be defined only in `nowo_select_all_choice.form_theme` and must not be added to `twig.form_themes` to avoid incorrect rendering (e.g. missing labels with Bootstrap).

### Changed

- **Demos**: Rely only on `form_theme` in bundle config; removed manual `@NowoSelectAllChoice/Form/select_all_choice_theme*.html.twig` from `twig.form_themes` so the prepended theme (from `form_theme`) is not overridden. README and demo READMEs reference `make cache-clear` and template refresh behaviour.
- **RELEASE.md**: Pre-release checklist and tag examples updated for current release.
- **Documentation**: README “Additional documentation” now links to [overriding translations](CONFIGURATION.md#translations) and [overriding bundle template files](THEMING.md#overriding-bundle-template-files).

### Fixed

- **Demos**: Expanded choice fields (e.g. Roles, Categories) now show option labels (Admin, User, Guest, etc.) by using the bundle’s Bootstrap 5 theme via `form_theme` instead of the generic form_div theme that was overriding it.
- **PHPStan**: `callable.nonCallable` in `ChoiceTypeSelectAllExtensionTest`: added `self::assertNotNull($listener)` before invoking the captured PRE_SUBMIT listener in `testBuildFormListenerFiltersNullFromSubmittedData` and `testBuildFormListenerLeavesNonArrayDataUnchanged`.

## [1.3.0] - 2026-03-13

### Added

- **Stimulus target constants**: `ATTR_TARGET`, `TARGET_TOGGLE_WRAPPER`, `TARGET_TOGGLE`, `TARGET_TOGGLE_LABEL` exported from the controller for consistent use of `data-select-all-target` attribute and values.
- **PHP test coverage 100%**: New tests for `ChoiceTypeSelectAllExtension::buildForm` (PRE_SUBMIT listener, null filtering, non-array data), `buildView` with `debug=true`, and full option resolution.
- **TypeScript test coverage 100%** (lines, statements, functions): New `logger.test.ts` and `select_all_controller.test.ts`; test for `getLogger()` when no logger is injected; Vitest thresholds updated (branches ≥ 83%).

### Changed

- **Logger bridge** now lives inside the Stimulus controller (same pattern as IconSelectorBundle): removed `selectAllLogger.ts`; `setBundleLogger`, `getLogger` and `ATTR_DEBUG` are defined and exported from `select_all_controller.ts`. Entry point injects the logger via `setBundleLogger(log)`.
- **Demos**: Vite alias and `BUNDLE_PATH` point to bundle entry `src/Resources/assets/index.ts`; both demos define `__SELECT_ALL_CHOICE_BUILD_TIME__` so the build time is shown in the console; `make up` help text states that deps and assets are built.
- **Demos**: Bootstrap 5 form theme enabled (`bootstrap_5_layout.html.twig` in Twig and bundle config); `DemoFormType` categories field uses Bootstrap classes (`form-check-input`, `form-check`, `form-check-label`, `mb-3 p-3 border rounded bg-light`).
- **Vitest**: Full test and coverage configuration moved to `vitest.config.ts`; `vite.config.ts` only handles the bundle build.

### Fixed

- **Reentrancy in select listener**: When the select’s `change` listener called `dispatchChange()`, the same listener ran again and could cause stack overflow. A new `isDispatchingChange` flag prevents re-entry (same pattern as `isDispatchingFromToggle`).
- **PHPStan**: `FormBuilderInterface` generic specified as `FormBuilderInterface<mixed>` in `ChoiceTypeSelectAllExtension::buildForm` PHPDoc.
- **index.test.ts**: Corrected `describe()` closing brace so the test file parses correctly.

## [1.2.0] - 2026-03-13

### Added

- TypeScript test and build pipeline now run fully **inside the bundle Docker container**: `make assets`, `make assets-test` and `make assets-dev` ensure the PHP service is up and execute `pnpm` inside it.
- Root `Dockerfile` now installs **Node.js + pnpm** so assets can be built and tested from within the PHP image (no pnpm required on the host for bundle QA).
- Vitest suite extended to reach **100% TS coverage** for bundle assets (statements, lines, functions and branches), with defensive branches annotated for coverage tools.

### Changed

- `ChoiceTypeSelectAllExtension` now registers a `FormEvents::PRE_SUBMIT` listener for `ChoiceType` fields with `multiple=true` to **normalize submitted data** (removes `null` entries) before Symfony’s `ChoiceType` processes it.
- Demo `DemoFormType` in the Symfony 8 demo relies on the bundle extension for this normalization and no longer contains demo-only listeners.

### Fixed

- Symfony warning in demos and consuming apps:  
  `Warning: array_flip(): Can only flip string and integer values, entry skipped`  
  caused by browsers submitting `null` entries in multi-select fields is now prevented by the new normalization in `ChoiceTypeSelectAllExtension` (the behaviour is transparent for users).

## [1.1.0] - 2026-03-05

### Added

- **`form_theme`** config option to match your app's form layout (e.g. `bootstrap_5_layout.html.twig`). The bundle automatically prepends its form theme to Twig via `PrependExtensionInterface`; you no longer need to add it to `twig.form_themes` manually.
- Dedicated form theme templates for all 11 standard Symfony form layouts: `form_div_layout`, `form_table_layout`, Bootstrap 5/4/3 (and horizontal), Foundation 5/6, Tailwind 2. Set `form_theme` in bundle config to the same value you use in `twig.form_themes`.
- Shared partial `_select_all_choice_wrapper.html.twig` for theme markup; all theme templates include it to avoid duplication.
- Translations for **60 languages** (domain `NowoSelectAllChoiceBundle`, key `form.select_all`): en, es, ar, bg, bn, ca, cs, da, de, el, et, fa, fi, fr, he, hi, hr, hu, hy, id, is, it, ja, ka, km, ko, lt, lv, mk, ms, mt, ne, nl, no, pl, pt, pt_BR, ro, ru, sk, sl, sq, sr, sv, sw, ta, te, th, tr, uk, ur, vi, zh_CN, zh_TW, af, am, az, eu, gl, cy.
- Makefile: targets `rector`, `rector-dry`, `phpstan`, `update`, `validate`; `release-check` now includes rector-dry and phpstan; bundle-specific assets targets (`assets-test`, `assets-dev`, `assets-watch`, `assets-clean`); simplified Demos help (use `make -C demo` or `make -C demo/symfonyX`).

### Changed

- Form theme registration is now automatic based on `form_theme` config; manual addition to `twig.form_themes` is optional (e.g. to control order).
- Theme templates refactored to use the shared wrapper partial.
- Documentation (CONFIGURATION.md and related) in English; README Documentation section order aligned with bundle standards.
- Demo Makefile uses standard target names (`up-X`, `down-X`, etc.).

### Fixed

- PHPStan: `FormInterface<mixed>` generic on `buildView()`, `getContainerExtension()` return type, `Extension::load()` configs type `array<int, array<string, mixed>>`.

## [1.0.1] - 2026-03-02

### Fixed

- Demo Docker images: pnpm installation with `SHELL=sh` and fallback symlink from `.tools/pnpm-exe` so pnpm is available in PATH.

### Changed

- Root `make build` now rebuilds the bundle’s docker-compose image (no longer the demo images).
- Demo Makefiles invoke pnpm via `/usr/local/bin/pnpm`.
- Release and docs: README badge URLs, RELEASE.md tag examples.

## [1.0.0] - 2025-03-02

### Added

- Initial release: Form type extension, Twig form theme and Stimulus controller for "Select all" on `ChoiceType` with `multiple=true` (expanded and collapsed).
- Opt-in via `select_all => true`; configurable label, position and CSS; translations (EN, ES) in domain `NowoSelectAllChoiceBundle`.
- Frontend-driven toggle: backend passes config via data attributes; Stimulus controller creates and manages the checkbox in the DOM.
- TypeScript and Vite for bundle assets; consuming app’s Vite build compiles the bundle (no Encore/Importmap).
- Configurable CSS for Bootstrap, Tailwind or custom: `default_wrapper_css_class`, `default_label_css_class` and per-field `select_all_wrapper_css_class`, `select_all_label_css_class` (see [CONFIGURATION](CONFIGURATION.md) and [THEMING](THEMING.md)).
- [THEMING.md](THEMING.md): how to override the form theme (custom HTML) and use Bootstrap/Tailwind/custom classes.
- Demos (Symfony 7 and 8): locale in the URL (`/en`, `/es`), navbar language dropdown, visible EN|ES switch, Web Profiler (dev), and a "Categories" field with Tailwind-style classes; documentation for language switching and styles in demo READMEs.

[Unreleased]: https://github.com/nowo-tech/SelectAllChoiceBundle/compare/v1.5.1...HEAD
[1.4.11]: https://github.com/nowo-tech/SelectAllChoiceBundle/releases/tag/v1.4.11
[1.4.10]: https://github.com/nowo-tech/SelectAllChoiceBundle/releases/tag/v1.4.10
[1.4.9]: https://github.com/nowo-tech/SelectAllChoiceBundle/releases/tag/v1.4.9
[1.4.8]: https://github.com/nowo-tech/SelectAllChoiceBundle/releases/tag/v1.4.8
[1.4.7]: https://github.com/nowo-tech/SelectAllChoiceBundle/releases/tag/v1.4.7
[1.4.6]: https://github.com/nowo-tech/SelectAllChoiceBundle/releases/tag/v1.4.6
[1.4.5]: https://github.com/nowo-tech/SelectAllChoiceBundle/releases/tag/v1.4.5
[1.4.4]: https://github.com/nowo-tech/SelectAllChoiceBundle/releases/tag/v1.4.4
[1.4.3]: https://github.com/nowo-tech/SelectAllChoiceBundle/releases/tag/v1.4.3
[1.4.2]: https://github.com/nowo-tech/SelectAllChoiceBundle/releases/tag/v1.4.2
[1.4.1]: https://github.com/nowo-tech/SelectAllChoiceBundle/releases/tag/v1.4.1
[1.4.0]: https://github.com/nowo-tech/SelectAllChoiceBundle/releases/tag/v1.4.0
[1.3.0]: https://github.com/nowo-tech/SelectAllChoiceBundle/releases/tag/v1.3.0
[1.2.0]: https://github.com/nowo-tech/SelectAllChoiceBundle/releases/tag/v1.2.0
[1.1.0]: https://github.com/nowo-tech/SelectAllChoiceBundle/releases/tag/v1.1.0
[1.0.1]: https://github.com/nowo-tech/SelectAllChoiceBundle/releases/tag/v1.0.1
[1.0.0]: https://github.com/nowo-tech/SelectAllChoiceBundle/releases/tag/v1.0.0
