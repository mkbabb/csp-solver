# ACC-FIVE — pass-2 PROTOTYPE (it runs)

Five crayons, no sixth. Built, served and measured on the real surface, both engines.

- Worktree `.claude/worktrees/wf_8630d340-e56-41`, branch `worktree-wf_8630d340-e56-41`, HEAD `a8fee1f5`.
- Diff: 7 product files, +310 / −83. Nothing committed (chair §7); the agglomerator reads
  `git -C <worktree> diff --stat`.
- Server: `npx vite --config lane/vite.lane.mjs --host 127.0.0.1 --port 4236 --strictPort`,
  private `cacheDir`. Preview for the dist gates on **4239** (4237 and 4238 were taken by
  sibling lanes). Both killed; see §9.
- Readings: `readings/*.json`. Probes: `probe/`. Crops: `frames/` (four, 106 KB total).

---

## 1 · The replay carried

`pass1/prototype/ACC-FIVE/proto/acc-five-proto.diff` applied `--3way` CLEAN on all seven files
(HEAD had moved by docs only). Three hunks were then backed out, as the plan directed:

| struck | why | now |
|---|---|---|
| `gridPaths.ts` `FRAME_Y_PAD 0 → 12` | chair §6.2 — FRAME_PAD is its own row | back to `0`, with the ruling cited in the comment |
| `--color-blue-ink` (both themes) + the dark `--color-focus-sketch` arm | T5-W2 2.3 (third name); chair §6.1 (§6 owns the ring) | the hex lands on `--color-user-ink` directly; the light focus-ring comment now says the dark arm does **not** exist rather than claiming it does |
| `headingClass()` retirement in `GameControlPanel.vue` | §1/§10's row | restored to HEAD verbatim (call sites too) |

Everything else replayed and stands: the two ink tokens, the gold-law amendment, the violet
ledger's death, the `--sparkle-glow-*` pair, the glyph fallback's death, the print and
forced-colours arms, the `.solve-success` opacity→stroke swap, the guard's red verb.

---

## 2 · THE SECTION FINDING IS WRONG, AND THE CURE IS DIFFERENT

This is the largest thing the prototype has to report.

The synthesis (§1) ruled that the fill gauge reads 92% at a quarter in WebKit **because of
`pathLength`**, and that dropping it and dashing in real user units is the cure. Built, that is
false. `readings/dash-live.json` — no `pathLength` attribute anywhere, dash in real units:

| p | chromium | webkit | webkit runs |
|---|---|---|---|
| 0.05 | 0.054 | **0.215** | 4 |
| 0.25 | 0.254 | **0.970** | 5 |
| 0.50 | 0.505 | **0.985** | 2 |

`dash-discriminate.json` then separated the candidates on the same live element: **A** attribute
dash, **B** CSS dash, **C** period exactly the path length, **D** CSS dash with offset 0. All
four read `4 runs / 0.215` in WebKit at p = 0.05 and `0.985` at p = 0.25. The spelling is not the
bound, and neither is a period longer than the path.

`dash-why.json` / `dash-why2.json` found it. Removing the three inactive poses changes nothing
(`solo` = 4 runs). A plain four-corner rect dashes correctly (`rect4`, 3 segments → 1 run,
0.051). Decimating the pose walks it back, and a perfectly STRAIGHT 599-segment rectangle breaks
identically:

| path | `L` segments | chromium | webkit |
|---|---|---|---|
| `rect4` | 3 | 1 run 0.051 | 1 run 0.051 |
| `dense` (straight, subdivided) | 599 | 1 run 0.051 | **5 runs 0.258** |
| `poseFull` (the shipped pose) | 492 | 1 run 0.052 | **4 runs 0.206** |
| `poseEvery4` | 123 | 1 run 0.052 | 1 run 0.052 |
| `poseEvery16` | 30 | 1 run 0.052 | 1 run 0.052 |

**THE LAW, re-bounded: WebKit restarts a polyline's dash phase roughly every 128 segments
(492 → 4 restarts, 599 → 5, 123 → 1); Chromium dashes the path whole.** It has nothing to do
with `pathLength`, with where the dash is spelled, or with the wobble. A hand-drawn ring is
~490 segments by construction, so every dashed hand-drawn gauge in this estate is inside the
defect and no amount of re-spelling gets it out.

