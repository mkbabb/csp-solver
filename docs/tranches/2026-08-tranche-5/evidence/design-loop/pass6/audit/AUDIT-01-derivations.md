# PASS-6 NON-AUTHOR AUDIT — the derivations, each re-run rather than quoted

Host darwin · node v26.0.0 · npm 11.12.1 · vite 8.1.4 · @playwright/test 1.61.1.
Tree `abe533c4` + the pass-6 working diff (25 tracked files, `pass6/` untracked).
No git state changed. Ports 4247–4255 only, killed at close; `:3000` never served by this audit
(see §11 for the one thing that touched it and what it proves).

---

## 1 · THE ARTIFACT — one build, reproduced from source by a non-author

```
vite build (scratch outDir; web/frontend/dist never written — D6-G3's hazard)
  HEAD  assets/index-Cwxgaa3tBBf6.js   md5 920d107124c343e87452c4f23b0a62ad   223.34 kB / gzip 85.16
  HEAD  assets/index-C80OgcLmoEAG.css  md5 1e578fcf01db5d2172bc6ce4db7b5801    77.16 kB
  HEAD  manifest (39 files, md5 over the sorted per-file md5s)  3d482bd700e4fc69b1bbff4f9ea4d960
  BASE  assets/index-BNMQu01IbxTY.js   md5 eee2d245c9d813a42507c456d4473484   (git archive abe533c4, clean)
```

LAND's banked archives verify and their payloads are byte-identical to these builds:

```
pass6/land/rig/dist-head.tar.gz  md5 35ef8bc91e786fd406802cc35754945c (matches its manifest)
                                 39 files · entry index-Cwxgaa3tBBf6.js md5 920d107124c343e87452c4f23b0a62ad  ← identical
pass6/land/rig/dist-base.tar.gz  md5 e2da34bd304a6ef25b5ba24e396f4f08 (matches its manifest)
                                 39 files · entry index-BNMQu01IbxTY.js md5 eee2d245c9d813a42507c456d4473484  ← identical
```

`index-BNMQu01IbxTY.js` is also the artifact lanes A and BC name as their base. **Pass 6 is
single-artifact and the artifact is reproducible from source** — F3-G5's order, discharged.

## 2 · THE FOUR PASS-4 NUMBERS

**(a) toggle-crest-dark 6/11 · 5/11.** Independently counted, not by re-running D's rig: a grep
for the `golden · toggle crest (dark, moon)` row over the three banked pass-4 Lane-D logs returns
**6 `✓` · 5 `✘`** (`gates-golden-AFTER-r1r2r3` 1/2 · `gates-golden-AFTER-r4r8` 4/1 ·
`gates-FINAL-e2e` 1/2). D's rig re-run separately reproduces its whole table. **CONFIRMED.**

**(b) The pre-settle 21.** Re-measured on my own sampler (init-script rAF poller installed before
the first page script; peak and settled floor both reported; 393×699 dpr3 coarse), **12 cold
contexts** — 3 runs × 2 engines × BASE and HEAD dists:

```
BASE chromium  21 / 21 / 21   (peak t 455-466 ms)   settled 9/13
HEAD chromium  21 / 21 / 21   (peak t 462-477 ms)   settled 9/13
BASE webkit    20 / 20 / 20   (peak t 100-102 ms)   settled 9/13
HEAD webkit    21 / 21 / 21   (peak t 466-508 ms)   settled 9/13
```

Chromium's 21 decomposes element-for-element to `filterBudget.ts`'s own arithmetic (2 `g` ·
3+1 `boil-pose` · 3+1 `logo-pose` · 6+2 `svg.rest-pose` · sparkle · two toggle icons = 21).
**CONFIRMED, and extended**: nothing reads above 21 on either dist, so D's gating trigger still
does not fire; and the head's webkit boot window lengthens enough to admit `svg.sparkle-icon`,
moving webkit 20 → 21 — a fact D could not have had, since D measured base only. The settled
floor is **9 / 13 identical base→head, both engines** (the quantity 9c watches).

