# PLR-SELF · pass 6 — ADVERSARIAL CRITIQUE

§11's leader. Prototype: worktree `.claude/worktrees/w7-p4-PLR-SELF`, branch `w7/p4-plr-self`, base and π
control `74a2b5d9`, uncommitted, 24 product files (+1,901 / −402). I wrote neither the charter nor the
prototype. The pass-6 number is mine.

**Verdict: ADVANCE. Convergence 89 % (from 86).**

The pass closes the three defects that held pass 5. The measured key ends the 390×800 cliff. The edge
row now reads paint, and X1/X2 red it. L5b reds at the pass-4 site. It also builds both ballot arms
the owner was owed (the quiet edge, the seam's (b)) and takes the corners from the ground. Four new
defects keep it under 90, all of the "moved, not cured" or "cannot fail" kind:

- **The measured key is still a proxy on one axis.** `board.left <= rowsStart` decides "under the rows",
  and a centred board at 768×1024 coarse (board left 50, rows start at 18) keeps four rows over 3
  cells where one row laps 0.
- **The key goes stale while the sheet is open.** It is read at the open and on a room change only. A
  height-only resize 390×844 → 390×800 leaves four rows over 7 cells until the sheet is reopened.
- **The paint row reads the top band only.** With the bottom 16 px of the edge erased (the side that
  meets the board), the landed row reads 2/2 GREEN. With the edge faded to 40 % or 50 %, WebKit stays
  GREEN.
- **The seam's click guard is keyed on a value WebKit does not send.** A touch-generated click in
  WebKit carries `pointerType: "mouse"`, so arm (b) holds in WebKit only because the click is absent.
  And a tap on a row inside the open sheet sends focus to BODY and shuts the sheet, in both engines.

| my rig | |
|---|---|
| servers | tree dev `:4244` (two-line config, cacheDir `scratchpad/plrself-crit6/vc-dev`, outside the tree) · control dist `:4245` (`w7-control`, its own `.vite-control.config.ts`, verified `index-CubiZsMVSwTc.js` by hash) · my rebuilt dist `:4246` (`index-ClQ9zdg0iHHI.js`). Killed by recorded PID: listeners 87299 / 87297 / 87301, npx 87218 / 87219 / 87220. Siblings on 4237–4240 untouched |
| dist | rebuilt by me after the lane's last edit, scratch outside the tree: **`index-ClQ9zdg0iHHI.js`, 43 files, `diff -rq` byte-identical to the lane's `dist-full`**. The cited FULL dist is the tree. The QUIET dist (`DtXPs5DQ4FGs`) I did not rebuild. It differs from FULL in exactly the index JS/CSS and the chunks that import it |
| instruments | `critique/PLR-SELF/instruments/`: `c6-crit.spec.ts` (band, rotate-while-open, seam events, slide-off, the edge statistic per band under plants), `c7-edge.spec.ts` (edge blind spots), `c8-filters.spec.ts` (dist vs control, both themes), `c9-sweep.spec.ts` (widths), `crit-breaks.py` (plants in the tree's files against the LANDED rows, restored and sha1-verified). Readings summarised under `readings/` |
| crops | none minted. Every claim below is a number |

---

## 0 · Gaps first (each closable, numbers attached)

1. **The "board under the rows" clause is a one-axis proxy, and a portrait tablet falls on the desk's
   side of it.** `cramped = board.left <= rowsStart && board.top < bottom`. The rows start at x = 18 at
   every width. At 768×1024 coarse, both engines, the board's left is 50, so it reads as "beside": 4
   rows, sheet bottom 226.5, board top 168.9 / 168.6, **3 cells lapped where one row (bottom ≈ 159)
   laps 0**. The board runs under x 50–238 of the rows' 18–238 span there, exactly as on the desk
   (board left 128–132). The clause separates the phone from the desk only because the desk's board
   happens to start later. **Close it** with the third fact the README names for landscape (how much
   of the rows' span the board runs under, or the ratified desk pose named by its own key), and a
   landed 768×1024 coarse row that goes RED under today's clause.
2. **The budget goes stale when the space changes under an open sheet.** `fit()` runs on `isOpen` and
   `people.length` only. There is no resize or ResizeObserver path. Both engines:
   - 390×844 → 390×800 with the sheet open: it **stays open with 4 rows, bottom 214.5, board top
     199.7 / 199.4, 7 cells lapped**. Reopening re-fits to 1 row, lap 0.
   - A width change (844×390 ↔ 390×800) happens to shut the sheet, so it hides the defect.

   This is LAWS P5's "a berth keyed on a reading taken once" class. **Close it** by re-fitting on
   resize at rest (publish on `transitionend` and at rest, not every frame), with a landed row: open at
   390×844, resize to 390×800, and expect 1 row and lap 0.
3. **The re-cut paint row (`player-mark.spec.ts:675`, the charter's `:566`) reads one side of four.**
   Plants in `HeadSheet.vue` against the landed row, restored with sha1 `36b1a03e44` OK after each:

   | plant | landed row | my per-band reading (frac ON ≥ 1.5×OFF / ON median) |
   |---|---|---|
   | pass-5 X1 `opacity: 0` | **RED ×2** (0) | top 0 / 1.00, bottom 0 / 1.00 |
   | pass-5 X2 `color: transparent` | **RED ×2** (0) | same |
   | **X6** `clip-path: inset(-4px -4px 16px -4px)` (the bottom edge gone, top and sides intact) | **GREEN ×2** | top 0.856–0.895 (dev in-page), **bottom 0 / 1.00** on both sheets, both engines |
   | **X7** `opacity: 0.5` | ch RED (0.882) · **wk GREEN** | card top median 3.46 / 3.25, **bottom 2.44 / 2.42** |
   | **X5** `opacity: 0.4` | ch RED (0.850) · **wk GREEN** | lobby top 2.56 / 2.44, bottom 2.17 |

   The bottom edge is the one that meets the board, which is where the outside-edge row lives. No
   landed row holds the edge's contrast either. The §2.4 stroke floor (core median ≥ 3.0) is a number
   in the record, and an edge at 2.2–2.4 : 1 passes WebKit. **Close it** by reading all four bands (or
   the frame's perimeter) against edge-OFF, with X6 as the in-run negative. Add a core-median ≥ 3.0
   floor per band that both owner arms clear: FULL 7.9–17.5, QUIET 4.3–5.6 on the top band. X5 and X7
   are its negatives.
4. **The seam's click guard can't recognise a WebKit touch click.** Event log on a plain cell tap,
   390×844 coarse: Chromium's click is `PointerEvent pointerType "touch"`, but **WebKit's is
   `PointerEvent pointerType "mouse"`**. `onClick` ignores a click only when `pointerType === "touch"`,
   so arm (b) opens once in WebKit only because WebKit's emulation sends no click after a prevented
   touch `pointerdown`. That is an absence, not a guard, and S3 "reds Chromium only" for this reason.
   If a real iOS WebKit sends that click (M19, unmeasured), `pointerup` opens the sheet and the click
   shuts it. **Close it** with a guard keyed on the event sequence (a flag set in `onRelease`, cleared
   by the next click or the next task), plus a planted-click row in WebKit that dispatches a
   `pointerType: "mouse"` click after the tap and expects one toggle.
5. **Under (b), touching the sheet is still a look-away, in both engines.** With the sheet open at
   390×844 coarse, a tap on a row (`span.pl-name`) sends focus to **BODY in Chromium AND WebKit**, and
   the sheet shuts. The README's "WebKit focuses the cell beneath" holds for a tap 2 px inside the
   edge, not for a tap on a row. The room hears `null`, and the reader's own ring leaves every board
   the moment they touch the list they opened. **Close it** by preventing the touch's `pointerdown` on
   the sheet under `TAP_IS_A_LOOK`, as on the mark, with a landed row: tap a row, the cell keeps focus,
   0 `cur` frames.
6. **The dark reading of the state line is outside T9-R6 and unbooked.** T9-R6 is "the hand's LIGHT
   tag rung" (pass6/CHAIR-RULINGS §1.4). In dark, the state line's core median passes (5.50–6.10), but
   its fraction under 4.5 is **0.232 / 0.214 at DPR 1** (qualifier 0.183 / 0.236). The control's caption
   reads **0.037 / 0.030**, so the "control + slack" bound fails by about 0.19 unless the slack is set
   that wide. The lane cites T9-R6 for both themes. **Close it** by booking the dark fraction as its own
   estate row, or by widening T9-R6 with the chair's word, or by moving the line's dark ink one rung.
   These are the lane's numbers (`readings/aa-glyph-text.txt`, second photograph identical). I didn't
   re-run AA.
7. **The light glyph-text median fails and stays the estate's**: state line 3.515 / 3.246 at DPR 1
   (the control caption reads 2.974 / 2.937). Cited as T9-R6. It is still an open number on this
   surface.
8. **`--tap-floor` is bare in the chair's census.** `PlayerMark.vue:335/336` reads `var(--tap-floor)`,
   declared on App's page root. The census on the tree exits 1 with **2 bare** (control: 0 bare, plus
   the inherited STALE row on both). The INHERITED row is a PROPOSED diff. Every other consumer in the
   tree writes `var(--tap-floor, 2.75rem)`. **Close it** when the chair lands the row, or by declaring
   the token where the census resolves it.
9. **The frame's radius is a literal derived from two other values.** `:radius="15"` is `1rem − 1px`
   hard-coded against `border-radius: 1rem`. Under a root font other than 16 px, the ground's corner
   moves and the frame's doesn't. This is LAWS P5's "a derived geometry token reads the live value,
   never a literal". **Close it** by deriving the radius from the ground's computed radius, or by stating
   the 16 px root as the regime.
10. **Landscape is priced, not cured** (the lane's gap 1): 844×390 9×9 laps 6 vs 4 for one row, 812×375
    5 vs 3, 16×16 9 vs 6 and 18 vs 12. It shares gap 1's missing third fact.
11. **Unpriced desk and phablet laps.** 800×700 fine keeps 4 rows over **6 cells** (board left 132), where
    CH-71's ratified corner lap is read at 1280 only (2–3). Portrait 520–700 × 800 coarse compresses to
    one row and still laps **5 / 5 / 8 / 4 cells** (the 390×664 class: one row is the floor). Both
    engines. These go in the record as the sheet's floor, or the owner is shown the band.
12. **The quiet edge arm is thin** (the lane's gap 3, U-10): light 22–26 % of columns under 3.0 against
    FULL's 3.9–5.2 %. It travels with the ballot.
13. **Nothing standing reads the head is half closed** (the lane's gap 4). With gap 3 open, the one paint
    row reads the top band only.
14. **The seam crop carries a second variable, declared**: each arm's slugs are the pages' random ids
    (`homely-quelea` vs `minimal-ferret`). Pinning the ids makes the pair strict. It is forwardable
    with the caption, as pass 5's F1 crop was.
15. **Carried, inherited, unmoved:** room rows dev-vs-dev (W8 §8.3); COUNT's and PLACE's leader rows
    unseen (batch 5); `visual-regression.spec.ts:790` WebKit (T9-R3); the dark filter count 11 on both
    arms (the chair's `crayon-heart` pick); STALE `--refuse-dur`; `multiplayer.spec.ts:962` env-gated;
    the accent-family law; r0 I4/I5; M19 real iOS (now carrying gap 4's double-toggle risk); the
    keyboard reader still tells the room `null` under both seam arms (Tab leaves the cell, stated in
    the code); the pose floor (U-10).

---

## 1 · What I re-measured (both engines, my own instruments)

### R1 — the dist is the tree
I rebuilt from the worktree after the lane's last edit: `index-ClQ9zdg0iHHI.js`, 43 files,
**byte-identical** to the lane's `dist-full`. Served on `:4246` and verified by hash, beside the
control `:4245` (`index-CubiZsMVSwTc.js`).

### R2 — the band (`c6-crit` C1, dev, seven at the table, coarse witnessed) reproduces the README

| cell | ch rows / bottom / board top / lapped | wk |
|---|---|---|
| 390×800 | 1 / 147.4 / 199.7 / **0** | 1 / 147.4 / 199.4 / **0** |
| 360×800 | 1 / 147.4 / 210.3 / **0** | 1 / 147.4 / 210.0 / **0** |
| 390×664 | 1 / 147.4 / 131.7 / 7 | 1 / 147.4 / 131.4 / 7 |
| 844×390 | 4 / 226.5 / 16 (left 241) / 6 | same |

The pass-5 cliff is gone at both 800-px cells. Plant P5R1 (the pass-5 query as the key) reds the
landed row ×2 (`390x800` diff), so the row can fail on its own regression.

### R3 — the key under a resize and across widths (`c6-crit` C2, `c9-sweep`) → gaps 1, 2, 11

| case | reading (ch; wk agrees to 0.6 px) |
|---|---|
| open 390×844 → resize 390×800 | open, **4 rows, bottom 214.5, board top 199.7, lapped 7**; reopen → 1 row, lap 0 |
| open 844×390 → 390×800 | the sheet shuts (the width change swaps the head instance); reopen 1 row, lap 0 |
| open 390×800 → 844×390 | shuts; reopen 4 rows, lap 6 |
| 440 / 460 / 480 × 800 coarse | 1 row, lap 0 |
| 520 / 560 / 620 / 700 × 800 coarse | 1 row (bottom 159.4), lap **5 / 5 / 8 / 4** |
| **768×1024 coarse** | **4 rows, bottom 226.5, board top 168.9, board left 50 > rowsStart 18, lapped 3** |
| 600×700 fine | 1 row, lap 8 |
| 800×700 fine | 4 rows, board left 132, **lapped 6** |
| 900×640 fine | 4 rows, lapped 2 / 3 |

### R4 — the seam, event-level (`c6-crit` C3, C4) → gaps 4, 5

- **The mark tap under (b), both engines:** `pointerdown:touch` (prevented) → `pointerup:touch`, focus
  stays `INPUT[cell]`, the sheet opens. The lane's claim reproduces.
- **The click's pointerType for a touch tap on a cell:** Chromium `touch`, **WebKit `mouse`**.
- **A row tap inside the open sheet:** focus **BODY ×2**, `aria-expanded` false ×2.
- **Chromium CDP slide-off** (touchStart on the mark, moving 120 px sideways or 300 px down): a
  `pointercancel`, no toggle. A tap without moving toggles. So `pointerup` doesn't open the sheet on a
  drag. Clear.

### R5 — the edge row under plants (`crit-breaks.py` on the landed row; `c6/c7` in-page) → gap 3

This is the table in gap 3. The lane's figures reproduce exactly where the rigs overlap: FULL card top
median **16.14** (ch) and lobby **17.52** (ch), dev here, dist there. The pass-5 plants X1/X2 now red
the row ×2, which cures the pass-5 gap.

### R6 — filters, the estate rule, on MY rebuilt dist vs the control (`c8-filters`)

| shut / card / lobby | light | dark |
|---|---|---|
| control (ch, wk) | 9 / 9 / – | 11 / 11 / – |
| tree `ClQ9zdg0iHHI` (ch, wk) | **9 / 9 / 9** | **11 / 11 / 11** |

**The filterBudget doesn't grow.** The dark 11 is the control's own (the chair's pick).

### R7 — L5b (the chair's instrument) and its plants

The tree reads **GREEN** (8 sites) and the control reads **RED** (exit 1). Plants A–H (`l5b.plants.mjs`)
each red, including **B, the pass-4 border at `.player-lobby`**. That cures the pass-5 gap. Structural
limit: it reads `src/pencil/chrome` only, so a border planted from `index.css` or App's `<style>` onto
`.head-sheet` is out of its sight. The e2e row's computed-border half (B5) covers that route.

### R8 — gates, bare, tree / control → `readings/gates-bare.txt`

`check-copy-register` 0/0 (0 dashes, 0 unadmitted: **M16 holds**) · `check-sleep-lint` 0/0 ·
`check-lane-membership` 0/0 · `check-theme-tokens` 0/0 · `check-pw-projects` 0/0 · `npm run lint` form
(scoped prettier) tree 0 · `eslint .` tree 0 · `check-property-block` (source + served dist) 0/0 ·
undefined-token census tree **1 (2 bare `--tap-floor` + STALE)** / control 1 (STALE only) ·
`player-mark.spec.ts` whole file, both engines, after every restore: **24 / 24**. I didn't re-run
vitest or vue-tsc; those are the lane's (830 / 0, 0 / 0).

### R9 — the constraints
- **@property**: no new registration. `check-property-block` GREEN.
- **Undefined tokens**: gap 8.
- **π**: the lane's whole-DOM census (noise 0 in 16 readings, 14 deltas + 48 only-mine, all claimed) is
  not re-run. My reads of the card box and edge agree with it.
- **W2's mechanics**: untouched. The seam is a pointer policy on the mark, not a new mechanic.
- **Decided history**: L3 spent, L17 cited, law 39 adopted, L5b MOVED to the chair. No r0 row is
  re-worded.
- **AA**: gaps 6 and 7.

---

## 2 · Strengths

- **The key is MEASURED, and its paint is proven.** The media query is deleted, the tall sheet is read
  off its own untransformed box, and a 29-character wrapped slug enters the budget without any
  arithmetic. The no-flash sampler shows 0 tall frames painted. The pass-5 cliff is gone in both
  engines, and the pass-5 plant reds the landed row.
- **Both of the owner's missing arms are built behind one const each** (`EDGE_QUIET`, `TAP_IS_A_LOOK`).
  Crop 1 is a lawful pair: one payload, one variable, the mark in both arms. I looked at it. The only
  difference between the halves is the edge's weight.
- **The corners are the ground's.** 67–70 → 1 of 106 px moved.
- **F1 has one name in one home**, and the unit is re-cut until U1/U2 red it (the first cut could not
  fail and was declared).
- **The pass-5 cannot-fail rows are cured on their own plants**: X1/X2 red the paint row, and plant B
  reds L5b.
- **Incidents self-declared in full**, including an unquoted-heredoc slip that ran a bare `rm` with no
  operand.

## 3 · Failure-mode checklist

| item | verdict |
|---|---|
| vacuous convergence | **HIT (partial)**: the paint row passes with the bottom edge erased (X6, 2/2 GREEN) and with a 40–50 % edge in WebKit (X5, X7) |
| spec-cites-itself circularity | minor: the band row's "pass5 key FALSE at 390×800" witness evaluates the spec's own query string. The product-side negative (P5R1) does red, so it's not load-bearing |
| gates that cannot fail | **HIT**: the paint row on the bottom band (X6) and on contrast (X5/X7 in WebKit). No landed row reads resize (gap 2) or a sheet-row tap (gap 5) |
| elegant-reduction trap | **HIT**: "a third fact the key does not read" is left undone. It prices landscape (6 vs 4) and silently costs 768×1024 portrait (3 vs 0) |
| legacy aliases | clear: `SELF_TAKES_ROOM_INK` struck (grep 0), and `REGIME`/`PASS4` gone |
| masked fallbacks | **HIT (engine)**: the `onClick` guard reads `pointerType === "touch"`, and WebKit's touch click says `"mouse"`. The case the guard exists for is handled in WebKit by the click's absence (gap 4) |
| unverified gestalt | clear for the pairs looked at (crop 1 lawful, crop 3 declared). No dark or WebKit crop, but the numbers cover both |
| consumer-less substrate | clear: `boardBox` has two consumers and `EDGE_QUIET`'s class one rule. `SELF_TAKES_A_HAND` is exported for its unit (knip green) |
| generic default | clear |
| π, undeclared | **HIT (minor)**: 768×1024 lapped 3 and 800×700 lapped 6 are unpriced (gaps 1, 11) |
| forgotten constraint | **HIT**: the dark AA fraction sits outside T9-R6 (gap 6); `--tap-floor` is bare in the census (gap 8); a derived literal (gap 9). filterBudget (R6), M16 (R8), @property (R8) and W2 hold |

## 4 · The frames, looked at

- **`1-edge-full-vs-quiet-…-fine.png`**: a lawful pair. The card (top) and the lobby (bottom) are
  identical in both halves except the edge's ink: a dark wobbled line on the left, a grey one on the
  right. The mark is present in all four panes, and the corners are rounded in both. Forwardable.
- **`2-pose-rest-vs-lifted-…-x4.png`**: a flat bar vs a blob. U-10.
- **`3-seam-b-vs-a-…-coarse.png`**: (b) left shows A's column highlight and, on B's board, A's thin
  ring on the `1` cell. (a) right shows neither. The slugs differ between arms (declared). Forwardable
  with the caption (gap 14).

## 5 · Ballots as I'd forward them

- **The edge ink** (crop 1): FULL (default) vs QUIET. The default beats the control on the painted
  statistic (13–17 : 1 vs 1.06). QUIET carries its 22–26 % of columns under 3.0 in light.
- **The touch seam** (crop 3): (b) default. It carries gap 5: touching the sheet still looks away, both
  engines. It also carries gap 4: WebKit's click guard is an absence.
- **F1** (pass-5 crop 2 stands) and **the pose floor** (crop 2): U-10.

## 6 · My incidents

1. The plants (`crit-breaks.py`) edited `HeadSheet.vue` and `PlayerMark.vue` under my running dev server
   (HMR). Each was restored with sha1 verified (`36b1a03e44`, `b43e660478`), and the whole spec file
   then ran 24/24. The worktree diff at the end is 24 files +1,901/−402, unchanged.
2. My first in-page blind-spot probe (`clip-path: inset(0 0 calc(100% − Npx) 0)`) also clips the top
   stroke's anti-aliasing above the layer's box, so it lowered the top band to 0.78–0.90 and reds the
   row by accident. The lawful plant is X6 (negative insets on top and sides), which reads GREEN ×2.
   The X3 row in `breaks-1` is that accidental red, kept and labelled.
3. One command mis-expanded `${…}` inside an unquoted heredoc (a "bad substitution" error). Nothing
   ran. It was redone through a quoted heredoc.
4. Node reads (`scripts/check-*.mjs`, the census, `check-property-block`, l5b) ran with the control as
   their subject. There was no git in the control, and I didn't build or edit it.
5. My scratch is `scratchpad/plrself-crit6/` (dist, caches, pw outputs, configs). It's the chair's to
   clean, and nothing is in any tree.

## 7 · Cross-pollination

- **Every drawn-edge paint gate reads all four bands** (X6: the bottom edge erased, the top intact).
  That covers CTRL-TAPE, CTRL-RULE, MRK-LIVE's G-LIVE-16, and the chair's R3. An existence ratio on
  one side is one side's existence.
- **An existence row beside a contrast floor.** A WebKit edge at 2.2–2.4 : 1 passes a ≥ 1.5× existence
  ratio. Every lane that relaxed a threshold to admit a quiet arm owes the §2.4 median floor as a
  separate row.
- **Touch-click guards key on the sequence, not on `pointerType`.** WebKit labels a touch's click
  `"mouse"`. This applies to PLR-PLACE (its chart's seam) and any `@click` that ignores touch.
- **A measured regime re-measures on resize at rest.** This applies to COUNT, PLACE and every §10 sheet
  keyed on a box read at open.
- **768×1024 coarse is a regime cell.** It is MOT-LADDER's ballot cell already. Every sheet keyed on
  "phone vs desk" reads it.
