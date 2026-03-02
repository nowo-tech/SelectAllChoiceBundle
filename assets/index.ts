/**
 * Entry point for SelectAllChoiceBundle frontend assets.
 *
 * Import this in your app's main JS/TS after Stimulus is started, or register
 * the controller manually via registerSelectAll(application).
 */
import type { Application } from '@hotwired/stimulus';
import SelectAllController from './controllers/select_all_controller';

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
