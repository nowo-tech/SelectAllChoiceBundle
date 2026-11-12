import { Application } from '@hotwired/stimulus';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createBundleLogger } from './logger';
import { ensureNowoSelectAllChoiceDefined } from './nowo-select-all-choice-element';
import {
  applyToggleState,
  ATTR_INIT,
  destroySelectAllContainer,
  initSelectAllContainer,
  refreshSelectAllContainer,
  setBundleLogger,
} from './select-all-choice-lib';
import SelectAllController from '../controllers/select_all_controller';

type Child = { value: string; checked?: boolean; disabled?: boolean };
type Group = { label: string; children: Child[]; serverState?: 'true' | 'false' | 'mixed' };

/**
 * Markup as rendered by the bundle form theme with select_all_groups (see _select_all_choice_groups.html.twig).
 * serverState lets a test start from a stale server-side state that the controller must correct.
 */
function groupsHtml(groups: Group[], opts: { global?: boolean; tag?: string; ungrouped?: Child[] } = {}): string {
  const tag = opts.tag ?? 'nowo-select-all-choice';
  const global = opts.global ?? true;
  let n = 0;
  const child = (c: Child) => {
    const id = `form_targets_${n++}`;
    return `<div class="nowo-select-all-choice__choice"><input type="checkbox" id="${id}" name="form[targets][]" value="${c.value}"${c.checked ? ' checked' : ''}${c.disabled ? ' disabled' : ''}><label for="${id}">${c.value}</label></div>`;
  };
  const sections = groups
    .map((g, i) => {
      const start = n;
      const children = g.children.map(child).join('');
      const ids = g.children.map((_, k) => `form_targets_${start + k}`).join(' ');
      return `<fieldset class="nowo-select-all-choice__group" data-select-all-target="group" data-select-all-group-index="${i}">
        <legend class="nowo-select-all-choice__group-legend">${g.label}</legend>
        <div class="nowo-select-all-choice__group-toggle form-check">
          <input type="checkbox" id="form_targets_select_all_group_${i}" class="nowo-select-all-choice__group-toggle-input" data-select-all-target="groupToggle" aria-controls="${ids}" aria-checked="${g.serverState ?? 'false'}"${g.serverState === 'true' ? ' checked' : ''}>
          <label for="form_targets_select_all_group_${i}">Select all in ${g.label}</label>
        </div>
        <div class="nowo-select-all-choice__group-choices" data-select-all-target="groupChoices">${children}</div>
      </fieldset>`;
    })
    .join('');
  const ungrouped = opts.ungrouped ? `<div class="nowo-select-all-choice__ungrouped">${opts.ungrouped.map(child).join('')}</div>` : '';
  return `<${tag} class="form-check mb-2" data-controller="select-all"
      data-select-all-debug-value="0" data-select-all-position-value="before" data-select-all-expanded-value="true"
      data-select-all-label-value="Select all" data-select-all-toggle-class-value="form-check-input"
      data-select-all-wrapper-class-value="form-check" data-select-all-label-class-value="form-check-label"
      data-select-all-groups-value="true" data-select-all-global-value="${global ? 'true' : 'false'}">
    <div data-select-all-target="choices"><div id="form_targets" class="nowo-select-all-choice__groups">${ungrouped}${sections}</div></div>
  </${tag}>`;
}

const BEACON: Group[] = [
  { label: 'Incidents', children: [{ value: 'issue.new', checked: true }, { value: 'issue.regression', checked: true }] },
  { label: 'Availability', children: [{ value: 'monitor.down', checked: true }, { value: 'monitor.up' }] },
  { label: 'Tasks', children: [{ value: 'task.failed' }] },
];

const groupToggles = (root: ParentNode) =>
  Array.from(root.querySelectorAll<HTMLInputElement>('[data-select-all-target="groupToggle"]'));
const globalToggle = (root: ParentNode) => root.querySelector<HTMLInputElement>('[data-select-all-target="toggle"]');
const childrenOf = (root: ParentNode, groupIndex: number) =>
  Array.from(
    root.querySelectorAll<HTMLInputElement>(`[data-select-all-group-index="${groupIndex}"] input[name="form[targets][]"]`),
  );
const states = (toggles: HTMLInputElement[]) =>
  toggles.map((t) => `${t.checked ? 'on' : 'off'}${t.indeterminate ? '/mixed' : ''}:${t.getAttribute('aria-checked')}`);
