/**
 * Demo app entry: start Stimulus and register the bundle's select-all controller.
 */
import { Application } from '@hotwired/stimulus';
import { registerSelectAll } from 'select-all-choice-bundle';

const application = Application.start();
registerSelectAll(application);
