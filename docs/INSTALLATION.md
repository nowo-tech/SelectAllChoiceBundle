# Installation

This guide covers installing SelectAllChoiceBundle in a Symfony 7 or 8 application.

## Requirements

- **PHP** >= 8.2
- **Symfony** ^7.0 or ^8.0
- **symfony/form**, **symfony/twig-bundle**, **symfony/translation**
- **Stimulus** (e.g. via `symfony/stimulus-bundle` or `@hotwired/stimulus`)
- **Vite** for building frontend assets (the app compiles the bundle’s TypeScript)

## Install with Composer

```bash
composer require nowo-tech/select-all-choice-bundle
```

Use a constraint such as `^1.0` to stay on the current major version.

## Register the bundle

### With Symfony Flex

This bundle ships a **Symfony Flex recipe** in `.symfony/recipe/` (same recipe can be submitted to [symfony/recipes-contrib](https://github.com/symfony/recipes-contrib)). When you install via Composer and the recipe is available (e.g. from recipes-contrib), Flex will register the bundle and copy default config to `config/packages/nowo_select_all_choice.yaml`. Otherwise, register manually as below.

### Manual registration

1. **Register the bundle** in `config/bundles.php`:

```php
<?php

return [
    // ...
    Nowo\SelectAllChoiceBundle\NowoSelectAllChoiceBundle::class => ['all' => true],
];
```

2. **Form theme**: The bundle automatically prepends its form theme to `twig.form_themes` according to the `form_theme` option in `config/packages/nowo_select_all_choice.yaml` (default: `form_div_layout.html.twig`). You do not need to add it manually. To use Bootstrap 5, set `form_theme: 'bootstrap_5_layout.html.twig'` and add your base layout in `config/packages/twig.yaml` if needed:

```yaml
twig:
  form_themes:
    - 'bootstrap_5_layout.html.twig'
```

3. **Integrate assets with Vite**: add an alias in your `vite.config.ts` (or `vite.config.js`) to the bundle’s `assets` directory and import the bundle entry in your main entry (see [README](../README.md#4-integrate-assets-with-vite) for the exact steps).

4. **Optional configuration**: create `config/packages/nowo_select_all_choice.yaml` to override defaults (see [CONFIGURATION.md](CONFIGURATION.md)).

## Next steps

- [Configuration](CONFIGURATION.md)
- [Usage](USAGE.md)
