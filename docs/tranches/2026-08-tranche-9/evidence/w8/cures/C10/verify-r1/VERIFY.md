# T9-W8 C10 — NON-AUTHOR VERIFY, round 1 (track "app")

2026-09-17 · verifier did not write the cure · worktree `.claude/worktrees/w8-app` at
`83ee20b6` (clean, untracked-files none) · preSha `0bf9cb0e` · ports base 4256 / cured 4257.

VERDICT: **REPAIR**. The number C10 owes reproduces to the byte; π and the gates are clean;
every "It must not" holds. Two things have to move before this closes: an unmeasured regression
the deferral creates on the cure's OWN regime (first deck open, cold Fast-3G, +412 ms,
non-overlapping 5/5), and two banked byte figures that are best-case draws reported as medians.

## 1. The diff is the charter's mechanism

`git diff 0bf9cb0e..83ee20b6` — five files, all app-side: `src/App.vue` (static import of the
deck → `shallowRef` + two warms + `<component :is>`), `vite.config.ts` (the tier table gets its
own emitted module; one `app-shared` advancedChunks group), `useSudoku.ts` (tier question asked
before the bank `import()`), `data/tiers.ts` (new, generated), `data/templates.ts` (re-emitted
without the accessor). Deferral of the not-yet-visible + bundling. Nothing draws less: no bake
dropped, no boil thinned, no filter removed, no transition shortened, no DPR lowered, no
cacheKey touched. Nothing on the REFUSED or REFUTED lists is re-proposed.

