# MOT-VERB — pass 1, CRITIQUE · the pencil verbs, adversarially read

Critic did not write the spec or the prototype. Everything below is either a reading taken on
this tree or a citation into the diff. Instruments beside this file in `critique/MOT-VERB/`:
`critic-probe.mjs` (playwright, chromium + webkit, both PRM regimes) → `critic-readings.json`;
`curve-deltas.mjs` → `curve-deltas.txt` (the bezier arithmetic the pass never did).

Served the prototype's own `dist` on `127.0.0.1:4241` (4241 and 4244 were the only free ports
in the band at critique time; the rest of 4230-4249 were held). No osascript, no Safari app, no
product file touched, nothing committed anywhere.

---

## 1. What I reproduced myself

| claim | my reading | verdict |
|---|---|---|
| `lint:verbs` GREEN | 0 unadmitted · 19 admitted · 0 stale · publisher 13/13 divergent 0 · own-ms 1 | reproduced |
| PRM at the ladder | `:root` under `reduce`: every `--rung-*` and `--verb-dusk-ms` = `0s`, **both engines** | reproduced |
| PRM on live elements | `.drawer-tab-text` 0.15s → **0s**; `.washi-label` 0.15s → **0s**, both engines | reproduced |
| the `transition: all` cure | `.sparkle-icon` computes `filter, transform` at `0.25s`, both engines | reproduced |
| the twins | built dist: chrome leave and deck leave carry the **identical** declaration (`opacity var(--rung-breath) var(--verb-lift-ease)`), so ratio 1.00 is structural, not sampled | reproduced |
| two tokens retired | live `:root`: `--ease-fadeOut` and `--ease-ghostDraw` resolve empty; `--verb-turn-ease` absent (published:false) | reproduced |
| `lint:copy` · `lint:theme-tokens` · `lint:motion` | GREEN · 0 unreferenced tokens · 34 specs | reproduced |
| `npx vite build` | exit 0, 633ms | reproduced |
| AA on both themes | the diff moves **zero** colour literals and zero `--color-*` rows (grep over the whole diff for `--color-`/`oklch`/`rgba(`/hex: no hits on a +/- line). Contrast is pi by construction — the family changes only how long a colour takes to arrive | verified |
| filterBudget | no filter config touched; live census on a bare 1280×800 load reads 25 elements / 12 distinct / 15 `<filter>`, identical both engines | verified (see §4 note) |

Six of the seven named gates do flip, and the ones I could re-take, I took. That half of the
record is sound and honestly written — including its own eleven gaps, which is more than most
lanes bank.

## 2. THE FINDING: this pass moves far more paint than it declares

The record names **two** visible retimes (wring-down 340→250, ghost 180→200). Reading the diff
declaration by declaration, the sweep changes **~17 durations, ~9 delays and ~20 curves**. The
curve substitutions are not renames. `curve-deltas.txt`, max |Δprogress| over the run:

| substitution | max Δ | where |
|---|---|---|
| `anticipatePop` → `lift` | **0.749** | the twinkle star's pop-IN (overshoot deleted; and the verb spelled on an arrival is LIFT, "a hand takes something off the page") |
| `standard` → `layDown` | **0.548** | AttributionCard ×4, GameCard label, gallery pip, both toggle icon crossfades |
| `ease-out` → `layDown` | **0.406** | DrawerTab tongue, `marks-fade-in` ×2 |
| `ease` → `layDown` | **0.375** | `share-pop`, `eraser-scrub`, CrayonHeart `.face`, the completion gold sweeps |
| `drawOn` → `writeIn` | 0.189 | the controls fade-in |
| `ghostDraw` → `writeIn` | 0.167 | the focus ghost |
| `accelIn` → `lift` | 0.032 | laminate lift-away, wring-down — **the record's unmeasured "within 2% AUC" claim is true** (ΔAUC 0.019); consider this gap closed |
| `noteWrite` → `writeIn` | **0.000** | logo caret, margin note — a true rename, and proof the new token duplicates a surviving one |

