# Select All Choice Bundle

[![CI](https://github.com/nowo-tech/SelectAllChoiceBundle/actions/workflows/ci.yml/badge.svg)](https://github.com/nowo-tech/SelectAllChoiceBundle/actions/workflows/ci.yml) [![Packagist Version](https://img.shields.io/packagist/v/nowo-tech/select-all-choice-bundle.svg?style=flat)](https://packagist.org/packages/nowo-tech/select-all-choice-bundle) [![Packagist Downloads](https://img.shields.io/packagist/dt/nowo-tech/select-all-choice-bundle.svg)](https://packagist.org/packages/nowo-tech/select-all-choice-bundle) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![PHP](https://img.shields.io/badge/PHP-8.2%2B-777BB4?logo=php)](https://php.net) [![Symfony](https://img.shields.io/badge/Symfony-7%20%7C%208-000000?logo=symfony)](https://symfony.com) [![GitHub stars](https://img.shields.io/github/stars/nowo-tech/select-all-choice-bundle.svg?style=social&label=Star)](https://github.com/nowo-tech/SelectAllChoiceBundle) [![Coverage](https://img.shields.io/badge/Coverage-97.83%25-brightgreen)](#tests-and-coverage)

**Symfony bundle that adds an optional "Select all" checkbox for `ChoiceType` fields with `multiple=true`** — for both expanded (checkboxes) and collapsed (`<select multiple>`) rendering. **Frontend-driven**: the backend marks the field and passes config via data attributes; a **Stimulus** controller creates and manages the toggle in the browser. Built with **TypeScript** and **Vite** (no Webpack Encore, no Importmap). For **Symfony 7 and 8** · PHP 8.2+.

> ⭐ **Found this useful?** Give it a **star** on [GitHub](https://github.com/nowo-tech/SelectAllChoiceBundle) so more developers can find it.

## Table of contents

- [Quick search terms](#quick-search-terms)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Documentation](#documentation)
- [Requirements](#requirements)
- [Demo](#demo)
- [Development](#development)
- [License & author](#license--author)

## Quick search terms

Looking for **Symfony ChoiceType select all**, **multiple choice select all checkbox**, **Stimulus form select all**, **Symfony form expanded choice**, **multi-select select all**, **ChoiceType Stimulus**, **Symfony 7 8 select all**? You're in the right place.

## Features

- ✅ **Opt-in** — "Select all" appears only when the field has `select_all => true`
- ✅ **Two modes** — Works with `expanded=true` (checkboxes) and `expanded=false` (multi-select)
- ✅ **Translatable label** — Default key `form.select_all`, overridable with `select_all_label`; 60 languages included
- ✅ **Configurable** — Position (before/after), CSS classes for toggle and container
- ✅ **Sync state** — Toggle reflects "all selected" / "none" / indeterminate; manual selection updates the toggle
- ✅ **Events** — Dispatches `change` with `bubbles: true` so other libs (TomSelect, validators) can react
- ✅ **Multiple fields** — Safe with several select-all choice fields on the same page
- ✅ **Frontend-driven** — Backend passes config via data attributes; a small script or Stimulus controller creates and manages the checkbox in the DOM
- ✅ **Works with or without Stimulus** — Include the built `select-all-choice.js` script for auto-init (and dynamic content via MutationObserver), or register the Stimulus controller if your app already uses it
- ✅ **TypeScript + Vite** — Bundle assets are TypeScript; the bundle ships a built IIFE for standalone use; your app’s Vite can also import the controller (no Encore/Importmap)
- ✅ Compatible with **Symfony 7 and 8** and **FrankenPHP** (with or without worker mode; the repo demos use a non-worker `php_server` setup for comfortable dev)

## Installation

```bash
composer require nowo-tech/select-all-choice-bundle
```

**1. Register the bundle** in `config/bundles.php`:

```php
<?php

return [
  // ...
  Nowo\SelectAllChoiceBundle\NowoSelectAllChoiceBundle::class => ['all' => true],
];
```

**2. Form theme**: The bundle **automatically** adds its form theme from the `form_theme` option (see Configuration). Set `form_theme` in `config/packages/nowo_select_all_choice.yaml` to match your app (e.g. `bootstrap_5_layout.html.twig`). You do not need to add it to `twig.form_themes` unless you want to control the order.

**3. Include the frontend script** — Either include the built script (no Stimulus required) using the Twig function `nowo_select_all_choice_asset_path('select-all-choice.js')` in your layout (see [docs/USAGE.md](docs/USAGE.md#including-the-frontend-script)), or integrate the Stimulus controller via Vite (see [docs/INSTALLATION.md](docs/INSTALLATION.md)).

**4. (Optional) Translations** — Default domain `NowoSelectAllChoiceBundle` with 60 languages; override via config or per-field options (see [docs/CONFIGURATION.md](docs/CONFIGURATION.md#translations)).

Full steps (path repository, Vite alias, Option B copy assets): [docs/INSTALLATION.md](docs/INSTALLATION.md).

## Configuration

Create `config/packages/nowo_select_all_choice.yaml` to override defaults:

```yaml
nowo_select_all_choice:
 form_theme: 'form_div_layout.html.twig'  # or 'bootstrap_5_layout.html.twig', etc.
 default_label: 'form.select_all'
 default_position: 'before'         # 'before' | 'after'
 default_toggle_css_class: 'form-check-input'
 default_wrapper_css_class: 'form-check'
 default_label_css_class: 'form-check-label'
 default_container_css_class: 'form-check mb-2'
 translation_domain: 'NowoSelectAllChoiceBundle'
 debug: false                # set true to log Stimulus/controller messages to the browser console
```

Set `form_theme` to match your app’s form layout (e.g. `bootstrap_5_layout.html.twig`). See [docs/CONFIGURATION.md](docs/CONFIGURATION.md) for all options and available Symfony form themes.

## Usage

Enable "Select all" on a multiple choice field with the `select_all` option:

```php
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;

$builder->add('roles', ChoiceType::class, [
  'choices' => [
    'Admin' => 'ROLE_ADMIN',
    'User' => 'ROLE_USER',
    'Guest' => 'ROLE_GUEST',
  ],
  'multiple' => true,
  'expanded' => true,
  'select_all' => true,
]);
```

Override label, position and CSS per field; see [docs/USAGE.md](docs/USAGE.md) for all per-field options and examples.

## Documentation

- [Installation](docs/INSTALLATION.md)
- [Configuration](docs/CONFIGURATION.md)
- [Usage](docs/USAGE.md)
- [Contributing](docs/CONTRIBUTING.md)
- [Changelog](docs/CHANGELOG.md)
- [Upgrading](docs/UPGRADING.md)
- [Release](docs/RELEASE.md)
- [Security](docs/SECURITY.md)
- [Engram](docs/ENGRAM.md)

### Additional documentation

- [Theming](docs/THEMING.md) — CSS classes, overriding the form theme (custom HTML), and [overriding bundle template files](docs/THEMING.md#overriding-bundle-template-files)
- [Overriding translations](docs/CONFIGURATION.md#translations) — use your app’s `translations/` with the same domain and locale to override bundle messages
- [Demo with FrankenPHP (development and production)](docs/DEMO-FRANKENPHP.md) — development vs production setup, Web Profiler, Twig Inspector; reusable for other bundles

## Requirements

- PHP >= 8.2
- **Symfony 7 or 8** (^7.0 \|\| ^8.0)
- **Stimulus** optional — use the built `select-all-choice.js` script for standalone auto-init, or Stimulus (e.g. `symfony/stimulus-bundle`) if you register the controller in your app bundle
- **Vite** to build the bundle’s assets (or use the pre-built script from the bundle’s public dir)

See [docs/INSTALLATION.md](docs/INSTALLATION.md#requirements) for details.

## Demo

Demos for Symfony 7 and 8 are in `demo/symfony7`, `demo/symfony8`. Run from the bundle root: `make up-symfony7` (http://localhost:8007) or `make up-symfony8` (http://localhost:8008). See [demo/README.md](demo/README.md) for details.

The demos use **FrankenPHP** with a **single `docker/frankenphp/Caddyfile`** and **`php_server` without workers** so template and asset changes show up on refresh (see [docs/DEMO-FRANKENPHP.md](docs/DEMO-FRANKENPHP.md)). You can deploy with **worker mode** in production if you follow the production section of that doc; the bundle itself works with or without FrankenPHP workers.

## Development

Run tests and QA with Docker: `make up && make install && make test` (or `make test-coverage`, `make qa`). Without Docker: `composer install && composer test`. See [Makefile](Makefile) for all targets.

## Tests and coverage

- Tests: PHPUnit (PHP), Vitest (TS/JS)
- PHP: 97.83%
- TS/JS: 100%

## License

The MIT License (MIT). Please see [LICENSE](LICENSE) for more information.

## Author

Created by [Nowo.tech](https://nowo.tech)
