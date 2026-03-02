# FrankenPHP + Node for SelectAllChoiceBundle Demo (Symfony 7, Vite)
FROM dunglas/frankenphp:1-php8.4-alpine

RUN apk add --no-cache git unzip bash nodejs curl

ENV PNPM_HOME="/usr/local/share/pnpm"
RUN curl -fsSL https://get.pnpm.io/install.sh -o /tmp/pnpm-install.sh \
    && SHELL=sh PNPM_HOME=/usr/local/share/pnpm sh /tmp/pnpm-install.sh || true \
    && (test -x /usr/local/share/pnpm/pnpm && ln -sf /usr/local/share/pnpm/pnpm /usr/local/bin/pnpm) \
    || (test -x /root/.local/share/pnpm/pnpm && ln -sf /root/.local/share/pnpm/pnpm /usr/local/bin/pnpm) \
    || for d in /usr/local/share/pnpm/.tools/pnpm-exe/*/; do [ -x "$$d/pnpm" ] && ln -sf "$$d/pnpm" /usr/local/bin/pnpm && break; done
ENV PATH="/usr/local/bin:${PNPM_HOME}:${PATH}"

RUN install-php-extensions zip intl

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN git config --global --add safe.directory /app && \
    git config --global --add safe.directory /var/select-all-choice-bundle

WORKDIR /app

ENV COMPOSER_ALLOW_SUPERUSER=1
ENV PATH="/app/vendor/bin:${PATH}"
ENV SERVER_NAME=:80

COPY docker/frankenphp/Caddyfile /etc/frankenphp/Caddyfile
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
