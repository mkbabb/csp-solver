# C07a — NON-AUTHOR VERIFY, round 1

2026-09-17 · track `wasm` · worktree `.claude/worktrees/w8-wasm`, branch `w8/wasm` ·
preSha `7b0610cc` · commit under review `63331bfc` · charter `../../charters/C07.md`.
Verifier did not write the cure. Ports 4254 (base) / 4255 (cured); both killed at the close.

**VERDICT: ACCEPT, scoped.** Every number the author banked reproduces here, in the direction
claimed and outside the spread where they said so. What is accepted is what the commit actually
is: the preview server's fidelity plus a refutation. C07's chartered `src/` cure was not written
and is not accepted as earned — it stays OPEN against 8.3, exactly as the author says.

## 1. The diff (step 1)

`git diff 7b0610cc..63331bfc` touches ONE file, `web/frontend/vite.config.ts`, adding a
`preview: { cors: false }` block with its note (16 lines) above the existing `server:` block.
No `src/`, no library, no golden, no spec. It does not draw less: no bake dropped, no boil
thinned, no filter removed, no transition shortened, no DPR lowered, no cacheKey theme-stripped,
no subset narrowed. Checked by name against the REFUSED list — nothing on it is re-proposed, and
the REFUTED engine-blind preload strip is re-refuted rather than re-proposed. It is also not the
charter's mechanism (scheduling, de-duplication, `bakeFace()`): it is an instrument change.

## 2. The arms (step 2)

    dist-base  AUDIT: build-identity — dist entry index-9rZPzI5DEcpe.js · index.html md5
               fa3d1af9870916cc728de11e97f57a90 · 43 files / 806.1 KB   (exit 0)
    dist       AUDIT: build-identity — dist entry index-9rZPzI5DEcpe.js · index.html md5
               fa3d1af9870916cc728de11e97f57a90 · 43 files / 806.1 KB   (exit 0)

Verifier's own aggregate over all 43 files (`find … -exec md5 -q | sort | md5 -q`):
`f705bd9e9fe011e5062b889dc8a35e60` — EQUAL in both arms. The cured build is byte-identical to
the base build. (The author's aggregate reads `b3f098b8…`; that is a different hashing recipe,
unstated, and it is the one banked figure that does not reproduce as written. The claim it
supports — identical bytes, 43 files — does reproduce.)

Because the arms are byte-identical, the base arm cannot be produced by `vite preview` at HEAD
(HEAD is `cors: false` for both `--outDir`s). The verifier's base arm is `vite preview` with a
minimal scratch config carrying no `preview` block, i.e. vite 8.1.4's default CORS middleware —
and it answers with the same header shape the author curl'd off 4254, byte for byte:

    base 4254  Vary: Origin · Cache-Control: no-cache · ETag W/"14636-1789678305612"
    cured 4255 (no Vary, no ACAO) · Cache-Control: no-cache
    edge       access-control-allow-origin: * · cache-control: public, max-age=31536000,
               immutable · etag "f917931b…" · NO Vary — identical with and without an
               `Origin:` request header (verifier's own curl, 2026-09-17)

## 3. The number (step 3)

Cold woff2 GET census off the driver's request stream, `A2/webkit-font-confirm.mjs` unmodified
but for `--port`; one browser per window, fresh context, cold; 1280×800, **dpr 1**; no CDP,
no CPU rate, no link shaping; interleaved base,cured,base,cured…

| engine | base :4254 (`Vary: Origin`) | cured :4255 (no `Vary`) | windows |
|---|---|---|---|
| webkit | **7** (fira 2 / fraunces 3 / patrick 2), all 200 | **4** (1/2/1) | 5 / 5, 5-for-5 each |
| chromium | 4 (1/2/1) | 4 (1/2/1) | 3 / 3 |

Deterministic: no window disagreed, so −3 is far outside any spread, and chromium is not made
worse. `sysctl -n vm.loadavg` { 5.12 8.32 10.28 } → { 5.09 7.93 10.04 } (webkit set),
{ 4.92 7.85 10.00 } → { 7.58 8.23 10.08 } (chromium set).

Board-ready, the W8 definition, `C07a-serve-interleave.mjs` as banked; webkit · no CDP · 1× ·
unthrottled · cold · 1280×800 dpr 1; 5 + 5 interleaved, medians, no window excluded:

| arms | b | c | Δ (c − b) | woff2 b/c | verifier's reading |
|---|---|---|---|---|---|
| hints vs **null route that intercepts nothing** (`--serve external --port 4254 --nullroute`) | 233.0 | 154.0 | **−79.0** | 7/7 | the whole of row 6, bought by a route registration |
| banked `xablate --mode nopreload` vs :4254, unmodified | 257.0 | 167.0 | −90.0 | — | the lane's instrument reproduces its own artifact |
| hints vs **server-side strip, no route anywhere**, preview shape | 253.0 [228–551] | 238.0 [237–277] | −15.0 | 7/4 | inside spread |
| hints vs server-side strip, no route, **edge shape** | 249.0 [213–348] | 249.0 [235–288] | **0.0** | 4/4 | no WebKit win exists |

chromium · 4× · unthrottled · cold · desk dpr 1, edge shape, server-side strip, 5 + 5:
hints **331.5** [317.6–349.3] vs stripped **366.8** [354.7–389.6] → **+35.3 ms**: stripping the
hints costs chromium, on a clean instrument, more than the lane's routed +23.5.

Read together: −79 whenever ONE arm carries a `page.route`, −15 to 0 when neither does. The
author's magnitudes (−98, −77, −5, +11, +44.6) differ from mine by host drift; every sign and
every conclusion reproduces. ATTRIBUTION row 6's 79.0 ms is an instrument artifact.

Lie-hunt: arms not swapped (the cured arm is the one with no `Vary`, and it is the FASTER/lower
census arm in the direction claimed); regime matches the charter's (cold, desk, dpr 1, and the
census is timing-free); cache cold by construction (new context per window, and the 7 vs 4 split
is itself a cache-key fact); no masked fallback (the cure is a response header, verified by curl
at both ports); no gate piped to tail.

