# union-prototype — the storybook-glass union, BUILT and MEASURED (Pass 2.5)

**Agent**: union-prototype · **Date**: 2026-07-04 · **Worktree**: `.claude/worktrees/wf_a0ad6a3b-7a9-5` (throwaway branch `worktree-wf_a0ad6a3b-7a9-5`, reset to master `91bb8b0` per the provisioning-defect note)
**Contract**: `pass25/design-union.md` §7 (the build brief), riding `pass25/fusion-tech-killgate.md §4` (composition law) and `pass2/design-refinement.md` (the pure-pencil incumbent).

## Verdict up front — **PARTIAL**

The union is **deft where translucency has something to do, and marginal where it doesn't** — and nothing built reads egregiously contrived. Concretely:

- **Soul preserved (veto axis — PASS, unambiguous).** Board-interior SSIM = **1.00000** at all four conditions (light/dark × DPR 1/2); grid/glyph/mascot DOM subtrees are **byte-identical** (SHA-256 match) between skins. The union never touches the soul.
- **The flagship answer-key laminate is genuinely novel and works** — "check without spoiling," your entries survive, two inks (black givens showing through + teacher-red printed answers). It reads strongly as a held laminated sheet **in dark mode** (the rim catch-light traces the board edge); in light mode the *glass* reads faintly (blur over a near-white board blurs almost nothing, exactly as `glass-ui-union-seams.md §1.1` predicted) and the fiction is carried by the **behavior + the red key**, not by glassmorphism.
- **Washi tooltip: deft** — a taped paper label beats the generic dark pill it replaces.
- **Vellum-lifted AttributionCard: deft-ish** — translucency does visible work (the logo shows *through* it), plus a real-`<button>` a11y win; but the pixel delta over pencil is marginal.
- **Vellum ControlPanel: honest but marginal** — 72% cream-card over a cream page is near-indistinguishable from opaque; the panel's storybook quality is carried entirely by the **pre-existing cartoon outline**, not by the vellum. It does not read "app panel"; it just does very little.
- **Perf: clean.** No raster regression from union chrome; the freeze hypothesis (UD4) is **measured and confirmed** — freezing the board during the held laminate drops board raster **−71%**, and the counterfactual (glass over a still-boiling board) keeps full idle raster. `dropped = 0` in every condition.
- **Sticker gleam (§4.3): NOT BUILT** — the 3-beat celebration it hooks into (`design-refinement.md §1.3`) does not exist in the codebase; there is no timeline to attach to. Reported as blocked, not skipped.

**The honest partial**: the union earns its keep on the *laminate* and the *washi label*; the *vellum panel* is the weakest link (translucency invisible, no harm, little gain). If Pass 3 wants the strongest coherent subset, it is **laminate + washi + attribution**, with the vellum panel a take-it-or-leave-it garnish.

---

## 0. Reconciliations & environment (stated, not silent)

1. **"Install glass-ui" (orchestrator build-step 2) vs the hard gate (spec §1.3/§7.2 + the condensed brief).** These conflict. I followed the **specific contract**: `@mkbabb/glass-ui` is **absent from `package.json`**, zero JS/subpath imports, zero `/styles` import; every recipe is **hand-ported and renamed** `--sheet-*`/`Sheet*`. Verified: `grep glass-ui package.json` → absent; `grep -rn @mkbabb/glass-ui src/` → none.
2. **Topology.** This worktree is master (`91bb8b0`), which does **not** carry prototype-11's `sudoku/`/`skin/` split — the tree still uses `components/custom/`. I placed sheet components in `src/components/sheet/` (the nearest idiomatic home) and app-local modules in `src/lib/`. The ESLint skin/domain boundary doesn't exist here to respect; the mount point is domain-side (`SudokuBoard.vue`) as the spec intends. This is a topology *adaptation*, disclosed; the prototype is throwaway and the evidence is the deliverable.
3. **Baseline.** Migration diff `pass2/keyframes5-migration.diff` applied clean (`git apply`, exit 0); fresh `npm install` (keyframes.js 1.1.0→**5.1.0**, `/engine` subpath present); `vue-tsc -b --force` exit 0, `vite build` exit 0. Post-migration CSS baseline **7.51 KiB gzip** — the "before" for the bundle delta.
4. **Skin flag.** `?skin=union` opts in; anything else (default) is pure pencil — `src/lib/skin.ts:14`. Both skins share one compiled bundle; the soul path is byte-identical in both.