**(c) 310 e2e insertions.** `git --numstat` over the **five** pass-4 Lane-A commits:
`94ce993e` gallery-deal +181/−8 · `c6eda619` filter-census +123/−0 · `3969f512` font-census +6/−0
= **310 insertions, 8 deletions, churn 318**; src across the same five (`236d22fe` 30+17,
`2708716e` 23+8, `c6eda619` 4) = **82**; 310 + 82 = **392**. **CONFIRMED in all three columns.**

**(d) 88.58 — the correction of the correction.** Two independent instruments agree:

```
pass4/logs/F3/masthead-844x390.log line 2   boardBottom 478.58 − vh 390 = 88.58   (chromium head)
pass4/logs/F3/masthead-844x390.log line 4   boardBottom 477.98 − vh 390 = 87.98   (webkit head)
this audit, fresh build of abe533c4, 844×390, `.board-wrapper` bottom − 390:
   chromium 88.58   webkit 87.98      `.board-cells` 86.58 / 85.98   `.board-shell` 119.06 / 118.43
```

**CONFIRMED to the hundredth on both engines, third time of asking, first time by a non-author.**
The pass-4 registry's **90.58 / 89.98 is +2.00 on both engines** and reproduces at no referent.
Pass 5's F3-G2 is the party in the right.

## 3 · THE FOLD, RE-MEASURED ON MY OWN RIG (`rig/audit-fold.mjs`)

Nine cells, both engines, base and head, minimal independent schema:

| cell | BASE c/w | HEAD c/w |
|---|---|---|
| **390×664 THE CASE** | 1.705 / 1.703 | **1.000 / 1.000**, maxScroll **0** |
| 390×844 · 375×812 · 430×932 · 820×1180 | 1.341/1.340 · 1.401/1.400 · 1.258/1.258 · 1.212/1.211 | **1.000** each |
| 844×390 landscape | 2.882 / 2.882 | 2.631 / 2.631 |
| 1280×800 · 1440×900 | 1.013/1.011 · 1.000/1.000 | **unchanged** |
| 390×844 fine NEG-CTRL | 1.177 / 1.175 | 1.000 (moves by design) |

Fold census at the case cell, head: masthead ends **132.22** chromium / **131.63** webkit · board
**362×362** · reserved line **20.80** (rect; `offsetHeight` 21) · `#fold-tools` **366×55.75** with
undo/redo/hint **44×50.16** and the peek chip **56.36×44**, all four IN the fold · tongue **92×48**
at y 616 · `docScrollH ≡ innerHeight`. Open: sheet top **216**, height **448**, interior scroll
**55**, and the board's rect is `{14, 132.22, 362, 362}` **before, open and after** (webkit
`y 131.63`, likewise). Landscape head: `.board-wrapper` clears the fold by 10px (LAND publishes
the clamped `overflow 0`), `.board-shell` overflow **20.48 / 20.45**, chrome above board **16**,
**cell width 40.22 base and head** — the ratified rung is untouched to the hundredth.

Every LAND figure I could re-derive, re-derived to the hundredth. Two spec-vs-landing deltas went
unstated: the apotheosis expected sheet top ≈184 and "~52 px of grid"; the landing measures **216**
and **~84 px** (216 − 132.22 = 83.78). Both are in the design's favour; neither is flagged.

## 4 · BORN-RED, RE-FIRED — every gate ablated by a non-author in a scratch tree

The scratch tree is `git archive abe533c4 | patch -p1 < (git diff HEAD)`; it rebuilds
`index-Cwxgaa3tBBf6.js` **byte-identical** (md5 920d1071…), so the ablations are one term off the
audited artifact and nothing else. Every source file restored and md5-checked against MAIN after
each probe.

