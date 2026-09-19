# MOT-DERIVE · pass-1 synthesis · Distance and material

Section §13 (the transition grammar) · §12's drawer curve · M02, M09 (design half).
Synthesizer: Fable. Research lane: `../research/MOT-DERIVE/` (verdict KILL on arithmetic).
Method: the frontend-design two-pass (plan → review against the tells → specify), invoked
first. Read-only on product files; this file is the only write.

## 0. What this spec is

The formula is dead. `ms = baseMs + travelPx / speed(material)` can't be fitted to the
drawer's own two poses (209px and 628px, both ruled 520ms: the only solution is speed = ∞),
and where it can be fitted it's invisible (least squares puts 95.1% of every duration in the
constant and spends 26.5ms, 1.6 frames, on a 3× travel range). It reaches 5 of 77
declarations and can't touch the dusk, which is the surface M09 names first. Nothing below
revives it. No `paperSpeed`, no `baseMs`, no `durationFor`.

What the family leaves behind is smaller and true: **distance informs the record and the
audition, never the clock.** Three things, none needing the model:

1. `GLIDE_MS = 520` goes home to `MOTION.drawerGlideMs` (a literal contradicting the covenant
   its own file quotes).
2. The dock sheet gets its own NAMED clock, `MOTION.dockGlideMs`, auditioned by eye against
   three candidates in the estate's recorded method, because the desk's 520 was auditioned on
   a four-mover reciprocal solid and the dock inherited it unseen.
3. Every FLIP duration in MOTION carries the travel it was auditioned at, in a one-line
   grammar a gate can read. The next audition then knows what it's looking at.

One memorable thing per surface: the dock's rise reads at the desk's weight. The desk changes
by zero pixels. The config says what each number was seen against.

## 1. The design plan, and the review

**Plan.** Subject: a hand-drawn desk. The drawer is a pencil case pulled from under the
worksheet (desk: case + board + masthead + tab, one clock); on a phone it's a sheet rising
exactly its own height (390×628 at 390×844). Tokens are MOTION bands; no hue, no type, no copy
is minted. Principles: (a) the clock is stated, geometry is normalised away (`HandDrawnGrid`
pathLength 1000; `HandwrittenGlyph` real pathLength beside a fixed 350ms); (b) a per-pose NAME
is a decision even when the number comes back equal; (c) the eye reads velocity, so the record
states px/ms and first-frame px; (d) one clock per gesture, never per mover (the tab's 0px
counter-scale mover and the card step's CSS layer both break under per-mover timing).

**Review against the tells.** The generic answer to "define the animations" is a
distance-scaled duration with stagger and a spring: Material 2's rule, retired by Material 3
for named tokens, and exactly the family as charted. Rejected on the estate's numbers, not on
taste. Two named per-pose constants with their travel written beside them is what's left, and
it isn't the default anyone reaches for. The audition bracket runs upward only (520 / 600 /
680): the glass curve's first painted frame at 60Hz already moves the dock ~46px against the
desk's ~15px (computed from `cubic-bezier(0.32, 0.72, 0, 1)`: 7.3% of travel in the first
16.7ms of 520), and W8's QUALITY LAW forbids a shorter clock as a fix. What was changed by the
review: an earlier draft bracketed symmetrically (440/520/600); 440 is the card step's number
and would make the phone faster than the desk at 3× the travel, so it went.

## 2. The spec

### 2.1 Tokens (pencilConfig `MOTION`, the only home)

| member | value | consumer | note |
| --- | --- | --- | --- |
| `drawerGlideMs` | 520 | `useControlsDrawer` desk pose (`!mobileDock`) | the number doesn't move; the `:83-85` audition comment (480/520/560 at :3001) travels with it; adds `travel: 209px @1440×900 (case) · 0.40 px/ms · first frame ~15px` |
| `dockGlideMs` | **auditioned: 520 / 600 / 680**, proposal below | `useControlsDrawer` dock pose (`mobileDock`) | the sheet alone, 628px; adds `travel: 628px @390×844 (sheet) · <px/ms> · first frame <px>` |
| `curves.drawerGlide` | unchanged | both poses | R6 law 1; the dock keeps the curve whole |
| `boardFoldMs`, `cardStepMs`, `chromeLeaveMs`, `beatMs` | unchanged | | out of this family's reach; the fold's enter and exit stay ONE number (an asymmetry there reads as a bug) |

Not minted, ever: `paperSpeed`, `tapeSpeed`, `baseMs`, `durationFor`.

