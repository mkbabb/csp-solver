# Pass 5 · MRK-LIVE · the live ring (prototype record)

Work tree `.claude/worktrees/wf_f72f3b5a-83a-35` (base `74a2b5d9`), uncommitted. Control = `74a2b5d9`
(the chair's `w7-control` dist at :4239 for dist rows; a `git archive` of `74a2b5d9` in the scratchpad
for the lint battery). Diff banked as `pass5.diff` (19 tracked files +510/−159, plus 3 untracked files:
the spec at 802 lines, FocusRing.vue at 311, gridPaths.test.ts at 44). `git apply --check` onto a clean
`74a2b5d9` exits 0. The pass-5 number is the critic's.

## 0 · Gaps first (open, each with the number that holds it)

1. **G-LIVE-17 has no dev-mode control arm.** The room row is green on the lane only (chromium: 4
   cells, 2,054.83 px² covered, 83.56 px label; webkit: 6 cells, 3,622.48 px², 108.6 px). The tape
   intercepts nothing (`hitIsTape` false, air ≥ 0). Its negative control (pointer-events:auto
   injected) hits the tape in the same run. The covering itself is the chair's T9-R5 candidate.
   Tape arm B is NOT built.
2. **The two-value ballot arm is ABS's to frame.** My read of it, on the same method:
   - @0.95: dark #2f68aa worst 3.084/3.082; light #4589d2 worst 2.695/2.792.
   - @1.0: dark #2f68aa 3.28/3.28 and #306cb0 3.119/3.119 both clear.
   - @1.0 light #4589d2: chromium worst 2.918 (3/60 stations under 3). ABS's 3.569 is a left-side
     reading. isTheRing REFUSED the webkit row (Δ 221.5).
3. **60/120 Hz** can't be measured under Playwright, and the surrogate was not re-run.
4. **The vsIn worst column in `P5-paint-*.json` is unreliable.** The inward sample can land back on
   ink and read 1.0. The guard went into the probe after the banked run, which was not re-run.
   Medians and the vsOff columns are unaffected.
5. **G-LIVE-4's reversal clause is still an `if (afterReversal.ring)`.** It's a silent skip, inherited
   from pass 4. Making it strict needs a reversal-only negative control, and I didn't build one.
6. **Law 39's tab** (unrankable until read with the boil parked, ABS's 1.04–4.34) is the chair's row.
   Cited, not moved.
7. **The dark-theme filter census is RED on the lane and on the control, identically.** 4 failed / 8
   passed on both, G3.1 + G3.3 in both engines. The unclaimed row is `svg.crayon-heart.idle
   ⟨saturate(0.85)⟩`. Inherited and declared; the chair's booked row.
8. **RING_GEOMETRY graft DECLINED.** Its witness does not reproduce. Max vertex excursion past the
   cell's own square at 16×16:
   - HEAD 0.374 u
   - f=0.86 1.025 u
   - f=1.00 5.400 u (+5 u half-stroke)

   ABS's "clears by 2.577 u" has no instrument in its bank. See `logs/ring-geometry-witness.txt`.

## 1 · Numbers

| row | lane (returned tree) | control `74a2b5d9` |
|---|---|---|
| `e2e/focus-ring.spec.ts` whole file, both engines | **16/16 EXIT 0** (`logs/spec-final-lane.log`) | the earlier 12-row file: 10 red / 2 green (only G-LIVE-15 green). G-LIVE-4/20 red because there's no FocusRing; G-LIVE-16 reds because HEAD's UA outline indicates the stranded input (a design-relative guard) |
| vitest whole | 69 files / 835 tests EXIT 0 | 68 / 830 EXIT 0 (+1 file / +5 = gridPaths.test.ts) |
| π, prod vs prod, real payload, 74 nodes × 16 props, both engines | lane-vs-control **0 deltas / 0 px**, same 32 givens | control-vs-control 0 / 0 (noise floor, same run) |
| throttle config (5 dist suites) | 67 passed EXIT 0 (build 2) | 67 passed EXIT 0 |
| golden config | 4/4 EXIT 0 (build 2) | 4/4 EXIT 0 |
| filter census light, both regimes, both engines | = 9 exact | = 9 |
| filter census dark | EXIT 1, 4 failed / 8 passed | EXIT 1, 4 failed / 8 passed (identical rows) |

- **Payload** (π, crops 1/2/4, forced colours): `?size=3&board=ATMuMDAzMDA2MDgwMDUwNzAwMTAzMDA5MDIwMDUwMjAwNTA3MDAxMDYwMDkwMjAwODAxMDA0MDYwMDQwNjAwOTAyMDA4MDEwMDQwOTAwMzA1MDA4`.
  The 16×16 ballot payload is in `logs/P5-crops.log`.
