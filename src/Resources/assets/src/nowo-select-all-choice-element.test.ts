import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ATTR_TARGET,
  setBundleLogger,
  TAG_NOWO_SELECT_ALL_CHOICE,
  TARGET_TOGGLE_WRAPPER,
} from './select-all-choice-lib';
import { createBundleLogger } from './logger';
import { ensureNowoSelectAllChoiceDefined, NowoSelectAllChoiceElement } from './nowo-select-all-choice-element';

describe('nowo-select-all-choice-element', () => {
  beforeEach(() => {
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    const log = createBundleLogger('select-all-choice');
    setBundleLogger(log);
    ensureNowoSelectAllChoiceDefined();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('registers the autonomous custom element tag', () => {
    expect(customElements.get(TAG_NOWO_SELECT_ALL_CHOICE)).toBe(NowoSelectAllChoiceElement);
  });

  it('connectedCallback initializes toggle when structure is valid', async () => {
    // JSDOM can throw NotSupportedError on document.createElement(customTag) for some CE setups;
    // parsing HTML matches how browsers insert bundle markup.
    document.body.innerHTML = `
      <${TAG_NOWO_SELECT_ALL_CHOICE}
        data-controller="select-all"
        data-select-all-debug-value="0"
        data-select-all-position-value="before"
        data-select-all-expanded-value="true"
        data-select-all-label-value="Select all"
        data-select-all-toggle-class-value="form-check-input"
        data-select-all-wrapper-class-value="form-check"
        data-select-all-label-class-value="form-check-label">
        <div data-select-all-target="choices"></div>
      </${TAG_NOWO_SELECT_ALL_CHOICE}>
    `;
    const el = document.body.querySelector(TAG_NOWO_SELECT_ALL_CHOICE) as NowoSelectAllChoiceElement;
    await Promise.resolve();

    expect(el.querySelector(`[${ATTR_TARGET}="${TARGET_TOGGLE_WRAPPER}"]`)).not.toBeNull();
  });

  it('ensureNowoSelectAllChoiceDefined is idempotent', () => {
    expect(() => ensureNowoSelectAllChoiceDefined()).not.toThrow();
    expect(customElements.get(TAG_NOWO_SELECT_ALL_CHOICE)).toBe(NowoSelectAllChoiceElement);
  });

  it('returns early when customElements is undefined (fresh module)', async () => {
    vi.resetModules();
    vi.stubGlobal('customElements', undefined);
    const mod = await import('./nowo-select-all-choice-element');
    expect(() => mod.ensureNowoSelectAllChoiceDefined()).not.toThrow();
    vi.unstubAllGlobals();
    vi.resetModules();
    await import('./nowo-select-all-choice-element');
  });

  it('returns early when define was requested but the tag is not registered yet', async () => {
    vi.resetModules();
    const mod = await import('./nowo-select-all-choice-element');
    const getSpy = vi.spyOn(customElements, 'get').mockReturnValue(undefined);
    const defineSpy = vi.spyOn(customElements, 'define').mockImplementation(() => {
      mod.ensureNowoSelectAllChoiceDefined();
    });
    mod.ensureNowoSelectAllChoiceDefined();
    expect(defineSpy).toHaveBeenCalledTimes(1);
    getSpy.mockRestore();
    defineSpy.mockRestore();
    vi.resetModules();
    await import('./nowo-select-all-choice-element');
  });
});
