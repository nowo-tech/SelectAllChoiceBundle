# Security policy

## Table of contents

- [Supported versions](#supported-versions)
- [Reporting a vulnerability](#reporting-a-vulnerability)
- [Scope and attack surface](#scope-and-attack-surface)
- [Threat model and mitigations](#threat-model-and-mitigations)
- [Logging](#logging)
- [Dependencies and updates](#dependencies-and-updates)
- [Release security checklist (12.4.1)](#release-security-checklist-1241)

## Supported versions

Security fixes are applied to the current major version line. Please upgrade to the latest patch release to receive security updates.

## Reporting a vulnerability

If you discover a security issue, please report it responsibly:

1. **Do not** open a public GitHub issue for security-sensitive bugs.
2. Send details to the maintainers (e.g. via the contact information on the [repository](https://github.com/nowo-tech/SelectAllChoiceBundle) or the Nowo.tech website).
3. Include a clear description, steps to reproduce, and the impact of the issue.
4. Allow time for a fix and coordinated disclosure before any public disclosure.

We will acknowledge your report and work on a fix. We appreciate responsible disclosure and will credit reporters when the issue is fixed (unless you prefer to remain anonymous).

## Scope and attack surface

The bundle adds an optional "Select all" toggle to `ChoiceType` fields with `multiple: true`. Server side, `ChoiceTypeSelectAllExtension` only adds view variables / `data-*` attributes (enabled flag, label, position); the browser-side Stimulus controller creates the toggle and checks or unchecks the existing options. It adds **no routes, no controllers and no persistence**.

| Input | Where |
| --- | --- |
| Form type options (`select_all`, label, position) | Set by the host application code, not by end users |
| Bundle configuration (`nowo_select_all_choice.*`) | Host configuration |
| Submitted choice values | Unchanged: validated by Symfony's `ChoiceType` against the configured choices |

## Threat model and mitigations

| Threat | Assessment / mitigation |
| --- | --- |
| Submitting values outside the allowed choices | Not possible through the toggle: it only (un)checks the options already rendered; the server-side `ChoiceType` validation still rejects unknown values |
| XSS through the toggle label | The label is a translated string escaped by Twig into a `data-*` attribute; the controller writes it with `textContent`, never as HTML |
| CSRF | Unchanged: the host form keeps its own CSRF token; the bundle does not submit anything |
| Worker-mode state leaks (FrankenPHP) | Stateless services; see FRANKENPHP-WORKER-AUDIT.md |
| CSP | The controller is a static ES module (no `eval`, no inline scripts) and works under a strict `script-src` |

## Logging

The bundle logs nothing (no runtime warning or error paths); the Stimulus controller uses the bundle logger only in debug mode, without form values.

## Dependencies and updates

`composer audit` and `pnpm audit` (root and demo) run before each release; Dependabot PRs are reviewed and merged or closed with a reason (REQ-REL-003). Rebuilt assets (`src/Resources/public`) are committed with the dependency update that changed them.

## Release security checklist (12.4.1)

Before tagging a release, confirm:

| Item | Notes |
|------|--------|
| **SECURITY.md** | This document is current and linked from the README where applicable. |
| **`.gitignore` and `.env`** | `.env` and local env files are ignored; no committed secrets. |
| **No secrets in repo** | No API keys, passwords, or tokens in tracked files. |
| **Recipe / Flex** | Default recipe or installer templates do not ship production secrets. |
| **Input / output** | Inputs validated; outputs escaped in Twig/templates where user-controlled. |
| **Dependencies** | `composer audit` and `pnpm audit` (root + demo) run; issues triaged. |
| **Logging** | Logs do not print secrets, tokens, or session identifiers unnecessarily. |
| **Cryptography** | If used: keys from secure config; never hardcoded. |
| **Permissions / exposure** | Routes and admin features documented; roles configured for production. |
| **Limits / DoS** | Timeouts, size limits, rate limits where applicable. |
| **AI security audit (REQ-SEC-004)** | Latest recorded grade in the nowo-tech bundles security analysis catalog (`BUNDLES_SECURITY_ANALYSIS.md`); re-run when the form extension or the Stimulus controller change their inputs or outputs. |

Record confirmation in the release PR or tag notes.

