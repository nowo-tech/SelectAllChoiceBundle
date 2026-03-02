<?php

declare(strict_types=1);

namespace Nowo\SelectAllChoiceBundle\Tests\Unit;

use Nowo\SelectAllChoiceBundle\DependencyInjection\SelectAllChoiceExtension;
use Nowo\SelectAllChoiceBundle\NowoSelectAllChoiceBundle;
use PHPUnit\Framework\TestCase;

final class NowoSelectAllChoiceBundleTest extends TestCase
{
    public function testGetContainerExtensionReturnsSelectAllChoiceExtension(): void
    {
        $bundle    = new NowoSelectAllChoiceBundle();
        $extension = $bundle->getContainerExtension();

        self::assertInstanceOf(SelectAllChoiceExtension::class, $extension);
        self::assertSame($extension, $bundle->getContainerExtension());
    }
}
