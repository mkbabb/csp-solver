# T9-W8 C10 — NON-AUTHOR VERIFY, round 3 · track "app"

2026-09-18 · verifier did not write the cure and made no source edit · worktree
`.claude/worktrees/w8-app` at `db43df48`, clean, `git status --short` empty at both ends ·
ports base 4256 (dist-base) / cured 4257 (dist), both killed at the end · host carrying sibling
lanes, `vm.loadavg` 12.86 at open and 149.65 at close.

The task named `verify-r1/` as this dir. That dir already holds another verifier's round-1
evidence and `verify-r2/` holds round 2, so this round banks itself in `verify-r3/` rather than
overwrite them.

VERDICT: **ACCEPT**, five rows named, none blocking. The byte mark reproduces to the byte in
three regimes. π is clean, all eleven gates exit 0, 126 e2e rows on the cure's surface pass in
both engines, every "It must not" holds. What does NOT reproduce as a point figure is the
magnitude of two load-sensitive rows (the Fast-3G base freight, and the residual first-open
cost); both move in the claimed direction, and the second is already booked as a cost.

## 1. The diff is the charter's mechanism

`git diff 0bf9cb0e..db43df48` — five files, all under `web/frontend`, 180 insertions / 47
deletions:

- `src/App.vue` — the deck's static import becomes `shallowRef<Component|null>` +
  `<component :is>` at the view flip; `warmGallery()`; `scheduleWarmGallery()` (two-condition
  gate: `.board-group .board-cells .game-cell` exists, plus `load`, later wins; two rAF of
  margin; 3,000 ms backstop; `galleryWarm` ends the poll); a warm on intent at the head of
  `enterGallery`.
- `vite.config.ts` — `sudokuTemplates` emits `src/games/sudoku/data/tiers.ts` as its own module;
  one `app-shared` `advancedChunks` group.
- `src/games/sudoku/composables/useSudoku.ts` — `tierSource` imported statically; the bank
  `import()` stays where T9-W4 §4.4 put it, now behind the tier answer.
- `src/games/sudoku/data/tiers.ts` (new, generated) and `data/templates.ts` (re-emitted without
  the accessor).

This is deferral of the not-yet-visible plus scheduling — the charter's own vocabulary. It draws
nothing less: `git diff 0bf9cb0e..HEAD --stat -- src/pencil` is EMPTY, so no bake, boil, filter,
pose, DPR or `cacheKey` is touched, and no transition is shortened. Nothing on the REFUSED list
(draw-in, DPR, `frameCount`, `grain-static`, `captureSide`, `DEFAULT_POSE_CACHE`, theme-free
`cacheKey`, a celestial, compositor-only whirl, the 1,010 ms Bloom, boil during the flip,
`bakeFace()`, a stubbed `toBlob`) or the REFUTED list is re-proposed. No library change.

## 2. The arms, confirmed independently

    dist-base  AUDIT: build-identity — dist entry index-CydLs17Yb6Kt.js · index.html md5
               a5354065621a844ebf02a51cfc966251 · 43 files / 806.2 KB
    dist       AUDIT: build-identity — dist entry index-DjKBBtRFWqfO.js · index.html md5
               3d2e12c88f34780977ce237fdddfa8ed · 46 files / 807.7 KB

Both match the author's report. I rebuilt HEAD myself into a scratch outDir
(`npx vite build --outDir <scratchpad>/dist-check`, exit 0) and it reproduced byte-identically:
entry `index-DjKBBtRFWqfO.js`, `index.html` md5 `3d2e12c88f34780977ce237fdddfa8ed`. So `dist` IS
HEAD's build.

`dist-base` is the PRE-cure build, proved structurally, not taken on trust: its entry chunk
carries `game-gallery` and has no gallery chunk or `app-shared` chunk, and the tier accessor
string `no tier is declared` lives in its BANK chunk (`templates-LkXzF59FZu96.js`). In the cured
arm the same string is in the ENTRY chunk and `game-gallery` is in `GameGallery-BkdzS6lhAd8s.js`.
That is exactly the two splits, and the arms cannot be swapped.

