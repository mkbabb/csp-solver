# T9-W8 C10 — NON-AUTHOR VERIFY, round 2 (the REPAIR of finding 5a) · track "app"

2026-09-17 · verifier did not write the cure · worktree `.claude/worktrees/w8-app` at `db43df48`
(clean) · author's preSha for the fix `83ee20b6`, the cure's own preSha `0bf9cb0e` · ports
base 4256 / cured 4257 · host carrying up to ten sibling lanes, vm.loadavg 16–60 across the day.

VERDICT: **ACCEPT**, with three rows named. The number C10 owes reproduces to the byte in four
regimes; the repair's own claim — the deck warm moved off a fixed floor onto the board — moves
outside spread and in the direction claimed; π and every gate is clean; every "It must not"
holds. What does not close is the residual first-open cost, which the author names and does not
claim, and which is structurally irreducible inside this cure.

## 1. The diff is the charter's mechanism

`git diff 0bf9cb0e..83ee20b6` (the cure) — five app-side files: `src/App.vue` (static import of
the deck → `shallowRef` + warms + `<component :is>`), `vite.config.ts` (the tier table emitted as
its own module; one `app-shared` advancedChunks group), `useSudoku.ts` (the tier question asked
before the bank `import()`), `data/tiers.ts` (new, generated), `data/templates.ts` (re-emitted
without the accessor).

`git diff 83ee20b6..db43df48` (the fix) — ONE file, `src/App.vue`, `scheduleWarmGallery` alone
(:369-420): the doc comment, the two-condition gate, the `load` listener, the `lookForBoard` rAF
poll with its `galleryWarm` stop at :406, two frames of margin at :408-414, a 3,000 ms backstop
at :419. `warmGallery()` (:363-368) and the call site in `onMounted` are untouched. Scheduling
and deferral, exactly the charter's vocabulary. Nothing draws less: no bake dropped, no boil
thinned, no filter removed, no transition shortened, no DPR lowered, no `cacheKey` touched.
Nothing on the REFUSED or REFUTED lists is re-proposed. No library change.

## 2. The arms

    dist-base  AUDIT: build-identity — dist entry index-CydLs17Yb6Kt.js · index.html md5
               a5354065621a844ebf02a51cfc966251 · 43 files / 806.2 KB
    dist       AUDIT: build-identity — dist entry index-DjKBBtRFWqfO.js · index.html md5
               3d2e12c88f34780977ce237fdddfa8ed · 46 files / 807.7 KB

Both match the author's report. I rebuilt HEAD myself into a scratch outDir
(`npx vite build --outDir dist-verify`, exit 0, removed afterwards — `npm run build` was NOT used
because its `prebuild` runs `make wasm` through the `csp-solver/wasm/pkg` symlink into the main
tree) and it reproduced byte-identically: `index-DjKBBtRFWqfO.js`, md5
`3d2e12c88f34780977ce237fdddfa8ed`, 46 files / 807.7 KB. So `dist` IS HEAD's build.
Port→arm confirmed by curl before the reading sets: 4256 serves `index-CydLs17Yb6Kt.js`,
4257 serves `index-DjKBBtRFWqfO.js`. The swapped-arms lie is excluded.

The fix is in the shipped bundle, not only in the source: the cured entry chunk carries
`.board-group .board-cells .game-cell` and `setTimeout(()=>{…},3e3)`. No masked fallback.

Instruments, all byte-identical to the banked ones and run unmodified (ports are arguments):
`boot-freight.mjs` md5 `d1317cafe9a6d22c52081fbafa005b25`, `census-bytes.mjs`
`bb7758014a89d69efb236c4190aaf8d6`, `fold-frames.mjs` `dffc1cc571c9068ec44c18f3878b145f`,
`freight-run.mjs` `8b194189f379606223460eada8b6ad65`, `verify-r1/first-open.mjs`
`6f95760036575e3f9bd92926cc4c2c3c`, `verify-r1/warm-when.mjs` `3c7f1191a75e2e2cb0e48517f23a23fe`
(the author's `fix-r1/` copies of the last two are `diff`-identical to verify r1's). The e2e
scratch config is `../playwright-c10.config.ts`, md5 `69ff7b9301d045b918c212a014f2bf0f`
(webServer dropped, baseURL → 4257); I copied it into this dir, ran from the copy, and removed
the copy for the wave's text cap — it is byte-identical, one directory up.

