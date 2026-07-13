# T4-W10 · Lane C1 — the easing census (merged-HEAD truth)

**HEAD 766aa068** (`T4-WU`). Read-only lane: no `src/` edit. This file is the merged-HEAD ledger the implementation cites; the spec's line anchors (verified at `65425697`) were re-located here.

---

## 0. Headline re-measure (spec said "9 distinct / 40 occurrences")

```
$ grep -rho 'cubic-bezier([^)]*)' src | wc -l        →  42   (total occurrences)
$ grep -rho 'cubic-bezier([^)]*)' src | sort -u | wc  →  10   (distinct literals)
```

- **10 distinct** literals, **42** occurrences. Of these, **1** literal (`0.32, 0.72, 0, 1`) lives ONLY in TS (`pencilConfig.ts:141` `drawerGlide`), never in a `<style>`. So the CSS `<style>`-layer set is **9 distinct curves across 41 occurrences** — the spec's "9 distinct" holds; its "40" is now **41** (the +1 is `DifficultyTally.vue:312`, a **W9** add — `git log` → `8875d261 T4-W9`, post-`65425697`). Re-measured, not trusted.
- `FilterTuner.vue` (2 occurrences: `:617` springPop, `:620` standard) is **dev-gated** — `App.vue:40` `import.meta.env.DEV ? defineAsyncComponent(...)`, dead-code-eliminated from the production bundle. Its literals count in the src grep but **do not ship**; tokenizing them is cosmetic (kept in the ledger for completeness, flagged `[dev]`).

---

## 1. The full ledger — site → literal → property → role → proposed `--ease-*`

Every `cubic-bezier` occurrence in `web/frontend/src`, grouped by distinct curve (n = occurrence count).

### C1 · `cubic-bezier(0.22, 1, 0.36, 1)` — easeOutQuint · **n=10** → `--ease-noteWrite`
The house's dominant write-in/reveal curve (fast attack, long gentle settle).
| file:line | property (keyframe/transition) | role |
|---|---|---|
| `pencil/chrome/MarginNote.vue:128` | `animation: note-write-in` | margin-note write-in |
| `pencil/chrome/MarginNote.vue:161` | `animation: note-write-in` | margin-note write-in |
| `pencil/chrome/CompletionVignette.vue:108` | `animation: vignette-write-in` | completion vignette write-in |
| `games/sudoku/SudokuBoard/SolverErrorNote.vue:60` | `animation: note-slide-in` | solver-error note reveal |
| `games/futoshiki/FutoshikiBoard/SolverErrorNote.vue:56` | `animation: note-slide-in` | solver-error note reveal |
| `pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue:415` | `transition: clip-path 1.2s` | wordmark clip-path reveal |
| `pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue:476` | `transition: transform 200ms` | wordmark hover lift |
| `pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue:503` | `animation: logo-menu-in` | game-picker menu in |
| `pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue:568` | `animation: logo-menu-out` | game-picker menu out |
| `games/shared/DifficultyTally.vue:312` | `transition: max-width 240ms` | progress tally grow (W9) |

Name note: role spans write-in / reveal / grow — coherent "reveal" family. `--ease-noteWrite` per the spec's example; `--ease-reveal` is the broader-honest alt if impl prefers.

### C2 · `cubic-bezier(0.4, 0, 0.2, 1)` — Material standard · **n=9** → `--ease-standard`
Symmetric standard UI ease for opacity/transform show-hide.
| file:line | property | role |
|---|---|---|
| `pencil/chrome/AttributionCard/AttributionCard.vue:147` | `transition: opacity 150ms` | attribution card fade |
| `pencil/chrome/AttributionCard/AttributionCard.vue:148` | `transition: transform 150ms` | attribution card slide |
| `pencil/chrome/AttributionCard/AttributionCard.vue:169` | `transition: opacity 150ms` | attribution card fade |
| `pencil/chrome/AttributionCard/AttributionCard.vue:170` | `transition: transform 150ms` | attribution card slide |
| `pencil/chrome/icons/FillForcedIcon.vue:69` | `animation: markDraw` | icon mark draw |
| `pencil/chrome/icons/SolveIcon.vue:52` | `animation: drawIn` | icon stroke draw-in |
| `pencil/celestial/DarkModeToggle.vue:728` | `transition: opacity 100ms …240ms` | crest cross-fade |
| `pencil/celestial/DarkModeToggle.vue:734` | `transition: opacity 300ms …60ms` | crest cross-fade |
| `pencil/dev/FilterTuner.vue:620` `[dev]` | `transition: all 200ms` | dev tuner control |

