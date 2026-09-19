# ACC-SIX — the sixth crayon · pass-3 RESEARCH

Family: ACC-SIX (§3 accent family · §4 fill meter · §12 multiplayer chrome · M07). Researcher
lane, READ-ONLY on the product. Base: **`74a2b5d9`** (the W7 execution fold), which is not the
tree pass 2 was cut from (`a8fee1f5`) — §1 prices what moved. Chair's rulings read first
(`pass3/CHAIR-RULINGS.md`), then the charter, then `pass2/critique/ACC-SIX.md`.

Everything numbered below is measured here unless it is cited to pass 2 or to a sibling. No dev
server was started (every number in this lane is bake-time geometry, a file read, or a rust
band); **no port in 4230–4249 was taken and none is held**. Zero crops banked — the wave's cap is
the reason, and nothing here needed a picture. Instruments: `probe/*.entry.ts`, bundled with the
estate's own esbuild and run in node; readings in `readings/*.json`.

---

## 1 · The base moved under this family: what `74a2b5d9` did to ACC-SIX's diff

The fold's twelve picks touch **five of the eleven files** in the pass-2 prototype. Replay
resolves TOWARD the fold (chair, "the fold is law, the prototype adapts"). The hunks that must be
re-cut, each with its new line:

| pass-2 site | pass-2 line | at `74a2b5d9` | why it moved |
|---|---|---|---|
| the two inline glow literals | `GameControlPanel.vue:2081/:2087` | **`:2088` / `:2094`** | the fold's +13 lines in that file |
| the confirm's face | `GameGallery.vue:1455-1461` | **`:1459`** (`.guard-leave .guard-face`), hover at `:1432`, `:1450` focus | unchanged file, cited fresh |
| the glyph's fallback | `HandwrittenGlyph.vue:85` | **`:85`, verbatim**: `return "var(--color-user-ink, #2563eb)"` | untouched |
| `BOUND_TAPES` pin | "`check-font-coverage.mjs:494-497`" | the pin list is **`:144-161`**; the census that reads it is **`:524-556`** | the fold added `paperNoteCopy` (+34 lines) |
| the fill gauge | `HandDrawnGrid.vue:476` / `:509` | **unchanged** (`pathLength="1000"`, `stroke-dasharray="1000 1000"`) | not in the fold |
| `GameBoard.vue` fill/lifecycle | `:353-361`, `:782` | `fillProgress` now **`:352-361`**; the fold inserted `useCoarsePointer`, `pointedPos`, `isCoarse`, a `hoveredPos` computed and a `focusout` clear | 3C-4 / 3C-4b |

**And the fold put a second tape on the board.** `GameBoard.vue:1088-1096` mounts
`.attribution-tape` → `<SheetWashiLabel :text="hoveredAuthor.slug" :seed="97" />` at the
hovered — and since 3C-4, the **focused** — cell's top edge (`:1229-1236`), flipping below on the
top row (`:1248`). It is `position: absolute` inside `.board-wrapper` and its label carries
`SheetWashiLabel`'s own `z-index: 50`. Three consequences the synthesizer owns:

1. **z-order.** A count tape at `z-index: 3` (pass-2's spec) paints UNDER the attribution tape.
   On a session board the player can hold focus on the top-right cell and have both tapes in the
   same 120×23 px of paper.
2. **The seed fix now has three live victims, not four one-time ones.** `SheetWashiLabel.vue:56`
   seeds off `props.seed * 2654435761 + props.text.charCodeAt(0)`, and **3 of the 16 instances in
   the tree bind `:text` to a value that changes at runtime** — `hoveredAuthor.slug` (the fold's
   own tape: its torn edge re-rolls per PEER), `shareAct.washi.value` and `inviteAct.washi.value`
   (three states each). The prop's docstring at `:16` promises "a given label's tear + tilt never
   re-roll"; on the fold's tree that promise is false on the board as well as on the card.
3. **The price of the fix is bigger than pass 2 priced it.** Dropping the text term re-rolls
   **all 16 instances once**, not "the four compartment tags". They are: 5 `anchor="tag"`
   (`GameControlPanel.vue:769/953/1013/1049`, `StagingBand.vue:130`), 8 static-text tooltips, and
   the 3 bound ones above. **None of the four goldens is one of them** (`e2e/goldens/` holds
   `cell-light`, `grid-corner-light`, `logo-light`, `toggle-crest-dark` only), so the re-tear is a
   π row and not a golden re-mint — which matters under chair §6.4.

**The copy gate learned to read, and that changes what this family may say.** `lint:copy`
(`check-copy-register.mjs`, 1,422 lines at the fold) now discovers a spoken source by NAME:
`SPOKEN_SUFFIXES` = Label/Text/Caption/Heading/Sublabel/Placeholder/Title/Note/Line/Word/Name/
Message/Sentence/Announce/Announcement (`:388-404`), optional plural, plus anything beginning
`aria`/`ARIA_`; every literal in such a declaration's initializer goes to the lexicon, and a
template literal is read by its STATIC segments (`:526-575`). Two facts fall out:

- A computed named **`tapeText`** (or `countLabel`, `countLine`) is discovered and swept; a
  computed named `tape` or `count` is invisible. **Name the holder so the gate can see it.**
- `RENDERED_ATTRS` (`:266-277`) is `aria-label`, `aria-description`, `title`, `placeholder`,
  `alt`, `text`, `sublabel`, `label`, `heading`, `caption` — **`aria-valuetext` is not in it**.
  The gauge's spoken string is the one rendered attribute in the estate the copy gate cannot
  read. Adding `"aria-valuetext"` to that list is a one-line widening with a born-RED plant
  available (the self-test colours at `:960-1130` are the pattern), and it reds nothing at HEAD:
  the only `aria-valuetext` on the tree is `HandDrawnGrid.vue:307`, ``board ${progressPercent}%
  filled``, whose static segments are `board ` and `% filled` — clean against the lexicon.
- `ADMITTED` is **empty** at the fold (`:180-192`) and the record says to keep it that way. The
  lexicon's live traps for this family's words: `\bunit\b`, `\bcandidates?\b`, `\bhouse\b`,
  `\bsolver\b`, `\bengine\b`, `\bworker\b`, `\bfeature\b`. `N of M on the board` trips none.

---

## 2 · The dash law: ACC-SIX's pass-2 mechanism is FALSIFIED, and the real discriminator is a
segment count I measured

`readings/segments.json` (`probe/segments.entry.ts` — the product's own
`generateFrameTraceFrames` at `BOIL_CONFIG` 4 / 1.2 / 150 with `FILTER_PRESETS["grain-static"]`'s
grain, exactly as `HandDrawnGrid.vue:99-108` calls it):

| pose | points | **segments** | length (viewBox u) | commands |
|---|---|---|---|---|
| 0 | 494 | **493** | 3965.631 | `M` + 492 `L` + `Z` |
| 1 | 494 | 493 | 3963.107 | same |
| 2 | 494 | 493 | 3962.043 | same |
| 3 | 494 | 493 | 3964.384 | same |

- Spread **3.588 u in 3,962 = 0.0906%**. This **corrects pass-2's own §1 figure** ("2.52 u,
  0.064%") and agrees to the digit with ACC-FIVE's `poseLengths` docstring (3.59 u / 0.091%).
- The **join ring** (seed 91) is the same shape: 493 segments, 3963.687–3965.627 u. Two dashed
  consumers, one geometry.
- **THE INSTRUMENT TRAP, measured: the same call with `grain` omitted yields 25 segments**
  (lengths 3960.96–3961.14). ACC-FIVE's critic read "G0's forced arm measures a 25-segment stub"
  — this is why: **a bare-page probe that rebuilds the ring without the grain config measures a
  path an order of magnitude below WebKit's ~128-segment restart threshold, so the defect cannot
  reproduce and the arm reads GREEN for the wrong reason.** Every pass-3 G0 arm must pass
  `FILTER_PRESETS["grain-static"].grain` or read the `d` off the live DOM. 493/128 ≈ 3.85 → the
  4 dash runs ACC-FIVE measured in WebKit and the 4 arcs the pass-2 lane saw are the same number.
- So **the law is bounded by SEGMENT COUNT, not by declaration form.** ACC-SIX's pass-2 §1
  ("under `pathLength`, WebKit mis-scales a dash declared as a presentation attribute; a
  CSS-declared dash is engine-identical") does not survive: ACC-GRAPHITE's clean CSS-declared
  reading was on a ~25-segment path and ACC-SIX's dirty one on a ~493-segment path. The charter's
  "re-run G0 over segment count" is the right re-cut, and the arms should be **segments**
  (25 / 123 / 246 / 493 / 599 on ONE declaration form), not four declaration forms.

**Prior art, background only — the verdict above is the codebase's.** The per-segment dash
restart is not a WebKit accident, it is in the specification's own language: the SVG working
group's discussion of dashing over multi-segment geometry records that an implementation *should*
restart `stroke-dashoffset` for each path segment while taking the initial offset into account,
and the working group's `pathLength`-percentage thread
([w3c/svgwg#177](https://github.com/w3c/svgwg/issues/177)) is the same ground: dash normalisation
over a path is under-specified, and the "should" is a recommendation rather than a requirement
([www-svg 2006Jun/0124](https://lists.w3.org/Archives/Public/www-svg/2006Jun/0124.html),
[MDN `stroke-dasharray`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/stroke-dasharray)).
Two engines may therefore both be conformant while disagreeing, and no re-spelling of the dash
— attribute, CSS, `pathLength`, percentage — gets a 493-segment polyline out of it. **That is
the argument for a geometric cure and against any further declaration-form arm.**

### The graft, verbatim, and what it costs

`poseFronts` exists and is 22 lines (`.claude/worktrees/wf_8630d340-e56-41`,
`gridPaths.ts:397-455`), riding two helpers that do NOT exist at HEAD — `posePoints(d)` (a
number-pair scan with an explicit `Z` close) and `poseLengths(frames)`. Signature:
`poseFronts(frames: string[], fraction: number): string[]`, truncating each pose at its own
arc-length fraction with the last point interpolated.

**It closes three of this family's gaps at once, by construction, not by argument:**

- **G0** — no dash pattern exists for an engine to restart (ACC-FIVE's readings: Δ ≤ 0.10 points
  chromium vs webkit at p = 0.05/0.25/0.50/1.00, dpr 1 and 3; ACC-SIX's own `probe/cure.crit.ts`
  agreed to 1.4%).
- **The degenerate pose (critique finding 5)** — `f <= 0` returns `frames.map(() => "")` and an
  unparseable `d` returns `""` for that pose. The guard **fails to nothing drawn**, which is the
  behaviour the charter demands and the opposite of `stroke-dasharray: 0px 0px`.
- **`pathLength` estate-wide** — both `HandDrawnGrid.vue:476/509` sites die with it.

**The price, and it is this family's to declare, not to hide:** `stroke-dashoffset` was
tweenable; a truncated `d` is not. The fill front STEPS per write. On a 9×9 Easy deal (20
writable) one digit is 5% of 3,962 u ≈ 198 u ≈ **31 px of front on a 636-px board**; on a 4×4
Easy deal one digit is **25%**, ≈ 991 u ≈ 158 px of front in one frame. `MOTION.traceFillMs`
(pass-2's 240 ms) retires with the dash — a motion band spent. That is U-10's and MOT-LADDER's,
and the merge watch's condition: consume `poseFronts`, do not re-mint a slice.

---

## 3 · The count tape's zero-occlusion claim, re-derived as a law with numbers

`readings/anchors.json` / `readings/front-vs-tape.json`. The ring's clockwise corner arrivals on
the shipped poses: **top-right 23.7–24.6% · bottom-right 48.98% · bottom-left 73.85%** of the
perimeter (the pass-2 spec's 24.7% came from a px perimeter and is close but not this tree's
number; the reading tolerance is declared in the probe).

**Entry fraction** = the fill fraction at which the front's first point lands inside a tape box
padded by half the 8-u stroke, worst of the four poses:

| anchor | desk (636 px board, 118 px tape) | phone (365 / 105) | landscape (306 / 105) | desk 3-digit (636 / 140) |
|---|---|---|---|---|
| top-right (pass-2's) | 19.93% | 17.46% | **16.02%** | 19.10% |
| top-left (pass-1's) | 0.19% | 0.19% | 0.19% | 0.19% |
| bottom-right | 48.98% | 48.55% | 48.36% | 48.98% |
| **bottom-left** | 69.90% | 67.44% | **66.01%** | 69.09% |

Fills the worst viewport admits (writable counts are csp-solver's own bands —
`sudoku/generate.rs:67-73`, Easy `len/4`, Medium `len/1.75`, Hard `len/1.25`; kenken
`generate.rs:280` digs the WHOLE board; the 16×16 Hard target of 204 "measurably lands at
172–180 holes", `generate.rs:59-63`):

| deal | writable | top-right (16.02%) | bottom-left (66.01%) |
|---|---|---|---|
| 4×4 easy | **4** | **0** | **2** |
| 4×4 medium | 9 | 1 | 5 |
| 4×4 hard | 12 | 1 | 7 |
| 9×9 easy | 20 | **3** (3/20 = 15%, margin **1.02 points**) | 13 |
| 9×9 medium / hard | 46 / 64 | 7 / 10 | 30 / 42 |
| 16×16 easy / medium / hard | 64 / 146 / 204 | 10 / 23 / 32 | 42 / 96 / 134 |

**Four findings the synthesizer must build on:**

1. The critic's "4×4 breaks it" is not an edge case, it is the **arithmetic of the deal**: 4×4
   Easy has four writable cells because `target_holes = 16/4`. One digit is a quarter of the
   board. **No corner of the ring clears three fills on a 4×4 Easy board** — the front is 75%
   round and the last corner arrives at 73.85%.
2. `TAPE_FILLS = 3` at the **top-right survives on exactly one shipped deal by one point**
   (9×9 Easy, 15% vs 16.02% at 844×390). That is not a margin, it is a coincidence, and it moves
   the moment the tape's width moves — which the 16×16 arm does (a three-digit `M` widens the
   drawn string; the desk entry drops 19.93 → 19.10%).
3. **The bottom-left is the anchor the geometry wants**: 66.01% worst-case, 4.1× the top-right's
   headroom, and W2's own reasoning already reserves it — `DrawerTab.vue:24-27` puts the phone
   tongue at the board's bottom-RIGHT precisely because it "leaves the board's bottom-left to the
   marginalia". The collision to check on the surface is the marginalia, not the tab.
4. **The lay-down condition is a derivation, not a constant.** The honest closed form is
   `fills_shown = min(TAPE_FILLS, floor(f_entry × writable))` with `f_entry` the anchor's
   measured worst-viewport fraction (0.6601 at the bottom-left, 0.1602 at the top-right) and
   `writable = totalCells − givenCells.size` — the value `GameBoard.vue:359` already computes.
   At the bottom-left this yields 2 on a 4×4 Easy board and ≥3 everywhere else: **the lesson
   scales to the deal instead of being switched off by it.**

### The third option nobody has priced: the tape does not go on the board at all

`GameBoard.vue:1160-1172` already renders `.board-margin` — a strip BELOW the board holding
`MarginNote` with `text` / `tone` / **`meta`** ("Preformatted tally line below the voice, outside
the live region", `MarginNote.vue:31-32`), and `tally` is **debug-only** at HEAD
(`GameBoard.vue:916`), so the `meta` line is free in production. Occlusion is 0 by construction
at every board size and viewport, the strip's height is already reserved
(`GameBoard.vue:1301-1335`, 0.4rem top margin), it is `pointer-events: none`, and the print
block already hides `.board-margin` (`index.css:905`). Cost: it is the page's VOICE and the
tally's berth below 1280, and a count on the margin line is a caption, not the "first-run
whisper" §4 asks for. Worth prototyping as arm B against the bottom-left tape as arm A — the
owner disposes (U-10), and §4's charge names both routes ("placement, form, a first-run whisper"
OR "a visible label").

---

## 4 · Tokens, exactly as the tree holds them at `74a2b5d9`

| token | light | dark | site |
|---|---|---|---|
| `--color-user-ink` | `#2563eb` (Tailwind blue-600) | `#60a5fa` (blue-400) | `index.css:151` / `:372` |
| `--color-crayon-blue` | `#4a90d9` | `#6aabeb` | `:173` / `:381` |
| `--color-focus-sketch` | `#3a7bc4` | **absent — no dark arm** (R6 law-probe R1) | `:219` |
| `--color-solver-ink-2` | `#7c3aed` | `#c4b5fd` | `:205` / `:396` |
| `--color-progress-ink` | `#8b5cf6` | `#7c3aed` | `:278` / `:407` |

- **Zero new violet bytes is true**: `#7c3aed`, `#8b5cf6`, `#c4b5fd` are the only violets in
  `src/`, at the four sites above plus `SvgFilters.vue:168` (`#c4b5fd` as the **sparkle-rainbow's
  25% stop**) and the two inline `rgba(196,181,253,…)` glow literals
  (`GameControlPanel.vue:2088/:2094`, which are `#c4b5fd` at α .3 / .6).
- **`var(--color-user-ink)` has 12 consumers** in `src/`, and the peer seam rebinds the same name
  per authored cell (`playerIdentity.ts:67-70`, `oklch(var(--peer-ink-l) 0.11 <i·137.5°>deg)`),
  which is why the alias above it cannot survive — the consumers want the binding.
- The focus ring reads `var(--color-focus-sketch, var(--color-crayon-blue))` twice
  (`gameCell.css:246/:248`); the fallback can never fire, so a bare deletion lands silently on
  crayon-blue. Chair §6.1: read, never written — state which of §6's candidate values the palette
  survives on.
- The print block (`index.css:893-940`) blackens `.grid-line` and `.glyph-svg path` and hides
  nine chrome classes. **`.progress-trace` is in neither list** (G3's RED is real) — and neither
  is **`.attribution-tape`**, which the fold landed. A print/forced arm written for `.count-tape`
  costs nothing extra to write for all three, and the forced-colors block
  (`index.css:947-953`) covers `.glyph-svg path` alone.

### Law 20 has a live counter-example at HEAD, which is what makes an instrument possible

R6 law 20: *"The solver rainbow is BOARD CONTENT ONLY — never chrome, never a metadata tone"*
(`r0/r6-idiom-history/R6-census.md:100`). The chair (§6.7) says it STANDS for ACC-SIX in the
amended reading. The instrument the critique asked for has an obvious mechanical shape and a
named admission already required by the tree: **no chrome selector may name a STOP
(`var(--color-solver-ink-N)`), while naming a RUNG (`--color-answer-*`) is lawful** — born-RED by
planting one chrome rule that names a stop, and **admitting `#sparkle-rainbow` by name**, because
`index.css:198-204` states outright that "the chrome sparkle icon stays on the untouched
`#sparkle-rainbow`". A gate that reds on HEAD is not a gate; a gate with one named admission and
an exit code is. R6 also already banks the family's own best argument (`R6-census.md:201-204`):
"**the violet is NOT foreign** — `--color-progress-ink` dark is byte-identical to
`--color-solver-ink-2` light… the violet is already in the house, it is simply not NAMED as kin."

### G9's alias law, read at the fold

`check-theme-tokens.mjs:195-198` prints `ALIAS-ONLY (live through a live token, kept):` and then
falls through; the only `process.exit(1)` is `dead.length` at `:213-216` and the only other exit
is the self-test's negative control at `:210`. **The alias law has no exit code**, exactly as the
critique read it. Either the section gets an exit code with the named ramp admitted by name, or
the gate is struck — the charter's row 8, unchanged by the fold.

---

## 5 · Primitives to reuse, named

| primitive | where | what it gives this family |
|---|---|---|
| `poseFronts` / `poseLengths` / `posePoints` | ACC-FIVE, `gridPaths.ts:378-455` (worktree `-41`) | the gauge's front with no dash, engine-identical, failing to nothing drawn |
| `SheetWashiLabel` | `src/pencil/sheet/SheetWashiLabel.vue` (16 instances) | the tape's whole appearance — seeded six-point tear, ±1.5° tilt, `--sheet-washi-neutral`, `aria-hidden` on the default anchor, `z-index: 50` |
| `.board-margin` + `MarginNote`'s `meta` | `GameBoard.vue:1160`, `MarginNote.vue:28-44` | an off-board home for a count, already reserved, already print-hidden |
| `ink-write-in` + `--ease-noteWrite` | `index.css:1115` keyframe, `:349` token | the lay-down, worn verbatim — no new MOTION constant for the write |
| `MOTION.chromeLeaveMs` (200) + `--ease-fadeOut` | `pencilConfig.ts:163` | the lift |
| `useLiveRegion` / `.board-voice` | `GameBoard.vue:677`, `:1182` | the spoken half if the count is ever announced — but the gauge is a `progressbar`, not a live region, and `check-live-regions`' subject is `aria-live`/`role=status\|alert\|log` |
| `HandDrawnOutline` `currentColor` | the guard ribbon | the confirm's drawn box reddens with its word, no second token |
| the fold's `isCoarse` / `useCoarsePointer` | `GameBoard.vue:517` | the coarse arm, already in the file, if the tape ever needs one |

---

## 6 · Sketches

**A — the anchor ledger (why the corner matters), one pose, fractions measured**

```
        0%                                        23.7%
        ┌───────────────────────────────────────────┐   ← the front starts top-LEFT,
        │  [pass-1 tape: entry 0.19%]   [pass-2 tape│      runs CLOCKWISE
        │                                entry 16.0%]│
        │                                           │
        │              9×9 easy: 3 fills = 15%      │ 49.0%
        │              4×4 easy: 1 fill  = 25%  ✗   │
        │                                           │
        │ [arm A tape                               │
   73.8%│  entry 66.0%]                             │
        └───────────────────────────────────────────┘
                     ▲ DrawerTab (phone, shut) lives bottom-RIGHT — W2 §2.7 leaves
                       the bottom-left "to the marginalia"
```

**B — the lay-down condition as a derivation, not a constant**

```
writable = totalCells − givenCells.size          (GameBoard.vue:359, already computed)
f_entry  = 0.6601  (bottom-left, worst of 4 poses × 3 viewports, measured)

fills_shown = min(3, floor(f_entry × writable))

   4×4 easy  (4)   → min(3, 2)   = 2      "1 of 4 on the board" … "2 of 4"
   4×4 hard  (12)  → min(3, 7)   = 3
   9×9 easy  (20)  → min(3, 13)  = 3
   16×16 hard(204) → min(3, 134) = 3
```

**C — the two tapes the board now has to seat together**

```
 .board-wrapper  (stacking context, contain: layout style)
   ├─ svg.hand-drawn-grid        z 1   ← .progress-trace (violet), .join-trace
   ├─ cells / inputs                   ← the interactive estate
   ├─ .attribution-tape  (FOLD)  z 50  ← SheetWashiLabel, at the hovered OR FOCUSED cell,
   │                                      text = peer slug (re-tears per peer today)
   └─ .count-tape  (proposed)    z 3   ← paints UNDER the attribution tape as specced
```

---

## 7 · Risks, in the order they can kill the pass

1. **The step, not the slide.** Consuming `poseFronts` retires `traceFillMs` and makes the front
   jump 31 px per digit at 9×9 and 158 px at 4×4. If the owner wants the ease back, the family
   needs the per-frame re-cut ACC-FIVE named and did not build (re-cut `poseFronts` on the boil
   scheduler) — and that spends motion budget W8 is watching. Declare it; do not discover it.
2. **The tape's box is a live measurement and every number in §3 rides on it.** 118 / 105 px are
   pass-2's readings for `N of M on the board`; a three-digit `M`, a different face fallback, or
   a `letter-spacing` change moves `f_entry` directly. The prototype must measure the painted box
   at 1280×800, 393×699 dpr3 and 844×390 before it trusts any row of the table.
3. **The 4×4 deal can land under its target.** `generate_by_digging` stops on `holes >= target`
   OR `refusals >= leash`, so a 4×4 Easy board can deal with THREE writable cells. A lay-down
   condition that reads `writable` handles it; a constant `TAPE_FILLS` does not.
4. **Two tapes, one corner.** The fold's attribution tape follows FOCUS on a coarse pointer now.
   Any count tape on the board needs a stated rule for the overlap, and `z-index: 3` is not it.
5. **The seed fix touches 16 instances.** No golden covers them, but `visual-regression.spec.ts`
   and the π census do. It is a declared π row with a one-time cost — and it fixes a promise the
   component's own docstring makes and the fold's tape breaks.
6. **A gate widened to fit a claim is the failure mode this loop exists to catch.** Adding
   `aria-valuetext` to `RENDERED_ATTRS` is a widening that must ship with a born-RED plant;
   `check-live-regions` must NOT be widened to cover the gauge (the critique already refused it).
7. **DEV-server numbers.** The pass-2 ratio ledger and the 5/5 glow runs were read off a dev
   server; only the filter census ran against the dist. `filterBudget` 9 is enforced against the
   **built dist** (`filterBudget.ts:28-36`), so the census and the ledger both belong there —
   and the chair's housekeeping forbids sharing a `cacheDir` between build and serve (the pass-2
   server died at exit 144 for exactly that).
8. **`.attribution-tape` prints today.** If this family writes the print/forced arm for its own
   chrome and leaves the fold's tape out, it repeats the defect it is curing.

---

## 8 · What this lane did NOT do

No dev server, no browser, no crops, no product edit, nothing written under `r0/`, `pass1/` or
`pass2/`. No r0 instrument was re-run here, so **no r0 row is MOVED by this lane**; the
kinship-instrument MOVED row stands as pass 2 filed it. The live rows — painted ratios off the
dist, the tape's measured box, the two-tape overlap, the goldens, `check-prod-shake` /
`check-golden-bytes` / `check-support-floor` / `check-unit-count` / `knip` / `eslint` in the
worktree — are the prototype lane's, and the exact npm scripts are `test:prod-shake`,
`test:golden:bytes`, `test:support-floor`, `test:unit:count`, `lint:knip`, `lint:eslint`.