### The cure this lane shipped instead

The dash is **deleted**. `poseFronts(frames, fraction)` (`gridPaths.ts`, beside `poseLengths`)
cuts each pose at its own arc-length fraction with the final point interpolated, and the path
simply ENDS where the work has got to. No dash pattern exists for an engine to restart, and it
cannot regress when a board size or a grain setting moves the segment count past somebody's
chunk boundary. It is also strictly less code than the dash it replaces: `pathLength`,
`stroke-dasharray`, `strokeDashoffset`, one `transition` term and one MOTION constant all die.

`readings/front-live.json`, the same four points, after:

| p | dpr | chromium | webkit | Δ points | runs |
|---|---|---|---|---|---|
| 0.05 | 1 | 0.087 | 0.087 | 0.00 | 1 / 1 |
| 0.25 | 1 | 0.285 | 0.286 | 0.10 | 1 / 1 |
| 0.50 | 1 | 0.532 | 0.533 | 0.10 | 1 / 1 |
| 1.00 | 1 | 1.000 | 1.000 | 0.00 | 1 / 1 |
| 0.05 | 3 | 0.076 | 0.076 | 0.00 | 1 / 1 |
| 0.25 | 3 | 0.275 | 0.275 | 0.00 | 1 / 1 |
| 0.50 | 3 | 0.526 | 0.526 | 0.00 | 1 / 1 |
| 1.00 | 3 | 1.000 | 1.000 | 0.00 | 1 / 1 |

(The share runs a few points above p because an 8-unit stroke with round caps inks a little past
the cut at the sampling tolerance; both engines are inflated identically, which is the point.)

`readings/front-app.json` — the app's own fills, `aria-valuenow` read off the product, dpr 1:

| valuenow | chromium | webkit | Δ points |
|---|---|---|---|
| 5 | 0.053 | 0.053 | 0.00 |
| 30 | 0.303 | 0.304 | 0.10 |
| 80 | 0.805 | 0.806 | 0.10 |
| 100 | 1.000 | 1.000 | 0.00 |

**THE PRICE, DECLARED.** `stroke-dashoffset` was tweenable; a truncated `d` is not (`d`
interpolation is not portable). The fill front now STEPS on each fill event instead of easing
240 ms into place, and `MOTION.traceFillMs` is retired with the dash — a motion band spent, not
merely moved. One digit of 81 advances the front ~31 px. `traceWinMs` (500) stays and still
carries the stroke lift. This is the owner's to dispose (U-10) and MOT-LADDER's to seat.

---

## 3 · The gates, measured

