# r1-pwa — PWA census + abrogation blast radius

Repo HEAD 65425697. All anchors app-repo relative unless absolute.

## Why the app has a PWA at all (git archaeology)

- Introduced in ONE commit: `b36b7b9f` "T2-W6: affordances — the bound order, PWA-minimal, and beat 9's pencil marks" (tranche-2, wave W6). Confirmed sole provenance for all three source surfaces:
  - `git log -S VitePWA -- web/frontend/vite.config.ts` → only `b36b7b9f`
  - `git log --follow -- web/frontend/e2e/pwa-offline-smoke.mjs` → only `b36b7b9f`
  - `git log -S vite-plugin-pwa -- web/frontend/package.json` → only `b36b7b9f`
- Rationale of record (`docs/tranches/2026-07-tranche-2/evidence/synthesis-pass1.md:110`): *"PWA-minimal — manifest + vite-plugin-pwa generateSW precache only; no sync, no toasts. Honest now that fonts are self-hosted (81.6 KB to interactive today, hard offline fail)."* i.e. the feature exists to convert a "hard offline fail" into offline-capable play once fonts went self-hosted (P5). Wave row: `docs/tranches/2026-07-tranche-2/README.md:52`.
- Scope was capped at precache-only; `Q4-w5-w6-pwa-cache.md` (pass-3) resolved the one config decision (widen `globPatterns` to include `woff2`+`svg`).

## What is LOST on removal (honest rationale row)

- **Offline play**: after one online load, reload/relaunch with no network serves shell + `index.js`/`css` + wasm + 3 woff2 from Cache Storage. Remove the SW → offline reload = browser network-error page. This is the feature's whole point.
- **Installability / install prompt**: `manifest.webmanifest` (`display:standalone`, icons, `start_url:/`) + a registered SW make the site an installable PWA (home-screen icon, standalone chrome). Remove → normal browser tab only, no A2HS prompt.
- **NOT lost — do not double-count in the rationale**: the immutable HTTP cache win (`public/_headers` `/assets/*` `max-age=31536000, immutable`, and the `/assets/*.wasm` `Content-Type` stanza) is an INDEPENDENT transport layer (W5, not W6). It keeps its full repeat-visit value with the SW gone. `Q4-w5-w6-pwa-cache.md:82-108` is explicit that these are "two layers, disjoint jurisdictions." Only the offline-MIME-for-cached-Response half of the `.wasm` stanza's justification (`_headers:96-99`) is PWA-coupled; the header itself stays useful for streaming instantiation.

## Full excision inventory (anchor → what its removal touches)

Source surfaces (small, clean — registration is 100% build-injected, no hand-written registration code in `src/`; `grep -rn serviceWorker\|registerSW\|virtual:pwa src/` = 0 hits):

| Artifact | Anchor | Removal touches |
|---|---|---|
| plugin import | `web/frontend/vite.config.ts:7` | `import { VitePWA } from 'vite-plugin-pwa'` |
| plugin config block | `web/frontend/vite.config.ts:188-240` (the `VitePWA({...})` entry in `plugins`) | deletes generateSW; kills all dist emission below |
| devDependency | `web/frontend/package.json:41` `"vite-plugin-pwa": "^1.3.0"` | drops the dep + its workbox transitive tree |
| npm script | `web/frontend/package.json:16` `"test:pwa": "npm run build && node e2e/pwa-offline-smoke.mjs"` | the only invoker of the offline gate |
| offline gate | `web/frontend/e2e/pwa-offline-smoke.mjs` (whole file, 148 lines) | Playwright `testMatch` already skips it (`.mjs`, not `.spec`), ESLint ignores `e2e/**` — invisible to both default lanes per its own header comment |
| install icons | `web/frontend/public/pwa-192x192.png` (23,902 B), `public/pwa-512x512.png` (97,974 B), `public/pwa-maskable-512x512.png` (69,921 B) = 192 KB | manifest icon srcs; **`public/favicon.svg` is NOT pwa-only — it is the site `<link rel=icon>` (`index.html:7`), keep it** |
| index.html injections | source `index.html` has NONE (verified: no `manifest`/`registerSW` lines) — `dist/index.html` gets auto-injected `<link rel="manifest" href="/manifest.webmanifest">` + `registerSW.js` script at build | vanish automatically when plugin removed + rebuild |

Generated (build output under `web/frontend/dist/`, disappear on next `vite build` after plugin removal — not tracked source): `dist/sw.js` (2,189 B), `dist/workbox-2fbc6a65.js` (15,026 B), `dist/registerSW.js`, `dist/manifest.webmanifest`, `dist/pwa-{192,512,maskable-512}.png`.

