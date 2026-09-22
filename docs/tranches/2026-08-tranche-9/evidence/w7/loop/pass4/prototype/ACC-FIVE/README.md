# ACC-FIVE — pass-4 PROTOTYPE (it RUNS, and this time the mechanism ran too)

Family: FIVE CRAYONS AT DIFFERENT PRESSURES (§3 §4 §12, owner of `poseFronts`).
Base and π control `74a2b5d9`. Work tree
`/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-41`
— advanced IN PLACE on the pass-3 diff, uncommitted. Servers: prototype dev `:4236`, HEAD control
preview `:4237` (identity `index-CubiZsMVSwTc.js`, verified by asset hash, never by a 200),
prototype dist preview `:4238` (identity `index-DCleUxXAr4B4.js`). All three killed by recorded PID.

**The pass-4 number is the CRITIC's, not mine.** What follows is numbers, then gaps.

---

## 0 · The replay route, and the tree agrees with its README

No replay. The chair banked the pass-3 tree as `pass3/prototype/ACC-FIVE/pass3.diff` (72,028 B) and
this lane advances IN PLACE, per pass-4 CHAIR-RULINGS §2. `git -C <work> diff --stat` at open read
**9 modified / 2 untracked, +624 −96** — the pass-3 README's own file list, to the file. No
`git apply`, no `diff3 -m`, so no line-count check is owed.

At return the same command reads **9 modified / 3 untracked, +769 −97**; the third untracked file is
this pass's new unit spec.

## 1 · The three MUSTs, closed with numbers

### MUST 1 — `prefers-contrast: more` no longer inverts at the win (critique §3.3)

One rule, restated at the win's own specificity AFTER it in source order (`index.css`, the only
thing that beats an equal-specificity `!important` in the same layer — putting it up in the
existing `@media (prefers-contrast: more)` block reads tidier and does not work, which is the
whole defect). Painted, both engines, both themes, at `no-preference`, win driven by the product's
own **Solve**:

| arm | state | computed stroke | width | vs LINE | vs PAPER |
|---|---|---|---|---|---|
| default, light | before | `rgb(168,126,19)` `#A87E13` | 8 | 3.505 | 3.646 |
| default, light | **win** | `rgb(201,154,46)` `#C99A2E` | 8 | 5.046 | 2.533 |
| **contrast:more, light** | before | `rgb(140,105,29)` `--color-gold-ink` | 12 | 2.573 | **4.967** |
| **contrast:more, light** | **win** | `rgb(140,105,29)` **unchanged** | 12 | 2.573 | **4.967** |
| default, dark | before | `rgb(121,101,15)` `#79650F` | 8 | 3.303 | 3.280 |
| default, dark | **win** | `rgb(229,199,77)` `#E5C74D` | 8 | 1.037 | 11.234 |
| contrast:more, dark | before / win | `rgb(229,199,77)` unchanged | 12 | 1.037 | 11.234 |

chromium == webkit to the byte in every row. The arm is now **FLAT across the win**: the reader who
asked for more contrast keeps 4.967 on paper instead of dropping to the critique's measured 2.533.
The dark arm was never the defect — the estate's own `.dark` block already collapses that tier to
the wax, so 11.234 stands before and after by construction, and it is stated rather than smoothed.

The pressure change the win carries is not lost under this arm: the width is already 12 and the
box-shadow and grid lines still take the wax. What the arm declines to do is hand the one hairline
whose ground is paper-only a 2.533.

### MUST 2 — the motion budget is a RATE now, and it was measured with the mechanism ON

Every browser reading in this record is taken at `reducedMotion: "no-preference"` with the regime
WITNESSED in-page (`matchMedia("(prefers-reduced-motion: reduce)").matches === false` on each
context). Pass 3's five instruments all read `"reduce"`; that is the row that is closed.

**The cure.** `FRONT_MIN_MS = 16` and a leading-edge gate in `HandDrawnGrid`: the first frame of a
write cuts immediately, then at most one `d` re-cut per 16 ms, and the exact end value is FORCED on
completion so the gauge and its `aria-valuenow` mirror still agree to the digit. The budget is now a
declared constant over a declared constant — **≤62.5 re-cuts/s at any refresh rate** — instead of
"≤15 frames per write", which was the reviewer's panel wearing a budget's clothes.