The declared surfaces are the gallery, the drawer, the dusk/toggle, the margin note and the
hover rows. The retimed rows include the **players well** (six declarations), the **progress
trace**, the **completion gold sweep**, the **attribution card**, the **gallery pip** and the
**answer-key laminate** — none of them on the list, none of them screenshotted, none of them in
any proof. This is the pi item verbatim: the pixel it moves that it did not declare.

Three consequences that are not merely bookkeeping:

1. **A banked design decision is erased.** In the built dist, `.player-row.is-arriving` and
   `.player-row.is-returning` are now **byte-identical**, as are their `.player-name` rows
   (`dist/assets/index-*.css`, quoted in `critic-readings` §built). The rule's own comment two
   lines above still reads "A RETURN IS LIGHTER THAN AN ARRIVAL … both land 40ms sooner". The
   six-rung ladder is too coarse to hold the distinction, the sweep spent the nearest rung, and
   no gate in this family can see that a decision died. The comment is now false in the source.
2. **The toggle's beat alignment breaks.** `.toggle-icon.is-active` goes from `300ms … 60ms` to
   `280ms … 150ms`. Its own comment says "incoming icon: 60-360ms rise with the bloom's first
   beats", and the bloom is an ADMITTED signature still at `800ms … 60ms`. The rise now starts
   90ms after the bloom it was tuned against, on the owner's most audited surface.
3. **R6's decided history is overwritten in at least three rows.** R6 §1.2 banks the laminate as
   "lay-down 280ms on `--ease-glassGlide`; lift-away 200ms on `--ease-accelIn` (**the erase-family
   asymmetry**)" — the sweep folds that asymmetry into LIFT. R6 §1.3 banks the guard ribbon at
   "240ms slide on `--ease-glassGlide`" — now 250ms. R6 §1.3 banks the DrawerTab tongue
   "straightens to 0° on hover over 150ms" on `ease-out` — now the glass curve. The charter binds
   this family to r0/R6; changing a banked row needs a ruling in the row, not a sweep.

## 3. THE GATE CANNOT FAIL ON ITS OWN THESIS

Two negative controls, run with `SRC=` against a copy of the prototype's `src/` (product files
untouched):

- I replaced a cured row's verb with a **legacy token**, keeping the rung
  (`ThermoTube.vue`: `var(--verb-lift-ease)` → `var(--ease-glassGlide)`). Gate: **GREEN**.
- I put a **semantically inverted verb** on an arrival (`SolverErrorNote`: `note-in … var(--verb-rubOut-ease)`,
  an erase curve on a note being written in). Gate: **GREEN**.

`HOUSE_CURVE = /var\(--(?:ease-[A-Za-z]+|verb-[A-Za-z]+-ease)\)/` — so rule 1 is "names one of
the house tokens", old or new, not "names a verb". Rule 3 only fences a term that already spells
a `--verb-*-ease`, so any row keeping a legacy curve is exempt from the rung law too. What
`lint:verbs` actually enforces is **no raw number and no browser keyword**. That is a real and
useful law. It is not the law the spec claims, and the difference is the whole thesis.

The semantic hole is structural, not just a regex: measured live at `:root`, the six verbs
collapse to **three curves** — `layDown` = `slide` = `turn` = `--ease-glassGlide`, `lift` =
`rubOut` = the retired `--ease-fadeOut`'s points, `writeIn` = the surviving `--ease-noteWrite`
byte for byte. Nothing downstream — no gate, no reader of the built CSS, no eye — can tell a
lay-down from a slide from a turn. The pass retires two `--ease-*` tokens for having no consumer
and mints four new names for curves that already had one.

Two more coverage holes:

- **The gate walks only `.vue` and `.css`.** Every WAAPI mover lives in `.ts`, so `spend()` is
  unenforced in script land — and TURN, the one verb with no published token and no CSS
  consumer, is therefore outside the gate entirely. The verb the record is proudest of is the
  one nothing checks.
- **`spend()` hardcodes `fill: "none", composite: "replace"`** while `writeIn` and `rubOut`
  declare `fill: "backwards"`. Its signature accepts them. A caller that spends `writeIn` gets
  silently the wrong fill arm — a masked fallback inside the primitive that is supposed to make
  fill a property of the mechanism.

## 4. Smaller, still real

- **The ledger's key collides.** `file :: declaration text` is stable under reflow (a good fix),
  but two identical declarations in one file share a key: admitting one admits the other
  invisibly, and `seen` can never tell them apart. The two `ghost-draw-on` rows in `gameCell.css`
  were exactly such a pair.
- **The I1 cure exempts a class, not a mover.** `if (animKey(a) === "") continue;` skips *every*
  script-made animation on the board subtree forever, not the fold. Closable in one line: give
  the fold's animation an `id` in `useFlipGlide` and skip by identity.
- **The publisher parses the TS by exact indentation** (`^ {2}([a-z]+): (\d+),$`, and an end
  sentinel that is the literal text `  },\n  /** House easing`). It fails loud rather than
  silently, which is the right failure — but a prettier reflow or one inserted comment reds a
  gate for a reason nobody caused, which is the defect this same pass cured in the ledger.
- **The filter figure is state-dependent.** The record reads 27/13/15; I read 25/12/15 on a bare
  load, both engines. Neither is wrong; the census is a function of what is mounted, so
  "identical on both dists" holds only for their paired run and is not a constant anyone can
  re-check later. The `filterBudget 9` law itself is untouched by the diff.
- **`.scene-controls`' PRM path** computes `all | 0s | ease` at rest in both engines: the rung
  rows for that element live behind `@media (prefers-reduced-motion: no-preference)`, so the
  ladder is not what zeroes it. Not a defect — but it means the "PRM is a value of the ladder"
  story is true for the rows that name a rung and the per-file blocks still do the rest, exactly
  as the record says they will until next pass.

## 5. Strengths, said plainly

- Six named gates flip and stay flipped on a rebuild, and the born-RED was re-measured on a
  pristine HEAD export rather than quoted. The 70 = 51 + 19 correction to the synthesis's
  70 = 52 + 18 is the kind of thing a lane usually hides.
- RUB OUT is a genuinely new primitive, not a rewording: a keyframe whose `to` IS the cascade
  rest pose, so the fill stays `backwards`, `FILL_ALLOWLIST` is untouched and the reduced-motion
  cut is free. The four crops show the half-erased word at t=100ms with the clip at 12.78% and
  one glyph box across fourteen frames. That is the §7 hole closed.
- PRM at `:root` is the strongest idea in the family and it verifies in both engines on live
  elements. It replaces N per-file blocks with one rule and arms a component by the act of
  naming a rung.
- The I1 root cause is *measured* — a finish/cancel trace naming `restoreBoardAnims` at
  `currentTime 0`, 1ms after the mover was created — not inferred. The exit fold has never
  played and now does, 61/62 and 30/31 running frames.
- `published: false` on `turn` is the right instinct: a token with no consumer is dead ink and
  the estate's own census says so.

## 6. Verdict

**ADVANCE at 62%.** The primitive is real and the ladder is the right shape; nothing here is a
rewording and nothing is a missing primitive as hard as the problem, so this is neither RETIRE
nor BLOCK. But a third of this diff is an undeclared repaint of surfaces the family never
claimed, one banked design decision is dead in the built CSS, R6's decided history is overwritten
in three rows without a ruling, and the gate that is supposed to make all of it safe stays GREEN
on both of my negative controls. 100% is not available while the sweep's own paint is unmeasured
and proof 9 was never banked.
