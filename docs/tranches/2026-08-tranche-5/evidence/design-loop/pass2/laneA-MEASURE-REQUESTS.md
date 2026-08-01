# LANE A — MEASURE REQUESTS (F4 prime, pass 2)

Worktree: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_6e1b18f4-0f2-1`
Build: `cd web/frontend && npm run build` (vue-tsc + vite, green at time of writing).
Serve: `npx vite preview --port <free>` — the rig used 4931. Never the dev ports.

Everything below is on the BUILT dist. Nothing here was measured on real Safari or on the
`perf-rig-iphone16` sim by this lane — headless WebKit is all Lane A ran, and this campaign's
premise is that a green Playwright-WebKit battery is exactly the evidence the owner's word
overrules. These are the rows that need the real device.

---

## M1 · The re-deal cost, on device, as gestures (the deciding number)

Lane A measured taps headlessly and found the picker LOSES the everyday re-deal to today's
drawer (3 taps vs 2, plus a 1240ms fold). That number needs the device because on a phone the
drawer path also costs a SCROLL, which a tap count does not price.

Capture on `perf-rig-iphone16` (375×667 and the real 393×852), sudoku, drawer at rest:

| row | what to capture | Lane A's headless number |
|---|---|---|
| M1a | "same game, harder" via the controls card: video + gesture count incl. scroll distance in px and time-to-dealt-board | staged zone's top at y=578.8 of a 667 viewport, page scrollHeight 1180 → the Deal control is below the fold |
| M1b | same via the picker band: gestures + time-to-dealt-board | 3 taps (wordmark · level chip · deal), no scroll, deck+band fit in 667 with 12px spare |
| M1c | "kenken at 6×6 hard, from sudoku" both ways: gestures, time, and how many boards get generated | band 3 taps / 1 generate · drawer 6+ taps / 2 generates (one thrown away) |

**Threshold**: M1b must not be slower *in wall-clock* than M1a on device even though it costs one
more tap, or the picker's re-deal claim is dead and the strip question re-opens.
**Negative control**: run M1a with the drawer scrolled already-open and in view — if the drawer
still wins on device, say so.

## M2 · The band's paint cost during the fold (mark 4)

The band mounts one `HandDrawnOutline` at `:pose="0"` and enrols no beat. Claimed: zero paint at
rest, zero re-bake per snap.

- **Capture**: WebKit paint-timeline / Safari Web Inspector timeline over (a) picker idle 5s,
  (b) five snaps left→right, (c) the 520ms unfold after `deal`.
- **Threshold**: idle paints 0/s (the T3-W13 prod floor); per-snap `HandDrawnOutline` path
  regenerations 0 for the band's instance.
- **Negative control**: same three captures with `--staging-reserve: 0` forced — if the band's
  box moves at all on a snap, the regen count must rise. If it does not rise in EITHER run, the
  reservation is confirmed decorative (see the report's honest §3 finding).

## M3 · Coarse target reality

Headless says 44.0px for both the band's chips and its verbs at `pointer: coarse`. Confirm on
glass, and capture a thumb-reach photo/overlay: the verbs sit at the BOTTOM of the deck column,
which is the good half of the thumb arc — verify, don't assume.

## M4 · The blind read (the verb model) — DO NOT CAPTION

Two crops already exist, no labels, both engines:
`laneA-shots/blind-A-{chromium,webkit}.png` · `laneA-shots/blind-B-{chromium,webkit}.png`

Show them to a reader who has not seen this dossier, one at a time, and ask exactly:
1. "Which of these two acts would lose work you had already done?"
2. "What is different between picture A and picture B?"

**Pass**: the reader names `deal` for (1), and for (2) says something equivalent to "one has a
game already going". **Fail**: any hesitation on (1), or `resume`/`start` read as the destructive
one. Record the raw words, not a verdict.

## M5 · The shipped WebKit carousel defect (NOT this lane's diff — but it blocks the deliverable)

Reproduced headlessly, band-independent (also reproduces with `.staging-band` removed from the
DOM before the gesture), WebKit only, Chromium correct on every path:

- a 4th `ArrowRight` from card 0 lands on **card 2**, not card 4;
- `End` lands on card 4 and reverts to card 2 within ~400ms;
- opening the picker while PLAYING kenken (`jumpTo(4)`) centers **thermo**;
- native scroll-snap (the swipe) is correct on all five cards.

⇒ `useCarouselGlide`'s programmatic glide races WebKit's snap; `syncFromScroll` wins with a
stale index.

**Capture on real Safari (desktop AND iOS)**: does the same reversion happen with a finger and
with a keyboard? On iOS the swipe is the only navigation, so the defect may be invisible to a
touch user and fatal to a keyboard/VoiceOver user. This is the highest-value row here that is
not Lane A's own work — it means "open the picker on your current game" is broken for kenken on
Safari today, shipped.

## M6 · Screens the measurer should re-shoot on device

`?view=gallery` on sudoku and on kenken, at 375×667 / 393×852 / 1440×900, light and dark:
the band's frame stroke, the chip scribble underlines, and the two verbs' borders are all
hairline work that the low-res mark (design-refinement-marks §4) may bite. Compare against
`laneA-shots/{chromium,webkit}-375-deck-sudoku.png` and `-1440-deck-after-deal.png`.
