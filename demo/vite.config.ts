import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  // Set base to './' for GitHub Pages subdirectory deployment.
  // Change to '/<repo-name>/' if your pages site lives at a sub-path.
  base: './',
  resolve: {
    alias: {
      '@milkybytes/image-dropzone': new URL('../src/index.ts', import.meta.url).pathname,
    },
    dedupe: ['react', 'react-dom'],
  },
});