- **Build identity.** Build 1 (`index-CLHO3fepxsNC.js`) carried the π/dist rows first. A later
  `prettier --write` on FocusRing.vue moved its Vue scope hash (`data-v-8ddc54f2` → `data-v-608fa0fc`).
  Build 2 (`index-ts0njdC-qv3v.js` / `index-Bb9MlCSFpOdg.css`) is byte-identical to build 3, and the
  π, throttle, golden and dark-census rows were re-run on build 2 (`logs/battery8-dist-build2.log`,
  `logs/pi-p5-build2.json`).

### Painted contrast

Method: ring-OFF subtraction; 60 stations with perpendicular scans; core max / p30 / median /
fraction under 3; sensitivity at 50/70/90/100 %; isTheRing Δ ≤ 24. Sources: `logs/P5-paint-rows.log`
and `P5-paint-*.json`.

Tier 2 at 0.95 (the shipped `#3a7bc4`, light / dark), chromium · webkit:

| read | light | dark |
|---|---|---|
| over the ground it covers | 3.972 · 3.965 | 3.989 · 3.997 |
| over its own fill | 3.619 · 3.615 | 3.691 · 3.695 |
| FRAME row at 16×16 | worst 2.812 · 2.850, on 10 % of stations | worst 2.436 · 2.404 |

The FRAME row reads the same at 1.0: light 2.98, dark 2.528.

**The alias fails the frame at any opacity.** The sentence "all six clear the 3:1 floor on every
ground" is struck (index.css). Chrome at 1.0, page / controls card: light 4.188 / 4.289, dark
4.379 / 4.286.

Sensitivity over the shipped rings:
- 90 %: ≥ 3.33, with 0 stations under 3.
- 70 %: 2.45–3.35.
- 50 %: 1.26–2.09.

isTheRing refused 2 webkit rows: light #4589d2 FRAME op1, and dark #3a7bc4 paper op1.

### The rank, as an order (G-LIVE-14)

Read live off real cells (`is-invalid` / `is-peer-cursor` added to real cells):
- no-preference: invalid 1 > tier 2 0.95 > tier 1 0.65 > peer 0.55.
- `prefers-contrast: more`: 1 > 0.95 > 0.9 > 0.8.

`join-language-prm:153` stays 0.55. **Re-ruled: 0.95 / 0.65 / 0.55 survives on the alias arm.** A
tier 2 at 1.0 ties the invalid rung, so G-LIVE-14 reds by construction. The 1.0 rank would need a
new invalid rung, and that's the ballot's third arm, not this lane's.

### Departure (G-LIVE-20; `logs/P5-departure.log`)

Setup: 393×699, coarse, noHover, dpr 2.
- The defect lives on SYNTHETIC `click()`, which is what keyboard Enter/Space and AT "press" produce.
  With no cure, WebKit holds a ring on `body` through settle (ringVsTab 0 at t0-framed). Chromium
  drops it.
- A real `tap()` drops focus with events, so it shows 0 rings with the cure or without it.
- With the cure: 0 rings in both engines.
- **The cure's bound:** it fires only when `measure()` runs.
- **Phone table re-banked:** with no reversal, t+1.28 s and t+2.48 s both land on
  `button.mobile-heading-btn`, 1 ring, err 0.00, both engines.
- Pass-4's "the estate does NOT move focus into the sheet" is superseded here and struck. The pass-4
  file is frozen.

### Forced colours (G-LIVE-21; `logs/P5-forced*.log`)

FocusRing is `display:none` under forced colours. The deck scrollport's unlayered `outline:none`
beat the layered restoration, so the lane's pre-cure run was RED (both engines) while the control
indicated the card. The cure is an unlayered `@media (forced-colors: active)` rule in GameCard.vue.
Painted differencing of the deck card: lane 3,044 px, control 3,053 px. Every other stop is
indicated on the lane in both engines.

### Laminate (row 13; `logs/P5-laminate.log`)

- The SELECTED because-cell: body `rgba(0,0,0,0)`, rim α 0.70, ΔL* 0.00 against the laminate hidden.
- The unselected because-cell: body 0.15 / rim 0.50.
- Both engines, both themes.
- `.guard-btn` is reached with the deck armed (G-LIVE-15, 0 finite animations on the path).

### `--toggle-bleed` sentinel (`logs/P5-visible.log`)

The publisher is App.vue (−52 px).
- As-is: ring 212×212, both engines.
- Publisher deleted: bleed 9999px, outset −9997px. Chromium draws a 0×0 ring; WebKit draws a stray
  300×150 ring (its SVG fallback size).