## 3. The numbers, re-run interleaved b,c,b,c,…, one window per invocation

### 3a. encoded BYTES before board-ready — REPRODUCES

| regime (viewport · dpr) | base | cured | delta | agrees |
|---|---|---|---|---|
| chromium 4× · Fast-3G · cold · 1280×800 dpr1 | 172,197 / 9 (5/5) | 164,023 / 10 (5/5) | **−8,174 B, +1 req** | yes, exactly |
| chromium 4× · Fast-3G · cold · 390×844 dpr3 | 172,197 / 9 (5/5) | 164,023 / 10 (5/5) | **−8,174 B, +1 req** | yes (my draw had no double-font window in either arm) |
| chromium 4× · unthrottled · cold · 1280×800 dpr1 | 183,227 / 11 (5/5, bank rides 5/5) | 170,121 / 11 (5/5, bank rides 0/5) | median **−13,106 B** | the lottery, not the median — §5c |
| webkit · unthrottled · cold · 1280×800 dpr1 (PROXY; longtask NOT MEASURED) | 210,281 / 16 (median; bank rides 5/5) | 197,173 / 16 (3/5) · 201,813 / 16 (2/5) | median **−13,108 B** | yes, exactly |

vm.loadavg: desk Fast-3G 24.03 → 21.32 · mobile 16.19 → 17.56 · unthrottled 22.43 → 20.54 ·
webkit 25.28 → 23.74. `tainted:false` in every window; none excluded.

**The fix's own risk is refuted in all four regimes: the GameGallery chunk appears before
board-ready in 0 of 20 cured windows** (5 chromium Fast-3G desk, 5 mobile, 5 unthrottled,
5 WebKit). The rejected load-only cut put it inside the first board's freight on WebKit 5/5;
the shipped two-condition gate does not. The +1 request is the `app-shared` modulepreload, and
the boot burst's names are otherwise the same five in both arms.

### 3b. the repair's own mark — when the warm lands, with no intent at all
`warm-when.mjs`, cured arm, chromium 4× · Fast-3G · cold · 1280×800 dpr1, 3 windows,
vm.loadavg 23.45 → 25.69:

    ready 1466 | chunk start +158  in hand +379
    ready 1445 | chunk start +144  in hand +361
    ready 1413 | chunk start +140  in hand +359

Verify r1 read, on the unfixed build, start **+800 ms** and in hand **+1,550 ms**. The author
reports +86…+135 / +290…+310 at loadavg 12–18 and +134…+168 / +351…+384 at loadavg 30; mine sits
inside that band at loadavg 23–26. **The cold window after board-ready narrows from ≈1.6 s to
≈0.37 s.** Reproduced, outside spread, in the direction claimed.

### 3c. the first deck open (verify r1 finding 5a's own instrument)
`first-open.mjs`, chromium 4× · Fast-3G · cold · 1280×800 dpr1, 5 windows per arm interleaved,
press at board-ready +105…133 ms, vm.loadavg 19.48 → 17.14:

    base  openMs 1052.3 1068.9 971.3 972.6 1118.1   median 1052.3  (971.3–1118.1)
    cured openMs 1157.8 1329.6 1400.3 1468.7 1429.3 median 1400.3  (1157.8–1468.7)
    delta +348.0 ms, NON-OVERLAPPING 5/5   (author: +297.9; verify r1 on the unfixed build: +412)

Pressed 400 ms after board-ready, 3 windows per arm interleaved, vm.loadavg 25.49 → 22.08:

    base  375.2 307.6 369.0  median 369.0      cured 416.6 372.7 307.8  median 372.7
    delta +3.7 ms — INSIDE SPREAD, LEVEL   (verify r1: level only at a 3,000 ms delay)

So the fix did what finding 5a asked — the level-crossing moves from 3 s to 400 ms — and the
adversarial press at the first possible moment still pays. See §5a.

### 3d. board-ready — printed, not claimed anywhere