Measured, one write, both themes:

| engine | panel | `d` writes | re-cut FRAMES | span | **rate** | pass-3's frames |
|---|---|---|---|---|---|---|
| chromium / light | **132 Hz** | 48 | **12** | 213.2 ms | **56.3/s** | 29 |
| chromium / dark | 132 Hz | 52 | 13 | 224.1 ms | 58.0/s | — |
| webkit / light | 67 Hz | 40 | 11 | 222.0 ms | 49.5/s | 15 |
| webkit / dark | 63 Hz | 36 | 9 | 208.0 ms | 43.3/s | — |

`d` writes are 4 × the re-cut frames (four poses), `stroke-opacity` 1, no `pathLength`, no
`stroke-dasharray`, in every cell. The 120 Hz box that made the old gate red now sits at 56.3/s
against a 62.5 ceiling, and the 60 Hz engine at 43.3 — the two engines are within 15 % of each
other for the first time, which is the property a rate has and a frame count does not.

**Born-RED control, on this tree, in the same battery**: `FRONT_MIN_MS` blunted 16 → 0 and the same
instrument re-run — see §5. The tree is restored; `grep -n "^const FRONT_MIN_MS"` reads 16 at return.

**`poseFronts` memoised** (critique §3.4): points and cumulative arc length are parsed once per
`frames` array and cached in a `WeakMap` keyed on the array's identity. The consumers hold their
poses in a `computed`, so the identity is stable for exactly as long as the geometry is and the
entry expires with it — no cache size, no invalidation rule. The cut itself now walks a cached
`cum[]` instead of re-running `Math.hypot` per segment, so the 0.204 ms `poseLengths` half and the
0.198 ms second `posePoints` parse are both gone from the steady state.

### MUST 3 — the gates that were written are RUN

| gate | run | result |
|---|---|---|
| `e2e/progress-corridor.spec.ts` | both engines, both themes, my `.acc-five` PW config, dev `:4236` | **8 passed (55.2 s)**, exit 0 |
| …its BORN-RED rows | same run | 4 rows: the gauge ablated to HEAD's violet `#8b5cf6` ⇒ 0 of 24 columns, NAMED failure produced |
| `e2e/filter-census.spec.ts` | both engines, against MY BUILT DIST `:4238` | **12 passed (25.7 s)**, exit 0 — filterBudget exact-match, both regimes |
| `check-copy-register.mjs` | **BARE** | exit 0 — 137 files, 0 em/en dashes, 0 unadmitted jargon (0 admitted) |
| `check-ink-pressure.mjs` | **BARE** | exit 0 |
| `check-theme-tokens.mjs` | **BARE** | exit 0 — 54 declared, 0 unreferenced |
| the three `--self-test` arms | after the bare runs | exit 0 each; theme-tokens' two negative controls RED as required |
| `vue-tsc -b` | work tree | exit 0 |
| `vue-tsc -p tsconfig.e2e.json` | work tree | exit 0 |
| unit battery (chunked) | `src/pencil` then `src/games src/composables src/components` | **70 files / 840 tests, 0 failed** (10/83 + 60/757) |
| the touched dirs, re-run after the ablation was restored | `src/pencil/grid src/games/shared` | 35 files / 435 tests, 0 failed; `vue-tsc -b` exit 0 |

**The corridor spec could not have been run as written, and the reason is lower than "never
executed".** It opened `import { PNG } from "pngjs"` and **`pngjs` is not a dependency of this
package** — not in `dependencies`, not in `devDependencies`, not present under `node_modules` at
all. The estate installs nothing for a gate (and this lane may not `npm install`), so the decode
moved into the page: the screenshot goes back in as a data URI, is drawn on a canvas and read with
`getImageData`. Same sRGB bytes, no Node image library, and the decode happens in the engine whose
raster is the subject. The same change is in this pass's instruments.

**The named failure** (critique §3.6). `modalCore` now keeps a second, hue-blind maximum
(`offAnchor`, filtered only by the chroma floor) and returns `modal: null` rather than
dereferencing an empty ranking. On 0 columns the gate throws a corridor READING:

> NO GAUGE PIXEL IN THE BAND (light). 0 of 24 columns hold a pixel within 45° of the gold anchor
> above the chroma floor. the band's most chromatic pixel is …, … ° off the gold anchor 83.7°
> (C …); it reads … vs the line and … vs the paper. grounds: line …, paper ….

