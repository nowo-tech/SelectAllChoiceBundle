<?php

declare(strict_types=1);

namespace Nowo\SelectAllChoiceBundle\Twig;

use Nowo\SelectAllChoiceBundle\DependencyInjection\Configuration;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

/**
 * Exposes safe relative asset filenames and the named Symfony asset package (REQ-ASSETS-004).
 *
 * Prefer: asset(nowo_select_all_choice_asset_path('select-all-choice.js'), nowo_select_all_choice_asset_package())
 * or:     asset('select-all-choice.js', 'nowo_select_all_choice')
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class NowoSelectAllChoiceTwigExtension extends AbstractExtension
{
    /**
     * Directory name under public/bundles/ where assets:install publishes this bundle.
     */
    public const ASSET_DIR = 'nowoselectallchoice';

    /**
     * Safe character set for asset path segments (alphanumeric, dot, hyphen, underscore, slash for subpaths).
     */
    private const SAFE_FILENAME_PATTERN = '#^[a-zA-Z0-9._/-]+$#';

    /**
     * @return array<int, TwigFunction>
     */
    public function getFunctions(): array
    {
        return [
            new TwigFunction('nowo_select_all_choice_asset_path', $this->assetPath(...)),
            new TwigFunction('nowo_select_all_choice_asset_package', $this->assetPackage(...)),
        ];
    }

    /**
     * Returns a relative filename under the named asset package (REQ-ASSETS-004).
     *
     * @param string $filename Filename relative to the package base (e.g. "select-all-choice.js")
     */
    public function assetPath(string $filename): string
    {
        $filename = ltrim($filename, '/');
        if ($filename === '' || str_contains($filename, '..') || preg_match(self::SAFE_FILENAME_PATTERN, $filename) !== 1) {
            return 'select-all-choice.js';
        }

        return $filename;
    }

    /**
     * Named Symfony asset package (same as Configuration::ALIAS).
     */
    public function assetPackage(): string
    {
        return Configuration::ALIAS;
    }
}
