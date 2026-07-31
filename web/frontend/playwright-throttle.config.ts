import { defineConfig } from '@playwright/test';

/**
 * The BUILT-DIST config (historically, and still by filename, the throttled-void config).
 *
 * Two specs need a bundled production artifact rather than the dev server, so they share one
 * build + one preview here (compute-cost DAG — no second CI job, no redundant `vite build`):
 *
 *  · throttled-void — the F3 flake, below.
 *  · filter-census  — P1 G3.1/G3.2, the live-filter budget. It censuses what the SHIPPED bundle
 *    renders; a dev-server census would read unbundled module graph timing, and the invariant it
 *    guards ("a new filter surface reds CI even when an old one retires") is only worth anything
 *    against the artifact that deploys. `retries: 0` for that project — a census is
 *    deterministic, and a retried census is a census that lies.
 *
 * T4-W2 — the throttled-void config (F3 flake fix).
 *
 * A SEPARATE config from playwright.config.ts on purpose. The D3 throttled-void probe
 * (throttled-void.spec.ts) throttles the network to G10's reproduction (30 KB/s + 500 ms)
 * and first-selects the lazy Futoshiki chunk. Under the DEV server that chunk is unbundled
 * ESM — dozens of modules each pay the 500 ms latency serially, so recovery lands at ~13 s
 * (12.87–13.22 s measured), >50% of the 25 s budget; on a loaded runner it compounds past
 * budget and reds the whole e2e lane (the F3 flake).
 *
 * The real fix (spec §"Flaky pair"): serve a PRODUCTION preview build. `vite build` bundles
 * Futoshiki into ONE hashed chunk, so the throttled first-select fetches a single bundled
 * asset (not a per-module waterfall) — recovery is bounded to a few seconds with wide margin
 * under the same throttle. This config builds to an isolated dist-throttle/ and previews it
 * on a private port (4188; 3000/3001 are reserved), then runs ONLY throttled-void.spec.ts.
 * retries:1 is the belt-and-suspenders the spec sanctions for this one probe on a loaded host.
 *
 * The default config testIgnores throttled-void.spec.ts (it must not run under the flaky dev
 * server); CI runs this via `npm run test:e2e:throttle`.
 */
const PREVIEW_PORT = 4188;
// An external preview (a dist already built and served elsewhere — the 418x convention, or a
// lane's own port when 4188 is taken) suppresses the build+preview, exactly as the golden
// config does. Unset in CI, so the default path is unchanged.
const externalBase = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: './e2e',
  timeout: 90000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  globalSetup: './e2e/global-setup.ts',
  projects: [
    {
      name: 'throttled-void',
      testMatch: /throttled-void\.spec\.ts$/,
      // The real fix is the bundled preview build; this one probe keeps a single retry as the
      // sanctioned safety margin on a loaded runner (spec §"grant this one spec retries").
      retries: 1,
    },
    {
      name: 'filter-census',
      testMatch: /filter-census\.spec\.ts$/,
      retries: 0,
    },
  ],
  use: {
    baseURL: externalBase || `http://localhost:${PREVIEW_PORT}`,
    viewport: { width: 1280, height: 800 },
    screenshot: 'only-on-failure',
  },
  webServer: externalBase
    ? undefined
    : {
        // `vite build` (not `npm run build`) skips vue-tsc — the probes need a bundled artifact,
        // not a typecheck (that gate lives elsewhere). Isolated outDir so it never clobbers dist/.
        command:
          `npx vite build --outDir dist-throttle --logLevel warn && ` +
          `npx vite preview --outDir dist-throttle --port ${PREVIEW_PORT} --strictPort`,
        port: PREVIEW_PORT,
        reuseExistingServer: true,
        timeout: 120000,
        env: { VITE_BASE_URL: '/' },
      },
});
