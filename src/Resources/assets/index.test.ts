import { Application } from '@hotwired/stimulus';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { registerSelectAll, SelectAllController } from './index';

describe('index', () => {
  let app: Application;

  beforeEach(() => {
    app = Application.start();
  });

  afterEach(() => {
    app.stop();
  });

  it('exports SelectAllController', () => {
    expect(SelectAllController).toBeDefined();
    expect(typeof SelectAllController).toBe('function');
  });

  it('registerSelectAll registers controller with name select-all', () => {
    registerSelectAll(app);
    const registered = app.router.modules.find((m) => m.definition.identifier === 'select-all');
    expect(registered).toBeDefined();
    expect(registered?.definition.identifier).toBe('select-all');
  });

  it('auto-registers when window.Stimulus is set', async () => {
    vi.resetModules();
    const application = Application.start();
    window.Stimulus = application;

    await import('./index');

    const registered = application.router.modules.find((m) => m.definition.identifier === 'select-all');
    expect(registered).toBeDefined();
    application.stop();
    delete window.Stimulus;
  });
});
