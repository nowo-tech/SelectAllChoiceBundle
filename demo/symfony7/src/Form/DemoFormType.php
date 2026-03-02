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
            ]);
    }
}
