<?php

declare(strict_types=1);

namespace Nowo\SelectAllChoiceBundle\Tests\Unit\Twig;

use Nowo\SelectAllChoiceBundle\Twig\NowoSelectAllChoiceTwigExtension;
use PHPUnit\Framework\TestCase;
use Twig\TwigFunction;

final class NowoSelectAllChoiceTwigExtensionTest extends TestCase
{
    private NowoSelectAllChoiceTwigExtension $extension;

    protected function setUp(): void
    {
        $this->extension = new NowoSelectAllChoiceTwigExtension();
    }

    public function testAssetPathReturnsRelativeFilenameForValidFilename(): void
    {
        self::assertSame('select-all-choice.js', $this->extension->assetPath('select-all-choice.js'));
        self::assertSame('css/theme.css', $this->extension->assetPath('css/theme.css'));
    }

    public function testGetFunctionsContainsExpectedTwigFunctions(): void
    {
        $functions = $this->extension->getFunctions();

        self::assertCount(2, $functions);
        self::assertInstanceOf(TwigFunction::class, $functions[0]);
        self::assertSame('nowo_select_all_choice_asset_path', $functions[0]->getName());
        self::assertSame('nowo_select_all_choice_asset_package', $functions[1]->getName());
    }

    public function testAssetPackageReturnsConfigurationAlias(): void
    {
        self::assertSame('nowo_select_all_choice', $this->extension->assetPackage());
    }

    public function testAssetPathReturnsDefaultForEmptyFilename(): void
    {
        self::assertSame('select-all-choice.js', $this->extension->assetPath(''));
    }

    public function testAssetPathReturnsDefaultForPathTraversal(): void
    {
        self::assertSame('select-all-choice.js', $this->extension->assetPath('../etc/passwd'));
        self::assertSame('select-all-choice.js', $this->extension->assetPath('foo/../../bar'));
    }

    public function testAssetPathReturnsDefaultForUnsafeCharacters(): void
    {
        self::assertSame('select-all-choice.js', $this->extension->assetPath('file;.js'));
    }

    public function testAssetPathTrimsLeadingSlash(): void
    {
        self::assertSame('select-all-choice.js', $this->extension->assetPath('/select-all-choice.js'));
    }
}
