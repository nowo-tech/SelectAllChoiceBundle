/**
 * Entry point for SelectAllChoiceBundle frontend assets.
 *
 * Import this in your app's main JS/TS after Stimulus is started, or register
 * the controller manually via registerSelectAll(application).
 */
import type { Application } from '@hotwired/stimulus';
import { createBundleLogger } from './logger';
import { setBundleLogger } from './controllers/select_all_controller';
import SelectAllController from './controllers/select_all_controller';

declare const __SELECT_ALL_CHOICE_BUILD_TIME__: string;

const log = createBundleLogger('select-all-choice', {
  buildTime:
    /* c8 ignore next */
    typeof __SELECT_ALL_CHOICE_BUILD_TIME__ !== 'undefined' ? __SELECT_ALL_CHOICE_BUILD_TIME__ : undefined,
});
log.scriptLoaded();
setBundleLogger(log);

export { SelectAllController };

/**
 * Registers the "select-all" Stimulus controller with the given application.
 *
 * @param application - The Stimulus Application instance (e.g. from Application.start())
 */
export function registerSelectAll(application: Application): void {
  application.register('select-all', SelectAllController);
}

// Auto-register if a global Stimulus app exists (e.g. window.Stimulus from some Symfony setups)
declare global {
  interface Window {
    Stimulus?: Application;
  }
}
if (typeof window !== 'undefined' && window.Stimulus) {
  registerSelectAll(window.Stimulus);
}

