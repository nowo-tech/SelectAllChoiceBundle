#!/bin/sh
set -e

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
        echo "PORT=8007" >> .env
        echo "Created minimal .env"
    fi
fi

if [ ! -f vendor/autoload_runtime.php ]; then
    echo "Installing dependencies..."
    composer install --no-interaction
    echo "Composer install done."
fi

exec frankenphp run --config /etc/frankenphp/Caddyfile --adapter caddyfile
