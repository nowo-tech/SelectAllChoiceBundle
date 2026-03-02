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

If you use Symfony Flex and the bundle is on Packagist with a recipe in [symfony/recipes-contrib](https://github.com/symfony/recipes-contrib), the recipe will register the bundle and optionally add config. Otherwise, register manually as below.

### Manual registration

1. **Register the bundle** in `config/bundles.php`:

```php
<?php

return [
    // ...
    Nowo\SelectAllChoiceBundle\NowoSelectAllChoiceBundle::class => ['all' => true],
];
```

2. **Activate the form theme** in `config/packages/twig.yaml`:

```yaml
twig:
  form_themes:
    - '@NowoSelectAllChoice/Form/select_all_choice_theme.html.twig'
```

3. **Integrate assets with Vite**: add an alias in your `vite.config.ts` (or `vite.config.js`) to the bundle’s `assets` directory and import the bundle entry in your main entry (see [README](../README.md#4-integrate-assets-with-vite) for the exact steps).

4. **Optional configuration**: create `config/packages/nowo_select_all_choice.yaml` to override defaults (see [CONFIGURATION.md](CONFIGURATION.md)).

## Next steps

- [Configuration](CONFIGURATION.md)
- [Usage](USAGE.md)
