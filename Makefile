# Makefile for SelectAllChoiceBundle - development and QA (Docker)
COMPOSE_FILE := docker-compose.yml
COMPOSE      := docker compose -f $(COMPOSE_FILE)
SERVICE_PHP  := php
RUN          := $(COMPOSE) exec -T $(SERVICE_PHP)

.PHONY: help up down shell install test test-coverage cs-check cs-fix qa clean ensure-up
.PHONY: release-check release-check-demos composer-sync assets build
.PHONY: up-symfony7 up-symfony8 down-symfony7 down-symfony8

help:
	@echo "SelectAllChoiceBundle - Development Commands (Docker)"
	@echo ""
	@echo "Usage: make <target>"
	@echo ""
	@echo "Targets:"
	@echo "  up             Start Docker container (bundle root)"
	@echo "  down           Stop container"
	@echo "  shell          Open shell in container"
	@echo "  install        Install Composer dependencies"
	@echo "  test           Run PHPUnit tests"
	@echo "  test-coverage  Run tests with code coverage (PCOV)"
	@echo "  cs-check       Check code style (PHP-CS-Fixer)"
	@echo "  cs-fix         Fix code style"
	@echo "  qa             Run all QA (cs-check + test)"
	@echo "  release-check  Pre-release: composer-sync, cs-fix, cs-check, test-coverage, release-check-demos"
	@echo "  composer-sync  Validate composer.json and align composer.lock (no install)"
	@echo "  clean          Remove vendor, cache, coverage"
	@echo "  assets         Build frontend (TypeScript → dist/ via Vite; requires pnpm on host)"
	@echo "  build          Rebuild Docker image (bundle root docker-compose, no cache)"
	@echo ""
	@echo "Demos:"
	@echo "  up-symfony7    Start demo Symfony 7 (http://localhost:8007)"
	@echo "  up-symfony8    Start demo Symfony 8 (http://localhost:8008)"
	@echo "  down-symfony7  Stop demo Symfony 7"
	@echo "  down-symfony8  Stop demo Symfony 8"
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

test: install
	$(RUN) composer test

test-coverage: install
	$(RUN) composer test-coverage

cs-check: install
	$(RUN) composer cs-check

cs-fix: install
	$(RUN) composer cs-fix

qa: install
	$(RUN) composer qa

release-check: ensure-up composer-sync cs-fix cs-check test-coverage release-check-demos

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
