<?php

declare(strict_types=1);

namespace Nowo\SelectAllChoiceBundle\DependencyInjection;

use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;

/**
 * Dependency injection extension for SelectAllChoiceBundle.
 *
 * Loads bundle configuration, sets container parameters and registers the form type extension service.
 */
final class SelectAllChoiceExtension extends Extension
{
    /**
     * Loads the bundle configuration and service definitions.
     *
     * @param array<string, mixed> $configs Merged config from config files
     * @param ContainerBuilder $container The container builder
     */
    public function load(array $configs, ContainerBuilder $container): void
    {
        $configuration = new Configuration();
        $config        = $this->processConfiguration($configuration, $configs);

        $container->setParameter('nowo_select_all_choice.default_label', $config['default_label']);
        $container->setParameter('nowo_select_all_choice.default_position', $config['default_position']);
        $container->setParameter('nowo_select_all_choice.default_toggle_css_class', $config['default_toggle_css_class']);
        $container->setParameter('nowo_select_all_choice.default_container_css_class', $config['default_container_css_class']);
        $container->setParameter('nowo_select_all_choice.translation_domain', $config['translation_domain']);

        $loader = new YamlFileLoader($container, new FileLocator(__DIR__ . '/../Resources/config'));
        $loader->load('services.yaml');
    }

    /**
     * Returns the extension alias (used in config keys).
     *
     * @return string The alias, e.g. nowo_select_all_choice
     */
    public function getAlias(): string
    {
        return Configuration::ALIAS;
    }
}