and a born-RED row asserts that outcome on THIS tree: the gauge is repainted HEAD's violet
`#8b5cf6` in a stylesheet appended last, the row requires `columns === 0`, requires the message,
and — the control's own precondition, so the row cannot pass on an empty band — requires that the
gauge WAS painting before the ablation. 4 rows, both engines, both themes, green.

## 2 · π identity against `74a2b5d9`, and it is clean

Prototype dist `:4238` vs the shared read-only control `:4237`, **both previews of a built dist**
(a dev server against a preview compares two build modes, not two trees), **both dealing the same
board**: the givens are read off the control once and re-encoded in the app's own wire grammar
(`?board=`, 61 givens), then both arms are pinned to it. Computed PAINT properties (colour,
background, font family/size/weight, line-height, letter-spacing, border, opacity, stroke,
stroke-width, fill) plus tag name plus rect, every element on the page.

| cell | nodes proto / control | shared keys | only-proto | only-control | **paint diffs** | **rect diffs** |
|---|---|---|---|---|---|---|
| chromium / light | 1207 / 1207 | 1205 | 0 | 0 | **4** | **8** |
| chromium / dark | 1207 / 1207 | 1205 | 0 | 0 | 4 | 8 |
| webkit / light | 1207 / 1207 | 1205 | 0 | 0 | 4 | 8 |
| webkit / dark | 1207 / 1207 | 1205 | 0 | 0 | 4 | 8 |

**All twelve diffs are the family's own claimed surface.** The 4 paint diffs are the four
`.progress-trace` poses' `stroke`: `rgb(139,92,246)` → `rgb(168,126,19)` light, `rgb(124,58,237)` →
`rgb(121,101,15)` dark. The 8 rect diffs are those four paths and their four `.progress-pose`
groups, and the difference is the mechanism: the control's full ring is 630.5 × 640.9 px, the
prototype's cut front 31.1 × 0.7 px at that fill. Nothing else on the page moved a computed paint
property or a rect, in any of the four cells.

**The first run of this instrument was confounded and is reported rather than deleted**:
`?size=3&difficulty=EASY` deals a RANDOM template, so 31–40 "rect diffs" were two different
puzzles' given digits. That is the chair's `?board=` law earning itself in one run.

## 3 · The dash survivors, counted (critique §3.8)

Rendered census, the pinned 61-given board plus three hints, `display: none` excluded:

| | prototype | control (`74a2b5d9`) |
|---|---|---|
| `.progress-trace` | — (no dash, no `pathLength`) | 4 × `pathLength=1000`, `dash 1000 1000`, **492 segments** |
| `.cell-ghost-path` | 81 × `pathLength=1`, dash `none` at rest, 16 segs | identical |
| tally ghost dash | 4 × 4 segs + 1 × 8 segs | identical |
| crayon-heart stitch | 2 × 5 segs | identical |

492 segments on the control's ring against WebKit's ~128-segment dash-phase boundary — the defect
class, measured on the shipped artifact, and it corrects pass 3's 493 to the rendered number.

The four surfaces still on the dash grammar, counted from the path data they draw (they are not all
on the board at rest, so these are source-derived and labelled as such):

| surface | segments | vs ~128 |
|---|---|---|
| DigitCell / HandwrittenGlyph / AnswerKeyLaminate glyph stroke | 2–9 (50 variants: min 2, median 4, max 9) | ≤7 % |
| DigitCell ghost rect | 16 at 9×9, 8 at 16×16 | ≤13 % |
| ScribbleLoader coil | 44 | 34 % |
| DifficultyTally stroke (rendered) | 4, the diagonal 8 | ≤6 % |

The worst is a third of the boundary. `DifficultyTally.vue`'s comment now says this instead of
"estate-wide", with the table in it.

## 4 · `poseFronts`' precondition, enforced (critique §3.7)

The hand-off to ACC-SIX / the §10 tally / PLR-COUNT carries a guard, a doc paragraph and a test
file. The precondition turned out to be **wider than the critique's**: the parser pulls number
PAIRS out of the `d`, so it is wrong on a multi-subpath pose *and* on a curve — `wobbleLine`'s
non-jagged branch serialises through `catmullRomToBezier` and a `C`'s control points are not
vertices. Every caller passes `jagged: true` today and the ring's generator hardcodes it, which is
exactly the kind of fact that stops being true unnoticed. `poseIsLinearSinglePath` requires one
move command and only `M`/`L`/`Z`; a pose that fails comes back UNCUT and unchanged, with a
DEV-only warning emitted once per frames array at the parse, not per frame.