- After the geometry guard in FocusRing (`w > STROKE && h > STROKE`, finite): 0 rings in both engines.

## 2 · Break tests (born-RED, each restored with sha1 equality; `logs/breaks-battery*.log`)

| break | gate it must red | result |
|---|---|---|
| B1 App.vue bleed publisher deleted | G-LIVE-19 "reads its PUBLISHER's bleed (< 0), never the sentinel" | RED both engines |
| B2 `--motion-note` registered twice | G-LIVE-19 "registered exactly once" | RED |
| B3 a `var(--x, fallback)` behind a registered name (DarkModeToggle) | G-LIVE-19 "no var(…, fallback)" | RED |
| B4 departure cure deleted | G-LIVE-20 | first cut (a `tap` gesture) GREEN, so it was re-cut to `.click()`. The re-cut is RED in webkit ("t+120: focus is on body, so no ring") and green in chromium, which has no defect |
| B5 tier 1 raised over the peer | G-LIVE-14 "tier 1 outranks a peer's ring" | RED |
| B6 ring removed | G-LIVE-16 "every judged estate stop carries an indicator" | RED |
| B7 duplicate `@property` | G-LIVE-19 | first cut (CSSOM count) GREEN because the compiler dedupes `@property`, so it was re-cut to a source census. The re-cut is RED "no custom property is registered twice in source" |
| B8 a shadow `--motion-note` | G-LIVE-19 "marks-fade-in runs 250ms" | RED |
| pre-cure lane | G-LIVE-21 | RED both engines; cured GREEN |

G-LIVE-16's own negative control runs inside the gate every time: an injected
`<input class="cell-native-input">` outside any cell must be judged and must read `ok === false`.

## 3 · Pre-return battery (bare; lane final vs control `74a2b5d9`)

