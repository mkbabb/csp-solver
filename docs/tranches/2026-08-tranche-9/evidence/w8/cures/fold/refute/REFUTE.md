# T9-W8 — THE FOLD'S NON-AUTHOR REFUTER (FOLD-MANIFEST §6.10)

2026-09-18 · worktree `.claude/worktrees/w8-fold`, branch `t9/w8-fold` at `4233baa2`, clean
(`git status --porcelain` at the close = four untracked scratch configs only — the chair's
`.vite-integrate.config.ts` and `playwright-integrate.config.ts`, and mine, `.vite-w8fold.config.ts`
and `playwright-w8fold.config.ts`; `dist` and `dist-base` are ignored).
Non-author: this session wrote none of the six cures and made no source edit.

**Every number here is a PROXY.** Playwright chromium under CDP throttling, or Playwright WebKit
with no CDP (no CPU rate, no link shaping, no `longtask`). No WebKit number is a Safari number
and nothing here is an iOS claim (M19 honored: no `osascript`, no real Safari, no simulator, no
`perf-rig/run-safari.sh` / `run-sim.sh` / `cpu-attrib.sh` / `matrix.sh`). The device closes every
budget through 8.3.

`sysctl -n vm.loadavg` is quoted per set and ran 3.48 → 13.72 across the session.

---

## 0. The tree, and what the manifest got wrong about it

`git log --oneline 74a2b5d9..HEAD` is **TWELVE** commits, not eleven. Ten picks (8.3 ×2, C01 ×3,
C06, C10 ×2, C07a, C07b) + the record commit `65a1a221` + a **twelfth**, `4233baa2`, which the
manifest does not mention: it teaches `check-gen-latency` to read the tier table out of
`tiers.ts` (C10 moved it) and gives `check-coverage-floor` a `src/probe` scope (8.3 added two
files under a path no floor claimed). Both gates were RED in the chair's own battery
(`fold/logs/results.tsv` rows `4c-coverage-floor` and `6g-gen-latency`, exit 1) and the twelfth
commit is their repair. **Re-read bare on this tree**: `test:coverage:floor` exit 0 (13 scopes,
`src/probe` at 9.72% stmts), `test:gen-latency` exit 0 (10/10 cells under ceiling). The chair's
`results.tsv` still records the pre-repair reds; it was not re-stamped.

### C07b's first typecheck without C02 — the manifest's gap 3, closed

    npx vue-tsc --noEmit        EXIT 0
    npm run typecheck:e2e       EXIT 0

Bare, on a stock-0.12.0 `node_modules` (the symlink into main, untouched) with no C02 beneath it.
C07b's `afterFirstPaint()` hunk compiles and the tree builds. **CONFIRMED.**

### Dist identity (both arms, printed at the open and unmoved at the close)

    dist-base  AUDIT: build-identity — dist entry index-CubiZsMVSwTc.js · index.html md5
               a8421b0ffe8ad72809f86fdb4ac50732 · 43 files / 806.3 KB     (master 74a2b5d9)
    dist       AUDIT: build-identity — dist entry index-ChSrVSqM0j8q.js · index.html md5
               f2d904213d21aad11e51df6a81cebca7 · 47 files / 823.0 KB     (t9/w8-fold 4233baa2)

Built with `npx vite build --config .vite-w8fold.config.ts --logLevel warn` (a PRIVATE cacheDir
at `.claude/worktrees/w8-fold/.vite-cache`, never shared with a preview). It reproduced the
chair's `dist` **byte for byte** — `diff -r` against a copy of the chair's tree, exit 0. So the
fold's build is deterministic across cacheDirs, which is worth saying given LEDGER trap (a).

Assets that are new in the cured arm: `app-shared-BZjJ4UO90bDQ.js`, `GameGallery-D51Bf91Kvhrh.js`,
`GameGallery-BgPLkE_ckPqR.css`, `devicePaint-DYfALhM0r-4G.js` (+4 files). `index.html`'s
`modulepreload` list goes **3 → 4** (`app-shared` inserted third, `solver.worker` fourth — LEDGER
row (d) confirmed at source). The three woff2 preloads are unchanged in both arms.

Servers: `npx vite preview --config .vite-w8fold.config.ts --host 127.0.0.1 --strictPort`,
cured `dist` on **:4256**, base `dist-base` on **:4257**. Both killed at the end.

---

