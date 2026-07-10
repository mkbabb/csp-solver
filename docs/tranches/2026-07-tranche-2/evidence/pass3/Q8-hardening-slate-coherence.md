# Pass-3 Q8 — Hardening slate coherence (DESIGN authority)

**Basis.** Repo HEAD `8913023e` (confirmed via `git rev-parse`), read-only. Fresh source reads of every cited site; cascade conclusions re-derived from specificity arithmetic + the source, corroborated by verify-33's live keyboard probe of the same collision (blue ring on a focused conflicting cell). No prior lane's number is quoted where I could re-derive it.

## Verdict in one line

The slate is **coherent in shape but NOT internally consistent as authored** on exactly the two seams the question names: (a) H1's specificity bullet under-specifies against H1's own amended tier-3 values — five paint properties leak from the higher-specificity tier-2 rule; (b) H5(b)'s "toast" clause contradicts the `role=alert` contract the same spec's E3-KEEP protects. Both are repairable inside W5 with no new prototype and no re-ratification. The R3/verify-33 delta **does** need only the one owner line — but Residual #7's enumeration is one item short (H10-defer missing; H8-centering-only, conversely, doesn't belong in it).

---

## (a) H1: the specificity bullet vs the tint/ring values — INCONSISTENT as authored

### The cascade, re-derived fresh at HEAD

`SudokuCell.vue` (web/frontend/src/games/sudoku/SudokuBoard/SudokuCell/SudokuCell.vue):

- **Tier-2** `:232-240` — `.sudoku-cell:has(input:focus-visible) .cell-ghost-path` = **(0,3,1)** (3 classes incl. `:focus-visible` inside `:has()`, 1 type `input`). Sets **six** properties: `fill` (crayon-blue), `fill-opacity: 0.08`, `stroke` (crayon-blue), `stroke-width: 7`, `stroke-opacity: 0.9`, `stroke-dasharray: 1`, `animation: ghost-draw-on 180ms`.
- **Tier-3** `:253-258` — `.sudoku-cell.is-invalid .cell-ghost-path` = **(0,3,0)**. Sets `fill: none`, `stroke` (teacher-red), `stroke-width: 6`, `stroke-opacity: 0.85`.
- Tier-2 beats tier-3 on **every shared property** — verify-33's live probe saw exactly this (blue ring on the focused conflicting cell), and the comment at `:251-252` ("placed after the focus rule so a focused-and-conflicting cell reads red") is wrong: source order never gets consulted at unequal specificity.

### The leak

H1 bullet 2 amends tier-3 to `stroke-width: 9; stroke-opacity: 1; fill: var(--color-teacher-red); fill-opacity: 0.10`. H1 bullet 3 as authored adds only:

```css
.sudoku-cell.is-invalid:has(input:focus-visible) .cell-ghost-path { stroke: var(--color-teacher-red); animation: none; }
```

That rule is (0,4,1) and wins the two properties it declares — **and no others**. On precisely the cell the keyboard user is sitting on to fix the conflict, tier-2 (0,3,1) still beats amended tier-3 (0,3,0) on the rest:

| Property | Unfocused invalid (amended tier-3) | Focused invalid (bullet 3 as authored) | Defect |
|---|---|---|---|
| `stroke` | teacher-red | teacher-red (bullet 3) | ok |
| `stroke-width` | **9** | **7** (tier-2 leak) | the focused conflict ring is *thinner* than every other conflict ring |
| `stroke-opacity` | **1** | **0.9** (tier-2 leak) | same direction |
| `fill` / `fill-opacity` | teacher-red / 0.10 | **crayon-blue / 0.08** (tier-2 leak) | the blue/red collision H1 exists to kill resurfaces as a **blue wash inside the red ring** |
| `animation` | none | none (bullet 3) | see below — wrong call anyway |

Note the fill leak is *created by the amendment itself*: today tier-3 sets `fill: none`, so the collision is stroke-only; bullet 2 makes the fill channel newly load-bearing and bullet 3 doesn't cover it. Bullet 2 and bullet 3 are mutually inconsistent as authored. (The bullet's one safe part: `stroke-dasharray: 1` leaking is harmless — the path carries `pathLength="1"` at `:195`, so dasharray 1 at dashoffset 0 renders a solid ring.)

