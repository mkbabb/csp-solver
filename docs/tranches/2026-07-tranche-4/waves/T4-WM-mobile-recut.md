# T4-WM — The mobile recut (mid-tranche, owner audit E8)

**The abrogation is a revert, not a rebuild: every cell already renders a real native `<input>` — the custom pad was a tray layered over it with the OS keyboard suppressed. The pad dies, the native keyboard returns bounded and iOS-congruent, the affordances the ruling names get true touch surfaces, and the last mobile perf windows close without touching a pixel of the soul.** Owner edict (E8, 2026-07-13, verbatim in the corpus): *"our mobile interface is whack. We must abrogate the custom keypad and instead allow for proper bounded input with the standard mobile text entry (congruent and styled appropriately with focus &c for mobile/ios). The other affordances, such as hints, etc, should have proper mobile variants in a KISS-forward manner. If we can leverage a modern web api for tap/touch to hold/vibrations if possible (ios only is fine, too), we should plan to do so. Further, safari and mobile performance is still awful and must be ameliorated without compromise."*

**REVERSAL registered**: the T3 ratification "W11 digit pad = BUILD" is overturned by E8 — the pad and its whole thread (padActive, suppress-virtual-keyboard, inputmode=none) exit. **Perf context (research-proven)**: W1's bake HOLDS at mobile — idle/murmur/celebration/scroll all 93–98 fps at DPR3; the owner's test ran against the pre-W1 production build, and the residual mobile pain is the bake's own two live-filter windows plus DPR3 bitmap residency, all closed here.

