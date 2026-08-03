# W7 — THE PRODUCT POLISH

The gestalt lens's non-critical finds — real, user-visible, none blocking, all measured
against the built artifact. Grouped so a batch can take them together. Each is design work;
the DesignSync/frontend-design plugin owns the visual calls, the chair adjudicates.

## Layout

- **The sticky-bar sliver** (HIGH-adjacent): the controls `.action-bar` sits 20px above the
  card's own bottom edge at every desktop width, so a fragment of the next content always
  bleeds beneath the toolbar (captured: "how your marks are writt", "Corner", "pencils"). At
  1280×720 the Deal button is 34% covered and its sublabel swallowed. Sibling of A1 (W2) —
  the same bar, the same missing `scroll-padding-bottom` — but this half is the visual bleed,
  not the focus occlusion. Make the bar flush with the scroll viewport's bottom.
- **The 390-wide drawer-tab over the wordmark**: sheet-open at 390×844, the tab covers the
  wordmark's final letter ("sudok"). Both engines, 390-wide class only (clean at 430/820/768).
  Dock the sheet-open tab clear of the masthead's measured box at ≤400px. (A5 in W2 confirmed
  it is not an a11y target-occlusion — the tab meets 44×44 — so it lands here as a visual row.)
- **The 768/720-tall overflow**: 9–10px page overflow at 1366×768, 1280×720, 1024×768 — a
  phantom scrollbar and the board caption sliced. Clean at 900/1080. Trace the ~10px constant
  and add a 768-tall row to the viewport matrix.
- **`--live-fit` width-only** (the "Ledger it deliberately" order, finally executed): at
  390×844 the live center face crops a taller-than-wide board because `App.vue:330` derives the
  fit from width alone. Add a height term or a clamp.

## Copy and iconography

- **KenKen's clear-receipt**: every zero-given deal (69% of kenken deals) announces "the board
  is clear" — the wipe receipt, not a deal receipt — because `GameBoard.vue:648` gates on
  `givenCells.size === 0` and kenken deals zero givens. Give the no-givens family its own
  fresh-board line; gate the clear receipt on an actual clear act.
- **Invite vs share, one glyph**: "Play together on this board" and "Share board link" render
  byte-identical SVG, visible in the same card. Give the invite its own mark (two figures / a
  table) or merge the two acts. (Also relevant to W5's affordance section.)

## Celebration

- **The heart clips the last cell**: the completion heart lands on the bottom-right cell's
  digit. Offset it outside the board's last cell.
- **The post-solve stale nag**: after "solved it!", the teacher's zone still reads "board
  changed — ask again." Suppress the stale-check nag on a completed board. (The a11y half —
  the concatenated string — retired in W2's audit as a probe artifact; only the visual nag remains.)

## Legibility (owner-eye)

- **Killer sums at 14px on mobile** against 33 cages — dense even in the correct theme. A
  minimum rendered-height floor per board width would settle it. **OWNER** call; default = leave.
- **The font-subset residue** (T7-R10 / P1-D7): Patrick Hand's cut lacks `:`/`+`/`÷`·`A`,
  Fraunces lacks `v` — documented only in a spec docstring. **OWNER**: the woff2 re-cut the
  owner declined at P1-W3, or accept the documented deviations. Default = accept.

## Landscape (CH-39, folded here)

The <1024 landscape presentation was ratified at T5-W4 (charter c). If the owner reaffirms,
CH-39 retires; if not, a landscape/rotation structural pass lands here. **OWNER**; default = ratified.

## Acceptance

The layout and copy/icon rows cured with before/after crops on the real surface, chair-looked;
the celebration rows fixed; the owner-eye and OWNER-default rows resolved by the owner's word or
their stated default. No new gate is mandatory here — these are visual, and the discipline is
crops + the chair's look, per the estate's design loop — but the kenken-receipt fix carries a
cheap unit assertion (a zero-given deal announces a fresh-board line, not a clear).
