# MOT-DERIVE · pass-1 PROTOTYPE · Distance and material

**It runs.** Worktree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-35`
(branch `worktree-wf_e58b4764-0fc-35`, from `aab67b92`), three product files, 69 insertions /
18 deletions, built and served at `127.0.0.1:4248`, measured in chromium and webkit at
390×844 dsf3 touch and 1440×900 dsf2, light and dark. Nothing is committed.

The formula stayed dead. What landed is its residue: **distance informs the record and the
audition, never the clock.** The dock gets a name for its own number; the desk changes by zero
pixels; every FLIP duration says what it was seen against.

---

## 1. The diff

| file | what |
| --- | --- |
| `pencilConfig.ts` | `drawerGlideMs: 520` (the audition comment MOVED from `useControlsDrawer.ts:83-85`, its value unmoved) · `dockGlideMs: 600` (new, with the three-candidate audition and one banked sentence) · travel lines on all four FLIP-spent `*Ms` |
| `useFlipGlide.ts` | `run(specs, durationMs = options.durationMs)`; the never-never guard re-derived from the duration the run spends |
| `useControlsDrawer.ts` | `GLIDE_MS` **dies**; the controller takes `MOTION.drawerGlideMs`; `glide()` passes `mobileDock.value ? MOTION.dockGlideMs : MOTION.drawerGlideMs` on the existing computed |

Zero CSS, zero `.vue`, zero copy, zero curves, zero new mechanics. `git -C <worktree> diff --stat`
is the whole claim.

## 2. The gates

| gate | at HEAD | on the diff |
| --- | --- | --- |
| **G-MOT-D1** i3 check B2 (WAAPI arm) | **RED, exactly one row** — `useControlsDrawer.ts:232` spends `GLIDE_MS`, declared at `:86` as the literal 520 | **GREEN** — 5 WAAPI duration sites, 5 homed (`App.vue:376`, `useControlsDrawer.ts:233`, `:331` ternary, the primitive's own parameter = plumbing, `useCarouselGlide.ts:330` via its MOTION alias) |
| **G-MOT-D2** dock-names-its-clock | **RED** — no such member exists | **GREEN** — `dockGlideMs` is distinct in name from `drawerGlideMs`, both consumed in `useControlsDrawer` |
| **G-MOT-D3** i7-travel-declared | **RED, 0 of 2** in scope (`boardFoldMs`, `cardStepMs`); the drawer's gesture is not even in scope, because its 520 is a literal — 0 of 4 counting the two the family mints | **GREEN, 4 of 4**, and every declared px/ms within 0.5% of travel ÷ duration |

i3 check A stays GREEN and check B1 (the CSS arm) stays RED at 6 durations / 8 homeless, byte-identical
at HEAD and on the diff: this family lands no CSS, and says so rather than quietly narrowing the gate.

Not gateable, said plainly: *this duration is derived correctly*. A static reader cannot see a travel.
That is `travel-per-gesture.mjs`, a probe, and it is a diagnostic, never a product constant.

## 3. The audition — one dist, three clocks

`Element.prototype.animate` rewritten for `.scene-controls` movers ONLY (init hook), so the desk pose
is provably untouched while the dock is auditioned. `.scene-controls`'s own rect, rAF-sampled and
resampled at 16.67ms — headless rAF runs ~120Hz, so a raw per-frame figure is the instrument's
cadence, not a phone's.

| dock clock | mean | first 60Hz frame | worst frame | frames >40px | painted frames |
| --- | --- | --- | --- | --- | --- |
| **520** (the desk's number, the control) | 1.208 px/ms | 50.2 px | 83.9 px | 7 | 30 |
| **600** (the proposal) | 1.047 px/ms | 43.0 px | 72.5 px | 8 | 35 |
| **680** | 0.924 px/ms | 37.6 px | 63.6 px | 7 | 40 |
| *the desk case, unchanged* | *0.402 px/ms* | *16.7 px* | *27.2 px* | *0* | *31* |

The bracket runs upward only (W8 QUALITY LAW; and 440 would make the phone faster than the desk
across 3× the travel). No candidate brings the dock near the desk's per-frame displacement, and
none can: one constant duration across a 3× travel is a 3× velocity, which is the family's own
inversion read forward. What 600 buys is five more painted frames and a 14% lighter worst frame,
inside the glass band, on the surface M02 calls not smooth.

**The honest gap: this pick is made on numbers, not on an eye.** The lane is headless; the estate's
method for this decision (440 against 380/440/520, 520 against 480/520/560) is a pair of eyes at a
local preview. The instrument, the three candidates and the one dist are all here for that look;
U-10, the owner disposes.

## 4. The travel census — measured, both engines, both viewports

| gesture | mover | chromium | webkit | ms |
| --- | --- | --- | --- | --- |
| dock open/close 390×844 | `.scene-controls` | 628.0 px | 628.0 px | **600** |
| desk open/close 1440×900 | `.scene-controls` | 209.0 px | 213.0 px | 520 |
| " | `.board-peek-host` | 193.0 px | 197.0 px | 520 |
| " | `.masthead` | 317.6 px | 322.5 px | 520 |
| " | `.drawer-tab` | 0.0 px (counter-scale only) | 0.0 px | 520 |
| card step 390×844 | `.gallery-track` | 304.0 px | 304.0 px | 440 |
| card step 1440×900 | `.gallery-track` | 352.0 px | 352.0 px | 440 |

The engine delta on the desk (209 vs 213 px) is the reason the travel is RECORDED and never CONSUMED:
a FLIP's travel is a `getBoundingClientRect()` difference, and a duration derived from it would be a
design decision sourced from a 4px rounding. That sentence is in the config beside the number.

## 5. π — everything this family does not claim

Every check below was run against the prototype's built dist, and the frame/PRM/keyframe checks were
ALSO run against a **HEAD control dist built in the same worktree, on the same machine, in the same
hour** (`dist-head`, served on 4249 — 4247 was another lane's).

| check | reading |
| --- | --- |
| desk keyframes + options vs r0 `r4-probe3.json` | **4 of 4 movers byte-identical** (translate strings, scale, `duration:520`, the glass curve) — on the diff AND on the HEAD control |
| frames 1× (dock open/close, both themes) | max **25.0 ms**, zero frames >33.4 ms · HEAD control 24.9 ms (r0 bank: 29.9 ms) |
| frames 4× (chromium, CDP throttle) | one long frame on the first open, **82.2 ms light / 73.9 ms dark** — the HEAD control on the same instrument shows **83.4 / 73.5**. Not new, not mine, and −1.2 ms / +0.4 ms against its own control. It exceeds r0's banked 53.0 ms because r0's probe opened the dock after a longer warm-up, not because the clock moved. **Reported as a gap, not as a pass.** |
| PRM, both viewports | **zero WAAPI movers** on open and close; the open pose is the same frame (rect at 80 ms ≡ settled); closed-after ≡ closed-before exactly. Byte-identical to the HEAD control, residual non-drawer animations included (`sparkle-icon` 200 ms, `ctrl-btn` 150 ms — i2's roster, not this family's) |
| `drawer.spec.ts` | **16/16**, chromium + webkit |
| visual goldens | **4/4** |
| filter census | **9 exact**, both engines (`filter-census` project green; the r6 probe prints the same 9-row roster) |
| theme quadrants | **20/20** both engines |
| r6 law probe | byte-identical to `law-probe-HEAD.txt` |
| r6 hue census | byte-identical to `hue-census-HEAD.txt` |
| r6 browser probe, both engines | **zero lines differ** against the HEAD control dist (the deltas vs r0's bank are dev-server minification and the difficulty crayon, which the probe itself calls data) |
| r1 heading voice | 3 voices, 2 of 8 ranked, phone ratio 1.0175 — born-RED exactly as at HEAD |
| i2 incidental census | 39 declarations, 16 homeless — identical roster HEAD vs diff |
| vue-tsc | **0** |
| vitest | **66 files, 810 tests, 0 failed** (files read, not just tests) |
| prettier / eslint / knip / check-motion-contract / check-copy-register | clean; copy register unchanged (no string minted) |

## 6. Gaps, each said plainly

1. **No eye.** §3. The three candidates are measured; the pick is not seen. This is the one thing
   the estate's own method asks for and this lane cannot give.
2. **4× first-open long frame.** 82.2 ms, above r0's banked 53.0 ms. The paired HEAD control says it
   is the estate's, not the diff's, but nobody has yet named what that frame IS.
3. ~~Reversal at the dock's clock is unmeasured.~~ **CLOSED** (`instruments/reversal-dock.mjs`):
   a re-click 200 ms into the gesture reads the live mover at **600 ms on the dock and 520 ms on the
   desk**, reverses it, and lands the sheet back on its exact rest pose with the gesture class gone
   and zero animations left — both engines, both poses. One caveat: webkit's `playbackRate` read at
   that instant showed 1 where chromium showed −1 (the read raced the reversal); the OUTCOME is right
   in both.
4. **I6 (owners-eye) not re-run** — it hardcodes a foreign port and its own SRC. Its arithmetic is
   knowable without it: the diff retires one duration literal and adds two named members.
5. **`useCarouselGlide` still owns a second FLIP engine** with its own `GLIDE_MS = MOTION.cardStepMs`
   alias and its own settle guard. i3-B2 passes it (the alias resolves), but the estate has two
   mover engines and this family touched neither seam.
6. **600 is a proposal, not a ruling.** It composes under MOT-LADDER (as a rung or as a reader of
   one) and under MOT-VERB without merging; if either lands a ladder, this member reads from it.

## 7. Files

`instruments/` — `i3-glass-curve-home.mjs` (r0's, check B grown a WAAPI arm) · `i7-travel-declared.mjs`
(new) · `travel-per-gesture.mjs` (the research lane's p2 promoted: travel, ms, px/ms, first-frame px,
per gesture per viewport per engine, plus the `--audition` sweep) · `frames-prm-pi.mjs` ·
`crops.mjs` · `reversal-dock.mjs` · `pw-scratch.config.ts` (the estate's default suite minus its :3000 webServer).

`data/` — the gate runs at HEAD and on the diff (`i3-*.txt`, `i7-*.txt`), the travel + audition data
slimmed of their raw sample traces (`travel-per-gesture-slim.json`), the frame/PRM/π runs on the diff
and on the HEAD control (`fpp-*.json`), and the π confirmations (`i2-*.txt`, `law-probe-DIFF.txt`,
`hue-census-DIFF.txt`, `r6-browser-*.txt`).

`frames/` — two crops, the dock settled open at 390×844 700 ms after the tap, chromium and webkit.
They prove the open REST POSE (y 216, h 628, both engines, identical to HEAD). A crop cannot carry
smoothness; the smoothness is §3's table.
