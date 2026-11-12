<?php

declare(strict_types=1);

namespace App\Form;

use Nowo\FormKitBundle\Attribute\FormKitConfig;
use Nowo\FormKitBundle\Form\FormOptionsTrait;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;

/**
 * REQ-DEMO-015: a FormKit form (profile `demo`); the bundle's `select_all` option goes through FormKit's
 * addChoiceCheckboxes() (expanded) and addMultiSelectSelectAll() (collapsed).
 *
 * @extends AbstractType<array<string, mixed>>
 */
#[FormKitConfig('demo')]
final class DemoFormType extends AbstractType
{
    use FormOptionsTrait;

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $this->addChoiceCheckboxes($builder, 'roles', [
            'label'   => 'demo.roles_label',
            'help'    => false,
            'choices' => [
                'Admin' => 'ROLE_ADMIN',
                'User'  => 'ROLE_USER',
                'Guest' => 'ROLE_GUEST',
            ],
            'select_all'          => true,
            'select_all_position' => 'before',
        ]);
        $this->addMultiSelectSelectAll($builder, 'tags', [
            'label'       => 'demo.tags_label',
            'help'        => false,
            'placeholder' => false,
            'choices'     => [
                'PHP'        => 'php',
                'JavaScript' => 'js',
                'Symfony'    => 'symfony',
            ],
            'select_all_position' => 'before',
        ]);
        $this->addChoiceCheckboxes($builder, 'categories', [
            'label'   => 'demo.categories_label',
            'help'    => false,
            'choices' => [
                'Tech'   => 'tech',
                'Sports' => 'sports',
                'News'   => 'news',
            ],
            'select_all'          => true,
            'select_all_position' => 'before',
            // per-field classes (UiKit's own check classes, so the toggle looks like the other checkboxes)
            'select_all_css_class'           => 'nowo-ui-check__input',
            'select_all_wrapper_css_class'   => 'nowo-ui-check',
            'select_all_label_css_class'     => 'nowo-ui-check__label',
            'select_all_container_css_class' => 'nowo-ui-card',
        ]);
        $this->addWithDefaults($builder, 'submit', SubmitType::class, [
            'label'              => 'demo.submit',
            'translation_domain' => 'messages',
            'attr'               => ['class' => 'nowo-ui-btn nowo-ui-btn--primary'],
        ]);
    }
}
