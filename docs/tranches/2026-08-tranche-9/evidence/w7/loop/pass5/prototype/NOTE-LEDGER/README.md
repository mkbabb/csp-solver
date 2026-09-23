# NOTE-LEDGER — pass-5 PROTOTYPE

It RUNS. Work tree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46`,
detached at `74a2b5d9`, uncommitted: **10 files changed + 1 untracked (`motionRungs.ts`), +1445 −68**
against `74a2b5d9`. Advanced IN PLACE over the chair's bank `pass4/prototype/NOTE-LEDGER/pass4.diff`
(nothing replayed, nothing reset). Every π row names **`74a2b5d9`**: the shared control
`.claude/worktrees/w7-control`, served from its pre-built dist on **:4248**, verified by
`index-CubiZsMVSwTc.js` every time. The prototype was served as its own BUILT DIST, one per arm, on
**:4249** (prod-vs-prod, LAWS P4), each verified by its own hash. A dev-mode server on **:4247**
served L2's room only (`?wire=local` is DEV-only). chromium + webkit throughout. All servers killed
by recorded PID; the band reads empty at return. Every browser row loads ONE encoded payload, the
section's (NOTE-ERASE's pass-5 board: the classic easy 9×9, 30 givens, `encodeSudoku(3, …, 81)`
from `e2e/wire.ts`), and asserts the dealt givens before reading.

## GAPS FIRST

1. **The fork is still the owner's (U-10) and nobody but the author has looked at it.** Four values,
   three arms, framed on one payload. HOLD is the default because it is the deletion.
2. **ARM C's step form breaks L2 for a SPENT record.** Its clock is "the next write anywhere", and the
   watch is authorship-blind, so a peer's digit two boxes away steps down my proved record. An
   unspent record still stands (L2 12/12 on the wire, HOLD). STEP was not driven on the wire; the unit
   row (GATE 1c) is authorship-blind by construction and is the only reading.
3. **TINT's spent line one fails the per-column floor as often as the full-graphite line does**, and
   worse at the 50 % mass column: core median 5.17 light / 6.07 dark (exactly line two's pressure,
   as designed), but worst-column-at-50 %-median-mass 1.82–4.05 and 29–34 % of columns under 4.5
   (full graphite: 27–30 %). Same class as NOTE-ERASE's gap 1 (the hand's thin strokes at DPR 1–3
   fail a per-column floor at every rung). "AA ≥ 4.5" is true at the core median and a ceiling as a
   floor claim, for every arm.
4. **The @property law's clause 1 is still breached, and the census now says so in numbers.** The
   four `var()` in timing slots at `MarginNote.vue:282/296/297/491` resolve against NO static
   declaration (runtime-only: `motionRungs.ts` emits both the registration and the values). The node
   is MOT-LADDER's (registry §2.7); the four rows go green in §13's fold commit, the one that lands
   the seven `@property --motion-*` at file scope in `index.css` and deletes `motionRungs.ts` and the
   `MOTION.rungs` stub. Not patched here: a static block in this tree would be a second mint.
5. **Line two is still `display: none` on both landscape phones** (844×390, 812×375: in the DOM with
   its text, 0×0, both engines). Depth ONE on B6's split-grammar row, the owner's. Priced: shown
   there, it puts **+17 px (chromium) / +16 px (webkit)** of document past the fold at both cells
   (scrollHeight 410 → 427/426, 395 → 412/411). The berth "through the tab" is NOT built: nothing
   in this tree puts line two in the drawer.
6. **The desk run-on is priced, not cured**: 7.19 px between the two runs of ink at 1280×800, both
   engines, re-read on the pinned payload (line one 18.18 px full graphite, line two 14.05 px quiet).
7. **The pass-5 frames were shot on the calc form of row 7's reserve**; the tree now carries
   `min-height: inherit`. Both compute 20.8 px at 390×844 (the phone composite's cell) and neither
   applies at ≥1024 (the desk composite's), so the frames' pixels are the final tree's by
   construction, not by a re-shoot. Every NUMBER below the frames is from the final tree.
8. **Cost not taken as a rate**: the strike watch now reads the whole board's ink
   (`Object.values(props.values).join()`, 81–256 cells per write) instead of the two records'
   referents, because ARM C's clock needs "any write". No per-keystroke rate was measured.
9. **HOLD pays for ARM C's bookkeeping**: the `spent` stamp runs on every arm, and
   `.margin-note.is-spent` is a dead rule on three of four builds (one selector).
10. **AGE's desk line two reads a worse sensitivity row** (under-floor fraction 0.33–0.38 vs HOLD's
    0.12–0.18): with line one empty its line box rises into the card's shadow, so the text's own
    ground is not uniform. Core median unchanged (5.17 / 6.07).
11. **The second control (main-HEAD) was not served**: §7's charter carries no owner-mark row
    (M15–M19 are §10's and §13's), so pass5/CHAIR-RULINGS §1.5 does not bind a row here.
12. **The wave's evidence cap is RED at return, and not by this lane alone**: `scripts/check-evidence-policy.mjs`
    exit 1, **105 PNGs / 3,114,009 B > 2,097,152 B** (the chair's post-sweep reading was 72 /
    1,837,378 B). Largest holders: `intake-owner-2026-09-22/prototype/G-MOTION/crops` 419,675 B,
    `r0/r7-owners-eye/frames` 411,207 B, `pass1/critique/NOTE-LEDGER` 140,213 B, then pass-5
    ACC-FIVE 123,014 · PAL-WALK 111,236 · **NOTE-LEDGER 102,197 (this lane, 2 crops)** · MRK-LIVE
    95,608. The pass-4 crops these two replace were already swept (0 B credit). The sweep is the chair's.
13. **Nothing here was read by a non-author.** The pass-5 number is the CRITIC's.

## NUMBERS

### Row 1 · GATE 1b re-cut, and the arm census (born-RED per arm, HOLD as the control, one run)

Pass 4's GATE 1b ended on the second ASK, where AGE and HOLD agree; it passed on the arm it named.
Re-cut to end on the second ANSWER (ask, answer, ask, answer), the only moment the arms differ.
GATE 1c is new: a proved record, then a true digit elsewhere; it tells the four arms apart.
`instruments/arm-census.sh` flips the one token, runs BOTH whole unit files, restores by sha1:

| arm | exit | tests | the rows that red |
|---|---|---|---|
| **hold** (default) | **0** | 45 passed / 45 | — |
| age | 1 | 3 failed / 45 | GATE 1 (`expected '' to be 'only 4 fits here'`), **GATE 1b re-cut** (`expected '' to be 'only 2 fits here'`), GATE 1c |
| step | 1 | 1 failed / 45 | GATE 1c, text clause (`the proof is not spent by the next digit`) |
| tint | 1 | 1 failed / 45 | GATE 1c, class clause (`expected [ 'margin-note', 'is-spent' ] to not include 'is-spent'`) |

Restored sha1 `a9e8142f…` (`logs/arm-census.txt`). Every arm is live code and every arm has a row
that sees it.

### Row 2 · the undefined-token census, scope-keyed, RUN (`instruments/undefined-tokens.scoped.mjs`)

A copy of MOT-VERB's pass-4 reverse census with its critic's §2.4 cut: a declaration is global only
under `:root`/`html`/`*`/`@theme` or as a static `@property`; every other static declaration is
file-local; JS-emitted ones are runtime and never satisfy it.

| tree | unresolved bare `var()` | in timing slots | PLANT B (declared only in another file's scoped style) | PLANT P (declared at `:root`) | exit |
|---|---|---|---|---|---|
| prototype | **19** | **5** | RED | green | 1 |
| control `74a2b5d9` | 15 | 1 | RED | green | 1 |

The +4 are exactly this family's: `MarginNote.vue:282` and `:491` `--motion-note`, `:296`/`:297`
`--motion-whisper`, all "runtime-only (declared by nothing static)". The control's 15 are the
estate's own inline-style publishers (`--toggle-size`, `--washi-tilt`, `--refuse-dur`, …), declared
as inherited. The tree's `lint:theme-tokens` reads **0 on both** (forward half only; blind to this).

### Row 3 · π WITH THE LEDGER POPULATED, the keyboard driving it

`probe/ledger.probe.ts`. The driver writes the digit INTO THE CELL THE HINT NAMES (the empty
because-cell whose solution is the named digit; see incident 1). Pose P3 = ask · answer · ask: both
arms hold the SAME line one (`only 2 fits here`, asserted `lineOneAgrees: true`), the prototype adds
line two (`only 5 fits here`). 9 keys × tag × x/y/w/h × 14 computed paint properties.

| pose | cell | arms | unclaimed deltas | claimed deltas | scrollHeight proto/ctrl | computed filters | control vs control |
|---|---|---|---|---|---|---|---|
| **P3** (two lines) | 1280×800 fine | all four, both engines | **0** | **0** | 800/800 | 25/25 | **0** |
| **P3** (two lines) | 390×844 coarse | all four, both engines | **0** | **0** | 844/844 | 25/25 | **0** |
| P1 (ask · answer) | 1280×800 | HOLD/STEP/TINT | 0 | `.board-margin` h +2.813, `.margin-note` (held line vs control's emptied one; TINT + `paint.color`) | 800/800 | 25/25 | — |
| P1 | 390×844 | HOLD/STEP/TINT | 0 | `.margin-note` w/h (same) | 844/844 | 25/25 | — |
| P1 | both | AGE | 0 | `.margin-note` y (the empty voice) / h 20.797 | equal | 25/25 | — |

The critic's +2.81 px was populated-against-empty; with the arms in the same state it is **0.00**.
At P1 the line-one difference IS the fork (the control empties the line on the write); the +2.813
at 1280 is F-ERASE-1's populated-vs-empty strip figure, claimed surface only.

**π at rest, EMPTY** (nothing asked; `probe/empty.probe.ts`; HOLD's final dist vs the control):

| cell | scrollHeight proto/ctrl | deltas (both engines identical) |
|---|---|---|
| 390×844 coarse | 844/844 | `.margin-note` h 20.80 (the voice's own box, claimed); nothing else |
| 393×699 coarse | 699/699 | same |
| 844×390 coarse | **409/409** | same — the strip, `.app-layout` and docH equal the control |
| 812×375 coarse | **394/394** | same |
| 1280×800 fine | 800/800 | **none** |

(The calc form of row 7 read `.board-margin` / `.app-layout` +1.29 / +1.18 and docH 410/409, 395/394
at the two landscape cells on this row; `inherit` is what the tree ships.)

**Every row above was re-run on the FINAL tree** (`final-rerun`: the four arms rebuilt, rest · π ·
push · landscape on both engines, `probe-*-final-*.json`) and reproduced to the hundredth; AA was
re-run on the calc-form build (`probe-*-aa2-*.json`), whose computed values equal the final tree's
at every cell AA reads (390×844 portrait and 1280×800).

### Row 4 · ARM C, built in both forms behind the one token, and every arm measured

`const LEDGER_FULFILLED = "hold" as "hold" | "age" | "step" | "tint"` (`GameBoard.vue`). The `as`
keeps the union, so each arm compiles against the others (pass 4's TS2367 was the bare annotation
narrowing to its literal); read once in the watch, once in the template.

- **step** — HOLD until the next digit lands anywhere, then AGE. The proof stays up for exactly one
  beat.
- **tint** — HOLD the line and the size; a spent record wears line two's quiet ink
  (`.margin-note.is-spent { color: var(--ink-press-quiet) }`, the token consumed bare).

| reading (both engines agree unless noted) | HOLD | AGE | STEP | TINT |
|---|---|---|---|---|
| canonical loop, `twoLineAtRest` (3 rounds) | `[F,T,T]` | `[F,F,F]` | `[F,T,T]` | `[F,T,T]` |
| after the next write: line one / line two | `only 9…` / `only 2…` | `""` / `only 9…` | **`""` / `only 9…`** | `only 9…` (spent, `color(srgb .149 … / 0.68)`) / `only 2…` |
| π P3 unclaimed / claimed / ctrl-vs-ctrl | 0 / 0 / 0 | 0 / 0 / 0 | 0 / 0 / 0 | 0 / 0 / 0 |
| filters (computed, both cells) | 25/25 | 25/25 | 25/25 | 25/25 |
| unit, both files | 45/45 | 42/45 | 44/45 | 44/45 |
| cost in source | the deletion | one `||` term | one `&&` term + `spent` stamp | one class + one rule + one prop |
| built identity (final) | `index-Cder9HygqQ5l.js` | `index-DTnv7bkPq3ie.js` | `index-DQqkONEsGFmQ.js` | `index-BXE037scA9iq.js` |

**Painted AA, the text's own ink extent, every arm, P4 (ask · answer · ask · answer)** —
core median `[worst column at 50/70/90/100 % of median mass]` · fraction of columns under 4.5:

| cell · theme | line one, HOLD = STEP (full graphite) | line one, TINT (spent) | line two (all arms at 390; HOLD at 1280) | line two, AGE at 1280 |
|---|---|---|---|---|
| 390×844 coarse · light | chr 14.52 [3.27/3.45/4.95/4.95] 0.30 · wk 14.52 [4/4/4/4] 0.30 | chr 5.17 [2.13/2.15/2.66/2.66] 0.32 · wk 5.17 [2.36/…/2.36] 0.31 | chr 5.17 [3.79 ×4] 0.12 · wk 5.17 [2.73/2.73/3.89/3.89] 0.16 | — |
| 390×844 coarse · dark | chr 12.25 [7.6/7.94/9.74/9.74] 0.27 · wk 12.25 [5.18 ×4] 0.29 | chr 6.07 [4.05/4.21/4.21/4.98] 0.29 · wk 6.13 [3.03 ×4] 0.31 | chr 6.07 [3.75/5.78/5.78/5.78] 0.14 · wk 6.13 [2.74/3.85/5.3/5.3] 0.11 | — |
| 1280×800 fine · light | chr 14.52 [2.53/3.54/3.54/3.54] 0.29 · wk 14.52 [4.49/4.49/5.35/5.35] 0.29 | chr 5.17 [1.82/2.2/2.2/3.05] 0.33 · wk 5.17 [1.95/2.53/2.53/2.79] 0.34 | chr 5.17 [2.13/4.67/4.67/5.17] 0.13 · wk 5.17 [3.5/3.5/3.54/3.54] 0.18 | 5.17 [2.42/2.42/2.42/2.63] 0.38 · 5.17 [2.45 ×4] 0.38 |
| 1280×800 fine · dark | chr 12.25 [6.01/6.01/8.13/8.13] 0.27 · wk 12.25 [6.79/6.79/6.79/7.57] 0.27 | chr 6.07 [3.34/3.34/4.29/4.29] 0.28 · wk 6.13 [2.73/3.75/3.75/4.09] 0.30 | chr 6.07 [4.1/4.1/4.1/6.01] 0.12 · wk 6.13 [1.85/5.62/5.62/5.84] 0.16 | 6.07 [2.42/3.4/3.99/3.99] 0.33 · 6.13 [1.97/…/2.95] 0.34 |

Every core median clears 4.5 on both themes; no arm clears a per-column floor (gap 3). The reader
is NOTE-ERASE's pass-5 `paintedAA` (modal-pixel ground, per-column core, the sensitivity row),
clipped to the text Range (incident 3).

### Row 5 · the fork's frames — ONE payload, the arm the only variable per column

| crop | engine · theme · viewport · pointer | shows | retires (pass4/SWEEP.md) |
|---|---|---|---|
| `B-LEDGER-390x844-light-coarse-four-arms-P1-P2-chromium.png` (64,878 B) | chromium · light · 390×844 · **coarse** (`hasTouch`, `(pointer: coarse)` witnessed) · DPR 3 at 0.5 | rows HOLD / AGE / STEP / TINT; columns P1 (ask · answer), P2 (… · next write) | `prototype/NOTE-LEDGER/F2-390x844-light-coarse-hold-at-rest-chromium.png` + `…-age-at-rest-chromium.png` |
| `B-LEDGER-1280x800-light-fine-four-arms-P1-P2-chromium.png` (37,319 B) | chromium · light · 1280×800 · **fine** · DPR 2 at 0.55 | the same grid at the desk | `prototype/NOTE-LEDGER/F3-1280x800-light-fine-deskpair-webkit.png` |

The author looked at both. Per column only the arm moves: STEP equals HOLD at P1 and equals AGE at
P2; TINT keeps HOLD's size and place at the quiet pressure; AGE leaves a quiet caption under an empty
line at both poses. **Uncontrolled variable, across columns only**: the next write moves focus, so
the board's selection wash sits on a different column in P2 than in P1. 102,197 B banked against
48,653 B retired (the wave's headroom was 259 KB).

### Row 6 · the landscape cell (W2 §2.2), witnessed coarse

`(pointer: coarse)`, `(orientation: landscape)`, `(max-width: 1023.98px)` all true. Line two in the
DOM with its text, computed `display: none`, both cells, both engines. Shown by an injected
override: scrollHeight **410 → 427 (chr) / 426 (wk)** at 844×390, **395 → 412 / 411** at 812×375.

### Row 7 · the voice's reserve, and the push it cures

`MarginNote.vue`, in the `<1024` block: `.margin-note { min-height: inherit; }` — the voice takes the
BLOCK's reserve, never a second number. Two narrower forms were built, measured and rejected:
- the calc form (`calc(var(--type-body) * var(--type-leading-caption))`) on every width grew the desk
  strip **+5.27 px** whenever line one was empty beside line two (the empty voice's box sits on the
  row's synthesized baseline) — AGE at 1280 P1, chromium;
- the same calc scoped to `<1024` grew the EMPTY strip at rest on both landscape phones
  **+1.29 / +1.18 px, `.app-layout` +1.29 / +1.19, docH +1**, both engines (the voice's line box at
  17 px exceeds the block's 20.8 px reserve there) — F-ERASE-1's figure, the owner's ballot, which
  this row must not pre-empt.

The push (WAAPI hooked before any script; line one's rect read inside the hook):

| path | cell | line one at the call | keyframe 0 |
|---|---|---|---|
| displacement (P3), every arm | 390×844 | w 94.97 · **h 20.797** | `translate(0px, -15.390625px) scale(1.1429)` |
| **AGE fulfilment (P1) / STEP's next write (P2)** | 390×844 | **w 0 · h 20.797** (pass 3: 0×0) | **`translate(0px, -15.390625px) scale(1.1429)`** — identical to the displacement |
| displacement (P3) | 1280×800 | w 107.84 · h 23.61 | `translate(-115.03px, 3.17px) scale(1.2938)` |
| AGE fulfilment / STEP next write | 1280×800 | w 0 · h 0 at the row's baseline | `translate(-7.19px, -2.44px) scale(1.2938)` — from line one's own start on the shared baseline |
| HOLD / TINT fulfilment | both | — | **no push** (0 fired) |

Pass 3 measured `translate(0, −34.17) scale(1.3137)` off the 0×0 box.

### Row 8 · L2 on the wire, the r0 censuses, the L9 cite

**L2** (`probe/wire.probe.ts`, dev :4247, a real `?wire=local` room, A asks, B writes), HOLD:

| act | by the peer | by A herself (control) |
|---|---|---|
| a true digit elsewhere | stands (`only 5 fits here`) | stands |
| the named digit where it said | stands (fulfilled, held) | stands |
| another digit on its square | **struck** (`""`) | struck |

**12/12, both engines**; the struck row is the discriminator (a watch blind to the peer would leave
it up).

**The r0 R3 censuses** (`instruments/r0-*.probe.ts`: OUT re-pointed, the deal pinned to the payload),
HOLD dist vs control, both engines:

| census | acts | reading |
|---|---|---|
| R3-d (`marks.probe.ts`) | 10 | 9 identical to the control; **"type a digit": proto keeps `only 5 fits here`, control retracts** — MOVED |
| R3-g (`marks2.probe.ts`) | 5 | 3 identical; **"second H press" and "fill forced": proto keeps, control retracts** — MOVED |
| R3-a (`wobble.probe.ts`) | 1 | **RED on BOTH trees identically** (`selection ring σ 0.092px outside the grid's band [0.722, 2.886]px`) — inherited, §5/§6's subject, not moved |
| R3-a2 (`wobble.probe.ts`) | 2 | green both trees |

