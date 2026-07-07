import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // domaine personnalisé vv.camp — servi à la racine
  build: {
    outDir: 'dist',
  },
});