### C3 · `cubic-bezier(0.34, 1.56, 0.64, 1)` — backOut **OVERSHOOT** (cp₂=1.56 > 1) · **n=8** → `--ease-springPop`
Playful overshoot pop. Legitimate on icons/toggle; **the laminate's two uses are the audit-4 defect** (see §2 — they move to `--ease-glassGlide`, not this token).
| file:line | property | role |
|---|---|---|
| `pencil/chrome/icons/DiceIcon.vue:110` | `animation: diceRoll` | dice roll pop |
| `pencil/chrome/icons/DiceIcon.vue:131` | `animation: pipPop` | dice pip pop |
| `pencil/chrome/icons/SolveIcon.vue:67` | `animation: sparkleGrow` | solve sparkle pop |
| `pencil/celestial/DarkModeToggle.vue:764` | `transition: transform 800ms …60ms` | crest body spring |
| `pencil/celestial/DarkModeToggle.vue:786` | `animation-timing-function` | crest keyframe spring |
| `pencil/dev/FilterTuner.vue:617` `[dev]` | `transition: all 250ms` | dev tuner control |
| `pencil/sheet/AnswerKeyLaminate.vue:235` | `transition: opacity 280ms` | **laminate lay-down (RED)** |
| `pencil/sheet/AnswerKeyLaminate.vue:236` | `transition: transform 280ms` | **laminate lay-down (RED)** |

### C4 · `cubic-bezier(0.55, 0.055, 0.675, 0.19)` — easeInCubic · **n=4** → `--ease-accelIn` *(see naming conflict)*
Accelerate-away / ease-in exit.
| file:line | property | role |
|---|---|---|
| `pencil/chrome/ScribbleLoader.vue:93` | `animation-timing-function` | loader stroke out-phase |
| `pencil/sheet/AnswerKeyLaminate.vue:226` | `transition: opacity 200ms` | laminate lift-away (leave) |
| `pencil/sheet/AnswerKeyLaminate.vue:227` | `transition: transform 200ms` | laminate lift-away (leave) |
| `pencil/celestial/DarkModeToggle.vue:749` | `transition: transform 340ms` | crest track ease-in |

**⚠ Naming conflict for impl:** the spec's laminate gate text names this `--ease-laminateLeave`, but the literal is **shared across 3 components**. Minting a laminate-scoped name while leaving the loader/toggle as raw literals is inconsistent. **C1 recommends ONE role token `--ease-accelIn`** covering all four sites (role = ease-in accelerate/exit); if impl keeps the spec's `--ease-laminateLeave`, it should still point all three components at the one token (a laminate-scoped name for a shared curve is a mis-name the ledger flags).

### C5 · `cubic-bezier(0.32, 0, 0.67, 0)` — easeIn (flat-tail) · **n=3** → `--ease-fadeOut`
Solver-overlay opacity leave (the board dims out).
| file:line | property | role |
|---|---|---|
| `games/shared/scene.css:150` | `transition: opacity 200ms` | scene solver-dim fade-out |
| `games/sudoku/SudokuBoard/SudokuBoard.vue:843` | `transition: opacity 200ms` | board solver-dim fade-out |
| `games/futoshiki/FutoshikiBoard/FutoshikiBoard.vue:776` | `transition: opacity 200ms` | board solver-dim fade-out |

### C6 · `cubic-bezier(0.215, 0.61, 0.355, 1)` — easeOutCubic · **n=2** → `--ease-ghostDraw`
The pencil-ghost glyph draw-on (hint/prefill glyph).
| file:line | property | role |
|---|---|---|
| `games/sudoku/SudokuBoard/SudokuCell/SudokuCell.vue:659` | `animation: ghost-draw-on 180ms` | ghost glyph draw |
| `games/futoshiki/FutoshikiBoard/FutoshikiCell/FutoshikiCell.vue:639` | `animation: ghost-draw-on 180ms` | ghost glyph draw |

