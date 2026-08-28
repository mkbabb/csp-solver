# T9-W2 §2.3 + §2.5 + §2.6 — the fold and the tape: the claimed DELTAs

Five before/after pairs, all darwin, chromium, `reducedMotion: reduce`, crops of
`.drawer-case` (the card and its drawn frame — nothing else on the page is claimed).
BEFORE is the pristine tree at `4dd9ec9c` for the five lane files, captured on the same
server minutes before AFTER; every other lane's work is present in both halves, so each
pair isolates this lane alone.

## 1 · `fold-card-rest-1440x900` — the gutter, and who paid for it

A 6px graphite scrollbar now stands in the rail card where darwin handed back an overlay
bar of zero layout width (V7: `gutter 0`; measured after: `gutter 6`). The 6px is taken
out of the card's own `padding-right`, not added to its width: measured at 1440×900 the
card's outer box is `[919, 174.2, 330, 640]` and its content column 290px — both
byte-identical to head — so the centred row does not walk the board and the four pixel
goldens read 4/4. What the crop shows is the card's right INSET: 20px of paper becomes
14px of paper plus a 6px track.

Also visible at rest: the card's foot. `padding-bottom` goes 20px → 3.5rem, which is the
note berth (see 4). The action bar is unmoved; the band below it is the bar's own skirt,
already painted from the same measurement (`--card-pad-b`).

## 2 · `fold-card-mid-1440x900` — both clip edges become chrome

`scrollTop 327`. BEFORE: the difficulty chips are guillotined at the case edge, whole and
legible right up to the cut, and the `new game` tape has scrolled away with its well while
92% of that well is still on screen (T9-M03, the owner's mark). AFTER: the tape is PINNED
at the case edge and the chips dissolve into card colour under the top sentinel — solid
across the card's padding band, fading over 2rem below it. The bottom fade is deepened
0.9rem → 2rem to mirror it.

## 3 · `fold-card-end-1440x900` — the fade is honest

Scrolled to the end. BEFORE: the bar's fade paints anyway, so the last row reads
half-erased under a dissolve with nothing left to hide. AFTER: `data-fold-below` is off and
the band is not painted — the last row reads whole. (The top fade is on in both, because
there is something above.)

## 4 · `tape-berth-1440x900` — the tape lane law

Hovering `fill`. BEFORE: the note lies across the `play` verb (V7: 57.4% of the Play entry;
the other three bar verbs 16.9 / 23.6 / 17.4%, and the invite verb's note 68.4% of the
`Live` option). AFTER: every hover note in the card — the four bar verbs' and the invite
verb's — is laid in ONE berth under the bar's rule, inside the card's reserved foot. That
band is between the scrollport's content edge and its padding edge, so no scroll offset can
put a control in it: the note covers air by construction rather than by pricing.

## 5 · `fold-drawer-375x667` — the drawer's residue clip

The sheet open, the card scrolled 66px. BEFORE: the `new game` tape hangs 0.05px off the
case edge and is shorn by it (V7's 32–97px residue class). AFTER: the same tape pins inside
the card's own top band and reads whole. One mechanism, both regimes.

## What did NOT move

`.control-panel-wrap` height at the iPad coarse cell (1280×800, `pointer: coarse`):
**1227.27 → 1227.09** against the P1 seal of 1227.5. The tape's pull and give-back are
exactly equal (net flow height zero) and the wells' vertical padding is re-cut, not grown
(0.9rem in, 0.9rem out), because that seal had 0.23px of headroom at head and the wave has
no licence to spend it.
