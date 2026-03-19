# Theming and CSS

This document covers how to style the "Select all" toggle (Bootstrap, Tailwind, custom classes) and how to **override the form theme** to change the HTML structure.

## Overriding bundle template files

The bundle registers its Twig views so that `@NowoSelectAllChoiceBundle/...` works, and adds its path **after** the application paths. Your overrides in **`templates/bundles/NowoSelectAllChoiceBundle/`** are therefore checked first: you can override any bundle template by placing a file there with the **same relative path** as inside the bundle.

**Example:** to override the default form theme template, create in your project:

```
templates/
  bundles/
    NowoSelectAllChoiceBundle/
      Form/
        select_all_choice_theme.html.twig
```

Copy the original from `vendor/nowo-tech/select-all-choice-bundle/src/Resources/views/Form/select_all_choice_theme.html.twig` and adjust as needed.

**Templates you can override:**

| Path (relative to bundle `Resources/views/`) | Purpose |
|---------------------------------------------|---------|
| `Form/_select_all_choice_wrapper.html.twig` | Wrapper fragment included by all theme variants (toggle + choices container). |
| `Form/select_all_choice_theme.html.twig` | Default form theme (form_div_layout). |
| `Form/select_all_choice_theme_table.html.twig` | Table layout theme. |
| `Form/select_all_choice_theme_bootstrap5.html.twig` | Bootstrap 5 theme. |
| `Form/select_all_choice_theme_bootstrap5_horizontal.html.twig` | Bootstrap 5 horizontal. |
| `Form/select_all_choice_theme_bootstrap4.html.twig` | Bootstrap 4 theme. |
| `Form/select_all_choice_theme_bootstrap4_horizontal.html.twig` | Bootstrap 4 horizontal. |
| `Form/select_all_choice_theme_bootstrap3.html.twig` | Bootstrap 3 theme. |
| `Form/select_all_choice_theme_bootstrap3_horizontal.html.twig` | Bootstrap 3 horizontal. |
| `Form/select_all_choice_theme_foundation5.html.twig` | Foundation 5 theme. |
| `Form/select_all_choice_theme_foundation6.html.twig` | Foundation 6 theme. |
| `Form/select_all_choice_theme_tailwind2.html.twig` | Tailwind 2 theme. |

After adding or changing overrides, clear the Twig cache if needed: `php bin/console cache:clear`.

## CSS classes (config and per field)

The bundle outputs configurable CSS classes for:

| Element | Config default | Description |
|---------|----------------|-------------|
| **Toggle** (checkbox) | `default_toggle_css_class` → `form-check-input` | The "Select all" input |
| **Wrapper** | `default_wrapper_css_class` → `form-check` | Div wrapping toggle + label |
| **Label** | `default_label_css_class` → `form-check-label` | The "Select all" label |
| **Container** | `default_container_css_class` → `form-check mb-2` | Outer div (toggle block + choices) |

You can set them globally in `config/packages/nowo_select_all_choice.yaml` or per field with `select_all_css_class`, `select_all_wrapper_css_class`, `select_all_label_css_class`, `select_all_container_css_class`. See [CONFIGURATION.md](CONFIGURATION.md#theme--css-framework-presets) and [USAGE.md](USAGE.md#per-field-css-classes-bootstrap-tailwind-custom).

## Overriding the form theme

If you need to **change the HTML** (e.g. different wrapper tags, extra attributes, or a completely custom structure), you can **override the bundle’s Twig blocks** in your application.

### 1. Add your form theme

In `config/packages/twig.yaml`, list your theme **after** the bundle theme so your blocks take precedence:

```yaml
twig:
  form_themes:
    - '@NowoSelectAllChoiceBundle/Form/select_all_choice_theme.html.twig'
    - 'form/select_all_choice_theme.html.twig'   # your override
```

### 2. Override the blocks

Create `templates/form/select_all_choice_theme.html.twig` (or the path you used above). Reuse the bundle’s layout and only override what you need.

**Example: same structure, extra CSS class on the container**

```twig
{% use "form_div_layout.html.twig" with choice_widget_expanded as form_layout_choice_widget_expanded, choice_widget_collapsed as form_layout_choice_widget_collapsed %}

{% block choice_widget_expanded %}
    {% if form.vars.select_all_enabled is defined and form.vars.select_all_enabled %}
        <div class="{{ form.vars.select_all_container_css_class }} my-custom-block"
             data-controller="select-all"
             data-select-all-position-value="{{ form.vars.select_all_position }}"
             data-select-all-expanded-value="true"
             data-select-all-label-value="{{ form.vars.select_all_label|trans({}, form.vars.select_all_translation_domain)|e('html_attr') }}"
             data-select-all-toggle-class-value="{{ form.vars.select_all_css_class }}"
             data-select-all-wrapper-class-value="{{ form.vars.select_all_wrapper_css_class }}"
             data-select-all-label-class-value="{{ form.vars.select_all_label_css_class }}">
            <div data-select-all-target="choices">
                {{ block('form_layout_choice_widget_expanded') }}
            </div>
        </div>
    {% else %}
        {{ block('form_layout_choice_widget_expanded') }}
    {% endif %}
{% endblock %}

{% block choice_widget_collapsed %}
    {% if form.vars.select_all_enabled is defined and form.vars.select_all_enabled %}
        <div class="{{ form.vars.select_all_container_css_class }} my-custom-block"
             data-controller="select-all"
             data-select-all-position-value="{{ form.vars.select_all_position }}"
             data-select-all-expanded-value="false"
             data-select-all-label-value="{{ form.vars.select_all_label|trans({}, form.vars.select_all_translation_domain)|e('html_attr') }}"
             data-select-all-toggle-class-value="{{ form.vars.select_all_css_class }}"
             data-select-all-wrapper-class-value="{{ form.vars.select_all_wrapper_css_class }}"
             data-select-all-label-class-value="{{ form.vars.select_all_label_css_class }}">
            <div data-select-all-target="choices">
                {{ block('form_layout_choice_widget_collapsed') }}
            </div>
        </div>
    {% else %}
        {{ block('form_layout_choice_widget_collapsed') }}
    {% endif %}
{% endblock %}
```

**Important:** The Stimulus controller expects:

- A single element with `data-controller="select-all"` and the same `data-select-all-*-value` attributes (position, expanded, label, toggle class, wrapper class, label class).
- A child with `data-select-all-target="choices"` that wraps the original widget (from `form_layout_choice_widget_expanded` or `form_layout_choice_widget_collapsed`).

If you change the structure, keep these so the controller still finds the container and the choices target.

### 3. Fully custom markup

You can replace the block content entirely as long as you keep:

1. One root element with `data-controller="select-all"` and the same data attributes.
2. A child with `data-select-all-target="choices"` containing the output of `{{ block('form_layout_choice_widget_expanded') }}` or `{{ block('form_layout_choice_widget_collapsed') }}`.

The controller creates the toggle (checkbox + label) in JavaScript and inserts it before or after the choices target; it does not rely on specific Twig-rendered elements for the toggle itself.

## Summary

- **Only change classes:** use config or per-field options; no theme override needed.
- **Change HTML structure or attributes:** override `choice_widget_expanded` and/or `choice_widget_collapsed` in your form theme and keep `data-controller="select-all"` and `data-select-all-target="choices"` so the Stimulus controller keeps working.