## 1. VERDICTS

| cure | verdict | the one line |
|---|---|---|
| **C01** one bake round | **CONFIRMED** | 28 → 16 encodes, 3/3, in every regime; the discarded round's blocking goes to 0.0 ms, disjoint |
| **C06** the exit mover's ownership | **CONFIRMED** (one adjustment to the BASE's shape) | 18/18 cured exit windows GLIDE; 18/18 base windows have no travel channel |
| **C10** slow-link bytes | **ADJUSTED** | the split is **−7,524 B** on this tree, not −8,174; the cut duplicates one Tailwind utility |
| **C07a** preview fidelity | **CONFIRMED** | see §6 |
| **C07b** the face after first paint | **CONFIRMED** (byte figure adjusted) | 4 → 3 woff2 GETs before ready in 11/11 windows, three regimes, both engines; the second fraunces GET costs **14,636 B** here, not 14,936 |
| **8.3** the device instrument | **ADJUSTED / part NOT-MEASURABLE** | its "29 → 29 / +60 B" row cannot be read on a tree carrying six cures; what is isolatable reproduces |

---

## 2. C01 — one bake round, not two · **CONFIRMED**

Instrument: `C01/instr/bake-census.mjs`, banked and unmodified, through this dir's
`interleave.sh` (C01's `verify-r3/interleave.sh` with the evidence root and the two ports
changed, nothing else). One window per invocation, b,c,b,c. Reducer: `C01/instr/stats.mjs`,
banked and unmodified. 0 tainted windows in every set.

### chromium · 4× CDP · Fast-3G · cold · 1280×800 · dpr 2 · 3+3 · load 7.81 → 6.89

| quantity | base (median, spread) | cured | Δ | outside both spreads |
|---|---|---|---|---|
| encodes | 28 (28–28) | 16 (16–16) | −12 | **YES** |
| discarded ms | 978.9 (975.0–984.3) | 0.0 | −978.9 | **YES** |
| encode bill ms | 2,041.0 (2,027.5–2,055.5) | 1,058.5 (1,057.9–1,063.8) | −982.5 | **YES** |
| last encode ms | 3,894.2 (3,887.8–3,927.9) | 2,913.9 (2,869.2–2,949.7) | −980.3 | **YES** |
| TBT ms | 1,431 (1,423–1,444) | 792 (775–792) | −639 | **YES** |
| board-ready ms | 1,382.0 (1,366.3–1,386.7) | 1,344.0 (1,332.9–1,352.4) | −38.0 | YES — **but see the caution below** |

Rounds per surface, every window: base `sun 8 · moon 8 · grid 8 · logo 4`, cured
`4 · 4 · 4 · 4`, 3/3 both arms. `drawImage` 28 → 17 (16 encodes + one extra draw in the cured
arm — C07b's ink gate reading the painted face; not a defect, worth a reader's eye).

Banked was 1,179.5 → 0.0 discarded, 2,454 → 1,227 bill, 1,851 → 965 TBT on a host at load
13.7–18.3. Every ratio holds; the absolutes are lower here because the host was quieter. The
charter's ceiling (≤ 20 cold encodes) is met at 16.

### chromium · 4× · Fast-3G · cold · **390×844 · dpr 3** · 3+3 · load 6.39 → 6.50

encodes 28 → 16 · discarded 640.7 → 0.0 · bill 1,379.7 → 710.8 · last encode 3,194.5 → 2,491.9 ·
TBT 978 → 533 · board-ready 1,355.0 → 1,316.6. All six disjoint. Banked: 28 → 16, 714.5 → 0,
1,514.7 → 858.5, 1,159 → 767. Reproduces.

### webkit · unthrottled, no CDP · cold · desk · dpr 2 · 3+3 · load 13.72 → 8.76 (PROXY)

encodes **20 → 16** (grid 8 → 4; the other three surfaces are 4 in both arms) · discarded
256.0 → 0.0 · bill 569 → 300 · last encode 769 → 577 · **board-ready 392.0 (387–480) → 175.0
(173–183), −217 ms, disjoint**. TBT NOT MEASURED (no `longtask` entry type in Playwright WebKit;
both arms read 0). Banked: 20 → 16, 275 → 0, 629 → 417, 444 → 290.

**Round 2's blank-wordmark finding stays CLOSED**: the logo PNG byte multiset is
`{22243, 22252, 22095, 22205}` in **both** arms, 3/3 windows each, no 3,152 B blank anywhere.

