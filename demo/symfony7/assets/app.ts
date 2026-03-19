/**
 * Demo app entry: start Stimulus and register the bundle's select-all controller.
 */
import { Application } from '@hotwired/stimulus';
import SelectAllController from '/var/select-all-choice-bundle/src/Resources/assets/controllers/select_all_controller.ts';

const application = Application.start();
application.register('select-all', SelectAllController);
