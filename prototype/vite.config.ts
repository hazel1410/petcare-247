import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Isolated clickable prototype for PetCare 24/7 (Phase 1 approval gate).
// Mobile-first; renders inside a phone frame on desktop. No backend — all mock data.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4321,
    host: true,
    strictPort: false,
  },
});
