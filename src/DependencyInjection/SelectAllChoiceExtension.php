<?php

declare(strict_types=1);

namespace Nowo\SelectAllChoiceBundle\DependencyInjection;

use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\Extension\PrependExtensionInterface;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;

/**
 * Dependency injection extension for SelectAllChoiceBundle.
 *
 * Loads bundle configuration, sets container parameters and registers the form type extension service.
 * Prepends the form theme to Twig according to form_theme config.
 */
final class SelectAllChoiceExtension extends Extension implements PrependExtensionInterface
{
    /** @var array<string, string> Map form_theme config value to bundle theme path. */
    private const FORM_THEME_MAP = [
        'form_div_layout.html.twig'               => '@NowoSelectAllChoice/Form/select_all_choice_theme.html.twig',
        'form_table_layout.html.twig'             => '@NowoSelectAllChoice/Form/select_all_choice_theme_table.html.twig',
        'bootstrap_5_layout.html.twig'            => '@NowoSelectAllChoice/Form/select_all_choice_theme_bootstrap5.html.twig',
        'bootstrap_5_horizontal_layout.html.twig' => '@NowoSelectAllChoice/Form/select_all_choice_theme_bootstrap5_horizontal.html.twig',
        'bootstrap_4_layout.html.twig'            => '@NowoSelectAllChoice/Form/select_all_choice_theme_bootstrap4.html.twig',
        'bootstrap_4_horizontal_layout.html.twig' => '@NowoSelectAllChoice/Form/select_all_choice_theme_bootstrap4_horizontal.html.twig',
        'bootstrap_3_layout.html.twig'            => '@NowoSelectAllChoice/Form/select_all_choice_theme_bootstrap3.html.twig',
        'bootstrap_3_horizontal_layout.html.twig' => '@NowoSelectAllChoice/Form/select_all_choice_theme_bootstrap3_horizontal.html.twig',
        'foundation_5_layout.html.twig'           => '@NowoSelectAllChoice/Form/select_all_choice_theme_foundation5.html.twig',
        'foundation_6_layout.html.twig'           => '@NowoSelectAllChoice/Form/select_all_choice_theme_foundation6.html.twig',
        'tailwind_2_layout.html.twig'             => '@NowoSelectAllChoice/Form/select_all_choice_theme_tailwind2.html.twig',
    ];

    /**
     * Prepends the bundle form theme to Twig so it matches the configured base layout.
     */
    public function prepend(ContainerBuilder $container): void
    {
        $configs   = $container->getExtensionConfig(Configuration::ALIAS);
        $config    = $this->processConfiguration(new Configuration(), $configs);
        $formTheme = $config['form_theme'];
        $themePath = self::FORM_THEME_MAP[$formTheme] ?? self::FORM_THEME_MAP['form_div_layout.html.twig'];

        $container->prependExtensionConfig('twig', [
            'form_themes' => [$themePath],
        ]);
    }

    /**
     * Loads the bundle configuration and service definitions.
     *
     * @param array<int, array<string, mixed>> $configs Array of config arrays (one per config file)
     * @param ContainerBuilder $container The container builder
     */
    public function load(array $configs, ContainerBuilder $container): void
    {
        $configuration = new Configuration();
        $config        = $this->processConfiguration($configuration, $configs);

        $container->setParameter('nowo_select_all_choice.default_label', $config['default_label']);
        $container->setParameter('nowo_select_all_choice.default_position', $config['default_position']);
        $container->setParameter('nowo_select_all_choice.default_toggle_css_class', $config['default_toggle_css_class']);
        $container->setParameter('nowo_select_all_choice.default_wrapper_css_class', $config['default_wrapper_css_class']);
        $container->setParameter('nowo_select_all_choice.default_label_css_class', $config['default_label_css_class']);
        $container->setParameter('nowo_select_all_choice.default_container_css_class', $config['default_container_css_class']);
        $container->setParameter('nowo_select_all_choice.translation_domain', $config['translation_domain']);
        $container->setParameter('nowo_select_all_choice.form_theme', $config['form_theme']);
        $container->setParameter('nowo_select_all_choice.debug', $config['debug'] ?? false);

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
