import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createBundleLogger } from './logger';

describe('logger', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createBundleLogger', () => {
    it('scriptLoaded logs without build time when options empty', () => {
      const log = createBundleLogger('test-bundle');
      log.scriptLoaded();
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('script loaded'),
        expect.any(String),
      );
      expect(console.log).not.toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.stringMatching(/\d{4}-\d{2}-\d{2}/),
      );
    });

    it('scriptLoaded logs with build time when buildTime provided', () => {
      const log = createBundleLogger('test-bundle', { buildTime: '2026-01-15T12:00:00.000Z' });
      log.scriptLoaded();
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('script loaded'),
        expect.any(String),
        'color:#059669',
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('2026-01-15T12:00:00.000Z'),
        expect.any(String),
        expect.any(String),
      );
    });

    it('scriptLoaded logs without build time when buildTime is empty string', () => {
      const log = createBundleLogger('test-bundle', { buildTime: '' });
      log.scriptLoaded();
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('script loaded'),
        expect.any(String),
      );
    });

    it('setDebug enables debug logging', () => {
      const log = createBundleLogger('test-bundle');
      log.setDebug(true);
      log.debug('msg');
      expect(console.debug).toHaveBeenCalled();
    });

    it('debug does nothing when debug disabled', () => {
      const log = createBundleLogger('test-bundle');
      log.debug('msg');
      expect(console.debug).not.toHaveBeenCalled();
    });

    it('debug with args calls console.debug with formatted args', () => {
      const log = createBundleLogger('test-bundle');
      log.setDebug(true);
      log.debug('foo', { a: 1 });
      expect(console.debug).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        'foo',
        '{"a":1}',
      );
    });

    it('debug with no args calls console.debug with prefix only', () => {
      const log = createBundleLogger('test-bundle');
      log.setDebug(true);
      log.debug();
      expect(console.debug).toHaveBeenCalledWith(expect.any(String), expect.any(String));
    });

    it('info does nothing when debug disabled', () => {
      const log = createBundleLogger('test-bundle');
      log.info('msg');
      expect(console.info).not.toHaveBeenCalled();
    });

    it('info with args when debug enabled', () => {
      const log = createBundleLogger('test-bundle');
      log.setDebug(true);
      log.info('x', { b: 2 });
      expect(console.info).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        'x',
        '{"b":2}',
      );
    });

    it('info with no args when debug enabled', () => {
      const log = createBundleLogger('test-bundle');
      log.setDebug(true);
      log.info();
      expect(console.info).toHaveBeenCalledWith(expect.any(String), expect.any(String));
    });

    it('warn does nothing when debug disabled', () => {
      const log = createBundleLogger('test-bundle');
      log.warn('msg');
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('warn with args when debug enabled', () => {
      const log = createBundleLogger('test-bundle');
      log.setDebug(true);
      log.warn('w', new Error('e'));
      expect(console.warn).toHaveBeenCalled();
    });

    it('warn with no args when debug enabled', () => {
      const log = createBundleLogger('test-bundle');
      log.setDebug(true);
      log.warn();
      expect(console.warn).toHaveBeenCalledWith(expect.any(String), expect.any(String));
    });

    it('error does nothing when debug disabled', () => {
      const log = createBundleLogger('test-bundle');
      log.error('msg');
      expect(console.error).not.toHaveBeenCalled();
    });

    it('error with args when debug enabled', () => {
      const log = createBundleLogger('test-bundle');
      log.setDebug(true);
      log.error('err', { code: 500 });
      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        'err',
        '{"code":500}',
      );
    });

    it('error with no args when debug enabled', () => {
      const log = createBundleLogger('test-bundle');
      log.setDebug(true);
      log.error();
      expect(console.error).toHaveBeenCalledWith(expect.any(String), expect.any(String));
    });

    it('prefix includes bundle name', () => {
      const log = createBundleLogger('my-bundle');
      log.setDebug(true);
      log.debug('test');
      expect(console.debug).toHaveBeenCalledWith(
        expect.stringContaining('[my-bundle]'),
        expect.any(String),
        'test',
      );
    });
  });
});
