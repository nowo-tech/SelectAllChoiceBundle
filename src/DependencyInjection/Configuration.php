<?php

declare(strict_types=1);

namespace Nowo\SelectAllChoiceBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

use function array_keys;

/**
 * Configuration for SelectAllChoiceBundle (nowo_select_all_choice).
 *
 * Defines global defaults for the "Select all" feature (label key, position, CSS classes).
 */
final class Configuration implements ConfigurationInterface
{
    /** @var string Configuration key / extension alias. */
    public const ALIAS = 'nowo_select_all_choice';

    /**
     * Supported form_theme values (Symfony base layouts) mapped to the bundle theme that wraps them.
     *
     * @var array<string, string>
     */
    public const FORM_THEME_MAP = [
        'form_div_layout.html.twig'               => '@NowoSelectAllChoiceBundle/Form/select_all_choice_theme.html.twig',
        'form_table_layout.html.twig'             => '@NowoSelectAllChoiceBundle/Form/select_all_choice_theme_table.html.twig',
        'bootstrap_5_layout.html.twig'            => '@NowoSelectAllChoiceBundle/Form/select_all_choice_theme_bootstrap5.html.twig',
        'bootstrap_5_horizontal_layout.html.twig' => '@NowoSelectAllChoiceBundle/Form/select_all_choice_theme_bootstrap5_horizontal.html.twig',
        'bootstrap_4_layout.html.twig'            => '@NowoSelectAllChoiceBundle/Form/select_all_choice_theme_bootstrap4.html.twig',
        'bootstrap_4_horizontal_layout.html.twig' => '@NowoSelectAllChoiceBundle/Form/select_all_choice_theme_bootstrap4_horizontal.html.twig',
        'bootstrap_3_layout.html.twig'            => '@NowoSelectAllChoiceBundle/Form/select_all_choice_theme_bootstrap3.html.twig',
        'bootstrap_3_horizontal_layout.html.twig' => '@NowoSelectAllChoiceBundle/Form/select_all_choice_theme_bootstrap3_horizontal.html.twig',
        'foundation_5_layout.html.twig'           => '@NowoSelectAllChoiceBundle/Form/select_all_choice_theme_foundation5.html.twig',
        'foundation_6_layout.html.twig'           => '@NowoSelectAllChoiceBundle/Form/select_all_choice_theme_foundation6.html.twig',
        'tailwind_2_layout.html.twig'             => '@NowoSelectAllChoiceBundle/Form/select_all_choice_theme_tailwind2.html.twig',
    ];

    /**
     * Builds the configuration tree for the bundle.
     *
     * @return TreeBuilder The tree builder with default_label, default_position,
     *                     default_toggle_css_class, default_container_css_class, translation_domain
     */
    public function getConfigTreeBuilder(): TreeBuilder
    {
        $treeBuilder = new TreeBuilder(self::ALIAS);
        $root        = $treeBuilder->getRootNode();

        $root
            ->children()
                ->scalarNode('default_label')
                    ->info('Default translation key for the "Select all" label when not overridden per field.')
                    ->defaultValue('form.select_all')
                ->end()
                ->scalarNode('default_position')
                    ->info('Default position of the toggle: "before" or "after" the choices.')
                    ->defaultValue('before')
                    ->validate()
                        ->ifNotInArray(['before', 'after'])
                        ->thenInvalid('default_position must be "before" or "after".')
                    ->end()
                ->end()
                ->scalarNode('default_toggle_css_class')
                    ->info('Default CSS class for the "Select all" checkbox/input.')
                    ->defaultValue('form-check-input')
                ->end()
                ->scalarNode('default_wrapper_css_class')
                    ->info('Default CSS class for the wrapper div that contains the toggle checkbox and its label (e.g. form-check for Bootstrap).')
                    ->defaultValue('form-check')
                ->end()
                ->scalarNode('default_label_css_class')
                    ->info('Default CSS class for the "Select all" label (e.g. form-check-label for Bootstrap).')
                    ->defaultValue('form-check-label')
                ->end()
                ->scalarNode('default_container_css_class')
                    ->info('Default CSS class for the outer wrapper div (toggle + choices).')
                    ->defaultValue('form-check mb-2')
                ->end()
                ->scalarNode('translation_domain')
                    ->info('Default translation domain for the "Select all" label (bundle uses NowoSelectAllChoiceBundle).')
                    ->defaultValue('NowoSelectAllChoiceBundle')
                ->end()
                ->enumNode('form_theme')
                    ->info('Base form layout template used for choice widgets. Must be one of Symfony\'s form themes (e.g. form_div_layout.html.twig, bootstrap_5_layout.html.twig). See docs/CONFIGURATION.md.')
                    ->values(array_keys(self::FORM_THEME_MAP))
                    ->defaultValue('form_div_layout.html.twig')
                ->end()
                ->booleanNode('debug')
                    ->info('When true, the frontend logs all debug/info/warn messages to the console. When false, only the initial "script loaded" message is shown.')
                    ->defaultValue(false)
                ->end()
            ->end();

        return $treeBuilder;
    }
}
