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
use Rector\Symfony\Symfony73\Rector\Class_\GetFunctionsToAsTwigFunctionAttributeRector;
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
        GetFunctionsToAsTwigFunctionAttributeRector::class,
        __DIR__ . '/demo',
        __DIR__ . '/vendor',
        __DIR__ . '/tests', // Skip tests: some Symfony rules (e.g. RequestStack constructor) don't match Symfony's actual API
    ]);