### C7 · `cubic-bezier(0.33, 1, 0.68, 1)` — easeOutCubic (variant) · **n=2** → `--ease-drawOn`
Pencil stroke draw-on / controls entrance (draw-and-settle).
| file:line | property | role |
|---|---|---|
| `assets/index.css:589` | `animation: pencil-draw-on var(--draw-dur,160ms)` | pencil stroke draw-on |
| `games/shared/scene.css:144` | `animation: controls-fade-in 250ms …150ms` | controls panel entrance |

### C8 · `cubic-bezier(0.645, 0.045, 0.355, 1)` — easeInOutCubic · **n=1** → `--ease-loaderScrub` *(SINGLE-USE — STAY-LITERAL defensible)*
| file:line | property | role |
|---|---|---|
| `pencil/chrome/ScribbleLoader.vue:85` | `animation-timing-function` | loader continuous scrub |

**Flag:** single occurrence, component-private, generic symmetric ease. Role is clear (not ambiguous), so a token `--ease-loaderScrub` is honest — but the token's value is organizational only (no dedup). **STAY-LITERAL is equally defensible.** Impl's call; C1 leans token for ledger completeness.

### C9 · `cubic-bezier(0.68, -0.55, 0.265, 1.55)` — backInOut, anticipate + overshoot (cp₁=−0.55<0, cp₂=1.55>1) · **n=2** → `--ease-anticipatePop`
Anticipation dip then overshoot — distinct from C3's overshoot-only springPop.
| file:line | property | role |
|---|---|---|
| `assets/index.css:542` | `animation: cell-reveal 0.3s` | cell reveal pop |
| `pencil/celestial/DarkModeToggle.vue:837` | `transition: scale 150ms …560ms` | crest scale anticipation |

### C10 · `cubic-bezier(0.32, 0.72, 0, 1)` — the glass curve · **n=1 (TS-ONLY)** → stays `MOTION.curves.drawerGlide`; minted as CSS var `--ease-glassGlide` for the laminate
| file:line | property | role |
|---|---|---|
| `pencil/config/pencilConfig.ts:141` | `drawerGlide: "…"` (TS, `v-bind`-consumed) | drawer glass glide (audit-4 monotone iOS-sheet class) |

**The two-layer rule (deliverable):** TS `MOTION.curves` for JS/`v-bind` consumers (`drawerGlide` — genuinely `v-bind`-consumed by the drawer mover engine); `--ease-*` CSS vars for `<style>` consumers. The laminate re-point (§2) mints `--ease-glassGlide` from THIS curve's control points so the laminate's arrival joins the one glass curve without adding reactive plumbing to a static value (r2-T5).

### Proposed token set (mint in `@theme`, §3)
```
--ease-noteWrite:     cubic-bezier(0.22, 1, 0.36, 1);      /* C1 · reveal/write-in · 10 sites */
--ease-standard:      cubic-bezier(0.4, 0, 0.2, 1);        /* C2 · material standard · 9 sites (1 dev) */
--ease-springPop:     cubic-bezier(0.34, 1.56, 0.64, 1);   /* C3 · overshoot pop · 6 icon/toggle sites (+2 laminate → glassGlide, +1 dev) */
--ease-accelIn:       cubic-bezier(0.55, 0.055, 0.675, 0.19); /* C4 · ease-in exit · 4 sites (spec alias: --ease-laminateLeave) */
--ease-fadeOut:       cubic-bezier(0.32, 0, 0.67, 0);      /* C5 · solver-dim fade-out · 3 sites */
--ease-ghostDraw:     cubic-bezier(0.215, 0.61, 0.355, 1); /* C6 · ghost glyph draw · 2 sites */
--ease-drawOn:        cubic-bezier(0.33, 1, 0.68, 1);      /* C7 · pencil draw-on/controls · 2 sites */
--ease-loaderScrub:   cubic-bezier(0.645, 0.045, 0.355, 1); /* C8 · loader scrub · 1 site — STAY-LITERAL defensible */
--ease-anticipatePop: cubic-bezier(0.68, -0.55, 0.265, 1.55); /* C9 · anticipate+overshoot · 2 sites */
--ease-glassGlide:    cubic-bezier(0.32, 0.72, 0, 1);      /* C10 · glass glide · minted for the laminate; canonical home stays MOTION.curves.drawerGlide (TS) */
```
No curve is **genuinely role-ambiguous** → zero hard STAY-LITERAL. C8 is the one borderline (single-use), flagged.

