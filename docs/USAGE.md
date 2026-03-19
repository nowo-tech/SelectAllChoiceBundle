# Usage

Enable the "Select all" toggle on a multiple choice field by setting `select_all => true`. You can override the label, position and CSS per field.


## Table of contents

- [Including the frontend script](#including-the-frontend-script)
- [Basic example (expanded checkboxes)](#basic-example-expanded-checkboxes)
- [Multi-select (collapsed)](#multi-select-collapsed)
- [Per-field options](#per-field-options)
  - [Per-field CSS classes (Bootstrap, Tailwind, custom)](#per-field-css-classes-bootstrap-tailwind-custom)
- [Full FormType example](#full-formtype-example)
- [Overriding templates and translations](#overriding-templates-and-translations)
  - [Overriding translations](#overriding-translations)
  - [Overriding templates](#overriding-templates)
- [Behaviour](#behaviour)

## Including the frontend script

You can use the bundle in two ways:

**1. Standalone script (no Stimulus required)** — Include the built script so all `[data-controller*="select-all"]` elements are auto-initialized on load and when new content is added (e.g. Turbo frames). Use the Twig function to get the asset path:

```twig
<script src="{{ asset(nowo_select_all_choice_asset_path('select-all-choice.js')) }}" defer></script>
```

After `php bin/console assets:install`, the file is at `public/bundles/nowoselectallchoice/select-all-choice.js`. The script runs `runInitAndObserve()` on DOM ready and sets up a `MutationObserver` for dynamically added elements.

**2. With Stimulus** — If your app already uses Stimulus, import the bundle’s controller and register it: `application.register('select-all', SelectAllController)`. You do not need to load the standalone script if your app bundle includes the controller; the controller calls the same init logic when elements connect.

In both cases the backend renders the same markup (`data-controller="select-all"` and data attributes). The standalone script and the Stimulus controller share the same logic and avoid double-init via a `data-select-all-init` marker.

## Basic example (expanded checkboxes)

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

## Multi-select (collapsed)

```php
$builder->add('tags', ChoiceType::class, [
    'choices' => [
        'PHP' => 'php',
        'JS'  => 'js',
        'Symfony' => 'symfony',
    ],
    'multiple' => true,
    'expanded' => false,
    'select_all' => true,
]);
```

## Per-field options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `select_all` | bool | `false` | Enable the "Select all" toggle. |
| `select_all_label` | string\|null | bundle config | Translation key for the toggle label. |
| `select_all_position` | `'before' \| 'after'` | bundle config | Position of the toggle. |
| `select_all_css_class` | string | bundle config | CSS class for the toggle checkbox input. |
| `select_all_wrapper_css_class` | string | bundle config | CSS class for the wrapper (toggle + label). |
| `select_all_label_css_class` | string | bundle config | CSS class for the toggle label. |
| `select_all_container_css_class` | string | bundle config | CSS class for the outer wrapper (toggle + choices). |
| `select_all_translation_domain` | string\|null | bundle config | Translation domain for the label. |

### Per-field CSS classes (Bootstrap, Tailwind, custom)

Override any of the CSS options per field to match your framework or design:

**Bootstrap (default):** no overrides needed.

**Tailwind on one field:**

```php
$builder->add('tags', ChoiceType::class, [
    'choices' => [...],
    'multiple' => true,
    'expanded' => true,
    'select_all' => true,
    'select_all_css_class'            => 'rounded border-gray-300 text-primary-600',
    'select_all_wrapper_css_class'     => 'flex items-center gap-2',
    'select_all_label_css_class'      => 'text-sm font-medium text-gray-700 cursor-pointer',
    'select_all_container_css_class'  => 'mb-4',
]);
```

**Custom classes:**

```php
'select_all_css_class'            => 'my-toggle',
'select_all_wrapper_css_class'     => 'my-toggle-row',
'select_all_label_css_class'      => 'my-toggle-label',
'select_all_container_css_class'  => 'my-select-all-block',
```

## Full FormType example

```php
namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\FormBuilderInterface;

class ExampleFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder->add('categories', ChoiceType::class, [
            'choices' => [
                'Tech' => 'tech',
                'Sports' => 'sports',
                'News' => 'news',
            ],
            'multiple' => true,
            'expanded' => true,
            'select_all' => true,
            'select_all_position' => 'before',
            'select_all_label' => 'my_form.select_all_categories',
            'select_all_translation_domain' => 'messages',
        ]);
    }
}
```

## Overriding templates and translations

### Overriding translations

The bundle uses the translation domain **`NowoSelectAllChoiceBundle`** and the default label key **`form.select_all`**. To override the "Select all" label (or any other message) in your application:

1. Create a translation file in your project’s **`translations/`** directory with the **same domain** and locale, e.g. `translations/NowoSelectAllChoiceBundle.es.yaml`.
2. Define only the keys you want to override. Symfony will use the bundle’s messages for any key you do not define.

**Example** — override the label in Spanish:

```yaml
# translations/NowoSelectAllChoiceBundle.es.yaml
form:
  select_all: "Seleccionar todo"
```

To use a different domain (e.g. your app’s `messages`), set **`translation_domain`** in `config/packages/nowo_select_all_choice.yaml` or **`select_all_translation_domain`** per field (see [CONFIGURATION.md](CONFIGURATION.md#translations)).

### Overriding templates

You can customize the HTML (structure, wrappers, attributes) in two ways:

**1. Override bundle template files** — Place a file in your project at **`templates/bundles/NowoSelectAllChoiceBundle/`** with the **same relative path** as inside the bundle. The app’s templates are checked first, so your file replaces the bundle’s. For example, to override the wrapper fragment:

- Create: `templates/bundles/NowoSelectAllChoiceBundle/Form/_select_all_choice_wrapper.html.twig`
- Copy the original from `vendor/nowo-tech/select-all-choice-bundle/src/Resources/views/Form/_select_all_choice_wrapper.html.twig` and edit as needed.

After changing overrides, run `php bin/console cache:clear` if needed. A full list of overridable templates is in [THEMING.md — Overriding bundle template files](THEMING.md#overriding-bundle-template-files).

**2. Override form theme blocks** — In your form theme, override the blocks `choice_widget_expanded` and/or `choice_widget_collapsed` so your markup wraps the choices. Keep a single element with `data-controller="select-all"` and the same `data-select-all-*-value` attributes, and a child with `data-select-all-target="choices"` that wraps the original widget. See [THEMING.md — Overriding the form theme](THEMING.md#overriding-the-form-theme) for a full example.

## Behaviour

- The toggle selects or deselects all options when clicked.
- If the user selects or deselects options manually, the toggle state is updated (checked / unchecked / indeterminate).
- A `change` event is dispatched with `bubbles: true` so other scripts (e.g. TomSelect, validators) can react.
- For multi-select fields, the backend normalizes submitted data by dropping `null` entries before Symfony’s core `ChoiceType` processes it, preventing low-level warnings about non-scalar values in `array_flip()`; this is transparent for consumers.

## Debug (frontend)

The bundle’s Stimulus controller uses a shared logger. By default only a single “script loaded” message is shown in the console. To enable all debug logs (connect, toggleAll, etc.), add the data attribute **`data-select-all-debug-value="1"`** to the element that has `data-controller="select-all"`. For example, in a custom form theme:

```html
<div data-controller="select-all"
     data-select-all-debug-value="1"
     data-select-all-position-value="before"
     ...>
```

Use this only in development; leave it unset or remove it in production to avoid noisy console output.
