import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Only scan the React entry; legacy/ holds the old static site (Three.js via CDN import map).
  optimizeDeps: { entries: ['index.html'] },
});