### Two further design defects in bullet 3, resolved by authority

1. **`animation: none` deletes the focus affordance.** The component's own comment (`:260-263`) states the SVG ghost **is** the focus affordance (the generic focus-within ring is deliberately neutralized; the cell input is visually hidden). If focused-invalid renders identically to unfocused-invalid at rest AND the 180ms sketch-on is suppressed, keyboard focus is invisible on invalid cells — a WCAG 2.4.7 regression on the roving-tabindex grid. Resolution: **keep the animation** (don't declare it; tier-2's `ghost-draw-on` then sketches the ring on *in red*, an in-idiom focus cue) and add **one notch of at-rest emphasis** over the unfocused invalid ring. PRM stays correct for free: the existing `@media (prefers-reduced-motion)` block at `:269-274` sets `animation: none; stroke-dashoffset: 0` and still governs, since the new rule doesn't declare `animation`.
2. **The slate is sudoku-only; the defect is ×2 games.** `FutoshikiCell.vue` has the identical tier pair — `.futoshiki-cell:has(input:focus-visible) .cell-ghost-path` `:226` (0,3,1) vs `.futoshiki-cell.is-invalid .cell-ghost-path` `:246-248` (0,3,0) — and `FutoshikiBoard.vue:68` applies the same `solve-failure` class, so bullet 1's tint hits futoshiki too. L33/verify-33/W5 all authored H1 against sudoku sites only. Per the D16 twins convention (genuinely-owned copies), fix both copies.

### The tint values themselves — SOUND

Bullet 1's formula checks out end-to-end at HEAD: `.solve-failure .grid-line { stroke: var(--color-teacher-red) !important }` is live at `index.css:251-252`; `--grid-line-color` exists in both themes (`index.css:100` light `hsl(0 0% 15%)`, `:138` dark `hsl(48 10% 80%)`); the grid actually strokes with it (`HandDrawnGrid.vue:141,154,167` `stroke="var(--grid-line-color, currentColor)"` — a presentation attribute, which any CSS rule beats, so keeping `!important` is defensive-fine); `--color-teacher-red` resolves via `index.css:78`. A 30% red mix over the warm-light dark-mode line reads "graded" in both themes, and the full-red width-9 ring has real contrast against it. **No amendment to bullet 1 or bullet 2's values.**

### H1 final text (the corrected bullet 3)

```css
/* Tier 2×3 — focused AND conflicting: the teacher's red pencil, pressed harder.
   (0,4,1) beats tier-2's (0,3,1); every tier-2 paint property is re-asserted —
   partial overrides leak blue through the higher-specificity focus rule.
   ghost-draw-on is deliberately NOT suppressed: it re-sketches in red as the
   focus cue (the ghost is this cell's only focus affordance; PRM block governs). */
.sudoku-cell.is-invalid:has(input:focus-visible) .cell-ghost-path {
  fill: var(--color-teacher-red, var(--color-crayon-rose));
  fill-opacity: 0.16;
  stroke: var(--color-teacher-red, var(--color-crayon-rose));
  stroke-width: 10;
  stroke-opacity: 1;
}
```