### The caution on board-ready

C01's accepting round correctly withheld board-ready (+16.4, inside spread). On the FOLDED tree
it moves and is disjoint in three regimes — chromium Fast-3G desk −38.0, mobile −38.4, WebKit
−217. **This is the FOLD's move, not C01's**: the same arm also carries C10 (−7.5 kB off the
render-blocking path) and C07b (one woff2 GET out of the boot window). No single cure may be
credited with it, and the three cures' own accepting rounds each say board-ready did not move.

---

## 3. C06 — the exit mover's ownership · **CONFIRMED**, with one adjustment to the base's shape

Instrument: `C06/fold-geometry.mjs`, banked and unmodified; only `--port` differs between arms.
Three invocations × 2 cycles = 6 exit windows per arm per regime, warm, unthrottled link.

| regime | base exit, 6 windows | cured exit, 6 windows |
|---|---|---|
| chromium 1× · 1280×800 dpr 2 · load 9.80 | **3× NO TRAVEL** span 0 px distinct 1 · **3× CUT** span 336 px distinct 2 | **6× GLIDE** span 293.8–336 px, distinct 43–45 |
| chromium 1× · 390×844 dpr 3 · load 7.89 | **5× NO TRAVEL** span 0 distinct 1 · **1× CUT** span 127.4 distinct 2 | **6× GLIDE** span 78.1–127.4 px, distinct 30–31 |
| webkit · desk dpr 2 · load 5.12 (PROXY) | **6× NO TRAVEL** span 0 distinct 1 | **6× GLIDE** span 237.6–261.7 px, distinct 23–24 |

**18 of 18 cured windows travel; 18 of 18 base windows do not.** The verdict is categorical in
both directions and no delta can sit "inside a spread" because the base has no distribution.

**ADJUSTMENT.** C06's record says the base reads "NO TRAVEL span 0 px, distinct 1, in 35 of 36
windows". Here it reads that in **14 of 18**; the other 4 read **CUT** — span = the whole travel,
`biggestStep` = the whole travel, distinct 2. That is the same instant swap sampled across two
frames rather than one (C06 already named the shape for one WebKit window), and it is
deterministic here: chromium desk cycle 0 read CUT in 3 of 3 invocations. It changes nothing
about the verdict and it does change the sentence "span 0 px, 6/6".

**Step share against the entry control, same interleaved windows** (the charter's smoothness
clause):

| | entry (control), median | exit (cured), median |
|---|---|---|
| chromium 1× desk | 0.124 | **0.104** |
| chromium 1× mobile | 0.087 | **0.083** |
| webkit desk | 0.233 | **0.245** |

The exit is no coarser than the entry on chromium and is coarser by 0.012 on WebKit — inside
noise at load 5.12. **C06's "NOT CLOSABLE at load 100–500" sub-clause closes favourably here**:
on a quiet host the WebKit exit and entry share the same band.

---

## 4. C10 — slow-link bytes · **ADJUSTED**

