import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@milkybytes/image-dropzone': new URL('../src/index.ts', import.meta.url).pathname,
    },
    dedupe: ['react', 'react-dom'],
  },
});
