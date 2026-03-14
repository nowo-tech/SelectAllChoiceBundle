/**
 * Stimulus controller: "select-all"
 *
 * Frontend-owned: creates and manages the "Select all" toggle for multiple choice fields.
 * The backend only wraps the widget and passes config via data attributes; this controller
 * injects the checkbox, binds behaviour, syncs state and dispatches change events.
 *
 * @extends Controller
 */
import { Controller } from '@hotwired/stimulus';
import { createBundleLogger, type BundleLogger } from '../logger';

let bundleLogger: BundleLogger | null = null;

declare const __SELECT_ALL_CHOICE_BUILD_TIME__: string;

/** Injects the bundle logger (called from entry point so scriptLoaded/buildTime can be used). */
export function setBundleLogger(log: BundleLogger): void {
  bundleLogger = log;
}

/** Returns the injected logger or a default one. */
export function getLogger(): BundleLogger {
  if (bundleLogger === null) {
    bundleLogger = createBundleLogger('select-all-choice', {
      buildTime:
        /* c8 ignore next */
        typeof __SELECT_ALL_CHOICE_BUILD_TIME__ !== 'undefined' ? __SELECT_ALL_CHOICE_BUILD_TIME__ : undefined,
    });
  }
  return bundleLogger;
}

/** Data attribute for debug mode: when "1", all console logs are shown; otherwise only "script loaded". */
export const ATTR_DEBUG = 'data-select-all-debug-value';

/** Stimulus target attribute name. */
export const ATTR_TARGET = 'data-select-all-target';

/** Target value for the toggle wrapper element. */
export const TARGET_TOGGLE_WRAPPER = 'toggleWrapper';

/** Target value for the toggle checkbox. */
export const TARGET_TOGGLE = 'toggle';

/** Target value for the toggle label. */
export const TARGET_TOGGLE_LABEL = 'toggleLabel';

export default class SelectAllController extends Controller {
  /** Stimulus value definitions (position, expanded, label, toggleClass, wrapperClass, labelClass). */
  static values = {
    position: { type: String, default: 'before' },
    expanded: { type: Boolean, default: true },
    label: { type: String, default: 'Select all' },
    toggleClass: { type: String, default: 'form-check-input' },
    wrapperClass: { type: String, default: 'form-check' },
    labelClass: { type: String, default: 'form-check-label' },
  };

  /** Stimulus target: element containing the choice inputs or select. */
  static targets = ['choices'];

  declare readonly positionValue: 'before' | 'after';
  declare readonly expandedValue: boolean;
  declare readonly labelValue: string;
  declare readonly toggleClassValue: string;
  declare readonly wrapperClassValue: string;
  declare readonly labelClassValue: string;
  declare readonly hasChoicesTarget: boolean;
  declare readonly choicesTarget: HTMLElement;

  /** Reference to the "Select all" checkbox created in connect(). */
  private toggleCheckbox: HTMLInputElement | null = null;

  /** Prevents re-entrancy when we dispatch change from toggleAll (avoids infinite loop from select listener). */
  private isDispatchingFromToggle = false;

  /** Prevents re-entrancy when we dispatch change from the select listener (avoids infinite loop). */
  private isDispatchingChange = false;

  /**
   * Called when the controller is connected to the DOM.
   * Creates the toggle, syncs its state and binds change listeners.
   */
  connect(): void {
    const debugAttr = this.element.getAttribute(ATTR_DEBUG);
    getLogger().setDebug(debugAttr === '1');
    getLogger().debug('SelectAllController connect', {
      position: this.positionValue,
      expanded: this.expandedValue,
      hasChoices: this.hasChoicesTarget,
    });
    this.createToggle();
    this.syncToggleFromChoices();
    this.bindChoiceListeners();
  }

  /**
   * Creates the "Select all" checkbox and label, then inserts them in the DOM
   * before or after the choices container according to positionValue.
   */
  private createToggle(): void {
    if (!this.hasChoicesTarget) return;

    const wrapper = document.createElement('div');
    wrapper.className = this.wrapperClassValue;
    wrapper.setAttribute(ATTR_TARGET, TARGET_TOGGLE_WRAPPER);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = this.toggleClassValue;
    checkbox.setAttribute(ATTR_TARGET, TARGET_TOGGLE);
    checkbox.addEventListener('change', () => this.toggleAll());

    const labelEl = document.createElement('label');
    labelEl.className = this.labelClassValue;
    labelEl.setAttribute(ATTR_TARGET, TARGET_TOGGLE_LABEL);
    labelEl.textContent = this.labelValue;
    const id = `select-all-${Math.random().toString(36).slice(2, 9)}`;
    checkbox.id = id;
    labelEl.setAttribute('for', id);

    wrapper.appendChild(checkbox);
    wrapper.appendChild(labelEl);

    this.toggleCheckbox = checkbox;

    const parent = this.choicesTarget.parentNode;
    /* v8 ignore next */ // Defensive: Stimulus target without parent node is not a realistic runtime scenario
    if (!parent) return;
    if (this.positionValue === 'before') {
      parent.insertBefore(wrapper, this.choicesTarget);
    } else {
      parent.insertBefore(wrapper, this.choicesTarget.nextSibling);
    }
  }