Instruments, run unmodified from copies in this dir: `boot-freight.mjs` md5
`d1317cafe9a6d22c52081fbafa005b25` (the banked `attribution/A2` copy),
`freight-run.mjs` `8b194189f379606223460eada8b6ad65`, `census-bytes.mjs`
`bb7758014a89d69efb236c4190aaf8d6`, `first-open.mjs` `6f95760036575e3f9bd92926cc4c2c3c`,
`warm-when.mjs` `3c7f1191a75e2e2cb0e48517f23a23fe`. e2e ran through
`playwright-c10.config.ts` (webServer dropped, baseURL → 4257).

## 3. The numbers, re-run interleaved b,c,b,c,…, one window per invocation

### 3a. chromium · 4x CDP · Fast-3G · cold · 1280x800 · dpr 1 — THE MARK

`r3-freight-4x-fast3g-cold-desk.jsonl`, 5 windows per arm, loadavg 32.49 → 34.55.

    base   177,129 B / 10 req, 5/5 windows identical
    cured  164,023 B / 10 req (2/5, the livegen roll) · 168,647 B / 11 req (3/5, the HARD roll)

Delta **-13,106 B on a livegen roll, -8,482 B on a HARD roll**. Outside spread by construction —
each arm's figure is deterministic per draw. Direction as claimed.

The author's base figure of 172,197 B / 9 req did NOT reproduce here; see finding 1. The
arithmetic is exact and the mechanism is unchanged: 172,197 + 4,932 (the base bank, encoded)
= 177,129, and 164,023 + 4,624 (the shrunken bank) = 168,647, and the same-roll delta
8,482 = 8,174 + (4,932 − 4,624). The split itself is 8,174 B, to the byte.

board-ready: base median 1,962.5 ms (1,895.5–2,069.3), cured 1,890.5 (1,859.5–1,947.5) — arms
overlap; no readiness claim is made or needed.

### 3b. chromium · 4x CDP · unthrottled link · cold · 1280x800 · dpr 1

`r3-freight-4x-none-cold-desk.jsonl`, 5 per arm, loadavg 41.25 at close.

    base   183,227 B / 11 req, 5/5
    cured  170,121 B / 11 req (4/5) · 174,745 B / 12 req (1/5, the HARD roll)

Delta -13,106 B / -8,482 B. Reproduces the author's figures to the byte, including the two
cured values and their request counts. board-ready base 890.4 ms median, cured 902.5 — +12.1 ms,
arms overlap: no regression on a fast link.

### 3c. webkit · unthrottled (no CDP: no CPU rate, no link shaping, longtask NOT MEASURED) ·
cold · 1280x800 · dpr 1 — PROXY ONLY, not a Safari number, not an iOS claim

`r3-freight-webkit-cold-desk.jsonl`, 5 per arm, loadavg 35.31 at close.

    base   210,281 B / 15–16 req, 5/5
    cured  197,173 B / 16 req (3/5) · 201,813 B / 17 req (2/5)

Median delta **-13,108 B** — the author's figure, to the byte. board-ready 675 → 697 ms, arms
overlap.

### 3d. the static boot graph off disk (`r3-census-base.jsonl` / `r3-census-cured.jsonl`)

entry js + blocking css + vue-vendor + animation-vendor + app-shared:

    base   405,927 raw / 113,542 br / 130,511 gz
    cured  375,246 raw / 106,860 br / 122,354 gz
    delta  -30,681 raw / -6,682 br / -8,157 gz

Every figure is the author's, exactly. The gzip delta agrees with the measured wire constant
(-8,174 B) to 17 B. Bank chunk 18,164 → 17,779 raw, 4,327 → 4,081 brotli: exact.

### 3e. render-blocking CSS, and the proof no rule was dropped

