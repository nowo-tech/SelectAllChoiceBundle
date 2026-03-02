# Configuration

SelectAllChoiceBundle can be configured globally in `config/packages/nowo_select_all_choice.yaml`. All keys are optional; defaults are applied when omitted.

## Full example

```yaml
nowo_select_all_choice:
  default_label: 'form.select_all'
  default_position: 'before'           # 'before' | 'after'
  default_toggle_css_class: 'form-check-input'
  default_container_css_class: 'form-check mb-2'
  translation_domain: 'nowo_select_all_choice'
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `default_label` | string | `form.select_all` | Default translation key for the "Select all" toggle label. |
| `default_position` | string | `before` | Position of the toggle relative to the choices: `before` or `after`. |
| `default_toggle_css_class` | string | `form-check-input` | CSS class applied to the toggle checkbox input. |
| `default_container_css_class` | string | `form-check mb-2` | CSS class applied to the outer wrapper div (toggle + choices). |
| `translation_domain` | string | `nowo_select_all_choice` | Default translation domain for the toggle label. |

Each choice field can override these via its own options (e.g. `select_all_label`, `select_all_position`). See [USAGE.md](USAGE.md).
