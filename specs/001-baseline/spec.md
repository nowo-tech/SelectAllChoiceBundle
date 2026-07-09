# Feature Specification: SelectAllChoiceBundle baseline (100% code coverage)

**Feature Branch**: `001-baseline`  
**Created**: 2026-07-07  
**Status**: Active  
**Input**: Backfill GitHub Spec Kit baseline documenting 100% of production code in `src/`.

**Related docs**: [`docs/SPEC-DRIVEN-DEVELOPMENT.md`](../../docs/SPEC-DRIVEN-DEVELOPMENT.md), [`docs/CONFIGURATION.md`](../../docs/CONFIGURATION.md), [`docs/USAGE.md`](../../docs/USAGE.md)  
**Code inventory (traceability)**: [`code-inventory.md`](code-inventory.md)

---

## Summary

**Package**: `nowo-tech/select-all-choice-bundle`  
**Configuration root**: `nowo_select_all_choice`

Symfony bundle that adds an opt-in **Select all** control to `ChoiceType` fields with `multiple=true`, for both expanded checkboxes and `<select multiple>`. Supports eleven form themes, Stimulus + custom element, standalone JS, and 60 translation locales.

---

## User Scenarios & Testing

See user stories US-01…US-05 in [`docs/SPEC-DRIVEN-DEVELOPMENT.md`](../../docs/SPEC-DRIVEN-DEVELOPMENT.md).

### User Story 1 — Opt-in per field (Priority: P1)

**Given** a form field `->add('tags', ChoiceType::class, ['multiple' => true, 'select_all' => true])`, **When** the form renders, **Then** a master toggle appears above/below choices per `select_all_position`.

### User Story 2 — Sync indeterminate state (Priority: P1)

**Given** some but not all choices checked, **When** the user interacts, **Then** the master checkbox shows indeterminate until all/none are selected.

### User Story 3 — Dynamic DOM (Priority: P2)

**Given** choices added via Turbo/AJAX, **When** `MutationObserver` detects changes, **Then** select-all state recalculates without page reload.

### User Story 4 — Theme selection (Priority: P2)

**Given** `nowo_select_all_choice.form_theme=bootstrap5`, **When** the extension loads, **Then** the matching theme block is prepended to `twig.form_themes`.

---

## Requirements

### Bundle & configuration

- **FR-BUNDLE-001**: `NowoSelectAllChoiceBundle` MUST register `TwigPathsPass`.
- **FR-CFG-001**: Config MUST define `default_label`, `default_position`, CSS classes, `translation_domain`, `form_theme`, `debug`.
- **FR-CFG-002**: Extension MUST publish parameters and prepend the configured form theme.
- **FR-DI-001 / FR-DI-002**: Service wiring and Twig path registration per inventory.

### Form layer

- **FR-FORM-001**: `ChoiceTypeSelectAllExtension` MUST add options `select_all`, `select_all_label`, `select_all_position`, CSS classes; filter nulls on `PRE_SUBMIT`; expose Twig vars only when enabled.

### Twig

- **FR-TWIG-001**: Namespace `NowoSelectAllChoiceBundle` MUST allow app overrides.
- **FR-TWIG-EXT-001**: `nowo_select_all_choice_asset_path()` MUST resolve public bundle assets safely (no path traversal).
- **FR-TWIG-THEME-001**: Default + table themes MUST wrap choices in `<nowo-select-all-choice>` with Stimulus `select-all` controller.
- **FR-TWIG-THEME-002 / FR-TWIG-THEME-003**: Bootstrap and Foundation/Tailwind themes MUST extend the correct Symfony parent layouts.

### Frontend assets

- **FR-ASSET-LIB-001**: Core library MUST create toggle, sync all/none, handle indeterminate, observe DOM mutations.
- **FR-ASSET-WC-001**: Custom element MUST delegate to library on `connectedCallback`.
- **FR-ASSET-STIMULUS-001**: Stimulus controller MUST register element and init container on connect.
- **FR-ASSET-ENTRY-001**: Standalone entry MUST define element and expose `window.NowoSelectAllChoice`.
- **FR-ASSET-LOGGER-001**: Logger MUST honour debug flag from config/data attributes.
- **FR-ASSET-LEGACY-001**: `select-all-choice.js` MUST ship IIFE for projects without a bundler.
- **FR-TEST-001**: Co-located Vitest files MUST cover lib, element, controller, logger.
- **FR-I18N-001**: All 60 locale files MUST define `form.select_all` under domain `NowoSelectAllChoiceBundle`.

---

## Success Criteria

- **SC-001**: **89/89** files mapped in [`code-inventory.md`](code-inventory.md).
- **SC-002**: Config keys match [`docs/CONFIGURATION.md`](../../docs/CONFIGURATION.md).
- **SC-003**: PHPUnit + Vitest + PHPStan pass in CI.
- **SC-004**: Partial/indeterminate selection behaviour covered by tests.

---

## Out of scope

- Single-choice fields, non-ChoiceType widgets, server-side validation of “all selected” semantics.