**Dependencies**: ← W4 (the pad excision surface is post-barrel, post-seam), ← W5 (toolchain settles before the input surface freezes). Slots before W7 (its hint UX consumes this wave's touch surfaces), W8 (input-shape seam below), W9/W10/W12 (they restyle these surfaces). **Effort**: M–L. **Research**: `../evidence/wm/` (r1-mobile-perf, r2-mobile-census, r3-api-truth, crit-mobile — all crit-hardened).

---

## Scope

### 1. The pad abrogation — native bounded entry (E8 core; r2 §1–4, r3 §1)

- **Excise whole** (line-anchored inventory in r2, crit-verified complete, twin-symmetric): `DigitPad.vue` (248 L) + `e2e/digit-pad.spec.ts`; the twin wiring blocks in `SudokuGame.vue`/`FutoshikiGame.vue` (import, wiring, template, `:pad-active`); `SudokuBoard.vue`/`FutoshikiBoard.vue` (padActive prop, cellFocusChange emit, enterValue + focusin/out wiring); `SudokuCell.vue`/`FutoshikiCell.vue` (suppressVirtualKeyboard prop, `:inputmode` conditional). `useCoarsePointer`/`useStackedLayout` SURVIVE (co-consumed by drawer + ControlPanels) — only the `padActive` computed and its threading go. **RE-HOME, don't delete**: digit-pad.spec.ts test 3's coarse-affordance asserts (peek washi 44px floor, icon sublabels, Clear confirm) move to a mobile-affordances spec.
- **The native input, trued** (the shape is r3's KISS-correct row, second-source-verified): `type="text" inputmode="numeric" pattern="[0-9]*"` + `maxlength` **sized** (1; 2 for N=16 two-digit entry — the existing `handleInput` clamp already owns semantics) + `autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="done"`. The 16 px computed font on the opacity-0 input is the structural zoom de-risk (probed at all three board scales) — assert it, never touch `maximum-scale`.
- **Keyboard geometry** (the gap the pad papered over — r2 §5/§12): the OS pad will cover the below-fold board. Wire `visualViewport` (resize/scroll) so the focused cell scrolls into view (`block:'center'`, PRM-aware behavior) and stays above the keyboard; the VirtualKeyboard API is a Chromium-only refusal — `visualViewport` is the one cross-engine path.
- **iOS congruence, the discipline set** (r2 §9–11, r3 §6): `-webkit-tap-highlight-color: transparent` on interactives; `-webkit-touch-callout: none` + `user-select: none` (+`-webkit-`) on cells (user-select is the load-bearing half); `-webkit-text-size-adjust: 100%`; `overscroll-behavior: contain` on the board scene; `viewport-fit=cover` + `env(safe-area-inset-*)` padding on the fixed top-right chrome (the toggle sits at −4 px under the notch today); focus styling on `:focus-visible` (tap = no ring, hardware keyboard = ring) in the focus-ring idiom — the CELL's visual selected state remains the touch focus voice.

### 2. Touch affordances, KISS (E8: "hints, etc." — r2 §6–8)

- **Hint / undo / redo get real touch surfaces**: today hint is `H`-key-only, undo/redo are Cmd/Ctrl+Z-only, and the legend documenting them is `display:none` on coarse — zero discovery. Add three icon-buttons in the existing ControlPanel icon-btn grammar (44 px floor, sublabels per the coarse idiom), both games. Desktop keeps its keys + legend; the buttons render on coarse (and harmlessly on fine — the grammar already handles it). W7 later re-voices hint content; this wave gives it the surface.
- **The attribution tap bug** (reproduced): `useHoverCard`'s focusin-open + click-toggle double-fire nets closed on a touch tap — on coarse, drive open from a clean tap (drop the focusin-open half on coarse).
- **Sticky `:hover` leak**: hover paints (icon-btn, section-heading, OptionSelector) stick after touch — gate all hover styling behind `@media (hover: hover)`.
- **Drawer stays desktop-only** (its composable declares it); the mobile inline card remains the control surface. A touch bottom-sheet stays a non-goal (KISS).

### 3. Touch-hold + haptics — the honest plan (E8; r3 §3–4, crit-verified refusals)

- **Long-press on a cell = peek** (that cell's candidate glimpse), mirroring the shipped hold-to-peek grammar: Pointer Events only — `pointerdown` + ~450 ms timer, cancelled on `pointerup`/`pointercancel`/move-past-threshold. `contextmenu` never fires on iOS (13+) — the pointer path is the one cross-engine shape. The §1 callout/user-select suppression is its prerequisite.
- **Haptics, the honest row**: `navigator.vibrate` was never in WebKit and still isn't (2026) — ship `navigator.vibrate?.(10)` feature-detected on long-press trigger (Android buzzes; iOS silently no-ops). The iOS switch-tick hack is **REJECTED**: Apple blocked script-triggered ticks at iOS 26.5 (second time the hole closed) — a brittle, switch-semantic overlay is not KISS and not congruent. Recorded as an iOS refusal with the re-trigger named (a real WebKit haptics API shipping).
- **W8 seam, decided now so the input shape freezes**: pencil-marks mobile entry (W8) rides a MODE TOGGLE in the control surface (normal/corner/center), NOT multi-char input — the native input keeps `maxlength` sized; mark entry reuses the same tap flow under the active mode. Long-press stays peek (read-only); W8 may revisit only through its own gate.

### 4. Mobile perf — the bake windows close (E8 "without compromise"; r1 ranks 1–4, crit-confirmed mechanisms)

- **Cap the GRID bake at DPR 2** (rank 1/2/4 lever): pass `dpr: Math.min(devicePixelRatio, 2)` for the grid stack — **measured visually lossless** (SSIM 0.984 vs the DPR3 bake on a DPR3 screen, above the ratified 0.98 identity floor; crops banked). Logo and toggle stay DPR-native (logo is Fraunces text, sharpness-sensitive, only 2.48 MB — capping it is NOT licensed without its own SSIM pass).
- **Kill the double residency** (rank 2, ~46.8 MB → ~half): the app's `rasterPose.ts` path retains `ImageBitmap[]` AND data-URL PNG decodes. Move to async `OffscreenCanvas.convertToBlob` + `createObjectURL` (one raster, no 12 synchronous `toDataURL` main-thread encodes — rank 4 dies in the same move), `close()` bitmaps once URLs exist, revoke object URLs on re-bake/unmount. pencil-boil **0.9.2**: `useBoilCache` gains an eviction hook (`onEvict`/dispose) so evicted `ImageBitmap`s are `.close()`d — LRU accretion ends; released via the honest tag-push flow.
- **The fallback windows go frozen, then atomic** (ranks 1/3): during COLD bake, hold the live-filter fallback at pose 0 — no beat-driven opacity flips, so WebKit rasters the static filter ONCE (the sanctioned transient) instead of re-executing per beat at 6 fps. On THEME flip, don't drop to fallback at all: keep the old theme's bitmaps rendering until the new bake resolves, then swap atomically (the Bloom already masks the moment); board-size change (structural) takes the frozen-pose path.
- **Measured nulls stand** (do not re-open): glass/backdrop-filter is a null at this HEAD; idle/murmur/celebration/scroll are cured at DPR3. **Real-device probes ledgered for the gate**: iOS jetsam headroom at the new residency, Low Power Mode 30 Hz, ProMotion — owner-side smoke on the deployed build, banked as the E8 verification row.

### 5. Landscape + iPad (crit gaps #3/#4, censused here)

- Landscape phone (~844×390) and iPad portrait (<1024, coarse) get probe rows: no horizontal overflow, entry + keyboard avoidance work, the affordance row reachable. Large iPad (≥1024, coarse + desktop layout): the drawer tab must be a clean tap target. Defects found are fixed in-grammar here; anything structural (a landscape re-layout) is banked with a named re-trigger, not improvised.

## Gates

| Gate | Value |
|---|---|
| Headline | the pad is GONE whole (grep `DigitPad\|padActive\|suppressVirtualKeyboard\|inputmode="none"` → 0) and the native numeric keyboard drives entry bounded at every board size; hint/undo/redo tappable both games at the 44 px floor; long-press peek + feature-detected vibrate; the cold-load fallback window renders a static pose (no per-beat re-raster) and theme re-bake swaps atomically; grid bitmap residency at DPR3 halves (cap + close + single-raster); full e2e + goldens green; production deployed at seal |

Component checks (born RED at HEAD unless marked; today-values from the banked research):

| Gate | Value (current failing probe → target) |
|---|---|
| pad-gone | the excision inventory (r2 §1) grep-zero; `useCoarsePointer`/`useStackedLayout` still consumed; the re-homed coarse asserts green in their new spec |
| native-entry | iPhone-geometry e2e (390×844 DPR3, webkit + chromium): tap cell → `inputmode="numeric"` + sized `maxlength` + the attribute set present (today: `inputmode="none"` on coarse); two-digit entry works at N=16; computed input font ≥16 px asserted at 9×9/16×16/futoshiki (the zoom de-risk) |
| keyboard-avoid | with a simulated keyboard inset (visualViewport emulation), the focused cell scrolls into view and is never eclipsed (today: zero `visualViewport` references) |
| ios-discipline | tap-highlight transparent on interactives; cells carry touch-callout none + user-select none (today: webkit computes `user-select:text` on cells); `viewport-fit=cover` + env() padding on the fixed toggle (today: 0px, toggle at −4 px); text-size-adjust + overscroll-behavior set; focus ring on `:focus-visible` only |
| touch-affordances | hint/undo/redo buttons present + wired on coarse, both games, ≥44 px, sublabeled (today: zero touch surface — `H`/Cmd+Z only); attribution opens on a single tap (today: nets closed); hover paints gated `@media (hover:hover)` (today: sticky) |
| long-press | pointer-events long-press (~450 ms, move-cancel) opens the cell peek in both games; `navigator.vibrate?.()` fires on trigger where the API exists (feature-detect proven in the unit layer); no OS callout/loupe intrusion (device-verified at the owner smoke) |
| perf-cold | the during-bake fallback issues NO per-beat filter re-rasters (trace: 0 pose flips until `ready`; today: 5.7 beats of full re-raster, 6.1 fps for ~849 ms at DPR3) |
| perf-rebake | theme flip: old bitmaps render until the new bake lands (trace: no fallback window, max frame gap ≪ 456 ms today); board-size change takes the frozen path |
| perf-residency | grid bake capped DPR2 (SSIM ≥0.98 held — re-proven per the r1 recipe); bitmaps closed after URL conversion; object URLs revoked; pencil-boil 0.9.2 eviction hook closes evicted bitmaps; decoded-pixel arithmetic ≤ ~half of today's 46.8 MB at 390 DPR3 |
| perf-encode | zero synchronous `toDataURL` in the bake path (today: 12, worst task 251 ms @4×) — async `convertToBlob` throughout |
| landscape-ipad | the §5 probe rows green or banked-with-re-trigger; large-iPad drawer tab tappable |
| parity | full e2e + unit + goldens green (goldens unchanged — no visual claim in this wave except the already-ratified DPR cap); desktop keyboard flow byte-identical in behavior (keys, legend, drawer) |
| deploy | production redeployed at seal (`npm run deploy`); the owner's device verification row is the E8 close — banked as owner-side with the real-device probe list (jetsam/LPM/ProMotion) |

## π / DELTA

- **π**: the grid DPR2-cap rides the ratified ≥0.98 identity floor — re-run the r1 SSIM recipe at the merged HEAD, bank the value + crops (small, per EVIDENCE-POLICY). The existing four goldens must pass WITHOUT re-baseline (the cap affects only >DPR2 screens; goldens capture at DPR2).
- **DELTA**: before/after traces for the three perf windows (cold-load pose-flip count + fps, theme-flip max frame gap, residency arithmetic), banked text-first. For the UX surfaces: before/after crops of the coarse ControlPanel (no touch hint/undo/redo → the affordance row), the attribution tap, and the entry flow (pad tray → native keyboard) at 390×844 — the owner-taste sheaf (B5 grammar) rides these captures.

## Seeds

- `evidence/wm/r1-mobile-perf.md` — the ranked mechanism table (fallback window, residency, re-bake stall, sync encodes), the cap-at-2 SSIM proof, the measured nulls, the real-device probe list.
- `evidence/wm/r2-mobile-census.md` — the line-anchored excision inventory, the native-input truth, the 16 px de-risk, the affordance gaps, the iOS-discipline gaps, the positive baselines to preserve.
- `evidence/wm/r3-api-truth.md` — the bounded-input shape, the haptics refusal (iOS 26.5), the pointer-events long-press shape, the visualViewport path, the supporting CSS rows (all cited).
- `evidence/wm/crit-mobile.md` — the verdict table, the corrected residency mechanism (app-side `rasterPose.ts`, not the library), the six named gaps this spec closes or seams.

## Residual risks

- **The OS keyboard is a bigger eclipse than the pad was** — the visualViewport work is load-bearing, not garnish; if scroll-into-view fights the boil scene's layout, the fallback is a compact fixed entry-context strip (still native input, still no custom pad) — a named escape, not a silent one.
- **The DPR cap is grid-only by license** — capping logo/toggle without their own SSIM pass would be the exact "compromise" the edict forbids. The residency win is already dominated by the grid.
- **Real-device truth is the E8 close** — emulation cannot see jetsam, Low Power Mode, ProMotion, or the OS loupe; the deploy-at-seal + owner smoke with the banked probe list is the honest verification row, exactly as W1's real-Safari row was owner-verified.
- **The W8 seam is decided here** (mode-toggle, input shape frozen) — if W8's design round finds the mode-toggle wanting, it reopens through W8's gate with this row cited, not by quietly re-shaping the input.
- **iOS 26.x is a moving target on touch-callout reliability** — `user-select:none` is the load-bearing suppression; the owner smoke verifies the loupe stays away on the real build.
