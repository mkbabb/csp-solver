# Motion brief — marks 11, 14, 15 (adjudicated 2026-08-02)

## Decision

**Design 2 (minimal-delta) wins outright.** Every load-bearing claim in it verified against the
tree: `MOTION.bands.boil` has zero consumers (grep-clean), `index.css` already hosts the global
keyframe estate (`shake` :596/:612, `cell-reveal` :633, `pencil-draw-on` :710 + the `--ease-*`
ledger :301–339), the `.gleam` div is a full-slot gold plate (`inset:0`, CelebrationStar :154–177)
— mark 14's rect flash, verbatim in the DOM — the celebration components are exactly 208 and 238
lines, `.board-wrapper` is `position:relative; overflow:visible` (GameBoard :856–858), goldens run
`reducedMotion:'reduce'` (visual-golden.spec.ts:41), and the FILL_ALLOWLIST rows it retires exist
word-for-word (filterBudget.ts:234–272).

**Design 1 is disqualified on mark 14 by its own mount point**: its `position:fixed` stamp lives
inside `.completion-vignette`, which carries `transform: rotate(5deg|-4deg)` at EVERY rung
(CompletionVignette :90/:170) — a fixed-position child of a transformed element anchors to that
ancestor, so the stage rect math is wrong by construction, at all widths, not just the gallery.
Its mark-11 cure also re-derives `RAY_DEG_PER_BEAT` per-pose, which changes the baked pose
bitmaps (RAY_ANGLES feeds the bake, DarkModeToggle :412–415) — golden churn for zero visible
gain. And it extends the crest to ≈4.4 s, breaking the documented ≤3.2 s cap and every spec
downstream of it. Design 2 holds the cap, holds the bitmaps, and is net −150 LOC where Design 1
is net +110.

**Grafts from Design 1** (the three ideas that survive adjudication):
1. **Error verb scoped to the VERDICT, never the keystroke** — ratifies keeping the incumbent
   `.solve-failure` whole-board shake as the error verb (renamed into the family), and KILLS any
   new per-cell shake surface.
2. **The overshoot-hold as a named owner knob** — the bloom's plateau length before dissolve is
   one keyframe percentage, listed under tuning, not hard-coded taste.
3. **The e2e-coupling warning made explicit** — `board-covisibility.spec.ts` (celebration never
   moves the page) and the filter-census fill pass must be re-run, and every rename lands with
   its FILL_ALLOWLIST true-up SAME-COMMIT (the rulings-land-with-enforcing-config rule).

**Killed as ornament**: Design 1's WAAPI FLIP engine + `data-celebration-stage` + seat-settle
glide (three mechanisms where zero are needed — the bloom never travels); the new
`animations.css` file (index.css is the incumbent home; a second home is a second place to look);
the `clipPath`-on-gleam cure (the gleam machinery dies whole — a stroke-only twin path animating
opacity is cheaper than masking a gradient plate); the per-cell `fb-error-shake`; the fractional
accumulator (a derived `floor(beat/band) % total` needs no state).

## Mechanism

### Mark 11 — two cadence bands, one derived line
`MOTION.bands` drops dead `boil: 1`, gains `sun: 2` and `moon: 1.5` (whole-ish beats; 1.5 is
rational on the beat grid — 2 flips per 3 beats, alternating 250/125 ms dwell, no second clock).
The toggle's beat watch (DarkModeToggle :387–395) derives instead of increments:

```ts
watch(beat, (b) => {
  const total = heldPoseCount();
  if (total <= 1) return; // held — freeze in place
  const step = (band: number) => Math.floor(b / band) % total;
  if (isDark.value) starFrame.value = step(MOTION.bands.moon);
  else sunFrame.value = step(MOTION.bands.sun);
});
```

Sun 8 Hz→4 Hz (the 2× slow), moon 8 Hz→5.33 Hz (the 1.5×). Non-advance beats assign the ref its
own value — Vue's setter no-ops. Everything downstream is frame-indexed and follows free: baked
`<img>` pose stacks (same 4 bitmaps, flipped less often), gesture computeds, TWINKLE_BY_FRAME.
`RAY_ANGLES` stays BYTE-IDENTICAL — only its comment re-derives (the 0.1875°/pose micro-dither now
spans 250 ms, so the notional revolution is 480 s). PRM untouched (the beat parks centrally).
Goldens untouched (they freeze the beat at pose 0). Census untouched — zero filter changes.

