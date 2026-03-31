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

    public function testAssetPathReturnsPathForValidFilename(): void
    {
        self::assertSame(
            'bundles/nowoselectallchoice/select-all-choice.js',
            $this->extension->assetPath('select-all-choice.js'),
        );
        self::assertSame(
            'bundles/nowoselectallchoice/css/theme.css',
            $this->extension->assetPath('css/theme.css'),
        );
    }

    public function testGetFunctionsContainsExpectedTwigFunction(): void
    {
        $functions = $this->extension->getFunctions();

        self::assertCount(1, $functions);
        self::assertInstanceOf(TwigFunction::class, $functions[0]);
        self::assertSame('nowo_select_all_choice_asset_path', $functions[0]->getName());
    }

    public function testAssetPathReturnsDefaultForEmptyFilename(): void
    {
        self::assertSame(
            'bundles/nowoselectallchoice/select-all-choice.js',
            $this->extension->assetPath(''),
        );
    }

    public function testAssetPathReturnsDefaultForPathTraversal(): void
    {
        self::assertSame(
            'bundles/nowoselectallchoice/select-all-choice.js',
            $this->extension->assetPath('../etc/passwd'),
        );
        self::assertSame(
            'bundles/nowoselectallchoice/select-all-choice.js',
            $this->extension->assetPath('foo/../../bar'),
        );
    }

    public function testAssetPathReturnsDefaultForUnsafeCharacters(): void
    {
        self::assertSame(
            'bundles/nowoselectallchoice/select-all-choice.js',
            $this->extension->assetPath('file;.js'),
        );
    }

    public function testAssetPathTrimsLeadingSlash(): void
    {
        self::assertSame(
            'bundles/nowoselectallchoice/select-all-choice.js',
            $this->extension->assetPath('/select-all-choice.js'),
        );
    }
}
