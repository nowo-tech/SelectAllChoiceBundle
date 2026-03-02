# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- (Nothing yet.)

## [1.0.0] - 2025-03-02

### Added

- Initial release: Form type extension, Twig form theme and Stimulus controller for "Select all" on `ChoiceType` with `multiple=true` (expanded and collapsed).
- Opt-in via `select_all => true`; configurable label, position and CSS; translations (EN, ES) in domain `nowo_select_all_choice`.
- Frontend-driven toggle: backend passes config via data attributes; Stimulus controller creates and manages the checkbox in the DOM.
- TypeScript and Vite for bundle assets; consuming app’s Vite build compiles the bundle (no Encore/Importmap).
- Demos (Symfony 7 and 8) with locale in the URL (`/en`, `/es`), navbar language dropdown and visible EN|ES switch on the demo page; documentation for language switching in demo READMEs.

[Unreleased]: https://github.com/nowo-tech/select-all-choice-bundle/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/nowo-tech/select-all-choice-bundle/releases/tag/v1.0.0
