import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Ensures assets are loaded with relative paths for GitHub Pages and any subpath deployment
  server: {
    port: 5173,
    open: false
  }
});