**The proposal for `dockGlideMs`, for the prototyper's eye and the owner's re-look (U-10):
600.** Reasoning to bank beside the constant in one sentence: at 520 the sheet's first frame
moves ~46px and its peak ~3.3 px/ms, three times the desk case the 520 was auditioned on; 600
brings the first frame to ~40px and the mean speed to 1.05 px/ms while keeping the settle
inside the glass band; 680 read as a drag on a surface the owner already calls slow to draw
(M06). If the eye at the local preview disagrees, the sentence changes and the number with it;
what may not happen is an inherited 520 with no sentence at all.

**The travel grammar** (a declaration a gate reads, the `PRM:` precedent in
`check-motion-contract.mjs`): inside the member's docstring, one line
`travel: <n>px @<w>×<h> (<mover>) · <v> px/ms`. Required on every MOTION `*Ms` a FLIP mover
spends (`drawerGlideMs`, `dockGlideMs`, `boardFoldMs`, `cardStepMs`); forbidden nowhere else.

### 2.2 Components and states

**The drawer, desk (≥1024).** Open / closed / opening / closing / retarget-by-reversal.
Byte-identical to HEAD: four movers, `drawerGlideMs` 520, one `startTime`, the glass curve,
`fill: none`, the settle clears animations only. The tab's counter-scale rides the same clock
(host × tab ≈ 1). π identity: the drawer goldens don't move.

**The drawer, dock (<1024, both orientations).** Same states. One mover (`.scene-controls`,
`translate(0, ±628px)` at 390×844; the `hostMoved` guard suppresses the rest). Duration
`dockGlideMs`, the curve unchanged, `fill: none`, retarget by reversal at the dock's own
clock. The rest pose stays on the `translate:` channel (`scene.css:486/490`), which no mover
animates. Settle ~700ms before any measurement of the open sheet.

**PRM.** Unchanged and re-proved: `toggleDrawer` takes the same-frame swap path
(`useControlsDrawer.ts:423`); `getAnimations()` empty under `reduce`, both poses.

**The card step, the fold, the dusk.** Untouched by this family. The card step's two layers
(WAAPI track + three CSS cards on `--card-step-ms`) stay on one static 440. The dusk
(`index.css:667`, colour only) is unreachable by a travel model and stays narrowed to its five
selectors; `useTheme.ts:35 disableTransition` is not re-blanketed.

### 2.3 Copy

None. No rendered string changes, so no woff2 re-cut and nothing for `check-copy-register`.
M16 is met by silence.

### 2.4 Motion, desktop and mobile, light and dark

| surface | pose | curve | ms | home | travel on record |
| --- | --- | --- | --- | --- | --- |
| drawer | desk, both themes | glass | 520 | `MOTION.drawerGlideMs` | 209px case / 317.6px masthead @1440×900 |
| drawer | dock, both themes | glass | 600 proposed (520 control, 680) | `MOTION.dockGlideMs` | 628px sheet @390×844 |

