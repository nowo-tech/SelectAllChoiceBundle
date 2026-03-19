<?php

declare(strict_types=1);

namespace Nowo\SelectAllChoiceBundle\Tests\Unit\DependencyInjection;

use Nowo\SelectAllChoiceBundle\DependencyInjection\Configuration;
use Nowo\SelectAllChoiceBundle\DependencyInjection\SelectAllChoiceExtension;
use PHPUnit\Framework\TestCase;
use Symfony\Component\DependencyInjection\ContainerBuilder;

final class SelectAllChoiceExtensionTest extends TestCase
{
    public function testLoadSetsParametersAndRegistersFormExtension(): void
    {
        $container = new ContainerBuilder();
        $extension = new SelectAllChoiceExtension();

        $extension->load([[]], $container);

        self::assertSame('form.select_all', $container->getParameter('nowo_select_all_choice.default_label'));
        self::assertSame('before', $container->getParameter('nowo_select_all_choice.default_position'));
        self::assertSame('form-check-input', $container->getParameter('nowo_select_all_choice.default_toggle_css_class'));
        self::assertSame('form-check', $container->getParameter('nowo_select_all_choice.default_wrapper_css_class'));
        self::assertSame('form-check-label', $container->getParameter('nowo_select_all_choice.default_label_css_class'));
        self::assertSame('form-check mb-2', $container->getParameter('nowo_select_all_choice.default_container_css_class'));
        self::assertSame('NowoSelectAllChoiceBundle', $container->getParameter('nowo_select_all_choice.translation_domain'));
        self::assertSame('form_div_layout.html.twig', $container->getParameter('nowo_select_all_choice.form_theme'));
        self::assertTrue($container->hasDefinition(\Nowo\SelectAllChoiceBundle\Form\Extension\ChoiceTypeSelectAllExtension::class));
    }

    public function testLoadSetsFormThemeFromConfig(): void
    {
        $container = new ContainerBuilder();
        $extension = new SelectAllChoiceExtension();

        $extension->load([['form_theme' => 'bootstrap_5_layout.html.twig']], $container);

        self::assertSame('bootstrap_5_layout.html.twig', $container->getParameter('nowo_select_all_choice.form_theme'));
    }

    public function testPrependAddsFormThemeToTwig(): void
    {
        $container = new ContainerBuilder();
        $container->prependExtensionConfig(Configuration::ALIAS, []);
        $extension = new SelectAllChoiceExtension();

        $extension->prepend($container);

        $twigConfigs = $container->getExtensionConfig('twig');
        self::assertNotEmpty($twigConfigs);
        self::assertArrayHasKey('form_themes', $twigConfigs[0]);
        self::assertSame(
            ['@NowoSelectAllChoiceBundle/Form/select_all_choice_theme.html.twig'],
            $twigConfigs[0]['form_themes'],
        );
    }

    public function testPrependAddsBootstrap5ThemeWhenConfigured(): void
    {
        $container = new ContainerBuilder();
        $container->prependExtensionConfig(Configuration::ALIAS, ['form_theme' => 'bootstrap_5_layout.html.twig']);
        $extension = new SelectAllChoiceExtension();

        $extension->prepend($container);

        $twigConfigs = $container->getExtensionConfig('twig');
        self::assertSame(
            ['@NowoSelectAllChoiceBundle/Form/select_all_choice_theme_bootstrap5.html.twig'],
            $twigConfigs[0]['form_themes'],
        );
    }

    public function testGetAlias(): void
    {
        $extension = new SelectAllChoiceExtension();
        self::assertSame('nowo_select_all_choice', $extension->getAlias());
    }
}
