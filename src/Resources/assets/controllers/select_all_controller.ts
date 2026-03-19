/**
 * Stimulus controller for the "select-all" choice widget (UX component pattern).
 * Register this controller in your Stimulus application so that elements with
 * data-controller="select-all" are initialized when connected to the DOM
 * (e.g. in Turbo frames or when HTML is injected).
 *
 * The controller delegates to the lib; you do not need to load select-all-choice.js
 * if your app bundle includes this controller. Otherwise include the standalone
 * script so [data-controller*="select-all"] are auto-initialized and observed.
 *
 * Register: application.register('select-all', SelectAllController);
 */

import { Controller } from '@hotwired/stimulus';
import { getLogger, initSelectAllContainer } from '../src/select-all-choice-lib';

export default class SelectAllController extends Controller {
  connect(): void {
    getLogger().debug('select-all (controller): connect', {
      isHTMLElement: this.element instanceof HTMLElement,
    });
    if (this.element instanceof HTMLElement) {
      const ok = initSelectAllContainer(this.element);
      if (ok) {
        getLogger().debug('select-all (controller): container initialized');
      } else {
        getLogger().debug('select-all (controller): init skipped (already initialized or no choices target)');
      }
    }
  }
}
