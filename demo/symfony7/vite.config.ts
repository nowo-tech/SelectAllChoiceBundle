import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// In Docker the bundle is at /var/select-all-choice-bundle; locally use ../../assets
const bundleAssets = process.env.BUNDLE_PATH || path.resolve(__dirname, '../../assets');

export default defineConfig({
  base: '/build/',
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
      'select-all-choice-bundle': bundleAssets,
    },
    extensions: ['.ts', '.js'],
  },
});