Parsed independently from the shipped sheets:

    base   blocking index-DouNrfU0EVpa.css 93,735 raw / 16,421 br; total CSS 96,901 B;
           braces 1,069/1,069; semicolons 1,622
    cured  blocking index-C3NIFazofDKd.css 82,734 raw / 14,748 br; total CSS 96,902 B;
           braces 1,069/1,069; semicolons 1,622;
           the 11,002 B lands in GameGallery-BgPLkE_ckPqR.css (103 blocks), NOT in index.html

**-11,001 B off the render-blocking path with ZERO rules dropped** — the brace and semicolon
counts are identical arm to arm; total CSS moves by one byte (a newline). The author's brotli
figure for the cured sheet reads 14,723 in the return and 14,748 here; a 25 B difference on a
recompression, immaterial and in the same direction.

### 3f. the bank before board-ready (ATTRIBUTION row 11)

Across the 15 cured and 15 base windows of 3a–3c: the bank chunk is fetched before board-ready
in **15/15 base** windows and **6/15 cured** (3/5 Fast-3G, 1/5 unthrottled, 2/5 WebKit). The
claim "6/6 → 2/6, and it must NOT be written as 0" holds: sudoku rolls its opening tier and only
9x9 HARD is declared `bank`, so a third of deals legitimately reach for it.

### 3g. the fix's own risk, refuted independently

The `GameGallery` chunk appears before board-ready in **0 of 15** cured windows across the three
regimes; `app-shared` appears in 15/15, which is the +1 request the cure books.

### 3h. the repair's own mark — when the deck's chunk is fetched, no intent at all

`r3-warm-when-cured.jsonl`, 3 cured windows, chromium 4x Fast-3G cold desk dpr 1, loadavg
29.33 at close. Chunk start board-ready **+251 / +280 / +248 ms**, in hand **+474 / +503 /
+468 ms**. The pre-fix control banked at verify r1 is +800 ms start, +1,550 ms in hand. The move
is in the claimed direction and far outside spread; the magnitude is load-sensitive (finding 3).

### 3i. THE RESIDUAL the author books as a cost — a first open pressed at the first moment

`r3-first-open-fast3g-desk.jsonl`, 3 per arm interleaved, chromium 4x Fast-3G cold desk dpr 1,
loadavg 45.86 at close.

    base   openMs 1,827.8 / 1,914.4 / 1,971.4  → median 1,914.4
    cured  openMs 2,537.5 / 2,924.3 / 2,935.8  → median 2,924.3

**+1,009.9 ms, non-overlapping 3/3.** The sign reproduces; the magnitude does not — the author
books +348.0 ms. See finding 2. This is a cost, correctly named and not claimed as a cure.

## 4. π

`PLAYWRIGHT_BASE_URL=http://127.0.0.1:4257 npx playwright test --config
playwright-golden.config.ts`, bare, no `--update-snapshots`: **4 passed, exit 0**.
`filterBudget` stays 9 (`src/pencil/config/filterBudget.ts` untouched; the census test passes
inside `test:unit`). Pose count 4 — no pose source is in the diff. The r2 fold set's animation
census keys are identical arm to arm and bakes read 8/8/8 in both arms.

## 5. Gates, bare, exit codes as returned

    npm run test:unit         exit 0   Test Files 66 passed (66) · Tests 810 passed (810)
    npm run lint:eslint       exit 0
    npm run lint              exit 0
    npm run lint:knip         exit 0
    npm run lint:boundary     exit 0
    npm run lint:tdz          exit 0
    npm run lint:copy         exit 0
    npm run lint:live-regions exit 0
    npm run lint:motion       exit 0
    npm run typecheck:e2e     exit 0
    npm run typecheck:node    exit 0

e2e on the cure's surface, both engines, against the cured dist through the scratch config:
`gallery.spec.ts` + `gallery-deal.spec.ts` + `gallery-guard.spec.ts` + `spoken-gallery.spec.ts`
+ `sudoku-interaction.spec.ts` → **126 passed, exit 0**.

## 6. The must-nots, one by one

- **Booked as a readiness cure on a fast link** — HELD. Unthrottled board-ready +12.1 ms with
  the arms overlapping; WebKit +22 ms overlapping. No readiness claim is carried. The author's
  earlier -27.2 ms mobile row is already retracted by verify r2 finding 5b.
