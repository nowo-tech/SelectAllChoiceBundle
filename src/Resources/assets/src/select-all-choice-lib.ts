/**
 * Select-all choice widget: logic for "Select all" toggle (expanded checkboxes or collapsed select).
 * Used by the standalone script (runInitAndObserve) and by the Stimulus controller.
 * Entry point for standalone is select-all-choice.ts; controller is in controllers/select_all_controller.ts.
 */

import { createBundleLogger, type BundleLogger } from './logger';

let bundleLogger: BundleLogger | null = null;
let hasLoggedConfiguredContainerCount = false;

/** Injects the bundle logger (called from entry point so scriptLoaded/buildTime can be used). */
export function setBundleLogger(log: BundleLogger): void {
  bundleLogger = log;
}

/** Returns the injected logger or a default one. */
export function getLogger(): BundleLogger {
  if (bundleLogger === null) {
    bundleLogger = createBundleLogger('select-all-choice');
    bundleLogger.scriptLoaded();
  }
  return bundleLogger;
}

/** Resets one-time logger guards (tests only). */
export function resetSelectAllLibForTest(): void {
  hasLoggedConfiguredContainerCount = false;
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

/** Tag name for the autonomous custom element root (see nowo-select-all-choice-element.ts). */
export const TAG_NOWO_SELECT_ALL_CHOICE = 'nowo-select-all-choice';

/** Selector for container elements (standalone script, custom element, and Stimulus). */
export const SELECTOR_CONTAINER = `${TAG_NOWO_SELECT_ALL_CHOICE},[data-controller*="select-all"]`;

/** Target value for a group container (`fieldset`, rendered by the form theme with select_all_groups). */
export const TARGET_GROUP = 'group';

/** Target value for a group "select all" box (rendered by the form theme, no `name`). */
export const TARGET_GROUP_TOGGLE = 'groupToggle';

export type ContainerConfig = {
  position: 'before' | 'after';
  expanded: boolean;
  label: string;
  toggleClass: string;
  wrapperClass: string;
  labelClass: string;
  debug: boolean;
  /** When false, no global "Select all" box is created (select_all_groups without select_all). */
  global: boolean;
  /** When true, the choices contain group fieldsets with their own boxes. */
  groups: boolean;
};

/** Tri-state of a "select all" box. */
export type ToggleState = 'checked' | 'unchecked' | 'mixed';

type ContainerState = {
  toggleCheckbox: HTMLInputElement | null;
  toggleWrapper: HTMLElement | null;
  listeners: AbortController;
  isDispatchingFromToggle: boolean;
  isDispatchingChange: boolean;
};

/**
 * Per-container state, keyed by the container element itself: nothing is shared between containers, and the entry
 * goes away with the element (WeakMap) or on destroySelectAllContainer().
 */
const stateByContainer = new WeakMap<HTMLElement, ContainerState>();

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
    global: get('data-select-all-global-value', 'true') !== 'false',
    groups: expanded && get('data-select-all-groups-value', 'false') === 'true',
  };
}

function findChoices(container: HTMLElement): HTMLElement | null {
  return container.querySelector<HTMLElement>(`[${ATTR_TARGET}="choices"]`);
}

function hasRequiredWrapperAttributes(container: HTMLElement): boolean {
  const requiredAttrs = [
    ATTR_DEBUG,
    'data-select-all-position-value',
    'data-select-all-expanded-value',
    'data-select-all-label-value',
    'data-select-all-toggle-class-value',
    'data-select-all-wrapper-class-value',
    'data-select-all-label-class-value',
  ];

  return requiredAttrs.every((attr) => container.hasAttribute(attr));
}

function isConfiguredSelectAllContainer(container: HTMLElement): boolean {
  return hasRequiredWrapperAttributes(container) && findChoices(container) !== null;
}

/**
 * Logs how many select-all containers are fully configured in the current DOM.
 * A container is considered configured when it has all required wrapper data attributes
 * and a `data-select-all-target="choices"` child.
 */
export function logConfiguredContainerCount(): void {
  if (hasLoggedConfiguredContainerCount) return;

  const containers = document.querySelectorAll<HTMLElement>(SELECTOR_CONTAINER);
  const configuredCount = Array.from(containers).filter((el) => isConfiguredSelectAllContainer(el)).length;
  const missingStructureCount = containers.length - configuredCount;

  getLogger().debug('logConfiguredContainerCount', {
    containerCount: containers.length,
    configuredCount,
    missingStructureCount,
  });
  getLogger().info(
    `runInit: found ${configuredCount} select-all container(s) with full wrapper attributes and choices target`,
  );
  if (missingStructureCount > 0) {
    getLogger().warn(`runInit: ${missingStructureCount} container(s) are missing required select-all wrapper attributes or choices target`);
  }

  hasLoggedConfiguredContainerCount = true;
}

