<?php

declare(strict_types=1);

/**
 * Rector configuration for SelectAllChoiceBundle.
 *
 * Ensures PHP 8.2+ and Symfony 7|8 compatibility; applies dead code, code quality,
 * and type declaration rules. Only the src/ directory is processed (tests are skipped).
 *
 * @see https://getrector.com/documentation
 */
use Rector\Config\RectorConfig;
use Rector\Symfony\Symfony73\Rector\Class_\GetFiltersAndFunctionsToAsTwigAttributeRector;
use Rector\ValueObject\PhpVersion;

return RectorConfig::configure()
    ->withPaths([
        __DIR__ . '/src',
    ])
    ->withPhpVersion(PhpVersion::PHP_82)
    ->withComposerBased(symfony: true)
    ->withPreparedSets(
        deadCode: true,
        codeQuality: true,
        typeDeclarations: true,
    )
    ->withSkip([
        // #[AsTwigFunction] needs Twig 3.21 / Symfony 7.3+; the bundle still supports Symfony 6.4 (getFunctions() kept).
        GetFiltersAndFunctionsToAsTwigAttributeRector::class,
        __DIR__ . '/demo',
        __DIR__ . '/vendor',
        __DIR__ . '/tests', // Skip tests: some Symfony rules (e.g. RequestStack constructor) don't match Symfony's actual API
    ]);