CSS rules, both arms, parsed from the shipped sheets:
base `index-DouNrfU0EVpa.css` 870 blocks / 1038 braces / 1529 semicolons;
cured `index-ZDUNVWRUxvZ9.css` + `GameGallery-BgPLkE_ckPqR.css` 870 / 1038 / 1529.
The 26 differing blocks are the App.vue scope-id rename `data-v-4210a719` → `data-v-ccfc5fad`,
one for one. **No CSS rule dropped.** The gallery sheet is 103 selectors, every one scoped, no
`@keyframes`, no global rule — so moving it out of the blocking sheet cannot re-order a cascade
tie (the 407 non-gallery blocks that now precede it only match other components' scope ids).

`index.html`, both arms: `solver.worker` modulepreload present, same position, unmoved; all
three font preloads present. The only head change is one added `app-shared` modulepreload.

## 2. The arms

    dist-base  AUDIT: build-identity — dist entry index-CydLs17Yb6Kt.js · index.html md5
               a5354065621a844ebf02a51cfc966251 · 43 files / 806.2 KB
    dist       AUDIT: build-identity — dist entry index-Xs5kd5lwkg21.js · index.html md5
               7c8ebd7d2494414d8eae3200c95cdf1d · 46 files / 807.4 KB

Both match the author's report. I rebuilt HEAD myself (`npm run build`, exit 0) and the cured
arm reproduced byte-identically — same entry hash, same index.html md5, 46 files / 807.4 KB, and
`git status` stayed clean (the generator wrote no drift). Port→arm was confirmed by curl before
every reading set: 4256 serves `index-CydLs17Yb6Kt.js`, 4257 serves `index-Xs5kd5lwkg21.js`
(the swapped-arms lie is excluded).

Base is pre-cure by structure: entry js 215,345 B with 14 `game-card` occurrences and no
gallery chunk; the tier accessor lives inside `templates-LkXzF59FZu96.js` (18,164 B). Cured:
entry 192,282 B with 1, `GameGallery-F_uYwsDH-spM.js` 21,321 B + `GameGallery-BgPLkE_ckPqR.css`
11,002 B, `app-shared-BZjJ4UO90bDQ.js` 3,095 B, bank 17,779 B with the accessor gone.

Instruments: `boot-freight.mjs` md5 `d1317cafe9a6d22c52081fbafa005b25`, `census-bytes.mjs`
`bb7758014a89d69efb236c4190aaf8d6`, `module-map.mjs` `b071105eee5f97e38d1f787e04a47d6b` — all
byte-identical to attribution/A2's. I ran the author's own `freight-run.mjs` driver, changing
nothing (ports are its arguments) and my own scratch playwright config (baseURL → :4257,
webServer dropped).

## 3. The numbers, re-run interleaved b,c,b,c,… one window per invocation

### 3a. encoded BYTES before board-ready — REPRODUCES EXACTLY

| regime (viewport · dpr) | base | cured | delta | agrees |
|---|---|---|---|---|
| chromium 4× · Fast-3G · cold · 390×844 dpr3 | 172,197 / 9 (double-font windows) · 157,561 / 8 (single) | 163,911 / 10 · 149,275 / 9 | **−8,286 B, +1 req in every paired mode** | yes |
| chromium 4× · Fast-3G · cold · 1280×800 dpr1 | 172,197 / 9 (5/5) | 163,911 / 10 (5/5) | **−8,286 B, +1 req** | yes |
| chromium 4× · unthrottled · cold · 1280×800 dpr1 | 183,227 / 11 (6/6) | 174,633 / 12 (4/6) · 170,009 / 11 (2/6) | median **−8,594 B**; author booked −13,218 | NO (see §5b) |
| webkit · unthrottled · cold · 1280×800 dpr1 (PROXY, longtask NOT MEASURED) | 210,281 / 15–16 (5/5) | 201,701 (3/5) · 197,061 (1/5) · 178,113 (1/5) | median **−8,580 B**; author booked −13,220 | NO (see §5b) |

vm.loadavg: mobile set 13.03 → 11.48 · desk Fast-3G 9.17 → 12.90 · unthrottled 13.46 → 16.62 ·
webkit 20.26 → 19.94. No window tainted (`tainted:false` throughout). The GameGallery chunk
never appears before board-ready in any window of any arm — the warm adds no boot freight.

The author's "deterministic per arm" holds on desk Fast-3G only. On mobile Fast-3G my base
mixed 172,197 and 157,561 and my cured mixed 163,911 and 149,275 — WebKit-style double font
fetches land in Chromium too, at random (C07's ground, untouched here). The PAIRED delta is
−8,286 B in every mode, so the cure's own figure is unaffected.

### 3b. board-ready

| regime | base median (min–max) | cured median (min–max) | delta |
|---|---|---|---|
| chromium 4× Fast-3G cold 390×844 dpr3 | 1,365.8 (1,360.0–1,593.9) | 1,335.7 (1,328.4–1,362.7) | −30.1 ms; 4/5 windows clear, one cured window (1,362.7) laps one base window (1,360.0) |
| chromium 4× Fast-3G cold 1280×800 dpr1 | 1,432.4 (1,413.8–1,444.8) | 1,399.6 (1,389.7–1,411.8) | **−32.8 ms, NON-OVERLAPPING 5/5** |
| chromium 4× unthrottled cold 1280×800 dpr1 | 353.6 (349.7–382.9) | 352.8 (344.3–394.2) | −0.8 ms, inside spread — NO REGRESSION |
| webkit unthrottled cold 1280×800 dpr1 (PROXY) | 290 (279–323) | 278 (275–280) | −12 ms |

The author's claimed readiness move was the mobile one (−27.2 ms); mine reads −30.1 ms there
and, at my lower load, a cleaner −32.8 ms on desk, which the author honestly declined.

### 3c. the sudoku bank before ready
Fast-3G, both viewports: 0/5 base, 0/5 cured — it lands after ready in both arms (agrees).
Unthrottled desk: base 6/6, cured **4/6** (the author read 2/6). `useSudoku.ts:116` rolls
EASY/MEDIUM/HARD uniformly and only 9×9 HARD is declared `bank`, so this is a 1-in-3 draw per
window, not a constant. Expected saving ≈ ⅔ × 4,624 B ≈ 3,080 B, not 4,624 B.

## 4. π

- Goldens: `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4257 npx playwright test --config
  playwright-golden.config.ts` — **4 passed, exit 0**, run twice, never `--update-snapshots`,
  no baseline touched. Pose count 4 (grid corner light, toggle crest dark, logo wordmark light,
  single given cell light).
- `filterBudget` 9: `src/pencil/config/filterBudget.ts` is not in the diff; `lint:motion` exit 0;
  `filter-census.spec.ts` green on the cured dist, both engines.
- Bakes / long frames on the fold (`fold-frames.mjs`, chromium 4× warm 1280×800 **dpr2**,
  3 interleaved invocations per arm, vm.loadavg 44.27 → 34.17 — a loud host):
  entry cycle 0 long33 2→2, long50 2→2, bakes 8,8,8 base / 8,8,**12** cured;
  entry cycle 1, exit cycle 0, exit cycle 1: long33 1→1, long50 1→1, bakes 4→4 everywhere.
  Worst-frame medians moved with the load and are inside spread in both directions (entry0
  116.4 → 124.2; exit1 65.8 → 59.8) — nothing claimable either way at load 40+.
  **The charter's π obligation is met: the lazily-mounted deck's first open starts no new long
  frame.** The one 12-bake cured window carries an EXTRA 4-bake group at 124–167 ms (added, not
  dropped); it did not recur and should be re-read at a calm load (§5c).
  Animation census keys are identical arm to arm on both legs, `opacity@game-gallery` included.
- DOM nodes in the deck view 1,776 → 1,779: the three head elements the split adds (the gallery
  stylesheet link and two modulepreloads). Benign, named here for the covisibility lane.

## 5. Findings

**5a — MATERIAL. The deferral is not warm in time on the regime it is sold for.**
`App.vue:371-375` copies `scheduleWarmPosters` exactly: `requestIdleCallback` plus a 1,200 ms
timeout floor after mount. Under 4× CPU on a cold 1.6 Mbps link that is far too late.
Measured with NO intent at all (`warm-when.mjs`, 3 windows, cured arm): the chunk fetch STARTS
at 2,186 / 2,241 / 2,293 ms and finishes at 2,873 / 2,987 / 2,988 ms, against a board-ready of
1,343 / 1,366 / 1,369 ms. So the deck is cold for ≈1.6 s after the board is ready.
A deck opened in that window pays for it (`first-open.mjs`, cold Fast-3G, 4×, 1280×800 dpr1,
press `g` at board-ready, 5 windows per arm interleaved, vm.loadavg 32.80 → 28.19):

    base  openMs 930.9 955.9 986.6 970.0 816.0  median  955.9
    cured openMs 1208.4 1406.2 1368.1 1410.6 1177.3 median 1368.1   +412 ms, NON-OVERLAPPING 5/5

and the cured windows all show `GameGallery-*.js/.css` fetched AFTER the press (start 1,437–
1,560 ms, end 1,656–1,808 ms). Press the same key 3 s after ready and the arms are level —
base 311.1 ms, cured 312.9 ms, inside spread — which is the proof that the penalty is exactly
the un-warmed window and nothing else. The charter's mechanism sentence is "deferral of the
not-yet-visible, **idle-prefetched so nothing feels later**"; on the charter's own regime
something does feel later, for the first ≈1.6 s. The author's fold instrument reads warm cache
on an unthrottled link, where the chunk is already local, so this regime was never read.
REPAIR, inside the charter's own vocabulary (scheduling): kick `warmGallery()` at board-ready
rather than off a 1,200 ms floor, and/or emit a `modulepreload` for the gallery chunk once the
boot burst has drained — then re-read `first-open.mjs` on both arms.

**5b — REPORTING. Two banked byte figures are best-case draws presented as medians.**
`numbers[3]` (chromium 4× unthrottled, −13,218 B) and `numbers[4]` (webkit, −13,220 B) both
assume the bank does not ride; it rides on a 1-in-3 tier roll, and 4 of my 6 cured unthrottled
windows fetched it (author: 2 of 6). My medians are −8,594 B and −8,580 B. The claim
"deterministic per arm — every window of an arm read the same total" is false for these two
regimes and for mobile Fast-3G. Restate as: −8,286 B always (the split), plus ≈4,624 B on the
two thirds of deals that roll livegen, on links fast enough for the bank to land before ready.

**5c — WATCH. One cured fold window read 12 bakes where every other window read 8.**
Entry cycle 0, load 44, extra group at 124.8/140.0/155.6/167.5 ms. Bakes were added, not
dropped, so no law is broken, but it wants three more windows per arm at a calm load before
8.3 signs the fold.

**5d — FIRST ACT, spot-checked.** `cov-1/2/3.txt` are real and carry the figures the author
cites: GameGallery.vue 9,946/317 = 3 %, techniqueEngine 7,058/183 = 2.6 %, useSession
5,456/721 = 13.2 %, useUndoHistory 2,604/289 = 11.1 %, bank 18,163/17,986 = 99 %. The rollups
they cite are identical across the three windows (other modules are not, and were not claimed
to be). I did not re-run the sourcemap build; the artifacts and their arithmetic check out.

## 6. Gates, bare, in the worktree

    npm run test:unit          exit 0   Test Files 66 passed (66) · Tests 810 passed (810)
    npm run lint:eslint        exit 0
    npm run lint               exit 0
    npm run lint:knip          exit 0
    npm run lint:boundary      exit 0
    npm run lint:tdz           exit 0
    npm run lint:copy          exit 0
    npm run lint:live-regions  exit 0
    npm run lint:motion        exit 0
    npm run typecheck:e2e      exit 0
    npm run typecheck:node     exit 0
    golden battery (:4257)     exit 0   4 passed
    e2e gallery set (:4257)    exit 0   112 passed — gallery, gallery-deal, gallery-guard,
                                        spoken-gallery, chromium + webkit
    e2e surface set (:4257)    exit 0   78 passed — filter-census, visual-regression,
                                        theme-bake-freshness, viewport-law, session-substrate,
                                        board-covisibility, both engines
    e2e surface set 2 (:4257)  exit 0   68 passed — a11y, throttled-void, permalink,
                                        font-census, sudoku-interaction, both engines

## 7. The must-nots, one by one

- Booked as a readiness cure on a fast link? **No.** The author declined it; my unthrottled
  reading is −0.8 ms, inside spread, and is reported as no-move.
- A CSS rule dropped? **No** — 870/870 blocks, §1.
- `solver.worker` modulepreload moved? **No** — same link, same position.
- Font preloads stripped? **No** — all three present.
- A bake dropped, a boil thinned, a filter removed, a transition shortened, a DPR lowered,
  a cacheKey theme-stripped? **No** — §1 and §4.
- Anything from the REFUSED or REFUTED lists? **No.**

Servers on 4256/4257 were killed at the end of this set. No product file was edited and nothing
was committed; the worktree is at `83ee20b6`, clean.

## 8. What is banked here (36,292 B, the wave's text cap holds)

`v-freight-*.jsonl` — the four interleaved freight sets (§3), one row per window; the raw
`names` array is folded to `fonts` + `extras` for the cap, nothing else touched.
`v-first-open-fast3g-desk.jsonl` / `v-first-open-delay3s.jsonl` / `v-warm-when.jsonl` — §5a.
`first-open.mjs`, `warm-when.mjs` — the two probes this verification adds; both read a fixed
dist over a running preview server and never build.
`fold-summary.txt` — the A7 fold set, summarized (raw jsonl dropped for the cap; the command
that remints it is in the file's head).
`load-*.txt` — `sysctl -n vm.loadavg` at both ends of every set.
The copied instruments (`boot-freight.mjs` md5 d1317cafe9a6d22c52081fbafa005b25,
`freight-run.mjs`, `census-bytes.mjs`, `fold-frames.mjs`) and the scratch playwright config sit
one directory up, byte-identical; they were run from there and are not re-banked here.
