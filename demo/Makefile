# Makefile to manage SelectAllChoiceBundle demos (standard: up-X, down-X, etc.)
.PHONY: help release-verify clean test-all test-coverage-all verify-all
.PHONY: up-symfony7 up-symfony8 down-symfony7 down-symfony8
.PHONY: restart-symfony7 restart-symfony8 build-symfony7 build-symfony8
.PHONY: install-symfony7 install-symfony8 update-bundle-symfony7 update-bundle-symfony8
.PHONY: shell-symfony7 shell-symfony8 logs-symfony7 logs-symfony8
.PHONY: test-symfony7 test-symfony8 test-coverage-symfony7 test-coverage-symfony8
.PHONY: verify-symfony7 verify-symfony8
.PHONY: up down restart build install update-bundle test test-coverage shell logs verify

DEMOS := symfony7 symfony8

help:
	@echo "SelectAllChoiceBundle - Demos"
	@echo ""
	@echo "Usage: make <target>"
	@echo "Demos: $(DEMOS)"
	@echo ""
	@echo "Per-demo: up-X, down-X, restart-X, build-X, install-X, update-bundle-X, shell-X, logs-X, test-X, test-coverage-X, verify-X"
	@echo "  up-symfony7 / up-symfony8     Start container (http://localhost:8007 | 8008)"
	@echo "  down-symfony7 / down-symfony8 Stop container"
	@echo "  restart-symfony7 / restart-symfony8   Restart container"
	@echo "  build-symfony7 / build-symfony8       Rebuild image (no cache)"
	@echo "  install-symfony7 / install-symfony8  composer install + assets"
	@echo "  update-bundle-symfony7 / update-bundle-symfony8  Update bundle from path repo"
	@echo "  shell-symfony7 / shell-symfony8       Open shell in PHP container"
	@echo "  logs-symfony7 / logs-symfony8         Show container logs"
	@echo "  test-symfony7 / test-symfony8         Run tests"
	@echo "  test-coverage-symfony7 / test-coverage-symfony8  Run tests with coverage"
	@echo "  verify-symfony7 / verify-symfony8     Ensure up and check HTTP 200"
	@echo ""
	@echo "Generic (use DEMO=<name>): make up DEMO=symfony7"
	@echo "  up down restart build install update-bundle test test-coverage shell logs verify"
	@echo ""
	@echo "Aggregated:"
	@echo "  test-all           Run tests for all demos"
	@echo "  test-coverage-all  Run tests with coverage for all demos"
	@echo "  verify-all         Verify all demos (up + HTTP 200)"
	@echo "  release-verify    For each demo: up → healthcheck → down (for release-check)"
	@echo "  clean              Remove vendor, var, cache from all demos"
	@echo ""

# Per-demo targets (delegate to each demo's Makefile)
up-symfony7:
	@$(MAKE) -C symfony7 up

up-symfony8:
	@$(MAKE) -C symfony8 up

down-symfony7:
	@$(MAKE) -C symfony7 down

down-symfony8:
	@$(MAKE) -C symfony8 down

restart-symfony7:
	@$(MAKE) -C symfony7 restart

restart-symfony8:
	@$(MAKE) -C symfony8 restart

build-symfony7:
	@$(MAKE) -C symfony7 build

build-symfony8:
	@$(MAKE) -C symfony8 build

install-symfony7:
	@$(MAKE) -C symfony7 install

install-symfony8:
	@$(MAKE) -C symfony8 install

update-bundle-symfony7:
	@$(MAKE) -C symfony7 update-bundle

update-bundle-symfony8:
	@$(MAKE) -C symfony8 update-bundle

shell-symfony7:
	@$(MAKE) -C symfony7 shell

shell-symfony8:
	@$(MAKE) -C symfony8 shell

logs-symfony7:
	@$(MAKE) -C symfony7 logs

logs-symfony8:
	@$(MAKE) -C symfony8 logs

test-symfony7:
	@$(MAKE) -C symfony7 test

