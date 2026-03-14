import { defineConfig } from 'vitest/config';

/**
 * Vitest configuration for SelectAllChoiceBundle TypeScript unit tests.
 * Runs all `*.test.ts` under src/Resources/assets with jsdom and coverage.
 */
export default defineConfig({
  define: {
    __SELECT_ALL_CHOICE_BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/Resources/assets/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html'],
      reportsDirectory: './coverage-ts',
      include: ['src/Resources/assets/**/*.ts'],
      exclude: ['src/Resources/assets/**/*.test.ts', '**/node_modules/**'],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 83,
        statements: 100,
      },
    },
  },
  resolve: {
    extensions: ['.ts'],
  },
});

