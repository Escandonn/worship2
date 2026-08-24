// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',

  adapter: vercel(),

  integrations: [
    react()
  ],

  vite: {
    optimizeDeps: {
      include: ['firebase/app', 'firebase/auth']
    },
    plugins: [
      tailwindcss()
    ]
  }
});