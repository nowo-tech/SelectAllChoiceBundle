<?php

declare(strict_types=1);

namespace Nowo\SelectAllChoiceBundle\Tests\Unit\DependencyInjection;

use Nowo\SelectAllChoiceBundle\DependencyInjection\Configuration;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Config\Definition\Processor;

final class ConfigurationTest extends TestCase
{
    public function testProcessesDefaultConfig(): void
    {
        $processor     = new Processor();
        $configuration = new Configuration();

        $processed = $processor->processConfiguration($configuration, [[]]);

        self::assertSame('form.select_all', $processed['default_label']);
        self::assertSame('before', $processed['default_position']);
        self::assertSame('form-check-input', $processed['default_toggle_css_class']);
        self::assertSame('form-check', $processed['default_wrapper_css_class']);
        self::assertSame('form-check-label', $processed['default_label_css_class']);
        self::assertSame('form-check mb-2', $processed['default_container_css_class']);
        self::assertSame('nowo_select_all_choice', $processed['translation_domain']);
        self::assertSame('form_div_layout.html.twig', $processed['form_theme']);
    }

    public function testProcessesCustomConfig(): void
    {
        $processor     = new Processor();
        $configuration = new Configuration();

        $processed = $processor->processConfiguration($configuration, [[
            'form_theme'                  => 'bootstrap_5_layout.html.twig',
            'default_label'               => 'my.select_all',
            'default_position'            => 'after',
            'default_toggle_css_class'    => 'custom-input',
            'default_wrapper_css_class'   => 'custom-wrapper',
            'default_label_css_class'     => 'custom-label',
            'default_container_css_class' => 'custom-wrap',
            'translation_domain'          => 'messages',
        ]]);

        self::assertSame('my.select_all', $processed['default_label']);
        self::assertSame('after', $processed['default_position']);
        self::assertSame('custom-input', $processed['default_toggle_css_class']);
        self::assertSame('custom-wrapper', $processed['default_wrapper_css_class']);
        self::assertSame('custom-label', $processed['default_label_css_class']);
        self::assertSame('custom-wrap', $processed['default_container_css_class']);
        self::assertSame('messages', $processed['translation_domain']);
        self::assertSame('bootstrap_5_layout.html.twig', $processed['form_theme']);
    }

    public function testRejectsInvalidPosition(): void
    {
        $processor     = new Processor();
        $configuration = new Configuration();

        $this->expectException(\Symfony\Component\Config\Definition\Exception\InvalidConfigurationException::class);
        $this->expectExceptionMessage('default_position must be "before" or "after"');

        $processor->processConfiguration($configuration, [['default_position' => 'invalid']]);
    }
}