## 4. π (step 4)

- Goldens, run by the verifier against the cured dist on :4255 via `playwright-golden.config.ts`
  with `PLAYWRIGHT_BASE_URL`, never `--update-snapshots`: **4/4 passed, exit 0** (wordmark,
  toggle crest, grid corner, given glyph).
- Per-pose hashes: not separately needed and the stronger statement holds — `dist` ≡ `dist-base`
  across all 43 files by the verifier's own aggregate, so no pixel can move. Pose count 4 and
  `filterBudget` 9 are carried by `filter-census.spec.ts` and `wordmark-integrity.spec.ts`,
  which the verifier ran green against the cured dist (below). `src/` was never opened.

## 5. Gates, bare, verifier-run (step 5)

    npm run test:unit            exit 0   Test Files 66 passed (66) · Tests 810 passed (810)
    npm run lint:eslint          exit 0
    npm run lint:knip            exit 0
    npm run lint:motion          exit 0
    npm run lint:copy            exit 0
    npm run typecheck:node       exit 0
    npm run test:font-coverage   exit 0   (the three subsets ship, letter-exact, superset held)
    playwright-golden.config.ts  exit 0   4/4 vs :4255
    e2e font-census, both engines, scratch config → :4255        exit 0   4/4
    playwright-throttle.config.ts vs :4255 (filter-census, wordmark-integrity, throttled-void,
      theme-bake-freshness, theme-quadrants; both engines)       exit 0   67/67

The author left the e2e battery NOT RUN and said so. The verifier ran it: it is green, which
also answers the one live risk of `cors: false` — that the estate's preview-served specs might
depend on the CORS middleware. They do not.

## 6. The must-nots (step 6)

| clause | verdict |
|---|---|
| drop or narrow a subset | not done — `test:font-coverage` exit 0, same three woff2, identical bytes |
| delete the data-URI bake / touch `bakeFace()` | not done — `HandwrittenLogo.vue` never opened; diff is one file |
| wordmark paints a fallback face longer than today | not done — identical bytes, hints unchanged, wordmark golden passes |
| anything on the REFUSED list | none; `filterBudget` 9, pose count 4 |
| the REFUTED engine-blind strip | not re-proposed; re-refuted at +35.3 ms chromium |
| symlink writes, `npm install/ci/audit fix` | none observed; no lockfile or `node_modules` change |
| main-tree product edits | none — main tree `src/`, `scripts/`, `.github` untouched; the only writes are this dir |
| goldens updated, real Safari / iOS / perf-rig | none — no `--update-snapshots`, no osascript, no device |

## 7. Findings the chair owes a decision on

1. **This is not C07.** The charter's Accept clause ("max requests per subset ≤ 1 in BOTH
   engines … WebKit board-ready down by about 79 ms") is not met by a `src/` cure: fraunces is
   still 2 on the cured arm (`bakeFace`, C07b's), and the 79 ms does not exist. Accepting this
   commit must not close C07 or set B6 GREEN. The charter's own first act licenses this outcome.
2. **Strike or restate ATTRIBUTION row 6's 79.0 ms**, and the companion −77.0 fontabort arm.
   Reproduced here as a one-armed-route artifact at −79.0 with 7/7 requests in both arms.
3. **The route bias belongs to the method, not the row.** Every WebKit ablation in 8.1 that
   registered `page.route` in one arm only is suspect. chromium's null-route control read
   −3.5 ms for the author, so the chromium rows stand.
4. **`preview: { cors: false }` changes the substrate every later `vite preview` reading is
   taken on.** It is a fidelity improvement in the one header that mattered, but it is still not
   the edge: the edge sends `access-control-allow-origin: *` and
   `cache-control: public, max-age=31536000, immutable`; preview with cors off sends neither.
   If the chair wants the proxy to speak the edge's language, the honest form is a small preview
   header plugin, not the absence of a middleware.
5. **One banked figure does not reproduce as written**: the aggregate md5 `b3f098b8…`. The
   claim it carries (43 files identical, both arms) reproduces under the verifier's own recipe.

Load at the verify session's ends: { 20.38 16.04 13.51 } was the author's open;
verifier read { 3.30 9.24 10.80 } at the start and { 15.61 11.56 10.97 } at the close, with up
to ten sibling lanes on this host. No number here is a Safari number or an iOS claim.

## 8. Files

    raw/census-webkit.txt, raw/census-chromium.txt   the interleaved census, window by window
    raw/census-windows.jsonl                         per-window counts and response statuses
    raw/v-wk-nullroute.*                             the null-route control, 5+5
    raw/v-xablate-nopreload-wk.*                     the banked refuter, re-run unmodified
    raw/v-wk-serverstrip-preview.*, v-wk-serverstrip-edge.*, v-ch-serverstrip-edge.*
    pw-scratch.config.ts                             playwright.config.ts with webServer dropped
                                                     and baseURL → 127.0.0.1:4255
