import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

/**
 * FE unit layer (T4-W2). Deliberately PLAIN — no shared vite.config plugins, no exotic
 * transforms — so it survives the W5 TypeScript bump untouched (the unit lane must not
 * red on the toolchain currency wave). It carries only what the units need: the Vue SFC
 * transform (for the mounted DOM-contract units) and the three tsconfig-`paths` aliases.
 *
 * Units are colocated `*.test.ts` beside their subject (house discipline); Playwright owns
 * `e2e/**` and vitest never reaches into it (the `include` glob is `src/**` only, so the
 * two runners can't cross-collect each other's specs).
 */
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@pencil': fileURLToPath(new URL('./src/pencil', import.meta.url)),
      '@games': fileURLToPath(new URL('./src/games', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    // A concrete same-origin URL so jsdom provisions `localStorage` and `history.replaceState`
    // has a real origin to write `?board=` against — the codec reads both.
    environmentOptions: { jsdom: { url: 'http://localhost/' } },
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.ts'],
    // Explicit imports from 'vitest' in every unit (globals off) — nothing added to the
    // app tsconfig's ambient types, another seam kept clean for the W5 bump.
    globals: false,
  },
})
