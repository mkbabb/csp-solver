# ACC-FIVE — pass-2 CRITIQUE (adversarial, non-author)

Five crayons, no sixth. The prototype runs and its central finding is real. Its central
CONTRAST claim is not, its headline G0 arm measures the wrong subject, and it amends a
standing R6 law on its own authority.

**Verdict ADVANCE · convergence 72%.**

- Subject: worktree `.claude/worktrees/wf_8630d340-e56-41` at HEAD `a8fee1f5`, 7 product
  files, +310/−83, uncommitted. Read whole (`git -C <worktree> diff`).
- Re-measured by me on my own server: `npx vite --config
  critique/ACC-FIVE/probe/vite.critic.mjs --host 127.0.0.1 --port 4241 --strictPort`,
  private `cacheDir`, killed before return; 4230–4249 checked (4238/4239 belong to sibling
  lanes, 4241 free).
- My readings: `critique/ACC-FIVE/readings/band-clean.json` (75% fill) and
  `band-lowfill.json` (15% fill), chromium + webkit, light + dark, dpr 1. Probes in
  `critique/ACC-FIVE/probe/`. No crops minted — every number below is a number.

---

## 1 · What I reproduced

| claim | their number | mine | verdict |
|---|---|---|---|
| G7 no stock hex | 0 / 0 / 0 / 0, `#7c3aed` once | same, by grep over `src` | reproduced |
| G8 alias law | `lint:theme-tokens` 0 unreferenced of 54 | ran it, green | reproduced |
| M16 | `check-copy-register` 0 unadmitted | ran it, 0 em dashes / 2 admitted / 0 unadmitted | reproduced |
| guard set | `lint:motion` / `lint:ink` / `lint:live-regions` / `lint:theme-selectors` | all four exit 0 | reproduced |
| G1 kinship, painted | trace Δ0.3° light / 0.6° dark | painted core h **83.7** light (Δ0.01), **97.4** dark (Δ2.2) | reproduced, inside KIN_DEG 5 |
| G4 the verb | 4.917 rest, `--color-red-ink` | read their own crop's bytes: **rgb(208,42,82) = #D02A52**, 4.917 vs paper, byte-identical both engines | reproduced |
| G3 layer order | print/forced `#000` beats the win rule | verified structurally: the print and forced arms sit in `@layer base` (index.css:978, :1024), the win rule in `@layer utilities` (:561) — for `!important` the earlier layer wins | reproduced |

**And I closed their open G5 arm.** Their digit probe picked a GIVEN glyph, so the light pen
was never read. Reading the cell my own probe typed into: painted **rgb(2,111,196) =
`#026FC4` exactly**, h 251.2, **Δ0.17° from crayon-blue**, **5.065:1** against the card —
identical in chromium and webkit. Dark: webkit rgb(71,167,255) = `#47A7FF` exactly, 7.341;
chromium rgb(70,166,254), 7.258. **G5 is GREEN in both themes.** That gap is closed, not open.

---

## 2 · THE CONTAMINATION DEFENCE IS FALSIFIED, AND THE DARK ARM FAILS 1.4.11

This is the finding that moves the verdict.

The prototype reported painted trace-vs-frame-line at 3.098 / 2.841 light and 2.705 / 2.694
dark, and declined to call it a product failure on the ground that the probe's "frame line"
pixel was itself part trace — the 5 px stroke sits on the 1 px line inside a 22 px band. It
named the fix: *sample the line on a board edge the front has not reached.*

I ran exactly that instrument. At **valuenow 15** the front is still on the top edge (the top
run is 976 of 3,952 perimeter units, 24.7%), so the BOTTOM edge carries frame line and no
trace at all. Sampling both bands in the same screenshot:

| theme / engine | painted line, TRACED top | painted line, UNTRACED bottom | trace core | trace vs line | trace vs paper |
|---|---|---|---|---|---|
| light chromium | (49,49,49) | **(49,49,49)** | (158,117,5) | **3.098** | 4.126 |
| light webkit | (49,49,49) | **(49,49,49)** | (158,118,6) | **3.127** | 4.087 |
| dark chromium | (199,197,190) | **(199,197,190)** | (130,112,14) | **2.845** | 3.807 |
| dark webkit | (199,197,190) | **(199,197,190)** | (131,113,16) | **2.805** | 3.862 |

The untraced ground reads byte-identical to the traced one, in all four cells. **There is no
contamination.** The painted frame line simply never reaches its token: a 1 px hand-drawn
stroke antialiases, so `hsl(0 0% 15%)` = (38,38,38) paints (49,49,49) and
`hsl(48 10% 80%)` = (209,207,199) paints (199,197,190). The prototype's own numbers were
right; the excuse was wrong.

Consequences:

1. **The dark progress ink does not clear the WCAG 1.4.11 3:1 non-text floor against the
   frame line it retraces — 2.845 and 2.805, both engines.** It clears against the card
   (3.807 / 3.862). Which ground is operative for a 5 px stroke laid on a 1 px line is a
   convention question worth a ruling, but the family chose the convention itself and then
   failed it.