Theme has no bearing on the clock; it bears on the frame trace (the dark scene carries the
moon's boil), so every trace runs in both.

### 2.5 The engine seam (the smallest one)

`useFlipGlide.run(specs)` takes `options.durationMs` at construct time. The drawer is a module
singleton with one controller, and `retarget()` reverses the active one, so two controllers
would need active-tracking. The smaller change: `run(specs, durationMs = options.durationMs)`,
with the never-never guard computed from the run's duration (`durationMs + 220`). Three lines
in the engine, one in the drawer: `glideCtl.run(specs, mobileDock.value ? MOTION.dockGlideMs :
MOTION.drawerGlideMs)`. The gallery's fold and the carousel keep calling with no second
argument. No behaviour change on the desk by construction (the default is the same number).

## 3. The plan (files, order, what dies)

1. `web/frontend/src/pencil/config/pencilConfig.ts` MOTION: add `drawerGlideMs: 520` with the
   `:83-85` comment moved in and the `travel:` line; add `dockGlideMs` with its audition
   triple, sentence, and `travel:` line; add `travel:` lines to `boardFoldMs` and `cardStepMs`
   from the research census (428.6px corner @1440 enter; 304/352px).
2. `web/frontend/src/games/shared/useFlipGlide.ts`: `run(specs, durationMs?)`; guard from the
   run's duration. `durationMs` stays on the options as the default.
3. `web/frontend/src/games/shared/useControlsDrawer.ts`: **`GLIDE_MS` dies** (`:86`, and the
   `durationMs: GLIDE_MS` at `:233` becomes `MOTION.drawerGlideMs`); `glide()` passes the pose's
   member at `:326`. `mobileDock` (`:135`) already exists as the selector.
4. Instruments (evidence-side, beside r0's, promoted to `scripts/` only if the agglomerated
   §13 lands one motion gate): `i3-glass-curve-home.mjs` check B extended to `.ts` WAAPI call
   sites; `i7-travel-declared.mjs` (the `travel:` grammar); `travel-per-gesture.mjs` (the
   research lane's p2 probe promoted: travel, ms, px/ms, first-frame px per gesture per
   viewport per engine).
5. Nothing else. Order matters only in that 1 precedes 3 (the import).

What dies: `GLIDE_MS`. What never lands: any derivation.

Dependencies and fences: the dock's clock is a constant, so §10's re-cut of the controls
card's height can't move it (the research's third defect, closed by construction). The R6
scope fence holds: the drawer's curve re-eases no other surface, and this spec names no other
surface's duration.

## 4. The prototype brief

**Build.** A throwaway `git worktree` under the scratchpad carrying the diff from §3 (steps
1–3), `npm run build` into the scratchpad, served on 127.0.0.1:4248 `--strictPort`; a scratch
Playwright config (copy of `playwright.config.ts`, `webServer` dropped, `baseURL` set),
chromium + webkit headless, 390×844 dsf3 touch and 1440×900 dsf2, both themes. For the
three-candidate audition, no rebuild: an `addInitScript` hook on `Element.prototype.animate`
that rewrites `duration` for `.scene-controls` movers only (the r4 hook), so the desk pose is
provably untouched while the dock is auditioned at 520 / 600 / 680 on one dist. Then the eye
at the local preview picks, and the sentence is written.

**Measure (numbers first).**

1. `i3` B extended: RED at HEAD on exactly one row (`useControlsDrawer.ts:86`); GREEN on the
   diff. `i7-travel-declared`: RED at HEAD (0 of 4 members declare), GREEN on the diff.
2. `travel-per-gesture`: dock 628px at `dockGlideMs`; desk case 209px at 520; card step
   304/352px at 440; first-frame px and peak px/ms per gesture, both engines.
3. Frame trace on the built dist (`r4-frame-probe.mjs` re-run): dock open + close, 1× and 4×,
   both engines, both themes. Success: at 1× zero frames >33ms (r0: 29.9ms max), at 4× no
   frame above r0's 53.0ms and no new long frame; nothing shortened.
4. Per-frame displacement of `.scene-controls` sampled by rAF over the gesture at 520 and at
   the chosen value: max px/frame, and the count of frames over 40px. This is the number that
   names what the eye sees.
5. PRM: `emulateMedia({ reducedMotion: 'reduce' })` then open/close at both viewports:
   `getAnimations()` empty, one layout, the sheet at its rest pose the same frame.
6. π identity: 1440×900 drawer keyframes and duration byte-identical to r0's `r4-probe3.json`;
   the drawer golden family against the built dist on the scratch config, unmoved; filter
   census 9 exact; the r1 heading census, r6 hue census and the wobble probe re-run and
   identical (nothing this spec touches can move them, and the wave requires the line).

**Frames.** Two crops, ≤150KB each: the dock settled open at 390×844 after 700ms, chromium and
webkit, proving the open rest pose didn't move. Nothing else; a crop can't carry smoothness.

## 5. The gates it lands with (born-RED)

| id | asserts | reading at HEAD |
| --- | --- | --- |
| G-MOT-D1 (`i3` B, WAAPI arm) | every `duration:` at an `animate()` call and every `durationMs` handed to `useFlipGlide` resolves to a `MOTION.*Ms` member | RED, one row: `useControlsDrawer.ts:86` |
| G-MOT-D2 (`dock-names-its-clock`) | the drawer's `<1024` pose spends a MOTION member distinct in name from the desk's; both are consumed in `useControlsDrawer` | RED: no such member |
| G-MOT-D3 (`i7-travel-declared`) | every MOTION `*Ms` spent by a FLIP mover carries a `travel: <n>px @<w>×<h> (<mover>) · <v> px/ms` line in its docstring | RED: 0 of 4 |

What no gate can check, said plainly: that a duration is "derived correctly". A static reader
can't see a travel; that's a per-gesture runtime rect diff, a probe. The family's actual claim
was ungateable, which is one more reason it's dead.

## 6. For the agglomerator (not merged here)

- The GLIDE_MS home is common ground with MOT-LADDER and MOT-VERB; the per-run duration seam
  and `dockGlideMs` compose under either (a rung the dock reads, or a rung the drawer verb
  spends per pose). The `travel:` grammar composes under both as well.
- A cross-lane fact: MOT-LADDER §5 reads r7b's 604.6/576.4px as the DESK case and concludes
  the dock already moves at the desk's speed. `probe-r7b.mjs:20` runs at 390×844 and samples
  `#controls-drawer .drawer-case`, so both figures are the DOCK; the desk case at 1440 travels
  209px (`r4-probe3.json`). The 3× velocity gap is real, and LADDER's "within 5%" compares the
  dock to itself. The dock's clock is an open eye's question, and this spec answers it with a
  name and an audition, not with inheritance.
- U-10: nothing here closes M02 or M09. W8's real-device reading remains M02's arbiter.
