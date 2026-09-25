# FrankenPHP worker mode audit (`FRANKENPHP_RESET_KERNEL` unset/false)

| Field | Value |
|-------|-------|
| Package | `nowo-tech/select-all-choice-bundle` (`symfony-bundle`) |
| Audited revision | `v1.5.5` |
| Audit date | 2026-09-25 |
| Method | Manual review of every PHP file under `src/` (form type extension, Twig extension, DI extension, configuration, compiler pass, bundle class) and `src/Resources/config/services.yaml`; PHPStan classic + `ruleset-worker-no-kernel-reset` + hardening |
| **Verdict** | ✅ **100% compatible** with FrankenPHP worker mode and **`FRANKENPHP_RESET_KERNEL` unset/false** (scenario A below; also safe under B) |

## Execution model assumed

FrankenPHP worker mode boots the Symfony kernel once per worker and serves many requests with the same container. This audit targets the **default throughput profile**: `FRANKENPHP_RESET_KERNEL` is **unset or false**, so the kernel instance is reused. `services_resetter` still clears services that implement `ResetInterface` / are tagged `kernel.reset`. Scenarios:

- **A — `FRANKENPHP_RESET_KERNEL` unset/false (default):** kernel reused; `services_resetter` runs for `ResetInterface` / `kernel.reset`.
- **B — no reset at all:** nothing is reset; any per-request state kept in a service leaks into the next request.
- **C — `FRANKENPHP_RESET_KERNEL=1`:** kernel cloned each request (escape hatch; costly). Prefer fixing state over relying on this.

A bundle that is safe under **B** is safe under **A** and under classic mode / PHP-FPM.

## Summary

| Area | Status | Notes |
|------|--------|-------|
| Mutable state in shared services | ✅ | `ChoiceTypeSelectAllExtension` only has `readonly` config properties; `NowoSelectAllChoiceTwigExtension` has no properties |
| Static properties / `static` locals | ✅ | None; only class constants and `static` closures with no captured mutable state |
| `ResetInterface` / `kernel.reset` coverage | ✅ N/A | Nothing to reset — services are stateless |
| Request / user / locale captured in services | ✅ | Nothing request-scoped is read; options and view vars are per form |
| Superglobals, `$_ENV`, `putenv`, `ini_set`, `setlocale`, timezone | ✅ | None used; config is compiled into container parameters |
| Doctrine / EntityManager | ✅ N/A | No persistence |
| Output, headers, `exit`, shutdown functions | ✅ | None |
| Resources (files, sockets, cURL) held open | ✅ | None |
| Memory growth across requests | ✅ | No caches or accumulating arrays; the `PRE_SUBMIT` listener is attached to each form builder, not to a global dispatcher |
| Blocking I/O and timeouts | ✅ N/A | No I/O |
| Third-party static state | ✅ | Only Symfony DI/Config/Form/Twig |
| PHPStan FrankenPHP rulesets | ✅ | `ruleset-classic.neon` + `ruleset-worker-no-kernel-reset.neon` + `ruleset-hardening.neon` in `phpstan.neon` |

## Services reviewed

| Service | Shared | Mutable state | Scenario A | Scenario B |
|---------|--------|---------------|------------|------------|
| `Nowo\SelectAllChoiceBundle\Form\Extension\ChoiceTypeSelectAllExtension` | yes (`form.type_extension`, autoconfigured) | none (8 `readonly` config values, `src/Form/Extension/ChoiceTypeSelectAllExtension.php`) | ✅ | ✅ |
| `Nowo\SelectAllChoiceBundle\Twig\NowoSelectAllChoiceTwigExtension` | yes (`twig.extension`) | none; pure functions over constants; no Twig globals | ✅ | ✅ |

`SelectAllChoiceExtension`, `Configuration` and `TwigPathsPass` only run at container compile time. The `PRE_SUBMIT` listener in `buildForm()` is a `static` closure bound to the form being built; it filters `null` entries from submitted data and keeps nothing.

## Findings

No findings. The package keeps no state between requests under either scenario A or B.

## Demo (REQ-DEMO-010)

Default `FRANKENPHP_MODE=worker` with image `Caddyfile` using `php_server { hot_reload; worker { file …; watch } }`. Set `FRANKENPHP_MODE=classic` to swap in `Caddyfile.dev` (no worker). Leave `FRANKENPHP_RESET_KERNEL` unset. See [DEMO-FRANKENPHP.md](DEMO-FRANKENPHP.md).

## Usage recommendations in worker mode

- No special configuration or reset hook is needed for this bundle.
- Keep host `FRANKENPHP_RESET_KERNEL` unset/false for throughput; do not rely on `=1` to paper over app state.
- Per-field options (`select_all`, `select_all_label`, CSS classes) are resolved per form; do not work around them by mutating the extension or its parameters at runtime.
- Host code that decorates or extends `ChoiceTypeSelectAllExtension` must stay stateless (or implement `ResetInterface`) to keep this verdict.

## Re-audit triggers

Re-run this audit when a change adds: properties to the form type extension or Twig extension, Twig globals, a new service or event listener, a cache, or any use of `$_SERVER` / `$_ENV` / static state at runtime.