| gate | ablation | result |
|---|---|---|
| **covis bound** (pass-5 F3 / pass-6 LAND) | whole landed design absent (base dist) | **RED 8/16**, case row 1.705/1.703 vs ≤1.0 |
| **covis bound — vacuity** | ONE term: portrait `.scene-controls` `position: fixed` → `static` | **RED both engines, 1.616 / 1.618** |
| **mark-6 reserved-line floor** | `MarginNote.vue` `min-height: 1.3em` → `0` | **RED both engines**, silent read 0 vs ≥16 |
| **BC pair floor** | shared `(pointer: coarse)` `2.75rem` → `2.5rem` | **RED both engines**, `chip "4×4" height 40 < 44`; 4 of 20 zone-grammar rows |
| **census FORWARD** | one real LEDGER row struck | **RED both engines**, "unledgered mixed-face strings" |
| **census BACKWARD** | one LEDGER row nothing can render | **RED both engines**, "ledger rows no cell produced" |
| **D closure 4** | `.margin-note-meta` repointed off its rung | **exit 1**, "ship-4 surface 4 … off the rung"; green arm exit 0; restored exit 0 |
| **A `heldHits`, built dist** | pattern reverted to pass-4's `/futoshiki\/spec/` | **RED both engines**, `Expected > 0 · Received 0` |
| **A `heldHits`, dev harness** | same ablation | **GREEN 2/2** — the harness blindness, reproduced exactly |
| **evidence-policy rule 4** | one grandfather pin struck (`pass3/dist-head`) | **exit 1**, `dist-loose: 1`; with `--self-test` **22/22 PASS and still exit 1** |

The covis row's two in-run controls execute inside the green arm and would throw if the probe
could not see a scroll (300 px spacer → >1.0) or if striking the band left verbs standing.

## 5 · OPTION B, RE-MEASURED (`rig/audit-stall.mjs`, webkit 1280×810 DPR2, open/close/open ×3)

Provenance first: the published `@mkbabb/pencil-boil@0.11.0` `src/{vue,raster}.ts` are
**byte-identical to upstream `f8ab8b7`** (md5 `e2090bd4…` / `7bdae6ea…`), so BC's "restored to the
0.11 shape by file copy" is exact. The AFTER arm is `3f41141`'s two files. Isolated
`node_modules` so MAIN's is never touched; the restore control rebuilt BEFORE byte-identical.

| | BEFORE (0.11.0) | AFTER (0.12 candidate) |
|---|---|---|
| encodes per gesture (3 reps) | 4,8,8 · 4,8,8 · 4,8,8 | **4,8,0 · 4,8,0 · 4,8,0** |
| pure cache-hit gestures | **0 / 9** | **3 / 9** |
| blocked on an 8-encode gesture | 244 – 294 ms | 257 – 279 ms (cold, unchanged) |
| **blocked on a hit** | — | **0 ms, every one** |
| object-URL revokes / mints per page | 64 / 80 | **36 / 64** |
| **payload identity** g1 vs g3 | true | **true** — g3 is a measured 0-encode hit and its live-DOM blob payloads hash equal to g1's fresh encodes |

**SUSTAINED.** Byte identity is read by fetching every `blob:` `<img>` back off the live DOM and
hashing the bytes, so a re-encode to a fresh URL could not pass. Limits, stated: Playwright's
WebKit is not real Safari (absolute ms do not transfer; counts and within-session deltas do), and
the isolated `node_modules` inlines pencil-boil into `index` instead of the `animation-vendor`
chunk — **both arms share that**, and the arm-to-arm delta is what is claimed. The 792↔794 wordmark
jitter (BC6-G1) did not surface in 3 reps; that neither confirms nor refutes an intermittent.

## 6 · THE CONTENTION FLAKE CLASS — a rate, bounded

Full-suite default e2e (279 tests, 9 workers) on the **settled head artifact** only:

```
LAND sweep 4     279 / 279   0 red
LAND final       278 / 279   1 red — affordances.spec.ts:155  webkit
audit sweep 1    279 / 279   0 red
audit sweep 2    278 / 279   1 red — font-census.spec.ts:207   chromium
audit sweep 3    279 / 279   0 red
```

