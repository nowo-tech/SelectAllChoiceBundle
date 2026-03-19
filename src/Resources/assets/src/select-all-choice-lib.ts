/**
 * Select-all choice widget: logic for "Select all" toggle (expanded checkboxes or collapsed select).
 * Used by the standalone script (runInitAndObserve) and by the Stimulus controller.
 * Entry point for standalone is select-all-choice.ts; controller is in controllers/select_all_controller.ts.
 */

import { createBundleLogger, type BundleLogger } from './logger';

let bundleLogger: BundleLogger | null = null;

/** Injects the bundle logger (called from entry point so scriptLoaded/buildTime can be used). */
export function setBundleLogger(log: BundleLogger): void {
  bundleLogger = log;
}

/** Returns the injected logger or a default one. */
export function getLogger(): BundleLogger {
  if (bundleLogger === null) {
    bundleLogger = createBundleLogger('select-all-choice');
  }
  return bundleLogger;
}

/** Data attribute for debug mode: when "1", all console logs are shown; otherwise only "script loaded". */
export const ATTR_DEBUG = 'data-select-all-debug-value';

/** Data attribute for the init marker (avoids double init). */
export const ATTR_INIT = 'data-select-all-init';

/** Stimulus target attribute name. */
export const ATTR_TARGET = 'data-select-all-target';

/** Target value for the toggle wrapper element. */
export const TARGET_TOGGLE_WRAPPER = 'toggleWrapper';

/** Target value for the toggle checkbox. */
export const TARGET_TOGGLE = 'toggle';

/** Target value for the toggle label. */
export const TARGET_TOGGLE_LABEL = 'toggleLabel';

/** Selector for container elements (standalone script and controller). */
export const SELECTOR_CONTAINER = '[data-controller*="select-all"]';

export type ContainerConfig = {
  position: 'before' | 'after';
  expanded: boolean;
  label: string;
  toggleClass: string;
  wrapperClass: string;
  labelClass: string;
  debug: boolean;
};

type ContainerState = {
  toggleCheckbox: HTMLInputElement | null;
  isDispatchingFromToggle: boolean;
  isDispatchingChange: boolean;
};

const stateByContainer = new WeakMap<HTMLElement, ContainerState>();

function getState(container: HTMLElement): ContainerState {
  let state = stateByContainer.get(container);
  if (!state) {
    state = {
      toggleCheckbox: null,
      isDispatchingFromToggle: false,
      isDispatchingChange: false,
    };
    stateByContainer.set(container, state);
  }
  return state;
}

function getConfig(element: HTMLElement): ContainerConfig {
  const get = (attr: string, def: string) => element.getAttribute(attr) ?? def;
  const position = (get('data-select-all-position-value', 'before') === 'after' ? 'after' : 'before') as 'before' | 'after';
  const expanded = get('data-select-all-expanded-value', 'true') === 'true';
  return {
    position,
    expanded,
    label: get('data-select-all-label-value', 'Select all'),
    toggleClass: get('data-select-all-toggle-class-value', 'form-check-input'),
    wrapperClass: get('data-select-all-wrapper-class-value', 'form-check'),
    labelClass: get('data-select-all-label-class-value', 'form-check-label'),
    debug: get('data-select-all-debug-value', '0') === '1',
  };
}

function findChoices(container: HTMLElement): HTMLElement | null {
  return container.querySelector<HTMLElement>(`[${ATTR_TARGET}="choices"]`);
}

