# Configuration

SelectAllChoiceBundle can be configured globally in `config/packages/nowo_select_all_choice.yaml`. All keys are optional; defaults are applied when omitted.

## Full example

```yaml
nowo_select_all_choice:
  form_theme: 'form_div_layout.html.twig'   # or bootstrap_5_layout.html.twig, etc.
  default_label: 'form.select_all'
  default_position: 'before'                 # 'before' | 'after'
  default_toggle_css_class: 'form-check-input'
  default_wrapper_css_class: 'form-check'
  default_label_css_class: 'form-check-label'
  default_container_css_class: 'form-check mb-2'
  translation_domain: 'nowo_select_all_choice'
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `form_theme` | string | `form_div_layout.html.twig` | Base form layout used for choice widgets. See [Form theme (Symfony layouts)](#form-theme-symfony-layouts) below. |
| `default_label` | string | `form.select_all` | Default translation key for the "Select all" toggle label. |
| `default_position` | string | `before` | Position of the toggle relative to the choices: `before` or `after`. |
| `default_toggle_css_class` | string | `form-check-input` | CSS class applied to the toggle checkbox input. |
| `default_wrapper_css_class` | string | `form-check` | CSS class for the wrapper div that contains the toggle and its label. |
| `default_label_css_class` | string | `form-check-label` | CSS class applied to the "Select all" label. |
| `default_container_css_class` | string | `form-check mb-2` | CSS class applied to the outer wrapper div (toggle + choices). |
| `translation_domain` | string | `nowo_select_all_choice` | Default translation domain for the toggle label. |

## Form theme (Symfony layouts)

The bundle’s form theme wraps Symfony’s choice widgets; it must use the same base layout as the rest of your forms. Set `form_theme` in the bundle config. The bundle **automatically prepends** its theme to `twig.form_themes`, so you do not need to add it manually.

### Values with dedicated theme

The bundle includes a dedicated theme for every standard Symfony form layout. Set `form_theme` to the same template name you use in `twig.form_themes`:

| Value | Description |
|--------|-------------|
| `form_div_layout.html.twig` | Symfony default; each field in a `<div>`. |
| `form_table_layout.html.twig` | Fields in `<table>` / `<tr>`. |
| `bootstrap_5_layout.html.twig` | Bootstrap 5. |
| `bootstrap_5_horizontal_layout.html.twig` | Bootstrap 5 horizontal layout. |
| `bootstrap_4_layout.html.twig` | Bootstrap 4. |
| `bootstrap_4_horizontal_layout.html.twig` | Bootstrap 4 horizontal. |
| `bootstrap_3_layout.html.twig` | Bootstrap 3. |
| `bootstrap_3_horizontal_layout.html.twig` | Bootstrap 3 horizontal. |
| `foundation_5_layout.html.twig` | Foundation 5. |
| `foundation_6_layout.html.twig` | Foundation 6. |
| `tailwind_2_layout.html.twig` | Tailwind CSS 2. |

If you use a custom or third-party form theme not listed above, set `form_theme` to the closest match (e.g. `form_div_layout.html.twig`); "Select all" still works although the wrapper markup may not match your framework exactly.

### Example with Bootstrap 5

```yaml
# config/packages/nowo_select_all_choice.yaml
nowo_select_all_choice:
  form_theme: 'bootstrap_5_layout.html.twig'
```

```yaml
# config/packages/twig.yaml (your base layout)
twig:
  form_themes:
    - 'bootstrap_5_layout.html.twig'
```

This way “Select all” uses the same base layout as the rest of the form.

Each choice field can override these via its own options (e.g. `select_all_label`, `select_all_css_class`). See [USAGE.md](USAGE.md).

## Theme / CSS framework presets

Defaults are **Bootstrap 5**-style. You can switch to **Tailwind CSS**, **custom** classes, or mix per field.

### Bootstrap (default)

No config change needed; the defaults match Bootstrap’s `.form-check`, `.form-check-input`, `.form-check-label`.

### Tailwind CSS

Set global defaults so the toggle and label use Tailwind classes:

```yaml
nowo_select_all_choice:
  default_toggle_css_class: 'rounded border-gray-300 text-primary-600 focus:ring-primary-500'
  default_wrapper_css_class: 'flex items-center gap-2'
  default_label_css_class: 'text-sm font-medium text-gray-700 cursor-pointer'
  default_container_css_class: 'mb-4'
```

Or override per field (see [USAGE.md](USAGE.md#per-field-css-classes)).

### Custom classes

Use any class names you want for toggle, wrapper, label and container. Ensure your CSS (or utility framework) styles the checkbox and label as needed.
