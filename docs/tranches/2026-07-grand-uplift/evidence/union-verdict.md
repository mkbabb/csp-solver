# union-verdict — Pass 3 adversarial hardening of THE UNION JUDGMENT

**Agent**: union-verdict (critique) · **Date**: 2026-07-05
**Target**: the storybook-glass union — `pass25/design-union.md` (spec), `pass25/union-prototype.md` + `union-prototype.diff` (built prototype), `pass25/union-screenshots/` (51 stills, viewed as images).
**Worktree**: `HEAD = 91bb8b0` (correct; no stale-bc37f4d reset needed). All work read-only against the deliverables; no code touched.
**Verdict up front**: **holds-with-amendments.** The soul veto is a clean, verified pass. The *material-system* thesis (a "sheet ladder" of vellum/washi/laminate) is effectively **refuted** — it collapses to exactly the spec's named fallback, "blur-0 translucent paper," and its two persistent translucent surfaces are *perceptually invisible*. What survives is not a material system but **two severable things: one better tooltip (washi) and one new feature (hold-to-peek)** — and the peek feature's *glass* is itself severable from its *function*. My attack sharpens the prototype's own "adopt-partial" into a narrower, harder-edged cut and promotes one "minor quirk" to a blocking defect.

---

## 1. Attack design

I ran the union against its own six-axis framework (`design-union.md §8`) and the mandate's five vectors, treating pure-pencil as the incumbent that wins ties. Method:

- **Viewed every decision-relevant screenshot as an image** (not just filenames): the two idle composites (light/dark), both peek composites, the held board crops (light/dark), panel/tooltip/attribution crops pencil-vs-union in both themes, the PRT opaque fallback, the WebKit cross-engine render, and the motion strip.
- **Re-derived the numbers** from the raw deliverables: `union-traces/perf-summary.json` (18 runs), `ssim-results.json`, `git apply --stat` on the diff, and greps of the diff for `backdrop-filter` / `glass` / `--sheet-` / the render logic.
- **Separated two gates the spec conflates**: the *code-comment* fiction audit (does the source name each object?) vs the *perceptual* naming test (can a viewer name it?). The spec's own §7.4.1 flip test demands the latter; §7.4.6 only tests the former.

---

## 2. Per-surface flip test (evidence-backed)

Screenshots cited are in `pass25/union-screenshots/`.

| # | Surface | What the pixels show | Names object? (code / viewer) | Verdict |
|---|---|---|---|---|
| 1 | **Board / cells / glyphs / mascot** (soul) | `composite-idle-{light,dark}`: pencil ∥ union indistinguishable. Board SSIM **1.00000** exact, DOM SHA-256 identical. | n/a (untouched) | **SOUL — PASS.** Veto axis clean. Not a union adoption; it's the incumbent, preserved. |
| 2 | **Washi tooltip** | `union-{light,dark}-tooltip` vs `pencil-*-tooltip`: solid black pill → tinted paper-tape scrap, torn ends, ±1.5° tilt, Patrick Hand, **+ affordance text "· hold to peek"**. Works in both themes. | code: yes / viewer: **yes** ("tape") | **DEFT — ADOPT.** The one clear per-pixel win. More in-world than the pill *and* adds discoverability + a `:focus-visible` fix. |
| 3 | **Answer-key laminate — FUNCTION** | `composite-peek-{light,dark}`, `union-*-held-board`, `motion-strip-laminate`: hold Solve → board freezes, blanks fill with teacher-red printed answers, givens survive, release restores your entries. Novel; pure pencil has no peek. | code: yes / viewer: yes (behavior) | **NOVEL — ADOPT (with conditions §5).** Load-bearing win. Value is the *feature*, not the material. |
| 4 | **Answer-key laminate — GLASS** | `union-light-held-board`: **zero** visible sheet — pure white, black+red digits, no rim/milk/blur. `union-dark-held-board` / `webkit-dark-held-board`: a *faint* rim catch-light + slight gloss along the board edge. | code: yes / viewer: **light NO, dark faint** | **MARGINAL / SEVERABLE.** The glass is a dark-only garnish, invisible in ~50% of exposure (light). The app's *only* `backdrop-filter` and its whole perf/cross-engine risk buys a faint dark-mode edge. |
| 5 | **Vellum ControlPanel** | `{union,pencil}-{light,dark}-idle-panel`: **indistinguishable in both themes.** 72–80% cream-card over a cream page = opaque. Storybook read is 100% the pre-existing cartoon outline. | code: yes / viewer: **NO** | **INVISIBLE — CUT.** Fails the spec's own §1.2.5 naming gate perceptually. Perf-free, harm-free, *value-free.* |
| 6 | **Vellum-lifted AttributionCard** | `union-light-attribution` vs `pencil-light-attribution`: **indistinguishable** — the "sudoku" logo already shows through in *both* (pencil was already 80% + the union even *removes* its `blur(12px)`, diff L340). | code: yes / viewer: **NO** | **INVISIBLE styling — CUT; keep the a11y fix.** The only real gain is the real-`<button>` semantics, which is severable and belongs in pure pencil regardless of any sheet tokens. |
| 7 | **Sticker gleam** | Not built — no 3-beat celebration timeline exists in this tree to hook. | — | **BLOCKED — defer.** Correctly not faked. |

