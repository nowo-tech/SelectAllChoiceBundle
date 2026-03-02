<?php

declare(strict_types=1);

namespace Nowo\SelectAllChoiceBundle\Tests\Unit\DependencyInjection;

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
        self::assertSame('nowo_select_all_choice', $container->getParameter('nowo_select_all_choice.translation_domain'));
        self::assertTrue($container->hasDefinition(\Nowo\SelectAllChoiceBundle\Form\Extension\ChoiceTypeSelectAllExtension::class));
    }

    public function testGetAlias(): void
    {
        $extension = new SelectAllChoiceExtension();
        self::assertSame('nowo_select_all_choice', $extension->getAlias());
    }
}