Instruments: `C10/verify-r3/{boot-freight,freight-run}.mjs` (md5 `d1317caf…` — the banked A2
instrument; C07b's copy is the SAME file, so one run serves both cures) and
`C10/census-bytes.mjs`, all unmodified except that the `createRequire` anchor was re-pointed
from the MAIN tree's `package.json` to this worktree's (read-only either way; `node_modules` is
the symlink into main). Copies live in `refute/instruments/`.

### The wire, interleaved b,c,b,c, one window per invocation

| regime | base (enc B / req before ready) | cured | windows |
|---|---|---|---|
| chromium 4× · Fast-3G · cold · 1280×800 dpr 1 · load 9.65 | **172,262 / 9** (4/5) · 157,626 / 8 (1/5) | **150,102 / 9** (5/5) | 5+5 |
| chromium 4× · unthrottled · cold · dpr 1 · load 9.95 | **183,292 / 11** (3/3) | 156,200 / 10 (2/3) · 160,824 / 11 (1/3) | 3+3 |
| webkit · cold · dpr 1 · load 9.87 (PROXY) | **187,774 / 12** (3/3) | 160,680 / 12 (2/3) · 165,320 / 12 (1/3) | 3+3 |

The headline Fast-3G delta is **−22,160 B**, but it is two cures, not one, and it must be split:

- the base's 5th Fast-3G window fetched fraunces ONCE (8 requests, 157,626 B) where the other
  four fetched it twice. 172,262 − 157,626 = **14,636 B** — that is C07b's row, priced at the
  wire by the base arm's own variance.
- **C10's split is therefore 157,626 − 150,102 = −7,524 B**, and the static census agrees:
  the boot graph (entry js + blocking css + vue-vendor + animation-vendor + app-shared) is
  406,073 raw / 113,632 br / 130,577 gz → 377,162 / 107,390 / **123,070**, i.e. **−7,507 B gz**
  — 17 B from the measured wire figure, exactly the agreement C10's own verifier reported.

**The banked "−8,174 B always, to the byte" does NOT reproduce**: it is **−7,524 B** on this
tree. The mechanism is unchanged; master moved under it (the W7 fold re-shaped the entry chunk),
and a figure stated "to the byte" is a figure that must be re-derived at each base.

The bank-roll arithmetic DOES reproduce: the two cured values differ by 4,624 B in both the
unthrottled and the WebKit set — the shrunken bank chunk, to the byte (`templates-*` 18,164 raw
/ 4,327 br → 17,779 / 4,081, exactly C10's figures).

### Render-blocking CSS, and the "zero rules dropped" claim

    base   index-CMaYSiPKVidg.css  93,634 raw / 16,428 br
    cured  index-DSV8hl9eUGyP.css  82,679 raw / 14,743 br   (−10,955 B off the blocking path)
           GameGallery-BgPLkE_ckPqR.css  11,002 B           (the moved sheet, not in index.html)
    total CSS  96,800 → 96,847 B   (+47)

**Semicolons are identical, 1,529 = 1,529, and every at-rule count matches** (`@media` 113 base
= 97 + 16 cured; `@font-face` 3, `@keyframes` 29, `@layer` 7, `@property` 42, `@supports` 18,
unmoved). So **no declaration and no rule was dropped** — C10's claim stands.

But the brace count does NOT: base 1,036 pairs, cured 1,037. The extra block is
`.font-display{font-family:var(--font-display)}` — one Tailwind utility Tailwind emits into BOTH
sheets once the gallery's scan is its own chunk. It carries no semicolon, which is why the
semicolon census misses it, and it is the whole of the +47 B. **C10's banked line "braces
1,069/1,069 IDENTICAL" does not reproduce; the cut duplicates exactly one utility.** Harmless,
and worth a LEDGER line so the next split is not read as a rule loss.

### The two behavioural rows

- **bank chunk fetched before board-ready**: base **6/11** windows, cured **2/11**. Banked was
  15/15 → 6/15. The direction reproduces; the base's own rate is host- and roll-conditional, so
  "15/15" is not a property of the base build.
- **`GameGallery` chunk before board-ready**: **0/11** on the cured arm. The fix's own risk is
  refuted again.
- **`app-shared` is the third `modulepreload`** (base 3 preloads → cured 4). LEDGER row (d)
  confirmed at the artifact.

---

## 5. C07b — the bake's face after first paint · **CONFIRMED**

Same instrument as §4 (`boot-freight.mjs` is byte-identical between the C10 and C07b banks —
md5 `d1317cafe9a6d22c52081fbafa005b25` both sides — so one run answers both cures).

| mark | regime | base | cured | windows |
|---|---|---|---|---|
| woff2 GETs before board-ready | chromium 4× · Fast-3G · cold · desk dpr 1 | **4** (4/5; one window 3) | **3** (5/5) | 5+5 |
| | chromium 4× · unthrottled · cold · desk dpr 1 | **4** (3/3) | **3** (3/3) | 3+3 |
| | webkit · cold · desk dpr 1 (PROXY) | **4** (3/3) | **3** (3/3) | 3+3 |
| fraunces GETs before board-ready | all three | **2** (10/11) | **1** (11/11) | 11+11 |
| TBT before board-ready | chromium 4× · Fast-3G · cold · desk dpr 1 | 162 ms (150–184) | 149 ms (143–157) | cured ≤ base in **5 of 5 PAIRS**; ranges overlap |

**11 of 11 cured windows drop the fourth woff2 GET, across three regimes and both engines.** The
author's own phrasing holds: the TBT row is PAIRED, not disjoint.

**The byte figure, stated precisely.** The base arm's own variance prices the second fraunces
GET: a Fast-3G base window that fetched fraunces once read 157,626 B / 8 requests where the other
four read 172,262 / 9 — a difference of **14,636 B**, which is the subset's `encodedBodySize`
(the file on disk is 14,636 B). C07b's banked **14,936 B** is the same GET's `transferSize`, and
the C07a census reads exactly `"x": 14936` for it. Both numbers are right and they measure
different things; the record should say which.

**What it costs — the banked cost row does NOT reproduce here.** C07b prices the delay as "first
logo encode `t0` 84–343 → 343–375 ms chromium, 179–199 → 505–546 ms WebKit". Against the two
previews at 1× unthrottled, the masthead's four `<image>` bake nodes mount **EARLIER** in the
cured arm on every route and engine (a refuter's own probe, `instruments/wordmark-bake-when.mjs`,
12 s window, 1 run per cell):

    route /              base chromium 294 ms → cured 206   ·  base webkit 422 → cured 405
    route /?view=gallery base chromium 218 ms → cured 121   ·  base webkit 321 → cured 318

These are different marks (mount of the `<image>` nodes vs the first encode's `t0`) and this is
an unthrottled warm-ish preview, not C07b's cold 4× Fast-3G. But the cost the record leads with
is not visible at this regime, and the fold's earlier thread release (C01) plausibly pays for the
deferral. **The chair should not quote "+340 ms later on WebKit" as a folded-tree figure.**

---

## 6. C07a — the preview server's fidelity · **CONFIRMED**, to the count

C07a is not a `dist` cure — `dist` is byte-identical — so it cannot be A/B'd by serving two
builds. It was measured the only way it can be: **the same cured `dist` through two server
shapes**, on my two ports, with `C07a/instrument/webkit-font-confirm.mjs` (banked, only the
`createRequire` anchor re-pointed to this worktree).

    :4256  `vite preview --config .vite-w8fold.config.ts`   →  no `Vary`, no ACAO   (the cure)
    :4257  `vite preview --config instruments/vite.base-preview.config.mjs`  →  `Vary: Origin`
           (C07a/verify-r1/vite.base.config.mjs, re-pointed; no `preview` block = vite's default
            CORS middleware, i.e. master's shape)
    both serve entry index-ChSrVSqM0j8q.js — verified by curl at both ports.

| engine | `Vary: Origin` ON | `cors: false` | windows |
|---|---|---|---|
| **webkit** | **7** (fira 2 · fraunces 3 · patrick 2) | **4** (1 · 2 · 1) | 3 / 3, deterministic |
| **chromium** | **4** (1 · 2 · 1) | **4** (1 · 2 · 1) | 3 / 3, deterministic |

Identical to the banked table, run for run. The mechanism reproduces: under `Vary: Origin` the
`crossorigin` preload and WebKit's own `@font-face` load key differently and every subset is
downloaded twice; chromium's `@font-face` load is CORS-mode and matches, so chromium is unmoved.

**One caution for the battery's readers.** Because `preview.cors: false` lives in `vite.config.ts`,
ANY preview raised from the folded tree's config serves BOTH `dist` and `dist-base` without
`Vary`. The chair's battery and my own §2–§5 sets therefore ran **both arms edge-faithful** — which
is correct for every other cure and means C07a's own number is invisible in those sets. It has to
be read the way it is read here, or not at all.

---

## 7. 8.3 — the owner-run device instrument · **ADJUSTED; its headline row NOT-MEASURABLE here**

Instrument: `8.3/readiness-ab.mjs`, banked and unmodified, `--cells mob-cr-4x-unthr-cold
--windows 3 --wait 8000`; chromium · 4× CDP · unthrottled link · cold · 390×844 · dpr 3 ·
load 3.90 → 3.69. 0 tainted windows.

| mark | base | cured (no flag) | cured (`?__probe=1`) |
|---|---|---|---|
| resourceCount | 29 · 29 · 29 | **31 · 31 · 31** | **32 · 32 · 32** |
| transferBytes | 212,165 (identical 3/3) | **210,936** (identical 3/3) | **216,375** (identical 3/3) |

**The banked row "resourceCount 29 → 29, transferBytes +60 B" is NOT-MEASURABLE on the folded
tree.** The cured arm here differs from the base by six cures, not by the probe: C10 splits the
entry (`app-shared`) and lazies the deck (`GameGallery` js + css land inside the 8 s window), so
the boot graph gains two resources and loses ~1.2 kB net. 8.3's 141 B guard / 60 B gzipped is a
rounding error inside that and cannot be separated by this comparison. Nothing here contradicts
the banked figure; it simply cannot be re-read this way.

**What IS isolatable, and reproduces** — the within-arm comparison (cured un-armed vs cured
armed, same build, same server):

- **the probe is inert un-armed**: 31 resources without the flag, 32 with it. The probe's chunk
  appears if and only if `?__probe=1` is present.
- **the armed cost is +1 request and +5,439 B** (216,375 − 210,936). Banked: +1 request, **+5,499 B**.
  A 60 B difference, and it is the same 60 B: the un-armed cured arm already carries the guard.
- **the base arm ignores the flag entirely**: 29 / 212,165 with and without it, 3/3 — master has
  no probe. A clean negative control.
- `controlsInteractiveMs` reads **NOT MEASURED** on the armed cured arm, 3/3, with
  `controlsHow` carrying the `.drawer-tab` click timeout verbatim — exactly the defect 8.3's
  README documents and the run sheet's first instruction works around. Reproduces.
- **`npm run test:e2e:projects` exit 0** on this tree (35 specs, 553 resolved tests). The
  `SPEC_MANIFEST` row landed; FOLD-MANIFEST §6.3 is right that it is no longer owed.

### What the same instrument says about B1 — and it closes the manifest's own gap 4

The manifest books "`firstBakeMs` moves and the move is printed" as **UNDEMONSTRATED** (gap 4 /
C01's A6 row, never re-run after the repair). It is demonstrated here, on the folded tree, same
regime, 3+3, 0 tainted:

| mark | base | cured | disjoint |
|---|---|---|---|
| **firstBakeMs** | 2,519.5 · 2,554.5 · 2,576.5 | **1,377.8 · 1,383.8 · 1,448.4** | **YES, −1,141 ms** |
| bakeLayers | 4 · 4 · 4 | 4 · 4 · 4 | unchanged (no bake dropped) |
| LCP | 2,536 · 2,580 · 2,600 | **1,396 · 1,400 · 1,464** | **YES, −1,180 ms** |
| firstBoilTickMs | 2,684.8 · 2,686.1 · 2,814.3 | **1,428.4 · 1,440.9 · 1,452.1** | **YES, −1,246 ms** |
| tbt3000Ms | 931 · 941 · 932 | **525 · 524 · 568** | **YES, −407 ms** |
| rafGapProxyTbtMs | 1,149 · 1,164 · 1,179 | **619 · 637 · 702** | **YES, −512 ms** |
| longtasks in 3 s | 9 · 9 · 10 | 5 · 5 · 6 | YES |
| boardReadyMs | 255.3 · 252.3 · 260.2 | 231.7 · 245.1 · 259.0 | no — overlaps |

This is the FOLD's move, not any one cure's, and it is a proxy at dpr 3 on an unthrottled link.
The device still sets B1's RED.

---

## 8. π ON THE FOLDED TREE

| gate | result |
|---|---|
| goldens off the cured dist (`playwright-golden.config.ts`, `PLAYWRIGHT_BASE_URL=:4256`, **no** `--update-snapshots`) | **4 / 4 passed** (1.4 s) |
| `git status --porcelain e2e/` after | **empty** — no baseline moved |
| `playwright-throttle.config.ts` against `:4256` (throttled-void · wordmark-integrity · theme-bake-freshness · filter-census · theme-quadrants) | **67 / 67 passed** (28.5 s) |
| `FILTER_BUDGET_TOTAL` | **9** (ceiling 14) — unmoved |
| `BOIL_CONFIG.frameCount` (pose count) | **4** — unmoved |
| `npm run test:coverage:floor` | exit **0** (13 scopes; `src/probe` stamped at the fold) |
| `npm run test:gen-latency` | exit **0** (10 / 10 cells under ceiling) |
| `npm run test:e2e:projects` | exit **0** |

### The rect census — every W8 cure is a schedule, not a look

`w7/exec/integrate/rect-census-fold.mjs` (ENGINE=chromium and webkit) over both routes and three
viewports, PRM emulated, board pinned by permalink, 2,500 ms settle; diffed with
`w7/exec/3B-1/probe/rect-diff.mjs`.

    chromium:  WORST max|Δ| across all surfaces = 0.00 px
    webkit:    WORST max|Δ| across all surfaces = 0.00 px

1,049–1,807 rects per surface. **Not one shared rect moves by a hundredth of a pixel**, on either
engine, at 1280×800, 390×844 or 820×1180.

Two structural differences, both zero-rect, both identical in the two engines:

1. **`head/link:38–40`, +3 in the cured arm on every surface.** The extra `<link>` elements vite
   emits for the split (`app-shared` modulepreload and the gallery chunk's preloads). `[0,0,0,0]`.
2. **`?view=gallery` only, `main:5/…/svg:2`**: the base carries four `<image>` nodes (a parked
   surface's baked stack) plus its live `<g>`; the cured carries the live `<g>` alone, its 68
   `<path>` children renumbered from `g:5/path:N` to `g:1/path:N`. **The whole subtree reads
   `[0,0,0,0]` in both arms** — it is not rendered in gallery view, so nothing visible differs.
   It is the deferral showing on a hidden host. I could not name the component from rects alone
   and did not guess; it is worth one line of the chair's eye, not a block.

### The e2e rows the cures touch

Through a scratch `playwright-w8fold.config.ts` (spreads `playwright.config.ts`, deletes its
:3000 `webServer`, baseURL → the preview). Both engines.

    cured (:4256)  device-probe · theme-bake-freshness · wordmark-integrity · filter-census ·
                   gallery (incl. CH-67) · masthead-alignment · visual-regression
                   → 88 passed (1.3 m), 0 failed
    base  (:4257)  the same minus device-probe (it does not exist on master) and
                   visual-regression → 58 passed (43.7 s), 0 failed
    git status --porcelain e2e/ after both  → empty

The five e2e reds in the chair's full run (`multiplayer.spec.ts` ×2, `presence.spec.ts:177`,
both engines) are the relay-Worker rows T9-R1/T9-R2 and are red on the BASE arm too — the chair's
`9b-reds-base.log` reads 4 failed against `dist-base`. Not the fold's.

---

## 9. BLOCKING — nothing. What the chair owes the record

None of the six cures is refuted and nothing found here blocks the fold. Five record corrections
are owed:

1. **FOLD-MANIFEST §1 says ten picks + a record commit; the branch carries TWELVE commits.** Add
   `4233baa2` (the two gates' repair) to the fold order, and re-stamp `fold/logs/results.tsv`,
   which still books `4c-coverage-floor` and `6g-gen-latency` at exit 1.
2. **C10's "−8,174 B always, to the byte" is −7,524 B on this tree** (gz census −7,507). Re-derive
   at the citation; do not carry the old byte.
3. **C10's "braces 1,069/1,069 IDENTICAL"** does not reproduce: 1,036 → 1,037. The cut duplicates
   `.font-display{font-family:var(--font-display)}` into both sheets (+47 B, no semicolon, which
   is why the semicolon census misses it). "Zero rules dropped" stands; "identical braces" does not.
4. **C07b's 14,936 B is a `transferSize`; the encoded body is 14,636 B.** Say which, once.
5. **C07b's cost row ("+~340 ms, WebKit") is not a folded-tree figure.** My own probe reads the
   masthead bake mounting 3–97 ms EARLIER in the cured arm at 1× unthrottled, both engines, both
   routes. Different mark, different regime — so the record should scope its cost sentence to the
   regime it was taken in.

Two things I could NOT measure, said plainly:

- **8.3's `resourceCount 29 → 29 / +60 B`** — NOT-MEASURABLE on a tree carrying six cures (§7).
  It is not contradicted; it cannot be re-read this way. The chair should keep the 8.3 track's own
  number and not restate it from the fold.
- **Any device number.** M19 held throughout: no real Safari, no simulator, no `osascript`. Every
  figure above is a Playwright proxy and B1–B6 stay RED until §7.2 of the manifest.

Servers on :4256 and :4257 were killed at the end; the process lines were read before each kill.
Evidence: `raw/` (all jsonl + logs), `C01-stats-{desk,mobile,webkit}.md`, `C06-geometry.md`,
`C10-census.md`, `dist-diff.txt`, `rects/`, `rect-census.log`, `pi.log`, `e2e-rows.log`,
`c07a.log`, `wordmark-when.log`, `instruments/` (the four re-pointed copies + two probes written
here). No PNG was written; there is no screenshot in this dir.