**The collapse, stated plainly.** Strip the invisibles (5, 6-styling) and the not-built (7), and the union's *persistent* footprint is: blur-0 tinted paper (the washi tooltip) + blur-0 near-opaque cards you cannot see. That is precisely "blur-0 translucent paper" — the fallback `design-union.md §8` names as "explicitly honorable… the evidence supported translucent *paper* and not glass." The prototype's own UP4 concedes it: *"the union's persistent-paper surfaces (vellum panel) are its weakest: translucency invisible over a matching page."* The material-system framing does not survive contact with the pixels.

---

## 3. Is the visible delta worth 678 LOC / 11 files?

`git apply --stat`: **11 files, 678 insertions / 28 deletions.** Attributing LOC to *visible* outcomes:

| Bucket | ~LOC | Visible return |
|---|---|---|
| Washi tooltip (`SheetWashiLabel.vue` + wiring) | ~95 | **Yes** — the one clear win |
| Peek feature (`AnswerKeyLaminate.vue` 200 + `peekSolution` + hold gate + mounts + orchestration) | ~300 | **Yes** — novel function (glass part invisible in light) |
| `--sheet-*` token family + `.sheet-vellum*` classes + fiber `::after` (index.css) | ~130 | **No** — drives the two invisible surfaces |
| AttributionCard sheet styling | ~60 | **No** (a11y `<button>` ~10 LOC is the only keeper) |
| skin flag + scaffolding | ~90 | infra |

So **~395 LOC buy the two things that show; ~200 LOC buy surfaces no viewer can perceive.** A disciplined partial (washi + peek-function, glass optional, vellum/attribution-styling cut) lands nearer **~330 LOC and drops to zero `backdrop-filter`**, erasing the entire perf + cross-engine + PRT risk surface at the cost of one faint dark-mode rim. The full 678 is not worth it; the ~330 subset is.

---

## 4. UD4 freeze evidence — methodology audit (`−71%` credibility)

Read straight from `union-traces/perf-summary.json` (18 runs). The **raster** number is real and clean:

- pencil-idle raster ≈ **1546–1583 ms/6s**; union-idle ≈ **1575–1648** (+3%, within run-variance → chrome adds no raster);
- union-held-**frozen** ≈ **437–467 ms** (n=5) → **−71% vs idle**, exactly as claimed;
- union-held-**nofreeze** ≈ **1470–1576 ms** (n=5) → freeze is what buys it back; `dropped = 0` in all 18.

**But three problems with the headline:**