---

## 1. What was built (file:line)

| # | Surface | Treatment | Files |
|---|---|---|---|
| P1 | `--sheet-*` token ladder + classes (light/dark/PRT/contrast arms) + `--color-teacher-red` | §7.3 values verbatim; ink edge as **inset box-shadow ring**, not `border` (see §3) | `src/assets/index.css:51-52` (teacher-red), `:105-232` (sheet block) |
| P1 | Vellum ControlPanel card | `bg-card`→`sheet-vellum` via `cardClass`; panel internals untouched (boiling outline/divider stay) | `App.vue:31,67,88` |
| P1 | Washi tooltip | solid pill → `SheetWashiLabel` (union only); seeded torn-tape `clip-path` + ±1.5° tilt, `:focus-visible` | `components/sheet/SheetWashiLabel.vue` (new, 83 L); `ControlPanel.vue:340-349,356-360` |
| P1 | **Answer-key laminate (flagship)** | hold-to-peek; board-shaped `sheet-laminate` sibling after cells; freeze-in-place; teacher-red hand-glyphs, no grain, 150ms flat fade; lay 280ms flourish / lift 200ms easeIn; K/Esc; `role=status` | `components/sheet/AnswerKeyLaminate.vue` (new, 200 L); `SudokuBoard.vue:4,25-27,140-148`; `useSudoku.ts:149-166` (`peekSolution`, cached per `boardGeneration`); `boilScheduler.ts` (new, 39 L); `App.vue` peek orchestration + K/Esc |
| P1 | Boil-hold gate | `heldFrameCount()` collapses frame-count→1 while held → subscriber withdraws, frame frozen in place (no snap to 0) | `boilScheduler.ts`; `HandDrawnGrid.vue:7,34-37`; `ControlPanel.vue:47-49` |
| P2 | Vellum-lifted AttributionCard + real `<button>` | α .80, lift shadow, fiber, 220ms easeOutCubic settle, blur removed (both skins) | `AttributionCard.vue` |
| — | Sticker gleam (§4.3) | **not built** — no celebration timeline exists to hook | — |
| — | FilterTuner laminate reskin | **not built** — FilterTuner is commented out of `App.vue:9`; 0 prod bytes, out of scope | — |

**Diff**: `pass25/union-prototype.diff` — 11 files, **678 insertions / 28 deletions** (above the ~450 LOC soft target; a chunk is the mandated per-element fiction comments (§7.4.6) + the flagship laminate coming in at 200 L vs the ~180 estimate). Zero new dependencies.

---

## 2. Evidence — the gates, measured

### 2.1 Soul preservation (VETO axis) — **PASS**

Method: `union-harness/ssim.mjs` — under `prefers-reduced-motion` the boil freezes at frame 0 in **both** skins; board-interior + mascot crops captured with an identical clip rect; windowed SSIM (8×8 luma) in-browser. A **pencil-vs-pencil control** establishes the noise floor.

| theme | DPR | board SSIM (pencil vs union) | mascot SSIM | control (pencil vs pencil) |
|---|---|---|---|---|
| light | 1 | **1.00000** | 0.99692 | 1.00000 |
| light | 2 | **1.00000** | 0.99642 | 1.00000 |
| dark | 1 | **1.00000** | 0.99732 | 1.00000 |
| dark | 2 | **1.00000** | 0.99720 | 1.00000 |

- Board interior **1.00000** everywhere (gate ≥ 0.99). Mascot **0.996–0.997** (gate ≥ 0.99). Control 1.0 → the capture is fully deterministic, so these are real, not noise.
- **DOM parity** (`domparity.mjs`): SHA-256 of `.hand-drawn-grid`, `.sun-moon-toggle`, and a `.glyph-svg` are **byte-identical** across skins — `grid=3a5ec1f3…`, `mascot=122e3576…`, `glyph=5ebb0650…`, all IDENTICAL. The mascot's sub-1.0 SSIM is a sub-pixel AA artifact of the raster capture, not a structural change (the DOM proves it).

