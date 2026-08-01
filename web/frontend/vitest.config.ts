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
 *
 * COVERAGE (T5-W1.14, completeness GAP-6). The instrument lands BEFORE the W2 distill so the
 * collapse of ~4,150 raw LOC across five games has a measured floor to clear rather than a
 * hope. Provider `v8` — it reads the runtime's own coverage, needs no instrumenting transform,
 * and so keeps this config's plainness pledge intact. `include` is the whole `src/**` app
 * surface (`.ts` + `.vue`), never the union of files a test happened to import: an unimported
 * module must read 0%, because "collapsed five modules into one and lost its only caller" is
 * exactly the W2 failure the floor exists to catch, and an import-scoped denominator hides it.
 * Excluded: the units themselves, type-only declarations, the `main.ts` bootstrap (mounts the
 * app — no unit ever executes it), and generated/vendored assets.
 *
 * `reportsDirectory` is gitignored; the enforceable artifact is `coverage/coverage-summary.json`
 * (json-summary), read by `scripts/check-coverage-floor.mjs` against the banked
 * `coverage-floor.json`. Thresholds live in that script, NOT in `coverage.thresholds`, for two
 * reasons: the floor is per-scope (each game + shared + the global total), which vitest's flat
 * threshold block cannot express; and the script can `--self-test`, proving the gate able to
 * fail before CI trusts its green (the `lint:ink` house pattern).
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
    include: ['src/composables/useTheme.test.ts'] /* CANARY ARM 4: narrowed to one real file — the >=300 floor must red */,
    // Explicit imports from 'vitest' in every unit (globals off) — nothing added to the
    // app tsconfig's ambient types, another seam kept clean for the W5 bump.
    globals: false,
    coverage: {
      provider: 'v8',
      // `text` for the human reading the log, `json-summary` for the floor gate,
      // `json` for the per-file detail W2 re-derives its collapsed-module rows from.
      reporter: ['text', 'json-summary', 'json'],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts', 'src/**/*.vue'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.d.ts',
        // The bootstrap: `createApp(App).mount('#app')`. Executed by the browser, never
        // by a unit — counting it only adds a permanently-0% file to the denominator.
        'src/main.ts',
      ],
      // Report every included file, imported by a unit or not (see the header note).
      all: true,
      // Off here: enforcement is `scripts/check-coverage-floor.mjs` (per-scope + self-test).
      thresholds: undefined,
    },
  },
})
