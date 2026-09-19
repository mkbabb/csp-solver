# C07a — NON-AUTHOR VERIFY, round 1 (second reader, 2026-09-18)

Track `wasm` · worktree `.claude/worktrees/w8-wasm`, branch `w8/wasm` · preSha `7b0610cc` ·
commit under review `63331bfc` · charter `../../charters/C07.md`. This reader wrote no line of
the cure and did not read the author's magnitudes before taking their own.
Ports: 4254/4255 were held by another lane (`t9-integrate`'s two `vite preview` processes, PIDs
146/147, started 11:01) and were left alone. This reader used **4252 (base) / 4253 (cured)**,
both killed at the close.

**VERDICT: ACCEPT, scoped — and C07 stays OPEN.** Every number the author banks reproduces here
in sign and structure. What is accepted is what the commit is: the preview server's fidelity
plus a refutation of ATTRIBUTION row 6. The chartered `src/` cure was not written, the charter's
Accept clause is not met, and this must not close C07 or set B6 GREEN.

## 1. The diff

`git diff 7b0610cc..63331bfc` → `M web/frontend/vite.config.ts`, one file, +16 lines: a
`preview: { cors: false }` block with its note. No `src/`, no library, no golden, no spec, no
lockfile. It does not draw less — no bake dropped, no boil thinned, no filter removed, no
transition shortened, no DPR lowered, no cacheKey theme-stripped, no subset touched. Checked by
name against the REFUSED list: nothing on it is re-proposed. The REFUTED engine-blind preload
strip is re-refuted, not re-proposed. It is **not the charter's mechanism** either: it is a
change to the test substrate. The charter's own FIRST ACT ("find the mismatch before a line of
`src/`") is what licenses that outcome.

## 2. The arms

    dist-base  AUDIT: build-identity — dist entry index-9rZPzI5DEcpe.js · index.html md5
               fa3d1af9870916cc728de11e97f57a90 · 43 files / 806.1 KB   exit 0
    dist       AUDIT: build-identity — dist entry index-9rZPzI5DEcpe.js · index.html md5
               fa3d1af9870916cc728de11e97f57a90 · 43 files / 806.1 KB   exit 0

Both of the author's restated aggregate recipes reproduce byte for byte, this reader's own run:

    find <arm> -type f -exec md5 -q {} \; | sort | md5 -q
        f705bd9e9fe011e5062b889dc8a35e60   EQUAL both arms
    (cd <arm> && find . -type f | sort | xargs md5 | md5 -q)
        913ec5a80655b9d91d076d0424b01eab   EQUAL both arms   (43 files each)

`dist` was NOT rebuilt here: the diff is a `preview`-only option, which no build step reads, and
both identity lines already equal the chair's frozen figure. Stated so the chair can weigh it.