**Caught & fixed during measurement (a real finding):** the first SSIM pass read board **0.90–0.92** with a **1.0 control**. Diagnosis (`diag.mjs`): the board was shifted **exactly 1px left** (`dx = -1.000`, size identical 672×672); own-bbox SSIM was **0.99996**. Cause: the vellum panel's `border: 1px solid` widened the auto-width sidebar 2px (borders add to shrink-to-fit width even under `box-sizing:border-box`), shifting the *centered* board group 1px. Fix: render the ink edge as an **inset box-shadow ring** (zero layout impact) — `index.css:161,171`. Post-fix: `dx = 0.000`, board SSIM **1.00000**. The rendering was never touched; a sibling's border was leaking into layout.

### 2.2 Perf — fusion-bench re-run against the REAL app — **PASS (freeze hypothesis confirmed)**

Method: `union-harness/perf.mjs` — methodology matched to `pass25/fusion-bench` (1500ms settle + 6000ms trace window, same categories); PipelineReporter (async BeginImplFrame→presentation) → ms/frame; RasterTask → CPU raster. One consistent-load snapshot on a stable static server. `n` per the gate.

| condition | n | ms/frame (mean [min–max]) | **RasterTask** ms/6s (mean [min–max]) | dropped |
|---|---|---|---|---|
| pencil-idle (baseline) | 3 | 10.085 [10.053–10.146] | 1567 [1546–1583] | 0 |
| union-idle (chrome, boil running) | 3 | 10.125 [10.067–10.163] | 1614 [1575–1648] | 0 |
| **union-held-frozen** (glass over frozen board) | 5 | 9.994 [9.970–10.051] | **453 [437–467]** | 0 |
| union-held-nofreeze (glass over boiling board) | 5 | 10.103 [10.024–10.160] | 1523 [1470–1576] | 0 |

Reads:
1. **No raster regression from union chrome.** union-idle raster (1614) ≈ pencil-idle (1567); +3%, inside the ~10% run-variance the killgate documented for this architecture. The union adds **zero** new per-tick raster sources.
2. **The freeze buys back the overlap tax — UD4 CONFIRMED.** held-frozen raster **453ms** is a **−71%** drop vs idle; held-**nofreeze** stays at full idle raster (1523ms). The delta held-nofreeze − held-frozen ≈ **1070ms/6s** is exactly the boil's own re-raster, eliminated by freezing. The laminate's `backdrop-filter` adds **zero** raster (compositor-resident, as `killgate §2` established) — held-frozen's 453ms is just the frozen static frame + lay-down residual.
3. **`dropped = 0` everywhere** — the overlap tax is a measurable cost, never a frame-dropping cliff at the 6.7Hz boil, corroborating `killgate §4 rule 3`.
4. **Honest caveat on PipelineReporter + the 8.5 threshold.** On this Mac under this run's load, PipelineReporter saturated at the ~10ms vsync floor (fully pipelined, `dropped=0`) and did **not** discriminate — all four conditions clustered 9.99–10.13. The §7.4.3b gate's absolute **8.5 ms/frame** was calibrated on the killgate's bench (idle 7.77) and does not transfer to this hardware's vsync floor. The *transferable* result is decisive and stronger than the threshold asks: **held-frozen is the CHEAPEST condition measured** — below both idle baselines on ms/frame and −71% on raster. A separate quiet-machine run (perf.mjs run 1) *did* show PipelineReporter discriminating: held-frozen r1/r2 = **1.47 ms/frame ≈ idle 1.41**, held-nofreeze **3.5–10.2** — the overlap tax visible on the compositor metric when the machine had headroom.
5. **Architecture note (important context):** this master-topology app still runs the **pre-`grain-static-overlay`-fix** grid (single `<g filter=grain-static>` with per-tick `d` rewrites — `HandDrawnGrid.vue:95`), so idle raster is **nonzero** (~1.5s/6s), unlike the killgate bench's fixed-arch raster=0.00. That fix (`pass2/grain-static-overlay.md`, −72.9%) is a different prototype not landed here. The union **does not regress it** (union-idle ≈ pencil-idle), and the freeze **composes orthogonally** with it (freezing stops the frame index regardless of grid architecture).

