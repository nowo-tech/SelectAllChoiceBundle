# Contributing

Thank you for considering contributing to SelectAllChoiceBundle.

## Development setup

- **PHP** >= 8.2 and **Composer** (or use the provided Docker setup).
- **Frontend**: TypeScript and Vite; from the bundle root, `pnpm install` then `pnpm typecheck` or `pnpm build` to type-check or build the assets (optional; consuming apps typically build the bundle’s TS via Vite alias).
- **Docker** (optional): from the bundle root, run `make up` then `make install` to use the container for all PHP/Composer commands.

## Running tests and QA

From the bundle root:

```bash
# With Docker (recommended)
make install
make test
make test-coverage
make cs-check
make cs-fix
make qa

# Without Docker
composer install
composer test
composer test-coverage
composer cs-check
composer cs-fix
composer qa
```

## Code style

The project uses [PHP-CS-Fixer](https://github.com/FriendsOfPHP/PHP-CS-Fixer) with the canonical Nowo bundle rules (PSR-12 + Symfony). Run `make cs-fix` (or `composer cs-fix`) before committing.

## Pull requests

1. Fork the repository and create a feature branch.
2. Ensure tests pass and code style is applied.
3. Submit a PR with a clear description; reference any related issues.

## Documentation

All docs are in English. Update the relevant `docs/*.md` and the root README when changing behaviour or options.
