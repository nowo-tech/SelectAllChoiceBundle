/**
 * Autonomous custom element root for the "select all" choice widget.
 * Mirrors the legacy Stimulus + div setup: same data-select-all-* attributes and
 * a child with data-select-all-target="choices". Initialization is delegated to
 * initSelectAllContainer (idempotent with data-select-all-init).
 *
 * Register once per document via ensureNowoSelectAllChoiceDefined() (called from
 * the standalone entry and the Stimulus controller module so the tag upgrades
 * when the parser inserts markup).
 */

import { initSelectAllContainer, TAG_NOWO_SELECT_ALL_CHOICE } from './select-all-choice-lib';

export class NowoSelectAllChoiceElement extends HTMLElement {
  constructor() {
    super();
    // Autonomous custom elements default to `display: inline` in common engines; the bundle
    // previously used a `<div>` wrapper, so block matches existing form layouts (Bootstrap, etc.).
    if (!this.style.display) {
      this.style.display = 'block';
    }
  }

  connectedCallback(): void {
    initSelectAllContainer(this);
  }
}

let definitionRequested = false;

/**
 * Defines the {@link TAG_NOWO_SELECT_ALL_CHOICE} custom element if Custom Elements
 * are available and the tag is not already registered. Safe to call multiple times.
 */
export function ensureNowoSelectAllChoiceDefined(): void {
  if (typeof customElements === 'undefined') {
    return;
  }
  if (customElements.get(TAG_NOWO_SELECT_ALL_CHOICE) !== undefined) {
    return;
  }
  if (definitionRequested) {
    return;
  }
  definitionRequested = true;
  customElements.define(TAG_NOWO_SELECT_ALL_CHOICE, NowoSelectAllChoiceElement);
}
