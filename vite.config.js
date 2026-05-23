import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Cloudflare Pages sets CF_PAGES=1 automatically — use root base there,
// keep the /Thai-Study/ sub-path for GitHub Pages.
const base = process.env.CF_PAGES ? '/' : '/Thai-Study/';

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
