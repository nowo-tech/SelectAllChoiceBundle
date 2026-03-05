# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- (Nothing yet.)

## [1.1.0] - 2026-03-05

### Added

- **`form_theme`** config option to match your app's form layout (e.g. `bootstrap_5_layout.html.twig`). The bundle automatically prepends its form theme to Twig via `PrependExtensionInterface`; you no longer need to add it to `twig.form_themes` manually.
- Dedicated form theme templates for all 11 standard Symfony form layouts: `form_div_layout`, `form_table_layout`, Bootstrap 5/4/3 (and horizontal), Foundation 5/6, Tailwind 2. Set `form_theme` in bundle config to the same value you use in `twig.form_themes`.
- Shared partial `_select_all_choice_wrapper.html.twig` for theme markup; all theme templates include it to avoid duplication.
- Translations for **60 languages** (domain `nowo_select_all_choice`, key `form.select_all`): en, es, ar, bg, bn, ca, cs, da, de, el, et, fa, fi, fr, he, hi, hr, hu, hy, id, is, it, ja, ka, km, ko, lt, lv, mk, ms, mt, ne, nl, no, pl, pt, pt_BR, ro, ru, sk, sl, sq, sr, sv, sw, ta, te, th, tr, uk, ur, vi, zh_CN, zh_TW, af, am, az, eu, gl, cy.
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
- Opt-in via `select_all => true`; configurable label, position and CSS; translations (EN, ES) in domain `nowo_select_all_choice`.
- Frontend-driven toggle: backend passes config via data attributes; Stimulus controller creates and manages the checkbox in the DOM.
- TypeScript and Vite for bundle assets; consuming app’s Vite build compiles the bundle (no Encore/Importmap).
- Configurable CSS for Bootstrap, Tailwind or custom: `default_wrapper_css_class`, `default_label_css_class` and per-field `select_all_wrapper_css_class`, `select_all_label_css_class` (see [CONFIGURATION](CONFIGURATION.md) and [THEMING](THEMING.md)).
- [THEMING.md](THEMING.md): how to override the form theme (custom HTML) and use Bootstrap/Tailwind/custom classes.
- Demos (Symfony 7 and 8): locale in the URL (`/en`, `/es`), navbar language dropdown, visible EN|ES switch, Web Profiler (dev), and a "Categories" field with Tailwind-style classes; documentation for language switching and styles in demo READMEs.

[Unreleased]: https://github.com/nowo-tech/SelectAllChoiceBundle/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/nowo-tech/SelectAllChoiceBundle/releases/tag/v1.1.0
[1.0.1]: https://github.com/nowo-tech/SelectAllChoiceBundle/releases/tag/v1.0.1
[1.0.0]: https://github.com/nowo-tech/SelectAllChoiceBundle/releases/tag/v1.0.0
