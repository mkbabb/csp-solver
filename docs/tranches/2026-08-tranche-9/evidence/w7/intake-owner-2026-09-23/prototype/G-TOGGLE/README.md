# G-TOGGLE prototype: T9-M21, "the darkmode toggle story book needs improvement"

Built against main `1d0dc4fd` in worktree `.claude/worktrees/wf_b6676cd9-8c6-14`, from the adjudicated
brief (`adjudicate/G-TOGGLE.md`). Nothing is committed. The patch is `g-toggle.diff` in this folder. Every
number below is a built dist served by `vite preview`: the control on 127.0.0.1:4256, the prototype on :4255,
both killed by recorded PID.

**Box conditions.** Load ran 50 to 780 through the session (other lanes), so this was never a quiet box. The
recorder self-test (a CSS-only spinner under the same CDP screencast) read 93 painted frames/s at load 132.
Frame-time rows are loaded-box readings. Only the within-session A/B and the non-timing readings discriminate.

## 0 · What was built (7 files, +328 −94, plus one test file)

| file | change |
|---|---|
| `pencil/config/pencilConfig.ts` | `MOTION.rungs` {whisper 150, note 250, dusk 350, throw 520}, `MOTION.dusk.curve`, `MOTION.hinge` {toDark 0.343, toLight 0.249}, `MOTION.curves.springPop`, `MOTION.characters.storybook` (squash 120 plus arm K's beats verbatim). Also `bezierCrestX()` (springPop crests at 0.5728), `storybookScore(arm)` (R is derived from the rungs) and `hingeMs()`. `wobble-celestial.baseDef = false`. |
| `assets/index.css` | THE ONE `@property` block: `--motion-hinge-dark` 120ms, `--motion-hinge-light` 87ms, `--motion-beat` 125ms (`<time>`, inherits, initial 0ms), mirrored in `:root`. THE HINGE rule, no-preference-gated and keyed on the destination class: `html.theme-turning(.dark / :not(.dark)) :is(.glyph-svg path, .pencil-marks, .cell-ghost-path) { transition: stroke/fill/color 0s linear var(--motion-hinge-*) !important }`. |
| `composables/useTheme.ts` | `inkDark`: `isDark` held to the hinge while `theme-turning` is up, and `isDark` itself otherwise (PRM, a system flip, boot). The swap runs on the CSS clock: two frames on, then the hinge timer, then two frames off, all generation-guarded. The comment that the dusk is inert has been corrected. |
| `pencil/grid/HandDrawnGrid/HandDrawnGrid.vue` | The grid bake's `cacheKey` reads `inkDark`. The "masked by the Bloom" claim has been corrected. |
| `pencil/celestial/DarkModeToggle.vue` | See the list below. |
| `pencil/config/filterBudget.ts` | The toggle row's `filter` is now the matcher `/^url\(#wobble-celestial-p\d\)$/`. The count stays 2 and the population stays 9. The type is widened to `string \| RegExp`, and the census never compared this field. |
| `pencil/chrome/SvgFilters.test.ts` | `wobble-celestial` moves from the consumed base defs to the orphans. |
| `pencil/config/storybook.test.ts` (new, 8 tests) | G5, G9 and G11 as a vitest. The tests recompute the hinge from index.css's tokens and the dusk curve, and the crest from springPop. They check the `@property` shape, the mirror values and the absence of a fallback, R's derivation and K's verbatim table, zero timing literals in the SFC besides the hover's 200ms, and that every `:hover` in the toggle is under `@media (hover: hover)`. |

The `DarkModeToggle.vue` changes:

1. **One const, two arms:** `ARM = import.meta.env.VITE_STORYBOOK_ARM === "R" ? "R" : "K"`. The score is `storybookScore(ARM)`, published to the scoped style through `v-bind` (static, written once at mount). The SFC CSS carries no timing literal except the hover's 200ms.
2. **The opacity law.** The outgoing body is opaque to the fold's end and then cut with `0s` at `fold`. The incoming body is born opaque with `0s` at `birth`. Stars and sparkles step their opacity at their pop delay. The undelayed accent tuck is deleted: accents ride the warp to the cut and re-arm unseen.
3. **`face`**, flipped at the press, drives the live pair's `.is-active`. In R, `toggleDark` fires one whisper later, and a second press inside the whisper nets to zero.
4. **The boil.** The live `:filter` is `url(#wobble-celestial-p${frame})` through `gestureBound`. Both bodies step their band while `turning`.
5. **The settle.** `plush-land`'s `animationend` is deleted. After one rAF, the toggle waits on every unfinished animation in the button's subtree, reads again, and lands when a read finds none. It is generation-guarded, with a backstop at the score's end plus one beat.
6. **The hover** is fenced in `@media (hover: hover)`.
7. **PRM:** the `.toggle-rest` 200ms crossfade is deleted, so PRM is a cut.
8. **`theme-turning`** is held from the press to flip + dusk + beat.

**The grid half went through five forms, and the choice was made on painted numbers.**

- **v1** (the brief's form) set `inkDark` from a `setTimeout(hinge)`.
- **v2** set it from the grid svg's own `transitionstart` of the hinge rule (the CSS clock). It measured later: the swap landed at +160 to +186 in chromium and +229 to +297 in WebKit, against v1's +93 to +163 and +127 to +181. v2 was reverted.
- **v1 painted a cold-flip blackout.** The re-bake it starts can land between the hinge and the frame that paints the CSS step. That held the digit step's paint about 350 ms, while chromium's composited background-color animation kept dusking the paper. The result was dark digits on dark paper: painted 1.13 to 1.28 for 7 to 23 frames, in both photographs, at both viewports.
- **v3** wrote `inkDark` in the first rAF at or after the hinge. **v4** waited two rAFs. Neither cured it: K 1280 cold still blacked out 2 of 2 photographs (v3: 1.16–1.19, 19–23 frames) and 2 of 3 (v4: 1.16–1.19, 8–25 frames).
- **The cause, read off the rAF clock** (`instruments/clock.py`):
  - The timer is anchored at the click, but the CSS transitions start at the commit of the click's first frame. That frame runs about 50–75 ms on a cold flip. So the JS clock runs one long frame ahead of the CSS clock.
  - In K5C: click at +67, a 75 ms first frame, the paper dusking from about 150 and the step due at about 268. The swap was written at about 231, and a 200 ms stall opened at 231, before the step's frame.
- **v5 (shipped here)** anchors at the CSS clock: two frames on, then the hinge timer, then two frames off. Every gen is guarded.
  - Painted: **0 digit frames under 3:1 on 27 flips** (K 1280 ×4 and 390 ×2, R 1280 ×3, each cold plus 2 warm). The stall now opens after the step frame (K6A: step at 268, stall from 268).
  - The cost is a later grid swap, +190…+224 warm in chromium (v1: +93…+163). The warm grid window reads 1.2–1.87 on 2–7 frames painted (v1: 1.55–3.45 on 0–5). §2 has the table.

Builds:

| builds | grid form | settle |
|---|---|---|
| `dist-K`, `dist-R1` | v1 | single read |
| `K2`, `R2` | v2 | single read |
| `K3`, `R3` | v1 | re-reading |
| `K4`, `R4` | v3 | re-reading |
| `K5`, `R5` | v4 | re-reading |
| **`K6`, `R6`** | **v5 (the final source)** | re-reading |

The toggle's code is identical across K builds and across R builds, except the settle loop from K3/R3 on. So toggle gates read on any K build hold for K6, and on any R build for R6, except G7. K6 and R6 re-read G1/G2/G3/G7/G10 on the timing matrix (chromium 1280, WebKit 1280/390, PRM, the injector), and the rows below carry them.

## 1 · Gates: control (main) · K · R

The toggle rows are rAF-sampled per frame: chromium and WebKit × 1280×800 fine and 390×844 hasTouch, both
boots, cold (flip0) plus 3 warm, one encoded `?board=` payload. The clock origin is the in-page click
timestamp. There are 64 control flips, 64 K flips, and 16 to 64 flips per R build.

| gate | control (main) | K (the firing default) | R | verdict |
|---|---|---|---|---|
| **G1** translucent body/star/sparkle frames per flip (0.02 < op < 0.98) | 15–81 | **0** every cell | **0** every cell | K ✓ R ✓ |
| G1 frames with both live bodies at op > 0.02 (census "dbl": both > 0.5 scale and > 0.5 op) | warm 5–28 (dbl 3–13) | warm 4–25 (dbl 1–11), **opaque** (K's residue) | **0 (0)**, every cell, cold and warm | R ✓, K prints its residue |
| **G2** outgoing scale at the page's half-swap | 0.89–0.95 | 0.92–0.95 | **0** (already cut) | R ✓ |
| G2 crest − page landing (ms) | 163–190 (WebKit up to 477) | 134–195 | **−30 … +85** (chromium −24…+73) | R ✓ (in [−60, +250]) |
| G2 hand-off − page landing (ms) | 637–698 | 641–699 | **383–484** | R ✓ (≤ 520) |
| **G3** frames where the outgoing accents lead the body (star op < 0.9 while body ≥ 0.8) | 2–21 | **0** | **0** | ✓ |
| G3 blot frames (outgoing op in (0.02, 0.2) at scale > 0.25) | 0–2 | **0** | **0** | ✓ |
| **G4** digit ink vs `.board-wrapper`, computed per frame: min, frames < 3 | warm 1.01–2.83, 1–14 f | **≥ 4.06, 0 f** every cell cold and warm | **≥ 4.08, 0 f** every cell | ✓ (computed) |
| G4 grid, image key per frame (warm): min, frames < 3 | 1.00–2.17, 1–14 f | v1 1.03–3.63, 0–3 f; **v5 chromium 1.0–1.61, 4–6 f; WebKit 1.04–1.05, 4–5 f** | v1 1.33–4.16, 0–3 f; **v5 1.07–1.8, 3–7 f (chromium); 1.1–1.37, 4–5 f (WebKit 390)** | **RED** both arms (see §2) |
| G4 grid, cold | 1.0–1.53, 1–22 f | 1.03–1.53, 2–20 f | 1.02–1.24, 1–18 f | RED: M15's bake, carried |
| **G5** vitest recompute (hinge within 1 ms, crest 0.573 ± 0.002, stars derived) | no MOTION.hinge | 8/8 green | same | ✓. Plant: dark grid token at 70% → 2 RED |
| **G6** live-field steps during the gesture (in / out) | 0 / 0 | 3–6 / 1–2 | 2–4 / 0–2 | ✓ it boils |
| G6 hand-off at identity, mean Δ / % px > 16 (static, the census's instrument) | chromium L 1.86/5.04 · D 2.60/2.88; WebKit L 1.43/3.69 · D 2.09/2.52 | chromium L **1.00/2.44** · D **1.44/1.97**; WebKit L **0.00/0.00** · D **0.06/0.16** | same code | WebKit ✓, **chromium RED** (≤ 0.5 / ≤ 1 %) |
| G6 filter census (own filter ≠ none, display ≠ none): rest · hovered · mid-gesture · after | light 9·9·11·11 | 9·9·11·11 | same | ✓ identical, population 9 |
| **G7** live scale at the hand-off, 1.000 ± 0.005 | 35/38 (0.9724, 1.0197, 1.0199 off) | K3 (final settle): **all within**, including the 300 ms injector, both engines, cold | R3: 32/34. **Off: 1.012 and 1.0058**, WebKit warm under the injector (§3) | K ✓, R RED ×2 |
| **G8** PRM: toggle movers, crossfade | the toggle crossfades 200 ms | **0 movers, cut** | same | ✓ |
| G8 PRM: ink and paper on one frame | digits ✓, grid +8…+50 ms late (chromium) | digits ✓ (no dip); grid chromium 1–4 f at 1.24–1.53, same as control; WebKit same frame | same | **grid RED** (image decode), carried |
| **G9** button transform after a tap, hasTouch, settle + 1 beat | `matrix(1.08…)` (sticky hover) | **none** (chromium 390, both themes) | same | ✓. Lint in vitest. Plant: fence removed → RED |
| **G10** `html.dark` lands after the click (ms) | +8…+102 | +1…+96 (the engine's click-to-frame latency) | chromium **+151…+158**, WebKit +219…+257 (the same latency on top of the whisper) | chromium ✓. WebKit is whisper + ~70–100 |
| G10 second press inside the whisper | n/a | n/a | theme unchanged, outgoing never reached the park (R2, R3 × chromium and WebKit, n = 6) | ✓ |
| **G11** timing literals in the SFC | 11+ | 0 besides the hover's 200ms (not a score beat) | same | ✓. Plant: typed 560ms → RED. `lint:verbs`, `lint:bands`, `check-property-block` and the undefined-token census **don't exist on main**, so they weren't run |
| **G12** π at rest vs the control (computed paint props + tags + attr names + rects, 1090 elements): chromium 1280/390 × light/dark, WebKit 1280 light | n/a | **0 unclaimed moved** on 5 cells. Claimed: the button's inline `style` (v-bind vars), the live svg `filter` (p0), SvgFilters' base `wobble-celestial` def (3 nodes gone) | same | ✓. Goldens not run |
| G12 copy | n/a | check-copy-register 0 em/en, 0 jargon. No string changed | same | ✓ |
| **G13** frames > 34 ms in +0…+1100, warm | chromium 0; WebKit 1–9 | chromium 0; WebKit 1–11 | chromium 0–2; WebKit 1–7 | not worse than the interleaved control; box not quiet |
| G13 born (warm) | 0.18–0.49 | 0.07–0.40 | 0.06–0.47 | ✓ ≤ 0.30 chromium; WebKit up to 0.47 |
| G13 dS (largest per-frame step of the incoming scale), absolute gate 0.08 | chromium warm 0.04–0.08 | chromium warm **0.077–0.145**; WebKit 0.086–0.305 | chromium warm **0.067–0.346**; WebKit 0.12–0.31 | **RED both arms** (§3) |
| **G14** carried: bakes per cold flip / WebKit cold max frame | 8 / 501–558 ms | 8 / 382–665 ms | 8 / 431–565 ms | RED both arms, not claimed |

## 2 · G4 painted: the hinge on the board, two photographs

These are chromium CDP screencast PNGs at 1 px per CSS px, run twice (photographs A and B) per cell. Each frame gets two reads:

- **Board strongest ink:** the top 0.2 % of WCAG contrast against the board's median paper. The digits dominate this read.
- **Grid window:** a digit-free window, empty cells (0,2) and (0,3) with the box rule between them. The max contrast in that window is the grid stroke's.

Light boot: flip0 is cold into dark, flip1 is warm into light, flip2 is warm into dark. Each cell below is min, then frames < 3.

| tree · viewport | board ink, warm | board ink, cold | grid window, warm | grid window, cold |
|---|---|---|---|---|
| control · 1280 | 1.13–1.48 · 3–10 f | 3.39–4.44 · 0 | 1.02–1.15 · 3–11 f | 1.02–1.11 · 15–47 f |
| control · 390 | 1.13–1.48 · 3–8 f | 3.74–4.44 · 0 | 1.03–1.19 · 5–10 f | 1.02–1.07 · 19–25 f |
| K v2 (K2) · 1280 / 390 | 3.69–10.21 · **0** | 3.83–4.35 · 0 | 1.43–6.62 · 0–5 f | 1.02–1.16 · 6–39 f |
| K v1 (dist-K) · 1280 | 3.17–5.01 · **0** | **1.13–1.17 · 16–23 f** (the blackout) | 2.23–3.39 · 0–3 f | 1.03 · 27–34 f |
| K v1 · 390 | 4.31–5.29 · 0 | 3.78–4.35 · 0 | 1.55–3.45 · 0–5 f | 1.02 · 26 f |
| R v1 (R1) · 1280 | 3.73–4.42 · 0 | **1.14 · 19–22 f** | 2.60–3.08 · 0–2 f | 1.02–1.03 · 28–30 f |
| R v1 · 390 | 3.73–4.45 · 0 | **1.20–1.28 · 7 f** | 2.15–2.60 · 1–4 f | 1.02 · 26–28 f |
| K v3 (K4) · 1280 | 4.31–4.50 · 0 | **1.16–1.19 · 19–23 f** (2 of 2) | 1.97–2.97 · 1–3 f | 1.02 · 32–33 f |
| K v3 · 390 | 3.96–4.65 · 0 | 3.35–4.31 · 0 | 1.82–2.67 · 1–3 f | 1.02–1.03 · 25–26 f |
| R v3 (R4) · 1280 | 3.73–4.42 · 0 | 3.78 · 0 (1 of 1) | 1.72–1.73 · 4–5 f | 1.02 · 54 f |
| K v4 (K5) · 1280 | 4.35–4.50 · 0 | **1.16–1.19 · 8–25 f** (2 of 3) | 1.55–3.07 · 0–6 f | 1.03 · 36–48 f |
| K v4 · 390 / R v4 (R5) · 1280 | 3.74–4.50 · 0 | 3.72–5.74 · 0 | 1.57–3.08 · 0–7 f | 1.03 · 26–39 f |
| **K v5 (K6, final) · 1280, 4 photographs** | **3.17–5.07 · 0** | **3.77–7.97 · 0** | 1.30–1.87 · 3–7 f | 1.02–1.05 · 26–44 f |
| **K v5 · 390, 2 photographs** | **3.17–4.43 · 0** | **3.35–3.78 · 0** | 1.56–1.73 · 2–5 f | 1.02–1.05 · 26–27 f |
| **R v5 (R6, final) · 1280, 3 photographs** | **3.34–5.29 · 0** | **3.82–4.94 · 0** | 1.20–1.55 · 4–7 f | 1.02–1.03 · 38–43 f |

**Reading.**

- The digit half of the hinge holds on every warm flip in every tree built: 0 frames under 3:1 painted, where the control has 3–10. On the cold flip it holds only on v2 and v5, the forms whose grid swap can't land before the step's frame. v5 is the shipped form, at 0 on 9 of 9 cold flips.
- **The grid half cannot meet G4 on main.** It's a baked `<image>` whose `href` swap paints a decode (one frame or more) after the CSS step, and the equal-contrast window at the crossing is ±4 ms wide (3.11:1 there). Its painted warm dips shrink, from 1.02–1.19 on 3–11 frames to about 1.4–3.5 on 0–5 frames, but they don't go.
- The cure is MOT-VERB row 36's CSS step on a theme-independent `.grid-ink`, which is the brief's own "fold form". That's a pass-7 row, not this lane's.
- f3 frames the board at +0/+48/+100/+150/+237/+270/+350/+500.

## 3 · What the prototype learned (each one a pass-7 input)

1. **The opacity law exposes the spring's launch.** The control's 300 ms opacity fade hid the first ~100 ms of the springPop rise, which is its fastest segment. With the body born opaque at the park, the first visible steps are the steep ones.
   - dS is 0.077–0.145 in K (chromium warm), against 0.04–0.08 in the control. In R it's 0.067–0.346 (a 520 ms throw instead of 800 ms).
   - Both arms RED the absolute 0.08. This is the price the adjudicator named for R. It turns out K pays it too, once the fade is gone.
   - The step-off-curve re-cut (A.1.7) was **not computed** (gap). The chair's dS row decides.
2. **R's two clocks desync under a stall.** R's flip is a JS timer (whisper), and the fold and stand-up are CSS transitions started at the press.
   - Under the 300 ms busy-loop at +100, the flip lands at +379…+470 while the moon has already stood up: crest − landing −76…−503, born 0.81–1.03.
   - K flips in the press's own task, so its page and toggle start together (K3 under the injector: crest − landing 133–271).
   - In WebKit, R's backstop (armed at the click) fired 2 of 34 times before a late-started spring had settled (1.012 and 1.0058). The proposed cure is to arm the backstop in the first rAF, when the transitions exist. **It is not built and not measured.**
3. **The settle's first read is not enough in WebKit.** One read after one rAF came back short under the injector (R2: a hand-off on the crest, 1.087 and 1.090 at +642/+658). The re-reading loop (K3/R3) cured it: K3 had 0 off under the injector in either engine.
4. **The hand-off field match reaches the rest pose's exact field.** WebKit is byte-identical (0.00/0.00). Chromium keeps 1.00–1.44 mean Δ. That residue is the svg-root filter path against the pose bitmap's canvas raster path, not the field. G6 in chromium needs a raster-path cure, or the chair's number.
5. **Delaying any theme-keyed work into the dusk is dangerous in chromium.** The paper's background-color transition runs on the compositor, so a main-thread stall inside the dusk freezes main-thread ink while the paper keeps moving (§0, v1, v3 and v4). A JS clock anchored at the click is also one long frame ahead of the CSS clock on a cold flip. Anything that must follow a CSS step has to anchor at the frame's commit, not the event.
   - This is the same mechanism as M15's cold stall, moved to a worse place.
   - Any pass-7 form that re-keys work at the hinge has to prove its cold flip painted, not computed.
6. **An observation (not claimed, identical on both trees):** the dark-boot filter census at rest is 11, not 9. The two extra are `svg.crayon-heart.idle` `saturate(0.85)` ×2. The budget's 9 is the light scene's.

## 4 · Frames (four crops, each ≤ 150 KB)

- `f1-bloom-main-K-R-chromium-light2dark-1280x800-fine-warm.jpg`: chromium · light→dark · 1280×800 · fine · warm. Rows are main, K and R; columns are +0/125/250/270/375/500/548/700/950, with the painted frame's own time in brackets.
  - main shows the translucent moon over the sun at +250 and the brown blot at +375.
  - K shows an opaque small moon over the opaque sun at +250/270. This is K's stated residue, now opaque.
  - R shows the sun folded to a point by +250 on a still-light page. The moon stands up as the page darkens, and the stars pop from +548.
- `f2-bloom-main-K-R-chromium-dark2light-1280x800-fine-warm.jpg`: the same, dark→light.
  - main's stars go translucent by +125.
  - K and R keep their stars inside the fold to the cut.
- `f3-hinge-vs-snap-board-chromium-light2dark-390x844-coarse-warm.jpg`: chromium · light→dark · 390×844 · coarse (hasTouch) · warm, photograph B, the board's top-left 3×3. Rows are main's snap and K's hinge.
  - main washes out at +48…+150.
  - K keeps dark ink on the greying paper until the hinge, then light ink.
  - This frame is from the K2 build. Its digits behave identically in every build.
- `f4-handoff-live-vs-rest-identity-chromium-light-webkit-dark-1280x800-fine.jpg`: chromium light and WebKit dark · 1280×800 · fine · DPR 2 · the button box. Columns are rest pose 0, live at identity, |live − rest0|×4, and |rest1 − rest0|×4 (one boil step).

## 5 · Plants (born RED), lints, battery

- **Plants:** `plants.sh`, each applied, run and restored from a backup, with the restore byte-checked.
  - typed `560ms` star delay → RED (G11)
  - hover fence removed → RED (G9)
  - `--motion-hinge-dark: 0ms` → RED (G4/G11)
  - dark `--grid-line-color` at 70% → 2 RED (G5)
  - `var(--motion-hinge-dark, 120ms)` fallback → RED (G11)
  - The runtime plants (restore the 100 ms fade, the sink on accelIn, settle on plush-land alone, un-gate the hinge from no-preference) were **not run** (gap).
- **Final source:**
  - vue-tsc -b: 0
  - check-copy-register: bare 0
  - lint:motion: bare 0 (35 specs)
  - prettier `src/`: clean
  - eslint `src/pencil src/composables`: 0
  - vitest, chunked: pencil + composables 12 files / 97 tests; games 57 / 741; lib + probe + assets 1 / 17. All green.
- **Build:** the entry JS is 195,866 B (K6) against 194,541 B (+1,325 B raw).

## 6 · Gaps (a gap is a gap)

- **Not a quiet box** (load 50–780). G13 and every frame-time row are loaded readings, and no quiet-box re-run was made. The painted recorder dropped frames on some flips (gaps up to 333 ms). Photograph pairs were used, and f1/f3 rows were picked from continuous photographs.
- **No Safari or iOS; WebKit is headless Playwright** (M19). Hover and stickiness on a real device weren't read. G9's painted half is chromium hasTouch only.
- **Grid G4 is RED on main in both arms** (decode-late `<image>`). The digits are green. The chromium PRM grid is 1–4 frames late on both trees.
- **G6 chromium hand-off is 1.00/1.44** against ≤ 0.5. The raster union area (±2 %) was not measured.
- **G7 R residue:** 2 of 34 flips (WebKit under the injector) at 1.0058 and 1.012. The backstop-at-first-rAF cure is not built.
- **G13 dS RED both arms.** The step-off-curve read was not computed.
- **Not built:** the `@toggle-beats` table and `lint:verbs` rule 8, the LADDER publisher (these tokens are mirrored literals checked by the vitest, not published), `check-property-block` C1–C6, and the undefined-token census. None of these exist on main.
- **Re-press after the flip completed** (a reversal mid-dusk): K v1 read digits at 1.0–1.7 for up to 8 frames (chromium, n = 2). Not re-read on v5.
- **v5 is measured on chromium painted and on the computed matrix only.** The WebKit painted read was never available (no screencast). Its computed digits hold at 4.24–5.49, 0 frames.
- **Not run:** the full-width re-press battery (GA9 "0 style writes over three still frames" was read once per flip, with 2 'n' out of ~100 where a rest-stack beat write landed in the 3 frames), goldens, 1440/landscape, gallery, forced colours, the painted G1 read (G1 is rAF only; the crops agree), and the draw-in and favicon censuses (neither surface is touched: `public/favicon.svg` and the draw-in path are unchanged, and π reads 0 moved at rest).
- **No-preference only:** the hinge is `@media (prefers-reduced-motion: no-preference)`. Under PRM, ink and paper snap together by design.

## 7 · Hygiene

- Ports 4255 (the prototype) and 4256 (the control) on 127.0.0.1 with `--strictPort`. Both were killed by their recorded PIDs and read free afterwards. 3000/3001 and 4230–4249 were untouched.
- Private vite cacheDir `.vite-cache-gtoggle`. `node_modules` and `csp-solver/wasm/pkg` are symlinked from main.
- No `rm` of any kind (scratch moved to `.gt/trash-gtoggle-*`). No git writes. No npm install. No main-tree write.
- Scratch lives in the worktree's `.gt/` (raw per-frame runs and screencast PNGs), and the built dists are under `web/frontend/dist-*`. None of it is banked here, and none of it could be deleted under the no-`rm` law. `instruments/` holds the scripts.