Traces: `pass25/union-traces/*.json` + `perf-summary.json`.

### 2.3 Bundle — **PASS**

| chunk | baseline (post-migration) | union | Δ | budget |
|---|---|---|---|---|
| CSS gzip | 7.51 KiB | **8.64 KiB** | **+1.13 KiB** | ≤ +4 KiB ✓ |
| JS main gzip | 69.54 KiB | **71.30 KiB** | **+1.76 KiB** | ≤ +2.5 KiB ✓ |

- `@mkbabb/glass-ui` **absent** from `package.json`; zero glass-ui imports in `src/`.
- **backdrop-filter grep gate**: the only real surfaces are `.sheet-laminate` ×3 (main rule + PRT arm + contrast arm). A dead `.backdrop-filter` Tailwind utility-base also appears — **proven** to originate solely from the unimported dev-only `FilterTuner.vue`'s `backdrop-filter: blur(16px)` (removing that file from the scan makes it vanish; `grep 'class="[^"]*backdrop-filter'` over `dist/` → nothing, it is never applied to any element), i.e. **pre-existing** and union-independent. No persistent glass ships.

### 2.4 A11y — **PASS**

- **prefers-reduced-transparency: reduce** (`a11y.mjs`, CDP-emulated): all sheets go opaque (`--color-card`), blur off, catch-light off, **fiber stays** (the deliberate §L5 divergence). Screenshot `prt-light-held-board.png` shows the laminate fully opaque (givens occluded, red key visible) — the fallback IS pure pencil. *Minor honest quirk:* under the opaque laminate the non-given-only key leaves gaps where givens are hidden; a P3 refinement would render the full solution when opaque.
- **Contrast**: teacher-red on the milk-over-cream board = **4.11:1** (passes large-text WCAG 3:1; the digits are large glyphs); dark arm **6.35:1** (passes AA normal text). Matches the spec's ~4.0:1 note.
- **Keyboard**: `K` toggles peek, `Esc` closes — the entire evidence set drove the laminate via `K` (no pointer). `role="status"` announces "peeking at the answer key" (`AnswerKeyLaminate.vue`).
- **Cross-engine**: paired **WebKit** capture (`webkit-{light,dark}-held-board.png`) renders the laminate faithfully with `-webkit-backdrop-filter` authored — rim catch-light + red key intact (see `webkit-dark-held-board.png`).

---

## 3. The hand-drawn-soul flip test (honest per-surface read)

