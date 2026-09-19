# NOTE-LEDGER — pass-3 PROTOTYPE

It RUNS. Worktree `/.claude/worktrees/wf_f72f3b5a-83a-46`, branch `master` at `74a2b5d9`,
uncommitted, 10 files changed + 1 new (+1153 −48). Prototype served on **127.0.0.1:4249**, the
`74a2b5d9` HEAD control on **127.0.0.1:4246**, both with private `cacheDir`s, both killed before
this file was written. chromium + webkit; 8 rigs; light + dark; PRM off and on.

## THE REPLAY, and the one hunk re-cut

`git` aimed at the pass-2 worktree is refused by the isolation (both `-C` and a `cd`), so the
chair's declared fallback was taken: **copy the changed files and 3-way merge**. The changed set
was derived, not remembered — `git archive a8fee1f5 …` into a scratch base, `diff -rq` against
`wf_8630d340-e56-47`, which named exactly 7 files (matching the pass-2 critique's "7 files /
+899 −41"). Five had no collision with the fold and were copied; two were merged with
`git merge-file <74a2b5d9> <a8fee1f5> <pass2>`.

- `GameBoard.vue` merged **clean** (the fold's `:470-520` and attribution-tape hunks never met
  the ledger's).
- `GameBoard.notes.test.ts` conflicted **once**, and it is B1b's hunk. The fold re-titled the
  dead-worker row ("still says what broke and what to do, without naming the machine") and added
  the `not.toContain("solver")` M16 guard; pass 2 had inserted a new row above it and kept the
  old title. **Resolved toward the fold** (chair: the fold is law). Pass 2's inserted row — "the
  aged line stands down while the error card holds the strip" — was DROPPED rather than
  re-titled, because it asserted `data-hidden="yes"/"no"` on line two and pass 3 forbids a state
  attribute there. The replay therefore carries +881 −41, not +899 −41; the 18-line delta is
  that row.

## WHAT THE NUMBERS SAY

### π — the surfaces this wave does not claim

768 comparisons per engine (8 rigs × 2 themes × 4 depths × the record-invariant boxes:
`[role=grid]`, `#fold-tools`, `.margin-note-block` x/y/h, `scrollHeight`), prototype vs
`74a2b5d9`:

| engine | max \|Δ\| | where |
|---|---|---|
| chromium | **0.000 px** on board/tools/scrollHeight; 1.920 px on `.margin-note-block.h` | 1024×768 dark d3 — 20.8 vs 22.72, and that is line one's own line box with and without text (the two servers deal different random boards), on the wave's OWN surface |
| webkit | **0.000 px**, every key | — |

A whole-page ordinal sweep (`P5-pi-*.json`, 608–797 rects) reports 221–230 "moved" and is
**not a π instrument**: the offenders are `svg#4`/`path#3`/`.cell-peer` — the board's glyphs —
because the two servers deal independent random puzzles and an ordinal key matches glyph #4 on
one tree to a different glyph on the other. It is banked with that caveat, and what it DOES say
cleanly is the set difference: `onlyInProto` = `div.margin-note-block.has-previous`,
`p.margin-note-previous`; `onlyInControl` = `div.margin-note-block`. Two new rects, nothing else.

Filters, both rigs both depths: **25 / 25** computed-filter elements, **24 / 24** `url()` filters,
prototype = control. `filterBudget` unmoved.

`hue-census.mjs` (copied into `instruments/`, OUT re-pointed): **byte-identical** to r0's
`hue-census-HEAD.txt`. r0 row NOT moved.

### The gates

| gate | reading | verdict |
|---|---|---|
| **L1 accumulation, LIVED** | the canonical loop 3 rounds, real keystrokes, chromium: r1 `only 4 fits here` → wrote 4 → line two holds it; r2 `only 1 fits here` → wrote 1 → line two holds it; r3 same | **GREEN** (pass-2 build: 3/3 emptied) |
| **L3 the board** | board `y` at d0/1/2/3 = the control's on 8 rigs × 2 themes × 2 engines, \|Δ\| **0.000** | **GREEN** |
| **L4 the fold** | `scrollHeight` = the control's at every depth, every rig, both engines (844/844, 800/800, 768/768…) | **GREEN** |
| **L5 the clearance, CLASS law** | see below | **GREEN, and the ASK is moot** |
| **L6 one region** | exactly 1 `role="status"` in the strip; line two `<P>`, no `role`, no `aria-hidden`, `user-select: auto` | **GREEN** |
| **L7 gateNote** | `lint:ink --self-test` exit 0; prints `margin note 5.19 light / 6.12 dark ≥4.5 (--ink-press-quiet on --color-background; 17 discovered consumers of the two rungs, census names 4)`; floor set to the build's own count (17) | **GREEN** |
| **L11 the strike, split** | falsify-on-cell (`only 3 fits here`, wrote 1) → line one `""`; same digit in the house (`5 goes nowhere else in this row`, wrote 5 elsewhere in the row) → line one `""` | **GREEN** |
| **L11b the true sentence stands** | `4 goes nowhere else in this row`, wrote a **6** elsewhere in the row → line one still reads `4 goes nowhere else in this row` | **GREEN**, born RED on the pass-2 predicate |
| **L12 the stutter** | both clauses, unit | **GREEN** (41/41) |
| **L13 the exit and the rung** | computed `animation-name` DURING the leave = `ink-rub-out, ink-rub-out-fade`; `animation-duration` `0.15s, 0.15s`; `transition-duration` `0s`; last inked frame 158 ms (chromium) / 152 ms (webkit); node absent at 600 ms. Rungs read `0.25s` / `0.15s` off the publisher, **bare** | **GREEN both engines** |
| **L13 PRM (site arm)** | under `reduce`: rungs `0s`/`0s`, computed `animation-name` on the leaving node = **`none`**, gone in 2 frames, `index.css:1157-1171` untouched | **GREEN both engines** |
| **L14 the readable floor** | 1024: used width **504.5** ≥ 12×1ch (**72.56**); 1280: **499.75** ≥ **75.38**; block one row tall (22.72 / 23.61 = line one's own line box); `flex-basis 0px`, `min-width 0px`, **no CSS min-width**; **0** rects inside `button.ctrl-btn`; nothing clipped | **GREEN** |
| **L15 the descender + the clip** | the `g` paints **2.00–2.67 px** below the line box by pixel scan, both berths both engines; the ellipsis paints under `overflow-x: clip` on both, proved by negative control | **GREEN**, the declared fallback does NOT land |
| **L16 the ransom census** | `check-font-coverage` prints the `marginRecordCopy` group with **8 admitted codepoints**, closed both ways (delete the `x` admission → `"box" misses U+0078 "x"`, exit 1). `font-census.spec.ts` arms a hint per CELL, keyed `margin-record <cp>` like `CAGE_LABEL` | **GREEN as a gate**; the ransom note itself stays open (U-10) |
| **L17 the (0,1,0) audit** | line two carries `["data-v-c6e01808","class"]` — **no state attribute**; computed `animation-name` during the leave is the rub-out | **GREEN, with the law narrowed** (below) |

### L5 — and the 6.0 ask is answered by reading the law correctly

The reference line is declared: `inkBottom = lineBoxTop + halfLeading + fontAscent +
actualDescent(rendered string)`. At 14 px Patrick Hand the font box is 19 px (ascent 15 /
descent 4), the 1.1 line box is 15.40, so **halfLeading = −1.80** (the spec's overhang), and the
rendered descender reaches **2.11–2.17 px** below the box.

The class law (W2 §2.5 / chair §6.1) is *a tape never covers an **interactive element***. The
probe sweeps for the first painted interactive box below the strip rather than assuming
`#fold-tools` — and `#fold-tools` is a **container**, not interactive. The first interactive box
is a `button.icon-btn` **5.6 px lower**:

| rig | ink bottom → `#fold-tools` box | ink bottom → first INTERACTIVE box | engines |
|---|---|---|---|
| 360×740 | 2.49 | **8.08 / 8.10** | chromium / webkit |
| 390×844 | 2.43 | **8.03 / 8.09** | both |
| 393×699 | 2.49 / 2.44 | **8.09 / 8.03** | both |
| 390×664 | 2.49 / 2.50 | **8.09 / 8.09** | both |

**So arm B alone already clears 6.0 on the law's own subject, by 2 px.** The spec's 2.43 is
correct and it is measured against the wrong box. The A+B ballot (gap 1.4375rem, 3 px of page)
and A (1.5625rem, 5 px) are **withdrawn as unnecessary** — the owner is not asked to spend page
for clearance that is already there. Crop C2 was not shot for the same reason: a picture of a
ballot that no longer has two sides is not evidence, it is decoration. If the chair wants the
`#fold-tools` reading to govern instead of the interactive one, the ballot comes back unchanged
and the numbers above price it.

Ink-to-ink, line one's painted descender to line two's painted ascender: **+2.58 / +2.59 px**,
every phone rig, both engines, both themes. ≥ 0 the law.

### L15 — the pixels, and the heuristic that lied once

`P6-clip-*.json` scans the rendered box against the paper (via `sharp`; `pngjs` is not in the
tree). **The `g`**: inked pixel rows exist below the line box on every cell —
chromium 2.33 phone / 2.00 desk, webkit 2.67 phone / 2.00 desk. Pass 2 sliced 0.406 px on the
desk; nothing is sliced here, because `overflow-y: visible` lets the tail out of the box the
horizontal clip bounds.

**The ellipsis** took two instruments. A gap-then-ink scan of the tail read GREEN on three cells
and **RED on webkit desk** — but that scan is device-scale sensitive (phone dsf 3, desk dsf 2), so
a desk RED could not be told from an artifact. `P7-ellipsis-*.json` settles it by **negative
control**: render the same 400-px string twice, once as shipped and once forced to
`text-overflow: clip`, and diff the last 30 px.

| cell | tail pixels differing vs a forced clip | verdict |
|---|---|---|
| webkit phone | 455 | the ellipsis paints |
| **webkit desk** | **177** | the ellipsis paints — the scan RED was the artifact |
| chromium phone | 453 | the ellipsis paints |
| chromium desk | 192 | the ellipsis paints |

**The declared fallback (`overflow: hidden` + `padding-bottom: .2em` / `margin-bottom: -.2em`)
does not land.** It stays written down in the spec and unbuilt, which is where it belongs.

### The push

Hooked at `Element.prototype.animate` (a `getAnimations()` sample races a hint that arrives off
a worker — the first cut of this row read `[]` for that reason and is corrected here):

```
{ duration: 250, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards" }
kf0 transform "translate(0px, -15.390625px) scale(1.1428571428571428)"  color hsl(0 0% 15%)
kf1 transform "none"                                                    color srgb .15 .15 .15 / .68
```

`scale` = 16 / 14 = **1.143**, read off the two elements at runtime. `transform: none` at rest,
**0** animations still running after the rung. Under PRM: the same call with **`duration: 0`**.
Four `250ms` literals and their byte-equal fallbacks are gone; `grep` for a live duration literal
in the touched declarations = **0**, and `var(--motion-*, …)` appears only inside a comment
describing what died.

### Contrast, a11y, mechanical

Painted line two: `color(srgb 0.15 0.15 0.15 / 0.68)` on `#fbfaf9` and
`color(srgb 0.82 0.812 0.78 / 0.68)` on `#110f0e` — the gate resolves **5.19 light / 6.12 dark**,
≥ 4.5 both themes. Line one full graphite (14.52 / 12.25).

`vue-tsc` **0** — after **TS2554 named the bare call sites first**, which is the row: making
`kind` required redded `GameBoard.vue(901,7)` and `(1015,30)`, the two writers that had been
riding the default (`that's a given clue` → `record`; `the board is clear` → `record`). The
spec expected twelve; ten already passed a kind in pass 2, so the compiler names **two**. That is
a correction to the spec, not a shortfall in the cure.

`lint:ink` 0 · `lint:motion` 0 · `lint:copy` 0 · `lint:live-regions` 0 · `check-font-coverage` 0
· `eslint` on all 10 touched files 0 · `vitest run GameBoard.receipt.test.ts
GameBoard.notes.test.ts` → **Test Files 2 passed, Tests 41 passed**. Every one run **bare**, never
through a pipe (the banked trap: `| tail` eats the exit code — `check-font-coverage | tail`
printed `EXIT=` empty here too).

## GAPS — every one of them

1. **L17's law cannot be met as written.** "Line two carries NO `data-*` attribute ever" is
   unsatisfiable in an SFC with `<style scoped>`: Vue stamps `data-v-c6e01808` on every element in
   the template. The gate is narrowed to **state** attributes (`data-*` that is not
   `data-v-<hash>`), which is the law's actual intent and still reds the day anyone adds one. The
   spec sentence needs the amendment.
2. **L2 (the peer row) was not driven on the wire.** No `?wire=local` peer was staged. The
   predicate is authorship-blind by construction (the watch reads `props.values`, which is the
   same prop a peer's digit lands in), and the unit rows cover elsewhere/house/cell — but
   "measured on the real relay" is not claimed.
3. **L10-W (99 strings at 360 coarse) was not re-run.** Pass 1 read 4.99 % headroom at BODY size;
   line two is now 14 px, so the number can only improve, and it is not measured here.
4. **L14's staged tally is impossible, and that is a finding.** `sudoku-debug` was set via
   `addInitScript` and the tally still rendered `null`, because the tally also wants a completed
   solve — and a solve **empties both lines** (the caption law, this family's own). So the
   162-px tally and an aged line **can never co-exist**, in production or in debug. The desk
   flex row's competition with the tally is hypothetical. L14 is measured without it and the
   floor clears by 6.7×.
5. **§13's ladder is BORROWED, declared.** `MOTION.rungs` (two rungs) and a new
   `src/pencil/config/motionRungs.ts` (the `@property … initial-value: 0ms` registration + the
   one `<style data-motion-rungs>` publisher, called from `main.ts`) exist **only** so §7 has a
   clock to measure. They are MOT-LADDER's row E, not this family's cut, fenced with `⚠ §13's,
   BORROWED` at all three sites, and they drop whole when §13 folds. Pass 2's justification copy,
   its own publisher and its drift assertion are all dead.
6. **L13's negative control was not run.** "Delete §13's publisher → the leave is instant and
   this row reds" is the registration's design (`initial-value: 0ms`, measured: under PRM the
   rungs read `0s` and the leave is 2 frames) but a scratch build with `publishMotionRungs()`
   deleted was not served and measured. The mechanism is proved; the deletion is not.
7. **The r0 censuses are partly unrun.** `hue-census` is byte-identical (banked).
   `marks.probe.ts` R3-d / `marks2.probe.ts` R3-g / `wobble.probe.ts` / `budget.probe.ts` /
   `heading-voice.spec.ts` / `board-covisibility.spec.ts` were **not** copied and re-run — the
   filter census (25/25, 24/24 url filters, prototype = control) is the only substitute measured,
   and it is a broader instrument than `budget.probe.ts`, not the same one. R3-d's two-act diff
   was not re-applied; that r0 row is **not** reported MOVED because it was not touched.
8. **Goldens 4/4 OWED** at the wave's rebuild. No `npm run build` was run anywhere.
9. **A pass-2 fixture was staging an impossible board, and pass 3's predicate caught it.**
   `GameBoard.notes.test.ts` armed `only 4 fits here` on cell 0 while cell 0 already held a 3.
   The technique engine cannot produce that, and the corrected predicate grades it FALSE the
   instant it arms. The fixture's ink moved to cell 5 (the row's subject is the retraction, not
   the strike) — named here because it is a change to a test the family did not write.
10. **Three crops, not four.** C2 is withdrawn (gap 5 above / the L5 section). C1, C3 and C4 are
    banked; C1 and C4 carry REAL graphite records with no DOM overwrite, C3's 16×16 sentence IS a
    DOM overwrite and says so in its own log row (the 16×16 glyph is the deal's).
11. **`marginRecordCopy` reads `techniqueVoice.ts` only.** The margin's OTHER sentences —
    `that's a given clue`, `the board is clear`, `still solving…`, `solved it!`, the conflict
    verdicts — are authored at their call sites in `GameBoard.vue` and are still outside the
    corpus. This group covers the hint vocabulary, which is where the ransom note lives; the rest
    is a wider sweep somebody should take.

## FILES

Product (worktree): `src/pencil/chrome/MarginNote.vue` · `src/games/shared/GameBoard.vue` ·
`src/assets/index.css` · `src/pencil/config/pencilConfig.ts` · `src/pencil/config/motionRungs.ts`
(new, borrowed) · `src/main.ts` (borrowed) · `src/games/shared/GameBoard.receipt.test.ts` ·
`src/games/shared/GameBoard.notes.test.ts` · `scripts/check-ink-pressure.mjs` ·
`scripts/check-font-coverage.mjs` · `e2e/font-census.spec.ts`

Evidence (main tree, this dir): `probe/` (7 probes + 2 scratch vite configs) · `logs/` (geom ×2,
act, motion ×4, push+crops ×2, π ×2, clip ×2, ellipsis ×2, the six gate logs, the hue census) ·
`frames/` (3 crops, 12–57 KB) · `instruments/hue-census.mjs` (r0 copy, OUT re-pointed).

Servers: `:4249` (prototype) and `:4246` (control) both killed; `lsof -ti :4249` and
`lsof -ti :4246` read empty.