1. **The `≤ 8.5 ms/frame` gate (§7.4.3b) was never cleared by any condition.** PipelineReporter clustered **9.97–10.16 ms/frame across all 18 runs** — including the *pencil baseline* at 10.05. The metric saturated at this Mac's ~10 ms vsync floor and did **not discriminate**. The gate the spec wrote to adjudicate the laminate returned *inconclusive*, and the prototype pivoted to raster. The one run alleged to clear it on the compositor metric ("quiet-machine run 1: held-frozen 1.47 ms ≈ idle 1.41") is **prose-only — it is not in `perf-summary.json` or the trace set.** The evidence that would have directly satisfied the gate is asserted, not delivered.

2. **The −71% is measured against an unrepresentative architecture.** This worktree runs the **pre-`grain-static-overlay`-fix** grid (single `<g filter=grain-static>` with per-tick `d` rewrites), so idle raster is ~1.5 s/6 s. The *shipping/target* architecture (prototype 9, −72.9%) drives idle raster to ~**0.00**. On that tree there is no boil re-raster left to freeze away, so the dramatic −71% **does not transfer** — it largely evaporates. The prototype discloses this (§2.2 note 5, "composes orthogonally") but the summary still headlines the −71% as the confirmation.

3. **What actually survives is narrower than "UD4 confirmed."** The transferable, load-bearing sub-facts hold: `backdrop-filter` adds **zero raster** (compositor-resident), and held-frozen is the **cheapest condition measured**. That is genuinely reassuring for a *press-and-hold, transient* surface with `dropped=0`. So the laminate is affordable — but on the grounds "it's a bounded transient with no raster cost," **not** on the grounds "the freeze makes it 71% cheaper," which is an artifact of the test tree.

**Net:** UD4 is *weakly* confirmed and architecture-contingent, not the clean win the summary implies. It is not a blocker (the surface is transient, `dropped=0`), but the owner should not bank the −71% headline. And note: **cutting the backdrop-filter from the peek feature (§5) makes this entire question moot.**

---

## 5. The flagship, sharpened: sever the glass from the function

The peek *function* is the union's real novelty and it works. The peek *glass* is invisible in light and faint in dark. Therefore the strongest build is **hold-to-peek without `backdrop-filter`**: freeze board + overlay teacher-red answers on blanks + (optional) a flat milk tint + dark-mode rim via plain `box-shadow`. Consequences:

- Light mode is **pixel-identical** to the current build (the glass renders nothing there anyway).
- Dark mode loses only the faint backdrop-blur gloss; the rim catch-light can stay as a static shadow.
- Eliminates **the app's only `backdrop-filter` surface**, the `-webkit-backdrop-filter` cross-engine pairing, and the entire UD4/§7.4.3b perf question — all of it, for near-zero visual cost.

This is not a hostile reframe; it follows the prototype's own UP4 ("its conviction is the two-ink *behavior* + red key + the dark-mode rim") to its conclusion: the fiction is carried by red ink + behavior, so the ingredient carrying the risk (the blur) is the one carrying the least weight.

**Blocking defect — the PRT fallback is broken, not "minor."** Confirmed in the render logic (`AnswerKeyLaminate.vue`: `if (originalGivenCells.has(pos)) continue` — key digits render *only* for non-given cells, because givens are meant to show *through* the translucent sheet). Under `prefers-reduced-transparency` the sheet goes **opaque** (`--color-card`), so the givens no longer show through — yet the component still skips them. Result (`prt-light-held-board.png`): an opaque card with **red answers in the blanks and empty white holes where every clue was.** The "answer key" is incomplete for exactly the accessibility cohort the fallback exists to serve. The spec's own A11y axis (§8) fails a bracket "unhandled… glass that only works for default-settings users is contrived by definition." The bracket is *structurally* handled (goes opaque) but the *content* is wrong. **Fix before ship** (render the full solution when opaque) or the flagship regresses for PRT users. The prototype filed this as a P3 "minor quirk"; I rate it blocking for the A11y gate.

---

## 6. Fiction audit — two gates, split verdict