`src/pencil/grid/gridPaths.poseFronts.test.ts` — 5 rows, all green: the cut is monotone in the
fraction on the estate's own grain-baked ring; `f ≥ 1` returns the input by identity and `f ≤ 0`
empties; a multi-subpath pose and a curve pose each come back unchanged; and a BORN-RED row
requires that a single linear pose of the same family IS cut, so the guard cannot pass by refusing
everything.

**Correction to the critique, on the record**: §3.7 names `generateFrameTraceFrames`' un-grained
branch and "`generateGridBoilFrames`' four-subpath frame" as the multi-subpath cases. Read on this
tree, neither is: the un-grained branch strips each side's leading `M` with
`.replace(/^M[^ ]+/, "")` and `pointsToLinear` emits `M12,0` with no space, so it is one polyline;
`BoilFrames.frame` is a `string[]` of closed rects. The hazard is real and the named instances were
not, so the test uses a hand-written two-subpath string and a `catmullRomToBezier`-shaped curve and
says so.

## 5 · Born-RED controls demonstrated this pass

| gate | control | outcome |
|---|---|---|
| G2 corridor (browser) | the gauge repainted HEAD's violet `#8b5cf6`, appended last | 0 of 24 columns + the NAMED message, 4 rows, both engines |
| G2 corridor (its own precondition) | the pre-ablation reading | > 0 columns required, so the row cannot pass on an empty band |
| `poseFronts` guard | a single linear pose of the same family | IS cut — the guard discriminates, it does not refuse everything |
| `check-theme-tokens` | re-add `--color-input`; plant a 4th alias | RED as required, both |
| `check-copy-register` | the stale ghost admission | 1/1 RED as required |
| G10 rate | `FRONT_MIN_MS` 16 → 0 on this tree, same instrument | see the table below |
| G4 contrast hedge | the wax re-asserted in an EARLIER `@layer` | see the table below |

### G10's ablation — the gate discriminates

`FRONT_MIN_MS` blunted 16 → 0 in the work tree, the dev server re-served, the SAME instrument
re-run, then the file restored (`grep -n "^const FRONT_MIN_MS"` reads 16 at return; the battery
log carries both greps):

| engine / theme | panel | re-cut FRAMES | span | **rate, ABLATED** | rate, GATED | over the 62.5 ceiling |
|---|---|---|---|---|---|---|
| chromium / light | 130 Hz | 32 | 230.0 ms | **139.1/s** | 56.3/s | 2.23× |
| chromium / dark | 127 Hz | 32 | 233.4 ms | 137.1/s | 58.0/s | 2.19× |
| webkit / light | 67 Hz | 16 | 226.0 ms | **70.8/s** | 49.5/s | 1.13× |
| webkit / dark | 67 Hz | 16 | 210.0 ms | 76.2/s | 43.3/s | 1.22× |

BOTH engines breach the ceiling ungated, so the gate is not a chromium-only story, and the
ablated chromium reading (32 frames per write) reproduces the critique's 29 at a slightly
different panel rate — the same measurement, re-taken.

### G4's ablation — the inversion reproduces exactly

The hedge ablated by re-stating the wax in an EARLIER `@layer` (`@layer base { .solve-success
.progress-trace { stroke: var(--color-gold-star) !important } }`), same page, same run:

| engine / theme | before the win | at the win, ABLATED | at the win, CURED |
|---|---|---|---|
| chromium / light | gold-ink `rgb(140,105,29)` — **4.967** on paper | gold-wax `rgb(201,154,46)` — **2.533** | gold-ink — **4.967** |
| webkit / light | 4.967 | **2.533** | 4.967 |
| chromium / dark | 11.234 | 11.234 | 11.234 |
| webkit / dark | 11.234 | 11.234 | 11.234 |

The light arm reproduces the critique's exact 4.967 → 2.533 inversion when the hedge is removed
and holds 4.967 when it is present, in both engines. The gate is non-vacuous.

