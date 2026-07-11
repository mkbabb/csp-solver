# crit-design — the refutation lane (a1 completion+perf, a3 toggle re-cut, a5 drawer)

REFUTE BY DEFAULT. Verified every BEFORE claim against git (08f3ddd9) and every code cite against the
mid-wave working tree, read-only, 2026-07-11. Verdict up front: a1 and a3 are unusually clean — the
factual spine of both survives verbatim. a5 (drawer) **does not exist yet** (mid-wave; not written at
read time), so the mandated mobile+a11y check has no artifact to run against; I record the hazards it
must clear. Convergence dragged by the absent lane and two honestly-flagged over-reaches, not by
fabrication.

Paths as they actually are (both lanes' cites carry mild line drift on a moving tree):
- toggle: `web/frontend/src/pencil/celestial/DarkModeToggle.vue` (BEFORE 300 lines; tree 586 — both confirmed)
- config: `web/frontend/src/pencil/config/pencilConfig.ts` (a3 wrote `pencilConfig.ts:47` — basename correct, spiral at :47)
- board: `web/frontend/src/games/sudoku/SudokuBoard/SudokuBoard.vue` (nested; a1 wrote `SudokuBoard.vue:NNN` — basename correct)

---

## a3 — toggle re-cut + spiral. Verdict: CONFIRMED, one CORRECTED over-reach.

**BEFORE toggle claims — CONFIRMED verbatim** (`git show 08f3ddd9:…/DarkModeToggle.vue`):
- `handleToggle()` is one line, `toggleDark()` — before:150-152. CONFIRMED.
- outgoing `translateX(-50%) rotate(-270deg) scale(0.1)`, transform 800ms `cubic-bezier(0.34,1.56,0.64,1)`,
  opacity 800ms +100ms delay; incoming the mirror, opacity 300ms — before:192-221. CONFIRMED verbatim.
- spiral inline `#F0B030` stroke-width 10; disc core `#F09855` — before:30-35. CONFIRMED.
- 300 lines. CONFIRMED. "Double-exposure crossfade / -270° whirl / flip-at-click" is exactly what the code does.

**W10 mechanics a3 says read ruined — CONFIRMED, not fabricated** (working tree):
`phase` machine + `visualDark`/`ariaDark` split (tree:168-171), `pendingFlip` = "toggleDark() owed but
not yet fired (the load-bearing bit)" (tree:175), fired at `settleNow()` (tree:243-244), 4×
`createSequenceSubscription` (seq1-seq4, tree:282-302), `overflow:hidden` porthole (comment tree:151),
`settleNow()` hard-snap (tree:241). Every ranked finding in a3(b) is grounded. The deferred real-theme
flip is genuine: tree:153 says aria flips at click but paint is deferred — the *page colors* wait for
the ~360ms crossover. a3's "reads as lag" holds.

**Finding 4 spiral contrast — CONFIRMED to three decimals.** Re-derived WCAG luminance independently:
`#F0B030` vs `#F09855` = **1.175**; `#DF9A1E` vs `#F09855` = **1.063**. Exactly a3's table. S2 *lowered*
the very metric its own rationale invoked (pencilConfig.ts:41 comment "was 1.17:1 on the disc" — real).
`sun-spiral.png` corroborates visually: murky same-value ochre, the coil nearly vanishes. Revert to
`#F0B030` is right and owner-named. The honest caveat a3 itself makes — both values are far below any
threshold, so the real carrier was *hue* pop not luminance — is correct and keeps the claim honest.

**CORRECTED — the S1 geometry revert is an over-reach.** The owner's word was **"contrast"**
(sun-spiral.png), which licenses the COLOR revert (S2) unambiguously and nothing more. a3 also reverts
the S1 PATH recut + stroke-width 10→9 (F4 table, disposition "REVERT") on the argument that "as it was
before names the spiral as a gestalt." That's an inference, not the verdict; a3 flags it ("a
kept-geometry/reverted-color hybrid is a third state") but proceeds to revert anyway. Kill S1 from the
revert scope unless the owner names geometry — the color revert alone answers the literal "contrast"
complaint, and the sw-10 edge-kissing coil was not implicated by any shot.

**Unadjudicated hand-off (noted).** a3 exempts W1 (toggle outline +1) from finding 2 by asserting
boil-hairline.png is "the controls card's HandDrawnOutline — a different lane." Plausible, but that is
a2's surface; W1 shouldn't be certified KEEP on a cross-lane assertion this lane can't close. Leave open
for a2 to confirm.

---

## a1 — completion area + perf. Verdict: CONFIRMED, two small CORRECTED.

**Forensics — CONFIRMED (code + both screenshots).** Board cap `lg:max-w-[calc(100dvh-10rem)]`
SudokuBoard.vue:138; `.board-margin` absolute `top:100%` :562/574/576; `.completion-note` :588;
`.sticker-slot` :595; `contain: layout style` (paint missing) :537; `transition-all duration-500` :143.
All present. `a1-completion-live.png` shows exactly the three-corner fragmentation a1 describes — orphan
star flush-left, text cluster beside it, heart ~diagonal at the board's bottom-right corner — at caption
scale against a 646px board. `completion-area.png` (owner) shows the verdict line clipped at the fold.
The "solving turns a fitted h-screen into a scrollable page" claim (scrollHeight 843 > 806) is the
mechanism behind the owner's clip. Reproduced-by-inspection.

**CORRECTED — the h-screen cite is stale.** a1 wrote "h-screen page — App.vue:118"; h-screen is at
**App.vue:129** now (`class="flex h-screen flex-col …"`); :118 is a ref declaration. Cite drift on a
moving tree — the FACT (an h-screen page) holds; fix the line.

**Perf attribution — CONFIRMED-by-method.** The six 11–58MB trace JSONs exist; the elimination ladder is
internally consistent and the headline ("hiding `.board-cells` halves paints, cuts GPU ~85%, main-thread
~50%; the glyph boils, not the celebration, are the dominant painter") is the sound reading of it. a1 is
honest about dev-vs-prod (the paint/raster regime is real in prod; the JS share and HMR bursts are dev
mid-wave). No refutation. The scoped specs (quantize the boil beat, `contain: paint` on `.board-wrapper`
with the honest overflow-vs-overhang caveat, step the twinkles, scope `transition-all` to box-shadow)
are all grounded in cited lines.

**CORRECTED — R1's 1024-1279 fallback has an unflagged collision.** R1 primary (≥1280 left-margin
vignette) is sound and soul-fitting — the teacher's-grade-in-the-margin metaphor answers all three
clauses (scale, occlusion, flow). But its 1024-1279 rung "docks as a corner-press sticker over the
board's TOP-LEFT frame" — which is (a) exactly where finding 5's board artifact lives, and (b) over
live top-left puzzle digits at 112px→sticker scale. a1 didn't flag either. Prefer top-right, or keep
in-flow, at that rung.

---

## a5 — drawer. Verdict: UNVERIFIABLE (not produced) + forward hazards.

No `a5-*.md` exists at read time. The mandated check (drawer spec vs mobile regime + a11y) has no
artifact. Recording what a5 MUST clear so the gap is on the record:

1. **Mobile regime is unaddressed by the owner's own spec.** Finding 6 is horizontal-space choreography
   ("slides under the board, board shifts leftward, grows bigger"). At <1024 the board already fills the
   viewport (`w-[min(42rem,calc(100vw-1.5rem))]`, SudokuBoard.vue:138) and the layout stacks — there is
   no leftward room and nothing to shift into. a5 must define a stacked fallback (bottom-sheet, not a
   side drawer) or the feature breaks the mobile regime silently.
2. **Perf collision with finding 1 — the load-bearing hazard.** The owner wants the board (and logo) to
   **grow bigger, smoothly and fully animated**. a1 just proved the board cells are the DOMINANT painter
   (halving paints when hidden) and that this page can't afford full-viewport re-raster. Animating the
   board's SIZE re-rasters the filtered board every frame — the single most expensive tween available on
   this page. a5 must specify a transform/translate move (and a size STEP at the ends, or a promoted
   layer), never a width/size tween of the filtered board, or finding 6 actively worsens finding 1.
3. **a11y.** A drawer that hides SIZE/DIFFICULTY + undo/erase/check/share behind a pull-tab makes the
   primary controls non-visible by default. a5 must specify: `aria-expanded` on the tab, a ≥44px tap
   target for a "small drawer element," keyboard open/close, focus order into the drawer, and whether
   check/share stay reachable when closed. None of this can be assumed.

---

## Convergence — per-deduction arithmetic

Base 100 (survival of the design-lane corpus under refutation):
- −2  a1 h-screen cite stale (App.vue:118 → :129); fact holds
- −4  a1 R1 1024-1279 top-left dock collides with finding 5 + occludes top-left digits (unflagged)
- −5  a3 S1 spiral GEOMETRY revert beyond the owner's "contrast" verdict (over-reach; honestly flagged)
- −3  a3 boil-hairline→a2 exemption of W1 is an unadjudicated cross-lane hand-off
- −5  finding 6 (animate board growth) vs finding 1 (board = dominant painter) reconciled by no lane
- −20 a5 entirely absent — a mandated target lane; drawer vs mobile+a11y unverifiable

Total −39 → **convergence 61%.**

Read the number right: the *verifiable* corpus (a1 + a3) is ~92% sound — nearly every checked claim
CONFIRMED, two of them to the decimal / verbatim. The 61% is the whole targeted set, pulled down chiefly
by an unwritten a5 and two owner-scope over-reaches, not by any falsehood in the two lanes that shipped.

### kill_list
1. a3 S1 spiral GEOMETRY revert (path recut + sw 10→9) — cut from the revert scope; revert COLOR only (#DF9A1E→#F0B030), which is all "contrast" licenses.
2. a1 R1 1024-1279 corner-press over the board TOP-LEFT — kill; collides with finding 5 + top-left digits. Use top-right or stay in-flow.
3. a1 App.vue:118 h-screen citation — fix to App.vue:129.
4. Any a5 formulation that animates the board's SIZE/width (finding 6) — kill; re-rasters the dominant painter every frame per finding 1. Translate + step, or promoted layer, only.
5. a3's KEEP-W1 certification riding on the boil-hairline→a2 assertion — hold open until a2 confirms; don't exempt W1 on this lane's say-so.
