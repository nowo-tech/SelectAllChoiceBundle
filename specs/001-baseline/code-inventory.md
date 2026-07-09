# Code inventory — 100% traceability

**Baseline spec**: [`spec.md`](spec.md)  
**Package**: `nowo-tech/select-all-choice-bundle`  
**Last audited**: 2026-07-07

This file proves that **every production source artifact** under `src/` is referenced by the baseline specification. PHPUnit under `tests/` is out of scope unless promoted in the spec.

## PHP classes (`src/**/*.php`)

| Source file | Spec section | Requirement IDs |
| --- | --- | --- |
| `NowoSelectAllChoiceBundle.php` | Bundle entry | FR-BUNDLE-001 |
| `DependencyInjection/Configuration.php` | Config tree | FR-CFG-001 |
| `DependencyInjection/SelectAllChoiceExtension.php` | DI extension + theme prepend | FR-CFG-002 |
| `DependencyInjection/Compiler/TwigPathsPass.php` | Twig namespace paths | FR-DI-002, FR-TWIG-001 |
| `Form/Extension/ChoiceTypeSelectAllExtension.php` | ChoiceType extension | FR-FORM-001 |
| `Twig/NowoSelectAllChoiceTwigExtension.php` | Asset path helper | FR-TWIG-EXT-001 |

## Symfony config (`src/Resources/config/`)

| Source file | Spec section | Requirement IDs |
| --- | --- | --- |
| `Resources/config/services.yaml` | Service wiring | FR-DI-001 |

## Form themes (`src/Resources/views/Form/`)

| Source file | Spec section | Requirement IDs |
| --- | --- | --- |
| `Resources/views/Form/_select_all_choice_wrapper.html.twig` | Shared wrapper partial | FR-TWIG-THEME-001 |
| `Resources/views/Form/select_all_choice_theme.html.twig` | Default div layout | FR-TWIG-THEME-001 |
| `Resources/views/Form/select_all_choice_theme_table.html.twig` | Table layout | FR-TWIG-THEME-001 |
| `Resources/views/Form/select_all_choice_theme_bootstrap3.html.twig` | Bootstrap 3 | FR-TWIG-THEME-002 |
| `Resources/views/Form/select_all_choice_theme_bootstrap3_horizontal.html.twig` | Bootstrap 3 horizontal | FR-TWIG-THEME-002 |
| `Resources/views/Form/select_all_choice_theme_bootstrap4.html.twig` | Bootstrap 4 | FR-TWIG-THEME-002 |
| `Resources/views/Form/select_all_choice_theme_bootstrap4_horizontal.html.twig` | Bootstrap 4 horizontal | FR-TWIG-THEME-002 |
| `Resources/views/Form/select_all_choice_theme_bootstrap5.html.twig` | Bootstrap 5 | FR-TWIG-THEME-002 |
| `Resources/views/Form/select_all_choice_theme_bootstrap5_horizontal.html.twig` | Bootstrap 5 horizontal | FR-TWIG-THEME-002 |
| `Resources/views/Form/select_all_choice_theme_foundation5.html.twig` | Foundation 5 | FR-TWIG-THEME-003 |
| `Resources/views/Form/select_all_choice_theme_foundation6.html.twig` | Foundation 6 | FR-TWIG-THEME-003 |
| `Resources/views/Form/select_all_choice_theme_tailwind2.html.twig` | Tailwind 2 | FR-TWIG-THEME-003 |

## TypeScript production (`src/Resources/assets/`)

| Source file | Spec section | Requirement IDs |
| --- | --- | --- |
| `Resources/assets/src/select-all-choice-lib.ts` | Core select-all logic | FR-ASSET-LIB-001 |
| `Resources/assets/src/nowo-select-all-choice-element.ts` | Custom element | FR-ASSET-WC-001 |
| `Resources/assets/src/select-all-choice.ts` | Standalone entry | FR-ASSET-ENTRY-001 |
| `Resources/assets/src/logger.ts` | Frontend logger | FR-ASSET-LOGGER-001 |
| `Resources/assets/controllers/select_all_controller.ts` | Stimulus controller | FR-ASSET-STIMULUS-001 |

