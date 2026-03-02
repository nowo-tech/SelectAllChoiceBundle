# Makefile for SelectAllChoiceBundle Demo - Symfony 7
COMPOSE_FILE := docker-compose.yml
COMPOSE     := docker compose -f $(COMPOSE_FILE)
SERVICE_PHP := php

.PHONY: help up down restart build install shell logs cache-clear update-bundle ensure-up ensure-install test test-coverage assets

help:
	@echo "SelectAllChoiceBundle Demo - Symfony 7"
	@echo "  make up            Start container (http://localhost:$${PORT:-8007})"
	@echo "  make down          Stop container"
	@echo "  make restart       Restart container"
	@echo "  make build         Build image (no cache)"
	@echo "  make install       Install dependencies (Composer + pnpm + vite build)"
	@echo "  make ensure-up     Start container if needed (and install deps + assets on first start)"
	@echo "  make ensure-install ensure-up + composer install + assets"
	@echo "  make assets        Build frontend (pnpm install + vite build; needs ensure-up)"
	@echo "  make update-bundle Update bundle from path repo"
	@echo ""

up:
	@if [ ! -f .env ]; then cp .env.example .env 2>/dev/null || (echo "APP_ENV=dev" > .env; echo "APP_DEBUG=1" >> .env; echo "APP_SECRET=change-me" >> .env; echo "PORT=8007" >> .env); fi
	$(COMPOSE) up -d
	@sleep 5
	@$(COMPOSE) exec -T -e COMPOSER_MEMORY_LIMIT=-1 $(SERVICE_PHP) composer install --no-interaction
	@$(MAKE) assets
	@echo "App: http://localhost:$${PORT:-8007}"

down:
	$(COMPOSE) down

restart: ensure-up
	$(COMPOSE) restart

build:
	$(COMPOSE) build --no-cache

ensure-up:
	@if ! $(COMPOSE) exec -T $(SERVICE_PHP) true 2>/dev/null; then \
		echo "Container not ready (or restarting). Stopping and starting fresh..."; \
		$(COMPOSE) down 2>/dev/null; \
		$(COMPOSE) up -d; \
		sleep 5; \
		$(COMPOSE) exec -T -e COMPOSER_MEMORY_LIMIT=-1 $(SERVICE_PHP) composer install --no-interaction; \
		$(COMPOSE) exec -T -e BUNDLE_PATH=/var/select-all-choice-bundle/assets $(SERVICE_PHP) sh -c "pnpm install && pnpm build"; \
	fi

ensure-install: ensure-up
	$(COMPOSE) exec -T -e COMPOSER_MEMORY_LIMIT=-1 $(SERVICE_PHP) composer install --no-interaction
	@$(MAKE) assets

install: ensure-install

assets: ensure-up
	$(COMPOSE) exec -T -e BUNDLE_PATH=/var/select-all-choice-bundle/assets $(SERVICE_PHP) sh -c "pnpm install && pnpm build"

shell: ensure-up
	$(COMPOSE) exec $(SERVICE_PHP) sh

logs:
	$(COMPOSE) logs -f

cache-clear: ensure-up
	$(COMPOSE) exec -T $(SERVICE_PHP) php bin/console cache:clear

update-bundle: ensure-up
	$(COMPOSE) exec -T $(SERVICE_PHP) composer update nowo-tech/select-all-choice-bundle --with-all-dependencies

test: ensure-install
	$(COMPOSE) exec -T $(SERVICE_PHP) vendor/bin/phpunit 2>/dev/null || true

test-coverage: ensure-install
	$(COMPOSE) exec -T $(SERVICE_PHP) vendor/bin/phpunit --coverage-text 2>/dev/null || true