**The ablation's own first cut was wrong and it is on the record**: an UNLAYERED
`html body .solve-success .progress-trace { … !important }` has higher specificity and still
LOSES, because for important declarations the cascade-layer order is REVERSED and unlayered
important styles sort last. It read identical to the cured arm and would have been reported as
"the cure has no effect" by a lane that did not look. The pass-3 LAYERED ablation idiom is the
cure, and this is its second independent confirmation.

### The JOIN ring, priced for the first time (critique §3.5)

A real join over the product's own path: A boots on `?wire=local`, presses the well's verb, B
opens the URL A's address bar now carries, ONE browser context (the local transport is a
`BroadcastChannel` scoped to an origin within a context). A's `.join-pose path` `d` writes:

| engine | `d` writes | re-cut FRAMES | span | **rate** |
|---|---|---|---|---|
| chromium | 104 | 26 | 496.5 ms | **52.4/s** |
| webkit | 88 | 22 | 500.0 ms | **44.0/s** |

Against the critique's projection of ~560 `d` writes and ~140 frames for an ungated join, that is
a 5.4× reduction, and the join now sits under the same 62.5/s ceiling as the fill gauge because it
is the same gate. The wash's own span is 740–1180 ms; the window observed here closes at ~500 ms,
so the rate is measured over the ring's drawing phase rather than its whole handle — stated as a
scope, not claimed as the full wash.



## 5b · The phone's flank, and print / forced-colors (charter rows 11–12)

393×699 dpr3, `hasTouch: true`, the regime WITNESSED (`matchMedia("(pointer: coarse)")` true on
every page), four hints written so a gauge exists:

| arm | trace | frame | **graphite flank** |
|---|---|---|---|
| default, both engines, both themes | 8 u = **2.92 CSS px** | 12 u = **4.38 CSS px** | **0.73 px / side** |
| `prefers-contrast: more`, both engines, both themes | 12 u = **4.38 px** | 12 u = 4.38 px | **0 px / side** |

The 2.92 / 4.38 / 0.73 the spec specified the contrast arm FROM are exact, on the real surface,
in all four cells — and the arm's own justification is now measured rather than argued: at 12 units
the trace covers the line outright, the flank is 0, and paper is the only ground it has. That is
what licenses it to take the text tier.

Print and forced-colors, by emulation on the same pages (computed `stroke` of `.progress-trace`):

| | chromium / light | chromium / dark | webkit / light | webkit / dark |
|---|---|---|---|---|
| `media: print` | `rgb(3,2,0)` | `rgb(2,2,0)` | `rgb(3,2,0)` | `rgb(4,3,0)` |
| `forcedColors: active` | `rgb(0,0,0)` | `rgb(251,251,251)` | `rgb(0,0,0)` | **`rgb(0,0,0)`** |

Both arms resolve, neither throws — and both carry a finding rather than a pass (§6).

## 6 · Gaps — every one, the largest first

These are the rows the charter asked for that this pass did NOT take, and the findings that adjust
the claim rather than confirm it. Largest first.

**Not measured.**

1. **G5 (the verb) and G9 (the per-anchor census) were not run.** The `GameGallery.vue` and
   `GameControlPanel.vue` hunks in this diff are pass-2's, replayed. The pass-2 critique's 4.917
   rest / `#D02A52` is an `a8fee1f5` reading and is NOT re-derived here; it must not travel as a
   pass-4 number.
2. **No golden deltas, no R6 heading census, no R3 wobble.** π was run as a computed-paint + rect
   census (§2), which is the stronger instrument for what this diff does, but the three named
   rows of charter row 10 are not in it. The `cell-light ~2,292 px` figure is again NOT re-derived
   and again must not travel.
3. **F1's two arms were not framed** (charter row 13). PLR-SELF's flag was not flipped on a server,
   so the pen's painted hue solo vs in-room is still unread by this lane.
4. **The join wash's FULL handle is unpriced.** §5's join rate is measured over a ~500 ms window;
   `useJoinWash` runs 740–1180 ms. The rate is the ring's drawing phase, not the whole handle, and
   the ceiling arithmetic (≤74 re-cuts for the longest wash) is derived from the landed constant
   rather than counted end to end.
