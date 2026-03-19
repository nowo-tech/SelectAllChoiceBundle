import { Application } from '@hotwired/stimulus';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ATTR_DEBUG,
  ATTR_TARGET,
  setBundleLogger,
  TARGET_TOGGLE,
  TARGET_TOGGLE_LABEL,
  TARGET_TOGGLE_WRAPPER,
} from '../src/select-all-choice-lib';
import { createBundleLogger } from '../src/logger';
import SelectAllController from './select_all_controller';

describe('select_all_controller', () => {
  let application: Application;

  beforeEach(() => {
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    const log = createBundleLogger('select-all-choice', { buildTime: '2026-01-01T00:00:00.000Z' });
    setBundleLogger(log);
    application = Application.start();
    application.register('select-all', SelectAllController);
  });

  afterEach(() => {
    application.stop();
    vi.restoreAllMocks();
  });

  describe('exports', () => {
    it('getLogger returns default logger when setBundleLogger was not called', async () => {
      vi.resetModules();
      const { getLogger } = await import('../src/select-all-choice-lib');
      const logger = getLogger();
      expect(logger).toBeDefined();
      expect(typeof logger.scriptLoaded).toBe('function');
      expect(typeof logger.setDebug).toBe('function');
    });

    it('ATTR_DEBUG has expected value', () => {
      expect(ATTR_DEBUG).toBe('data-select-all-debug-value');
    });
    it('ATTR_TARGET has expected value', () => {
      expect(ATTR_TARGET).toBe('data-select-all-target');
    });
    it('TARGET_TOGGLE_WRAPPER has expected value', () => {
      expect(TARGET_TOGGLE_WRAPPER).toBe('toggleWrapper');
    });
    it('TARGET_TOGGLE has expected value', () => {
      expect(TARGET_TOGGLE).toBe('toggle');
    });
    it('TARGET_TOGGLE_LABEL has expected value', () => {
      expect(TARGET_TOGGLE_LABEL).toBe('toggleLabel');
    });
  });

  async function loadElement(el: HTMLElement): Promise<void> {
    document.body.appendChild(el);
    await new Promise((r) => setTimeout(r, 0));
  }

  describe('connect and createToggle', () => {
    it('adds toggle wrapper and checkbox when choices target exists (position before)', async () => {
      const wrapper = document.createElement('div');
      const choices = document.createElement('div');
      choices.setAttribute('data-select-all-target', 'choices');
      const cb1 = document.createElement('input');
      cb1.type = 'checkbox';
      cb1.value = 'a';
      choices.appendChild(cb1);
      wrapper.appendChild(choices);

      const el = document.createElement('div');
      el.setAttribute('data-controller', 'select-all');
      el.setAttribute('data-select-all-position-value', 'before');
      el.setAttribute('data-select-all-expanded-value', 'true');
      el.appendChild(wrapper);

      await loadElement(el);

      const toggleWrapper = el.querySelector(`[${ATTR_TARGET}="${TARGET_TOGGLE_WRAPPER}"]`);
      expect(toggleWrapper).not.toBeNull();
      const toggle = el.querySelector(`[${ATTR_TARGET}="${TARGET_TOGGLE}"]`) as HTMLInputElement;
      expect(toggle).not.toBeNull();
      expect(toggle?.type).toBe('checkbox');
      const label = el.querySelector(`[${ATTR_TARGET}="${TARGET_TOGGLE_LABEL}"]`);
      expect(label).not.toBeNull();
      expect(toggleWrapper?.nextElementSibling).toBe(choices);

      document.body.removeChild(el);
    });

    it('inserts toggle after choices when position is after', async () => {
      const wrapper = document.createElement('div');
      const choices = document.createElement('div');
      choices.setAttribute('data-select-all-target', 'choices');
      wrapper.appendChild(choices);

      const el = document.createElement('div');
      el.setAttribute('data-controller', 'select-all');
      el.setAttribute('data-select-all-position-value', 'after');
      el.setAttribute('data-select-all-expanded-value', 'true');
      el.appendChild(wrapper);

      await loadElement(el);

      const toggleWrapper = el.querySelector(`[${ATTR_TARGET}="${TARGET_TOGGLE_WRAPPER}"]`);
      expect(toggleWrapper?.previousElementSibling).toBe(choices);

      document.body.removeChild(el);
    });

    it('sets debug when data-select-all-debug-value is 1', async () => {
      const wrapper = document.createElement('div');
      const choices = document.createElement('div');
      choices.setAttribute('data-select-all-target', 'choices');
      wrapper.appendChild(choices);

      const el = document.createElement('div');
      el.setAttribute('data-controller', 'select-all');
      el.setAttribute('data-select-all-debug-value', '1');
      el.appendChild(wrapper);

      await loadElement(el);

      expect(console.debug).toHaveBeenCalled();

      document.body.removeChild(el);
    });

    it('does not init when element has no choices target (init skipped)', async () => {
      const el = document.createElement('div');
      el.setAttribute('data-controller', 'select-all');
      el.setAttribute('data-select-all-position-value', 'before');
      // no child with data-select-all-target="choices"
      await loadElement(el);
      expect(el.querySelector(`[${ATTR_TARGET}="${TARGET_TOGGLE_WRAPPER}"]`)).toBeNull();
      document.body.removeChild(el);
    });

    it('does not init when element is not an HTMLElement (e.g. SVG)', async () => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('data-controller', 'select-all');
      await loadElement(svg as unknown as HTMLElement);
      expect(svg.querySelector(`[${ATTR_TARGET}="${TARGET_TOGGLE_WRAPPER}"]`)).toBeNull();
      document.body.removeChild(svg);
    });
  });

  describe('toggleAll expanded (checkboxes)', () => {
    it('checking toggle selects all checkboxes and dispatches change', async () => {
      const wrapper = document.createElement('div');
      const choices = document.createElement('div');
      choices.setAttribute('data-select-all-target', 'choices');
      const cb1 = document.createElement('input');
      cb1.type = 'checkbox';
      cb1.value = 'a';
      const cb2 = document.createElement('input');
      cb2.type = 'checkbox';
      cb2.value = 'b';
      choices.appendChild(cb1);
      choices.appendChild(cb2);
      wrapper.appendChild(choices);

      const el = document.createElement('div');
      el.setAttribute('data-controller', 'select-all');
      el.setAttribute('data-select-all-expanded-value', 'true');
      el.appendChild(wrapper);

      await loadElement(el);

      const toggle = el.querySelector(`[${ATTR_TARGET}="${TARGET_TOGGLE}"]`) as HTMLInputElement;
      expect(toggle).not.toBeNull();
      expect(cb1.checked).toBe(false);
      expect(cb2.checked).toBe(false);

      let changeFired = false;
      choices.addEventListener('change', () => {
        changeFired = true;
      });

      toggle!.checked = true;
      toggle!.dispatchEvent(new Event('change', { bubbles: true }));

      expect(cb1.checked).toBe(true);
      expect(cb2.checked).toBe(true);
      expect(changeFired).toBe(true);

      document.body.removeChild(el);
    });

    it('unchecking toggle deselects all checkboxes', async () => {
      const wrapper = document.createElement('div');
      const choices = document.createElement('div');
      choices.setAttribute('data-select-all-target', 'choices');
      const cb1 = document.createElement('input');
      cb1.type = 'checkbox';
      cb1.checked = true;
      choices.appendChild(cb1);
      wrapper.appendChild(choices);

      const el = document.createElement('div');
      el.setAttribute('data-controller', 'select-all');
      el.setAttribute('data-select-all-expanded-value', 'true');
      el.appendChild(wrapper);

      await loadElement(el);

      const toggle = el.querySelector(`[${ATTR_TARGET}="${TARGET_TOGGLE}"]`) as HTMLInputElement;
      toggle!.checked = false;
      toggle!.dispatchEvent(new Event('change', { bubbles: true }));

      expect(cb1.checked).toBe(false);

      document.body.removeChild(el);
    });
  });

  describe('toggleAll collapsed (select)', () => {
    it('checking toggle selects all options and dispatches change', async () => {
      const wrapper = document.createElement('div');
      const choices = document.createElement('div');
      const select = document.createElement('select');
      select.multiple = true;
      const opt1 = document.createElement('option');
      opt1.value = 'x';
      const opt2 = document.createElement('option');
      opt2.value = 'y';
      select.appendChild(opt1);
      select.appendChild(opt2);
      choices.setAttribute('data-select-all-target', 'choices');
      choices.appendChild(select);
      wrapper.appendChild(choices);

      const el = document.createElement('div');
      el.setAttribute('data-controller', 'select-all');
      el.setAttribute('data-select-all-expanded-value', 'false');
      el.appendChild(wrapper);

      await loadElement(el);

      const toggle = el.querySelector(`[${ATTR_TARGET}="${TARGET_TOGGLE}"]`) as HTMLInputElement;
      let changeFired = false;
      select.addEventListener('change', () => {
        changeFired = true;
      });

      toggle!.checked = true;
      toggle!.dispatchEvent(new Event('change', { bubbles: true }));

      expect(opt1.selected).toBe(true);
      expect(opt2.selected).toBe(true);
      expect(changeFired).toBe(true);

      document.body.removeChild(el);
    });

    it('unchecking toggle deselects all options', async () => {
      const wrapper = document.createElement('div');
      const choices = document.createElement('div');
      const select = document.createElement('select');
      select.multiple = true;
      const opt1 = document.createElement('option');
      opt1.value = 'x';
      opt1.selected = true;
      select.appendChild(opt1);
      choices.setAttribute('data-select-all-target', 'choices');
      choices.appendChild(select);
      wrapper.appendChild(choices);

      const el = document.createElement('div');
      el.setAttribute('data-controller', 'select-all');
      el.setAttribute('data-select-all-expanded-value', 'false');
      el.appendChild(wrapper);

      await loadElement(el);

      const toggle = el.querySelector(`[${ATTR_TARGET}="${TARGET_TOGGLE}"]`) as HTMLInputElement;
      toggle!.checked = false;
      toggle!.dispatchEvent(new Event('change', { bubbles: true }));

      expect(opt1.selected).toBe(false);

      document.body.removeChild(el);
    });
  });

  describe('sync from choices', () => {
    it('toggle becomes indeterminate when some checkboxes selected', async () => {
      const wrapper = document.createElement('div');
      const choices = document.createElement('div');
      choices.setAttribute('data-select-all-target', 'choices');
      const cb1 = document.createElement('input');
      cb1.type = 'checkbox';
      cb1.checked = true;
      const cb2 = document.createElement('input');
      cb2.type = 'checkbox';
      cb2.checked = false;
      choices.appendChild(cb1);
      choices.appendChild(cb2);
      wrapper.appendChild(choices);

      const el = document.createElement('div');
      el.setAttribute('data-controller', 'select-all');
      el.setAttribute('data-select-all-expanded-value', 'true');
      el.appendChild(wrapper);

      await loadElement(el);

      const toggle = el.querySelector(`[${ATTR_TARGET}="${TARGET_TOGGLE}"]`) as HTMLInputElement;
      expect(toggle?.indeterminate).toBe(true);

      document.body.removeChild(el);
    });

    it('changing a choice checkbox updates toggle state and dispatches change', async () => {
      const wrapper = document.createElement('div');
      const choices = document.createElement('div');
      choices.setAttribute('data-select-all-target', 'choices');
      const cb1 = document.createElement('input');
      cb1.type = 'checkbox';
      cb1.value = 'a';
      choices.appendChild(cb1);
      wrapper.appendChild(choices);

      const el = document.createElement('div');
      el.setAttribute('data-controller', 'select-all');
      el.setAttribute('data-select-all-expanded-value', 'true');
      el.appendChild(wrapper);

      await loadElement(el);

      const toggle = el.querySelector(`[${ATTR_TARGET}="${TARGET_TOGGLE}"]`) as HTMLInputElement;
      let changeCount = 0;
      choices.addEventListener('change', () => {
        changeCount++;
      });

      cb1.checked = true;
      cb1.dispatchEvent(new Event('change', { bubbles: true }));

      expect(toggle?.checked).toBe(true);
      expect(changeCount).toBeGreaterThanOrEqual(1);

      document.body.removeChild(el);
    });
  });

  describe('select change listener', () => {
    it('changing select updates toggle and syncs state', async () => {
      const wrapper = document.createElement('div');
      const choices = document.createElement('div');
      const select = document.createElement('select');
      select.multiple = true;
      const opt1 = document.createElement('option');
      opt1.value = 'a';
      select.appendChild(opt1);
      choices.setAttribute('data-select-all-target', 'choices');
      choices.appendChild(select);
      wrapper.appendChild(choices);

      const el = document.createElement('div');
      el.setAttribute('data-controller', 'select-all');
      el.setAttribute('data-select-all-expanded-value', 'false');
      el.appendChild(wrapper);

      await loadElement(el);

      const toggle = el.querySelector(`[${ATTR_TARGET}="${TARGET_TOGGLE}"]`) as HTMLInputElement;
      opt1.selected = true;
      select.dispatchEvent(new Event('change', { bubbles: true }));

      expect(toggle?.checked).toBe(true);

      document.body.removeChild(el);
    });
  });
});