const change = (input: HTMLInputElement, checked: boolean) => {
  input.checked = checked;
  input.dispatchEvent(new Event('change', { bubbles: true }));
};
const tick = () => new Promise((r) => setTimeout(r, 0));

describe('select-all groups', () => {
  beforeEach(() => {
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const log = createBundleLogger('select-all-choice');
    setBundleLogger(log);
    log.setDebug(true);
    ensureNowoSelectAllChoiceDefined();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  describe('load state', () => {
    it('shows checked / indeterminate / unchecked per group and a mixed global box on load', () => {
      document.body.innerHTML = groupsHtml(BEACON);
      const root = document.body.firstElementChild as HTMLElement;

      expect(root.getAttribute(ATTR_INIT)).toBe('1');
      expect(states(groupToggles(root))).toEqual(['on:true', 'off/mixed:mixed', 'off:false']);
      expect(states([globalToggle(root)!])).toEqual(['off/mixed:mixed']);
    });

    it('corrects a stale server state: every child checked means a checked group box (Beacon bug)', () => {
      document.body.innerHTML = groupsHtml([
        { label: 'Incidents', serverState: 'false', children: [{ value: 'a', checked: true }, { value: 'b', checked: true }] },
        { label: 'Tasks', serverState: 'true', children: [{ value: 'c' }] },
      ]);
      const root = document.body.firstElementChild as HTMLElement;

      expect(states(groupToggles(root))).toEqual(['on:true', 'off:false']);
    });

    it('places the global box above the groups and points it at every child', () => {
      document.body.innerHTML = groupsHtml(BEACON);
      const root = document.body.firstElementChild as HTMLElement;
      const wrapper = root.querySelector('[data-select-all-target="toggleWrapper"]')!;

      expect(wrapper.nextElementSibling?.getAttribute('data-select-all-target')).toBe('choices');
      expect(globalToggle(root)!.getAttribute('aria-controls')).toBe(
        'form_targets_0 form_targets_1 form_targets_2 form_targets_3 form_targets_4',
      );
    });

    it('creates no global box when data-select-all-global-value is false', () => {
      document.body.innerHTML = groupsHtml(BEACON, { global: false });
      const root = document.body.firstElementChild as HTMLElement;

      expect(globalToggle(root)).toBeNull();
      expect(states(groupToggles(root))).toEqual(['on:true', 'off/mixed:mixed', 'off:false']);
    });

    it('disables a group box whose children are all disabled', () => {
      document.body.innerHTML = groupsHtml([
        { label: 'Locked', children: [{ value: 'a', disabled: true, checked: true }] },
        { label: 'Open', children: [{ value: 'b' }] },
      ]);
      const [locked, open] = groupToggles(document.body);

      expect(locked.disabled).toBe(true);
      expect(open.disabled).toBe(false);
    });
  });

  describe('child change', () => {
    it('updates the group box and the global box when a child changes', () => {
      document.body.innerHTML = groupsHtml(BEACON);
      const root = document.body.firstElementChild as HTMLElement;

      change(childrenOf(root, 1)[1], true); // Availability complete
      expect(states(groupToggles(root))).toEqual(['on:true', 'on:true', 'off:false']);
      expect(states([globalToggle(root)!])).toEqual(['off/mixed:mixed']);

      change(childrenOf(root, 2)[0], true); // Tasks complete → everything checked
      expect(states([globalToggle(root)!])).toEqual(['on:true']);
    });

    it('turns a full group into indeterminate (aria-checked="mixed") when one child is unticked', () => {
      document.body.innerHTML = groupsHtml(BEACON);
      const root = document.body.firstElementChild as HTMLElement;

      change(childrenOf(root, 0)[0], false);

      const [incidents] = groupToggles(root);
      expect(incidents.indeterminate).toBe(true);
      expect(incidents.checked).toBe(false);
      expect(incidents.getAttribute('aria-checked')).toBe('mixed');

      change(childrenOf(root, 0)[1], false);
      expect(states([incidents])).toEqual(['off:false']);
    });

    it('ignores change events that do not come from a checkbox', () => {
      document.body.innerHTML = groupsHtml(BEACON);
      const root = document.body.firstElementChild as HTMLElement;
      const choices = root.querySelector<HTMLElement>('[data-select-all-target="choices"]')!;
      const text = document.createElement('input');
      text.type = 'text';
      choices.appendChild(text);
      childrenOf(root, 0)[0].checked = false; // changed without an event: must not be picked up yet

      text.dispatchEvent(new Event('change', { bubbles: true }));
      choices.dispatchEvent(new Event('change', { bubbles: true }));

      expect(states(groupToggles(root))[0]).toBe('on:true');
    });
  });

  describe('group box', () => {
    it('ticks and unticks the enabled children of its group only, and emits one change from the choices', () => {
      document.body.innerHTML = `<form>${groupsHtml([
        { label: 'Availability', children: [{ value: 'a' }, { value: 'b', checked: true }, { value: 'locked', disabled: true }] },
        { label: 'Tasks', children: [{ value: 'c' }] },
      ])}</form>`;
      const root = document.querySelector<HTMLElement>('nowo-select-all-choice')!;
      const choices = root.querySelector('[data-select-all-target="choices"]')!;
      const fromChoices: EventTarget[] = [];
      document.querySelector('form')!.addEventListener('change', (e) => {
        fromChoices.push(e.target!);
      });
      const [availability] = groupToggles(root);

      change(availability, true);
      expect(childrenOf(root, 0).map((c) => c.checked)).toEqual([true, true, false]);
      expect(childrenOf(root, 1)[0].checked).toBe(false);
      expect(states([availability])).toEqual(['on:true']);
      expect(states([globalToggle(root)!])).toEqual(['off/mixed:mixed']);
      expect(fromChoices).toEqual([choices]); // one event per click, from the choices, never from the box

      change(availability, false);
      expect(childrenOf(root, 0).map((c) => c.checked)).toEqual([false, false, false]);
      expect(states([globalToggle(root)!])).toEqual(['off:false']);
    });

    it('group boxes are ignored when the container has groups disabled', () => {
      document.body.innerHTML = groupsHtml(BEACON).replace('data-select-all-groups-value="true"', 'data-select-all-groups-value="false"');
      const root = document.body.firstElementChild as HTMLElement;
      const [incidents, availability] = groupToggles(root);

      change(availability, true);
      expect(childrenOf(root, 1)[1].checked).toBe(false);

      // Without groups the boxes are not synced either (they keep the server state).
      expect(incidents.getAttribute('aria-checked')).toBe('false');
    });

    it('a group box outside any group fieldset is ignored', () => {
      document.body.innerHTML = groupsHtml(BEACON);
      const root = document.body.firstElementChild as HTMLElement;
      const stray = document.createElement('input');
      stray.type = 'checkbox';
      stray.setAttribute('data-select-all-target', 'groupToggle');
      root.querySelector('[data-select-all-target="choices"]')!.appendChild(stray);
      change(stray, true);
      expect(states([globalToggle(root)!])).toEqual(['off/mixed:mixed']);
    });

    it('skips a group rendered without its box (custom theme)', () => {
      document.body.innerHTML = groupsHtml(BEACON);
      const root = document.body.firstElementChild as HTMLElement;
      root.querySelector('[data-select-all-group-index="2"] .nowo-select-all-choice__group-toggle')!.remove();

      expect(() => refreshSelectAllContainer(root)).not.toThrow();
      expect(groupToggles(root)).toHaveLength(2);
    });
  });

  describe('form reset', () => {
    it('resyncs every box after the form is reset', async () => {
      document.body.innerHTML = `<form>${groupsHtml(BEACON)}</form>`;
      const root = document.querySelector<HTMLElement>('nowo-select-all-choice')!;
      change(groupToggles(root)[1], true);
      change(groupToggles(root)[2], true);
      expect(states([globalToggle(root)!])).toEqual(['on:true']);

      document.querySelector('form')!.reset();
      await tick();

      expect(states(groupToggles(root))).toEqual(['on:true', 'off/mixed:mixed', 'off:false']);
      expect(states([globalToggle(root)!])).toEqual(['off/mixed:mixed']);
    });
  });

  describe('global and group interplay', () => {
    it('the global box ticks every group and unticks every group', () => {
      document.body.innerHTML = groupsHtml(BEACON, { ungrouped: [{ value: 'digest' }] });
      const root = document.body.firstElementChild as HTMLElement;
      const global = globalToggle(root)!;

      change(global, true);
      expect(states(groupToggles(root))).toEqual(['on:true', 'on:true', 'on:true']);
      expect(root.querySelector<HTMLInputElement>('input[value="digest"]')!.checked).toBe(true);
      expect(states([global])).toEqual(['on:true']);

      change(global, false);
      expect(states(groupToggles(root))).toEqual(['off:false', 'off:false', 'off:false']);
      expect(states([global])).toEqual(['off:false']);
    });

    it('the global box becomes indeterminate when a group is partial, and checked when the last group completes', () => {
      document.body.innerHTML = groupsHtml(BEACON);
      const root = document.body.firstElementChild as HTMLElement;
      const global = globalToggle(root)!;
      const [, availability, tasks] = groupToggles(root);

      change(availability, true);
      expect(states([global])).toEqual(['off/mixed:mixed']);
      change(tasks, true);
      expect(states([global])).toEqual(['on:true']);
      change(childrenOf(root, 1)[0], false);
      expect(states([availability, global])).toEqual(['off/mixed:mixed', 'off/mixed:mixed']);
    });
  });

  describe('re-render after a validation error', () => {
    it('a dialog body replaced with the re-rendered form starts from the submitted state', async () => {
      document.body.innerHTML = '<dialog open><div class="nowo-ui-dialog__body"></div></dialog>';
      const body = document.querySelector<HTMLElement>('.nowo-ui-dialog__body')!;
      body.innerHTML = `<form>${groupsHtml(BEACON)}</form>`;
      const first = body.querySelector<HTMLElement>('nowo-select-all-choice')!;
      const firstChild = childrenOf(first, 2)[0];

      // 422 from the server: the dialog body is replaced with the re-rendered form (submitted values kept).
      body.innerHTML = `<form>${groupsHtml([
        { label: 'Incidents', serverState: 'mixed', children: [{ value: 'issue.new' }, { value: 'issue.regression' }] },
        { label: 'Availability', serverState: 'mixed', children: [{ value: 'monitor.down', checked: true }, { value: 'monitor.up', checked: true }] },
        { label: 'Tasks', children: [{ value: 'task.failed', checked: true }] },
      ])}</form>`;
      await tick();

      // The detached container was cleaned up: marker gone, no listener left.
      expect(first.hasAttribute(ATTR_INIT)).toBe(false);
      expect(globalToggle(first)).toBeNull();
      change(firstChild, true);
      expect(groupToggles(first)[2].getAttribute('aria-checked')).toBe('false');

      const second = body.querySelector<HTMLElement>('nowo-select-all-choice')!;
      expect(states(groupToggles(second))).toEqual(['off:false', 'on:true', 'on:true']);
      expect(states([globalToggle(second)!])).toEqual(['off/mixed:mixed']);
      expect(second.querySelectorAll('[data-select-all-target="toggleWrapper"]')).toHaveLength(1);
    });

    it('a container moved in the DOM is re-initialized once, without duplicate boxes or listeners', () => {
      document.body.innerHTML = `<div id="a">${groupsHtml(BEACON)}</div><div id="b"></div>`;
      const root = document.querySelector<HTMLElement>('nowo-select-all-choice')!;
      document.getElementById('b')!.appendChild(root);

      expect(root.querySelectorAll('[data-select-all-target="toggleWrapper"]')).toHaveLength(1);
      const choices = root.querySelector('[data-select-all-target="choices"]')!;
      let count = 0;
      choices.addEventListener('change', (e) => {
        if (e.target === choices) count++;
      });
      change(groupToggles(root)[2], true);
      expect(count).toBe(1);
    });

    it('refreshSelectAllContainer picks up choices changed from script without events', () => {
      document.body.innerHTML = groupsHtml(BEACON);
      const root = document.body.firstElementChild as HTMLElement;
      childrenOf(root, 2)[0].checked = true;
      childrenOf(root, 1)[1].checked = true;

      refreshSelectAllContainer(root);

      expect(states([globalToggle(root)!])).toEqual(['on:true']);
      expect(() => refreshSelectAllContainer(document.createElement('div'))).not.toThrow();
    });
  });

  describe('Stimulus inside dynamically inserted HTML (UiKit dialog loaded via fetch)', () => {
    let application: Application;

    beforeEach(() => {
      application = Application.start();
      application.register('select-all', SelectAllController);
    });

    afterEach(() => {
      application.stop();
    });

    it('connects on insert and cleans up on disconnect, with no state left behind', async () => {
      document.body.innerHTML = '<dialog open><div data-dialog-body></div></dialog>';
      const html = await Promise.resolve(groupsHtml(BEACON, { tag: 'div' })); // fetch() response body
      const body = document.querySelector<HTMLElement>('[data-dialog-body]')!;
      body.innerHTML = html;
      const host = body.querySelector<HTMLElement>('[data-controller="select-all"]')!;
      expect(host.hasAttribute(ATTR_INIT)).toBe(false);

      await tick();

      expect(host.getAttribute(ATTR_INIT)).toBe('1');
      expect(states(groupToggles(host))).toEqual(['on:true', 'off/mixed:mixed', 'off:false']);
      change(groupToggles(host)[2], true);
      expect(childrenOf(host, 2)[0].checked).toBe(true);

      host.remove();
      await tick();

      expect(host.hasAttribute(ATTR_INIT)).toBe(false);
      expect(globalToggle(host)).toBeNull();
      change(childrenOf(host, 2)[0], false);
      expect(groupToggles(host)[2].getAttribute('aria-checked')).toBe('true');

      // Re-inserting the same markup works again (second dialog open).
      body.appendChild(host);
      await tick();
      expect(host.getAttribute(ATTR_INIT)).toBe('1');
      expect(states(groupToggles(host))[2]).toBe('off:false');
    });

    it('two dialogs at once keep independent state', async () => {
      document.body.innerHTML = `<dialog open>${groupsHtml(BEACON, { tag: 'div' })}</dialog><dialog open>${groupsHtml(BEACON, { tag: 'div' })}</dialog>`;
      await tick();
      const [one, two] = Array.from(document.querySelectorAll<HTMLElement>('[data-controller="select-all"]'));

      change(groupToggles(one)[2], true);

      expect(states([globalToggle(one)!])).toEqual(['off/mixed:mixed']);
      expect(states(groupToggles(two))[2]).toBe('off:false');
    });
  });

  describe('API', () => {
    it('applyToggleState keeps checked, indeterminate and aria-checked in sync', () => {
      const box = document.createElement('input');
      box.type = 'checkbox';
      applyToggleState(box, 'mixed');
      expect(states([box])).toEqual(['off/mixed:mixed']);
      applyToggleState(box, 'checked');
      expect(states([box])).toEqual(['on:true']);
      applyToggleState(box, 'unchecked');
      expect(states([box])).toEqual(['off:false']);
    });

    it('destroySelectAllContainer is a no-op on an element that was never initialized', () => {
      const el = document.createElement('div');
      el.setAttribute(ATTR_INIT, '1');
      expect(destroySelectAllContainer(el)).toBe(false);
      expect(el.hasAttribute(ATTR_INIT)).toBe(false);
    });

    it('re-init after the marker is cleared tears the previous init down first', () => {
      document.body.innerHTML = groupsHtml(BEACON, { tag: 'div' });
      const host = document.body.firstElementChild as HTMLElement;
      expect(initSelectAllContainer(host)).toBe(true);
      host.removeAttribute(ATTR_INIT);
      expect(initSelectAllContainer(host)).toBe(true);

      expect(host.querySelectorAll('[data-select-all-target="toggleWrapper"]')).toHaveLength(1);
    });

    it('the collapsed global box points at the select, and omits aria-controls without ids', () => {
      document.body.innerHTML = `
        <div data-controller="select-all" data-select-all-expanded-value="false">
          <div data-select-all-target="choices"><select id="form_targets" multiple><option>A</option></select></div>
        </div>
        <div data-controller="select-all" data-select-all-expanded-value="true">
          <div data-select-all-target="choices"><input type="checkbox"></div>
        </div>`;
      const [collapsed, expanded] = Array.from(document.querySelectorAll<HTMLElement>('[data-controller="select-all"]'));
      initSelectAllContainer(collapsed);
      initSelectAllContainer(expanded);

      expect(globalToggle(collapsed)!.getAttribute('aria-controls')).toBe('form_targets');
      expect(globalToggle(expanded)!.hasAttribute('aria-controls')).toBe(false);
      expect(globalToggle(expanded)!.getAttribute('aria-checked')).toBe('false');
    });
  });
});
