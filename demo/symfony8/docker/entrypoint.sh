#!/bin/sh
set -e

# FRANKENPHP_MODE: classic | worker. Default: worker (REQ-DEMO-010).
# Set via .env / Compose only — not baked into the image ENV.
# Leave FRANKENPHP_RESET_KERNEL unset/false so the kernel is reused (default).
MODE="${FRANKENPHP_MODE:-worker}"
case "$MODE" in
	classic)
		cp /etc/frankenphp/Caddyfile.dev /etc/frankenphp/Caddyfile
		;;
	worker)
		# Image default Caddyfile is worker (Dockerfile COPY). After changing
		# FRANKENPHP_MODE, recreate the container (`docker compose up -d`).
		;;
	*)
		echo "Unknown FRANKENPHP_MODE=$MODE (expected classic|worker)" >&2
		exit 1
		;;
esac
echo "FrankenPHP mode: $MODE"

cd /app
mkdir -p var/cache var/log var
chmod -R 777 var 2>/dev/null || true

# Ensure .env exists so Symfony does not throw PathException (e.g. when started without make up)
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "Created .env from .env.example"
    else
        echo "APP_ENV=dev" > .env
        echo "APP_SECRET=change-me" >> .env
        echo "PORT=8008" >> .env
        echo "Created minimal .env"
    fi
fi

if [ ! -f vendor/autoload_runtime.php ]; then
    echo "Installing dependencies..."
    composer install --no-interaction
    echo "Composer install done."
fi

# Clear Symfony cache on startup in dev so template/config changes are reflected
if [ "${APP_ENV:-}" = "dev" ] && [ -f bin/console ]; then
    php bin/console cache:clear --no-warmup 2>/dev/null || true
fi

exec frankenphp run --config /etc/frankenphp/Caddyfile --adapter caddyfile