- **Code-comment gate (§7.4.6): PASS, verified.** Every translucent element carries a comment naming its object — vellum = "tracing paper lying in contact," washi = "tinted tape," laminate = "the teacher's laminated answer key," teacher-red = "the printed answer-key ink." No `glass-*` vocabulary leaks into any *shipped* token or class (`grep` finds "glass" only inside explanatory prose comments and the skin-flag docstring). `--sheet-*` naming is consistent; `backdrop-filter` appears only on `.sheet-laminate` (+ its PRT/contrast `none` arms). The naming discipline the spec demanded is genuinely enforced.
- **Perceptual gate (§7.4.1 flip test): PARTIAL FAIL.** A viewer cannot name "tracing paper" for the vellum panel (invisible) or for the attribution card (invisible), and cannot name "a laminated sheet" for the light-mode laminate (invisible glass). The code says the right words; the pixels don't. By the spec's own §1.2.5 ("anything that can't name its stationery object is cut"), the vellum panel and the vellum-lifted attribution styling should be **affirmatively cut**, not held "optional."

---

## 7. Maintenance surface

- **Zero new dependencies**, `@mkbabb/glass-ui` absent from `package.json`, frozen hand-ported recipes, no upstream-churn exposure. This is the union's cleanest attribute and it holds.
- **~19 `--sheet-*` tokens + 2 `Sheet*` components + `boilScheduler.ts`.** The hold-gate is *not* cleanly severable from the soul: `heldFrameCount()` is wired into `HandDrawnGrid.vue` and `ControlPanel.vue` (the shared boil path) solely to freeze for the laminate. Adopting peek means this gate lives in the animation core permanently. Acceptable, but it *is* coupling into the soul-adjacent scheduler — the one place the spec otherwise keeps pristine.
- **Topology caveat (untested containment).** Built on **master (`91bb8b0`)**, which lacks prototype-11's `sudoku/`/`skin/` split — components landed in `src/components/{custom,sheet}/`. The ESLint skin/domain boundary that the spec relies on to *keep glass vocabulary contained* **does not exist in the tested tree**, so the "maintenance stays contained" claim is asserted, not exercised. Re-home + boundary-lint required before any real adoption.
- Cutting the invisibles (vellum panel + attribution styling) removes ~130 index.css LOC + the `--sheet-vellum*` tokens *and* deletes the class of bug UP3 caught (the vellum `border` leaking 1px into the centered layout, which forced the inset-box-shadow workaround). Less surface, fewer footguns.

---

## 8. Overall recommendation — **adopt-partial (named)**

Not adopt-union (the material system is invisible), not pure-pencil (two things genuinely earn their place). Ship, in priority order:

1. **ADOPT — washi tooltip** (`SheetWashiLabel`). The clear win; more in-world than the pill, adds "hold to peek" discoverability + `:focus-visible`. Keep the `--sheet-washi-*` tokens it needs.
2. **ADOPT — hold-to-peek *function*** (freeze + red-key overlay + entry survival). Strongly prefer the **no-`backdrop-filter`** build (§5): identical in light, near-identical in dark, and it deletes the app's only glass surface + the whole perf/cross-engine risk. **Blocking:** fix the PRT incomplete-key defect (render full solution when opaque) before ship.
3. **KEEP (as pure-pencil, not "union") — AttributionCard real-`<button>` semantics.** Sever from the sheet styling.
4. **CUT — vellum ControlPanel** and **the vellum-lifted attribution *styling*.** Perceptually invisible in both themes; fail the spec's own naming gate; pure maintenance cost. This also retires the `--sheet-vellum*` tokens and the border-layout footgun.
5. **DEFER — sticker gleam** until a celebration timeline exists (blocked, not skipped).

This narrows the prototype's own "laminate + washi + attribution, vellum optional" by (a) making the vellum cut *affirmative*, (b) reducing attribution to its a11y fix only, (c) severing the flagship's glass from its function, and (d) promoting the PRT defect to blocking. Pure pencil remains a complete, valid end-state; this partial *extends* it without ever threatening the soul.

---

## 9. What the owner should look at to decide (screenshot guide)