function createToggle(config: ContainerConfig, choicesEl: HTMLElement): HTMLElement | null {
  const parent = choicesEl.parentNode;
  if (!parent) return null;

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

  if (config.position === 'before') {
    parent.insertBefore(wrapper, choicesEl);
  } else {
    parent.insertBefore(wrapper, choicesEl.nextSibling);
  }
  return wrapper;
}

/**
 * Choice checkboxes: every checkbox except the bundle's own boxes (they all carry a data-select-all-target).
 * The global box lives outside the choices target; the group boxes live inside it.
 */
const SELECTOR_CHOICE_CHECKBOX = `input[type="checkbox"]:not([${ATTR_TARGET}])`;

/** Enabled choice checkboxes only: disabled choices cannot be toggled by the user nor by "Select all". */
const SELECTOR_ENABLED_CHECKBOX = `${SELECTOR_CHOICE_CHECKBOX}:not(:disabled)`;

/** Enabled options only (disabled options are never submitted). */
const SELECTOR_ENABLED_OPTION = 'option:not(:disabled)';

function enabledCheckboxes(scope: HTMLElement): HTMLInputElement[] {
  return Array.from(scope.querySelectorAll<HTMLInputElement>(SELECTOR_ENABLED_CHECKBOX));
}

function enabledOptions(select: HTMLSelectElement): HTMLOptionElement[] {
  return Array.from(select.querySelectorAll<HTMLOptionElement>(SELECTOR_ENABLED_OPTION));
}

function stateOf(items: Array<{ readonly checked?: boolean; readonly selected?: boolean }>): ToggleState {
  const on = items.filter((item) => item.checked === true || item.selected === true).length;
  if (items.length > 0 && on === items.length) return 'checked';
  return on === 0 ? 'unchecked' : 'mixed';
}

/** Applies a tri-state to a box: checked, indeterminate and aria-checked always agree. */
export function applyToggleState(toggle: HTMLInputElement, state: ToggleState): void {
  toggle.checked = state === 'checked';
  toggle.indeterminate = state === 'mixed';
  toggle.setAttribute('aria-checked', state === 'mixed' ? 'mixed' : String(state === 'checked'));
}

function choicesState(choicesEl: HTMLElement, expanded: boolean): ToggleState {
  if (expanded) return stateOf(enabledCheckboxes(choicesEl));
  const select = choicesEl.querySelector<HTMLSelectElement>('select');
  return stateOf(select ? enabledOptions(select) : []);
}

function groupsOf(choicesEl: HTMLElement): HTMLElement[] {
  return Array.from(choicesEl.querySelectorAll<HTMLElement>(`[${ATTR_TARGET}="${TARGET_GROUP}"]`));
}

function groupToggleOf(group: HTMLElement): HTMLInputElement | null {
  return group.querySelector<HTMLInputElement>(`input[${ATTR_TARGET}="${TARGET_GROUP_TOGGLE}"]`);
}

/** Recomputes every box of the container (groups first, then the global one) from the choices. */
function syncAll(config: ContainerConfig, state: ContainerState, choicesEl: HTMLElement): void {
  if (config.groups) {
    groupsOf(choicesEl).forEach((group) => {
      const toggle = groupToggleOf(group);
      if (!toggle) return;
      const children = enabledCheckboxes(group);
      toggle.disabled = children.length === 0;
      applyToggleState(toggle, stateOf(children));
    });
  }
  if (state.toggleCheckbox) {
    applyToggleState(state.toggleCheckbox, choicesState(choicesEl, config.expanded));
  }
}

function setChecked(inputs: HTMLInputElement[], checked: boolean): void {
  inputs.forEach((input) => {
    input.checked = checked;
  });
}

