<?php

declare(strict_types=1);

namespace Nowo\SelectAllChoiceBundle\Twig;

/**
 * Exposes the bundle's public asset path for JS URLs in templates.
 *
 * Symfony assets:install uses the bundle name to build the path (e.g. NowoSelectAllChoiceBundle
 * → "nowoselectallchoice"). Use this function so script URLs match the installed path.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class NowoSelectAllChoiceTwigExtension
{
    /**
     * Directory name under public/bundles/ where the bundle's assets are installed.
     * Matches the output of `php bin/console assets:install` (derived from bundle class name).
     */
    public const ASSET_DIR = 'nowoselectallchoice';

    /**
     * Safe character set for asset path segments (alphanumeric, dot, hyphen, underscore, slash for subpaths).
     * Rejects ".." and any character that could lead to path traversal or injection.
     */
    private const SAFE_FILENAME_PATTERN = '#^[a-zA-Z0-9._/-]+$#';

    /**
     * Returns the asset path for a file in the bundle's public directory.
     *
     * The filename must not contain ".." and must match a safe character set to prevent path traversal.
     * Use only literal or controlled values (e.g. "select-all-choice.js").
     *
     * @param string $filename Filename or path relative to the bundle asset dir (e.g. "select-all-choice.js")
     *
     * @return string Path suitable for the asset() function (e.g. "bundles/nowoselectallchoice/select-all-choice.js")
     */
    #[\Twig\Attribute\AsTwigFunction(name: 'nowo_select_all_choice_asset_path', isSafe: ['html'])]
    public function assetPath(string $filename): string
    {
        $filename = ltrim($filename, '/');
        if ($filename === '' || str_contains($filename, '..') || preg_match(self::SAFE_FILENAME_PATTERN, $filename) !== 1) {
            return 'bundles/' . self::ASSET_DIR . '/select-all-choice.js';
        }

        return 'bundles/' . self::ASSET_DIR . '/' . $filename;
    }
}
