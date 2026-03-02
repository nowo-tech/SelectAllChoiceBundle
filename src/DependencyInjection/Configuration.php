<?php

declare(strict_types=1);

namespace Nowo\SelectAllChoiceBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

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
                    ->info('Default translation domain for the "Select all" label (bundle uses nowo_select_all_choice).')
                    ->defaultValue('nowo_select_all_choice')
                ->end()
            ->end();

        return $treeBuilder;
    }
}