function createToggle(container: HTMLElement, config: ContainerConfig, choicesEl: HTMLElement): HTMLInputElement | null {
  const wrapper = document.createElement('div');
  wrapper.className = config.wrapperClass;
  wrapper.setAttribute(ATTR_TARGET, TARGET_TOGGLE_WRAPPER);

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = config.toggleClass;
  checkbox.setAttribute(ATTR_TARGET, TARGET_TOGGLE);

  const labelEl = document.createElement('label');
  labelEl.className = config.labelClass;
  labelEl.setAttribute(ATTR_TARGET, TARGET_TOGGLE_LABEL);
  labelEl.textContent = config.label;
  const id = `select-all-${Math.random().toString(36).slice(2, 9)}`;
  checkbox.id = id;
  labelEl.setAttribute('for', id);

  wrapper.appendChild(checkbox);
  wrapper.appendChild(labelEl);

  const parent = choicesEl.parentNode;
  if (!parent) return null;
  if (config.position === 'before') {
    parent.insertBefore(wrapper, choicesEl);
  } else {
    parent.insertBefore(wrapper, choicesEl.nextSibling);
  }
  return checkbox;
}

function areAllCheckboxesChecked(choicesEl: HTMLElement): boolean {
  const inputs = choicesEl.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
  if (inputs.length === 0) return false;
  return Array.from(inputs).every((input) => input.checked);
}

function areAllCheckboxesUnchecked(choicesEl: HTMLElement): boolean {
  const inputs = choicesEl.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
  return Array.from(inputs).every((input) => !input.checked);
}

function areAllSelectOptionsSelected(choicesEl: HTMLElement): boolean {
  const select = choicesEl.querySelector<HTMLSelectElement>('select');
  if (!select) return false;
  const options = Array.from(select.querySelectorAll<HTMLOptionElement>('option'));
  if (options.length === 0) return false;
  return options.every((opt) => opt.selected);
}

function areAllSelectOptionsUnselected(choicesEl: HTMLElement): boolean {
  const select = choicesEl.querySelector<HTMLSelectElement>('select');
  if (!select) return true;
  const options = select.querySelectorAll<HTMLOptionElement>('option');
  return Array.from(options).every((opt) => !opt.selected);
}

function syncToggleFromChoices(
  checkbox: HTMLInputElement,
  choicesEl: HTMLElement,
  expanded: boolean,
): void {
  const allSelected = expanded ? areAllCheckboxesChecked(choicesEl) : areAllSelectOptionsSelected(choicesEl);
  const noneSelected = expanded ? areAllCheckboxesUnchecked(choicesEl) : areAllSelectOptionsUnselected(choicesEl);
  checkbox.checked = allSelected;
  checkbox.indeterminate = !allSelected && !noneSelected;
}

function toggleCheckboxes(choicesEl: HTMLElement, selected: boolean): void {
  const inputs = choicesEl.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
  inputs.forEach((input) => {
    input.checked = selected;
  });
}

function toggleSelectOptions(choicesEl: HTMLElement, selected: boolean): void {
  const select = choicesEl.querySelector<HTMLSelectElement>('select');
  if (!select) return;
  const options = select.querySelectorAll<HTMLOptionElement>('option');
  options.forEach((option) => {
    option.selected = selected;
  });
}

function dispatchChange(choicesEl: HTMLElement, expanded: boolean, state: ContainerState): void {
  const el: HTMLElement | null = expanded
    ? choicesEl
    : choicesEl.querySelector<HTMLSelectElement>('select');
  if (el) {
    state.isDispatchingChange = true;
    try {
      el.dispatchEvent(new Event('change', { bubbles: true }));
    } finally {
      state.isDispatchingChange = false;
    }
  }
}

/**
 * Initializes one "select-all" container: creates the toggle, syncs state, binds listeners.
 * Idempotent: if the container is already initialized (data-select-all-init="1"), returns false.
 *
 * @param element - Root element with data-controller*="select-all" and data-select-all-* attributes.
 * @returns true if initialization ran, false if skipped (e.g. already initialized or no choices target).
 */