2. **`index.css:318-320` states a false provenance.** The comment reads "Contrast ledger …
   read off the painted bytes in both engines: light #A47903 vs --grid-line-color 3.59". No
   painted read produces 3.59; 3.59 is token arithmetic. The dark comment (`:457-460`,
   "3.22 … painted bytes") is the same. This is the *record can't verify the record* failure,
   written into the file the record cites.
3. **The comparative claim — "the worst of the four arms RISES 3.35 → 3.57 light and
   3.05 → 3.18 dark" — was never measured painted at HEAD**, so the improvement is asserted
   in one space and the pass claimed in another.

The fix is a token, not an instrument: `#7d6902` needs roughly one more tier of separation
from the painted (199,197,190) line, or the dark trace ledger has to name the CARD as its
operative ground and say why.

---

## 3 · G0'S HEADLINE ARM MEASURES A 25-SEGMENT STUB

The section finding is genuinely overturned and the ~128-segment law is real (the
`rect4` / `dense599` / `poseEvery4` / `poseEvery16` discriminator separates `pathLength`,
spelling and wobble cleanly — that is the best work in this pass). But the arm the README
leads with does not test what it claims.

`probe/front-live.mjs` `cutInPage()` caches the live element's CURRENT `d` as
`el.dataset.full` — and after `writeOne()` that `d` is **already truncated by `poseFronts`
at the board's own ~1/40 progress**. `front-live.json` records it: `geom.segments = 25`,
counted as `d.match(/L/gi).length`. `fullRingSamples()` then samples `dataset.full`, i.e.
the stub. So:

- the "same four points" table (0.087 / 0.285 / 0.532 / 1.000) is the painted share **of a
  25-segment stub**, not of the ~490-segment ring;
- `p = 1.00` reads 1.000 by construction (the cut returns `d` unchanged);
- and a 25-segment path is an order of magnitude below the ~128-segment threshold the whole
  defect lives at, so **this arm could not have gone red even with the dash still in place.**

The product claim survives only through `front-app.mjs` (0.053 / 0.303 / 0.805 / 1.000,
Δ ≤ 0.10 points) — which never touches the DOM, but samples an **ideal rect**
(`M12,0 L988,0 L988,1000 L12,1000 Z`) rather than the wobbled pose, which is why its own
dpr3 rows fragment into noise. So G0 today has **no clean arm on the real ring at the real
segment count**. Closable in one probe: force the fraction through the component's own prop
and sample the untruncated pose from `generateFrameTraceFrames`, not from the live `d`.

---

## 4 · THE READINGS ARE NOT ALL FROM THE SHIPPED TREE

`readings/board-ink.json` — which carries G1, G2 (the win), G5, G9 and the whole 1.4.11
ledger — records `tokens.dasharray: "3965.63px, 3965.63px"` with `pathLengthAttr: null`.
That is the **intermediate build**: the spec's cure (drop `pathLength`, dash in real units),
not the shipped one. `front-live.json`, taken after the re-cut, reads
`dasharrayComputed: "none"`.

No single tree state carries all ten gates, and the README presents them as one. I
re-measured the colour rows on the shipped tree and they hold (trace core (158,117,5), h 83.7,
3.098; digit 5.065; computed stroke `rgb(164,121,3)` / `rgb(125,105,2)`), so the substance
survives — but **G2 (the win) and G9 (the census) have not been read on the tree that ships**,
and the record does not say so.

---

## 5 · A DECIDED-HISTORY LAW IS AMENDED BY A COLOUR LANE

R6 §2 law 25: *"Gold is earned light — it lives in the sky and comes to the page only when
the work is done."* R6's own header: these are "standing rulings that a W7 proposal may not
re-litigate."

The diff rewrites it in place (`index.css:189-195`): "AMENDED (T9-W7 §3): it has TWO MOMENTS
on the page… gold arrives WITH the work and is spent WHEN it is finished." The amendment may
well be the right call — a gauge that paints gold at the first digit does contradict the old
sentence — but the sentence is the chair's or the owner's, and the diff lands it as prose
with no disposition row, no ballot, and nothing citing an authority for the change. This is
the one row where the family exceeds its charter rather than merely leaving a gap.

(R6 law 23 — "a semantic state token is an alias into the crayon system, zero new hexes" —
is not newly broken: `--color-user-ink` and `--color-progress-ink` were already among the
named exceptions. But the family's own sentence, *gold at pencil pressure*, is expressible
as a derivation off `--color-crayon-gold` the way `--sparkle-glow-*` already is, and shipping
it as a hand-tuned hex is what makes §6 below necessary.)

---

## 6 · THE SENTENCE HAS NO GATE

"Every interactive accent is one of the five crayons at a different pressure" is the family's
whole claim, and nothing in the repo checks it. G1 runs from
`instruments/hue-census.COPY.mjs`, a lane-local copy. Someone nudging `#a47903` two degrees
next quarter reds nothing: not `lint:theme-tokens` (which counts references), not the
goldens, not the filter census. The kinship census has to be seated as a committed
instrument in the same diff as the tokens, or the family is a comment.

Two more gate defects the lane named honestly and I confirm:

- **G8 as worded has no instrument.** `check-theme-tokens` has no ALIAS-ONLY mode; the alias
  rows were audited by hand.
- **G9's declared term is close to unfailable for a warm accent.** In-family is 40–115°,
  which is the PAPER's own hue band: `board-ink.json` bins 40/50/80 carry 28,693 px of the
  33,938 chromatic pixels. The gate measures "did you add violet", which it did answer
  (born-RED at HEAD), not "are the accents kin".

---

## 7 · The rest of the open ledger

- **The fill front no longer eases.** `d` is not portably animatable, so the front steps
  ~31 px per digit. Declared and handed to U-10 / MOT-LADDER, but the alternative — tween the
  *fraction* on the existing boil scheduler and re-cut `poseFronts` per frame — was never
  costed. (`MOTION.traceFillMs` is described as "retired"; it never existed at HEAD. The
  240 ms was an inline literal. Harmless, but the record should not name a token that was
  never minted.)
- **The new front's paint cost is asserted, not measured.** "Zero re-raster … a fill event
  re-cuts four short strings" — it rewrites four ~490-point `d` attributes, which is a path
  re-tessellation, not the custom-property paint the dash offset was. On an estate whose
  T4-P1 disease was rendered perf, that wants one reading.
- **A dead rule is kept as a fallback.** `.solve-success .grid-line { stroke: gold-star }`
  was measured to paint 0 px under the bake and is retained "for print". Nothing reds if it
  stays dead, and nothing reds if the bake later un-hides the stack and two golds land.
- **The pen is unguarded by any golden** (the lane's own finding: `cell-light` renders a
  given, so the `#2563eb → #026fc4` move produced 0 px of golden delta).
- **The phone was never measured.** The spec declares 393×699 dpr3 board 365 / trace 2.92 px
  / confirm face ≥44 px. No reading exists.
- **`prefers-contrast: more` for the post-win 2.533:1** is booked, not built.
- **No π rect census was run** by either lane. By inspection every changed declaration is
  paint-only (`background` removal, `color`, `stroke`, `filter` at unchanged radii,
  `transition`) except the declared trace geometry — but that is inspection, not measurement.
- **`poseLengths` is exported for consumers that do not exist** (`poseFronts` uses it
  internally). The justification in its doc comment is "handed on to ACC-SIX / the §10 tally"
  — the consumer-less-substrate shape.
- **Only one gauge is cured.** `DifficultyTally.vue:230` still carries `pathLength="100"` on
  a ~100-segment arc, quiet only because it sits under the threshold. The threshold is not a
  contract; a board-size or grain change moves it.
- **Two cited crops do not evidence their captions.** Crop 3 is cited as the confirm
  *hovered*; its bytes give the bare-card 4.917 and neither panel shows a ground. Crop 4 at
  ~5% fill puts a ~21 px gold nub in a 420 px board — the "one arc where HEAD painted four"
  is carried by `front-app.json`, not by the picture, and it is the largest crop of the four
  at 51 KB.
- **`transition: filter 200ms var(--ease-standard)`** keeps a timing literal outside
  `pencilConfig` on a line the family rewrote, while the same diff homes `traceWinMs`. R6
  law 4, applied to one of two lines touched.

---

## 8 · Strengths, stated plainly

1. **It built its own spec's ruling and measured it RED, then replaced the cure.** §1 said
   `pathLength` causes WebKit's 92%-at-a-quarter gauge; the lane proved it does not and shipped
   geometric truncation instead. That is the most valuable act in this batch.
2. **The ~128-segment law is a real, generalizable estate finding** with a discriminating
   experiment (3-segment rect clean, 599-segment STRAIGHT rect broken, 123-segment decimation
   clean) that rules out `pathLength`, the spelling and the wobble together.
3. **It found a genuine blocker**: the win's gold lands on a `display:none` baked vector stack
   and paints zero pixels, so the completion hand-off never read on screen at all. The stroke
   lift is the first version that paints.
4. **It proved pass 1's ablation was a no-op** with a layered arm reading ΔL 0.000 — a
   discipline every family in this pass now owes its own ablation.
5. **Three of its changes remove rather than add**: the `--color-blue-ink` alias, the guard
   verb's ground (no red one replaced it), and `pathLength`/`dasharray`/`dashoffset`/the
   240 ms tween.
6. **Four of its own instrument defects are named in its record** instead of quietly fixed.
7. The mechanical guard set really is green on a dist built inside the worktree: filter
   census 12/12 both engines, goldens 4/4 at HEAD's pads, 810 unit tests, vue-tsc and eslint
   clean. I re-ran six lints myself and all six exit 0.

---

## 9 · What would close it

`#7d6902` re-pitched (or its ground re-declared) so the painted dark arm clears 3:1 with the
provenance the comment claims · G0 re-cut against the untruncated pose at its real segment
count · G2 and G9 re-read on the shipped tree · law 25's amendment taken to the chair · the
kinship census seated as a committed instrument · G8's instrument written · the phone read ·
the front's paint cost read once. None of these needs a primitive that does not exist, which
is why this is ADVANCE and not BLOCK.
