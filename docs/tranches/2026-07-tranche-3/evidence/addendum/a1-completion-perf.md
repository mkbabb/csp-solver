# A1 — the completion area + the page perf (owner finding 1)

Lane: a1-completion-perf (design, Fable + frontend-design). Read-only forensics at :3001 against the live mid-wave tree (W9 committed at 08f3ddd9; W10 running uncommitted). Owner verdict: "the star and heart area is still preposterous — too small, occludes the bottom of the page, messes up the flow of the page. And the performance is god awful on this page."

Screenshots (this lane, all at 1440×806 CSS / DPR 2, dark, `?size=3&difficulty=MEDIUM`):
- `a1-solved-1440.png` — 4s post-solve, unscrolled: the verdict line clipped by the fold, exactly the owner's `owner-audit-2/completion-area.png`
- `a1-completion-live.png` — scrolled to bottom: the full block as composed
Traces: `a1-settled-trace.json` (solved, 11.4s), `a1-unsolved-trace.json` (11.4s), plus the elimination set `a1-notwinkle/-nogrid/-nogridlogo/-nocells/-notoggle-trace.json`.

---

## (a) Forensics — what's actually wrong, with numbers

Reproduced first try. Measured geometry, solved + settled, 1440×806:

| element | rect | source |
|---|---|---|
| board square | 646×646 @ y=137, bottom **783** | cap `lg:max-w-[calc(100dvh-10rem)]` — SudokuBoard.vue:138 |
| viewport fold | **806** | h-screen page — App.vue:118 |
| `.board-margin` / `.completion-note` | 638×**52** @ y=**791.6**, bottom **843.6** | overlay `top:100%; z-50` — SudokuBoard.vue:573–581 |
| `.sticker-slot` (star) | 52×52 (3.25rem) | SudokuBoard.vue:595–598 |
| `.margin-note` (voice) | 578×24 @ y=791.6 | MarginNote.vue:78–87 |
| `.margin-note-meta` (tally) | 109×19 @ y=812.6 | MarginNote.vue:124–134 |
| `.celebration-heart` | 44×44 (2.75rem) @ board corner, bottom 798.8 | CelebrationHeart.vue:169–179 |
| document scrollHeight | **843** vs 806 viewport | — |

**What reads "too small."** All of it, at page scale: the 3.25rem star is 8% of the board edge, the 2.75rem heart 6.8%, the voice one 24px body line, the tally an 18px caption rung — against a 646px board and a 118px-tall wordmark. The gold moment's entire visual mass is a caption cluster. W9's probes graded the pieces (slot grid, in-flow star, meta outside the live region — all internally sound); nobody graded the moment against the masthead it answers to.