**The base arm cannot be served by HEAD.** At `63331bfc` both `--outDir`s get `cors: false`, so
the pre-cure server had to be reconstructed: `vite.base.config.mjs` in this dir (root = the
worktree frontend, `build.outDir: dist-base`, **no** `preview` block, i.e. vite 8.1.4's default
CORS middleware). Its answer matches what the other lane's pre-cure-shaped preview on :4254
sends, and the isolation is exact — the two arms differ by one header and nothing else:

    base  :4252  HTTP 200 · Vary: Origin · Content-Length 14636 · Cache-Control: no-cache
    cured :4253  HTTP 200 ·  (no Vary)   · Content-Length 14636 · Cache-Control: no-cache
    edge         access-control-allow-origin: * · cache-control: public, max-age=31536000,
                 immutable · NO Vary — identical WITH and WITHOUT an `Origin:` request header
                 (this reader's own curl, 2026-09-18)

## 3. The numbers

Load is the headline caveat: `sysctl -n vm.loadavg` read `{ 134.74 66.24 52.72 }` at the open,
peaked at `{ 302.35 176.87 102.85 }`, and closed at `{ 236.10 195.05 144.10 }` — up to ten
sibling lanes. **Every count below is timing-free and load-proof. Every millisecond below is
worth its SIGN and nothing else**; no magnitude here is comparable to the author's, and none is
a Safari or an iOS number.

### 3a. The census (the charter's headline), `instrument/webkit-font-confirm.mjs`, `--port` only

webkit · no CDP · no CPU rate · no link shaping · cold (a fresh browser and context per window) ·
1280×800 · **dpr 1** · interleaved b,c,b,c ×5:

| window | base :4252 (`Vary: Origin`) | cured :4253 (no `Vary`) |
|---|---|---|
| 1–5, all five | **7** (fira 2 / fraunces 3 / patrick 2), every response HTTP 200 | **4** (1 / 2 / 1), 200 |

−3, deterministic: no window disagreed in either arm, so the move is outside any spread and in
the direction claimed. chromium, same instrument, 5 interleaved windows per arm:
base 4,4,4,4,4 · cured 4,**5**,4,4,4 → **median 4 / 4, not worse**. The single 5 is a cured-arm
window where `bakeFace()`'s fetch came back a full 14,936 B instead of the 300 B memory-cache
hit the other nine windows show; it is within-arm variance on a load-260 host, named, not
excluded (the median is unmoved either way).

### 3b. Row 6's 79.0 ms, `instrument/C07a-serve-interleave.mjs` (audited line by line: one
browser, arms alternating inside it, one server, only the named flag differing)

webkit · no CDP · 1× · unthrottled · cold · 1280×800 dpr 1 · 5 + 5 interleaved, medians:

| arms | b (hints) | c | Δ (c − b) | woff2 b/c |
|---|---|---|---|---|
| `--serve external --port 4252 --nullroute`: c registers a route for `**/__c07a_never_requested__*` and NOTHING else changes | 961.0 [722–3242] | 472.0 [349–915] | **−489.0** | **7/7** |
| `--serve edge`: server-side strip, **neither arm routed** | 855.0 [585–909] | 853.0 [743–937] | **−2.0** | **4/4** |

The artifact reproduces overwhelmingly and the win does not. A `page.route` that intercepts
nothing buys WebKit the whole of row 6 and more; with no route in either arm the three preload
hints are worth −2.0 ms inside a 585–937 ms spread. ATTRIBUTION row 6's **79.0 ms is an
instrument artifact**, confirmed independently of the author's magnitudes.

One caveat the author does not state: the instrument always runs the ablate arm SECOND inside
each pair, so "route registered" and "second in pair" are collinear within a single run. The
second table breaks the tie — same ordering, no route, Δ ≈ 0 — so the bias belongs to the route,
not to the position. Worth carrying into whatever re-reads 8.1's WebKit ablations.

### 3c. The refuted engine-blind strip, re-refuted

chromium · **4× CPU** (CDP) · unthrottled link · cold · 1280×800 dpr 1 · edge shape ·
server-side strip · neither arm routed · 5 + 5: hints **579.6** [436–868.2] vs stripped
**895.7** [619.5–964.3] → **+316.1 ms**. Same sign as the author's +35.3/+44.6 and the lane's
+23.5; the magnitude is the host's, not the cure's. The hints stay.

## 4. π

- Goldens vs the cured dist on :4253, `playwright-golden.config.ts` with `PLAYWRIGHT_BASE_URL`,
  never `--update-snapshots`: **4 passed, exit 0** (wordmark, toggle crest, grid corner, given
  glyph).
- Per-pose hashes: the stronger statement holds and was re-derived above — `dist` ≡ `dist-base`
  across all 43 files by two recipes, so no pixel can move. `src/` was never opened.
- `filterBudget` 9 and pose count 4 carried green by `filter-census.spec.ts` and
  `wordmark-integrity.spec.ts` against the cured dist (§5).

