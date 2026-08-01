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
/**
 * T5-W1 1.6 — THE RETRIES POLICY, and the three flake classes it does and does not reach.
 *
 * THE LAW: a retried pass never greens a lane. `failOnFlakyTests` below makes that true of
 * every project here; it is the only config in the estate that carries a non-zero `retries`
 * (playwright.config.ts:33 and playwright-golden.config.ts:77 are both 0), so it is the only
 * one where the switch has anything to act on. Before it, `grep -rn "failOnFlakyTests" *.config.ts`
 * returned nothing and a retried pass exited 0 — and that had already happened: run
 * 30690204551 recorded `wordmark-webkit`'s `sudoku` row red on attempt 1 and green on attempt
 * 2, reported flaky, lane green.
 *
 * CLASS 1 — the asynchronous bake (`wordmark-webkit`). RETRIES REVOKED, 1 → 0. The grant was
 * written for the empty pose blob, and 71456713 proved a retry cannot clear it: the blob is
 * terminal once the box settles, and 3 of 4 rows failed the second attempt too. What the
 * retry did reach was the OTHER half of that spec — a genuine one-shot edge-clip red, which
 * `retries: 1` converts into exactly the flaky-green above. It also closed the one interaction
 * r2 could not determine without executing (attempt 1 failing on the clip, attempt 2 hitting a
 * blank and skipping): with the yield gone and retries at 0 there is no such sequence left.
 * The cure that actually holds is the settle→poll in the spec, not a second attempt.
 *
 * CLASS 2 — resource contention under a deliberate throttle (`throttled-void`). RETRY KEPT,
 * now non-greening. Its second attempt is a real instrument — the probe races a 30 KB/s +
 * 500 ms budget on a shared runner, and one host stall is not a product defect — but under
 * `failOnFlakyTests` it buys a second OBSERVATION rather than a green. That is the row's
 * first branch taken as written: where retries exist, `failOnFlakyTests` goes on.
 *
 * CLASS 3 — the RUN-ATTEMPT flake, which no Playwright setting can see. Run 30711689550
 * attempt 1 red `[webkit] visual-regression.spec.ts:235` on `grid.layerCount 0` vs `>= 2`, on
 * a DOCS-ONLY commit; the same-SHA rerun was green. That spec lives under playwright.config.ts
 * at `retries: 0`, so no Playwright retry was involved and `failOnFlakyTests` would not have
 * fired: the green came from a human re-running the workflow, one level above the test runner.
 * Named here because a policy that only speaks about in-runner retries would silently imply
 * this class is covered. It is not, and it is the sharper one — a re-run-until-green habit
 * launders exactly the reds these gates exist to raise. Its disposition is a wave row, not a
 * config key: `grid.layerCount` reading 0 on a docs-only tree is an unattributed WebKit raster
 * race, it belongs in the chronic ledger with its run id, and it must be attributed rather
 * than re-run. Nothing in this file claims to gate it.
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
  // A retried pass NEVER greens this lane (T5-W1 1.6, class 1/2 above). Playwright still
  // reports and still runs the second attempt; it just stops exiting 0 on one.
  failOnFlakyTests: true,
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
      // sanctioned safety margin on a loaded runner (spec §"grant this one spec retries") —
      // kept at T5-W1 1.6 as class 2, and no longer green-buying: `failOnFlakyTests` above
      // turns the second attempt into a second observation rather than a pass.
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
      // retries: 0 — REVOKED at T5-W1 1.6 (class 1 in the policy at the head of this file).
      //
      // The grant read: run 30684983201 red the `killer` row alone with "no ink in the baked
      // pose at all"; the same run, same engine, same host passed the other four game rows and
      // the Fraunces probe, and the project had passed all six on the same runner image at
      // 117c18ef, 646c82ad and 6800af04 (runs 30654525795 / 30660276696 / 30663743674). The
      // row asserts over an ASYNCHRONOUS bake, so a retry re-bakes from a fresh page — the
      // instrument that tells a one-shot bad capture from a real one.
      //
      // 71456713 then measured it and the argument did not survive. The blob is TERMINAL once
      // the box settles (`useRasterStack` re-bakes on cacheKey / cssSize / dpr / mount and
      // nothing else), so the retry has no purchase on the mode it was granted for: run
      // 30690204551 failed `futoshiki`, `thermo` and `kenken` on BOTH attempts. What the retry
      // could still reach is the deterministic half — a genuine one-shot edge-clip red — and
      // there it is a laundry, converting a real red into the flaky-green that same run
      // recorded on `sudoku`. A retried bake read is a bake read that lies, which is the
      // argument the two `filter-census` projects beside it already carry at retries: 0.
      retries: 0,
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
