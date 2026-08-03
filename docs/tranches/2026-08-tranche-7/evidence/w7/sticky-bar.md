# T7-W7 — the sticky bar's flush + the washi z-order

Two halves of one row, both in the controls card, both cured in `GameControlPanel.vue`.

Surface: the **vite dev server** (`web/frontend`, port 4237), chromium, `?game=sudoku`, the rail
drawer at its resting OPEN pose, the card scrolled to 62% of its own overflow so live content
sits under the bar. Not the built dist — this is a design row, and the discipline is crops plus
the chair's look.

## Crops

| file | what it shows |
| --- | --- |
| `sticky-bar-before-1440x900.png` / `sticky-bar-after-1440x900.png` | the bar region — bleed band + the tape |
| `sticky-bar-before-1280x720.png` / `sticky-bar-after-1280x720.png` | same, the tighter width |

The before pair was taken against a **pristine tree** (the file checked out to HEAD for the
capture, restored after), so nothing in it is my own half-landed work. One unrelated difference
rides the pair: a sibling W7 executor's invite glyph landed in the same file between the two
captures — it is a scrolled-under button, outside the bar region, and touches neither half of
this row.

Read the before crops bottom-up: under the verbs, a severed line of the next control bleeding
through (`board changed — ask again` at 1440, `Live` at 1280), and at 1440 the tape *invite
someone to write on this board with you* laid straight across the clear/fill/solve/share
sublabels. In the after crops the band is card, uninterrupted, and the tape stops at the bar's
top edge.

## Numbers

`sticky-bar-before.json` / `sticky-bar-after.json` (geometry, per viewport) and
`sticky-bar-paint-probe.json` (the A/B, one page load, the cure's two declarations struck by an
injected sheet so both states are read off the same tree).

| | 1440×900 | 1280×720 |
| --- | --- | --- |
| the leftover band | 20.00px | 20.00px |
| card `padding-bottom` | 20px | 20px |
| band's paint, before (5 sample points) | `button.ctrl-btn` ×5 | `button.ctrl-btn` ×5 |
| band's paint, after | `action-bar` ×5 | `action-bar` ×5 |
| bar z / max tape z, before | 3 / 50 | 3 / 50 |
| bar z / max tape z, after | 60 / 50 | 60 / 50 |
| tape overlap into the bar, before | 20.26px | 10.43px |
| `scrollHeight` / `maxScroll` | unchanged across the cure | unchanged across the cure |

The band is the card's own `padding-bottom` to the hundredth at both widths — it was never a
tuning. A sticky box is constrained to its **containing block** (the card's content box) while
the scrollport it sticks to is the card's **padding box**, so `bottom: 0` stopped the bar exactly
one padding short of the edge, and a scroll container does not clip its content out of its own
padding. The five before sample points land on a live `.ctrl-btn`: the bleed was not only
visible, it was clickable.

## The cure

- **The flush** — `.action-bar::after`, a strip `var(--card-pad-b)` tall hanging off the bar's
  bottom edge in `--color-card`, inside the sticky media block (the `<1024` landscape bar has
  siblings below it, where a skirt would paint over the play tools). `--card-pad-b` is published
  by the bar's own ResizeObserver from the card's computed padding — measured, never spelled,
  since that padding is a utility class on `GameScene.vue`'s template (`p-5` rail / `px-2 py-1.5`
  dock). Not `pointer-events: none`: what the sliver showed was pressable, and a control you
  cannot see must not be one you can press.
- **The z-order** — the bar 3 → 60, clearing `SheetWashiLabel`'s 50 inside the card's own
  `z-45` stacking context. The three older relations it was chosen for (outline 1, `washi-tag` 2)
  hold; the bar's OWN tapes are children of its stacking context and still ride above it. The
  pair is noted at both ends — `SheetWashiLabel.vue`'s 50 carries the cross-reference.

Three geometric cures were tried on the real surface first and are ledgered in the style block:
`margin-bottom: -20px` + equal padding is MEASURED INERT (Chrome constrains the sticky *border*
box, so the bar grew upward, top 598.64 → 578.64, bottom unmoved at 663.45); `bottom: -20px` is a
no-op behind the same constraint; zeroing the card's padding is the only true geometry and costs a
spelled constant against a Tailwind class in a second file — the drift W2 refused.

## What did not move

- **W2's `scroll-padding-bottom`** — untouched, and so is the publisher's formula: the band the
  bar owns is still `bar height + card padding-bottom`, still 86px at 1440 / 85px at 1280.
- **Layout** — `scrollHeight` 1113 and `maxScroll` 585 hold across the cure at 1280×720 (1116/476
  at 1440 under the sibling's concurrent content; identical before-to-after in both).
- **`zone-grammar.spec.ts`'s bar row** — it asserts `bar.bottom − card.bottom ≤ 1` and
  `position: sticky`. No box moved; the reading is −20 before and after.
- **Regimes** — probed at 390×844 (portrait dock: skirt 6px against a 6px pad, `pageMaxScroll`
  still 0), 844×390 (landscape: no skirt generated, bar back to `position: relative`), 1024×768
  (rail floor: skirt 20px, flush).
- **Theme** — the skirt takes `--color-card`, the bar's own token: `rgb(253,253,252)` light,
  `rgb(19,18,17)` dark, identical to card and bar in both. The card's 12px bottom radius clips it.
