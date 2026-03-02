# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- (Nothing yet.)

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

[Unreleased]: https://github.com/nowo-tech/select-all-choice-bundle/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/nowo-tech/select-all-choice-bundle/releases/tag/v1.0.1
[1.0.0]: https://github.com/nowo-tech/select-all-choice-bundle/releases/tag/v1.0.0
