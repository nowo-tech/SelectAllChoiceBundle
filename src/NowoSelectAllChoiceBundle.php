<?php

declare(strict_types=1);

namespace Nowo\SelectAllChoiceBundle;

use Nowo\SelectAllChoiceBundle\DependencyInjection\Compiler\TwigPathsPass;
use Nowo\SelectAllChoiceBundle\DependencyInjection\SelectAllChoiceExtension;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\ExtensionInterface;
use Symfony\Component\HttpKernel\Bundle\Bundle;

/**
 * Symfony bundle that adds an optional "Select all" toggle for ChoiceType fields with multiple=true.
 *
 * Uses a FormTypeExtension, a Twig form theme and a Stimulus controller.
 * Opt-in via field option: select_all => true.
 */
final class NowoSelectAllChoiceBundle extends Bundle
{
    public function build(ContainerBuilder $container): void
    {
        $container->addCompilerPass(new TwigPathsPass());
    }

    /**
     * Returns the container extension that loads the bundle configuration and services.
     *
     * @return ExtensionInterface The extension instance (cached after first call)
     */
    public function getContainerExtension(): ExtensionInterface
    {
        if ($this->extension instanceof ExtensionInterface) {
            return $this->extension;
        }

        $this->extension = new SelectAllChoiceExtension();

        return $this->extension;
    }
}
