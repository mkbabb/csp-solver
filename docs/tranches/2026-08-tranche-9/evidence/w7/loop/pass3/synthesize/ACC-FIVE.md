# ACC-FIVE — five crayons at different pressures · pass-3 SYNTHESIS (the spec)

§3 accent family · §4 fill meter · §12 multiplayer chrome · §15 the confirm's face · M07.
Synthesizer: Fable 5.1, 2026-09-18. Inputs, in the order read: `../CHAIR-RULINGS.md`,
`../research/ACC-FIVE/README.md` (pass 3, measured on `74a2b5d9`, both engines, modal-of-run core over
24 columns), `../../pass2/synthesize/ACC-FIVE.md`, `../../pass2/registry-v2.md` §2.6/§4, the sibling
pass-3 research (ACC-GRAPHITE §1/§2 — the unit-space law and the segment census; ACC-SIX §2 — the
25-segment trap), the wave (§3/§4/§12/§15), M07, r0 R2/R6, the owner's frames `marks/m01` (dark
iPhone: the violet stripe on the light-grey frame) and `m09`. The frontend-design skill was invoked;
§0 is its two-pass method. Read-only on the product. U-10.

Chair compliance: **law 25 STANDS** — the pass-2 amendment at `index.css:189-195` is REVERTED and the
earned condition this palette meets is re-stated with its measurement (§2, §6.7); FRAME_PAD at HEAD's
`12 / 0` (§6.2); `--color-focus-sketch` read, never written (§6.1); `.cell-because` and every
`gameCell.css` row untouched (§6.6/§6.11); `filterBudget` EXACTLY 9 on the dist (§7); `poseFronts` is
this family's own primitive and the section's shared one (§4 — ACC-SIX's cure folds onto it, the
palette thesis stays ACC-SIX's); F1 both arms buildable, YES leans (§6.8).

---

## 0 · Plan, then the review against the tells

**Subject.** A pencil-and-paper sudoku whose wax is five hand-cut crayons and whose inks were stock
Tailwind. The family's sentence: every interactive accent is one of the five crayons at a different
PRESSURE; the sixth colour dies. The fill gauge is the same crayon as the gold-star sticker, pressed
lighter — and the win is one pressure harder, on the same rect, the same seed, the same hue.

**Tokens.** Two new hexes per theme (the pen, the gauge), four hexes and two literals die.

| role | token | light | dark | OKLCH (painted) |
|---|---|---|---|---|
| your hand | `--color-user-ink` | `#026fc4` | `#47a7ff` | h 251.2 / 249.4 — crayon-blue's INK tier (Δ 0.17° / 0.07°); 5.065 / 7.341 on card |
| the work in progress | **`--color-progress-ink`** | **`#a87e13`** | **`#79650f`** | L .618 C .122 h 83.9 / **L .512 C .100 h 94.5** — crayon-gold's ink tier (Δ 0.23° / 0.72° painted) |
| the work done (unchanged) | `--color-gold-star` → `--color-crayon-gold` | `#c99a2e` | `#e5c74d` | 83.7 / 95.2 |
| the verdict line (unchanged) | `--color-gold-ink` | `#8c691d` | = wax | the TEXT tier |
| the solver's glow | `--sparkle-glow-soft` / `-strong` = `color-mix(in srgb, var(--color-crayon-gold) 30% / 60%, transparent)` | | | one filter, 900 px², census 9 |
| the teacher's red (unchanged) | `--color-red-ink` | `#d02a52` | `#ff5c7c` | 13.6 / 12.2 |
| the focus ring | `--color-focus-sketch` | §6's | §6's | 253.3, inside the blue arc |
| RETIRED | `#2563eb`, `#60a5fa`, `#8b5cf6`, `#7c3aed` (as progress-ink; stays once as `--color-solver-ink-2`), `rgba(196,181,253,…)` ×2, the glyph fallback, `.solve-success .progress-trace { opacity: 0 }`, `pathLength="1000"` ×2 + both dashes | | |

**Type.** Nothing new is drawn in the hand face. Zero rendered-string changes.

**Layout.** Nothing moves.

**Principles.** (1) Contrast is bought by LIGHTNESS at a locked hue, never by a new hue — and where
the corridor is narrow, by ALPHA before hue. (2) Gold has two moments: the work in progress is gold
INK at pencil pressure, the work done is gold WAX; same hue, same rect, one pressure apart. (3) A
colour that appears on your hand is yours everywhere it appears. (4) The confirm's one colour is the
house's "stop": the verb and its drawn box in the teacher's red, on bare card.

**The review.** The generic cure (a brand accent, a percent bar, a glow, a red-tinted button) is
refused on the same numbers as pass 1. Three pass-2 defaults changed by pass-3 numbers:

- *The gauge blends 5% of the very line it must clear into itself* (`stroke-opacity 0.95`). The
  unpriced lever was alpha, not hue: taking the gauge to 1 buys +0.21 dark / +0.19 light for one
  attribute (research §2). The gauge becomes the one OPAQUE stroke on a board whose frame is 0.95 —
  "one pressure harder" is the family's own sentence, said with a number and disposed by U-10.
- *`#7d6902` was a hex, not a corridor.* The dark trace has TWO painted grounds pulling opposite
  ways (line 199,197,190 above it, paper 19,18,17 below), and the feasible painted-core luminance is
  **0.1184–0.1526** — 0.034 wide. `#7d6902` paints 0.1584, 0.006 over the ceiling. The gate asserts
  the CORRIDOR, never the hex (§2); the design cost is named: **the night gauge can be gold at OKLCH
  C ≤ 0.10 and no more** (nothing at C ≥ 0.12 clears both floors; the best scores 2.317).
- *The win's own contrast row was never read.* In dark the wax over the line it lifts from reads
  1.037:1. It is disposed EXPLICITLY (§3), not inherited.

Nothing here is warm-cream-plus-accent: gold touches two surfaces and both are the one semantic the
house already gave it. One memorable thing per surface: BOARD, the gold ink lifting into gold wax at
the win; HAND, crayon-blue's ink; CONFIRM, the verb and its box in the teacher's red. Everything
else is quiet.

---

## 1 · The section finding: segment count, and `poseFronts` seated once

The pass-2 law ("WebKit mis-scales a dash declared as a presentation attribute") is falsified: the
shipped ring is **493 segments** (ACC-GRAPHITE / ACC-SIX, both measured at HEAD), the ungrained
control is 25, and the discriminator is the count (493/128 ≈ 3.85 → the 4 runs every lane saw).
G0's forced arm in pass 2 measured a 25-segment stub because `poseFronts` had already truncated the
pose; it could not have gone red. **G0 is re-cut once for the section (banked by the leader; this
family runs it as its own control):** one declaration form, arms **25 / 123 / 246 / 493 / 599** on the
UNTRUNCATED pose 0 `d` read off the live DOM (or generated WITH `FILTER_PRESETS["grain-static"].grain`),
× chromium + webkit × dpr 1 + dpr 3, painted share within 2 points; the CSS form and the 4-subpath
multiplier (0.859 both engines) reported beside.

**The cure is this family's `poseFronts`**, seated ONCE in `gridPaths.ts` beside
`generateFrameTraceFrames` (`:352`): `posePoints(d)`, `poseLengths(frames)`, `poseFronts(frames,
fraction)` — geometric truncation with the last point interpolated; `f <= 0 → ""` per pose (fails to
NOTHING DRAWN), `f >= 1 → frames`. Consumers in the same diff: the fill gauge (`HandDrawnGrid.vue:476-478`),
the join ring (`:509-511`, `joinProgress` as the fraction, 0.984 kept), and `DifficultyTally.vue:230-232`
(12 segments — one grammar, declared hygiene, not a cure). `pathLength` and both dashes die.
Engine-independent by construction; the π on this family's own surface is the front's position,
≤ 1.6 px on a 2,513-px perimeter (poses differ 3.59 u / 0.091%, `poseLengths`' docstring).

**The price, declared.** `stroke-dashoffset` was tweenable; a truncated `d` is not. Without a tween
the front STEPS ~31 px per digit at 9×9 Easy and ~158 px at 4×4 Easy. This family's answer is §5:
the FRACTION tweens on the boil scheduler and `poseFronts` is re-cut per frame — measured
affordable (research §6: chromium median 8.3 → 8.3 ms, webkit 17.0 → 17.0, p95 +4 ms, ≤ 15 re-cuts
per write). The step is the FALLBACK arm, buildable behind the rung's value 0, for W8's device trace.

---

## 2 · Tokens (`index.css`), with the comments that move with them

```css
:root {
  /* your hand: crayon-blue's INK tier. L .536 C .156 h 251.2 (Δ 0.17° off #4a90d9). 5.065 on
     --color-card, 4.945 on --color-background. No alias tier above it (T5-W2 2.3): the var()
     consumers want the BINDING the peer seam rebinds (playerIdentity.ts:67-70). */
  --color-user-ink: #026fc4;
  /* the work in progress: crayon-gold's INK tier, at PENCIL pressure. L .618 C .122 h 83.9.
     PAINTED (modal-of-run core, 24 columns, chromium == webkit to the byte) at stroke-opacity 1:
     3.505 vs the painted frame line (49,49,49) / 3.646 vs paper (253,253,252). The corridor this
     must sit in (both 1.4.11 floors at once): painted core L 0.1921–0.2939; this paints 0.2329.
     Token arithmetic over-reports every non-text row by ~0.5 (a 12-u hand-drawn line never paints
     its own token) — the ledger carries the PAINTED pair and names the instrument. */
  --color-progress-ink: #a87e13;
  --sparkle-glow-soft:   color-mix(in srgb, var(--color-crayon-gold) 30%, transparent);
  --sparkle-glow-strong: color-mix(in srgb, var(--color-crayon-gold) 60%, transparent);
}
.dark {
  --color-user-ink: #47a7ff;        /* h 249.4 (Δ 0.07°); 7.341 on card. The one ink that may not
                                       collapse into its wax: the wax is the ring's (§6) and the wash's. */
  /* the night gauge: L .512 C .100 h 94.5. PAINTED at α 1: 3.303 vs the line (199,197,190) /
     3.280 vs paper (19,18,17). Corridor 0.1184–0.1526 (0.034 wide); this paints 0.1341.
     THE COST: nothing at OKLCH C ≥ 0.12 clears both floors (best 2.317) — the dark gauge is gold
     at C ≤ 0.10 and no more. Any move of --grid-line-color or --color-card re-opens this row;
     the gate asserts the corridor, not the hex. */
  --color-progress-ink: #79650f;
}
@media print                   { .progress-trace { stroke: #000 !important; } .attribution-tape { display: none; } }
@media (forced-colors: active) { .progress-trace { stroke: CanvasText; } .attribution-tape { color: CanvasText; } }
@media (prefers-contrast: more) { .progress-trace { stroke-width: 12; stroke: var(--color-gold-ink); } }
```

The `prefers-contrast: more` arm is specified FROM THE PHONE (research §7: the 0.73-px flank is an
antialiased sliver there, so the perceived ground is a blend): at 12 u the trace covers the line and
paper is its only ground; it takes the TEXT tier — light `#8c691d` 4.85 on paper; dark the tier is
already the wax by the estate's own collapse (`index.css:385`), 11.2 on paper. One rule, no new token.

**Law 25 — the amendment is REVERTED; the re-statement stands beside the token** (comment-only):
*Gold is earned light: the LIGHT arrives only at the win. What arrives with the work is a pencil —
the gauge writes gold at pencil pressure, painted relative luminance 0.134 dark / 0.233 light against
the wax's 0.580 / 0.357. One hue, two pressures; the win is the lift.* The ask goes to the chair as
§6.7 directs; nothing in a colour lane's prose amends an R6 row. The violet ledger at `:267-278` /
`:403-407` dies with its token.

Gold has three tokens (wax · gold-ink for text · progress-ink for the trace), three lightness tiers,
three measured floors. Said out loud.

---

## 3 · Components and states

**Your digit** (`HandwrittenGlyph.vue:85`): `return "var(--color-user-ink)"` — the fallback dies.
5.065 light / 7.341 dark; kin 0.17° / 0.07°. Print and forced-colours unchanged. The pen's guard is
a UNIT row on the resolved glyph stroke (user digit vs given), not a bitmap (chair §6.4: the four
goldens render no user digit and none is re-minted in the loop).

**The focus ring**: §6's. The palette survives every MRK-LIVE candidate (A `#3a7bc4`, B/C `#6aabeb`
dark) — both pen arms sit at 249–251°, the ring at 212–253°, the gauge at 84–95°; no §6 value can
collide with a gold. It does NOT survive a ring pointed at `--color-user-ink` (a peer's colour on a
peer's square, inside the cell `playerIdentity.ts:69` rebinds). Stated as a condition.

**The unit wash**: unchanged, crayon-blue 7% (§6's row). Pen, ring and wash are one hue at three
pressures.

**The fill trace** (`HandDrawnGrid.vue:461-480`): gold ink, **`stroke-opacity="1"`** (was 0.95), 8 u
INSIDE the 12-u frame line (the 1.27-px graphite flank per side at desk, 0.73 at phone, measured in
24/24 columns — both grounds bind by construction, the card is never the operative ground alone),
`poseFronts` as the front, FRAME_PAD at HEAD. At 0% nothing renders; the graphite frame is the empty
gauge.

**The win — decided explicitly (research §4).** `.solve-success .progress-trace { opacity: 0 }` DIES
and becomes `.solve-success .progress-trace { stroke: var(--color-gold-star) !important }` in
`@layer utilities`, with the `stroke` transition in the component (unlayered). The trace STAYS and
lifts one pressure into the wax: light ΔL +0.104, dark +0.292, hue 83–95° the whole way. The baked
`.grid-line` gold (`index.css:588`) paints 0 px under the bake and is KEPT for print — recolouring the
baked stack is W6/W8's class, not this lane's. **In dark the wax over the warm-grey line reads 1.037:1
and that is the design, stated:** a gauge at 100% carries no fill boundary to read — the a11y mirror
says 100% — and the wax laid at the line's own luminance with only HUE differing is exactly *the frame
line turning gold*, which is the sentence the frame's dead rule was written to say. Light: the wax over
the line 5.046, over the paper 2.533 (booked for the owner as the post-win hedge: hold the post-win
stroke at the ink tier under `prefers-contrast: more`, one rule). Both crops go to U-10 (§9).

**The sparkle** (`GameControlPanel.vue:2088/:2094` — the fold moved them +7):
`drop-shadow(0 0 2px var(--sparkle-glow-soft))`, hover `5px var(--sparkle-glow-strong)`;
`transition: filter 200ms var(--ease-standard)` (the `all` tween dies). One filter, 900 px², census 9
and union 45,572 / 6,673 unmoved on the dist.

**The confirm's face** (`GameGallery.vue:1459` `.guard-leave .guard-face`, hover `:1432`, focus `:1450`
+ the W1 §1.5 ribbon): coupling 4's law, reached by five families, written once by the agglomerator —
`.guard-leave .guard-face { color: var(--color-red-ink) }` on BARE card (the 8% ground dies: red on a
5%/8% neutral reads 4.49/4.20); `@media (hover: hover) { .guard-btn.guard-leave:hover .guard-face {
color: var(--color-red-ink) } }` ((0,4,0) beats the hover rule's (0,3,0); fenced or a coarse pointer
gets a stuck red). `HandDrawnOutline` strokes `currentColor`: the box reddens with the word. 4.99 /
6.30 bare, 4.69 / 5.08 on the hover ground; `keep` unchanged. The board's `Clear` confirm arms only at
a coarse pointer (`GameControlPanel.vue:552-553`); its gate runs at 393 dpr3 `hasTouch`.

**Multiplayer chrome (§12).** You write and are marked in `--color-user-ink`; peers keep the walk;
the join ring at 0.984 strokes the arriving ink inward, now over `poseFronts`. F1 (chair §6.8): the
`selfInk` substrate lands ONCE under §11's leader (PLR-SELF); this family states its palette for BOTH
arms — NO: your pen is crayon-blue's ink everywhere; YES: your pen is crayon-blue's ink solo and takes
your walk ink when a second id is known — and frames both by flipping PLR-SELF's flag on its server
(the pen's painted hue solo vs in-room, a number). The reserved arcs for PAL-TIN, ±5° painted: red
7.2–19.2 · orange 59.2–76.8 · gold 77.4–100.8 · green 142.0–153.3 · blue 244.4–258.3 (78.3° reserved).
The fold's attribution tape (`GameBoard.vue:1088-1096`) carries the peer's ink and is untouched; it
gains the print/forced arms above (section row: written once).

---

## 4 · Copy (M16)

No new string. `aria-valuetext="board N% filled"` stands (W3's). The confirm's words stand. Comment
prose only, plain register. `check-copy-register` is run BARE on the new tree (the fold rebuilt it).

## 5 · Motion (home: MOT-LADDER's ONE ladder, registry §2.1 — consumed, never minted)

| what | rung | curve | consumer | PRM |
|---|---|---|---|---|
| the fill front's draw | the ladder's **write-in** rung (the `note` band; HEAD's 240 ms literal → the rung's value, declared as a 10-ms move if the rung is 250) | `--ease-drawOn` | `fillFraction` tweened on the boil scheduler's rAF; `poseFronts(frames, f)` re-cut per frame, ≤ 15 re-cuts per write, 4 `d` writes each; ends on the exact fraction | no tween: the front snaps (the fallback arm, rung value 0) |
| the win's lift | the rung whose value is 500 (the `.solve-success` transitions at `index.css:588-611` are already its consumers; MOT-LADDER's name read off its pass-3 registry entry and stated) | `--ease-noteWrite` | `.progress-trace` `stroke` | same-frame swap |

**No `MOTION.traceFillMs` / `traceWinMs` are minted** — pass 2's two constants were a second ladder
(registry §2.1's tell). If MOT-LADDER's publisher has not landed in the worktree, the prototype
v-binds the two HEAD literals as CONSUMED values with the rung named in a comment, and the return
says so. The sparkle's `filter` tween keeps 200 ms `--ease-standard` (`chromeLeaveMs`'s band; no
`--motion-*` token exists at HEAD — `grep -rn -- "--motion-" src/` is 0; the route is `v-bind`).

## 6 · Desktop and mobile, light and dark

- Desk 1280×800: board 636 px; frame 7.63 px; trace 5.09 px @ α 1; flank 1.27 px per side; nothing
  moves.
- Phone 393×699 dpr3: board 365 px; frame 4.38; trace 2.92; flank 0.73 CSS px (2.2 device px); the
  W2 tab / dock / sticky tag untouched; the confirm face ≥ 44 px tall (unchanged).
- Light: trace `#a87e13` painted 3.505 line / 3.646 paper (HEAD violet **2.876 — fails 1.4.11 at
  HEAD**); the win wax 5.046 / 2.533; digit 5.065; verb 4.99 bare / 4.69 hovered; box 4.99.
- Dark: trace `#79650f` painted 3.303 / 3.280 (HEAD 3.139); the win wax 1.037 / 11.234 (decided, §3);
  digit 7.341; verb 6.30 / 5.08; box 6.30.

---

## 7 · Plan — files in order, what dies

1. `web/frontend/src/pencil/grid/gridPaths.ts` — `posePoints` / `poseLengths` / `poseFronts` seated
   beside `:352` (22 lines, from worktree `-41`); `FRAME_*_PAD` untouched.
2. `web/frontend/src/assets/index.css` — §2 in `:root` (`:151`, `:278`) and `.dark` (`:372`, `:407`);
   the law-25 amendment (`:189-195`, pass-2 tree) NOT replayed, the re-statement beside the token;
   the violet ledger dies; `.solve-success .progress-trace` opacity → stroke; the three media arms
   (print / forced / contrast:more) incl. `.attribution-tape`; `--sparkle-glow-*` minted.
3. `web/frontend/src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue` — `pathLength` + dash dropped at
   `:476-478` / `:509-511`; `:d` from `poseFronts(traceFrames, fillFraction)`; `stroke-opacity` 1;
   the fraction tween on the scheduler (fallback: step); the win transition on `stroke`; the
   `:27-31` and `:595-612` comments re-cut (the `.join-pose` rationale keeps 0.984 and moves its
   subject — index 2 at 275° is 168° from gold).
4. `web/frontend/src/games/shared/DifficultyTally.vue:230-232` — `poseFronts`, `pathLength` dropped
   (hygiene, declared as such to §10).
5. `web/frontend/src/pencil/glyph/HandwrittenGlyph.vue:85` — the fallback dies. + a unit row: the
   resolved stroke of a user digit vs a given.
6. `web/frontend/src/games/shared/GameControlPanel.vue:2088/:2094` — the tokens; `transition: filter`.
7. `web/frontend/src/pencil/chrome/GameGallery/GameGallery.vue:1459` (+ the W1.1 ribbon) — red word
   and box, ground deleted, hover fenced. (Coupling 4: the agglomerator writes it once.)
8. `web/frontend/scripts/check-ink-pressure.mjs` — a **KIN** table (`--color-progress-ink` →
   `--color-crayon-gold`, `--color-user-ink` → `--color-crayon-blue`, KIN_DEG 5) + ~20 lines of OKLCH
   over the existing `colorOf`/`themesOf`/`parseColor`; a **CORRIDOR** row for the trace (token
   arithmetic, labelled as such, margin ≥ 0.25 at α 1 against BOTH grounds per theme); `--self-test`
   moves a token 6° and reds. No new file.
9. `web/frontend/scripts/check-theme-tokens.mjs` — ten lines: `strays ⊆ ALLOWLIST` (`teacher-red`,
   `gold-star`, `pencil-graphite`) else `process.exit(1)`; the self-test plants a third name.
10. `web/frontend/e2e/progress-corridor.spec.ts` (new, the estate's PW config) — the PAINTED corridor:
    grounds read from a progress-0 screenshot in the same column (no trace node exists at 0, by
    construction), modal-of-run core over 24 columns with a 45° hue window, both engines, both themes.
11. Instruments as diffs under `pass3/prototype/ACC-FIVE/instruments/` (r0 rows MOVED): `hue-census`
    (the per-anchor term), `consumers.mjs`, the G0 segment probe (section), `rect-census-fold.mjs`
    COPIED for the π census.
12. Hand-offs, not this patch: the five arcs + the 40-index sweep to PAL-TIN; the mark's live colour to
    PLR-SELF (read at the ROOT, never inside a rebound cell); the heading tint to §10; the focus-ring
    dark arm to §6.

Dies: `#2563eb` / `#60a5fa` / `#8b5cf6` / the dark `#7c3aed` alias; two `rgba()` literals; the glyph
fallback; `.solve-success .progress-trace { opacity: 0 }`; `transition: all`; the violet ledger;
`pathLength="1000"` ×2 + dashes ×2 (+ the tally's); the guard's 8% ground and its clause; pass 2's
`traceFillMs` / `traceWinMs` / law-25 amendment / `#7d6902` / `#a47903`. Born: `#026fc4`, `#47a7ff`,
`#a87e13`, `#79650f`. Files: 7 product + 2 scripts + 1 spec + tests.

---

## 8 · Prototype brief

**Build.** Fresh `git worktree` from `74a2b5d9` under the scratchpad; replay pass 2's diff (7 files,
worktree `-41`) by file copy if `git` is refused (state the route); every hunk on `GameControlPanel.vue`
resolves TOWARD the fold (the +7 line move) and is named; then §7 in order. Prototype server on
**:4236**, HEAD control on the next free port in 4230–4249; each a two-line scratch vite config with a
private `cacheDir`, `--host 127.0.0.1 --strictPort`; scratch Playwright config (no `webServer`,
`baseURL` the port); chromium + webkit; 1280×800 and 393×699 dpr3; light + dark. Build the dist
INSIDE the worktree with its own cacheDir for the filter census and the corridor's dist arm (never
build on main; never share build/serve cacheDirs — exit 144). Every colour read on the board is
pixels through a canvas byte read-back; every computed-style read waits out the tweens; any
`@layer` ablation is LAYERED into an earlier layer. Kill both servers, verify the ports, remove the
worktree. > 90 s → background + log.

**Numbers that mean success.**
- G0 five segment arms × 2 engines × 2 dprs: RED at 493 on the HEAD control, ≤ 2 points after the
  cure on the live gauge at p = 0.05 / 0.25 / 0.50 / 1.00; the CSS-form and 4-subpath controls beside.
- THE CORRIDOR, painted: modal-of-run core over 24 columns ≥ 3.25 on BOTH grounds, both themes,
  both engines (predicted 3.505 / 3.646 light, 3.303 / 3.280 dark); the max-chroma reading reported
  beside (expect 0.07–0.09 lower — the margin is what survives either instrument); HEAD's violet
  reads 2.876 light on the same instrument (born-RED).
- THE ALPHA: `stroke-opacity` computed 1; the same hexes at 0.95 reported as the control (3.302 /
  3.081 — the floor with no margin).
- THE WIN: band median L rises ≥ 0.09 AND the post-win computed `stroke` resolves to
  `--color-gold-star` through the cascade at 900 / 1800 / 2700 / 3600 / 5000 ms, both themes, both
  engines, with the LAYERED ablation arm reading ΔL 0.000; the dark 1.037 / light 2.533 rows
  reported as the decided numbers.
- THE TWEEN: the fill front's rAF re-cut count ≤ 15 per write; frame p95 within +5 ms of the
  no-rewrite control on the same page, both engines, at 20 writes; the step arm (rung 0) frames
  once for comparison.
- Digit 5.065 / 7.341 ± 0.02, hue within 5° of crayon-blue; the unit row on the resolved glyph stroke.
- Verb painted ≥ 4.5 at rest AND hovered, both engines, both themes; box ≥ 3:1.
- Glow byte-matches crayon-gold at α .3 in 5/5 chromium runs; `filterBudget` 9 exact, union
  45,572 ± 2% / 6,673 ± 2% on the dist.
- G9 per-anchor at C ≥ 0.05 within 5° of the five anchors: off-anchor share ≤ the exception ledger's
  cap (solver rainbow, peer walk, difficulty crayons named and summed), both engines, light and dark;
  the born-RED control (one anchor moved 6°) REDs.
- `check-ink-pressure` (KIN + CORRIDOR, self-test red), `check-theme-tokens` (alias assertion, its
  plant red), `check-copy-register` BARE, `check-font-coverage` unchanged, `lint:motion`,
  `test:prod-shake`, `test:golden:bytes`, `test:support-floor`, `test:unit:count`, `lint:knip`,
  `lint:eslint` — each bare.
- π: `rect-census-fold.mjs` prototype vs HEAD control (one pointer regime declared); R6 heading census
  unmoved; R3 wobble unmoved; goldens: `cell-light` moves by the pen's ink only (~2,292 px, `a8fee1f5`
  reading, re-derived and DECLARED — no re-mint in the loop); `grid-corner-light` 0 px;
  non-board 0 px.

**Crops** (≤ 4, ≤ 150 KB, cited): (1) the board's top-left 330×210 at fills 5 / 50 / 99 / won as one
strip, light chromium — the lift; (2) the same strip DARK — the 1.037 decision, for the owner's eye;
(3) the armed confirm HOVERED, light, both engines side by side; (4) one write of twenty, webkit,
after the cure — one front where HEAD paints four runs.

---

## 9 · Born-RED gates (HEAD reading stated)

| id | asserts | HEAD `74a2b5d9` |
|---|---|---|
| **G0 segments** (section) | one form, 25/123/246/493/599, × 2 engines × dpr 1/3, share within 2 pts; live gauge chromium ≈ webkit within 2 pts at p = 0.05/0.25/0.50/1.00 | RED at 493 (`a8fee1f5` 0.921 vs 0.228; re-read) |
| **G1 kinship** (in `check-ink-pressure`) | KIN rows: progress-ink within 5° of crayon-gold, user-ink within 5° of crayon-blue, per theme through `var()`; self-test moves a token 6° → RED | RED (11.5° / 41.3°) |
| **G2 corridor** | node: token-arithmetic corridor per theme, margin ≥ 0.25 at α 1 on both grounds (labelled arithmetic); browser: painted modal core ≥ 3.0 on both grounds, both engines, both themes; `stroke-opacity` == 1 | RED (light painted 2.876; α 0.95) |
| **G3 the win** | band median L +≥ 0.09 AND post-win stroke resolves to `--color-gold-star`; layered ablation ΔL 0.000 | RED (0 post-win chromatic px) |
| G4 print / forced / contrast | `.progress-trace` `#000` / `CanvasText`; `prefers-contrast: more` → 12 u + `--color-gold-ink`; `.attribution-tape` hidden in print | RED (`rgb(139,92,246)`; the tape prints) |
| G5 the verb | armed ribbon chroma > 0 AND painted ≥ 4.5 at rest AND hovered, both engines, both themes; box ≥ 3:1; ≥ 1 ribbon per engine | RED (achromatic) |
| G6 the digit | painted hue within 5° of crayon-blue AND ≥ 4.5 on card and background; unit row on the resolved glyph stroke | RED (11.5°) |
| G7 the glow | painted glow byte-matches a resolved token at its alpha, 5/5 runs | RED (inline `rgba`) |
| G8 alias law (exit code) | `check-theme-tokens`: `strays ⊆ {teacher-red, gold-star, pencil-graphite}` else exit 1; self-test plants a third name | GREEN at HEAD, its plant RED — a regression guard with an exit code (the charter's row) |
| **G9 per-anchor census** | every chromatic px at C ≥ 0.05 within 5° of one of the FIVE anchors or inside the named exception ledger (rainbow, walk, difficulty), share reported and capped; control: one anchor moved 6° REDs | RED (the violet is 41° off every anchor) |
| G10 the tween | ≤ 15 `d` re-cuts per write; p95 within +5 ms of control both engines; PRM: 0 re-cuts, the front lands on the exact fraction | RED (no front; dashoffset) |
| G11 no stock hex | `#2563eb` / `#60a5fa` / `#8b5cf6` / `rgba(196,181,253` absent from `index.css` and `HandwrittenGlyph.vue`; `#7c3aed` exactly once (`--color-solver-ink-2`) | RED |
| G12 guards, GREEN by construction | worst-of-four painted non-decreasing vs HEAD; digit print/forced; rainbow tolls; peer worst over 40; `filterBudget` 9 + area; font-coverage; live-regions; lint:motion | must stay |

## 10 · What the owner disposes (U-10), and what the agglomerator seats

Owner: the gauge as the one opaque stroke on the board (α 1, crop 1); the dark win at 1.037 (crop 2 —
the line turning gold vs a lost gauge); the dark pen (`#47a7ff` 7.34 vs `#0189e8` 5.12 vs `#0180d8`
4.53); the post-win 2.53 hedge; the front's draw vs step (G10's two arms). Agglomerator: `poseFronts`
is one primitive for three consumers and ACC-GRAPHITE's tally; the guard's ground deletion is
coupling 4's law reached by five families — write it once; the print/forced arms incl. the fold's tape
are a section row — write once; the motion rungs are MOT-LADDER's — consume once. Nothing closes here.