export function initSelectAllContainer(element: HTMLElement): boolean {
  if (element.getAttribute(ATTR_INIT) === '1') {
    getLogger().debug('initSelectAllContainer: already initialized, skip');
    return false;
  }

  const config = getConfig(element);
  getLogger().setDebug(config.debug);
  getLogger().debug('initSelectAllContainer', {
    position: config.position,
    expanded: config.expanded,
    label: config.label,
  });

  const choicesEl = findChoices(element);
  if (!choicesEl) {
    getLogger().warn('initSelectAllContainer: no choices target found');
    return false;
  }

  element.setAttribute(ATTR_INIT, '1');
  const state = getState(element);

  const checkbox = createToggle(element, config, choicesEl);
  if (!checkbox) return true;
  state.toggleCheckbox = checkbox;

  checkbox.addEventListener('change', () => {
    const checked = checkbox.checked;
    getLogger().debug('toggleAll', { checked, expanded: config.expanded });
    if (config.expanded) {
      toggleCheckboxes(choicesEl, checked);
    } else {
      toggleSelectOptions(choicesEl, checked);
    }
    state.isDispatchingFromToggle = true;
    try {
      dispatchChange(choicesEl, config.expanded, state);
    } finally {
      state.isDispatchingFromToggle = false;
    }
  });

  syncToggleFromChoices(checkbox, choicesEl, config.expanded);

  if (config.expanded) {
    const checkboxes = choicesEl.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    getLogger().debug('initSelectAllContainer: bound change listeners to checkboxes', { count: checkboxes.length });
    checkboxes.forEach((input) => {
      input.addEventListener('change', () => {
        syncToggleFromChoices(checkbox, choicesEl, config.expanded);
        dispatchChange(choicesEl, config.expanded, state);
      });
    });
  } else {
    const select = choicesEl.querySelector<HTMLSelectElement>('select');
    if (select) {
      getLogger().debug('initSelectAllContainer: bound change listener to select');
      select.addEventListener('change', () => {
        syncToggleFromChoices(checkbox, choicesEl, config.expanded);
        if (!state.isDispatchingFromToggle && !state.isDispatchingChange) {
          dispatchChange(choicesEl, config.expanded, state);
        }
      });
    } else {
      getLogger().warn('initSelectAllContainer: expanded=false but no select in choices target');
    }
  }

  getLogger().debug('initSelectAllContainer: done', { expanded: config.expanded });
  return true;
}

/**
 * Initializes all [data-controller*="select-all"] elements in the document.
 * Sets debug from the first container's data-select-all-debug-value.
 */
export function runInit(): void {
  const containers = document.querySelectorAll<HTMLElement>(SELECTOR_CONTAINER);
  getLogger().debug('runInit', { containerCount: containers.length });
  const first = containers[0];
  if (first) {
    const debug = first.getAttribute(ATTR_DEBUG) === '1';
    getLogger().setDebug(debug);
  }
  containers.forEach((el) => initSelectAllContainer(el));
}

const OBSERVER_DEBOUNCE_MS = 100;

function hasNewContainers(nodes: NodeList): boolean {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.nodeType !== Node.ELEMENT_NODE) continue;
    const el = node as HTMLElement;
    if (el.matches(SELECTOR_CONTAINER)) return true;
    if (el.querySelector(SELECTOR_CONTAINER)) return true;
  }
  return false;
}

/**
 * Runs runInit() and starts a MutationObserver to initialize new [data-controller*="select-all"]
 * elements when they are added to the DOM (e.g. Turbo frames, AJAX).
 */
export function runInitAndObserve(): void {
  runInit();
  if (typeof document === 'undefined' || !document.body || typeof MutationObserver === 'undefined') return;

  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  const observer = new MutationObserver((mutations) => {
    let hasNew = false;
    for (const m of mutations) {
      if (m.addedNodes.length && hasNewContainers(m.addedNodes)) {
        hasNew = true;
        break;
      }
    }
    if (!hasNew) return;
    getLogger().debug('runInitAndObserve: new select-all container(s) detected, scheduling runInit');
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null;
      runInit();
    }, OBSERVER_DEBOUNCE_MS);
  });
  observer.observe(document.body, { childList: true, subtree: true });
  getLogger().debug('runInitAndObserve: MutationObserver started for dynamic select-all containers');
}