(Values: 10/0.16/1 = one notch over the amended tier-3's 9/0.10/1, so focus stays distinguishable at rest. Same rule, `.futoshiki-cell`-prefixed, in `FutoshikiCell.vue`.) Rewrite the `:251-252` comment to state the real rule: tier collisions are resolved by specificity, tier-2×3 by the compound rule above. The `prefers-contrast: more` arm (`:281-283`) is already consistent (opacity 1).

---

## (b) H5(b): toast vs the `role=alert` contract — the "toast" clause is the incoherence; scrollIntoView is contract-clean

Fresh reads: `SolverErrorNote.vue:26` puts `role="alert"` on the card wrapper; `:30` puts an **interactive `try again` button inside the alert**; the note mounts via `v-if` inside `.board-margin` (`SudokuBoard.vue:353-361`), a `top:100%` absolute strip (`:380-390`, `z-index: 50`, `overflow: visible` wrapper). The futoshiki twin is byte-similar (`FutoshikiBoard/SolverErrorNote.vue:22`, `FutoshikiBoard.vue:423`).

- **The a11y contract is position-independent.** `role=alert` fires assertively on DOM insertion; the fold defect (E1) is purely visual. `scrollIntoView({block:'nearest'})` on show changes nothing about the live region — no re-mount, no duplicate announcement, no focus steal (scrollIntoView moves no focus, which is exactly right: alerts must not grab focus). The absolutely-positioned card contributes to the document's scrollable overflow (wrapper is `overflow: visible`), so the page can scroll to it. **Contract-clean.**
- **The toast reading breaks the contract two ways.** (1) A transient/auto-dismissing surface containing the `try again` button violates the timing contract (WCAG 2.2.1) and can orphan focus mid-press; an alert with interactive content that comes and goes on its own schedule is the `alertdialog` anti-pattern the current design correctly avoids — the card today is persistent, dismissed only by state change. (2) Re-anchoring to the controls column means either moving the live region (a second mount path to keep in sync ×2 games) or duplicating it (double announcement). Either way it buys nothing scrollIntoView doesn't already deliver, and it violates the spec's own closing sentence ("Keep the card's existing design (E3)"). The W5 compression "scrollIntoView/toast" actively invites the transient reading.
- **Resolution (design authority): strike "toast"; H5(b) = scrollIntoView-only.** On `showErrorNote` → true, `await nextTick()` then `scrollIntoView({ block: 'nearest', behavior: 'smooth' })` on the alert element; `behavior: 'auto'` under PRM (a programmatic smooth-scroll is motion). ×2 games. Markup, mount point, persistence, and dismissal semantics untouched.
- **One interlock made explicit — H9.** H9's two authored variants aren't equal once H5(b) keeps the card in the strip: the fixed `margin-top ≈ 2rem` variant is sized to the marginalia alone, so a ~100px error card overlays the mobile control panel (strip is `z-index: 50`, card re-enables pointer-events — it would sit on top of live controls). H9's **in-flow-on-mobile variant** composes correctly: the note pushes the panel down instead of covering it, and carries H5's mobile case for free. H9 takes the in-flow variant.

---

## (c) The R3/verify-33 delta — one owner line suffices, but the line is mis-enumerated

The readiness gate ratified with R3 "the L33 H-specs subset" = the ten as authored (`32-synthesis-readiness.md:77,113`; D27: "R3 ratified the ten"). The verify-33 operative slate's full delta against those ten, re-derived item by item:

| Delta item | Nature | Needs the owner line? |
|---|---|---|
| H2 placement half dropped (elevation-only) | subtraction from a ratified spec | **yes** |
| H6 reposition+burst dropped; enlarge-in-place 2.5→~3.25rem | subtraction + value change | **yes** |
| H7 dropped entirely | subtraction | **yes** |
| I2 promoted into H7's slot | **addition** never in the ratified ten | **yes** |
| H10 → DEFER | subtraction (it was one of the ten) | **yes — MISSING from Residual #7** |
| H8 → centering-only | selection among H8's own authored alternatives ("…; or …; or …") — verify-33 picked the third | **no** — within-spec execution discretion, not a delta |

Residual #7 as authored names "(H6 enlarge-in-place, H7→I2 swap, H2-elevation-only)" — three of the five confirmable items. **H10-defer would ride through unratified.** Still one line, one confirmation act — just enumerate all four clauses (H2-placement-drop, H6-shrink, H7-drop+I2-add, H10-defer) and drop nothing into ambiguity. H8 needs no mention (or a parenthetical noting it's within-spec).

The Q8 corrections above (H1 bullet-3 completion, H5(b) toast-strike, ×2-games scope, H9 variant pick) are **inside** already-ratified specs — they change how H1/H5/H9 are executed, not whether — so they extend the wave spec, not the owner line.

---

## THE FINAL SLATE (design authority, W5 order, execution-ready)

1. **H1** — grid tint (`index.css:251` → `color-mix(in srgb, var(--color-teacher-red) 30%, var(--grid-line-color)) !important`) + tier-3 ring bump (9 / opacity 1 / fill teacher-red 0.10) + the **full-declaration** tier-2×3 override above (all five paint properties, 10/0.16/1, animation deliberately NOT suppressed) + rewrite the wrong comment (`SudokuCell.vue:251-252`). **×2 games** (`FutoshikiCell.vue:226/:246`, `FutoshikiBoard.vue:68`).
2. **H3** — as authored (kill `vbWidth=220`; caret optical-center).
3. **H4** — as authored (ladder-bind `HandwrittenLogo.vue:223,225,268-269,319`).
4. **H5(b′)** — scrollIntoView-only (`{block:'nearest'}`, smooth; PRM auto) on the persistent `role=alert` card; **toast clause struck**; ×2 games.
5. **H9** — mobile marginalia clearance, **in-flow-on-mobile variant** (composes with H5's error state; the fixed-margin variant under-provisions when the note shows).
6. **H2-elevation-only** — as amended (popover bg + `cartoon-shadow-md` + dark hairline; placement half stays dead).
7. **H8-centering-only** — `align-items: center` at ≥md (within-spec selection).
8. **H6-shrunk** — enlarge in place, 2.5→~3.25rem; no reposition, no burst.
9. **I2** — suppress the wordmark-reveal replay on game swap (`HandwrittenLogo.vue:92-99` — `watch` on `props.game` calls `playReveal()`; re-measure, don't re-reveal).
10. **H7, H10** → deferred ledger, as authored.

W5's gates unchanged (SSIM soul-gate on H1/H4, e2e green) — plus one new assertion: a keyboard-focused conflicting cell computes `stroke-width: 10` and a red fill (the exact probe verify-33's `shoot-verify33c.mjs` already performs; flip its expectation).

## EXACT WAVE-SPEC AMENDMENT

**W5, hardening bullet — replace the H1, H5, H9 clauses:**

> H1 (tint + ring + the mandatory **full-declaration** `.is-invalid:has(input:focus-visible)` override — fill/fill-opacity/stroke/stroke-width/stroke-opacity all re-asserted in teacher-red at one notch over tier-3 (10/0.16/1), `ghost-draw-on` kept as the red focus sketch, never `animation: none` + fix the wrong comment `SudokuCell.vue:251-252`; **×2 games** — `FutoshikiCell.vue:226/:246` carries the identical tier collision) → … → H5(b) (error-note `scrollIntoView({block:'nearest'})` on show, PRM `behavior:'auto'` — **toast clause struck**: the card is a persistent `role=alert` with an interactive `try again` inside (`SolverErrorNote.vue:26,30`); transient or re-anchored variants break the alert contract; ×2 games) → H9 (mobile marginalia clearance, **in-flow-on-mobile variant** — the fixed ~2rem margin under-provisions whenever the error note is showing) → …

**§6 Residual #7 — replace with:**

> The verify-33 amendments (**H2-elevation-only, H6 enlarge-in-place, H7→I2 swap, H10-defer**) extend R3's ratified ten — one owner line confirms or reverts; the wave is authored to the amended slate. (H8-centering-only is a selection among H8's own authored alternatives — within R3, no confirmation needed.)

## Deviations (FAIL-EXPLICIT)

1. No fresh browser probe was run this pass — the cascade findings rest on specificity arithmetic (unambiguous: (0,3,1) > (0,3,0), (0,4,1) > both) + fresh source reads at HEAD, corroborated by verify-33's already-live keyboard probe of the same collision. The proposed CSS was not rendered; the 10/0.16/1 emphasis values are authored judgment inside H1's own value idiom, subject to W5's SSIM/soul gate like every other H1 value.
2. Futoshiki tier-rule property lists were verified by structure and key lines (`:226`, `:246-248`), not read declaration-by-declaration; the sudoku copy was. The twins convention (D16) covers the remainder.
3. R3's ratification wording was taken from `32-synthesis-readiness.md:77,113` — the ratification event itself is owner-side and out-of-corpus, as it was for the synthesis.