**What "occludes the bottom."** The ≥lg `.board-margin` is an absolute overlay at `top:100%` (SudokuBoard.vue:573–581) under a board whose dvh cap leaves exactly **23px** of viewport below it (783→806): masthead 118px + page padding ate the rest of the 10rem allowance. The 52px block therefore lands **37.6px past the fold** — the verdict line is cut mid-glyph (the owner's shot), the tally fully buried — and, because absolute overflow still scrolls the root, **solving turns a fitted h-screen page into a scrollable one** (scrollHeight 843 > 806). The user must scroll a page that was never meant to scroll to read their own grade. The heart's `bottom:-1.1rem` overhang ends 7px shy of the fold — it reads as grazing the page edge, not crowning the corner.

**What breaks the flow.** Three disconnected fragments at three corners: the orphan star flush-left in a 638px strip, the text cluster beside it, ~500px of dead strip, then the heart 600px away on the diagonal (`a1-completion-live.png`). The page's only NEW content after the solve lands half off-page, left-cornered, at caption scale. Eye path: board center → bottom-left corner → clipped.

**Side finding (spec-worthy, not the owner's item).** `celebrating` is edge-triggered — `state === 'solved' && prev !== 'solved'` (SudokuBoard.vue:189–198) — so any remount while solved (HMR mid-wave; any future keep-alive/regime swap) drops the star + heart while the gold note persists. Observed once live (unreproduced after; suspected W10-lane HMR). Whatever re-formulation ships, derive the completion presence from state, not the transition.

Confirmed persistent otherwise: heart + sticker + gold note held ≥45s post-solve (polled t0/5/15/30/45) — it's a state, and the composition must read as one.

---

## (b) Re-formulations — giving the moment room

The owner's verdict is compositional: the pieces are fine, the moment has no ROOM. The page is a graded workbook exercise; a teacher's grade goes in the margin BESIDE the work, at grading scale — not a caption cowering under the fold.

### R1 — the grade in the margin (primary)

Kill the below-board strip as the gold verdict's home. The completion block becomes a **margin vignette in the left column** — the true teacher's margin, 255px wide at 1440 and empty today — anchored at the board's optical upper third, tilted −4° (hand-graded slant):

- the foil star at **6.5–7rem** (~112px — real grading-sticker scale; the draw-on + gleam read at last),
- "solved it!" beneath it in the hand at ~2rem,
- the tally **folded into one line** under the voice ("0 backtracks — 1ms", caption rung as today) — two text rungs total, no third,
- the heart stays the board's corner sticker but rises to **3.5rem** and shifts to `bottom:-0.4rem` — crowning the corner instead of grazing the fold.

Nothing renders below the board on the gold path → no fold overflow, no scroll, no occlusion — the strip survives solely for graphite/teacher-red/error states (transient, one line, and those already fit the 23px gap when the meta rung is absent). Motion is unchanged by construction: the star's draw-on/gleam and the heart's bounce/blink/murmur all live on wrapper transforms and dashoffset — only the anchor moves; zero new subscribers. A11y unchanged: MarginNote's live region stays where it is in the DOM; the vignette is `aria-hidden` decoration (the voice still announces the grade).

Rungs: ≥1280 the full left-margin vignette; 1024–1279 (margin thins) it docks as a corner-press sticker over the board's TOP-LEFT frame (diagonal opposite the heart, the sticker register the heart already established); <1024 (stacked) it renders in flow, centered between board and controls card, star at 4.5rem.

### R2 — the corner-press vignette (if the verdict must stay below)

Unify star + heart into ONE sticker cluster pressed over the board's bottom-right corner — star ~5.5rem overlapping the frame, heart ~3.5rem tucked at its flank, slightly rotated, the way kids stack stickers. The strip collapses to a **single line**: "★ solved it! — 0 backtracks, 1ms" (meta inline; the inline note-star MarginNote.vue:48–65 already proves the mechanic). Pair with one layout give: the ≥lg cap goes to `calc(100dvh-12rem)` (SudokuBoard.vue:137–139) so the single line sits ABOVE the fold with air. Fixes fragmentation and the fold; costs ~1.3rem of board size.

### R3 — the floor (minimal)

Keep geometry; fold the tally inline (one line), grow the slot to 4.5rem, center the block under the board, cap −1rem. Cheapest; still fights the fold for room and leaves the moment caption-scaled. Documented only so the floor is explicit.

**Recommendation: R1.** It's the only formulation that answers all three clauses of the verdict at once — scale (the star at sticker scale), occlusion (nothing below the board), flow (the grade sits beside the work, where the page's fiction says it belongs).

---

## (c) Perf — the attribution, honestly

10s+ traces on the SETTLED page (post-solve, no input), 1440×806, 120Hz display, dev server.

**Headline: the settled page never idles.** Solved, 11.4s: 1355 Commits + 1372 Paints (~120/s — a paint every frame), UpdateLayoutTree 1355, RunTask 2.13s (~19% of a core), Layerize 140ms, 11 298 UpdateLayer. ~50/s of those paints are **full-viewport (2880×1632 device px)**. The unsolved page traces the same (1362 commits, RunTask 2.94s) — **the celebration is NOT the cost**: DOM mutation rate is cadence-capped globally at ~58–60/s in both states (measured; 45/s are path `d` swaps, ~13/s boil-layer class flips), and the murmur is an honest setTimeout chain (celebration.ts:86–92, zero-subscriber). The scheduler is exactly one rAF (`schedulerTick`, 242 fires/2s = every 120Hz frame) carrying 9 persistent `frame` subscribers (`__schedulerDebug`: chains 1, subscribers 9 — inside the 10 budget).

Elimination ladder (per second, settled unsolved):

| condition | paints/s | full-vp/s | style recalc/s | GPU ms/s | RunTask ms/s |
|---|---|---|---|---|---|
| baseline | 112 | 51 | ~120 | 86 | 300 |
| twinkles paused | 112 | 51 | **38** | 86 | 300 |
| + grid hidden | 105 | 45 | — | 62 | 200 |
| + logo hidden | 107 | 46 | — | 78 | 230 |
| + board cells hidden | **57** | **24** | — | **12** | **101** |
| + dark-toggle hidden | **32** | **12** | — | 9 | 70 |

Attribution, in order:
1. **The glyph boils are the dominant painter.** Hiding `.board-cells` halves paint rate, cuts GPU ~85% and main-thread ~50%. Mechanism: ~45 path-`d` swaps/s jittered independently across the boiling glyphs — an invalidation lands in nearly every 8ms frame, each dirtying a feTurbulence-filtered path INSIDE the un-promoted scrolling contents layer, so Chrome records ~50 full-viewport paints/s. The design intent ("sparse swaps") is defeated by phase spread: 45 sparse writers ≈ one continuous one.
2. **The celestial twinkles run on the main thread.** `star-twinkle` CSS animations on SVG children (6 targets, running) aren't compositable — style recalc every frame; pausing them dropped UpdateLayoutTree 120/s → 38/s.
3. **The dark-toggle moon** contributes another ~25 paints/s on its own.
4. Residual ~32/s: the controls-card icon glyphs' boil + attribution chrome.

**Dev-only vs real.** Real in prod: the paint/raster/GPU regime — filter re-raster and full-layer damage don't care about minification. Dev-only: Vue dev runtime + unminified pencil-boil inflate the RunTask JS share; the FilterTuner is mounted-idle (App.vue:29–31); and the owner audited a MID-WAVE tree — W10's lanes were writing, so Vite HMR recompile bursts rode on top of the ambient 19–26%/core. That's the "god awful" superlative's likely last straw, but the floor it landed on ships as-is.

**The composition ties into the perf complaint.** Fixing finding 1 removes the one scroll the page has — and scrolling is this page's worst act: full-page filter re-raster under a 100-paints/s regime. The clipped verdict forces exactly that scroll.

Spec (no implementation here):
- **Quantize the boil beat.** All boil subscribers swap on a shared global tick (e.g. an 8Hz beat window) so invalidations coalesce into ~8 dirty frames/s and the pipeline gets idle frames — cadence bands live in pencilConfig.ts's MOTION; this is a scheduler-level alignment, not a retune.
- **Fence the damage.** `contain: paint` (or a promoted layer) on `.board-wrapper` (SudokuBoard.vue:534–538 has `contain: layout style` — paint is the missing one; verify vs the heart/margin overhangs, which `overflow: visible` currently needs) so a glyph swap dirties a 646px layer, not the viewport. Same treatment for the toggle's celestial.
- **Step the twinkles.** `steps()` timing or a longer period on `star-twinkle`, or move the opacity to a compositable wrapper — kills the per-frame recalc.
- **Scope `transition-all`.** SudokuBoard.vue:143's `transition-all duration-500` on the board wrapper should be `transition: box-shadow 500ms` — it exists for the gold/red shadow only (index.css:352–363); `all` volunteers every future property change into 500ms tweens.
- **Derive `celebrating` from state** (the side finding above) so the completion composition survives remounts.
