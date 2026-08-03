# W7 · invite vs share, one glyph — the invite gets its own mark

**Row**: "Invite vs share, one glyph" (Copy and iconography).
**Surface**: the dev server (vite, `web/frontend`, port 4230), chromium, 1440×900, DSF 2, both themes.
**Discipline**: crops, chair's look. No gate.

## The defect, as it rendered

`GameControlPanel.vue` drew `ShareIcon` at both acts — the players well's
"Play together on this board" and the action bar's "Share board link" — so the two verbs were
byte-identical glyphs about 120px apart in one card, which is the one place a reader compares
them. See `invite-glyph-detail-before-*.png`: the same three-pip graph twice.

## The cure

New `src/pencil/chrome/icons/InviteIcon.vue`; the invite site swaps to it. Share is untouched —
the link graph still means "a link, sent." Nothing else in the card changed.

## The two candidates

Both were drawn to the family's hand first, measured off the existing set: outline strokes at
1.7 with round caps and joins and no fill (Hint / FillForced / Eraser), heads as solid circles
in the dice-pip vocabulary (Share / Eraser), every pair a hair uneven, nothing mirrored.

- **A — two figures at a table** (`invite-glyph-*-candidate-a-*.png`). A bowed table rule,
  heavier than the figures, two legs splayed unequally; both torsos run out just above the
  table's edge, which is what puts the figures *at* it. The right one smaller and a touch
  lower — the one who joined.
- **B — the pair, leaning in** (`invite-glyph-*-candidate-b-*.png`). No table: two figures
  tilted toward each other, the second set back, drawn larger in the box.

## The call, and why

**A ships.** Two reasons, in that order:

1. **It reads in place.** The glyph only ever renders at 26px, and that is the size the crops
   were taken at. A resolves into two heads over a horizontal rule — a scene. B collapses into
   a single stroke-blob that reads as a lowercase letterform before it reads as two people
   (`invite-glyph-detail-candidate-b-1440x900-light.png`); the tilt that makes it warm at 72px
   is what closes it up at 26.
2. **It's the family's register.** This estate's icons are scenes, not pictograms — the eraser
   has crumbs, the dice are two dice at two angles, the bulb throws sparks. A table is the same
   kind of specific. It also says the thing the well's own copy says ("everyone writes on the
   same grid") rather than the generic "contacts" B risks.

The chair can swap to B from the crops: `invite-glyph-candidate-b.vue.txt` beside this file is
the whole component as captured, a drop-in replacement for `InviteIcon.vue`.

## Crops

| file | what |
| --- | --- |
| `invite-glyph-before-1440x900-{light,dark}.png` | the card, both glyphs identical |
| `invite-glyph-after-1440x900-{light,dark}.png` | the card, invite re-marked (A) |
| `invite-glyph-detail-before-1440x900-{light,dark}.png` | tight on both glyphs, before |
| `invite-glyph-detail-after-1440x900-{light,dark}.png` | tight on both glyphs, after |
| `invite-glyph-detail-candidate-{a,b}-1440x900-{light,dark}.png` | the two marks in situ |
| `invite-glyph-candidate-{a,b}-1440x900-{light,dark}.png` | the card with each candidate |

The invite button's *sublabel* sits under the sticky action bar in every crop. That's the
sticky-bar sliver row, not this one — it's the same defect W7's layout section owns, captured
here because the two glyphs can't be framed together without it.
