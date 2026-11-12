/**
 * Stimulus controller for the "select-all" choice widget (legacy hook alongside
 * the `nowo-select-all-choice` custom element). Importing this module registers
 * that custom element so markup can use either the autonomous element or
 * data-controller="select-all" on a plain host.
 *
 * Register: application.register('select-all', SelectAllController);
 *
 * The controller holds no state of its own and nothing global: connect() initializes the element it is attached to
 * (works for markup inserted later, e.g. a UiKit dialog body loaded via fetch) and disconnect() removes every
 * listener and the global box it created, so a re-inserted form starts clean.
 */

import { Controller } from '@hotwired/stimulus';
import { ensureNowoSelectAllChoiceDefined } from '../src/nowo-select-all-choice-element';
import {
  destroySelectAllContainer,
  getLogger,
  initSelectAllContainer,
  logConfiguredContainerCount,
} from '../src/select-all-choice-lib';

ensureNowoSelectAllChoiceDefined();

export default class SelectAllController extends Controller {
  connect(): void {
    getLogger().debug('select-all (controller): connect', {
      isHTMLElement: this.element instanceof HTMLElement,
    });
    if (this.element instanceof HTMLElement) {
      const ok = initSelectAllContainer(this.element);
      logConfiguredContainerCount();
      if (ok) {
        getLogger().debug('select-all (controller): container initialized');
      } else {
        getLogger().debug('select-all (controller): init skipped (already initialized or no choices target)');
      }
    }
  }

  disconnect(): void {
    if (this.element instanceof HTMLElement) {
      destroySelectAllContainer(this.element);
      getLogger().debug('select-all (controller): disconnect');
    }
  }
}
