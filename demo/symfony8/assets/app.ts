/**
 * Demo app entry: start Stimulus and register the bundle's select-all controller.
 */
import { Application } from '@hotwired/stimulus';
import SelectAllController from '/var/select-all-choice-bundle/src/Resources/assets/controllers/select_all_controller.ts';
import { createBundleLogger } from '/var/select-all-choice-bundle/src/Resources/assets/src/logger.ts';
import { setBundleLogger } from '/var/select-all-choice-bundle/src/Resources/assets/src/select-all-choice-lib.ts';

declare const __SELECT_ALL_CHOICE_BUILD_TIME__: string;

const log = createBundleLogger('select-all-choice', {
  buildTime:
    typeof __SELECT_ALL_CHOICE_BUILD_TIME__ !== 'undefined' ? __SELECT_ALL_CHOICE_BUILD_TIME__ : undefined,
});
log.scriptLoaded();
setBundleLogger(log);

const application = Application.start();
application.register('select-all', SelectAllController);