Each translucent element, named by its physical object (§1.2 rule 5 — anything that can't name its object is contrived):

| Surface | Names its object? | Reads as | Verdict |
|---|---|---|---|
| **Answer-key laminate** | yes — a teacher's clear laminated sheet | **DEFT.** Two inks (black givens through the milk + teacher-red printed answers) = "check without copying." Dark mode sells the glass (rim catch-light along the board edge); light mode the glass is nearly invisible (blur over white) so the fiction rides the *behavior* + red key. Novel: pencil has no peek. The lay/hold/lift + entry-survival all work. | DEFT |
| **Washi tooltip** | yes — tinted paper tape | **DEFT.** Torn ends + tilt + Patrick Hand; strictly more in-world than the solid dark pill it replaces (`union-light-tooltip.png` vs `pencil-light-tooltip.png`). | DEFT |
| **Vellum-lifted AttributionCard** | yes — tracing paper picked up an inch | **DEFT-ish.** Translucency does visible work (the "sudoku" logo shows through, `union-light-attribution.png`); real-`<button>` a11y win. Pixel delta over pencil is marginal (pencil already 80% translucent). | DEFT (marginal Δ) |
| **Vellum ControlPanel** | names "tracing paper" but you can't tell | **MARGINAL.** 72% cream over cream ≈ opaque; the storybook read is the pre-existing cartoon outline, not the vellum. Does **not** read "app panel" — it just adds almost nothing visible. Perf-free, honest, understated. | MARGINAL |
| DarkModeToggle mascot | n/a — untouched | soul, byte-identical | PENCIL (correct) |
| Board frame | n/a — untouched | soul; the held laminate adds a nice frame-elevation cast | PENCIL (correct) |

Composites for the 5-second flip: `composite-idle-light.png`, `composite-idle-dark.png` (pencil ∥ union), and the money shot `composite-peek-{light,dark}.png` (union idle ∥ union held). Motion cycle: `motion-strip-laminate.png` (lay 280ms flourish → held → lift 200ms → board returns untouched, entries survive).

---

## 4. Deliverables (all under `pass25/`)

- **`?skin=union|pencil` build** — `web/frontend/dist/` (default pencil).
- **`union-prototype.diff`** — union-only changes (11 files, 678+/28−).
- **`union-screenshots/`** — 51 stills: `{pencil,union}-{light,dark}-idle-{full,board,panel,mascot}`, `union-{light,dark}-held-{full,board}`, `{union,pencil}-{light,dark}-{tooltip,attribution}`, `prt-*`, `webkit-*`, 4 composites, `motion-*` strip + frames.
- **`union-traces/`** — 16 CDP traces + `perf-summary.json` + `ssim-results.json`.
- **`union-harness/`** — reusable harness (`lib.mjs`, `capture*.mjs`, `ssim.mjs`, `diag.mjs`, `domparity.mjs`, `perf.mjs`, `a11y.mjs`, `composite.mjs`).

---

## 5. Verdict for Pass 3 / the owner (§8 axes)

| Axis | Result |
|---|---|
| **Soul preservation** (veto) | **PASS** — board SSIM 1.00000, DOM byte-identical, mascot 0.997. Untrained read stays "storybook page." |
| **Fiction integrity** | **PASS for laminate/washi/attribution** (each names its object and behaves); **WEAK for the vellum panel** (names tracing paper but the translucency is invisible — honest, not contrived, but barely present). |
| **Novelty with function** | **PASS** — the laminate is peek-without-spoiling, works, entries survive; the held-sheet moment is real, especially dark. This is the union's load-bearing win. |
| **Perf** | **PASS** — no raster regression; freeze confirmed (−71%); dropped=0. (PipelineReporter's absolute 8.5 threshold non-transferable to this hardware's vsync floor; held-frozen is nonetheless the cheapest condition.) |
| **A11y** | **PASS** — PRT/PRM/contrast/keyboard/cross-engine all handled. |
| **Maintenance** | **CAUTION** — 678 insertions (> ~450 soft target), but zero deps, frozen recipes, `--sheet-*` vocabulary only, no `glass-*` leak. |

**Decision shape recommended to the owner**: **adopt-partial** — ship **laminate + washi tooltip + vellum-lifted attribution**; treat the **vellum ControlPanel** as optional (it costs nothing and harms nothing, but earns nothing visible). The union's case rests on the flagship laminate, and the flagship works. The **sticker gleam** is deferred until the celebration timeline exists. Pure pencil remains a complete, valid end-state; this union *extends* it without ever threatening the soul.

### Findings ledger
| # | Class | Finding |
|---|---|---|
| UP1 | perf (confirms UD4) | Freezing the boil during the held laminate drops board raster **−71%** (453 vs 1523ms/6s); the counterfactual (glass over a still-boiling board) keeps full idle raster. The freeze *is* what makes held-glass free. dropped=0. |
| UP2 | soul | Board rendering is byte-identical (SSIM 1.00000, DOM SHA-256 match). The union does not touch the soul — proven, not asserted. |
| UP3 | bug-caught | The vellum `border` leaked 1px into the centered layout, shifting the board and failing the naive SSIM read at 0.92; fixed by an inset box-shadow ring (zero-layout ink edge). A real defect the measurement surfaced. |
| UP4 | design | The laminate's *glass* reads faintly in light (blur over near-white does nothing — `seams §1.1` vindicated); its conviction is the two-ink **behavior** + red key + the dark-mode rim catch-light. The union's persistent-paper surfaces (vellum panel) are its weakest: translucency invisible over a matching page. |
| UP5 | scope | The sticker gleam and FilterTuner reskin have no substrate in this tree (no celebration timeline; FilterTuner commented out). Neither shippable here; both correctly deferred, not faked. |
