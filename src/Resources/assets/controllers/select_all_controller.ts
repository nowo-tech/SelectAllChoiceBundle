/**
 * Stimulus controller for the "select-all" choice widget (legacy hook alongside
 * the `nowo-select-all-choice` custom element). Importing this module registers
 * that custom element so markup can use either the autonomous element or
 * data-controller="select-all" on a plain host.
 *
 * Register: application.register('select-all', SelectAllController);
 */

import { Controller } from '@hotwired/stimulus';
import { ensureNowoSelectAllChoiceDefined } from '../src/nowo-select-all-choice-element';
import { getLogger, initSelectAllContainer, logConfiguredContainerCount } from '../src/select-all-choice-lib';

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
}
