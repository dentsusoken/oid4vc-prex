import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './lib/index.ts',
      name: 'oid4vc-prex',
      fileName: 'index',
    },
  },
});