Adding pass 5's head sweep (270/271, affordances:155 webkit) and the W3 seal pin (CI run
30734036107: attempt 1 17/18 futoshiki solve timeout, same-SHA attempt 2 18/18):

- **run level — 3 of 7 settled-tree full-suite runs carry exactly one red: ≈43%** (2/5 = 40% on
  the pass-6 artifact alone; binomial 95% CI ≈ 16–75%, so this is a BOUND, not a point estimate).
- **execution level — 3 reds in ~1,940 executions ≈ 0.15%**, i.e. ~1.5 per 1,000.
- **signature — never the same row twice, and never two in one run**: four distinct rows across
  four files and both engines (affordances, futoshiki solve, font-census, plus pass 5's control
  arm which red *a different and larger* set). Every instance is green alone: affordances 20/20
  (LAND), font-census **24/24 over 6 isolated reps** (this audit).

That is worker contention, not a flaky row, and it is estate-wide rather than owned by any spec.

**W1.6 disposition, recommended.** **No retry grant on `playwright.config.ts`.** Three reasons:
(1) W1.6's own law — under `failOnFlakyTests` a retry buys a second *observation*, never a green —
so a grant would cost runtime and change no lane's colour, and the observation is already banked
here; (2) the mechanism is contention, so the honest lever is **workers**, measured against this
rate, not attempts; (3) any grant must be a NAMED census row in `check-pw-retries.mjs` with class
and reason PLUS `failOnFlakyTests: true` on the default config — nobody has priced that, and
`test:e2e:retries` (green here) already makes a *silent* retry impossible. Concrete ask: book the
class in the chronic ledger with the rate and the row roster above; change nothing else without a
measurement.

## 7 · GATES WALKED ON THE ONE ARTIFACT, BY A NON-AUTHOR

`default e2e` **279/279 · 278/279 · 279/279** (the one red flake-classed, §6) · `built-dist lane`
all six projects **39/39** · `goldens` **4/4** with `golden:bytes` **PASS** (8 goldens, 99.0 of
110.0 KB) and `git status --porcelain e2e/goldens/` **empty — nothing re-baselined, nothing
minted** · `vitest` **445/445, 41 files** · `covis` **16/16** · `zone-grammar` **20/20** ·
`font-census` **4/4** · and exit **0** from every one of `test:unit`, `vue-tsc -b --force`,
`lint`, `lint:eslint`, `lint:boundary`, `lint:knip`, `lint:ink`, `lint:catch`, `lint:tdz`,
`test:support-floor`, `test:e2e:projects` (21 specs, 322 resolved tests), `test:e2e:retries`.
`check-evidence-policy.mjs` **PASS** with this audit's own bank in place.

## 8 · THE STALE LEDGER — the checklist's one material hit

The masthead move landed in `App.vue` and its own docstring is honest. Two other sites are not,
and neither was restamped by the pass that falsified them:

- `src/games/shared/GameBoard.vue:225-278` — *"844×390 measures 114.58px, of which the MASTHEAD is
  98.58 — hand back 88.58 of it and the shipped rung is whole above the fold."* At head: chrome
  above board **16**, masthead **41.80 × 155.66**, overflow **0**, whole-above-fold **TRUE**. The
  hand-back it prices is the thing this pass bought.
- `e2e/board-covisibility.spec.ts:470-490` — *"the masthead (98.58 of the 114.58 above the board at
  this cell) … **Measured on this pass's build**, both engines, shipped rung: 88.58 chromium /
  87.98 webkit … The bound is 114.58 … with the shipped rung sitting 26px under it."* At head the
  same read is **0 / 16 / 16 under**. This file is +130/−3 in the pass-6 diff, so the paragraph was
  in hand while it went false.