| regime | base median (min–max) | cured median (min–max) | delta |
|---|---|---|---|
| chromium 4× Fast-3G cold desk dpr1 | 1,435.1 (1,411.2–1,494.4) | 1,401.7 (1,361.9–1,440.0) | −33.4 ms, arms overlap |
| chromium 4× Fast-3G cold mobile dpr3 | 1,401.9 (1,392.0–1,500.8) | 1,442.8 (1,348.6–1,480.0) | **+40.9 ms**, arms overlap — sign flipped vs the author, §5b |
| chromium 4× unthrottled cold desk dpr1 | 452.0 (379.4–468.5) | 416.7 (302.2–438.9) | −35.3 ms, overlap — NO REGRESSION |
| webkit unthrottled cold desk dpr1 (PROXY) | 314 (255–499) | 291 (247–498) | −23 ms, overlap |

Every row is inside spread on a host at load 16–26 with ten lanes live. Nothing claimable in
either direction, which is how the author booked them.

### 3e. the static boot graph — reproduces to the byte
`census-bytes.mjs` over both dists, entry js + blocking css + vue-vendor + animation-vendor +
app-shared: base 405,927 raw / 113,542 br / 130,511 gz; cured 375,246 / 106,860 / 122,354.
**−6,682 B brotli, −8,157 B gzip** — the author's figures exactly, and the gzip delta agrees with
the measured wire delta (−8,174 B) to 17 B.

## 4. π

- Goldens: `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4257 npx playwright test --config
  playwright-golden.config.ts` — **4 passed, exit 0**, never `--update-snapshots`; `git status`
  clean afterwards, so no baseline moved. Pose count 4 (grid corner light, toggle crest dark,
  logo wordmark light, single given cell light).
- `filterBudget` **9** — the file is not in either diff, `lint:motion` exit 0, `filter-census`
  green on the cured dist both engines.
- Fold, A7 instrument, chromium 4× warm unthrottled 1280×800 **dpr2**, cycles 2, 3 interleaved
  invocations per arm, vm.loadavg 39.54 → 18.85 (`r2-fold-summary.txt`): entry cycle 0 bakes
  **8/8/8 in BOTH arms**, long33 2/2/2 both, long50 2/2/2 both, worst median base 90.9 / cured
  90.3, longtask max 51–63 base / 52–58 cured. Every other leg 4/4/4 bakes, long33 1/1/1.
  Animation census keys identical arm to arm, `opacity@game-gallery` included. **Verify r1's
  12-bake cured window did not recur** — 5c is settled as the host. The charter's π obligation
  holds: no long frame attributable to the chunk's evaluation.
- CSS, parsed from the shipped sheets: base 1,069 blocks / 1,069 braces / 1,622 semicolons;
  cured 1,069 / 1,069 / 1,622. Total CSS 96,901 B base vs 96,902 B cured; the blocking sheet
  drops 93,735 → 82,734 B and the 11,002 B lands in `GameGallery-BgPLkE_ckPqR.css`.
  **No CSS rule dropped.**

## 5. Findings

**5a — NAMED, NOT BLOCKING. The residual first-open cost is real and reads LARGER on my host.**
+348.0 ms, non-overlapping 5/5, chromium 4× cold Fast-3G 1280×800 dpr1, press at board-ready
+105…133 ms (author +297.9). It is irreducible inside this cure: the press lands within a few ms
of the warm either way, so buying it back means fetching the deck BEFORE board-ready, which is
the number C10 owes. The repair did move the finding's number (warm +800 → +150 ms; in hand
+1,550 → +370 ms; level from 400 ms instead of 3,000 ms), and the author claims nothing else.
The row must ride into 8.3 and into W7's idle-vs-intent ruling, and C10 must never be written up
as having cured the first open.

**5b — A CLAIMED SIGN THAT DOES NOT REPRODUCE.** `numbers[8]` (board-ready, chromium 4× Fast-3G
cold 390×844 dpr3) is booked "−35.4 ms, 4/5 windows clear". My 5/5 interleaved read is **+40.9
ms**, arms overlapping heavily both times. No claim fails — the row is correctly marked
`insideSpread: true` / NOT CLAIMED — but the −35.4 ms figure should not be carried forward as a
number in either direction.

**5c — THE LOTTERY, CONFIRMED FROM THE OTHER SIDE.** `numbers[2]`'s median (−10,794 B,
unthrottled) is a draw, not a statistic: my 5 cured windows rolled livegen 5/5 and read
**−13,106 B**. The return's own 5b restatement says exactly this and is correct — `useSudoku`
rolls the tier uniformly and only 9×9 HARD is `bank`. The honest statement stands: **−8,174 B
always** (the split), plus ≈4,624 B on the two thirds of deals that roll livegen, on links fast
enough for the bank to land before ready. On Fast-3G the bank lands after ready in both arms
(0/5 both viewports, both arms) and only the constant applies. The per-row `delta` fields for
the unthrottled and WebKit arms should carry that sentence, not a median.