## 5. Gates, bare, this reader's own runs, exit codes as printed

    npm run test:unit          exit 0   Test Files 66 passed (66) · Tests 810 passed (810)
    npm run lint               exit 0
    npm run lint:eslint        exit 0
    npm run lint:knip          exit 0
    npm run lint:motion        exit 0
    npm run lint:copy          exit 0
    npm run typecheck:node     exit 0
    npm run test:font-coverage exit 0
    playwright-golden.config.ts → :4253                                   exit 0   4 passed
    e2e/font-census.spec.ts, both engines, scratch config → :4253         exit 0   4 passed
    playwright-throttle.config.ts → :4253 (throttled-void, filter-census,
      wordmark-integrity, theme-bake-freshness, theme-quadrants; both engines)
                                                                          exit 0   67 passed

No gate was piped to `tail`; the golden run's code was read off `$pipestatus`, not `tail`'s.
The throttle battery also answers the one live risk of `cors: false` — no preview-served spec
depends on the CORS middleware.

## 6. The must-nots, one by one

| clause | verdict |
|---|---|
| drop or narrow a woff2 subset | not done — identical bytes, `test:font-coverage` exit 0 |
| delete the data-URI bake / touch `bakeFace()` | not done — one file in the diff; `HandwrittenLogo.vue` untouched |
| wordmark paints a fallback face longer than today | not done — identical shipped bytes and hints; wordmark golden and `wordmark-integrity` green |
| anything on the REFUSED list | none; `filterBudget` 9, pose count 4 |
| the REFUTED engine-blind strip | not re-proposed; re-refuted at +316.1 ms chromium here |
| writes through the symlinks | none — both symlinks stand, `git status` in the worktree is clean, no lockfile or `node_modules` change |
| main-tree product edits | none — main tree `src/`, `scripts/`, `.github` untouched; the only main-tree writes are this evidence dir |
| goldens updated | none — no `--update-snapshots`, by author or by either reader |
| real Safari / iOS / osascript / perf-rig | none |

## 7. Findings the chair owes a decision on

1. **This is not C07 and must not close it.** The charter's Accept reads "max requests per
   subset ≤ 1 in BOTH engines … WebKit board-ready down by about 79 ms". On the cured arm
   fraunces still reads **2** in both engines (`bakeFace()`'s own fetch — C07b's, another
   track), so ≤ 1 per subset is not met; and the 79 ms does not exist to be moved. B6 stays
   unset until 8.3 reads the device.
2. **Strike or restate ATTRIBUTION row 6's 79.0 ms** and its companion −77.0 font-abort arm.
   Reproduced here as a one-armed-route artifact with 7/7 requests in both arms.
3. **The route bias belongs to the method.** Any 8.1 WebKit ablation that registered a
   `page.route` in one arm only is suspect; the ordering caveat in §3b belongs with it.
4. **`preview: { cors: false }` is a substrate change, and it is not the edge.** It removes the
   one header that mattered but sends neither `access-control-allow-origin: *` nor
   `cache-control: public, max-age=31536000, immutable`. If the chair wants the proxy to speak
   the edge's language, a small preview header plugin is the honest form. Either way, every
   `vite preview` reading taken on this branch after `63331bfc` is taken on a different
   substrate than the 8.1 rows were.
5. **One regime line in the author's return is wrong as written.** The chromium census row is
   banked as "chromium · 4× CPU · unthrottled link"; `instrument/webkit-font-confirm.mjs`
   applies no CDP session and no throttling at all. The count is timing-free so the conclusion
   is untouched, but the regime as banked is not the regime that ran.
6. **The base arm is no longer reachable from HEAD's own config** (§2). Whoever re-reads this
   needs `vite.base.config.mjs` or an equivalent; say so in the record.

## 8. Files

    vite.base.config.mjs              the reconstructed pre-cure preview server (base arm)
    raw/r1b-census-webkit.txt         5 + 5 interleaved windows, per-subset counts, statuses
    raw/r1b-census-chromium.txt       5 + 5 interleaved windows, with resource timing
    raw/r1b-wk-nullroute.{jsonl,txt}  the null-route control, 5 + 5
    raw/r1b-wk-serverstrip-edge.*     neither arm routed, edge shape, 5 + 5
    raw/r1b-ch-serverstrip-edge.*     chromium 4×, edge shape, 5 + 5