test-symfony8:
	@$(MAKE) -C symfony8 test

test-coverage-symfony7:
	@$(MAKE) -C symfony7 test-coverage

test-coverage-symfony8:
	@$(MAKE) -C symfony8 test-coverage

verify-symfony7:
	@$(MAKE) -C symfony7 verify

verify-symfony8:
	@$(MAKE) -C symfony8 verify

# Generic (require DEMO=<name>)
up:
	@if [ -z "$(DEMO)" ]; then echo "Error: use make up DEMO=symfony7"; exit 1; fi
	@$(MAKE) up-$(DEMO)

down:
	@if [ -z "$(DEMO)" ]; then echo "Error: use make down DEMO=symfony7"; exit 1; fi
	@$(MAKE) down-$(DEMO)

restart:
	@if [ -z "$(DEMO)" ]; then echo "Error: use make restart DEMO=symfony7"; exit 1; fi
	@$(MAKE) restart-$(DEMO)

build:
	@if [ -z "$(DEMO)" ]; then echo "Error: use make build DEMO=symfony7"; exit 1; fi
	@$(MAKE) build-$(DEMO)

install:
	@if [ -z "$(DEMO)" ]; then echo "Error: use make install DEMO=symfony7"; exit 1; fi
	@$(MAKE) install-$(DEMO)

update-bundle:
	@if [ -z "$(DEMO)" ]; then echo "Error: use make update-bundle DEMO=symfony7"; exit 1; fi
	@$(MAKE) update-bundle-$(DEMO)

test:
	@if [ -z "$(DEMO)" ]; then echo "Error: use make test DEMO=symfony7"; exit 1; fi
	@$(MAKE) test-$(DEMO)

test-coverage:
	@if [ -z "$(DEMO)" ]; then echo "Error: use make test-coverage DEMO=symfony7"; exit 1; fi
	@$(MAKE) test-coverage-$(DEMO)

shell:
	@if [ -z "$(DEMO)" ]; then echo "Error: use make shell DEMO=symfony7"; exit 1; fi
	@$(MAKE) shell-$(DEMO)

logs:
	@if [ -z "$(DEMO)" ]; then echo "Error: use make logs DEMO=symfony7"; exit 1; fi
	@$(MAKE) logs-$(DEMO)

verify:
	@if [ -z "$(DEMO)" ]; then echo "Error: use make verify DEMO=symfony7"; exit 1; fi
	@$(MAKE) verify-$(DEMO)

test-all:
	@for d in $(DEMOS); do $(MAKE) test-$$d || exit 1; done
	@echo "All demos passed tests."

test-coverage-all:
	@for d in $(DEMOS); do $(MAKE) test-coverage-$$d || exit 1; done
	@echo "All demos coverage done."

verify-all:
	@for d in $(DEMOS); do $(MAKE) verify-$$d; $(MAKE) down-$$d || true; done
	@echo "Verify-all done."

release-verify:
	@for d in $(DEMOS); do \
		port=$$(grep '^PORT=' $$d/.env 2>/dev/null | cut -d= -f2 | tr -d '\r'); \
		[ -z "$$port" ] && port=$$(case $$d in symfony7) echo 8007;; symfony8) echo 8008;; *) echo 8000;; esac); \
		echo "Release verify: $$d (port $$port)..."; \
		$(MAKE) up-$$d; \
		echo "Waiting for $$d to be ready..."; sleep 12; \
		code=$$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:$$port 2>/dev/null || echo "000"); \
		$(MAKE) down-$$d 2>/dev/null || true; \
		if [ "$$code" != "200" ] && [ "$$code" != "302" ]; then echo "$$d healthcheck failed (HTTP $$code)"; exit 1; fi; \
		echo "$$d OK (HTTP $$code)"; \
	done
	@echo "All demos passed release-verify."

clean:
	@for d in $(DEMOS); do rm -rf $$d/vendor $$d/var $$d/.phpunit.cache $$d/coverage; echo "Cleaned $$d"; done
	@echo "Clean done."