| gate | lane | control |
|---|---|---|
| lint:lanes | 0 | 0 |
| lint:theme-tokens | 0 | 0 |
| lint:sleep | 0 (first run 1: `focus-ring.spec.ts:137`, the reversal's 140 ms, now tagged `sleep-ok`: the elapsed time is the gesture) | 0 |
| test:e2e:projects | 0 (first run 1: `focus-ring.spec.ts` not in `SPEC_MANIFEST`, added; both engines, default dev-server config) | 0 |
| check-pw-projects | 0 (same) | 0 |
| lint:copy | 0 | 0 |
| lint:motion | 0 | 0 |
| lint:knip | 0 | 0 |
| prettier (`npm run lint`) | 0 (first run 1 on 3 src files, drift from earlier passes; written) | 0 |
| eslint . | 0 | 0 |
| vue-tsc | 0 | 0 |

Sources: `logs/prereturn-lane-final.log`, `logs/prereturn-lane-first-3red.log`,
`logs/prereturn-control-74a2b5d9.log`.

## 4 · The charter rows

1. **CLOSED.** G-LIVE-16:
   - One stop per round trip (focus, then 2 rAF, then read).
   - The indicator is judged by `outlineStyle !== none` and a width above 0.
   - The drawn ring must contain the claimed element's centre, and board ink needs strokeOpacity ≥ 0.9.
   - The stranded control runs in the same walk. B6 reds it.
2. **CLOSED.** `--toggle-bleed` `initial-value: 9999px` is a sentinel that fails visibly. B1 reds it,
   and the geometry guard keeps WebKit from drawing a stray ring.
3. **CLOSED.** G-LIVE-19:
   - A source census (no name twice, no nesting, one home each).
   - A recursive CSSOM walk.
   - A masked-fallback scan over estate registrations (`--tw-*` excluded; estate count ≥ 3).
   - No `if`. B2, B3 and B7 red it.
4. **CLOSED by striking.** The peer-cursor pair now reads `var(--color-peer-cursor-ink)` bare. The head
   note names the predicate (`BoardHost.vue:315`). π reads 0 deltas.
5. **CLOSED.** The G-LIVE-20 estate row landed, with B4 as its negative control. The bound is stated.
6. **CLOSED.** The phone table was re-banked (§1).
7. **CLOSED.** The crops were re-taken with the theme held; see §5.
8. **CLOSED.** The sensitivity row sits on every painted figure (§1 and index.css).
9. **CLOSED.** G-LIVE-14 asserts the order in both media arms. B5 reds it.
10. **CLOSED by landing.** G-LIVE-19 reads the `--motion-note` registration (250ms) and a live
    `.pencil-marks` animationDuration of 0.25s. B8 reds it.
11. Grafts:
    - Taken: FACE `paintedExtent` differencing (the chrome arm and forced paint); WALK `isTheRing`;
      TIN's ring-OFF subtraction and core distribution; ABS's readRing recipe.
    - DECLINED: RING_GEOMETRY (gap 8).
12. **OPEN in part.** The multiplayer estate row landed (G-LIVE-17, `?wire=local`, two pages), but
    has no control arm (gap 1). The covering is the chair's.
13. **CLOSED except 60/120 Hz** (gap 3). The dist was built in the tree; the census and the dist suites
    ran; the laminate was raised; `.guard-btn` was reached.
14. Inbound `gameCell.css` rows:
    - LADDER's `marks-fade-in → var(--motion-note)`: present.
    - TIN's fallback strikes: done.
    - ABS's 0.95 cite: rewritten with the painted numbers.
    - GRAPHITE's hunks: NOT carried. Its `--color-focus-sketch` deletion is refused because the token
      IS `--ring-ink`'s value. Its `fill:none` arm would move the binding ground from the fill to
      the paper, and it belongs to the accent section's ballot.
15. **CLOSED.** Every π row and ballot frame carries a codec-minted payload.

Leader duties:
- The rank is re-ruled (§1).
- The forced-colours block is ruled at the surface: the unlayered GameCard rule, with the control
  read once.
- Law 39 is cited (gap 6).

## 5 · Crops (4, each a replacement)

| crop | bytes | retires (pass-4) | caption |
|---|---|---|---|
| `1-toggle-keyboard-activated-ring-light-webkit.png` | 25,532 | `2-toggle-ring-212-keyboard-dark-webkit.png` | Keyboard activation with the theme held light (read after the gesture: dark false, focus-visible, 1 ring). The sparkle phase is uncontrolled. |
| `2-toggle-mouse-activated-no-ring-light-webkit.png` | 20,301 | `3-toggle-mouse-landing-no-ring-dark-webkit.png` | The mouse pair, same theme: focus on body, 0 rings. The sparkle phase is uncontrolled. |
| `3-ballot-alias-095-16x16-cell0-frame-dark-chromium.png` | 8,005 | `4-board-tier2-ink-095-light-chromium.png` | The ballot's alias arm at 0.95 on a 16×16 codec payload, cell 0 on the frame, dark (worst 2.436). |
| `4-forced-colours-deck-card-outline-light-chromium.png` | 41,770 | `1-phone-393x699-dark-coarse-ring-on-tab-chromium.png` | Forced colours, the deck's active card outlined after the cure. The painted differencing reads 3,044 px (control 3,053). |

## 6 · Ballots (both frames on one payload)

- **Ring token, three arms.**
  - (a) Law 23 alias at 0.95: framed here by crop 3. The frame fails at any opacity (2.436–2.98).
  - (b) Two values at 0.95: ABS's arm.
  - (c) Two values at 1.0: ABS builds and frames it. My read is in gap 2. It needs a new invalid rung.
- **Tape over the cells.**
  - Arm A: as shipped, with the G-LIVE-17 numbers above.
  - Arm B: NOT built, so declared.

## 7 · Replay route, incidents, moved rows

**Replay.** IN PLACE: no replay. At the start, the tree equalled `pass4/prototype/MRK-LIVE/pass4.diff`
line for line, and the same 21 paths are touched now, plus `scripts/check-pw-projects.mjs` (the
manifest line).

**Incidents.**
1. `git add -N .` ran in the work tree. It was undone with `git reset -- <3 paths>`; the index is clean.
2. The first chromium G-LIVE-20 red came from reading the DOM before any frame. Snapshots now await
   one rAF.
3. My B8 edit broke the escaping in the break helper mid-battery (a heredoc turned `\n` into real
   newlines). It was repaired within seconds, and B7's restore was verified by sha1.
4. The prettier reformat moved the dist identity (build 1 → build 2), so the dist rows were re-run on
   build 2.
5. The first laminate run asked a cell that wasn't a because-cell. The probe was extended, and the
   run is banked separately.
6. The visible probe could not write its log because the dir was missing. It was banked from stdout.
7. One throwaway `/tmp/x` was written and deleted.
8. Servers were killed by recorded PID (9688, 9691, 73648, 88856). The band shows only foreign
   listeners (4230/4231/4241: w7-control and PLR-SELF).
9. `.mrklive/` and `.vite-cache-mrklive-dev/` were deleted, so `git status` shows product files only.

**Moved rows.** None moved by this lane:
- R1 is booked (the consumer exists).
- Law 39 STANDS.
- L3, L17 and the T8/ledger rows are the chair's.

`instruments/` holds every probe and config that ran; their OUT paths point at this dir.
