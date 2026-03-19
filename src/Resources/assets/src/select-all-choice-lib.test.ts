import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  initSelectAllContainer,
  runInit,
  runInitAndObserve,
  setBundleLogger,
  SELECTOR_CONTAINER,
  ATTR_INIT,
  ATTR_DEBUG,
} from './select-all-choice-lib';
import { createBundleLogger } from './logger';

describe('select-all-choice-lib', () => {
  beforeEach(() => {
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const log = createBundleLogger('select-all-choice');
    setBundleLogger(log);
    log.setDebug(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  describe('runInit', () => {
    it('calls init on all containers and sets debug from first', () => {
      const el = document.createElement('div');
      el.setAttribute('data-controller', 'select-all');
      el.setAttribute('data-select-all-debug-value', '1');
      const choices = document.createElement('div');
      choices.setAttribute('data-select-all-target', 'choices');
      el.appendChild(choices);
      document.body.appendChild(el);

      runInit();

      expect(el.querySelector('[data-select-all-target="toggleWrapper"]')).not.toBeNull();
    });

    it('runs with zero containers', () => {
      runInit();
      expect(document.querySelectorAll(SELECTOR_CONTAINER).length).toBe(0);
    });
  });

  describe('runInitAndObserve', () => {
    it('runs runInit and starts observer', () => {
      runInitAndObserve();
      expect(console.debug).toHaveBeenCalled();
      const args = vi.mocked(console.debug).mock.calls.flat();
      expect(args.some((a: unknown) => String(a).includes('MutationObserver started'))).toBe(true);
    });

    it('when new container is added, schedules runInit', async () => {
      runInitAndObserve();
      const container = document.createElement('div');
      container.setAttribute('data-controller', 'select-all');
      const choices = document.createElement('div');
      choices.setAttribute('data-select-all-target', 'choices');
      container.appendChild(choices);
      document.body.appendChild(container);

      await new Promise((r) => setTimeout(r, 150));

      expect(container.querySelector('[data-select-all-target="toggleWrapper"]')).not.toBeNull();
    });

    it('when added node is not an element, hasNewContainers skips it and no init runs', async () => {
      runInitAndObserve();
      document.body.appendChild(document.createTextNode('text'));
      await new Promise((r) => setTimeout(r, 50));
      expect(document.querySelector('[data-select-all-target="toggleWrapper"]')).toBeNull();
    });

    it('when added node is a plain div (no select-all), hasNew stays false and no init runs', async () => {
      runInitAndObserve();
      document.body.appendChild(document.createElement('div'));
      await new Promise((r) => setTimeout(r, 50));
      expect(document.querySelector('[data-select-all-target="toggleWrapper"]')).toBeNull();
    });

    it('when added node contains a select-all container (querySelector path), runInit is scheduled', async () => {
      runInitAndObserve();
      const wrapper = document.createElement('div');
      const container = document.createElement('div');
      container.setAttribute('data-controller', 'select-all');
      const choices = document.createElement('div');
      choices.setAttribute('data-select-all-target', 'choices');
      container.appendChild(choices);
      wrapper.appendChild(container);
      document.body.appendChild(wrapper);
      await new Promise((r) => setTimeout(r, 150));
      expect(container.querySelector('[data-select-all-target="toggleWrapper"]')).not.toBeNull();
    });

    it('when MutationObserver is undefined, does not start observer (early return)', () => {
      const orig = globalThis.MutationObserver;
      // @ts-expect-error stub for test
      globalThis.MutationObserver = undefined;
      try {
        runInitAndObserve();
        const calls = vi.mocked(console.debug).mock.calls.flat();
        expect(calls.some((a: unknown) => String(a).includes('MutationObserver started'))).toBe(false);
      } finally {
        globalThis.MutationObserver = orig;
      }
    });

    it('when multiple mutations add containers quickly, clearTimeout is used', async () => {
      runInitAndObserve();
      const wrap1 = document.createElement('div');
      const c1 = document.createElement('div');
      c1.setAttribute('data-controller', 'select-all');
      const ch1 = document.createElement('div');
      ch1.setAttribute('data-select-all-target', 'choices');
      c1.appendChild(ch1);
      wrap1.appendChild(c1);
      document.body.appendChild(wrap1);
      const wrap2 = document.createElement('div');
      const c2 = document.createElement('div');
      c2.setAttribute('data-controller', 'select-all');
      const ch2 = document.createElement('div');
      ch2.setAttribute('data-select-all-target', 'choices');
      c2.appendChild(ch2);
      wrap2.appendChild(c2);
      document.body.appendChild(wrap2);
      await new Promise((r) => setTimeout(r, 150));
      expect(c1.querySelector('[data-select-all-target="toggleWrapper"]')).not.toBeNull();
      expect(c2.querySelector('[data-select-all-target="toggleWrapper"]')).not.toBeNull();
    });
  });

  describe('initSelectAllContainer', () => {
    it('returns false when already initialized', () => {
      const el = document.createElement('div');
      el.setAttribute('data-controller', 'select-all');
      el.setAttribute(ATTR_INIT, '1');
      const choices = document.createElement('div');
      choices.setAttribute('data-select-all-target', 'choices');
      el.appendChild(choices);

      const result = initSelectAllContainer(el);
      expect(result).toBe(false);
      expect(el.querySelector('[data-select-all-target="toggleWrapper"]')).toBeNull();
    });

    it('returns false and warns when no choices target', () => {
      const el = document.createElement('div');
      el.setAttribute('data-controller', 'select-all');
      el.setAttribute('data-select-all-debug-value', '1');
      const result = initSelectAllContainer(el);
      expect(result).toBe(false);
      expect(console.warn).toHaveBeenCalled();
      const args = vi.mocked(console.warn).mock.calls.flat();
      expect(args.some((a: unknown) => String(a).includes('no choices target'))).toBe(true);
    });

    it('warns when expanded=false but no select in choices', () => {
      const el = document.createElement('div');
      el.setAttribute('data-controller', 'select-all');
      el.setAttribute('data-select-all-expanded-value', 'false');
      el.setAttribute('data-select-all-debug-value', '1');
      const choices = document.createElement('div');
      choices.setAttribute('data-select-all-target', 'choices');
      el.appendChild(choices);

      initSelectAllContainer(el);
      expect(console.warn).toHaveBeenCalled();
      const args = vi.mocked(console.warn).mock.calls.flat();
      expect(args.some((a: unknown) => String(a).includes('expanded=false but no select'))).toBe(true);
    });

    it('when expanded=false and no select, clicking toggle calls toggleSelectOptions (no-op branch)', () => {
      const el = document.createElement('div');
      el.setAttribute('data-controller', 'select-all');
      el.setAttribute('data-select-all-expanded-value', 'false');
      el.setAttribute('data-select-all-debug-value', '1');
      const choices = document.createElement('div');
      choices.setAttribute('data-select-all-target', 'choices');
      el.appendChild(choices);
      document.body.appendChild(el);

      initSelectAllContainer(el);
      const toggle = el.querySelector<HTMLInputElement>('input[data-select-all-target="toggle"]');
      expect(toggle).not.toBeNull();
      toggle!.click();
      expect(el.querySelector('select')).toBeNull();
    });

    it('when expanded=false and select has zero options, sync treats as not all selected', () => {
      const el = document.createElement('div');
      el.setAttribute('data-controller', 'select-all');
      el.setAttribute('data-select-all-expanded-value', 'false');
      const choices = document.createElement('div');
      choices.setAttribute('data-select-all-target', 'choices');
      const select = document.createElement('select');
      select.multiple = true;
      choices.appendChild(select);
      el.appendChild(choices);
      document.body.appendChild(el);

      initSelectAllContainer(el);
      const toggle = el.querySelector<HTMLInputElement>('input[data-select-all-target="toggle"]');
      expect(toggle).not.toBeNull();
      expect(toggle!.checked).toBe(false);
    });

    it('createToggle position before (default) inserts wrapper before choices', () => {
      const el = document.createElement('div');
      el.setAttribute('data-controller', 'select-all');
      el.setAttribute('data-select-all-position-value', 'before');
      el.setAttribute('data-select-all-expanded-value', 'true');
      const choices = document.createElement('div');
      choices.setAttribute('data-select-all-target', 'choices');
      el.appendChild(choices);
      document.body.appendChild(el);

      initSelectAllContainer(el);
      const wrapper = el.querySelector('[data-select-all-target="toggleWrapper"]');
      expect(wrapper).not.toBeNull();
      expect(wrapper?.nextElementSibling).toBe(choices);
    });

    it('createToggle position after inserts after choices', () => {
      const el = document.createElement('div');
      el.setAttribute('data-controller', 'select-all');
      el.setAttribute('data-select-all-position-value', 'after');
      el.setAttribute('data-select-all-expanded-value', 'true');
      const choices = document.createElement('div');
      choices.setAttribute('data-select-all-target', 'choices');
      el.appendChild(choices);
      document.body.appendChild(el);

      initSelectAllContainer(el);
      const wrapper = el.querySelector('[data-select-all-target="toggleWrapper"]');
      expect(wrapper).not.toBeNull();
      expect(wrapper?.previousElementSibling).toBe(choices);
    });

    it('returns true but does not set toggle when createToggle returns null (choices detached)', () => {
      const el = document.createElement('div');
      el.setAttribute('data-controller', 'select-all');
      const choices = document.createElement('div');
      choices.setAttribute('data-select-all-target', 'choices');
      el.appendChild(choices);
      document.body.appendChild(el);
      const querySpy = vi.spyOn(el, 'querySelector').mockReturnValue(choices);
      choices.remove(); // detach so choices.parentNode is null

      const result = initSelectAllContainer(el);
      querySpy.mockRestore();
      expect(result).toBe(true);
      expect(el.querySelector('[data-select-all-target="toggleWrapper"]')).toBeNull();
    });

    it('idempotent: second init on same element returns false', () => {
      const el = document.createElement('div');
      el.setAttribute('data-controller', 'select-all');
      const choices = document.createElement('div');
      choices.setAttribute('data-select-all-target', 'choices');
      el.appendChild(choices);

      const first = initSelectAllContainer(el);
      const second = initSelectAllContainer(el);
      expect(first).toBe(true);
      expect(second).toBe(false);
      const wrappers = el.querySelectorAll('[data-select-all-target="toggleWrapper"]');
      expect(wrappers.length).toBe(1);
    });
  });

  describe('exports', () => {
    it('SELECTOR_CONTAINER matches data-controller containing select-all', () => {
      expect(SELECTOR_CONTAINER).toBe('[data-controller*="select-all"]');
    });
    it('ATTR_INIT is data-select-all-init', () => {
      expect(ATTR_INIT).toBe('data-select-all-init');
    });
    it('ATTR_DEBUG is data-select-all-debug-value', () => {
      expect(ATTR_DEBUG).toBe('data-select-all-debug-value');
    });
  });
});
