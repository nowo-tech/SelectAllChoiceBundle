# Makefile to manage SelectAllChoiceBundle demos
.PHONY: help release-verify
.PHONY: up-symfony7 up-symfony8 down-symfony7 down-symfony8
.PHONY: docker-up-symfony7 docker-up-symfony8 docker-down-symfony7 docker-down-symfony8
.PHONY: docker-restart-symfony7 docker-restart-symfony8 docker-build-symfony7 docker-build-symfony8
.PHONY: docker-install-symfony7 docker-install-symfony8 docker-update-bundle-symfony7 docker-update-bundle-symfony8

DEMOS := symfony7 symfony8

help:
	@echo "SelectAllChoiceBundle - Demos"
	@echo "Demos: $(DEMOS)"
	@echo ""
	@echo "With Docker (from demo/ folder):"
	@echo "  docker-up-symfony7   Start container demo/symfony7 (http://localhost:8007)"
	@echo "  docker-up-symfony8   Start container demo/symfony8 (http://localhost:8008)"
	@echo "  docker-down-symfony7 / docker-down-symfony8   Stop container"
	@echo "  docker-restart-*     Restart container"
	@echo "  docker-build-*      Rebuild image (no cache)"
	@echo "  docker-install-*    composer install in container"
	@echo "  docker-update-bundle-*  Update bundle from path repo"
	@echo "  release-verify      Start each demo, healthcheck (HTTP 200), then stop"
	@echo ""

release-verify:
	@for d in $(DEMOS); do \
		port=$$(grep '^PORT=' $$d/.env 2>/dev/null | cut -d= -f2 | tr -d '\r'); \
		[ -z "$$port" ] && port=$$(case $$d in symfony7) echo 8007;; symfony8) echo 8008;; *) echo 8000;; esac); \
		echo "Release verify: $$d (port $$port)..."; \
		$(MAKE) docker-up-$$d; \
		echo "Waiting for $$d to be ready..."; sleep 12; \
		code=$$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:$$port 2>/dev/null || echo "000"); \
		$(MAKE) docker-down-$$d 2>/dev/null || true; \
		if [ "$$code" != "200" ]; then echo "$$d healthcheck failed (HTTP $$code)"; exit 1; fi; \
		echo "$$d OK (HTTP $$code)"; \
	done
	@echo "All demos passed release-verify."

docker-up-symfony7:
	$(MAKE) -C symfony7 up

docker-up-symfony8:
	$(MAKE) -C symfony8 up

docker-down-symfony7:
	$(MAKE) -C symfony7 down

docker-down-symfony8:
	$(MAKE) -C symfony8 down

docker-restart-symfony7:
	$(MAKE) -C symfony7 restart

docker-restart-symfony8:
	$(MAKE) -C symfony8 restart

docker-build-symfony7:
	$(MAKE) -C symfony7 build

docker-build-symfony8:
	$(MAKE) -C symfony8 build

docker-install-symfony7:
	$(MAKE) -C symfony7 install

docker-install-symfony8:
	$(MAKE) -C symfony8 install

docker-update-bundle-symfony7:
	$(MAKE) -C symfony7 update-bundle

docker-update-bundle-symfony8:
	$(MAKE) -C symfony8 update-bundle
