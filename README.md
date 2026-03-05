# Select All Choice Bundle

[![CI](https://github.com/nowo-tech/SelectAllChoiceBundle/actions/workflows/ci.yml/badge.svg)](https://github.com/nowo-tech/SelectAllChoiceBundle/actions/workflows/ci.yml) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![PHP](https://img.shields.io/badge/PHP-8.2%2B-777BB4?logo=php)](https://php.net) [![Symfony](https://img.shields.io/badge/Symfony-7%20%7C%208-000000?logo=symfony)](https://symfony.com) [![GitHub stars](https://img.shields.io/github/stars/nowo-tech/select-all-choice-bundle.svg?style=social&label=Star)](https://github.com/nowo-tech/SelectAllChoiceBundle)

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
- ✅ **Frontend-driven** — Backend passes config via data attributes; Stimulus controller creates and manages the checkbox in the DOM
- ✅ **TypeScript + Vite** — Bundle assets are TypeScript; your app’s Vite build compiles them (no Encore/Importmap)
- ✅ Compatible with **Symfony 7 and 8** and **FrankenPHP** (including worker mode)

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

**3. Integrate assets with Vite** — add an alias to the bundle’s `assets` directory in your `vite.config.ts` and import the bundle entry in your main JS/TS (see [docs/INSTALLATION.md](docs/INSTALLATION.md)).

**4. (Optional) Translations** — Default domain `nowo_select_all_choice` with 60 languages; override via config or per-field options.

Full steps (path repository, Vite alias, Option B copy assets): [docs/INSTALLATION.md](docs/INSTALLATION.md).

## Configuration

Create `config/packages/nowo_select_all_choice.yaml` to override defaults:

```yaml
nowo_select_all_choice:
  form_theme: 'form_div_layout.html.twig'   # or 'bootstrap_5_layout.html.twig', etc.
  default_label: 'form.select_all'
  default_position: 'before'                 # 'before' | 'after'
  default_toggle_css_class: 'form-check-input'
  default_container_css_class: 'form-check mb-2'
  translation_domain: 'nowo_select_all_choice'
```

Set `form_theme` to match your app’s form layout (e.g. `bootstrap_5_layout.html.twig`). See [docs/CONFIGURATION.md](docs/CONFIGURATION.md) for all options and available Symfony form themes.

## Usage

Enable "Select all" on a multiple choice field with the `select_all` option:

```php
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;

$builder->add('roles', ChoiceType::class, [
    'choices' => [
        'Admin' => 'ROLE_ADMIN',
        'User'  => 'ROLE_USER',
        'Guest' => 'ROLE_GUEST',
    ],
    'multiple' => true,
    'expanded' => true,
    'select_all' => true,
]);
```

Override label, position and CSS per field; see [docs/USAGE.md](docs/USAGE.md) for all per-field options and examples.

## Documentation

- [**Installation**](docs/INSTALLATION.md)
- [**Configuration**](docs/CONFIGURATION.md)
- [**Usage**](docs/USAGE.md)
- [**Contributing**](docs/CONTRIBUTING.md)
- [**Changelog**](docs/CHANGELOG.md)
- [**Upgrading**](docs/UPGRADING.md)
- [**Release**](docs/RELEASE.md)
- [**Security**](docs/SECURITY.md)

### Additional documentation

- [**Theming**](docs/THEMING.md) — CSS classes, overriding the form theme (custom HTML)

## Requirements

- PHP >= 8.2
- **Symfony 7 or 8** (^7.0 \|\| ^8.0)
- Stimulus (e.g. via `symfony/stimulus-bundle` or `@hotwired/stimulus`)
- **Vite** to build frontend assets (bundle ships TypeScript; your app’s Vite compiles it)

See [docs/INSTALLATION.md](docs/INSTALLATION.md#requirements) for details.

## Demo

Demos for Symfony 7 and 8 are in `demo/symfony7`, `demo/symfony8`. Run from the bundle root: `make up-symfony7` (http://localhost:8007) or `make up-symfony8` (http://localhost:8008). See [demo/README.md](demo/README.md) for details. Demos run with FrankenPHP in worker mode; the bundle is compatible with FrankenPHP.

## Development

Run tests and QA with Docker: `make up && make install && make test` (or `make test-coverage`, `make qa`). Without Docker: `composer install && composer test`. See [Makefile](Makefile) for all targets.

## License

The MIT License (MIT). Please see [LICENSE](LICENSE) for more information.

## Author

Created by [Nowo.tech](https://nowo.tech)
