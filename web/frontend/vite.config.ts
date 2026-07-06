import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import autoprefixer from 'autoprefixer'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.VITE_BASE_URL || '/',
  resolve: {
    alias: {
      '@pencil': path.resolve(__dirname, './src/pencil'),
      '@games': path.resolve(__dirname, './src/games'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  plugins: [vue(), tailwindcss()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    hmr: {
      host: 'localhost',
      port: 3000,
    },
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || `http://localhost:${process.env.VITE_API_PORT || '8000'}`,
        changeOrigin: true,
      },
    },
  },
  build: {
    target: 'es2020',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue'],
          // keyframes.js dropped from the app runtime by W8's 4th workstream (grid + glyph
          // draw-in migrated off `KeyframesAnimation` onto the unified scheduler's `sequence`
          // subscriber kind), so it no longer enters any chunk — only pencil-boil remains here.
          'animation-vendor': ['@mkbabb/pencil-boil'],
        },
      },
    },
  },
})
