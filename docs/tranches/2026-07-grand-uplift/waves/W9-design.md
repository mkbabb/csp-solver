# W9 — Design: pure pencil + union adopt-partial

**The page in a child's puzzle book, completed—and the one union feature that earned its place.** Implements [`design-refinement.md`](../evidence/design-refinement.md) (the incumbent, self-sufficient spec) plus the adopt-partial union pieces per [`union-verdict.md`](../evidence/union-verdict.md) §8. The soul is non-negotiable: wobbly graphite grid, crayon palette, hand-glyphs, orange sun.

**Dependencies**: ← W8 (scheduler, celebration substrate, grain). OD-1 settles the last aesthetic question. **Effort**: L (4–7 days).

---

## Scope (file-level)

### Pure pencil (design-refinement, the parameter authority)

- **Motion language** (§1): cadence bands A–D + the four house easings formalized as a `MOTION` section in `pencilConfig.ts`; dead band 175–550 ms; small-area filter rule. Delete the two dead `DRAW_IN_PRESETS` (`solveCell`, `logo`—zero consumers).
- **Error/loading fictions** (§5, D3): teacher-red-pencil failure vs paper-note error split rendering the W4 typed `ApiError`; thinking-scribble loader with timing tiers; marginalia live region. Kills the silent-error architecture (Pass-1 F5: `errorMessage` consumed by nothing, network failure masquerading as a wrong answer).
- **Tokens** (§3, D4): difficulty≙crayon ramp merge, `--color-teacher-red`, celestial hexes → config, measured dark-mode saturation rule.
- **A11y** (§4, D2): ARIA grid + roving tabindex on the board, three-tier pencil-sketch focus ghost ring (contrast-verified), per-cell `aria-label` derivation, marginalia announcements.
- **Grain acceptance disposition** (Pass-3 #9): the hoist passes the literal spec (2× DPR, settled: SSIM **0.983–0.985**—a thin pass) but 6/36 matrix conditions fall below the 0.98 floor, all DPR1 + live-animating mid-phase; DOM growth costs ~750 ms added settle on board-size change at 4–6× CPU throttle. **Choose explicitly**: extend the acceptance envelope to DPR1/mid-phase with these numbers in the record, or build design-refinement §2.2's geometric bake for the failing corners. Never present mean-channel (0.12–1.06%) as SSIM. Future re-derivations run the full 36-condition matrix (harness reusable) with a same-build noise-floor control.

### Union adopt-partial (the named pieces—everything else is cut)

| Piece | Disposition | Landing |
|---|---|---|
| Washi tooltip | **ADOPT** | `src/pencil/sheet/SheetWashiLabel.vue` + the `--sheet-washi-*` tokens it needs; swaps the black pill on desktop tooltips; `:focus-visible` fix rides |
| Hold-to-peek function | **ADOPT, no-`backdrop-filter` build** (OD-1 may add a static dark rim) | `src/pencil/sheet/AnswerKeyLaminate.vue` (board-shape-agnostic `cellRects`); `src/pencil/composables/boilHoldGate.ts` (renamed from the union's colliding `boilScheduler.ts`); gesture wiring in `games/sudoku/ControlPanel.vue` (domain-side, unconditional—no `isUnion`); `useSudoku.ts` gains `peekSolution()` cached per `boardGeneration`; `App.vue` peek state + `K`/`Esc` keys unconditional |
| **PRT defect fix — BLOCKING** | under `prefers-reduced-transparency` the sheet goes opaque yet given cells render as holes ([`../artifacts/union-screenshots/prt-light-held-board.png`](../artifacts/union-screenshots/prt-light-held-board.png)) | render the **full solution** when the laminate is opaque; hold-to-peek does not ship before this |
| AttributionCard a11y | **KEEP as pure-pencil** | real `<button type="button">` + `aria-expanded`; `isUnion` import, `.union` class, and the ~34-line vellum/PRT CSS block deleted—only the markup fix survives ([`fe-colocation-manifest.md`](../evidence/fe-colocation-manifest.md) §2) |
| Vellum ControlPanel + lifted attribution styling | **CUT affirmatively** | perceptually invisible in both themes (verified pixel pairs—the panel screenshots in `artifacts/union-screenshots/`); retires ~130 LOC of tokens/utilities + the UP3 border-layout footgun |
| Sticker gleam | **DEFER → W8's celebration tail hosts it** | severable if OD-1 says no |
| `skin.ts` (`?skin=` flag) | **EXCISED** (W7—never authored) | the A/B scaffolding produced its verdict; one UI |

Divider hold wiring targets `BoilDivider.vue` (the union diff's `ControlPanel.vue` call site is stale post-extraction—[`fe-composition.md`](../evidence/fe-composition.md) §7b). All sheet pieces live under `pencil/**`; **exercise the ESLint boundary against them**—containment was asserted on master topology, never exercised (union-verdict UV5).

## Acceptance gates

| Gate | Value | Evidence |
|---|---|---|
| Soul | SSIM ≥0.98 at settled/DPR≥2, all sizes + themes (0.983–0.985 measured floor acknowledged); flip-test discipline on any re-derivation | `pass3/grain-aesthetic-parity.md`; [`design-union.md`](../evidence/design-union.md) §7.4 |
| Union soul safety | board SSIM 1.00000, DOM SHA-256 identical pure-vs-union idle (the veto axis, already PASS) | [`union-verdict.md`](../evidence/union-verdict.md) §2 |
| PRT | re-capture shows a **complete** answer key when opaque | the defect capture above |
| A11y sweep | PRM arm, `prefers-contrast: more` arm, keyboard peek (`K`/`Esc`) + marginalia announcement; laminate key digits ≥3:1 large-text | [`design-union.md`](../evidence/design-union.md) §7.4.5 |
| Bundle | union partial ≈330 LOC (vs 678 full); CSS ≤+4 KB gzip, JS ≤+2.5 KB gzip; `grep backdrop-filter dist/assets/*.css` → **zero hits** in the no-glass build | ibid. §7.4.4; [`union-verdict.md`](../evidence/union-verdict.md) §3 |
| Celebration | shared with W8: ≤3.2 s, chains=1 during beats 2/3 | `pass3/celebration-feasibility.md` |
| Fiction audit | every shipped translucent element names its physical object in a one-line comment; `--sheet-*` consumers grep against the §1.1 table | [`design-union.md`](../evidence/design-union.md) §7.4.6 |

## Seed artifacts

- [`../artifacts/composed-frontend-with-union.diff.gz`](../artifacts/composed-frontend-with-union.diff.gz) — the union content source (old paths; `skin.ts` + vellum hunks are **cut, not ported**; apply the adopt-partial subset per the table above).
- [`design-refinement.md`](../evidence/design-refinement.md) — every motion/token/a11y parameter, grounded to file:line of the baseline.
- [`design-union.md`](../evidence/design-union.md) §7.3 — the exact `--sheet-*` token values for the surviving pieces.
- Grain SSIM harness: `pass3/grain-aesthetic-parity-evidence/` (reusable matrix runner).

## Residual risks

- OD-1 is open until the owner looks at the ten captures—the no-glass default is safe either way (light is pixel-identical; dark loses a faint rim recoverable as `box-shadow`).
- The a11y spec (board grid semantics, caret labels later in W10) has never met a real screen reader—W10's G4 is the first live pass; treat this wave's a11y as spec-faithful, not user-verified.
- Design-system work rides on W8's celebration landing shape—if the 4th workstream was scoped down, beat-3's freeze gate here inherits that scoping.