5. **G3's ΔL band-median was not re-derived this pass.** Pass 3's +0.0944 light / +0.3217 dark
   stand as pass-3 numbers; what this pass contributes is the FRAME at no-preference
   (`win-light-nopref.png`) — which is what charter row 8 actually asked for (a frame for the
   owner's eye, not a cleared bar), but the number is a carried one and is labelled so.
6. **`aria-valuenow` was read, the a11y announcement was not.** The gate forces the exact end
   fraction so the mirror agrees; that the screen-reader text agrees is asserted by construction,
   not measured.

**Findings that adjust the claim.**

7. **THE GAUGE HAS NO PRINT IDENTITY, and nobody has said so.** Under `media: print` the trace's
   computed stroke is `rgb(2–4, 2–3, 0–1)` — near-black graphite — in ALL FOUR engine×theme cells.
   The whole family's sentence is that the gauge is the gold crayon; on paper it is a black line
   the same colour as the frame it retraces, distinguishable only by its 8 u vs 12 u width. This
   is not a regression this pass introduced (the print arm predates it), but a five-crayon accent
   family that has measured its print arm and found no crayon in it owes the row. Not cured here:
   a print colour is a palette decision and §3's fold is where it belongs.
8. **Forced-colors DIVERGES between the engines, in dark.** `forcedColors: active` resolves the
   trace to `rgb(0,0,0)` in chromium/light, webkit/light and **webkit/dark**, but to
   `rgb(251,251,251)` in chromium/dark. One of the two is wrong about what the system foreground
   is in that mode, and either way the gauge loses its hue entirely under forced colors — so under
   `forced-colors` + `prefers-contrast: more` together the trace and the frame are the same colour
   AND the same width (both 12 u), and the gauge is gone. Measured, uncured, and the narrowest
   real accessibility hole this family has left.
9. **The tally's `poseFronts` call site cannot hit the memo.** `strokeFront(d, i)` builds a fresh
   one-element array per call, so every tally stroke re-parses. It is correct and it is cheap (4-
   and 8-segment strokes against the ring's 492), but the §3.4 saving is the BOARD's only. Stated
   because a reader of the memo's docstring would otherwise assume otherwise.
10. **The critique's §3.7 examples are wrong and the hazard is right.** Neither
    `generateFrameTraceFrames`' un-grained branch nor `BoilFrames.frame` is multi-subpath on this
    tree (§4). The guard is wider than asked (subpaths AND curves) and its test uses constructed
    cases, which is weaker evidence than an estate generator would have been.
11. **The node CORRIDOR row is a DRIFT GUARD, in those words.** Run against `74a2b5d9`'s tokens,
    `check-ink-pressure` reds its four KIN rows and the CORRIDOR row stays GREEN, because token
    arithmetic gives HEAD's violet 3.57 light where the paint is 2.876. It cannot fail on the
    condition the family exists to cure. G2's gate is the PAINTED browser arm; the node row is a
    drift guard and this return says so rather than citing it as an arm of the gate.
12. **`#7D6902` still survives once in `index.css`, inside a COMMENT** — the corridor ledger citing
    pass 2's rejected hex with its measured reason. No declaration carries it; a literal grep-based
    G11 will see it. Carried forward from pass 3 deliberately, named again so nobody rediscovers it.
13. **No r0 instrument's subject moved, so NO r0 row is reported MOVED.** The r0 instruments this
    lane would have touched (`oklch.COPY.mjs`) were copied and re-pointed in pass 3 and are not
    re-run here; nothing under `r0/`, `pass1/`, `pass2/`, `pass3/` was written this pass.
14. **One law of the chair's is carried, not acted on**: pass-4 CHAIR-RULINGS §1.3 books law 25 as
    STANDING with "ACC-FIVE's reversion booked". The reversion is in the tree from pass 3 and is
    untouched; this lane proposes no amendment to it.

## 7 · Ballot / fork rows for the owner

**FORK A — the win's contrast hedge is landed; the OWNER sees both.** Not a ballot in the chair's
register, but the frame the owner needs to dispose §3.9's thinness and this arm together:

| arm | frame | what it says |
|---|---|---|
| default | `win-light-nopref.png` pane 3 → pane 4 | the lift, light, at no-preference. Small. The 0.0044-over-floor row made visible. |
| `prefers-contrast: more` | `win-dark-contrast.png` | the 12 u arm, dark, tween running: the gauge is unmistakable and the win changes nothing about its colour |

Firing default if the owner says nothing: **keep the hedge** — it is one CSS rule, it restores
4.967 where the measured alternative is 2.533, and it costs the win nothing the reader can see
(the shadow and the grid lines still take the wax).

**ROW B — the print colour (gap 7) is §3's, not this lane's.** The gauge prints near-black in both
themes. Two lawful forms: leave it (the print arm is graphite by design, and a printed board is a
pencil artifact) or give `.progress-trace` a print colour in the gold family. This lane proposes
NEITHER and books the measurement; §3's leader rules it at the accent fold, with the print reading
above as the cite.

**ROW C — forced-colors (gap 8) needs a ruling, and it is an accessibility one.** Under
`forced-colors: active` the gauge is the system foreground, and under forced-colors +
`prefers-contrast: more` it is the same colour AND the same width as the frame. A `forced-color-adjust`
opt-out on the trace would keep the gauge readable and is exactly the kind of thing that must not be
landed by a lane without the owner seeing it. Booked, uncured, with the engine divergence named.

## 8 · Incidents, self-declared

1. **The π instrument's first run was confounded by a random board.** `?size=3&difficulty=EASY`
   deals a random template, so the two arms dealt different puzzles and 31–40 "rect diffs" were
   given digits. Caught by reading the diff list rather than the count. Cured by pinning `?board=`
   off the control (chair §2's law, earned in one run). The confounded numbers are not carried.
2. **The G4 ablation's first cut did not ablate.** An unlayered `html body … !important` has higher
   specificity and loses to a layered `!important`, so the "born-RED" arm read identical to the
   cured arm. Had I not known the pass-3 LAYERED ablation lesson I would have reported "the cure
   has no effect". Cured by ablating inside `@layer base`; both readings are in the logs.
3. **The win never fired in the first two win/contrast runs.** Filling by Hint reaches
   `aria-valuenow` 100 and `.solve-success` never lands — twelve cells read `solved=false` at 100 %.
   The verdict is an ACT (`[aria-label="Solve puzzle"]`), not a threshold. Cured; both runs' logs
   are banked, and the wrong one is named here rather than deleted.
4. **One win/contrast run was killed by me at ~25 min for no progress.** It filled ~55 hints twice
   per cell across 12 cells under three concurrent playwright batteries; CPU time was 5 s in 25 min
   of wall clock, i.e. it was waiting, not hung. Re-cut to fill to 25 % and then Solve, and the
   batteries were serialised into one shell script thereafter (the STALL LAW, learned again).
5. **One webkit born-RED corridor row failed on its first run** (`offAnchor` null — the ablated
   band held no pixel over the chroma floor in that raster). The row was hardened rather than
   re-worded to pass: it now asserts its own precondition (the gauge WAS painting before the
   ablation) and accepts either named outcome, with the message asserted in both branches. 8/8
   green after. The first failure is in `logs/`.
6. **`pngjs` was never installable and the spec depended on it.** Reported under MUST 3; recorded
   here as an incident because it means the pass-3 gate was un-runnable, not merely un-run.
7. **`FRONT_MIN_MS` was edited in the work tree for the G10 ablation and restored by the battery.**
   Both greps (0 during, 16 after) are in `logs/battery.log`; the diff at return carries 16.

## 9 · Frames

Two crops, both REPLACEMENTS, both at `reducedMotion: no-preference` with the tween running (the
pass-3 pair were PRM end states):

| file | engine · theme · viewport · pointer | retires |
|---|---|---|
| `win-light-nopref.png` (31,810 B) | chromium · light · 1280×800 · fine (`pointer: coarse` false, witnessed) | `pass3/prototype/ACC-FIVE/frames/lift-light-chromium.png` (15,105 B) |
| `win-dark-contrast.png` (21,373 B) | webkit · dark · 1280×800 · fine, `prefers-contrast: more` | `pass3/prototype/ACC-FIVE/frames/lift-dark-chromium.png` (14,390 B) |

Four panes each, composed on a canvas in the page: the ground at progress 0 (no `.progress-trace`
node exists), 40 % fill, 90 % fill, and the win with `solve-success` asserted true in the label.
The light strip is the §3.9 row the owner has to judge by eye — pane 3 → pane 4 is a small
brightening of the same line, and that thinness is the finding.