### Mark 15 — THE MOTION VOCABULARY (index.css, foot, beside `.pencil-draw-on`)
One unlayered block: a ledger comment mapping verb → family → consumer, then the keyframes.
Numbers NEVER live here — consumers bind `--*-dur`/`--*-delay` custom properties from
CELEBRATION via `v-bind` (the `.pencil-draw-on` `--draw-dur/--draw-delay` precedent).

```
COMPLETE  bloom-in · outline-flash · bloom-out · sticker-pop · plush-bounce
KIN       plush-murmur · plush-blink · ink-write-in · note-in
          (+ incumbents kept in place, ledgered: cell-reveal, pencil-draw-on)
ERROR     refuse-shake (the incumbent .solve-failure shake, renamed — zero consumers
          outside index.css, verified)
```

Two disciplines, stated in the block, enforced by construction:
1. **FILL — every verb is `backwards`, never `forwards`/`both`.** Each 100 % keyframe equals its
   consumer's cascade rest pose, so nothing retains an effect-sourced transform (the r3 §3.1
   promoted-layer class). This retires FIVE FILL_ALLOWLIST rows: `note-write-in` ×2 (MarginNote),
   `vignette-write-in` ×1 (CompletionVignette) — both fold into ONE `ink-write-in` keyframe whose
   end state (`inset(0 0 0 0)`) renders identically to the cascade's `none`, so `both` was never
   load-bearing — and `note-slide-in`/`note-fade-in` (SolverErrorNote's banked-residue pair),
   replaced by `note-in` with `backwards`.
2. **PRM — one rule at the block's foot**: `animation: none !important` on every vocabulary
   class. Load-bearing, not ceremony: the global PRM rule zeroes DURATIONS but not DELAYS, so a
   2650 ms-delayed `backwards` animation would hold its 0 % pose (scale 0 / opacity 0) for 2.65 s
   under PRM. Rest CSS is the settled pose, so reduced motion shows the END state instantly.

### Mark 14 — the star: bloom over the board, flash the outline, hand off to the sticker
ONE component, TWO instances. `CelebrationStar.vue` gains `bloom?: boolean`:

- **sticker instance** — unchanged mount (CompletionVignette slot, all three responsive rungs);
  plays `sticker-pop` (260 ms) at the crest; keeps `filter="url(#grain-static)"` (86 px, rasters
  once, transient — no census row, the default scene never contains it).
- **bloom instance** — mounted in GameBoard inside `.board-wrapper` beside CelebrationHeart:
  `position:absolute; inset:0; z-index:4; pointer-events:none`, `aria-hidden`, NO filter. Layout
  rests at the FINAL board size and only ever scales DOWN (0.06→1.06) — the estate's own raster
  rule (useFlipGlide's last-size discipline), so no cached raster upsamples and no 640 px filter
  re-executes.

Markup delta: the body path takes `fill-opacity` 0.22 in bloom (a gold wash the solved board
reads through); a `.star-flash` twin path — `fill:none`, rest `opacity:0` — animates opacity ONLY
(`outline-flash`, compositor-cheap). **The flash is literally just the star outline.** The
`.gleam` div, its 260 % mask sweep, `gleam-sweep`, and `gleamMs` are DELETED — that rectangle was
the defect.

Timeline — the ≤3.2 s cap HELD, `starCrestMs: 2650` keeps its meaning (the crest instant =
flash + hand-off + heart, together):

| t (ms)    | what                                                                  |
|-----------|-----------------------------------------------------------------------|
| 2050→2650 | `bloom-in` — small star grows to the whole board, one 1.06 overshoot   |
| 2650→2970 | `outline-flash` on the twin path (320 ms)                              |
| 2650→3190 | `bloom-out` (540 ms) — a ~25 % plateau HOLD, then dissolve at 1.12     |
| 2650      | sticker `sticker-pop` (260 ms) + heart `plush-bounce` (550 ms) — the bloom hands the moment to both corners at once |

`bloom-out` starts exactly where `bloom-in` ends — contiguous coverage, so `backwards` fill never
exposes the rest pose mid-sequence (the gap bug a separate hold window would mint). On
`@animationend` (name `startsWith('bloom-out')` — global names are unhashed) the overlay leaves
the DOM. The `prev === undefined` settled probe survives: settled/PRM ⇒ `is-settled` (sticker
`animation:none`, bloom `display:none`) — a remount while solved never replays.

The heart (mark 15's integration): `plush-bounce` (the retired `bounceTransform`'s exact poses as
keyframes, per-segment easing via `animation-timing-function`), `plush-blink` on `:deep(.eyes)`
with a bound delay, `plush-murmur` cleared on `animationend`. Rest `transform` goes
`scale(0)`→none (backwards supplies the pre-crest pose). `createSequenceSubscription`, `lerp`,
`easeOut`, `bounceTransform`, and all three timers DIE; murmur registration moves to the bounce's
`animationend`. The blink-vs-murmur guard drops — blink transforms `.eyes`, murmur transforms the
host; they compose, no conflict. Celebration machinery: 2 sequence subscribers + 4 timers → ZERO.

## Files (exact, per-file)

1. **src/pencil/config/pencilConfig.ts** — bands: drop `boil`, add `sun: 2` / `moon: 1.5`;
   CELEBRATION: drop `starDrawInMs` + `gleamMs`, add `starBloomStartMs: 2050`, `starBloomMs: 600`,
   `starFlashMs: 320`, `starFadeMs: 540`, `starLandMs: 260`; re-derive the budget comment (cap
   still 3.2 s, quiet by 3.19 s). ~±14
2. **src/pencil/celestial/DarkModeToggle.vue** — the derived beat watch (above); RAY comment
   re-derived (240 s × band), RAY_ANGLES byte-identical. ~±8
3. **src/assets/index.css** — THE MOTION VOCABULARY block (9 new keyframes + ledger + the fill/PRM
   disciplines); `shake`→`refuse-shake` (declaration + consumer, same file). ~+115
4. **src/pencil/chrome/CelebrationStar.vue** — `bloom` prop, `.star-flash` twin,
   sticker/bloom/`is-settled` classes, `animationend` unmount; DELETE the dashoffset sequence,
   `getTotalLength`, `nextTick` dance, gleam div + 55 lines of mask CSS. 208→~100
5. **src/pencil/chrome/CelebrationHeart.vue** — vocabulary classes + bound delays; DELETE
   bounceTransform/lerp/easeOut, the subscription, all three timers. 238→~105
6. **src/games/shared/GameBoard.vue** — `<CelebrationStar :active="celebrating" bloom />` inside
   `.board-wrapper` beside CelebrationHeart. ~+6
7. **src/pencil/chrome/CompletionVignette.vue** — `vignette-write-in` deleted; both text rungs
   take `ink-write-in` with `backwards`; local PRM arm dies (vocabulary PRM covers it). ~−12
8. **src/pencil/chrome/MarginNote.vue** — `note-write-in` deleted; two sites take `ink-write-in`
   `backwards`. ~−10
9. **src/games/shared/SolverErrorNote.vue** — `note-slide-in`/`note-fade-in` deleted; takes
   `note-in` `backwards` (PRM arm now instant-show via the vocabulary rule). ~−20
10. **src/pencil/config/filterBudget.ts** — FILL_ALLOWLIST: retire the five rows named above.
    SAME COMMIT as 7–9 or the census reds. ~−30

**LOC: ≈ +185 / −330 (net −145). Libraries: ZERO new** — native CSS keyframes + custom
properties, Vue `v-bind()` in scoped styles, pencil-boil only for what already ships
(`useBoilBeat`, `heldFrameCount`, `usePrefersReducedMotion`); `createSequenceSubscription` leaves
both celebration surfaces. Census: 9 rows untouched, zero new live filters.

## Visual verification (the standard of proof)

On :3001 (HMR) then the rebuilt dist on :4248, chromium AND webkit; screenshots to the
t6-research scratchpad.

1. **Celebration** — 1280×800 dpr2, solved MEDIUM 9×9 via Solve: frame series at
   t = 1900 / 2200 / 2450 / 2650 / 2800 / 3000 / 3300 / 4000 ms. Expect: small gold star at 2200,
   filling the board with one overshoot ~2600, the OUTLINE ALONE flashing at 2650 (screenshot-diff
   the flash frame against t=2500 — changed pixels must lie on the star contour, never across a
   rect; digits stay legible through the wash), plateau then dissolve complete by 3.19 s, corner
   sticker + heart landed together at the crest. Repeat at 393×699 dpr3 (corner-press), 1280
   docked, 1440×900 (teacher's margin): sticker lands in all three rungs, bloom stays inside the
   board square.
2. **PRM** — same run, `reducedMotion:'reduce'`: sticker + heart present and static from the
   first solved frame, NO delayed pose-hold (the delay trap), no bloom element in the DOM.
3. **Mark 11** — 24 screenshots at 62 ms over 1.5 s of the toggle, light then dark: ~6 distinct
   sun poses (was ~12), ~8 moon poses; by eye at :3001 the sky reads calm against the grid's
   125 ms boil, slower not stuttery.
4. **Error verb** — failed grade with a wrong digit: the board plays one `refuse-shake`
   (unchanged pixels, new name); conflict cells unchanged.
5. **Regression by looking** — `filter-census.spec.ts` 9/9 both engines both regimes (incl. the
   fill pass against the trued-up allowlist), the four goldens (untouched — PRM freezes the
   beat), `board-covisibility.spec.ts` (the bloom is absolute inside the wrapper — the page must
   not move), and a WebKit paint-flash pass over the bloom window: the 640 px overlay repaints
   ~1.1 s and NOTHING paints after 3.2 s.

## Risks

- **The bloom is a 640×640 unfiltered SVG repainting ~1.1 s** — transient, one path, inside the
  already-promoted `.board-wrapper` layer; must be paint-flashed on real Safari. Booked fallback:
  `will-change: transform, opacity` on the bloom host, window-scoped.
- **Taste knobs (owner)**: wash `fill-opacity` 0.22 (0.10 barely-there ↔ 0.35 real sticker);
  the ~25 % plateau hold in `bloom-out` (Design 1's graft — one percentage); giant-star stroke
  scales to ~32 px crayon (the storybook read; `vector-effect="non-scaling-stroke"` is the
  one-attribute thin-ink alternative); dissolve-and-hand-off vs hold-on-board (the mark says
  grow-to-board and stops — dissolve is the readable default).
- **Moon at 1.5 = uneven 250/125 ms dwell** — likely invisible in a noise field; fallback
  `moon: 2`, noted as a deviation from the mark.
- **Renames + census must land same-commit** (`refuse-shake`, the write-in fold, the five
  allowlist rows) — grep e2e + src for every old name before the commit.
- **The settled probe now guards a CSS replay** — cover the remount-while-solved case in the
  existing celebration e2e.

## MVP cut (if phased)

- **Phase A (ships alone, ~12 lines, zero risk)** — mark 11: pencilConfig bands + the derived
  beat watch. Pure config + one derivation; goldens and census provably unreachable.
- **Phase B (the marks' substance)** — the vocabulary block + CelebrationStar bloom/flash/sticker
  + CelebrationHeart conversion + the GameBoard mount. Census-neutral (all `backwards`, gleam had
  no allowlist row).
- **Phase C (rides B or follows)** — the `ink-write-in`/`note-in` fold, `refuse-shake` rename,
  filterBudget true-up. If C follows B, B must not touch the allowlisted names.

---

## AUDIT RIDER (2026-08-02 — overrides the body where they conflict)

1. **The vocabulary block lands inside `@layer utilities`** (where `shake` lives) —
   unlayered, its PRM `animation: none !important` would out-rank layered consumers
   asymmetrically. One wrapper line.
2. **Numbers true-up**: net −145 LOC (§Decision's −150 was drift); FILL_ALLOWLIST
   retirement = 4 rows / 5 sites (`note-write-in` 2, `vignette-write-in` 1,
   `note-slide-in` 1, `note-fade-in` 1) — same-commit with the keyframe deletions,
   as already flagged.
