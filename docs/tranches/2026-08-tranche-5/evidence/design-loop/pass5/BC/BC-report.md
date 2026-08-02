# LANE BC — THE DRAWER ESTATE · pass-5 dossier (T5-W4b)

Tree: **MAIN**, base `66fa5856` ("T5-W3 record"). **Nothing committed, nothing pushed, nothing
deployed** — the lane's diff sits in the worktree for the team lead.

**THE WORKTREE IS SHARED.** Lanes A, D and F3 are editing this same checkout in this same
session: `git status` at my close carries their in-flight changes to `gallery-deal.spec.ts`,
`board-covisibility.spec.ts`, `check-ink-pressure.mjs`, `DifficultyTally.vue`, `GameBoard.vue`,
`GameControlPanel.vue` (**−149 code lines** — not mine), `StagingBand.vue` and `filterBudget.ts`.
Every figure below is therefore a snapshot of a moving tree, not of a commit, and the LOC ledger
(§6) is scoped to Lane BC's three files so it cannot annex another lane's work.

**My fence, and all of it:** `e2e/zone-grammar.spec.ts`, `e2e/font-census.spec.ts`,
`src/pencil/chrome/OptionSelector/OptionSelector.vue` (**prose only**), plus this evidence dir.

Ports: **:4241** (static rig server, HEAD dist), **:4242** (static rig server, P1-base dist),
**:4238** (my own vite dev server for the e2e runs). All three torn down at close. `:3000` was
found OCCUPIED by the foreign palette-api and never addressed; `:3001`, `:4288`, `:4188` never
touched.

Artifacts:
```
pass5/BC/rig/stall5.mjs           the drawer-open bake instrument (playwright-webkit, built dist)
pass5/BC/rig/plot-timeline.mjs    the DELTA timeline crops
pass5/BC/rig/census-scope.mjs     the measure-first probe for the census widening
pass5/BC/rig/deal-headroom.mjs    BC-M3's arm
pass5/BC/rig/loc-strip.mjs        THE STRIPPER, named, committed beside the ledger it makes
pass5/BC/rig/dist-head/           the measured dist (index-C5xqWLHq1mLl.js, md5 2b16a65d…dca65)
pass5/BC/runs/*.jsonl             22 stall reps across 5 arms + 2 deal-headroom arms
pass5/BC/attrib-table-pass5.txt   the folded stall table
pass5/BC/shots/timeline-*.png     5 timeline crops, 21–23 KB each (policy ≤150 KB)
pass5/BC/logs/                    every gate and probe run banked
```

---

## 1 · THE ~280 ms WEBKIT DRAWER-OPEN STALL — **NOT CURED. This is a FINDING.**

The W4b charter adopted pencil-boil **0.11.0**'s `rasterizePoseToBlob()` as the cure for the
drawer-driven raster re-bake and ordered the rig measurement that closes the row. The
measurement was taken. **The row does not close.** The library cure is real, it is adopted, it
deleted exactly what it said it would — and the stall is still there, in the same class, at the
same cell.

### 1.1 · The cure is genuinely in the shipped path (measured, not read)

`stall5.mjs` counts every bake-path API by patching it before any page script runs. On the
shipped arm, across four gestures:

| API | pass-3 attribution (real Safari 26.4, desktop) | pass-5 shipped arm (this rig) |
|---|---:|---:|
| `createImageBitmap` | 79–82 ms · 4 calls | **0 ms · 0 calls** |
| `convertToBlob` (OffscreenCanvas) | 87–95 ms · 4 calls | **0 ms · 0 calls** |
| `canvas.toBlob` (0.11's single encode) | — (did not exist) | 1695–1740 ms wall · 8 calls |
| `drawImage` (the filter raster) | 0–2 ms | **1–5 ms** |

Zero calls to both deleted APIs is a **measurement**, not an inference from the source: the
counters are installed and armed, and the ablation arm below drives them off zero in the same
session. `node_modules/@mkbabb/pencil-boil@0.11.0/src/raster.ts:222` confirms the shape —
`encodeCanvas(await capturePoseCanvas(...))`, one surface, no bitmap copy.

### 1.2 · And the gesture still blocks the main thread for ~290 ms

1280×810, **DPR 2** (pass 3's desktop cell: 1320² grid + 792×234 wordmark), sudoku 9×9 EASY,
drawer landed CLOSED, settled 2.2 s, then tapped open. Four reps:

| arm | worst rAF gap | blocked ≥50 ms in the first 600 ms | pose bakes |
|---|---:|---:|---:|
| **shipped** (HEAD dist, 0.11.0) | **298 / 286 / 294 / 293 ms** | **298 / 286 / 294 / 293** | 8 |
| **pin** — board + wordmark size pinned | **14 / 14 / 13 / 14 ms** | **0 / 0 / 0 / 0** | **0** |
| `pinlogo` — grid bake only | 269 / 289 / 304 | 269 / 289 / 304 | 4 |
| `pinboard` — wordmark bake only | 59 / 41 / 40 | 59 / 0 / 0 | 4 |
| `ablate` — the deleted round trip put back | 141 / 378 / 396 / 593 | 141 / 378 / 396 / 117 | 8 |

Statistics are **defined in the rig**, not inherited: `worstGapMs` is the largest rAF delta in
the 900 ms window after the click; `blocked600` is the SUM of gaps ≥50 ms inside the first
600 ms. Pass 3's own `blocked<600` estimator is published nowhere on disk, so nothing here is
offered as a re-print of it.

**The negative control fires, hard.** Pin the two surfaces whose size change triggers the
re-bake and the gesture costs **0 ms blocked, 13–14 ms worst gap, zero bakes** — with the glide,
the class swap and the layout change all still running. Apportionment agrees two ways: grid
re-bake ≈ 290 − 45 ≈ **245 ms**, wordmark ≈ **26–45 ms**, gesture floor ≈ **14 ms**. The bake is
still the entire bill.

### 1.3 · Where the residual actually lands — the decomposition

One rep's event trace, times relative to the click (`runs/p5-shipped-dpr2.jsonl`, rep 2, whose
single 286 ms gap ends at +323 ms):

```
+20..22   svgBlob ×8            the 8 pose captures are minted   (4 grid 19,300 B · 4 logo 5,608 B)
+40..188  drawImage ×5          1 ms each — THE FILTER RASTER IS STILL NOT THE EXPENSE
+313      toBlob ×4  792x234    283 / 273 / 266 / 259 ms   ← all four callbacks at the same instant
+314      toBlob ×4  1320x1320  252 / 189 / 126 /  63 ms   ← so do these
```

Eight PNG encodes run **back to back on the main thread** and every callback lands at +313/+314
ms; the earliest-called reads 283 ms because its latency spans all of them. **That span IS the
286 ms rAF gap.** The residual stall is the encode, and nothing else.

So the library cure removed **one** of the two halves pass 3 attributed. The half it removed
(`createImageBitmap`, 79–195 ms in real Safari) is gone for good and estate-wide. The half that
remains — the PNG encode, which pass 3 measured as `convertToBlob` at 87–112 ms and which 0.11
performs as `canvas.toBlob` — still blocks. **Necessary, not sufficient.**

### 1.4 · Honest limits, stated before anyone else has to find them

1. **This harness is not real Safari, and the difference is load-bearing here.** In
   Playwright-WebKit `createImageBitmap` costs ~**0 ms across 8 calls** (the `ablate` arm's own
   counter), where real Safari 26.4 charged 79–82 ms for four. **This rig therefore cannot
   price the cure's benefit** — only what survives it. The `ablate` arm restores the round trip
   and reproduces only its encode half, which is why its numbers are noisier (141–593 ms) and
   are reported as a spread rather than as a delta.
2. **Cross-harness milliseconds do not subtract.** Pass 3's 188–233 ms and this rig's 286–298 ms
   are the same CLASS at the same cell, not a regression measurement.
3. **DPR is the second axis and it was nearly a trap.** My first run took the DPR-1 default and
   read 110–118 ms — a number that would have flattered this tree by a factor of ~2.5 purely by
   encoding a quarter of the pixels. Banked as `p5-shipped-r1` beside the DPR-2 arm so the
   scaling is visible rather than tidied away.
4. **Real Safari corroboration is OWED, not taken.** Pass 3's route (`run-safari.sh`, osascript,
   frontmost enforcement) commandeers the owner's desktop; the charter named the
   playwright-webkit built-dist timeline and that is what ran. The row that would settle limit 1
   is: re-drive `shipped` and `ablate` in real Safari 26.4 at 1280×810 DPR2.