  /**
   * Handles the "Select all" checkbox change: selects or deselects all options
   * (checkboxes or select options) and dispatches a change event.
   */
  toggleAll(): void {
    if (!this.toggleCheckbox) return;
    const checked = this.toggleCheckbox.checked;
    getLogger().debug('SelectAllController toggleAll', { checked, expanded: this.expandedValue });
    if (this.expandedValue) {
      this.toggleCheckboxes(checked);
    } else {
      this.toggleSelectOptions(checked);
    }
    this.isDispatchingFromToggle = true;
    try {
      this.dispatchChange();
    } finally {
      this.isDispatchingFromToggle = false;
    }
  }

  /**
   * Sets the checked state of all checkbox inputs in the choices target (expanded mode).
   * @param selected - Whether to check or uncheck the boxes
   */
  private toggleCheckboxes(selected: boolean): void {
    if (!this.hasChoicesTarget) return;
    const inputs = this.choicesTarget.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    inputs.forEach((input) => {
      input.checked = selected;
    });
  }

  /**
   * Sets the selected state of all options in the select element (collapsed mode).
   * @param selected - Whether to select or deselect the options
   */
  private toggleSelectOptions(selected: boolean): void {
    if (!this.hasChoicesTarget) return;
    const select = this.choicesTarget.querySelector<HTMLSelectElement>('select');
    if (!select) return;
    const options = select.querySelectorAll<HTMLOptionElement>('option');
    options.forEach((option) => {
      option.selected = selected;
    });
  }

  /**
   * Updates the "Select all" checkbox state (checked / unchecked / indeterminate)
   * from the current selection of individual choices.
   */
  private syncToggleFromChoices(): void {
    if (!this.toggleCheckbox) return;
    const allSelected = this.expandedValue ? this.areAllCheckboxesChecked() : this.areAllSelectOptionsSelected();
    const noneSelected = this.expandedValue ? this.areAllCheckboxesUnchecked() : this.areAllSelectOptionsUnselected();
    this.toggleCheckbox.checked = allSelected;
    this.toggleCheckbox.indeterminate = !allSelected && !noneSelected;
  }

  /** @returns true if every checkbox in the choices target is checked */
  private areAllCheckboxesChecked(): boolean {
    if (!this.hasChoicesTarget) return false;
    const inputs = this.choicesTarget.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    if (inputs.length === 0) return false;
    return Array.from(inputs).every((input) => input.checked);
  }

  /** @returns true if every checkbox in the choices target is unchecked */
  private areAllCheckboxesUnchecked(): boolean {
    if (!this.hasChoicesTarget) return true;
    const inputs = this.choicesTarget.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    return Array.from(inputs).every((input) => !input.checked);
  }

  /** @returns true if every option in the select is selected */
  private areAllSelectOptionsSelected(): boolean {
    if (!this.hasChoicesTarget) return false;
    const select = this.choicesTarget.querySelector<HTMLSelectElement>('select');
    if (!select) return false;
    const options = Array.from(select.querySelectorAll<HTMLOptionElement>('option'));
    if (options.length === 0) return false;
    return options.every((opt) => opt.selected);
  }

  /** @returns true if no option in the select is selected */
  private areAllSelectOptionsUnselected(): boolean {
    if (!this.hasChoicesTarget) return true;
    const select = this.choicesTarget.querySelector<HTMLSelectElement>('select');
    if (!select) return true;
    const options = select.querySelectorAll<HTMLOptionElement>('option');
    return Array.from(options).every((opt) => !opt.selected);
  }

  /**
   * Binds change listeners to each choice (checkboxes or the select) so that
   * the toggle state is synced and a change event is dispatched when the user
   * selects or deselects individual options.
   */
  private bindChoiceListeners(): void {
    if (!this.hasChoicesTarget) return;
    if (this.expandedValue) {
      this.choicesTarget.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach((input) => {
        input.addEventListener('change', () => {
          this.syncToggleFromChoices();
          this.dispatchChange();
        });
      });
    } else {
      const select = this.choicesTarget.querySelector<HTMLSelectElement>('select');
      if (select) {
        select.addEventListener('change', () => {
          this.syncToggleFromChoices();
          if (!this.isDispatchingFromToggle && !this.isDispatchingChange) {
            this.dispatchChange();
          }
        });
      }
    }
  }

  /**
   * Dispatches a native change event with bubbles: true on the choices container
   * or the select element, so other scripts (e.g. validators, TomSelect) can react.
   */
  private dispatchChange(): void {
    if (!this.hasChoicesTarget) return;
    const el: HTMLElement | null = this.expandedValue
      ? this.choicesTarget
      : this.choicesTarget.querySelector<HTMLSelectElement>('select');
    if (el) {
      this.isDispatchingChange = true;
      try {
        el.dispatchEvent(new Event('change', { bubbles: true }));
      } finally {
        this.isDispatchingChange = false;
      }
    }
  }
}

