import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'assets/index.ts'),
      name: 'SelectAllChoiceBundle',
      fileName: 'index',
      formats: ['es'],
    },
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: ['@hotwired/stimulus'],
      output: {
        globals: { '@hotwired/stimulus': 'Stimulus' },
      },
    },
  },
  resolve: {
    extensions: ['.ts'],
  },
});
