# ACC-SIX — pass-1 adversarial critique

**Family** the sixth crayon, arm (b): the answer's violet named, blue collapsed to one hue at three
pressures, the count tape at the frame's head.
**Verdict** ADVANCE · **Convergence 62%** · critic did not write the spec or the prototype.

What this critic did, in order: read the whole diff in the prototype's worktree
(`git -C .claude/worktrees/wf_e58b4764-0fc-41 diff`, 11 files, +377/−88); looked at the banked
crops; re-measured HEAD on the real surface in **both engines** (the main tree's own dev server,
already live on 127.0.0.1:4239 — the whole 4230-4249 band was held by concurrent lanes, so the
proto could not be re-served and its side is computed from its bytes); re-derived every contrast
number from first principles; ran seven of the estate's own gates against the worktree; and ran
the path generator out of **both** trees to settle the frame question the prototype left open.

Instruments banked beside this file: `probe/head-recheck.probe.ts` + `probe/head-recheck.config.ts`
(HEAD, chromium + webkit, light + dark → `logs/head-*.json`), `probe/frame-pad-delta.mjs` +
`probe/frame-pad-delta-grid.mjs` (→ `logs/frame-pad-delta.txt`), `probe/ratios.mjs`
(→ `logs/ratios.txt`). 48 KB total.

---

## 1. The finding that reverses the prototype's own conclusion

The prototype's headline gap says the frame **did not** move 7.63 px, and rests that on "all 4
darwin goldens PASS against the committed baselines". Both halves are wrong, and they are wrong in
the direction that ships an undeclared π.

I ran `generateFrameTraceFrames` and `generateGridBoilFrames` out of the HEAD tree and out of the
worktree, same seeds, same viewBox (`logs/frame-pad-delta.txt`):

| pose 0, viewBox units | HEAD | PROTO | Δ |
|---|---|---|---|
| fill trace, top y | −6.187 | +5.813 | **+12.000** |
| fill trace, bottom y | 1007.254 | 995.254 | **−12.000** |
| graphite grid frame, top y | −4.761 | +7.239 | **+12.000** |
| graphite grid frame, bottom y | 1001.827 | 989.827 | **−12.000** |
| graphite grid frame, left x | 4.930 | 5.100 | +0.170 |
| graphite grid frame, right x | 994.846 | 994.682 | −0.164 |

Twelve viewBox units on a 636 px desk board is **7.632 CSS px**, exactly the spec's number. My
live HEAD reading corroborates the other end: the svg board box is 636 px at `y=124.453` and the
trace's box top is `121.235` — **+3.218 px outside**, the spec's 3.22, identical in chromium and
webkit (`logs/head-*.json`). The move is real, it is 7.63 px, it is on the **top and bottom edges
of every board in five games in both themes**, and the flanks jitter a further ~0.11 px because
the rect generator's RNG walk changes with the height.

So why did the goldens pass? Because they were never able to fail on this. `playwright-golden.config.ts`
compares at `maxDiffPixelRatio: 0.02` with per-pixel `threshold: 0.3`. The `grid-corner` golden is a
180×180 CSS clip at DPR2 = 129,600 device px. A ~3 device-px-thick line relocating 15 device px
inside that crop dirties roughly 2×360×3 ≈ 2,160 px ≈ **1.7%** — under the 2% floor, with the left
flank contributing nothing because `FRAME_X_PAD` never moved. The gate is structurally blind at
precisely this magnitude.

Consequences the adjudicator has to take:
1. The π DELTA **exists** and is **undeclared in pixels** — nothing was re-minted, so the committed
   darwin baselines now encode a geometry the product no longer paints, and they will keep passing
   while they rot. Linux baselines are untouched and can only come from the runner artifact.
2. The prototype's "the visible board edge may be `.board-wrapper`'s 2 px CSS border" hypothesis is
   unnecessary — the drawn frame moved; the 1.5 px the frame-strip read is a measurement artefact of
   a percentile row profile, not the geometry.
3. `FRAME_PAD` is a **geometry** change riding inside a **colour** family. It is separable, it carries
   the only π in the patch, and it is the one item the owner is already being asked to dispose (U-10).
   It should be split out or the family should own the re-mint explicitly.

## 2. Contrast, re-derived rather than repeated

All grounds read live off HEAD in both engines (`logs/head-*.json`): card `rgb(253,253,252)` /
`rgb(19,18,17)`, background `rgb(251,250,249)` / `rgb(17,15,14)`, grid-line `rgb(38,38,38)` /
`rgb(209,207,199)`, foreground `rgb(10,10,10)` / `rgb(237,236,233)`. WCAG 1.4.3/1.4.11 arithmetic in
`probe/ratios.mjs`:

| claim | spec says | proto measured | this critic computes | verdict |
|---|---|---|---|---|
| digit light on card / background | 4.64 / 4.53 | 4.64 / 4.53 | **4.64 / 4.53** | ✅ AA, 0.14 headroom |
| digit dark on card / background | 7.70 | 7.70 / 7.86 | **7.70 / 7.86** | ✅ |
| focus ring light, `#2f76bd` @0.9 over card | **4.01** | 3.91 | **3.89** | ⚠️ spec is 0.12 high; still ≥3:1 |
| focus ring dark, `#6aabeb` @0.9 over card | 6.47 | 6.46 | **6.42** | ⚠️ gate is "≥6.4" — 0.02 of margin |
| HEAD ring `#3a7bc4` @0.9, light / dark | 3.67 / 3.72 | — | **3.63 / 3.69** | the deletion's case holds |
| verb on plain card, light / dark | 4.87 / 6.44 | 4.87 / 6.44 | **4.99 / 6.30** | ✅ ≥4.5 both |
| verb on the 5% neutral ground | 4.38 | 4.38 | **4.49** | ✅ under 4.5 — the ground rightly dies |
| trace light @0.95 over grid-line / card | 3.28 / 3.90 | 3.36 / 3.85 | **3.36 / 3.85** | ⚠️ the spec's pair does not reproduce |
| trace dark @0.95 over grid-line / card | 3.48 / 3.11 | 3.46 / 3.07 | **3.46 / 3.07** | ⚠️ same |

Two things fall out.

**`--color-focus-sketch` is exactly what the family says it is.** Read straight off `:root` in both
engines and both themes: `#3a7bc4`, unthemed, identical light and dark. R6's `law-probe R1` is
confirmed by an independent instrument, and deleting the token genuinely takes the dark ring from
3.69 to 6.42. This is the strongest row in the family.

**A wrong ledger ships inside the comment that exists to stop wrong ledgers.** The new
`--color-answer-mid` comment asserts "3.28:1 on `--grid-line-color`, 3.90:1 on `--color-card` at
stroke-opacity 0.95". The true pair is 3.36 / 3.85. The *old* comment being deleted (3.57/3.35,
4.16/3.85) was a correct **opaque / @0.95** pair — I reproduce 3.57 and 4.16 opaque to the digit.
The kept dark comment (3.65/3.48, 3.28/3.07) is also correct. So the patch deletes two accurate
rows and mints one inaccurate one, in the file whose whole thesis is "the earlier comment's numbers
were wrong". There are now at least four mutually disagreeing tables for this ink (charter,
index.css, prototype, this critique) and the prototype names three of them.

## 3. The gates

Nine born-RED rows. Seven are genuinely green on the real surface in both engines — kinship under
the six-anchor ruling with an empty off-family list, the deleted token plus the 6.4x dark ring,
the glow naming a token 5/5 with zero flakes, print and forced-colours on the trace, the chromatic
confirm, the tape's literal in two carriers, the off-ANCHOR share. That is real work and it is not
in dispute. What is in dispute:

- **Meter symmetry ≤0.5 px: RED** at 1.80/1.54 px. The prototype's proposed cure is to re-cut the
  gate's number or re-word the ruling to "inside on all four sides". That is moving the goalpost
  after the shot; it needs the adjudicator, not the family.
- **Masthead overlap = 0: RED** at 1,073/1,089 px² (1280) and 414/411 (393). The prototype's own
  note admits it "did not isolate masthead INK from masthead BOX" — the probe read the board under
  the tape, not the masthead. The gate is red and the cure is unmeasured.
- **"gone by fill 4"** contradicts the spec's own lifecycle (the rest timer starts on the third
  fill, so a fourth write inside 2.4 s is shown). A gate that disagrees with the spec it gates is
  not a gate.
- **filterBudget "exactly 9, union area unchanged": claimed green off the wrong instrument.** The
  estate's number is `FILTER_BUDGET_TOTAL` = 9 and `FILTER_BUDGET_UNION_AREA.row` = 45,572 px²,
  asserted by `e2e/filter-census.spec.ts` against the **built dist** through the throttle config.
  The prototype's dev-server census reads **8 filtered elements and 90,778 px²** and calls that
  green. Neither number is the budget's number, and `filter-census` is absent from the battery list.
  The one countable invariant in the estate is therefore unverified by this pass.
- **The dark-ring gate is "≥6.4" against a measured 6.42–6.46.** A threshold minted two hundredths
  under the answer is a threshold that cannot bite.
- **The off-ANCHOR light gate is ≤30% against 27.3%.** Same shape, and nothing in the record says
  what the residual 27.3% is made of.

## 4. The gate the patch itself modifies, and cannot fail