The row still passes and its two controls still bite (`100dvh` rung overflows more and still
clears; the bare tree overflows ~392 against 16 and reds). What is dead is the SHIPPED arm's
discriminating power: `overflow ≤ chromeAbove` is now `0 ≤ 16`, satisfied by any non-negative
chrome. Same family as the 88.58 error that cost this loop three passes.

## 9 · SMALLER RE-DERIVATIONS

- **A's reconciliation.** `.guard-note` padding `0.75rem 0.85rem 0.9rem`; 0.85 × 16 = **13.60**;
  45.33 − 31.73 = **13.60** and 45.34 − 31.74 = **13.60**. The referent explanation holds.
- **BC's "FOUR, not three".** Each selector resolves to exactly one component: `.ctrl-btn`
  → `OptionSelector.vue`, `.mobile-heading-btn` → `GameControlPanel.vue`, `.attribution-trigger`
  → `AttributionCard.vue`, `.error-note-retry` → `SolverErrorNote.vue`. **Confirmed.**
- **D6-G4's 29 / 25 / 4.** Filesystem walk: **29** banked `dist`/`dist-*` directories, **25**
  holding ≤2 files, **4** full; **2** archives, **2** md5 manifests. The pass-5 adjudication's
  "23" is wrong and D's correction is right. **Confirmed.**
- **D6-G1's seven — and three more.** `prettier --check scripts/` reds **7** files under
  `web/frontend/scripts/` (exactly D's list) and a **different 3** under the repo-root `scripts/`
  (`check-doc-truth`, `check-evidence-policy`, `ledger-diff`) — **10 across two directories**. The
  repo-root set is identical at `abe533c4` and at head, so D's "pre-existing, none of them Lane D's"
  holds even for the file D itself edited (+344). The row's substance is right and its scope is
  understated by naming one bare path.
- **DELTA.** 14 crops, **457,263 B** total, largest **61,019 B** against the 150 KB ceiling.
  Confirmed by `ls`.
- **The LOC citation.** LAND's "src +777/−251, tests +465/−88 across 25 files" double-counts:
  `GameControlPanel.test.ts` (+59/−13) is inside BOTH figures, and "25 files" is the whole diff
  including 3 doc restamps, `PRECEPTS.md` and `check-evidence-policy.mjs`. Re-derived:
  **src non-test +677/−210 (10 files) · colocated tests +100/−41 (3) · e2e +406/−75 (7) ·
  docs+scripts +373/−10 (5)**.
- **`shots/case-390x664-AFTER-*.png`**, cited at LAND §3, **do not exist** — the shots directory
  holds `case-fold-band-*` and `case-open-seam-*`. The substance is independently confirmed here on
  the live head dist: margin line `a fresh 9×9 — needs a naked single`, tally aria-label
  `difficulty — needs a naked single (1 of 5)` (LAND quotes a hidden-single deal; the deal is
  random per load and the technique tracks it).
- **AUDIT prepends.** Present on every A, BC and D log and on every LAND log except
  `build-BASE.log` / `build-HEAD.log` (bare vite output) and the two server logs.

## 10 · PORTS, AND A CLAIM THAT DOES NOT HOLD

Lane BC §7: *"Ports: 4243 … and 4245 …, both killed at close."* Both are still LISTENING at audit
time — `node serve.mjs 4243` (started 03:25:39) and `vite preview --port 4245 --strictPort`
(03:43:35). Lane A's `:4252` is genuinely gone, as its report says. A stale `vite preview` holding a
lane port with an old dist is precisely D6-G3's hazard and A's own `assert-the-SPA is tree-blind`
trap, standing in the shared band six hours after its lane closed.

## 11 · ONE TRAP RE-WITNESSED

This audit's dev harness was started `vite --port 4251 --strictPort`, and the process bound
**`[::1]:3000` as well** — `vite --port N` does **not** move the HMR socket off the pinned
`server.port`. That is K46's mechanism and it corroborates lane A's two new `PRECEPTS.md` §3 rows
from the outside. Killed on discovery; the foreign `:3000` squatter (pid 48206, not this audit's)
was never touched.