| gate | verdict | the numbers |
|---|---|---|
| **G0** dash bound | **GREEN** (on the re-cut cure) | §2 above: ≤0.10 points across engines at every p, both dpr, 1 run everywhere. The `app` arm at dpr3 is an INSTRUMENT gap, §5. |
| **G1** kinship | **GREEN** | `instruments/hue-census.COPY.mjs` on the prototype: user-ink 251.2 light / 249.4 dark vs crayon-blue 251.4 / 249.3 → Δ 0.2 / 0.1. progress-ink 83.4 / 95.8 vs crayon-gold 83.7 / 95.2 → Δ 0.3 / 0.6. All inside KIN_DEG 5 (HEAD: 11.5° and 41.3°). |
| **G2** the win | **GREEN, all four cells** | band median chromatic L: light 0.588 → 0.692 (ΔL **+0.104**), dark 0.540 → 0.832/0.833 (**+0.292/+0.293**); floor 0.09. Post-win computed stroke resolves through the cascade to `rgb(201,154,46)` = `#c99a2e` light and `rgb(229,199,77)` = `#e5c74d` dark — `--color-gold-star` exactly, at 900/1800/2700/3600/5000 ms. **The LAYERED ablation arm reads ΔL 0.000** and holds `rgb(164,121,3)` / `rgb(125,105,2)`; the UNLAYERED arm is byte-identical to `live` in all four cells, which confirms on the real surface that pass 1's banked ablation was a no-op. |
| **G3** print / forced | **GREEN** | trace `rgb(0,0,0)` under print and under forced colours, BEFORE and AFTER the win, both engines (8 cells). The glyph's arms print black with it. |
| **G4** the verb | **GREEN** | armed ribbon reached in all four cells (subject count ≥1). Painted word on the ground it wears: chromium light 4.917 rest / 4.693 hovered; chromium dark 6.392 / 5.078; webkit light 4.917 / 4.693; webkit dark 6.322 / 5.023. Chroma 0.198–0.200. Box = `currentColor`, same ink. Floor 4.5. |
| **G5** the digit | **GREEN dark, NOT READ light** | dark painted core h 249.8 / 249.6 (Δ 0.38 / 0.17 from crayon-blue), computed stroke `rgb(71,167,255)` = `#47a7ff` exactly, painted-peak ratio 7.02 card / 7.17 bg against the token's 7.341 / 7.501 (a 2-px pen's peak pixel is partly blended — see §5). The LIGHT cells returned null: the probe's `.sudoku-cell .glyph-svg path` picks a GIVEN, which is achromatic. Instrument gap, §5. |
| **G6** the glow | **GREEN** | computed filter `drop-shadow(color(srgb 0.788235 0.603922 0.180392 / 0.3) 0 0 2px)` = **rgb(201,154,46) = `#c99a2e` = crayon-gold**, alpha 0.3, identical in 5/5 chromium runs. `transition: filter 0.2s cubic-bezier(0.4,0,0.2,1)` — the `all` is gone. (`byteMatch` printed `null`: my parser reads `rgba(...)` and the engine returned `color(srgb …)`. Matched by hand; instrument gap, §5.) |
| **G7** no stock hex | **GREEN** | `#2563eb` / `#60a5fa` / `#8b5cf6` / `rgba(196,181,253` — 0 occurrences in `index.css` and `HandwrittenGlyph.vue`, and 0 in the built dist. `#7c3aed` appears exactly once, `--color-solver-ink-2` (the rainbow's declared exception). |
| **G8** alias law | **GREEN** | `--color-blue-ink` is gone. The only `--color-*: var(--color-*)` rows left are `teacher-red`, `gold-star` (the two the estate declares), `pencil-graphite` (pre-existing, real consumers) and the four `.dark` ink→wax collapses (theme arms with consumers). No token whose only consumer is another token. `npm run lint:theme-tokens` green; 0 unreferenced of 54. |
| **G9** paired census | **GREEN** | DECLARED TERM (outside 40–115° excluding the 240–270° bin), whole viewport, painted: light **2.99%** chromium / **3.18%** webkit; dark **4.66%** / **4.86%**. Ceiling 12%. Blue bin reported beside: 3.13 / 2.91 light, 4.04 / 4.06 dark. No deal needed. The violet bins that blew HEAD's census are gone (280–300° now reads single-digit pixel counts). |
| **G10** guards | **GREEN except one arm** | filter census on the **built worktree dist**: 12/12, both engines (G3.1 exact budget + area, G3.3 coarse, G3.5 hover board + picker, G3.2 retained fills + source allowlist). Goldens 4/4 including `grid-corner-light` (pads at HEAD). `check-golden-bytes` green. `check-font-coverage` unchanged. `check-copy-register` 0 unadmitted. `check-ink-pressure`, `check-live-regions`, `check-theme-selectors`, `lint:motion` green. vue-tsc `-b` clean; eslint clean. Unit battery **66 files / 810 tests, all passing**. The ONE arm not green: the painted 1.4.11 ratios — §4. |

---

## 4 · The 1.4.11 ratios: the ledger holds on tokens, the band read is contaminated

Token arithmetic reproduces the synthesis ledger to three places:

| theme | opaque vs grid-line | @.95 vs grid-line | opaque vs card | @.95 vs card | worst-of-four |
|---|---|---|---|---|---|
| light `#a47903` | 3.830 | 3.604 | 3.882 | 3.582 | **3.582** (spec 3.57) |
| dark `#7d6902` | 3.457 | 3.229 | 3.469 | 3.262 | **3.229** (spec 3.18) |

Also confirmed: digit light 5.065 card / 4.945 bg, dark 7.341 / 7.501 — the spec's figures
exactly; post-win gold-star vs light card **2.533**, the number booked for the owner.

The PAINTED band read does not agree, and I do not claim it as a product failure because the
instrument is not clean. `board-ink.json`, 22 × 246 band:

| theme / engine | trace core painted | vs painted line | vs painted card |
|---|---|---|---|
| light chromium | rgb(158,117,5) h 83.7 | **3.098** | 4.028 |
| light webkit | rgb(152,120,21) h 88.7 | **2.841** | 4.003 |
| dark chromium | rgb(127,115,28) h 101.1 | **2.705** | 3.979 |
| dark webkit | rgb(128,115,27) h 100.5 | **2.694** | 3.993 |

The trace's own 5-px stroke sits ON the 1-px frame line inside a 22-px band, so the pixel my
probe calls "the frame line" (the achromatic pixel furthest in luminance from the card) is
itself part trace, part line, part card: light reads (49,49,49) where the token is (38,38,38),
dark reads (192,195,194) where the token is (209,207,199). Contrast against a contaminated
ground is a contaminated number. **Unresolved, and it is the one real hole in this family's
central claim** — the dark arm would be under the 3:1 floor if the painted reading were
trustworthy, and nobody has yet measured it in a way that is. The fix is an instrument, not a
token: sample the frame line on a board edge the trace has not reached yet (progress < 1) and
the stroke core at the far side of an 8-unit run. Named as a gap, not papered over.

The band's left inset read **8 px**, not the 2.78 px the brief expected. That number is also
not isolated — my scan takes the first chromatic pixel in the band, and the unit wash is
chromatic too. Reported as measured, believed to be the instrument.

---

## 5 · Instruments — r0 rows MOVED, and this lane's own defects

Proposals live in `instruments/`; nothing under `loop/r0/` or `loop/pass1/` was written.

1. **`hue-census.mjs` → `instruments/hue-census.COPY.mjs` — r0 row MOVED.** Re-pointed
   (`ACC_FIVE_CSS`, which throws rather than defaulting into the record) and the dark-slice
   defect fixed: `src.slice(darkAt)` ran to EOF and swallowed the `@media print` arm, so any
   token redeclared under print printed as the dark arm. PRE-EXISTING; fires at HEAD. The
   research lane's alias-resolution hunk is now MOOT — this family collapsed `--color-blue-ink`,
   so there is no alias for a hex scanner to miss. Run on the prototype; output in §3 G1.
2. **`handoff-ablate.mjs` — r0/pass-1 row MOVED, and now proven.** The banked arm injects its
   ablation UNLAYERED, and for `!important` declarations layer order inverts (unlayered counts
   last), so it loses to the win rule in `@layer utilities` and the injection is a no-op. My
   `board-ink.mjs` carries all three arms: `unlayered` is byte-identical to `live` in 4/4 cells
   (ΔL 0.104 light, 0.292 dark — the same as no ablation at all), `layered` (into `@layer base`)
   reads **ΔL 0.000**. The critique's banked "ablated" numbers were its `before` row.
3. **`dash-law.mjs` — NEW MOVED row, and the most consequential.** The research instrument's
   stated law ("under `pathLength`, WebKit mis-scales an attribute-declared dash by
   `totalLength/pathLength` = 3.966") is falsified: the 3.966 was a coincidence of this ring's
   perimeter, and the real factor is the ~128-segment chunk (§2). The instrument must assert
   over SEGMENT COUNT, not over `pathLength`, or it will green a tree that is still broken.
   `probe/dash-discriminate.mjs` and `probe/dash-why2.mjs` are the re-cut; both are kept with
   all arms so the trap stays visible.
4. **This lane's own instrument defects, named:**
   - `front-live.mjs`'s `app` arm restored the full `d` by hand and Vue never re-rendered, so
     every checkpoint read a full ring. Re-cut as `front-app.mjs`, which never touches the DOM.
   - `front-app.mjs` at **dpr3** samples the IDEAL rect ring against a wobbled stroke; at 3× the
     ±3-device-px window drifts off the ink and both engines fragment (chromium 6 runs, webkit
     5, shares still agreeing at 0.753 / 0.753). The dpr3 rows are noise, not product; the
     forced arm, which samples the pose's own geometry, is clean at both dpr.
   - `confirm-glow.mjs` first armed the ribbon with a board input focused, so `g` went into a
     cell and the gate would have greened by absence. Blur-first plus the research lane's route
     fixed it; the subject-count guard is what caught it.
   - the glow's `byteMatch` parser reads `rgba(...)` only; the engine returns `color(srgb …)`.
     Matched by hand this pass; the parser is a one-line fix for whoever seats the gate.

---

## 6 · What the diff is

7 product files, +310 / −83.

1. `pencilConfig.ts` — `traceWinMs: 500` born; **`traceFillMs` never lands** (§2).
2. `gridPaths.ts` — `poseLengths` and `poseFronts` exported beside `generateFrameTraceFrames`,
   with the measured law in the doc comment; `FRAME_Y_PAD` stays `0` and cites chair §6.2.
3. `index.css` — `--color-user-ink` `#026fc4` / `#47a7ff` (no alias tier); `--color-progress-ink`
   `#a47903` / `#7d6902`; `--sparkle-glow-soft/-strong`; the gold law amended to two moments;
   the violet ledger dead; `.solve-success .progress-trace` opacity → stroke; print and
   forced-colours arms for the trace.
4. `HandDrawnGrid.vue` — `pathLength` and both dashes gone, fronts from `poseFronts` on both the
   fill gauge and the join ring, the win transition on `stroke` alone, the `solveSuccess` prop
   comment and the `.join-pose` rationale re-cut (index 2 at 275° is 168° from gold now; the
   0.984 and the 17.7° stand, their subject moved).
5. `HandwrittenGlyph.vue` — the `#2563eb` fallback dies.
6. `GameControlPanel.vue` — the sparkle's two tokens and `transition: filter` (the `headingClass`
   retirement is NOT here).
7. `GameGallery.vue` — the verb and its drawn box in `--color-red-ink`, **no ground at all**, the
   compound hover selector inside `@media (hover: hover)`, the "plus the 8% ground" clause gone.

---

## 7 · Hand-offs (unchanged from the spec, plus one)

- the five reserved arcs + the 40-index sweep → **PAL-TIN**
- the mark's live colour (`--color-user-ink` read at the ROOT) → **PLR-SELF**
- `DifficultyTally.vue:230-232` — still `pathLength="100"`, and its dash is CSS-declared on a
  100-segment arc, so it is BELOW the 128 threshold and not currently broken. It should still
  take `poseFronts` when §10 lands it, because the threshold is not a contract.
- the heading tint → **§10**; the focus-ring dark arm → **§6**
- **NEW: the dash law itself.** Every dashed hand-drawn gauge in the estate is inside the
  defect. `poseFronts` is the primitive; seat it once.
- **NEW: `MOTION.traceFillMs` is spent.** MOT-LADDER and the owner dispose.

## 8 · What the owner disposes (U-10)

1. The dark pen: `#47a7ff` shipped (7.34 on card, painted peak 7.02). Crop 2.
2. A gold stripe at the first digit — gold spent early? Crop 1, panel 1 (valuenow 5).
3. The post-win trace at **2.533:1** on the light card: exempt, or hold the post-win stroke at
   the ink tier under `prefers-contrast: more`?
4. **The fill front no longer eases.** It steps ~31 px per digit. Live with it, or pay for a
   tween some other way?

## 9 · Housekeeping

Servers on 4236 (dev) and 4239 (preview) killed and the ports verified free before return.
`lane/` is untracked scratch (probes, configs, node_modules symlink) and `.vite-cache/` is the
lane's private optimized-deps dir; neither is product. Nothing committed. No osascript, no
Safari. Four crops, 106 KB; the family's whole evidence dir is 304 KB.
