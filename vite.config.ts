import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: './lib/index.ts',
        internal: './lib/internal/index.ts',
      },
      name: 'oid4vc-prex',
      formats: ['es', 'cjs'],
      fileName: (format, entry) => {
        const ext = format === 'es' ? 'mjs' : format;
        const indexFile = `index.${ext}`;

        return entry === 'index' ? indexFile : `${entry}/${indexFile}`;
        //return `${dir}/index.${ext}`;
      },
    },
    rollupOptions: {
      external: ['@vecrea/oid4vc-core'],
    },
  },
});
