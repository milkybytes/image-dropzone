import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({ include: ['src'], exclude: ['src/__tests__'], insertTypesEntry: true }),
  ],
  build: {
    lib: {
      entry: resolve('src/index.ts'),
      name: 'ReactImageDropzone',
      formats: ['es'],
      fileName: () => 'index.es.js',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
    cssCodeSplit: false,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
  },
});