The three moved rows are a PROPOSED diff to r0's census table (`instruments/r3-census.PROPOSED.diff`),
the chair's to land.

**L9's cite** corrected at citation: `GameBoard.receipt.test.ts` now names the binding
(`:text="marginLive.text"`, `GameBoard.vue:1336`), not `:1313`.

### Row 9 · the hand's cut (R6 law 30, U-10)

The eight admissions stand by name. The estimate is corrected at citation: the gate printed
**46 → 53 ≈ +656 B** but lists **eight** rows; 46 + 8 = **54 codepoints ≈ +750 B** at the cut's own
4,312 B / 46 = 93.7 B per codepoint. Both strings in `check-font-coverage.mjs` now say 54 / +750.

### Row 10 · the derived+declared corpus keeps its self-test

Break-test: delete the declared `"solved it!"` → `check-font-coverage` **exit 1** with the
ransom-note sentence naming the string and `GameBoard.vue`; restored by sha1 `5443bcd8…` → exit 0.
The 415 KB pass-3 trim is the chair's (pass3 is frozen).

## THE SEATING (registry §6.6, LEDGER first) — consumed, not minted

`probe/seat.probe.ts`, P3 (two lines), HOLD vs control, both engines:

| cell | line two painted (`elementFromPoint` at its centre, no clipping ancestor) | grid / controls vs control | air to the controls below | a `2lh` in-flow reserve would add |
|---|---|---|---|---|
| 390×844 coarse | yes | **0.00 / 0.00** | 10.2 px | 20.8 px |
| 393×699 coarse (ACC-SIX's cell) | yes | **0.00 / 0.00** | 10.2 px | 20.8 px |
| 1024×768 fine | yes | 0.00 / — | — | 22.73 px |
| 1280×800 fine | yes | 0.00 / — | — | 23.63 px |

LEDGER's seat costs the column **0 px** (line two is out of flow below 1024). The seating REFUSES a
`2lh` in-flow reserve on this number: it would cost 20.8 px at the phone by the voice's own tokens,
against ACC-SIX's measured 27.2 px (a 6.4 px disagreement that is ACC-SIX's to explain, not this
row's to adopt).

## PRE-RETURN BATTERY (registry §2.11), each bare, the control's exit code beside it

| gate | proto | control `74a2b5d9` |
|---|---|---|
| `GameBoard.receipt.test.ts` + `GameBoard.notes.test.ts`, whole | 0 (45/45) | — (the rows are this tree's) |
| re-run on the SETTLED tree (after row 7's `inherit`): every gate below, both trees | all 0 | all 0 |
| `src/pencil` + both ledger files, settled | 0 — 10 files / 118 tests | — |
| unit estate, chunked by directory and whole | **0 — 68 files / 846 tests** | — |
| `font-census.spec.ts` whole, both engines, on the built dist | **0 (4/4)** | 0 (4/4, its own spec on its own dist) |
| `vue-tsc --noEmit -p tsconfig.json` | 0 | 0 |
| `eslint .` | 0 | 0 |
| `prettier --check` (the `lint` script's scope) | 0 | 0 |
| `lint:lanes` | 0 | 0 |
| `lint:theme-tokens` | 0 | 0 |
| `lint:sleep` | 0 | 0 |
| `test:e2e:projects` (`check-pw-projects --self-test`) | 0 | 0 |
| `check-pw-projects` (bare; check 8 green — no e2e rows added) | 0 | 0 |
| `lint:copy` (check-copy-register; no new product strings) | 0 | 0 |
| `lint:ink` · `lint:motion` · `lint:live-regions` | 0 · 0 · 0 | 0 · 0 · 0 |
| `lint:boundary` · `lint:knip` | 0 · 0 | 0 · 0 |
| `test:font-coverage` | 0 | 0 |
| filterBudget (computed filters, every π row, both engines) | 25 | 25 |
| built CSS vs the control's (selector diff) | only the family's 14 selectors + 2 keyframes; no utility minted from scratch | — |

## r0 / R6 ROWS

- MOVED: **R3-d** (1 act) and **R3-g** (2 acts) — PROPOSED diff under `instruments/`.
- NOT moved: §1 heading-voice and board-covisibility (not re-run this pass; §7 did not touch them —
  pass 4 read both identical to the control); R3-a (inherited red, identical on the control); R3-a2.
- Law 27: obeyed (the strip reads `--type-caption`, pass-4 rulings §1.3 act 2). L17: cited at the
  chair's wording (no `data-*` state attribute drives a style); this pass also removed an inherited
  `:data-tone` from the notes test's stub.

## THE REPLAY ROUTE

**In place.** `git diff --stat` at open read 10 files / +1325 −48 + `motionRungs.ts`, exactly the
pass-4 README's list. Line-count check at return: +1445 −68; the pass-5 delta over `pass4.diff`
(applied to a clean `git archive` of `74a2b5d9` in the scratchpad) is `GameBoard.vue` +36 −35,
`MarginNote.vue` +49 −21, `GameBoard.receipt.test.ts` +61 −19, `GameBoard.notes.test.ts` +15 −3,
`check-font-coverage.mjs` +25 −11; the other six files unchanged.

## INCIDENTS, SELF-DECLARED

1. **Pass 4's loop driver typed into the FOCUSED cell, and the hint does not move focus.** On this
   payload the first hint names cell 40 while focus sits on cell 2, so the driver wrote a WRONG digit
   elsewhere and the record merely "stood"; pass 4's "fulfilment" readings came from a driver that
   may not have fulfilled anything (its board was random, so I cannot say which rows). This pass's
   driver writes into the named cell and asserts the digit landed.
2. **The stutter law bit the loop**: two different cells both "only 5 fits here" is one record
   (GATE 12), so a probe that asks twice can read one line. The canonical loop on this payload does
   not hit it once the driver answers the right cell.
3. **The first AA run read AGE's desk line two at 1.80 / 1.48**: the element box, not the text
   (`flex: 1 1 0` with line one empty spans 1,258 columns into the card's shadow). Re-cut to the text
   Range and re-run on all four arms; the first run's JSON stays banked (`probe-*-{chromium,webkit}.json`)
   and is superseded by `probe-*-aa2-*.json`.
4. **Row 7 was cut twice in this pass** (calc on every width → +5.27 px at the desk; calc below 1024
   → F-ERASE-1's +1.29 / +1.18 at landscape) before `inherit`. Four arm dists were built three times.
5. **A stray `vite preview` was launched with a Playwright config by a slip in a compound command.**
   It died at start (no listener, no process with this tree's cwd; checked).
6. **The prettier red was partly inherited from pass 4** (`MarginNote.vue`'s template,
   `GameBoard.receipt.test.ts`'s GATE 1, `check-font-coverage.mjs`), invisible because pass 4's
   battery did not run prettier. Formatted in the tree; control 0.
7. **The scratchpad is shared with sibling lanes** (NOTE-ERASE's configs point at it); this lane's
   scratch lived under its own `ledger/` subdirectory.

## FILES

Product (work tree, uncommitted): `src/games/shared/GameBoard.vue` · `src/pencil/chrome/MarginNote.vue` ·
`src/pencil/config/motionRungs.ts` (new, §13's, BORROWED) · `src/pencil/config/pencilConfig.ts` ·
`src/main.ts` · `src/assets/index.css` · `src/games/shared/GameBoard.receipt.test.ts` ·
`src/games/shared/GameBoard.notes.test.ts` · `scripts/check-font-coverage.mjs` ·
`scripts/check-ink-pressure.mjs` · `e2e/font-census.spec.ts`.

Logs: `probe-<arm>-<engine>.json` = the first full run (calc form, AA superseded — incident 3) ·
`probe-<arm>-aa2-*` = the AA re-cut · `probe-<arm>-final-*` = the final tree · `empty-*`, `seat-*`,
`l2-wire-*`, `arm-census.txt`, `undefined-tokens-*.txt`, `r0/` (the copies' own banks) ·
`battery.txt`, `unit.txt`, `runs.txt` (the runners' console lines).

Evidence (this dir): `probe/` (ledger, empty, seat, wire probes + five scratch configs) ·
`instruments/` (arm census, builds, runners, the scoped census, the compositor, three r0 copies, the
PROPOSED r0 diff) · `logs/` (summaries only; the largest 9.9 KB) · two crops, 102,197 B.
