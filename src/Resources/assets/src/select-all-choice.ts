/**
 * SelectAllChoiceBundle standalone entry.
 * Defines the `nowo-select-all-choice` custom element, creates the logger, exposes
 * init/runInit/runInitAndObserve on window, and runs runInitAndObserve when the DOM is ready
 * so "Select all" works without Stimulus. For Stimulus apps, import the controller module
 * (which also registers the custom element) or call ensureNowoSelectAllChoiceDefined().
 */

import { createBundleLogger } from './logger';
import { ensureNowoSelectAllChoiceDefined } from './nowo-select-all-choice-element';
import {
  setBundleLogger,
  runInitAndObserve,
  runInit,
  initSelectAllContainer,
  getLogger,
} from './select-all-choice-lib';

ensureNowoSelectAllChoiceDefined();

declare const __SELECT_ALL_CHOICE_BUILD_TIME__: string;

const log = createBundleLogger('select-all-choice', {
  buildTime:
    typeof __SELECT_ALL_CHOICE_BUILD_TIME__ !== 'undefined' ? __SELECT_ALL_CHOICE_BUILD_TIME__ : undefined,
});
log.scriptLoaded();
setBundleLogger(log);

if (typeof window !== 'undefined') {
  getLogger().debug('standalone entry: exposing NowoSelectAllChoice on window');
  (window as unknown as {
    NowoSelectAllChoice?: {
      initSelectAllContainer: typeof initSelectAllContainer;
      runInit: typeof runInit;
      runInitAndObserve: typeof runInitAndObserve;
    };
  }).NowoSelectAllChoice = {
    initSelectAllContainer,
    runInit,
    runInitAndObserve,
  };
}

if (document.readyState === 'loading') {
  getLogger().debug('standalone entry: DOM loading, scheduling runInitAndObserve on DOMContentLoaded');
  document.addEventListener('DOMContentLoaded', runInitAndObserve);
} else {
  getLogger().debug('standalone entry: DOM ready, running runInitAndObserve now');
  runInitAndObserve();
}
