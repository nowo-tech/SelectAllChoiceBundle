<?php

declare(strict_types=1);

namespace Nowo\SelectAllChoiceBundle\Tests\Unit;

use Nowo\SelectAllChoiceBundle\DependencyInjection\SelectAllChoiceExtension;
use Nowo\SelectAllChoiceBundle\NowoSelectAllChoiceBundle;
use PHPUnit\Framework\TestCase;
use stdClass;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Definition;

final class NowoSelectAllChoiceBundleTest extends TestCase
{
    public function testBuildAddsTwigPathsPass(): void
    {
        $container = new ContainerBuilder();
        $loaderDef = new Definition(stdClass::class);
        $container->setDefinition('twig.loader.native_filesystem', $loaderDef);

        $bundle = new NowoSelectAllChoiceBundle();
        $bundle->build($container);
        $container->compile();

        $calls = $loaderDef->getMethodCalls();
        self::assertNotEmpty($calls);
        $addPathCalls = array_filter($calls, static fn (array $c): bool => $c[0] === 'addPath' && ($c[1][1] ?? '') === 'NowoSelectAllChoiceBundle');
        self::assertCount(1, $addPathCalls);
    }

    public function testGetContainerExtensionReturnsSelectAllChoiceExtension(): void
    {
        $bundle    = new NowoSelectAllChoiceBundle();
        $extension = $bundle->getContainerExtension();

        self::assertInstanceOf(SelectAllChoiceExtension::class, $extension);
        self::assertSame($extension, $bundle->getContainerExtension());
    }
}
