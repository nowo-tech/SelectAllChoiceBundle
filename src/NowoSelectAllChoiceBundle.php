<?php

declare(strict_types=1);

namespace Nowo\SelectAllChoiceBundle;

use Nowo\SelectAllChoiceBundle\DependencyInjection\Compiler\TwigPathsPass;
use Nowo\SelectAllChoiceBundle\DependencyInjection\SelectAllChoiceExtension;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Bundle\Bundle;

/**
 * Symfony bundle that adds an optional "Select all" toggle for ChoiceType fields with multiple=true.
 *
 * Uses a FormTypeExtension, a Twig form theme and a Stimulus controller.
 * Opt-in via field option: select_all => true.
 *
 * Stateless under FrankenPHP worker with FRANKENPHP_RESET_KERNEL unset/false (FR-RUNTIME-001):
 * extension class is resolved via getContainerExtensionClass(); no mutable instance state.
 */
final class NowoSelectAllChoiceBundle extends Bundle
{
    public function build(ContainerBuilder $container): void
    {
        $container->addCompilerPass(new TwigPathsPass());
    }

    /**
     * Extension class name (alias nowo_select_all_choice); not the default *Bundle → *Extension guess.
     */
    protected function getContainerExtensionClass(): string
    {
        return SelectAllChoiceExtension::class;
    }
}