5. **`convertToBlob` vs `toBlob` may not be the same thread contract in every engine.** 0.11
   moved the encode from an `OffscreenCanvas` to the capture `HTMLCanvasElement`. Whether that
   forfeits an off-main-thread encode anywhere is UNMEASURED and is deliberately not asserted.
   It is the first question the upstream row should ask.

### 1.5 · DELTA timeline crops

`shots/timeline-{AFTER-shipped, BEFORE-ablate, CONTROL-pin, APPORTION-gridonly,
APPORTION-logoonly}.png` — same axes, median rep by worst gap (not the friendliest), rAF gap
curve with the bake events marked on the same time axis. 21–23 KB each.

### 1.6 · Verdict, and what it costs

**CH-61 / the ~280 ms drawer-open stall row: STILL OPEN.** The library cure is correctly adopted
and must not be reverted — it is pixel-identical by construction and it deletes a full copy from
every bake in the estate. It simply does not close this row. **No cure is invented here**, per
the charter. What the next lane inherits is a narrowed target: the surviving cost is one
serialized run of 8 PNG encodes triggered by a board re-fit, and pass 3's Options A (latch the
capture side, with its SSIM gate) and B (cache the stack per size) both still address it —
Option C, the one that shipped, was never the whole answer.

**CH-51 stays parked** (gallery-fold frame — different mechanism, its own trigger), untouched.

**CH-62 — decode-timing facts for the ubuntu-webkit blank-bake race, banked as ordered.** Not my
row to cure; three observations from this rig that bear on it: (a) the eight `svgBlob` mints land
at +20..22 ms but the first `drawImage` is at +40 ms and the last at +188 ms — the SVG-image
*decode* window is **up to ~168 ms wide** and is not synchronous with the mint; (b) all eight
encode callbacks land in a single ~1 ms cluster, so a consumer sampling between the mint and
that cluster sees a fully-empty pose set for ~290 ms; (c) `retainedPoseUrls`' null-window hold
is what covers that entire window — a bake race on a slower runner is a race against ~290 ms of
main-thread block, not against a fast async resolve.

---

## 2 · ORDER (1) — the pair branch's floor, gated where the branch exists · **CLOSED**

`e2e/zone-grammar.spec.ts`, new describe **"coarse row regime (≥1024)"** — the one `test.use`
that was missing (`viewport 1280×800, isMobile, hasTouch`).

The row asserts, in this order: the **regime witness** (coarse ∧ ≥1024 ∧ the rail is mounted)
before any number; a **vacuity guard** (the pair must actually render — `options.length === 2`
is the DATA's rule, so a future option-set edit could take the branch to zero and this row would
otherwise pass by measuring nothing); then **each `.options-pair` half ≥44 px in BOTH
dimensions**; then a **per-dimension negative control**; then a re-read proving neither control
leaked.

**BORN-RED, banked before the gate landed** (`logs/BC1-born-RED.log`):
```
Error: pair half "Off" width
  expect(received).toBeGreaterThanOrEqual(expected)
  Expected: >= 44    Received: 40
```

