# PASS-2 CRITIQUE · MRK-LIVE · The living mark

Adversarial, non-author. The spec is `pass2/synthesize/MRK-LIVE.md`; the prototype is
`pass2/prototype/MRK-LIVE/` on worktree `wf_8630d340-e56-36` (base `a8fee1f5`, uncommitted).
Everything below that carries a number was taken by THIS lane on its own dev server
(`127.0.0.1:4241`, private `cacheDir`, killed before returning), with a probe written without
reading the prototype's assertions first: `critique/MRK-LIVE/probe/crit.probe.ts`, logs in
`critique/MRK-LIVE/logs/`. No crop was cut — every finding here is a number.

**VERDICT — ADVANCE at 78%.** The design holds up under a harder census than its own, and one
defect the prototype did not look for is real in both engines.

---

## 1 · What I re-measured, and what it says

### 1.1 The tab order is wider than the gate, and the ring survives it (STRENGTH)

G-LIVE-3 asks for "≥9 stops incl. `.staging-btn` and `.guard-btn` by name". The prototype banked
**10**. I walked the WHOLE keyboard order on the real sudoku surface instead of a named list:
`T1-taborder-chromium.json` — **31 stops to `body`, every one of them exactly ONE `.focus-ring`,
maximum framing error 0.00px**, `outline-style: none` at every stop, and the single ringless stop
is `input.cell-native-input` carrying the board's own ink (the declared exemption, `ownInk: true`).
`unmarkedCount: 0`. That covers hosts the prototype never named: `button.tuner-toggle`,
`attribution-trigger`, two `<a>`, `sun-moon-toggle` (104×104, the 54px bleed), `logo-trigger`
(426×112), `drawer-tab`, fourteen `ctrl-btn`, `icon-btn.deal-btn`, `icon-btn.invite-btn`, four
`icon-btn.group`, `info-btn`. The global `:focus-visible { outline: none }` is the riskiest single
line in this diff and it is clean: the drawn ring reaches every stop the UA outline used to.

WebKit could not be walked this way — PW-WebKit's Tab visits form controls only, so my webkit run
banked 4 stops (`T1-taborder-webkit.json`) and proves nothing. That is my instrument's limit, not
the design's; the prototype's own `D-stops-webkit.json` drives with `focus()` and reads 1 ring per
stop. Named as gap 11.

### 1.2 The living swap reaches nothing else (CONFIRMED, both engines)