Docs/comments carrying offline/PWA claims that go stale on removal:
- `README.md:59` ("...board+seed permalinks, **PWA offline**.")
- `README.md:107` ("**The PWA installs and plays offline after first load.**")
- `web/frontend/README.md:25` (`npm run test:pwa   # build + offline service-worker smoke`)
- `web/frontend/vite.config.ts:188-215` (the Q4 SW-strategy comment block)
- `web/frontend/public/_headers:93-100` (SW-cached-wasm-MIME offline justification on the `/assets/*.wasm` stanza)
- tranche records (audit targets, not to edit): `docs/tranches/2026-07-tranche-3/evidence/audit32/A19-library-audit-fe.md:98,100,112` (KEEP verdict + gate claim), `.../2026-07-tranche-2/README.md:52`, `.../2026-07-tranche-2/waves/T2-W5-fe-perf-hardening.md:24`, `.../evidence/pass3/Q4-w5-w6-pwa-cache.md`, `Q7-affordance-interlocks.md:54`.

**CI rows touching it: NONE.** `grep -rn 'pwa\|test:pwa\|offline\|workbox\|sw.js' .github/` = 0 hits. There is no CI row to remove. See finding P2-1 — this is itself a defect.

## Findings

### P2-1 — the offline gate runs in NO CI lane; the hard offline claim is verified by nothing automated
- `web/frontend/package.json:16` defines `test:pwa`, but `grep -rn test:pwa .github/` = 0. The `e2e` job (`.github/workflows/ci.yml:432`) runs `npx playwright test` (`ci.yml:485` region) against a `npm run dev` webServer (`ci.yml:429` comment) where the SW is disabled in dev; Playwright's `testMatch` skips the `.mjs` (the file states this at `pwa-offline-smoke.mjs:6-8`). So the sole automated verifier of "installs and plays offline after first load" (`README.md:107`) is orphaned — runnable only by hand. The counted "44 e2e" (memory ledger) does not include it. green-over-broken risk: the offline feature could regress (e.g. a `globPatterns` typo dropping woff2) and every CI lane stays green.
- Probe (rerunnable): `grep -rn 'test:pwa\|pwa-offline' /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.github/` → empty. To exercise the gate manually: `cd web/frontend && npm run test:pwa` (builds + drives headless Chromium offline reload).
- family_hint: `orphaned-gate`

### P3-1 — precache footprint is 633 KiB, not the "445KB" carried in the census brief; PNG icons are 30% and are install-only, not offline-play
- Measured from the shipped `dist/sw.js` precache manifest (21 entries): total 648,564 B = **633.4 KiB**. Breakdown notables: `csp_solver_wasm_bg-DMt0Bldp.wasm` 86,746 B; `index-DfqOCJ0c.js` 135,878 B; `vue-vendor` 75,770 B; `index.css` 61,521 B; the three install PNGs 191,797 B (`pwa-512` 97,974 + maskable 69,921 + 192 23,902) ≈ **30% of precache**. The PNGs are needed for the install prompt / home-screen icon, NOT for offline play (offline play needs shell+js+css+wasm+woff2 only). Any tranche-IV rationale row citing "445KB" is stale by ~188 KiB.
- Probe: `cd web/frontend/dist && for f in $(grep -oE '(assets/[^"]+|[a-z0-9.-]+\.(js|css|html|svg|png|woff2|wasm|webmanifest))' sw.js | sort -u); do [ -f "$f" ] && stat -f '%z %N' "$f"; done | awk '{s+=$1} END{print s}'` (or rerun the per-file loop banked in this lane's shell history).
- family_hint: `stale-metric`

### P3-2 — `favicon.svg` is precached twice (duplicate entry in the generated precache manifest)
- `dist/sw.js` `precacheAndRoute([...])` lists `{url:"favicon.svg",revision:"305211cdaeb5433655e5945d2328ab04"}` **twice** (identical URL + revision). It enters once via vite-plugin-pwa's `includeAssets`/manifest-icon path and once via the `globPatterns` `svg` widening added for offline (`vite.config.ts:203`). Harmless at runtime (same revision) but it is a redundant precache row — the exact "double-store" shape the config comments elsewhere warn against (`vite.config.ts:211-213`). Confirms the `svg` glob widening overlaps the icon-include path; on excision this disappears, but if PWA is KEPT it wants dedup.
- Probe: `grep -o 'favicon.svg' web/frontend/dist/sw.js | wc -l` → `2`.
- family_hint: `precache-double-store`