**And the first RED was the wrong one, which is worth keeping.** The first attempt read
`Received: 44` with the flex basis set to 40 px — because the 44 px floor is **not the pair's own
rule**. It is `assets/index.css`'s shared `(pointer: coarse)` block
(`.ctrl-btn { min-width: 2.75rem; min-height: 2.75rem }`, T4-P1's two-dimensional cure), and a
control that leaves it standing cannot push a half under the bar in either dimension. The
shipped controls now strip `min-width`/`min-height` first, and the reason is written at the
assertion site. That is the coupling BC-M1 asked to be made explicit: the pair's safety property
is inherited from a shared rule in another file, and nothing said so until now.

**Green:** `zone-grammar.spec.ts` **20/20** (chromium + webkit) — was 16, +2 rows × 2 engines.
`logs/BC1-green-zone-grammar.log`.

---

## 3 · ORDER (2) — the ledger both directions, the census widened on BOTH axes · **CLOSED, and it found something**

### 3.1 · Measure first (`rig/census-scope.mjs`, `logs/census-scope.txt`)

Before widening the gate, six candidate cells were censused with the spec's **own** `MIXED_FACE`
probe — lifted out of the spec file at run time and TS-stripped with the app's own esbuild, so
the probe cannot drift from the gate. A both-directions check whose cell set could not cover the
ledger would red on arrival and teach nothing.

### 3.2 · The finding: a one-game census was hiding a real defect

Widening to a second game surfaced **five unledgered mixed-face strings on the first run** —
KenKen cage targets: `3+`, `4+`, `7+`, `3÷`, `4÷`. Characterized to the codepoint:

> Patrick Hand's cut is `U+20-21, U+27, U+2d-2e, U+30-39, U+3f, U+43, U+52, U+53, U+61-69,
> U+6b-77, U+79-7a, U+d7, U+2014, U+2026`. Every **digit** is in it. `-` (U+002D) is in it.
> `×` (U+00D7) is in it. **`+` (U+002B) is not. `÷` (U+00F7) is not.**

KenKen's operator set is exactly `+ − × ÷` (`games/kenken/types.ts:19`), so **half the cage
operators have always rendered in the system fallback face, mid-label** — the target inks in the
hand and its operator does not — on every KenKen board and on the gallery's KenKen poster still
(`KenKenPoster.vue`, which draws every operator kind by design). Thirteen gates, four passes and
a shipped mixed-face census never saw it, because the census only ever looked at sudoku.

That is BC-M2's charge answered by demonstration rather than by argument: "the population cannot
grow silently again" was false when written, and the counter-example was one `game=` away.

**Disposition: LEDGERED, not cured** — same class and same reason as the 22 pre-existing rows
(the cure is a woff2 re-cut whose byte cost the owner declined at P1-W3). It joins the owner row,
it does not start a new one.

### 3.3 · The gate as it now stands

- **SCOPE PRINTED ON THE GATE.** `CELLS` = sudoku × kenken × {fine rail 1280×800, coarse card
  390×844} — a second game *and* a second regime, not one axis. Each cell witnesses its own
  pointer regime before it is censused, and every cell must see all three subset faces or it
  passes by finding nothing.
- **FORWARD:** no string renders mixed that the ledger has not accounted for, in any cell.
- **BACKWARD (new):** no ledger row survives that no cell can produce. Rows that genuinely
  cannot appear in this cell set are exempted **by key, individually, with the condition
  written** — `CONDITIONAL` holds exactly three: `Medium` and `Hard` (closed-tab values; every
  cell deals EASY) and `Ctrl` (the legend draws `⌘` on Apple platforms). The exemption is not
  blanket cover: each conditional row must still be ABSENT, so a row that starts rendering
  unconditionally loses its excuse.
- **ONE normalized key class, and it is fenced.** KenKen cage targets are generated per deal, so
  an exact-match row over the whole label would red on a puzzle rather than on a regression. The
  cage rows are keyed on the codepoint that falls out (`Patrick Hand|cage-op U+002B`). Everything
  else stays exact-match, and an in-run control asserts the pattern rejects `9×9`, `16×16`,
  `Off`, `Deal`, `3` and accepts `3+`, `12×`, `6÷`, `2-`.

**BORN-RED ×2, both banked** (`logs/BC2-born-RED.log`):
```
RED A (forward, widened): unledgered mixed-face strings
  + "kenken · fine rail 1280×800 — Patrick Hand|cage-op U+00F7 (text) misses U+00F7"
  + "kenken · coarse card 390×844 — Patrick Hand|cage-op U+002B (text) misses U+002B"   … 7 rows
RED B (backward): ledger rows no cell produced — retire them or state the condition
  + "Patrick Hand|Nonesuch-BORN-RED"
```

**Green:** `font-census.spec.ts` **4/4** (2 rows × 2 engines). `logs/BC2-green-font-census.log`.

---

## 4 · ORDER (3) — BC-M3 re-disposed with a banked arm · **CLOSED**

The order allowed either half: build the P1-base dist and measure, or strike the sentence.
**The dist was built and the sentence survives measurement.**

**How the arm was built, and its one deviation.** `git archive 6800af04 web/frontend` into the
scratchpad (read-only; no checkout, no worktree), `npm ci` against that tree's own lockfile
(**pencil-boil 0.10.1**, verified in `node_modules`), `npx vite build`. **Deviation, disclosed:**
`csp-solver/wasm/pkg` is not tracked in git at `6800af04` (only `src`/`tests`/`Makefile` are), so
the `file:` link was re-pointed at HEAD's built pkg. Deal's laid-out headroom is a layout
measurement and does not read the solver; that is why the deviation is acceptable and it is why
my artifact hash (`index-CVZsTqv3Zmrd.js`) differs from pass 3's recorded `index-CaReTGTNUG3O.js`.

**Method, re-derived from the only pass-3 artifact that survived.** The rig SCRIPT was never
banked; `pass3/rigB/out-deal-chromium.json` was. Every cell in it satisfies
`bandTop = innerHeight − 296` and `headroom = bandTop − dealBottom` with `dealBottom` read at
maximum scroll. Those two identities ARE the method, recovered from the data rather than recited.

| cell | **P1 base `6800af04`** | **HEAD (this tree)** | Δ |
|---|---:|---:|---:|
| **1440×900 fine** | **−12.83** chromium · **−12.48** webkit | **−16.28** · **−15.94** | **−3.45** · **−3.46** |
| 1280×800 fine | −44.83 · −44.48 | −71.94 · −72.61 | −27.11 · −28.13 |
| 390×844 coarse | +117.44 · +117.05 | +110.05 · +109.64 | −7.39 · −7.41 |

**Rulings, both directions:**
1. Pass 4's sentence — *"the desktop cells read negative in every arm **including the P1 base**"*
   — is **TRUE, and now banked**: the P1 base reads **−12.83 / −12.48** at fine-1440. The
   narration was right; it simply had no arm under it. It has one.
2. Pass 3's charge — *"B flips Deal's fine-1440 headroom **+18.47 → −10.28**"* — is **REFUTED on
   both numbers**. The base never read +18.47 at this cell; it read −12.5..−12.8, and the whole
   movement across every wave since is **−3.45 px**, not −28.75.
3. Pass 4's banked HEAD figures (**−16.28 / −15.94**) reproduce **exactly** on this rig at a tree
   four waves later — which is the cross-check that the method recovered above is the method
   that produced them.
4. Unchanged and re-stated: a 296 px soft-keypad band at a **fine** 1440 desktop is not a keypad
   cell. The number is reported, not banked as a regression.

---

## 5 · ORDER (4) — the minors

**(a) Counts corrected, re-derived at citation — and one of them had rotted twice.**

| pass-4 claim | audit's correction | **re-derived here** |
|---|---|---|
| "38 files in `logs/BC/`" | 39 | **39** (`ls \| wc -l`) |
| "+3 zone-grammar rows … −1 net" | +4 blocks, 0 removed | **4 added, 0 removed** (`git diff daca28ee 347826be -- e2e`) |
| "verified in all five `constants.ts`" | "there are **three**" | **BOTH ARE NOW STALE — there is ONE.** |

That last row is the interesting one. W2's distill left a single `constants.ts`
(`games/shared/constants.ts`), and the option bands the sentence was actually counting were never
in it — they live in `games/shared/selectors.ts` (`difficultyOptions` 3 · `subgridSizes` 3 ·
`latinSizes` 4 · `cagedLatinSizes` 3), with the two live-zone lists (`MODE_OPTIONS`,
`CHECK_OPTIONS`, 3 each) and the one binary (`CANDIDATE_OPTIONS`) in `GameControlPanel.vue`. The
**substance has held through all three readings** — exactly one binary exists estate-wide — and
only the count kept rotting. The re-worded comment says so, in those words, at the site.

**(b) The stripper, named and committed beside its ledger.** `rig/loc-strip.mjs`. Its rules are
printed in its own header (comment forms stripped; blank lines dropped; nothing else — no import
folding, no prettier), and its one known imprecision (a string literal containing `//`) is
disclosed there rather than left for the next auditor. It applies identically to both sides,
which is the only property a ledger needs from it. Ledger in §6.

**(c) B-5's coarse arm — landed, and it produced a finding of its own.**
`zone-grammar.spec.ts`, in the existing coarse describe: *"the heading lock holds on the CARD
too."* The lock **does not travel by copying the rail's selector**, and that is the row's
content: `.section-heading` marks **different elements in the two regimes**. On the rail it is
the `<h2>`; on the card the heading is `<h2 class="mobile-heading-head">` *wrapping* the section
tab (W3's APG disclosure shape — heading wraps button, so an H-key walk lands on the heading and
not inside a control) and `.section-heading` is the ink-bearing `<span>` inside that button. My
first run read `Expected "h2", Received "span"` and that was a **probe defect, not an estate
one** — recorded here because it is exactly the trap the next lane will hit. The arm asserts the
PROPERTY (heading element, non-hidden, non-empty accessible name, no hidden subtree holds a
heading), pins the card's shape so a silent flattening reds, and carries a negative control that
hides a heading's subtree and requires the probe to see it. The `<button>` inside the heading is
recorded, **not asserted away** — it is a11y r1's M9 and belongs to that wave.

**(d) "Five constants" re-worded** — see (a); the wording now names the file that actually holds
each band and dates its own correction.

---

## 6 · LOC — Lane BC only, `loc-strip.mjs`, base `66fa5856`

```
e2e/zone-grammar.spec.ts                                297 →  405   +108
e2e/font-census.spec.ts                                 138 →  212    +74
src/pencil/chrome/OptionSelector/OptionSelector.vue     107 →  107     +0
                                                                   NET +182
```

**Product code: +0.** The only `src/` change in this lane is prose. 182 lines of gate bought a
two-dimensional floor where the branch exists, a census that spans two games and two regimes and
reds in both directions, and a heading lock at the regime its author's arm could not reach.

---

## 7 · GATES

| gate | result | log |
|---|---|---|
| `vue-tsc --noEmit` | **0** | `logs/gates-vue-tsc.log` |
| `prettier --check` (OptionSelector.vue) | **clean** | — |
| `eslint` (my three files) | **0 errors** (`e2e/` is ignored by the config — noted, not worked around) | — |
| `e2e/zone-grammar.spec.ts` | **20 / 20** both engines | `logs/BC1-green-zone-grammar.log` |
| `e2e/font-census.spec.ts` | **4 / 4** both engines | `logs/BC2-green-font-census.log` |
| **FLOOR — `e2e/a11y.spec.ts`** | **30 / 30** | `logs/floors-a11y.log` |
| **FLOOR — `e2e/drawer.spec.ts` + `e2e/gallery-guard.spec.ts`** | **24 / 24** | `logs/floors-drawer-guard.log` |
| `npm run build` (HEAD dist for the rig) | green, `index-C5xqWLHq1mLl.js` | `logs/build-head.log` |
| P1-base build (`6800af04`, scratchpad) | green, `index-CVZsTqv3Zmrd.js` | `logs/p1base-build.log` |

The full default suite was **not** run to a banked number, and the reason is stated rather than
elided: three other lanes are mid-edit in this worktree (§header), so a suite-wide count today
would be a measurement of four lanes' half-finished trees attributed to one. The specs BC owns,
plus the floors, are run and banked.

**Floors: `options 5/5` (W3.3) and the `k-peek` guard (W3.4) were NOT run by this lane** — they
live in the picker and mobile specs that Lanes A and F3 are actively editing right now, and a
result from those files today is not attributable to anyone. `guardTitle`'s one-string floor is
covered by the 24/24 above. Nothing in BC's diff touches any of the three.

> **CORRECTION — 2026-08-02, pass-6 lane BC, per the pass-5 registry's BC5-G6 and the pass-6
> order to restate this against the sealed tree.** The paragraph above is FALSE in its premise
> and the paragraph stays, struck rather than erased, because the estate corrects beside a line
> and does not rewrite one. Both floors live in `e2e/a11y.spec.ts` — `3.3 optionsInPicker` at
> line 323 and `3.4 ctrlKDoesNotPeek` at line 369, re-derived by grep at the pass-5 seal
> `abe533c4`, not carried from the registry. That is the very file this section reports at
> **30 / 30**, and this lane's own banked log proves it row by row: `logs/floors-a11y.log`
> carries six passing rows for the two guards, three per engine —
> `a11y.spec.ts:324:3 › 3.3 optionsInPicker › the picker publishes five named, AX-visible
> options` and `a11y.spec.ts:370:3` + `394:3` for `3.4`, in chromium and in webkit.
>
> So the floors WERE run by this lane, they ARE attributable to it, and they were green. The
> disclaimer also mis-locates them: neither guard lives in "the picker and mobile specs" Lanes
> A and F3 were editing, so the attribution hazard it invokes did not apply to them either.
>
> Booked as the same class it would have been in reverse: a claim of non-coverage where
> coverage exists costs a reader the same thing as a claim of coverage where none exists — the
> reader re-runs work already done, or declines to trust a green that was earned. The
> conclusion this changes is small and named: the pass-5 W3-floor tally for lane BC is
> **complete**, not partial.

---

## 8 · NEW GAPS (raised by this lane, against itself and against the evidence set)

- **BC5-G1 · The stall row does not close, and W4b's charter assumed it would.** §1. The charter
  reads "the ~280 ms WebKit drawer-open stall row closes with a rig measurement"; the rig
  measurement says otherwise. Ranked here as the lane's own blocking-class row: the wave cannot
  post CH-61 as closed.
- **BC5-G2 · EVERY banked `dist-*` in the design-loop evidence set is HOLLOW.** All **23** of
  them — `pass2/dist-{base,f2pen,f2type}`, `pass3/dist-{…13 of them}`,
  `pass3/stall/dist-head`, `pass4/dist-{p4base,recon,BChead,FINAL,F3base,F3head,curveCTRL,noopCTRL}`
  — contain exactly two files, `_headers` and `_redirects`. No JS, no CSS, no `index.html`,
  in git or on disk. **Every single-tree, md5-identity and "re-served the seal" claim in passes
  2–4 rests on a directory with no build in it**, and BC-M3 was unclosable for four passes for
  precisely this reason. Related: **no rig SCRIPT from pass 3 or pass 4 is banked either** —
  `pass3/rigB/`, `pass4/rigBC/` and `pass3/stall/` hold outputs and `node_modules`, and the
  instruments that made them (`deal-keypad.mjs`, `measureBC.mjs`, `ev/s1-s4`) are gone. Both of
  this lane's re-derivations (§1's instrument, §4's method) had to be rebuilt from output
  schemas. This is the "the record can't verify the record" family, at scale, and it is an
  evidence-policy row for the team lead, not a lane row. **BC's own artifacts are banked whole
  as the corrective**: `pass5/BC/rig/dist-head/` is 39 files including the measured
  `index-C5xqWLHq1mLl.js`, and all five rig scripts are committed beside their runs. Whole
  lane: 1.2 MB.
- **BC5-G3 · KenKen's `+` and `÷` render in the fallback face on a shipped surface.** §3.2.
  Ledgered, not cured; folded into the standing owner woff2 row. Two of four operators, every
  board, plus the gallery poster.
- **BC5-G4 · 0.11's encode moved from `OffscreenCanvas` to `HTMLCanvasElement`.** Whether that
  forfeits an off-main-thread encode in any engine is UNMEASURED (§1.4 limit 5). Not asserted
  either way; named so the upstream row starts there.
- **BC5-G5 · The pair-branch floor is inherited, not owned.** The 44 px property the cure was
  sold on comes from a shared `(pointer: coarse)` rule in `assets/index.css`. It is now gated
  where the branch exists, but a change to that shared block still moves a property three
  components depend on. Whether the floor should be stated at the shared rule is an adjudicator
  question, not a lane decision.
- **BC5-G6 · Carried, unchanged and not re-argued:** the settle stays conditionally REFUSED (its
  precondition — the glide block — is measured here as **still uncured**, so the refusal's stated
  expiry has NOT arrived); the iPad rail is still a long column and C's T′ collapse is still its
  named closure (**GameControlPanel.vue is −149 code lines in this worktree right now under
  another lane** — whoever owns that must re-measure the rail, not BC); the 22 pre-existing
  mixed-face strings remain an owner row.

---

## 9 · U-10

Nothing in this dossier closes an owner mark. Mark 5's drawer-content composition and mark 2's
interior life are **awaiting the owner's eye**; what BC lands this pass is the WORK and the
EVIDENCE — a floor gated where the branch exists, a census that spans the estate it claims, a
banked arm under a four-pass-old sentence, and a stall measurement that says the row is still
open. The marks close on the owner's re-look, not on any of it.