`T3-cascade-{chromium,webkit}.json`, re-derived independently: with cell 40 focused, a conflicting
cell, a peer-cursor cell and a hovered cell each compute `.cell-ghost-path` opacity **1** at
`data-mark-pose` 0, 1, 2 and 3, while the living cell's four paths read `1,0,0,0 → 0,1,0,0 →
0,0,1,0 → 0,0,0,1`. Identical in both engines. G-LIVE-8 stands. The reason it stands is
structural and worth naming: the law is in the selector (`[data-mark-pose=N] .game-cell:has(input:
focus-visible) …`), so "the living cell is the focused cell" cannot drift from its enforcement.

### 1.3 The contrast claims verify against my own reads (CONFIRMED)

`T4-ink-chromium.json`: the ring's computed stroke is `rgb(58,123,196)` (#3a7bc4, no alpha) and
the page ground reads `rgb(251,250,249)` light / `rgb(17,15,14)` dark. Carried through the WCAG
relative-luminance formula: **4.188 light, 4.379 dark** — the 4.19 / 4.38 the rewritten
`index.css:219` comment claims, to the digit. The board stop I derived analytically from the
shipped values (0.95 stroke over a 0.08 fill of the same ink over `253,253,252` / `19,18,17`):
**3.609 light, 3.720 dark**, against the prototype's painted 3.62 / 3.69 and the spec's predicted
3.61 / 3.73. Every stop clears 1.4.11's 3:1 in both themes. The "one value on purpose" thesis
survives its own instrument — the hue census is byte-identical to r0, so nothing here re-values a
token.

### 1.4 Chair §6.11 gate 2 was asserted, never banked — and it PASSES (GAP CLOSED)

The chair's second laminate gate is "the rim on a selected because-cell reads ≥3:1 against the
selection body". The prototype's `G-laminate-*.json` carries ΔL\* 0.00 (gate 1) and the rim's
computed `box-shadow` string, and **no ratio at all** — its instrument clips the centre 40% of the
cell, which is the body and never the rim. The README nonetheless prints G-LIVE-11 GREEN with gate
2 inside it.

I scanned the cell's own edge from painted bytes instead (`T5-rim-*.json`, a 2px-tall clip across
the cell at dpr 1, both themes, both engines). The scan reads, left to right: rim, bare card, the
blue selection stroke, the 0.08 body — so the rim sits OUTSIDE the ring and composites on paper,
not on the wash the spec reasoned about. Measured:

| engine | theme | rim | body | rim vs body |
|---|---|---|---|---|
| chromium | light | 193,64,94 | 238,243,247 | **4.52** |
| chromium | dark | 225,110,130 | 23,27,31 | **5.57** |
| webkit | light | 179,51,81 | 238,243,248 | **5.36** |
| webkit | dark | 236,120,141 | 23,27,32 | **6.29** |

Gate 2 is green with room. The finding is a BANK defect, not a design defect: the number belongs
in the lane's own log beside the gate it satisfies. Caveat carried honestly — like the prototype's,
my `.cell-because` is injected (the real one is a v-if behind a whole technique run), so both
readings share that limitation.

### 1.5 The estate's own specs are green on my server

`spoken-gallery` + `gallery-guard`, both engines, against 4241: **30 passed, 0 failed**
(`scratchpad/estate.log` — the run is reproducible from `probe/pw.estate.config.ts`).
`check-copy-register` — 0 em/en dashes, 0 unadmitted jargon, 2 admitted (M16 clear).
`lint:motion` — 34 specs, each declaring its motion. `vitest src/pencil/grid/gridPaths.test.ts
src/games/shared/DigitCell.test.ts` — 36 tests pass, which is what pins pose 0 byte-identical to
`generateCellRects`' own string and therefore keeps the RESTING board pixel-identical.

---

## 2 · The defect this pass did not look for

**THE RESIDENT RING IS STRANDED BY THE ESTATE'S OWN MOTION.** `T2-travel-{chromium,webkit}.json`:

1. Tab to `.drawer-tab` at 1280×800. Ring lands, framing error **0.00px**.
2. Press it. The drawer's sheet slides and the tongue travels with it — host `left` 761.89 → 952.
3. Focus never leaves the tongue (`stillFocused: true`).
4. The ring does not move. Final framing error **190.11px** (chromium) / **190.16px** (webkit).

The ring is now a blue hand-drawn rectangle sitting over the board, framing nothing, while a
keyboard user's focus is 190px away on a control with no indicator at all. Both engines, first try,
no injection.

This is not an edge case dressed up as one. §6's law is "one drawn ring … on whatever the AX tree
says has focus"; G-LIVE-4 bounds a LANDING, a 240px scroll and a 1280→1024 resize, and the
component's own comment reasons carefully about a landing that arrives mid-travel — but every one
of those is a *new* target. `take()` short-circuits on `el === target.value` and calls `measure()`
once, and the estate's motions that move a box under a RESIDENT focus (the drawer glide, the dock
sheet, `--logo-scale`, a reveal stagger, a font swap) fire no `scroll`, no `resize`, and no
`ResizeObserver` when the box translates without resizing. It is also precisely the mechanic the
charter warns every lane about in its own sentence — "the dock sheet SLIDES" — and the one W2
landed.

It is a cure, not a rewrite, which is why this is ADVANCE and not BLOCK: re-arm `settle()` on a
`transitionend`/`animationend` from the target or its ancestors (the estate's one-shots all end in
one), or watch position the way the component already watches size. Whatever the cure, G-LIVE-4
needs a born-RED row that presses the tongue while focus is resident.

---

## 3 · Checklist

| item | reading |
|---|---|
| vacuous convergence | clear — every gate names a number, a RED it beat, and where |
| spec-cites-itself | clear — r0 instruments copied and re-pointed; hue/law census byte-identical |
| gates that cannot fail | **HIT** — `spoken-gallery.spec.ts` `ringWhole()` was rewritten in this diff for the drawn ring, but the ring is now `position: fixed`, so the scrollport it tests against can no longer clip it: the `air < out` arm cannot fire for the reason it was written. Green, and no longer load-bearing. The spec is W3's. |
| elegant-reduction trap | clear — no "and then the hard part" |
| legacy aliases | clear — six bespoke rings deleted, not renamed; `outline-ring/50` gone |
| masked fallbacks | **minor HIT** — `fromDocument()`'s exempt fallthrough is `el.querySelector(FIRST_OPTION)`, which can return `null`; the spec says "never null". Measured green on the deck, unguarded in code. |
| unverified gestalt | clear-ish — four crops, real surface, both engines; I read 1 and 3. The armed verb's *meaning* is explicitly deferred to U-10, which is the right place for it. |
| consumer-less substrate | clear — `--focus-ring-outset` has four declaring hosts and is read at all 31 stops via the registered `@property` default |
| the generic default | clear — nothing on frontend-design's tell list; the mark is the house hand |
| the pixel it did not declare (pi) | clear AT REST (no focus → `cellFrames` is `[]`, one path per cell, no `.focus-ring` node; pose 0 byte-identical, unit-pinned). **Declared and unminted** for focused goldens — no pi claim is made and the dist suites have not run. |
| the constraint it forgot | **HIT** — W2's landed sliding sheet is what strands the ring (§2) |
| AA · filterBudget · M16 · decided history | AA verified independently (§1.3, §1.4); budget 9/9/9 with `filter: none` on every ghost path and population exactly +3; M16 0/0; R6 laws byte-identical except R1, reported MOVED |

---

## 4 · Open gaps (each a sentence that closes it)

1. Re-arm the ring's `settle()` when a RESIDENT target's box translates — a `transitionend`/
   `animationend` listener on the target or its ancestor — and add a born-RED G-LIVE-4 row that
   focuses `.drawer-tab`, presses it, and asserts ≤0.5px after the glide (today: 190.11 / 190.16px,
   both engines).
2. Re-measure G-LIVE-1 (σ over time at 4×4/9×9/16×16 inside HandDrawnGrid's shipped band) on the
   pass-2 build instead of carrying pass 1's 0.0257/0.0421/0.0397px on an argument.
3. Bank the rim-vs-selection-body ratio in the lane's own laminate instrument so chair §6.11 gate 2
   has a number behind it (this critique's 4.52/5.57 chromium, 5.36/6.29 webkit will do).
4. Run the six dist-bound suites (visual-golden, filter-census, wordmark-integrity,
   theme-bake-freshness, theme-quadrants, throttled-void) once W8 §8.1 releases dist, and make the
   pi claim then — not before.
5. Land G-LIVE-6 and its negative control as an estate spec that declares its motion, rather than
   as test J inside `probe/p2proto.probe.ts`, and state in the row that PW-WebKit cannot emulate
   forced-colors so the arm is chromium-only by instrument.
6. Take the WebKit 16×16 phone trace on a quiet box with its PRM control beside it, since pass 1's
   2/8/0/0 long frames is still the last word and wanted a quiet box then too.
7. Guard `fromDocument()`'s exempt fallthrough against a `null` `querySelector` result, or drop
   "never null" from the spec's §6 sentence.
8. Decide whether `useMarkPose` may enrol the shared beat unconditionally: `FocusRing` is mounted in
   `App.vue` for the app's life and `GameBoard`/`GameGallery` each add one, so `boilBeat.ts`'s
   ref-counted subscriber floor ("an empty page returns to the zero-subscriber ambient floor") can
   never be reached again — enrol on first landing and release on rest, or measure the idle cost
   against T4-P1's census and say the floor moved on purpose.
9. Get an owner disposition on the R6 R1 rebase (`research/MRK-LIVE/instruments/R6-R1-rebase.diff`):
   the family's whole token thesis is that this chromatic token has ONE value in both themes, which
   is the law as worded, so the law is re-worded or the design is.
10. Restate `ringWhole()`'s assertion so it can still fail — the drawn ring is `position: fixed` and
    unclippable, so the clause that made it a gate is inert; W3 owns that spec and should say what
    it now pins.
11. Re-take the tab-order census in WebKit with a `focus()`-driven walk (PW-WebKit's Tab reaches
    form controls only, so this critique's 31-stop / 0-unmarked result is chromium-only).
12. Remove the killed first batch's `logs/G-LIVE-*.json` (timestamps 01:49–04:49) from the bank, or
    move them to a `stale/` subdir: they are declared in the return but a reader citing the dir will
    cite numbers this run did not take.

---

## 5 · Strengths worth carrying

- The law lives in the selector, not in a convention: `[data-mark-pose=N] .game-cell:has(input:
  focus-visible)` makes "the living cell is the focused cell" unfalsifiable by drift, and one
  attribute write per beat replaces N² component renders.
- `--focus-ring-outset` as a **registered** `@property` is the right seam: it computes to px even
  when a host declares a `calc()`, every undeclaring host reports the house default, and the
  clearance law (frame outset + frame stroke/2 + ring stroke/2 + 1px air) is arithmetic rather than
  taste. Bands measured disjoint by 1.00–1.25px at all four framed stops.
- One ink, one number, both themes, and the comment at `index.css:219` now carries BOTH readings
  and names the trade (1.04 spread bought at 2.4 points of contrast) instead of the dark arm the
  token never had.
- Deleting `.sudoku-cell:focus-within` is the kind of finding a design pass is for: it painted
  nothing only because `gameCell.css` is unlayered by accident, and layering that sheet for any
  reason would have returned a 50% accent wash nobody chose.
- The prototype's own deviation (leaving `:nth-of-type(n + 2)` ungated) is the safer half and is
  argued, not hidden.

## 6 · Cross-pollination

- The registered `@property --focus-ring-outset` seam, and the clearance formula, belong to every
  family that draws a box around a box (MRK-ABS, ACC-*, and W2's dock chrome).
- The "one ATTRIBUTE write per beat, the cascade answers" shape is the general cure for any
  per-instance pose thread at N² (it already mirrors `.boil-frame-layer.is-active`).
- The one-ground rank (selection > peer cursor > hint laminate > unit) with the yield as a CSS state
  and the rank ALSO pinned at the binding by a unit test is a pattern every ground-stacking family
  should copy.
- The module-local two-entry memo outside a shared cap-24 LRU is the general answer for any caller
  that mints a fresh key per keystroke.
- The failure in §2 generalises beyond this family: any fixed-position overlay that tracks a DOM box
  by scroll/resize/RO alone will be stranded by a translate. Whoever lands the attribution tape, the
  guard note anchor or a tooltip on the same idiom inherits it.