function toggleSelectOptions(choicesEl: HTMLElement, selected: boolean): void {
  const select = choicesEl.querySelector<HTMLSelectElement>('select');
  if (!select) return;
  enabledOptions(select).forEach((option) => {
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

function idsOf(elements: HTMLElement[]): string {
  return elements.map((el) => el.id).filter((id) => id !== '').join(' ');
}

/**
 * Initializes one "select-all" container: creates the global toggle (unless disabled), wires the group boxes,
 * syncs every box from the choices and binds the listeners (all removed by destroySelectAllContainer).
 * Idempotent: if the container is already initialized (data-select-all-init="1"), returns false.
 *
 * @param element - Root element: `nowo-select-all-choice` or legacy `data-controller*="select-all"`, with data-select-all-* attributes.
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
    global: config.global,
    groups: config.groups,
  });

  const choicesEl = findChoices(element);
  if (!choicesEl) {
    getLogger().warn('initSelectAllContainer: no choices target found');
    return false;
  }

  // A previous init whose marker was cleared (e.g. by a re-render) is torn down first: no duplicate listeners.
  teardown(element);
  element.setAttribute(ATTR_INIT, '1');
  const state: ContainerState = {
    toggleCheckbox: null,
    toggleWrapper: null,
    listeners: new AbortController(),
    isDispatchingFromToggle: false,
    isDispatchingChange: false,
  };
  stateByContainer.set(element, state);
  const { signal } = state.listeners;

  if (config.global) {
    const wrapper = createToggle(config, choicesEl);
    if (!wrapper) return true;
    state.toggleWrapper = wrapper;
    const checkbox = wrapper.querySelector<HTMLInputElement>(`input[${ATTR_TARGET}="${TARGET_TOGGLE}"]`) as HTMLInputElement;
    state.toggleCheckbox = checkbox;
    const controls = config.expanded
      ? idsOf(Array.from(choicesEl.querySelectorAll<HTMLInputElement>(SELECTOR_CHOICE_CHECKBOX)))
      : idsOf(Array.from(choicesEl.querySelectorAll<HTMLSelectElement>('select')));
    if (controls !== '') checkbox.setAttribute('aria-controls', controls);

    checkbox.addEventListener('change', () => {
      const checked = checkbox.checked;
      getLogger().debug('toggleAll', { checked, expanded: config.expanded });
      if (config.expanded) {
        setChecked(enabledCheckboxes(choicesEl), checked);
      } else {
        toggleSelectOptions(choicesEl, checked);
      }
      syncAll(config, state, choicesEl);
      state.isDispatchingFromToggle = true;
      try {
        dispatchChange(choicesEl, config.expanded, state);
      } finally {
        state.isDispatchingFromToggle = false;
      }
    }, { signal });
  }

  syncAll(config, state, choicesEl);

  if (config.expanded) {
    getLogger().debug('initSelectAllContainer: delegated change listener on choices', {
      count: choicesEl.querySelectorAll(SELECTOR_CHOICE_CHECKBOX).length,
      groups: config.groups ? groupsOf(choicesEl).length : 0,
    });
    // One delegated listener: it also covers choices or groups re-rendered inside the target after init.
    choicesEl.addEventListener('change', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || target.type !== 'checkbox') return;

      if (target.getAttribute(ATTR_TARGET) === TARGET_GROUP_TOGGLE) {
        const group = target.closest<HTMLElement>(`[${ATTR_TARGET}="${TARGET_GROUP}"]`);
        if (!config.groups || !group) return;
        getLogger().debug('toggleGroup', { checked: target.checked });
        setChecked(enabledCheckboxes(group), target.checked);
        syncAll(config, state, choicesEl);
        // The group box itself is never submitted; like the global box, tell the host the choices changed.
        dispatchChange(choicesEl, true, state);
        return;
      }

      // The native change event of a choice already bubbles to the form / host listeners: only sync the boxes
      // (re-dispatching here produced a second change event per user click).
      syncAll(config, state, choicesEl);
    }, { signal });
  } else {
    const select = choicesEl.querySelector<HTMLSelectElement>('select');
    if (select) {
      getLogger().debug('initSelectAllContainer: bound change listener to select');
      select.addEventListener('change', () => {
        syncAll(config, state, choicesEl);
        if (!state.isDispatchingFromToggle && !state.isDispatchingChange) {
          dispatchChange(choicesEl, config.expanded, state);
        }
      }, { signal });
    } else {
      getLogger().warn('initSelectAllContainer: expanded=false but no select in choices target');
    }
  }

  getLogger().debug('initSelectAllContainer: done', { expanded: config.expanded });
  return true;
}

function teardown(element: HTMLElement): boolean {
  const state = stateByContainer.get(element);
  if (!state) return false;
  state.listeners.abort();
  state.toggleWrapper?.remove();
  stateByContainer.delete(element);
  return true;
}

/**
 * Undoes initSelectAllContainer: removes every listener and the global box it created, and clears the init marker
 * so the next connect (e.g. a dialog body re-inserted after a validation error) starts clean. The group boxes are
 * server-rendered and stay. Safe to call more than once.
 *
 * @returns true when the container had been initialized.
 */
export function destroySelectAllContainer(element: HTMLElement): boolean {
  const done = teardown(element);
  element.removeAttribute(ATTR_INIT);
  if (done) getLogger().debug('destroySelectAllContainer: listeners removed');
  return done;
}

/**
 * Re-reads the choices and updates every box (global and groups). Call it after changing choices from script
 * without a change event; user changes are picked up automatically.
 */
export function refreshSelectAllContainer(element: HTMLElement): void {
  const state = stateByContainer.get(element);
  const choicesEl = findChoices(element);
  if (!state || !choicesEl) return;
  syncAll(getConfig(element), state, choicesEl);
}

/**
 * Initializes all matching select-all roots (`nowo-select-all-choice` or `[data-controller*="select-all"]`) in the document.
 * Sets debug from the first container's data-select-all-debug-value.
 */
export function runInit(): void {
  const containers = document.querySelectorAll<HTMLElement>(SELECTOR_CONTAINER);
  logConfiguredContainerCount();

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
 * Runs runInit() and starts a MutationObserver to initialize new select-all roots when they are
 * added to the DOM (e.g. Turbo frames, AJAX).
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
