import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// In Docker BUNDLE_PATH is set to the bundle entry file; locally use ../../src/Resources/assets/index.ts
const bundleEntry =
  process.env.BUNDLE_PATH || path.resolve(__dirname, '../../src/Resources/assets/index.ts');

export default defineConfig({
  base: '/build/',
  define: {
    __SELECT_ALL_CHOICE_BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  build: {
    outDir: 'public/build',
    emptyOutDir: true,
    manifest: false,
    rollupOptions: {
      input: 'assets/app.ts',
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  resolve: {
    alias: {
      'select-all-choice-bundle': bundleEntry,
    },
    extensions: ['.ts', '.js'],
  },
});
