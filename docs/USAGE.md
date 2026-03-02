# Usage

Enable the "Select all" toggle on a multiple choice field by setting `select_all => true`. You can override the label, position and CSS per field.

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

## Overriding the template

To fully customize the HTML (e.g. change structure or add wrappers), override the bundle’s form theme blocks in your app. See [THEMING.md](THEMING.md#overriding-the-form-theme) for how to override `choice_widget_expanded` and `choice_widget_collapsed`.

## Behaviour

- The toggle selects or deselects all options when clicked.
- If the user selects or deselects options manually, the toggle state is updated (checked / unchecked / indeterminate).
- A `change` event is dispatched with `bubbles: true` so other scripts (e.g. TomSelect, validators) can react.