- **The material-system question** → open `union-light-idle-panel.png` beside `pencil-light-idle-panel.png` (and the dark pair). If you cannot tell them apart — you can't — the vellum panel is settled: cut.
- **Is there a win at all?** → `union-light-tooltip.png` vs `pencil-light-tooltip.png`. Tape-scrap vs black pill. This is the union's clearest yes.
- **Does the glass read?** → `union-light-held-board.png` (light: no sheet, just red answers) vs `union-dark-held-board.png` / `webkit-dark-held-board.png` (dark: faint rim). Decide whether the faint dark-only rim justifies keeping `backdrop-filter`, or drop it per §5.
- **Is the feature worth it regardless of glass?** → `composite-peek-light.png` / `composite-peek-dark.png` (idle ∥ held) and `motion-strip-laminate.png` (lay → hold → lift, entries survive). This is the real deliverable; judge the *behavior*.
- **The accessibility hole** → `prt-light-held-board.png`. Note the empty white cells where the clues were. This must be fixed before the peek feature ships.
- **Soul is safe** → `composite-idle-light.png` / `composite-idle-dark.png` (pencil ∥ union, indistinguishable), backed by SSIM 1.00000 + DOM SHA-256 identity.

---

## 10. Findings ledger

| # | Class | Finding |
|---|---|---|
| UV1 | design (refutes material thesis) | The union's two *persistent* translucent surfaces (vellum panel, vellum-lifted attribution) are **perceptually invisible in both themes** (verified pixel pairs). The material-system framing collapses to the spec's named fallback, "blur-0 translucent paper." Cut both; keep only the attribution `<button>` a11y fix. |
| UV2 | design (sharpens flagship) | The peek **function** is the real novelty and works; the peek **glass** is invisible in light, faint in dark, and is the app's only `backdrop-filter`. Sever them: ship hold-to-peek **without `backdrop-filter`** — light unchanged, dark near-unchanged, entire perf/cross-engine/UD4 risk surface deleted. |
| UV3 | a11y (blocking) | The PRT fallback renders an **incomplete answer key** — opaque sheet with empty holes where every given was (`prt-light-held-board.png`; render logic skips given cells because it assumes they show through a translucent sheet). Fails the spec's own A11y gate. Fix (full-solution-when-opaque) before the peek feature ships. |
| UV4 | perf (weakens UD4 headline) | The `≤8.5 ms/frame` gate was **never cleared by any of 18 runs** (all vsync-floored ~10 ms, incl. pencil baseline); the discriminating "run 1" is prose-only, not in the traces. The −71% raster is real but measured on the **pre-grain-fix** tree and **does not transfer** to the shipping architecture (idle raster ~0). Surviving sub-fact: backdrop-filter adds 0 raster and held-frozen is cheapest measured — enough for a bounded transient, not the headline. |
| UV5 | maintenance | Zero deps / no glass leak / frozen recipes = clean. But the boil-hold gate couples into the shared boil path (`HandDrawnGrid`+`ControlPanel`), and the whole thing was built on **master topology** — the `skin/` ESLint boundary that's supposed to contain the vocabulary **doesn't exist in the tested tree**. Containment is asserted, not exercised. |
| UV6 | fiction | Split verdict: the **code-comment** naming gate (§7.4.6) genuinely PASSES (every element names its object; no `glass-*` leak); the **perceptual** naming gate (§7.4.1) FAILS for vellum panel + light-mode laminate glass. The source says the right words; the pixels don't. |
| UV7 | soul (concession — holds) | Board SSIM **1.00000** exact, DOM SHA-256 identical (grid/mascot/glyph). Veto axis is a clean, verified PASS — not attacked, it survives. Minor unexplained residual: mascot 0.996 / 96.3% identical-windows vs a 1.0 pencil-vs-pencil control despite byte-identical DOM (capture-AA artifact; non-blocking). |

**Convergence for the design track: 80%.** Everyone now converges on the same shape — pure pencil plus a small, severable partial — and the soul veto is definitively settled. What remains open are refinements inside the partial, not a fork: (a) does peek ship with or without `backdrop-filter`; (b) the PRT fix is mandatory before ship; (c) re-home into the `skin/` boundary and re-verify containment. Those are execution decisions, so the track is close to but not fully settled.