- **Drop a CSS rule** — HELD, by count: 1,069 blocks / 1,069 closing braces / 1,622 semicolons,
  identical arm to arm; the 11,002 B moved off the blocking path, not deleted. Goldens and 126
  gallery rows are the no-flash proof.
- **Move the `solver.worker` modulepreload** — HELD as written: it is still a `modulepreload` in
  `index.html`, same href `solver.worker-DyhLjsTj.js`, still on the boot burst. Its ORDER shifts
  from third to fourth because `app-shared` is inserted ahead of it; see finding 4.
- **Strip the font preloads** — HELD: all three woff2 preloads
  (firacode / fraunces / patrickhand subsets) present and identical in both arms.

Copy law (M16): no user-readable string changes. The only new prose is the `tiers.ts` developer
error, whose text is carried over verbatim from `templates.ts`.

## 7. Findings (none blocking)

1. **The Fast-3G base freight figure is host-conditional, and the return states it as a regime
   fact.** The return says "On Fast-3G the bank lands AFTER ready in both arms (0/5, both
   viewports, both arms)". On this host at loadavg 32–35, board-ready runs 1,860–2,070 ms and
   the bank lands BEFORE ready in 5/5 base and 3/5 cured windows, so the base arm reads
   177,129 B / 10 req, not 172,197 B / 9 req. The cure's delta is LARGER here (-8,482 to
   -13,106 B), never smaller, so no claim fails. The Fast-3G row should read "-8,174 B always,
   plus the bank's ~4.6–4.9 KB on the two thirds of deals that roll livegen WHEN board-ready is
   late enough for the bank to have landed" — the same conditional sentence the unthrottled row
   already carries.
2. **The residual first-open cost is booked at +348.0 ms and reads +1,009.9 ms here**
   (`verify-r3/r3-first-open-fast3g-desk.jsonl`, loadavg 45.86, 3/3 non-overlapping). It is a
   cost, the author names it and does not claim it, and it is structurally irreducible inside
   C10 — but the point figure understates it on a loaded host. It should be written as a band,
   ~300 ms to ~1,000 ms, not a number, wherever B1 or the §8.2 record carries it forward.
3. **The repair's own figure drifts the same way.** The return reads chunk start +140 to +158 ms
   and in hand +359 to +379 ms; at loadavg 29–35 I read +248 to +280 and +468 to +503. The
   1.6 s → sub-0.5 s move holds in every reading; the "about 0.37 s" figure is a load-band, not
   a constant.
4. **`app-shared` is now the third modulepreload and `solver.worker` the fourth.** The REFUTED
   clause guards the worker's presence on the boot burst, which is intact, so this is not a
   violation — but the worker's preload now queues behind one extra 3,090 B request on a slow
   link. No readiness regression is measurable in any of the three regimes above. Worth a watch
   row if C04 (single-flight the wasm) lands on the same burst.
5. **The `app-shared` chunk test's second alternative is unanchored**
   (`vite.config.ts` :401 hunk, `/[\\/]src[\\/]pencil[\\/]config[\\/]pencilConfig\.ts$|export-helper/`).
   `export-helper` matches any module id containing that substring, including one arriving from
   `node_modules`. Today it matches exactly `_plugin-vue_export-helper` and the chunk is 3,090 B,
   so nothing is wrong; it is loose in a file whose whole job is to be exact. A quality row.

## 8. Load

    open of the session   { 12.86 61.98 164.42 }
    Fast-3G set           { 32.49 … } → { 34.55 … }
    unthrottled set       → { 41.25 … }
    WebKit set            → { 35.31 … }
    warm-when set         → { 29.33 … }
    first-open set        → { 45.86 … }
    close, servers down   { 149.65 133.77 144.33 }

Up to ten sibling lanes measure on this host. Every byte figure above is deterministic per arm
per draw and is unaffected; every millisecond figure above is reported with its load and no
millisecond claim is carried by this cure.
