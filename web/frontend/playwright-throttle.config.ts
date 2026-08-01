import { defineConfig } from "@playwright/test";

/**
 * The BUILT-DIST config (historically, and still by filename, the throttled-void config).
 *
 * Two specs need a bundled production artifact rather than the dev server, so they share one
 * build + one preview here (compute-cost DAG — no second CI job, no redundant `vite build`):
 *
 *  · throttled-void — the F3 flake, below.
 *  · wordmark-integrity — P1 G3.4, in WEBKIT (see the project note below).
 *  · theme-bake-freshness — P1-W4 G4.5, in BOTH engines: after one theme toggle the baked
 *    logo and grid must carry the live theme's ink. Same reasoning as the census — the bake
 *    that ships is the one worth asserting over.
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
  testDir: "./e2e",
  timeout: 90000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  globalSetup: "./e2e/global-setup.ts",
  // ITS OWN report folder. This config declared no reporter at all, so a red here printed
  // `test-results/…/test-failed-1.png` paths into a directory CI does not upload, while the
  // `playwright-report/` artifact carried the GOLDEN config's report — which is why run
  // 30684983201's failure arrived with no screenshot and no error context to read. A separate
  // outputFolder keeps both reports (the golden gate runs first and must not be clobbered).
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report-throttle" }],
  ],
  projects: [
    {
      name: "throttled-void",
      testMatch: /throttled-void\.spec\.ts$/,
      // The real fix is the bundled preview build; this one probe keeps a single retry as the
      // sanctioned safety margin on a loaded runner (spec §"grant this one spec retries").
      retries: 1,
    },
    // BOTH engines. The census is an exact-match allowlist over what the deployed artifact
    // RENDERS, and rendering is the engine's job: production pass 4 counted 9/9 with the union
    // area on budget to the unit in webkit as well as chromium, so the second engine costs one
    // spec on the preview already running and gates the artifact in the browser half the
    // owner's traffic uses. retries:0 in both — a retried census is a census that lies.
    ...(["chromium", "webkit"] as const).map((browserName) => ({
      name: `filter-census-${browserName}`,
      testMatch: /filter-census\.spec\.ts$/,
      retries: 0,
      use: { browserName },
    })),
    {
      // P1 G3.4 — mark 4's two font defects are WEBKIT defects (it resolves
      // `font-optical-sizing: auto` to the opsz axis minimum, and it pins a filtered
      // SVG-as-image bake at its declared intrinsic), so this one asserts in WebKit or asserts
      // nothing. Same bundled preview; the assertion is over the baked pose BITMAPS.
      name: "wordmark-webkit",
      testMatch: /wordmark-integrity\.spec\.ts$/,
      // ONE retry, and the reason is the CI record, not a preference. Run 30684983201 red the
      // `killer` row alone with "no ink in the baked pose at all" — and it is NOT the linux
      // Playwright-WebKit font hole that shape suggests: the same run, same engine, same host
      // passed the other FOUR game rows AND the Fraunces zero-fallback probe, and this same
      // project passed all six rows on the same runner image at 117c18ef, 646c82ad and
      // 6800af04 (runs 30654525795 / 30660276696 / 30663743674). It never reproduced on
      // darwin, in the suite or against 180 synthetic captures of the same recipe.
      //
      // So the row is not a deterministic read the way the census beside it is: it asserts
      // over an ASYNCHRONOUS bake — a detached SVG document that loads its own copy of the
      // inlined face and is captured on one `drawImage` — and a retry re-bakes it from a
      // fresh page, which is the only instrument that can tell a one-shot bad capture from a
      // real one. `throttled-void`'s sanctioned retry is the same argument on the same host.
      // Playwright REPORTS a retried pass as flaky, so this hides nothing: a recurring empty
      // bake still surfaces, now carrying the pose bitmap the spec attaches (bake-evidence.ts).
      // The edge-clip invariant the row was born for is untouched, and so is darwin.
      retries: 1,
      use: { browserName: "webkit" },
    },
    // P1-W4 G4.5 — the baked surfaces must re-ink on a theme toggle. Engine-INDEPENDENT (it
    // was measured identically in WebKit and Chromium on the deployed artifact), so unlike
    // wordmark-integrity it runs in both. retries:0 — the assertion is a colour read off a
    // decoded bitmap, deterministic, and a retried colour read is a colour read that lies.
    ...(["chromium", "webkit"] as const).map((browserName) => ({
      name: `theme-bake-${browserName}`,
      testMatch: /theme-bake-freshness\.spec\.ts$/,
      retries: 0,
      use: { browserName },
    })),
  ],
  use: {
    baseURL: externalBase || `http://localhost:${PREVIEW_PORT}`,
    viewport: { width: 1280, height: 800 },
    screenshot: "only-on-failure",
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
        env: { VITE_BASE_URL: "/" },
      },
});