**5d — NIT, no number.** `App.vue:407` hard-codes `".board-group .board-cells .game-cell"` while
`src/games/shared/constants.ts:8` exports `BOARD_CELLS_CLASS` for that class. A rename would
drop the warm silently to the 3,000 ms backstop with no gate reporting it. The risk is small —
those classes are asserted by eight e2e specs — but the coupling is unguarded.

**5e — A CHARTER CLAUSE MET BY REGIME, NOT BY AN ABLATED PAIR.** "Each split ablated against a
rebuilt pair before it's credited": the two splits are separated by regime rather than by a
dedicated pair — the gallery + app-shared split is isolated on Fast-3G, where neither arm
fetches the bank (−8,174 B constant), and the tier split on the unthrottled and WebKit arms,
where base fetches the bank 5/5 and cured 0/5 and 3/5. `census-splitA.jsonl` in the cure dir is
round 1's split-A census. Named, not blocking.

## 6. Gates, bare, in the worktree (exit codes read from `$?`, never through a pipe)

    npm run test:unit          exit 0   Test Files 66 passed (66) · Tests 810 passed (810)
    npm run lint:eslint        exit 0      npm run lint              exit 0
    npm run lint:knip          exit 0      npm run lint:motion       exit 0
    npm run lint:boundary      exit 0      npm run lint:copy         exit 0
    npm run lint:tdz           exit 0      npm run lint:live-regions exit 0
    npm run typecheck:e2e      exit 0      npm run typecheck:node    exit 0
    golden battery (:4257)     exit 0   4 passed
    e2e gallery set (:4257)    exit 0   128 passed — gallery, gallery-deal, gallery-guard,
                                        spoken-gallery, board-covisibility, chromium + webkit
    e2e surface set (:4257)    exit 0   24 passed — filter-census, visual-regression,
                                        theme-bake-freshness, both engines

ONE FLAKE, reported: the FIRST run of the gallery set on the cured arm failed
`gallery.spec.ts:145` (chromium) — `.gallery-live` read "9×9 easy, new game" where the spec wants
"board dealt", a 10 s deal-announcement timeout. It is deal latency on a loaded host, not the
chunk: the spec re-ran clean 3/3 in isolation on BOTH arms, the full set then ran 128/128 on the
cured arm at vm.loadavg 57.85 and 128/128 on the base arm at vm.loadavg 49.07.

## 7. The must-nots, one by one

- Booked as a readiness cure on a fast link? **No** — every readiness row is inside spread and
  unclaimed, and my unthrottled read (−35.3 ms, overlapping) agrees.
- A CSS rule dropped? **No** — 1,069 / 1,069 / 1,622 in both arms (§4).
- `solver.worker` modulepreload moved? **No** — present in both `index.html` heads and fifth on
  the boot burst in both arms' before-ready resource lists.
- Font preloads stripped? **No** — three preloads in both heads; the same four font requests
  (including the duplicate `fraunces`, C07's ground) in both arms.
- A bake dropped, a boil thinned, a filter removed, a transition shortened, a DPR lowered, a
  `cacheKey` theme-stripped? **No** — §1, §4.
- Anything from the REFUSED or REFUTED lists? **No.**

Servers on 4256/4257 were killed at the end of this set and `dist-verify` removed. No product
file was edited, nothing was committed, the worktree stands at `db43df48`, clean.

## 8. What is banked here

`r2-freight-*.jsonl` — the four interleaved freight sets (§3a, §3d), one row per window. For the
wave's text cap the raw `names` array is folded to `fonts` (a count of the woff2 requests) plus
`nonFont` (the rest, content hashes stripped); nothing else is touched, and every claim in §3a
— gallery 0/20, bank per window, worker on the burst — is read off `nonFont`.
`r2-warm-when-cured.jsonl` (§3b) · `r2-first-open-fast3g-desk.jsonl`
and `r2-first-open-delay400.jsonl` (§3c) · `r2-fold-summary.txt` (§4, raw jsonl dropped for the
cap; the remint command is in its head) · `load-*.txt` — `sysctl -n vm.loadavg` at both ends of
every set.
