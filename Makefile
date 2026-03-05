# Makefile for SelectAllChoiceBundle - development and QA (Docker)
COMPOSE_FILE := docker-compose.yml
COMPOSE      := docker compose -f $(COMPOSE_FILE)
SERVICE_PHP  := php
RUN          := $(COMPOSE) exec -T $(SERVICE_PHP)

.PHONY: help up down shell install test test-coverage cs-check cs-fix qa clean ensure-up
.PHONY: release-check release-check-demos composer-sync assets build rector rector-dry phpstan update validate
.PHONY: assets-test assets-dev assets-watch assets-clean
.PHONY: up-symfony7 up-symfony8 down-symfony7 down-symfony8

help:
	@echo "SelectAllChoiceBundle - Development Commands (Docker)"
	@echo ""
	@echo "Usage: make <target>"
	@echo ""
	@echo "Targets:"
	@echo "  up             Start Docker container (bundle root)"
	@echo "  down           Stop container"
	@echo "  build          Rebuild Docker image (no cache)"
	@echo "  shell          Open shell in container"
	@echo "  install        Install Composer dependencies"
	@echo "  assets         Build frontend (TypeScript via Vite; requires pnpm on host)"
	@echo "  test           Run PHPUnit tests"
	@echo "  test-coverage  Run tests with code coverage (PCOV, console)"
	@echo "  cs-check       Check code style (PHP-CS-Fixer)"
	@echo "  cs-fix         Fix code style"
	@echo "  rector         Apply Rector refactoring"
	@echo "  rector-dry     Rector dry-run (no changes)"
	@echo "  phpstan        Run PHPStan static analysis"
	@echo "  qa             Run all QA (cs-check + test)"
	@echo "  release-check  Pre-release: composer-sync, cs-fix, cs-check, rector-dry, phpstan, test-coverage, release-check-demos"
	@echo "  composer-sync  Validate composer.json and align composer.lock (no install)"
	@echo "  clean          Remove vendor, cache, coverage"
	@echo "  update         Update Composer dependencies"
	@echo "  validate       Validate composer.json (composer validate --strict)"
	@echo ""
	@echo "Bundle-specific (assets):"
	@echo "  assets-test     Alias of test-ts"
	@echo "  assets-dev      Build assets in development mode"
	@echo "  assets-watch    Watch assets for changes"
	@echo "  assets-clean    Clean built assets"
	@echo ""
	@echo "Demos:"
	@echo "  (use make -C demo or make -C demo/symfonyX)"
	@echo ""

ensure-up:
	@if ! $(COMPOSE) exec -T $(SERVICE_PHP) true 2>/dev/null; then \
		echo "Container not running. Starting docker compose..."; \
		$(COMPOSE) up -d; \
		sleep 2; \
	fi

up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

shell: ensure-up
	$(COMPOSE) exec $(SERVICE_PHP) sh

install: ensure-up
	$(RUN) composer install

# No -T so PHPUnit gets a TTY and can show colors in console
test: ensure-up
	$(COMPOSE) exec $(SERVICE_PHP) composer test

test-coverage: ensure-up
	$(COMPOSE) exec $(SERVICE_PHP) composer test-coverage

cs-check: install
	$(RUN) composer cs-check

cs-fix: install
	$(RUN) composer cs-fix

qa: install
	$(RUN) composer qa

rector: ensure-up
	$(RUN) composer rector

rector-dry: ensure-up
	$(RUN) composer rector-dry

phpstan: ensure-up
	$(RUN) composer phpstan

update: ensure-up
	$(RUN) composer update --no-interaction

validate: ensure-up
	$(RUN) composer validate --strict

release-check: ensure-up composer-sync cs-fix cs-check rector-dry phpstan test-coverage release-check-demos

release-check-demos:
	@$(MAKE) -C demo release-verify

up-symfony7:
	$(MAKE) -C demo/symfony7 up

up-symfony8:
	$(MAKE) -C demo/symfony8 up

down-symfony7:
	$(MAKE) -C demo/symfony7 down

down-symfony8:
	$(MAKE) -C demo/symfony8 down

build:
	$(COMPOSE) build --no-cache

composer-sync: ensure-up
	$(RUN) composer validate --strict
	$(RUN) composer update --no-install

clean: ensure-up
	$(RUN) sh -c 'rm -rf vendor .phpunit.cache coverage coverage.xml .php-cs-fixer.cache'

assets:
	@command -v pnpm >/dev/null 2>&1 || { echo "Error: pnpm is required to build assets. Install it with: npm install -g pnpm"; exit 1; }
	pnpm install && pnpm build

assets-test:
	@command -v pnpm >/dev/null 2>&1 || { echo "Error: pnpm is required. Install it with: npm install -g pnpm"; exit 1; }
	pnpm install && pnpm run typecheck

assets-dev:
	@command -v pnpm >/dev/null 2>&1 || { echo "Error: pnpm is required. Install it with: npm install -g pnpm"; exit 1; }
	pnpm install && pnpm exec vite

assets-watch: assets-dev

assets-clean:
	rm -rf dist .vite node_modules/.vite 2>/dev/null || true
	@echo "Assets build artifacts cleaned."
