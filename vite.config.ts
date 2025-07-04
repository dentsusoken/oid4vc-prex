import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './lib/index.ts',
      name: 'oid4vc-prex',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['@vecrea/oid4vc-core'],
    },
  },
});