`check-font-coverage.mjs` gains a `countTape` extractor. Its `run()` matches
`` /`\$\{[^}]*\} of \$\{[^}]*\} written`/g `` and, on a match, emits a **hard-coded constant**,
`"0123456789 of 0123456789 written"` — the identical string the same patch types into the corpus'
`strings` array. The gate's own contract (its header) is `DERIVED ⊆ DECLARED`.

So: change the template to `${a}% of ${b}` and the regex stops matching; the derived set becomes
empty; `∅ ⊆ DECLARED` holds; the declared string stays typed in by hand; the `%` never enters the
corpus and is never checked against the cut. **GREEN.** The extractor's own comment claims "It reds
the day the template grows a `%` or a `/`" — it does not, and cannot, because it derives nothing
from the source it claims to read. This is spec-cites-itself circularity with a silent-no-match
fallback under it, wearing the clothes of a derivation. The estate's whole reason for `derive` is
the T8 ransom-note trap, and this row re-arms it.

Closable in one line: capture the template's own words —
`` /`\$\{[^}]*\}([^`]*)\$\{[^}]*\}([^`]*)`/ `` — and emit `"0123456789" + g1 + "0123456789" + g2`,
so a copy edit changes the derived set and the `⊆` check does the work.

I ran the seven gates that run headless against the worktree and they are green as claimed:
copy-register, live-regions, theme-tokens, theme-selectors, ink-pressure, motion-contract,
font-coverage. ESLint on the three pencil files touched: clean, boundary included.

## 5. What nothing holds

The fill gauge's `aria-valuetext` changes from `board 20% filled` (verified live at HEAD, both
engines) to `3 of 20 written`, `aria-valuemax` from 100 to the writable count, and `aria-valuenow`
from a percentage to a count. A grep across `src/`, `e2e/` and `scripts/` for the old literal,
`progress-trace-a11y`, `fillProgress` and `valuetext` returns **zero hits outside the two files the
diff edits**. No unit test, no e2e spec, no census row. "810/810 units pass" and "live-regions
green" are both true and both say nothing about this change. The prototype admits step 9 is half
done; the sharper statement is that the estate has never held this string at all, and the patch is
the moment to start.

## 6. Things the frames show, or fail to show

**The tape covers the gauge it exists to explain.** In the family's own hero crop
(`frames/corner-fill1-tape-chromium-light.png`) the violet trace emerges from behind the tape's
right edge as a ~30 px sliver. Arithmetic: perimeter 3904 units → 2,483 CSS px at the 636 desk
board, so fill 1 of 20 draws 124 px clockwise from the top-left, and the tape is 93.3 px wide
starting 7.5 px in. Roughly three quarters of the trace is occluded at fill 1. On the phone
(365 px board, 1,425 px perimeter, 71 px drawn, 82.7 px tape) the trace is **entirely** hidden at
fill 1 and mostly hidden at fills 2 and 3. The tape is up for exactly the three fills during which
it hides the thing it is teaching you to read. This is undeclared and unmeasured.

**Two of the seven briefed poses were never captured.** `frames/` holds 13 files: corner-fill1 ×4,
corner-fill4 ×4, focused-cell ×2 (chromium only, though the brief asked light + dark on the real
surface *both engines*), print, forced-colours, phone (chromium only). **There is no armed-confirm
frame (pose 4) and no solved-board corner (pose 5).** Pose 4 is the family's one memorable thing
for the confirm surface, and pose 5 is the kill-by-form row — the one place the newly-shared violet
appears twice at once (the fill trace and solver stop 2 are now literally the same named token).
The gestalt on both is asserted from numbers, never seen.

**The red verb goes back to graphite exactly when you point at it.** `@media (hover: hover)
.guard-btn:hover .guard-face { background: var(--color-accent); color: var(--color-foreground) }`
has higher specificity than `.guard-leave .guard-face { color: var(--color-red-ink) }`. The spec
says "hover `--color-accent` unchanged" and stops there; the consequence is that the family's sole
chromatic signal on the destructive verb is absent in the hover state, which is the state a mouse
user is in at the moment of the act. No frame, no measurement.

**The tape re-tears and re-tilts on every count change.** `SheetWashiLabel`'s `geom` seeds
`mulberry32(props.seed * 2654435761 + props.text.charCodeAt(0))`, and `charCodeAt(0)` is the
leading **digit** of `1 of 20 written` → `2 of 20 written` → `3 of 20 written`. So the six-point
torn clip-path and the ±1.5° tilt are re-rolled on fills 2 and 3. The spec says the count "updates
in place"; in fact the scrap changes shape and angle under the reader's eye. Frames exist for fill 1
and for fill 4 (lifted) — never for fills 2 or 3, which is exactly where this would show.

## 7. Smaller, each closable

- **A comment that contradicts itself in the same block.** `GameGallery.vue` keeps "The destructive
  verb takes the heavier ink … **plus a neutral ground, exactly as `deal` wears it in the band**"
  immediately above the paragraph announcing "THE GROUND IS GONE". Delete the stale clause.
- **`noteWriteMs` is minted with one consumer while its three stated wearers keep their literals.**
  `MarginNote.vue:149,:180` and `CompletionVignette.vue:133` still open-code `250ms`. The docstring
  argues "a fourth literal is a ledger" and then leaves three. Either convert them in the same patch
  or drop the claim.
- **Undo-to-empty resurrects a tape the spec says never returns.** The lifecycle watch treats
  `n === 0` as a fresh deal, so undoing every write restores `tape = "off"` and the next write lays
  it down again on the same board. A deal and an emptied board are not the same event.
- **A resumed board still gets a tape.** The watch has no `immediate` (correct), but a session
  restored at 2 fills lays the tape down on the third write — mid-board, for a reader who was never
  taught anything. Spec says "laid down on the FIRST fill of a board".
- **In multiplayer the tape counts the room and says "written".** `filled` counts every non-given
  cell with a value, peers included, so a peer's first three writes lay your tape and speak in your
  progressbar. §12 is one of the family's five claimed surfaces.
- **Law 19 (wax for strokes, hue-locked ink for verdict text) is crossed without an admission.** At
  light the focus ring — a stroke — takes the INK tier (`#2f76bd`); at dark it takes wax
  (`--color-crayon-blue`). The "one hue at three pressures, separation by form" argument is good, but
  it is a departure from a banked law and the patch does not name it as one.
- **Law 20 (the solver rainbow is board content only, never chrome) now has a seam.**
  `--color-solver-ink-2` and the chrome sparkle's `--sparkle-glow-*` resolve through the same
  `--color-answer-pale`. No pixel moves — HEAD's `rgba(196,181,253,…)` already *was* that hex — but
  the estate's existing comment specifically says "the chrome sparkle icon stays on the untouched
  `#sparkle-rainbow`", i.e. the seam was policed by name. The family should either admit the
  crossing in the ruling or give chrome its own rung.
- **R6 law 39 names a token this patch deletes.** "the board's drawn `--color-focus-sketch` ring at
  stroke-width 7 / opacity 0.9" — the substance survives, the name does not. The decided history has
  to be amended in the same commit or the record stops describing the product.
- **`HandwrittenGlyph.vue:85` swaps one fallback for another.** `var(--color-user-ink, #2563eb)` →
  `var(--color-user-ink, var(--color-blue-ink))`. `--color-user-ink` is unconditionally declared in
  both themes, so the fallback is dead in both forms. The DIES list says "the glyph's literal
  fallback" dies; what actually happened is it was renamed.
- **The `.washi-tag` / `.washi-head` refactor's π is argued, not shown.** Every moved declaration
  keeps its value and nothing sits between the old and new rule positions, so I believe it is
  pixel-identical — but the four compartment tags on the controls card are an unclaimed surface and
  no frame of them was taken either side.
- **Evidence weight.** ACC-SIX banks 520 KB against a wave cap of 2 MB that `pass1/` has already
  blown collectively (15 MB across 19 families). Not this family's sin alone; worth the adjudicator's
  eye before the wave closes.

## 8. Strengths, stated plainly

The route is right and the route is cheap: arm (b) moves **zero violet bytes** — I confirmed the
tokens resolve to the same `rgb(139,92,246)` / `rgb(124,58,237)` HEAD paints today — and buys a name
for three things that were a token, a hex and two hand-converted rgba literals. Deleting
`--color-focus-sketch` is a strict win proved twice over (3.63 → 3.89 light, **3.69 → 6.42 dark**).
The print and forced-colours arms cure two real omissions on a surface an accessibility reader
explicitly asked to be system ink. The digit clears AA in both themes with a number I reproduce to
the hundredth. The confirm's ground was measured **before** it was designed in, missed, and was
deleted per the spec's own pre-declared fallback — which is how a measured design is supposed to
behave. The `transition: all` → `transition: filter` narrowing names the mechanism that fed the
research its mid-tween frame. The count tape is a genuinely distinctive, estate-native piece of
voice: washi, hand, lowercase, one literal in two carriers, taught once and gone. It is not a
generic default in any respect.

## 9. Verdict

**ADVANCE at 62%.** Nothing here is a rewording and nothing is a missing primitive — the anchor
exists, the tape mechanism runs in both engines, and seven of nine born-RED gates are honestly
green. But the pass cannot be banked: one load-bearing inference is backwards (the frame moved,
the goldens are blind, the baselines are stale), two gates are RED and a third contradicts its own
spec, the one gate the patch writes cannot fail, the estate's countable invariant was checked with
the wrong instrument, and the two frames that would show the family's riskiest claims were never
taken. Every gap below is a sentence someone can close.
