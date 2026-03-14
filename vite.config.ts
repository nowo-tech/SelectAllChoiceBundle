import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    __SELECT_ALL_CHOICE_BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  build: {
    outDir: 'src/Resources/public',
    emptyOutDir: false,
    rollupOptions: {
      input: 'src/Resources/assets/index.ts',
      output: {
        format: 'iife',
        entryFileNames: 'select-all-choice.js',
        assetFileNames: 'select-all-choice.[ext]',
      },
    },
    minify: true,
    sourcemap: false,
  },
  resolve: {
    extensions: ['.ts'],
  },
});