---

## 2. Laminate anchors (RE-LOCATED at HEAD 766aa068)

Spec cited `65425697` line numbers; both moved **+4 lines** at HEAD (W8/W9/WU rewrites).

| anchor | spec (`65425697`) | **HEAD 766aa068** | literal | verdict |
|---|---|---|---|---|
| overshoot spring (arrive/`.is-shown`) | `:231-232` | **`AnswerKeyLaminate.vue:235-236`** | `cubic-bezier(0.34, 1.56, 0.64, 1)` (opacity + transform, 280ms) | **RED** — overshoot (cp₂=1.56>1); → `var(--ease-glassGlide)`, 280ms preserved |
| easeInCubic leave | `:222-223` | **`AnswerKeyLaminate.vue:226-227`** | `cubic-bezier(0.55, 0.055, 0.675, 0.19)` (opacity + transform, 200ms) | legit easeInCubic exit, **NOT overshoot** — tokenize (`--ease-accelIn`), do NOT re-time |
| glass reference | `pencilConfig.ts` `MOTION.curves.drawerGlide` | **`pencilConfig.ts:141`** | `cubic-bezier(0.32, 0.72, 0, 1)` | the monotone glass source; stays TS, minted as `--ease-glassGlide` |

Source context: the `.is-shown` block (`:230` comment "lay-down (arriving): the physical-flourish curve, 280ms") carries the two overshoot lines at `:235-236`; the base `.answer-key-laminate` block (`:222` comment "lift-away (leaving): fast + easeInCubic") carries the leave curve at `:226-227`.

---

## 3. Born-RED probes + mint location

```
PROBE 1 — the CSS-var void (expect EMPTY):
$ grep -rnE -- '--[a-zA-Z-]+:\s*cubic-bezier' src
  → (no output)   exit=1   ✅ RED: zero --ease-* CSS custom properties exist

PROBE 2 — defineModel (C2 lane owns; expect EMPTY):
$ grep -rl defineModel src
  → (no output)   exit=1   ✅ RED: defineModel unused tree-wide
```

