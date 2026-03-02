<?php

declare(strict_types=1);

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\FormBuilderInterface;

class DemoFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('roles', ChoiceType::class, [
                'label'   => 'demo.roles_label',
                'choices' => [
                    'Admin' => 'ROLE_ADMIN',
                    'User'  => 'ROLE_USER',
                    'Guest' => 'ROLE_GUEST',
                ],
                'multiple'            => true,
                'expanded'            => true,
                'select_all'          => true,
                'select_all_position' => 'before',
            ])
            ->add('tags', ChoiceType::class, [
                'label'   => 'demo.tags_label',
                'choices' => [
                    'PHP'        => 'php',
                    'JavaScript' => 'js',
                    'Symfony'    => 'symfony',
                ],
                'multiple'            => true,
                'expanded'            => false,
                'select_all'          => true,
                'select_all_position' => 'before',
            ])
            ->add('categories', ChoiceType::class, [
                'label'   => 'demo.categories_label',
                'choices' => [
                    'Tech'   => 'tech',
                    'Sports' => 'sports',
                    'News'   => 'news',
                ],
                'multiple'   => true,
                'expanded'   => true,
                'select_all' => true,
                'select_all_position'             => 'before',
                'select_all_css_class'            => 'rounded border-gray-300 text-primary-600 focus:ring-primary-500',
                'select_all_wrapper_css_class'    => 'flex items-center gap-2',
                'select_all_label_css_class'     => 'text-sm font-medium text-gray-700 cursor-pointer',
                'select_all_container_css_class'  => 'mb-4 p-3 border rounded bg-light',
            ]);
    }
}
