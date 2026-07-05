# W8 — Animation gestalt

**One raster discipline, one rAF chain, one designed celebration.** Applies the grain hoist and unified scheduler onto the W7 topology, then builds the celebration per the feasibility spike with its 55%-critique amendments folded.

**Dependencies**: ← W7. **Effort**: M–L (3–5 days; the celebration 4th workstream is the long pole).

---

## Scope (file-level)

### Grain hoist (Pass-2 prototype 9, retargeted)

- `pass2/grain-static-overlay.diff` retargets to **`src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue`**—one level deeper than [`fe-composition.md`](../evidence/fe-composition.md) §3's own retarget; still a pure path substitution, zero content change (the manifest verified the file's logic was untouched by the move).
- Shape: 4 pre-baked filtered sibling `<g>` layers + opacity toggle gated on `animState`—keeps true displacement fidelity, byte-identical static DOM (Pass-2 D10e adopted this over the geometric bake; the bake stays W9's escape hatch for the failing SSIM corners).

### Unified scheduler (Pass-2 prototype 10, reconciled)

- `pass2/unified-boil-scheduler.diff` applied via `--directory=web` then **hand-reconciled** against `@pencil/*` specifiers—mechanical retargeting is insufficient ([`fe-composition.md`](../evidence/fe-composition.md) §4b). New files: `src/pencil/composables/boilScheduler.ts`, `src/pencil/dev/rafInstrumentation.ts`.
- **Migrate `BoilDivider.vue`**—the move-*created* 4th rAF chain outside every diff's file list (ibid. §4c; the load-bearing lesson: post-move reconciliation = patch file lists ∪ move-created files touching the same primitive).
- Finish the `useReducedMotion` migration (2 remaining consumers → `usePrefersReducedMotion()`), then retire the old composable—or carry it with an explicit note; never silently half-migrated.
- No leak fix needed: the Pass-2 147→428 rAF growth does **not** reproduce at keyframes 5.1.0 (flat 118–194, Δ−0.8 over 40 s)—a 1.1.0-era library defect (`pass3/raf-growth-root-cause.md`). The T11 tripwire stands: delete `boilScheduler.ts` at the `^0.6.0` swap (W12 greps for it).

### Bundle (Pass-3 #11, corrected framing)

- Land the `animation-vendor` manualChunks bucket—it fixes the tracked metric (main-chunk gzip **−68.3%**, ≈22 kB) but total first-load bytes are **flat to +0.42%**; the real benefit is ~74 kB gzip vendor-chunk reuse accruing from the *second* deploy onward. Say so in the commit message; never present it as a size cut.
- Logged follow-up (not this wave): defer `@mkbabb/keyframes.js/engine` behind a post-first-paint dynamic `import()`, or the upstream export split (W12 carries the ask)—value.js symbols confirmed in the emitted chunk for a single-key consumer.

### Celebration (Pass-3 #15 spike, amendments folded)

- Beats 1–3 + gold-star garnish + the union foil-gleam tail on the scheduler's `sequence` subscriber kind—spiked feasible on **exactly one chain, built and instrumented, not argued** (`pass3/celebration-feasibility.md`).
- **The 4th workstream** (required for the full one-chain claim): migrate grid draw-in (`usePathAnimation.ts`) and glyph draw-in (`glyphAnimations.ts`/`HandwrittenGlyph.vue`) off `KeyframesAnimation`—each instance runs an independent native rAF loop, up to boardSize² during a reveal—onto `sequence` subscribers. **Or** scope the shipped claim to "chains=1 during beats 2/3 + garnish" explicitly. Pick one; never ship the unscoped claim.
- **Fix the still-live dasharray-reset defect** in `HandwrittenGlyph.vue`'s real solved-cell path before beat-3's clean freeze is true in production (faithfully ported in Pass 2, now due).
- Periodically-ticking reactive values co-located with animated glyphs use **stable per-cell ref closures**—inline arrow refs silently revert a completed dasharray reset (reproduced).
- Wire `glyphRegistry.toDisplayChar()` into `SudokuCell.vue`—values 10–16 render blank today and register no wiggle subscriber; the 10–16 glyph *variants* themselves ride W9's glyph work.

## Acceptance gates

| Gate | Proven value | Evidence |
|---|---|---|
| Chains | smoke: **chains=1 / subscribers=10** (floor returns to exactly 10 across settle-and-clear cycles) | [`fe-composition.md`](../evidence/fe-composition.md) §5; `pass3/raf-growth-root-cause.md` |
| Stress | 77 s (73 solve/clear, 19 size switches, 17 theme flips) never deviates from chains=1 (harness reusable) | `pass3/raf-growth-root-cause.md` |
| Raster | grain: RasterTask −72.9% at 16×16 (4,170.74 → 1,131.36 ms/6 s; per-tick 104.3 → 28.3 ms) reproduced in a recorded trace | `pass2/grain-static-overlay.md` |
| Bundle | main gzip ≈22 kB post-bucket + the total-first-load honesty note in the record | `pass3/bundle-regression-mitigation.md` |
| Celebration | ≤3.2 s crest; chains=1 **measured during beats 2/3** (the worst case), not asserted | `pass3/celebration-feasibility.md`; `pass2/design-refinement.md` §1.3 |
| PRM | mid-session flip → 0 chains; background tab → 0 ticks | `pass2/unified-boil-scheduler.md` |

## Seed artifacts

- `pass3/grain-static-overlay.retargeted.diff` — re-retarget one level deeper (path only).
- `pass2/unified-boil-scheduler.diff` — re-apply + hand-reconcile specifiers (the known-insufficient-mechanical case).
- `pass3/composed-frontend.diff.gz` hunks — cross-check the reconciled result against the gate-verified composition (old paths).
- Celebration: re-derive from the spike (`pass3/celebration-feasibility.md` has the built pattern + instrumentation).

## Residual risks

- The 4th workstream is the only unbuilt piece of the one-chain claim—if it slips, the scoped claim ships and the workstream books forward (explicitly, in the wave record).
- The foil-gleam is a union piece hosted here (deferred-to-celebration per the adopt-partial); if OD-1 lands "no gleam," delete the tail beat—severable by design.
