# SelectAllChoiceBundle demos

Demo for **Symfony 8** that shows the "Select all" choice field in use. It uses **Vite** and **TypeScript** to build the frontend and the bundle’s Stimulus controller.

## Quick start (Docker)

From the **bundle root**:

```bash
make up-symfony8
```

Then open http://localhost:8008. The first run installs Composer deps and runs `pnpm install` and `pnpm build` (Vite compiles the app and bundle TypeScript).

From the **demo** folder:

```bash
cd symfony8 && make up
# App: http://localhost:8008
```

## Demos

| Demo      | Port | Description                                                                 |
|-----------|------|-----------------------------------------------------------------------------|
| symfony8  | 8008 | Symfony 8.x + Select all (expanded & collapsed), Vite + Stimulus, Web Profiler (dev) |

## Language switch (locale by route)

The demo uses **locale in the URL**: the main route is `/{_locale}` with `_locale` restricted to `en|es`.

- **By URL**: open `http://localhost:8008/en` or `http://localhost:8008/es`. The root `/` redirects to `/en`.
- **In the UI**: use the **Language** dropdown in the top-right of the navbar to switch between English and Español; it links to the same route with the chosen `_locale`.

Translations live in `translations/messages.en.yaml` and `translations/messages.es.yaml`; the bundle’s “Select all” label uses the domain `NowoSelectAllChoiceBundle` (see [Configuration](../docs/CONFIGURATION.md)).

## Requirements

- Docker and Docker Compose
- The bundle is mounted from the repo (`../..` → `/var/select-all-choice-bundle`) so bundle code changes are reflected after `make update-bundle` or rebuilding assets with `make assets`.

## Makefile targets (from demo/)

- `make up-symfony8` – start the demo (Composer + Vite build)
- `make down-symfony8` – stop the demo
- `make release-verify` – start each demo, HTTP 200 healthcheck, then stop (for CI/release)

See the demo’s `README.md` for `install`, `assets`, `update-bundle`, `test`, `shell`.