**Token-layer location (where `--ease-*` should mint):** `assets/index.css` — the **`@theme` block at line 81** (base declarations: `--radius`, `--font-*`, `--color-*`, `--sheet-*`, `--grid-line-color`, `--paper-clean-texture`, running `:81→~239`). Easing is **theme-invariant** (curves don't change light/dark) → mint the `--ease-*` cluster in the base `@theme`, **NOT** the `.dark` override (which starts ~`:243` with `--color-background: hsl(24 8% 6%)`). The tree carries 101 `--*` declarations in `index.css` + the typography/App layers (the "138-var" token layer); zero are `cubic-bezier`. The `:root, .dark { … }` block at `:681` is the grid-line/user-ink override only — not the token hub.

---

## 4. Parity baseline — reduced-motion AE=0 (the wave's definitive bound)

The idiom sweep is motion-neutral: a **settled** reduced-motion render is pixel-identical before vs after. This is the BEFORE baseline at HEAD 766aa068; V re-runs the recipe AFTER the sweep and asserts **AE=0** against these PNGs.

### Recipe (byte-reproducible — mirrors `playwright-golden.config.ts`)
- **Script:** `docs/tranches/2026-07-tranche-4/evidence/w10/parity-capture.mjs` (verbatim; resolves `@playwright/test` from `web/frontend/node_modules` via `createRequire`).
- **Serve the BUILT DIST only:** `cd web/frontend && npm run build && npx vite preview --port 4485 --strictPort`, then `PLAYWRIGHT_BASE_URL=http://localhost:4485 node …/parity-capture.mjs`.
- **Context:** viewport `1280×800`, `deviceScaleFactor: 2`, `reducedMotion: 'reduce'` (K38 freezes the ~8 Hz boil beat at pose 0), launch `--force-color-profile=srgb`.
- **Pinned boards** (URL wins over the auto-deal → fixed pixels):
  - sudoku: `./?board=My41MDgwMDAwMDAwMDMwMDAwMDA2MDkwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA` — `encodeSudoku(3, {0:5,2:8,11:3,18:6,20:9}, 81)` (the golden PINNED_GIVENS).
  - futoshiki: `./?game=futoshiki&board=NS4zMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwLjEtMg` — `encodeFutoshiki(5, {0:3}, 25, [[1,2]])` (the permalink-spec proven pin).
- **Settle** (never a sleep): `svg.handwritten-logo` → `image.boil-frame-bitmap.is-active` → (dark: `html.dark` + `.toggle-rest.rest-moon.is-active` + `img.rest-pose.is-pose-active`, no `.is-turning`) → game cells (`.sudoku-cell .glyph-svg` / `.futoshiki-cell` + first `.futoshiki-caret` visible) → `document.fonts.ready` → 300 ms bounded settle margin.
- **Surfaces per pair:** `-board.png` (clip to `.board-wrapper` bbox — the raster-stable primary surface, the load-bearing AE=0 target) + `-full.png` (whole 1280×800 viewport @DPR2).

### ⚠ DARK-BOOT KEY WRINKLE (read before the post-sweep re-run)
Dark pairs boot via `localStorage`. At HEAD the key is the vueuse default **`vueuse-color-scheme`** (baseline used this). The **W10 theme-key gate RENAMES it to `sudoku-color-scheme`**. So V's post-sweep re-run MUST pass `KEY=sudoku-color-scheme` (env override in the script) — the resulting moon-rest **pixels are AE=0**, only the boot-key STRING differs. Light pairs are unaffected.

### Self-determinism proof (each surface captured twice, sha256-compared IN-RUN)
All four pairs: **board self-AE0 = true AND full self-AE0 = true** — byte-identical across two consecutive captures. feTurbulence raster is deterministic on this machine under PRM+srgb, so **full-page AE=0 parity is achievable** (not just the board crop).

### Baseline artifacts + sha256 (the AE=0 references)
```
7991707bbaede942…d3d3037  parity-futoshiki-dark-board.png
723a53c07879281f…ea801b0  parity-futoshiki-dark-full.png
ae77b9efc49cf170…e2d22fe  parity-futoshiki-light-board.png
d5c85f6ebf097778…7af3b225 parity-futoshiki-light-full.png
a1c8e60df4b43fbc…d76db8b5 parity-sudoku-dark-board.png
928744eed047bbac…596a65f9 parity-sudoku-dark-full.png
5f527a213b1178e5…7d1ae5c0 parity-sudoku-light-board.png
d6617857cc6079b6…4201e86d7 parity-sudoku-light-full.png
```
(Full 64-char digests: `shasum -a 256 docs/tranches/2026-07-tranche-4/evidence/w10/parity-*.png`.)

Captures visually verified: sudoku-light-full renders the pinned givens 5/8/3/6/9 + full chrome (wordmark, control panel, sun crest, avatar, tally); futoshiki-dark-board renders the dark "3" given + `>` inequality caret. Preview on :4485 killed after capture.

---

## 5. Handoff to implementation

1. Mint the 9 `--ease-*` role tokens (+`--ease-glassGlide`) in the `@theme` block (`index.css:81`), base/theme-invariant. C8 `--ease-loaderScrub` is impl's call (single-use).
2. Convert the 41 CSS-layer literals to `var(--ease-*)` mechanically (`[dev]` FilterTuner sites optional — don't ship).
3. Laminate: `:235-236` → `var(--ease-glassGlide)` (280ms preserved); `:226-227` → the shared `--ease-accelIn` (200ms preserved, not re-timed). **Reconcile the `--ease-laminateLeave` vs `--ease-accelIn` naming (C4 conflict) before minting.**
4. `drawerGlide` stays TS; document the two-layer rule in `pencilConfig.ts`.
5. Post-sweep: re-run `parity-capture.mjs` with `KEY=sudoku-color-scheme`; assert AE=0 vs the §4 shas.
