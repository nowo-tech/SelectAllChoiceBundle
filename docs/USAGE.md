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
| `select_all_css_class` | string | bundle config | CSS class for the toggle input. |
| `select_all_container_css_class` | string | bundle config | CSS class for the toggle wrapper. |
| `select_all_translation_domain` | string\|null | bundle config | Translation domain for the label. |

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

## Behaviour

- The toggle selects or deselects all options when clicked.
- If the user selects or deselects options manually, the toggle state is updated (checked / unchecked / indeterminate).
- A `change` event is dispatched with `bubbles: true` so other scripts (e.g. TomSelect, validators) can react.
