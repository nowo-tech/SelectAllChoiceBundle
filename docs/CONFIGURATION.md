# Configuration

SelectAllChoiceBundle can be configured globally in `config/packages/nowo_select_all_choice.yaml`. All keys are optional; defaults are applied when omitted.

## Full example

```yaml
nowo_select_all_choice:
  default_label: 'form.select_all'
  default_position: 'before'           # 'before' | 'after'
  default_toggle_css_class: 'form-check-input'
  default_wrapper_css_class: 'form-check'
  default_label_css_class: 'form-check-label'
  default_container_css_class: 'form-check mb-2'
  translation_domain: 'nowo_select_all_choice'
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `default_label` | string | `form.select_all` | Default translation key for the "Select all" toggle label. |
| `default_position` | string | `before` | Position of the toggle relative to the choices: `before` or `after`. |
| `default_toggle_css_class` | string | `form-check-input` | CSS class applied to the toggle checkbox input. |
| `default_wrapper_css_class` | string | `form-check` | CSS class for the wrapper div that contains the toggle and its label. |
| `default_label_css_class` | string | `form-check-label` | CSS class applied to the "Select all" label. |
| `default_container_css_class` | string | `form-check mb-2` | CSS class applied to the outer wrapper div (toggle + choices). |
| `translation_domain` | string | `nowo_select_all_choice` | Default translation domain for the toggle label. |

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