## TypeScript co-located tests (`src/Resources/assets/`)

| Source file | Spec section | Requirement IDs |
| --- | --- | --- |
| `Resources/assets/src/logger.test.ts` | Vitest: logger | FR-TEST-001 |
| `Resources/assets/src/nowo-select-all-choice-element.test.ts` | Vitest: custom element | FR-TEST-001 |
| `Resources/assets/src/select-all-choice-lib.test.ts` | Vitest: core lib | FR-TEST-001 |
| `Resources/assets/controllers/select_all_controller.test.ts` | Vitest: Stimulus | FR-TEST-001 |

## Legacy compiled JS (`src/Resources/public/`)

| Source file | Spec section | Requirement IDs |
| --- | --- | --- |
| `Resources/public/select-all-choice.js` | IIFE bundle (no bundler) | FR-ASSET-LEGACY-001, FR-BUILD-001 |

## Translations — `form.select_all` (`src/Resources/translations/`, 60 locales)

| Source file | Spec section | Requirement IDs |
| --- | --- | --- |
| `Resources/translations/NowoSelectAllChoiceBundle.af.yaml` | Afrikaans | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.am.yaml` | Amharic | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.ar.yaml` | Arabic | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.az.yaml` | Azerbaijani | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.bg.yaml` | Bulgarian | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.bn.yaml` | Bengali | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.ca.yaml` | Catalan | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.cs.yaml` | Czech | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.cy.yaml` | Welsh | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.da.yaml` | Danish | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.de.yaml` | German | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.el.yaml` | Greek | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.en.yaml` | English | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.es.yaml` | Spanish | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.et.yaml` | Estonian | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.eu.yaml` | Basque | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.fa.yaml` | Persian | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.fi.yaml` | Finnish | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.fr.yaml` | French | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.gl.yaml` | Galician | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.he.yaml` | Hebrew | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.hi.yaml` | Hindi | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.hr.yaml` | Croatian | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.hu.yaml` | Hungarian | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.hy.yaml` | Armenian | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.id.yaml` | Indonesian | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.is.yaml` | Icelandic | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.it.yaml` | Italian | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.ja.yaml` | Japanese | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.ka.yaml` | Georgian | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.km.yaml` | Khmer | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.ko.yaml` | Korean | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.lt.yaml` | Lithuanian | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.lv.yaml` | Latvian | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.mk.yaml` | Macedonian | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.ms.yaml` | Malay | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.mt.yaml` | Maltese | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.ne.yaml` | Nepali | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.nl.yaml` | Dutch | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.no.yaml` | Norwegian | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.pl.yaml` | Polish | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.pt.yaml` | Portuguese | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.pt_BR.yaml` | Portuguese (Brazil) | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.ro.yaml` | Romanian | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.ru.yaml` | Russian | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.sk.yaml` | Slovak | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.sl.yaml` | Slovenian | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.sq.yaml` | Albanian | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.sr.yaml` | Serbian | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.sv.yaml` | Swedish | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.sw.yaml` | Swahili | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.ta.yaml` | Tamil | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.te.yaml` | Telugu | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.th.yaml` | Thai | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.tr.yaml` | Turkish | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.uk.yaml` | Ukrainian | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.ur.yaml` | Urdu | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.vi.yaml` | Vietnamese | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.zh_CN.yaml` | Chinese (Simplified) | FR-I18N-001 |
| `Resources/translations/NowoSelectAllChoiceBundle.zh_TW.yaml` | Chinese (Traditional) | FR-I18N-001 |

## Coverage summary

| Category | Files | Mapped |
| --- | ---: | ---: |
| PHP classes | 6 | 6 |
| YAML config | 1 | 1 |
| Form themes (Twig) | 12 | 12 |
| TS production | 5 | 5 |
| TS co-located tests | 4 | 4 |
| Legacy JS | 1 | 1 |
| Translations | 60 | 60 |
| **Total `src/` artifacts** | **89** | **89** |
