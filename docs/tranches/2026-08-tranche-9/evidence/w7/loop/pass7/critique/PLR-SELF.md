# PLR-SELF · pass 7 — ADVERSARIAL CRITIQUE

§11's leader. Prototype: worktree `.claude/worktrees/w7-p4-PLR-SELF`, branch `w7/p4-plr-self`, base and π control
`74a2b5d9`, uncommitted, 24 files +2,234/−402 (pass-7 delta 3 files +432/−99). I wrote neither the charter nor
the prototype. The pass-7 number is mine.

**Verdict: ADVANCE. Convergence 91 % (from 89).**

The pass closes seven of the charter's ten rows on the real surface in both engines, each with a born-RED
plant that I re-ran myself: the two-axis key at 768×1024, the re-fit at rest, the four-band paint row, the
sequence guard with the row tap, the shut head, the live radius and the pinned seam crop. The bank is the
tree (`pass7-substrate.diff` applies 0 on a fresh `74a2b5d9` and reproduces all 24 files byte for byte), and
my rebuild is the cited dist (`index-Dsjt37jfIbJ3.js`, 43 files). Four new defects keep it under 95. All four
are the same classes pass 6 named, now one clause narrower:

- **The key keeps the one-axis proxy as a disjunct.** `board.left <= tall.rowsStart` still decides alone. At
  700×800 coarse it reads 1 row over 4 cells. At **712×800 coarse the board's left is 22, and the sheet draws
  4 rows over 8 cells**. A 12 px wider window doubles the lap.
- **The sequence guard's debt is never forgiven in WebKit.** WebKit sends no click after a prevented tap, so
  `clickOwed` stays true. The next click with no press before it is swallowed, and it takes two to toggle.
  Chromium toggles once. LAWS §D's clause is "cleared by the next click **or task**", and the task half is
  unbuilt.
- **The landed four-band row reads light only.** A dark-only erase of the edge passes it ×2.
- **The desk's lap is 4 at rest, not CH-71's "two or three".** The product comment and the ballot still quote
  2–3.

| my rig | |
|---|---|
| tree | a scratch `git archive 74a2b5d9` (web/frontend, LEDGER.md, csp-solver/data) + `pass7-substrate.diff`: `git apply --check` **0**, apply 0, and every one of the lane's 24 files **sha1-identical** (PlayerMark `25b082fd57e1`, HeadSheet `f778030625c4`, spec `677ac6bee362`). Every plant ran there. The lane's tree was never written (24 files +2,234/−402 and the three sha1s unchanged at my return) |
| servers | tree dev `:4231` (two-line config, cacheDir in scratch); control dist `:4237` (`w7-control` own `.vite-control.config.ts`, verified **`index-CubiZsMVSwTc.js`** by hash); my rebuilt dist `:4232` (**`index-Dsjt37jfIbJ3.js`, 43 files = the lane's cited dist**). `:4236` was taken by MRK-LIVE's critic between my scan and my bind, so I re-bound. Killed by recorded PID: 14080/14051, 12610/12555, 63472/63368. All three ports read free |
| box load | 1-min **37–94** across the batteries (printed per log). No timing row is gated here |
| instruments | `critique/PLR-SELF/instruments/`: `crit7-self.spec.ts` (C1 sweep, C2 debt, C3 scroll pose, C4 desk at rest), `crit7-filters.spec.ts` (pass-6 critic's estate census, ports re-pointed), `plant.py` + `plants.sh`/`plants2.sh` (file plants against the LANDED rows, restored by copy, sha1 verified after each), `rest.sh`/`probes.sh` (the chair's `pass7/instruments` as banked, MANIFEST sha1s), `gates.sh`, `build.sh`. Readings are summarised under `readings/` |
| crops | none minted. Every claim below is a number |

---

## 0 · Gaps first (each closable, numbers attached)

1. **The key's second clause is the pass-6 proxy, and it cliffs between 700 and 712 wide.**
   `cramped = !NAMES_OVER_CELLS || board.left <= tall.rowsStart || (short && !laps(short.box, board))`. The
   rows start at x 18 at every width. At 800 tall, coarse, 6 peers, both engines identical:

   | cell | board left | names arm (the tree) | cells arm (one row) |
   |---|---|---|---|
   | 700×800 | 16 | **1 / 4** | 1 / 4 |
   | 712×800 | 22 | **4 / 8** | 1 / 4 |
   | 724×800 | 28 | 4 / 8 | — |
   | 736 / 748 / 760 / 768 × 800 | 34–50 | 4 / 6 | 1 / 3 |
   | 1024×768 (iPad landscape) | 70 | **4 / 6** | 1 / 3 |
   | 1180×820 | 122 | 4 / 4 | 1 / 2 |
   | 700 / 736 / 768 × 1024 · 744×1133 | 16–50 | 1 / 0 | — |
   | 820×1180 | 76 | 4 / 0 | — |

   So 712–768×800 coarse and 1024×768 / 1180×820 coarse are **unpriced**. The README's landscape table
   stops at 844×390 and 812×375, and its portrait band stops at 700. The 700→712 flip is the pass-6
   "elegant-reduction" hit moved one clause over: the board runs under x 22–256 of the rows' 18–256 at 712,
   exactly as it does at 700. **Close it** with the third fact pass 6 asked for (how much of the rows'
   span the board runs under, or the lap count itself compared across the two budgets), plus a landed row
   at 712×800 coarse that reds under today's clause. Otherwise, price 712–768×800 and 1024×768/1180×820 in
   the `NAMES_OVER_CELLS` ballot by name.
2. **The sequence guard leaks in WebKit: a debt with no end.** `clickOwed` is set in `onRelease` and cleared
   only by a click, a press on the mark, or a key on the mark. WebKit sends **no click** after a prevented
   touch `pointerdown` (the chair's rest probe: `pointerdown:touch, pointerup:touch, touchend` and nothing
   else). So the debt outlives the tap. C2, 390×844 coarse: tap the mark, wait 1.5 s, then one
   `el.click()` (the shape of an assistive-technology activation, which has no press):

   | engine | after tap | after 1 click | after 2 clicks |
   |---|---|---|---|
   | chromium | open (its `click:touch` paid the debt) | **shut** (1 toggle) | open |
   | webkit | open (no click) | **still open (swallowed)** | shut |

   A.6 treats a row green in one engine and red in the other as the tree's defect. The RELABEL row can't
   see this, because it always delivers a click. **Close it** by bounding the debt (a timestamp or task
   window on the release, or clearing it on the next task as LAWS §D says). Land a WebKit row: tap, then a
   press-less click 1 s later, expect 1 toggle. Negative: today's guard.
3. **The landed four-band row reads the light theme only.** `test('both head disclosures paint a drawn edge
   on all four sides…')` calls `emulateMedia({ colorScheme: 'light' })`. The DARK plant, `:global(.dark)
   .head-sheet-edge { opacity: 0 }` as a file edit, **stays GREEN ×2** (2 passed, 14.6 s). The dark edge is
   proven only by the lane's CLI runs of the chair's probe, not by a landed row. **Close it** by running the
   landed row in both themes, with the dark X4/FADE15 plants and the DARK plant as its negative.
4. **The desk's lap at rest is 4, and the record says 2–3.** C4, 1280×800 fine, 6 peers, the sheet reopened
   at 0 / 1.5 / 4 s after the room formed: **4 rows / 4 cells lapped at every read, board top 124.5 (ch) /
   124.2 (wk), sheet bottom 222.4**. That separates the README's "3 / 4, settling, not separated": at rest
   it's 4 in both engines. `PlayerMark.vue`'s comment ("CH-71, 1280×800: four rows over two or three
   cells") and the `NAMES_OVER_CELLS` ballot's desk cost ("4 rows to 1") both quote the unsettled figure.
   **Close it** by restating CH-71's price for this sheet as 4 cells (one row: the README's 1/2) in the
   source comment and the ballot, and adding a landed desk row that asserts it at rest.
5. **The replay of the filter row is broken.** The banked `prototype/PLR-SELF/instruments/filters.mjs` is the
   visible-only first cut. It reproduces `readings/filters-visonly.txt` (5/6/5), not the cited 9/11. I
   re-ran the pass-6 critic's estate census on my rebuild and got **light 9/9/9 = control 9/9, dark
   11/11/11 = control 11/11, both engines**, so the claim holds. But the instrument behind the lane's
   number isn't in the bank. **Close it** by banking the estate-rule census that produced `filters.txt`.
6. **The four-band row is a port** (LAWS §I, declared by the lane). Its verdicts match the chair's CLI on
   every plant I ran (X6 bottom 1.00, X4 1.35–1.42, FADE15 1.37–1.43). But it has no scroll poses, no
   occluder naming and no dark run (gap 3). **Close it** by landing the chair's `edge-bands.mjs` as an
   importable e2e helper the row calls, or by the fold's written waiver.
7. **`check-pw-projects` / `test:e2e:projects` exit 1 on the tree** (control 0): FLOOR BAND, chromium 214 vs
   live 252 (owes 215), webkit 212 vs 250 (owes 213). Declared by the lane. The restamp is WGATE's, so CI
   would red on this bank until then. This is the fold's row by name.
8. **The seam ballot's default disagrees with the record.** Registry-v6 §9 lists B-SEAM/B-TAP with default
   **(a)**. The tree ships `TAP_IS_A_LOOK = true`, which is **(b)**, and the README and the crop call (b) the
   default. Under (b) the ballot also owes the loss that only (b) carries (gap 2: in (a) `onRelease` returns
   before setting the debt), per LAWS §G. **Close it** with the chair's word on the default, and name
   gap 2's cost in the ballot.
9. **No landed row reads the radius** (declared). It's proven by the lane's probe and a literal plant only.
10. **The state line's chromium-light G4 slice** (13 at 2.69 on the clean line) is unexplained. It
    reproduces on my run exactly (`pop 236, median 2.167, <4.5 0.746`). With `pop 236` over a 40.5 px run,
    the lane owes the column count and a TAIL12 RED on its own subject in-run, as the chair's README §4 gap
    3 asks. TAIL12 does red here (G4 slice 14 at 1.43). The clean slice-13 dip is still unaccounted for.
11. **Carried, unmoved:** T9-R8 on the state line (G2 red on the tree and on the control caption; the fraction
    inside the control + 0.05); landscape balloted (the arm unframed, no retiree); real iOS (M19), now
    including gap 2's route; the filter count at boot (VERB's row); room rows dev-vs-dev (W8 §8.3);
    `visual-regression.spec.ts:790` WebKit (T9-R3); `multiplayer.spec.ts:962` env-gated; STALE
    `--refuse-dur`; r0 I4/I5; the pose floor (U-10); COUNT's and PLACE's re-take of rows 1–4 unseen.

---

## 1 · What I re-measured (both engines, my own runs)

### R1 · The bank is the tree, and the dist is the tree
`pass7-substrate.diff` (sha1 `f187d83e978d`) applies 0 on a fresh `74a2b5d9` archive. All 24 files are
sha1-identical to the worktree. The rebuild from that scratch is **`index-Dsjt37jfIbJ3.js`, 43 files**, the
lane's cited hash.

### R2 · The chair's rest probes (`rest.sh`, MANIFEST sha1s) · load 57–71

| probe | chromium | webkit |
|---|---|---|
| self-resize 390×844 → 390×800 open | **GREEN**: 4/0 → at rest **1/0** = reopened 1/0 (settle 171 ms) | **GREEN** (160 ms) |
| self-touch: mark tap | GREEN, 1 toggle (`click:touch` arrives) | GREEN, 1 toggle (**no click**) |
| self-touch: row tap | GREEN, focus `INPUT[cell]` | GREEN, `INPUT[cell]` |
| self-touch + RELABEL | GREEN, 1 toggle | GREEN, 1 toggle |

The lane's rows 2 and 4 reproduce.

### R3 · The whole landed spec, and the plants (pass 6's first), in the landed rows

- `player-mark.spec.ts` whole, both engines, 1 worker: **30 passed / 0** (1.9 min, load 72–94).
- **X6 (pass 6's plant, as a FILE edit** `clip-path: inset(-4px -4px 16px -4px)`): the four-band row **RED ×2**,
  with `bottom 1.00 (206 stations)` while top/left/right read 12.8–17.4. The pass-6 hole is cured.
- **P1 (pass 6's one-axis key back)**: the portrait row **RED ×2** at `768×1024` (rows 4, expected 1).
- **DARK (a dark-only erase)**: the four-band row **GREEN ×2** (gap 3).
- **PTE (strike the `transitionend` listener only)** and **PRS (strike the `resize` listener only)**: the
  landed resize row and the chair's webkit self-resize probe both read **GREEN** under each. Each path alone
  suffices at this cell, and only both struck (the lane's P2) red it. This is informational, not a gap: the
  row proves a re-fit exists, not which clock carries it.

Every plant was restored with the sha1 verified (`25b082fd57e1` / `f778030625c4`).

### R4 · Paint, the chair's CLI (`probes.sh`) · load 37–48

| subject | reading | exit |
|---|---|---|
| lobby edge, chromium light | top **17.359** · right 15.028 · bottom **17.52** · left 15.958 (<3: 0.024/0/0.024/0); X6 bottom 1.00 (206 dropped); X4 1.351–1.38; FADE15 1.351–1.377; X5 2.41–2.56 | 0 |
| card edge, webkit dark | 11.956 · 12.456 · 13.761 · 14.535; X6 bottom 1.00 while topOnly GREEN; X4 1.39–1.42; FADE15 1.40–1.43; X5 2.86–3.21 (lawful dark sensitivity) | 0 |
| state line glyphs, chromium light | pop 236, **median 2.167**, <4.5 **0.746**, G4 slice 13 at 2.69; all six plants RED | 1 (T9-R8) |
| control caption, chromium light | pop 946, **median 2.270**, <4.5 **0.921** | 1 (born-RED) |
| state line glyphs, webkit dark | pop 245, **median 3.309**, <4.5 **0.624**; all six plants RED | 1 (T9-R8) |

These match the lane's table to the third decimal in every overlapping cell.

### R5 · Filters on MY rebuild, estate rule (pass-6 critic's census, re-pointed) · load 41

| shut / card / lobby | light | dark |
|---|---|---|
| control `CubiZsMVSwTc` (ch, wk) | 9 / 9 / – | 11 / 11 / – |
| tree `Dsjt37jfIbJ3` (ch, wk) | **9 / 9 / 9** | **11 / 11 / 11** |

The filterBudget doesn't grow. The pass-7 delta adds no filter (grep: one comment mention).

### R6 · The sweep, the debt, the scroll pose, the desk
Gaps 1, 2 and 4 have the tables. **The scroll pose is clean.** The head is `position: fixed` and only
landscape scrolls, by 19 px (scrollHeight 409 / 394). With the sheet open, scrolled, and read at rest:
844×390 goes 4/6 → **4/5**, which equals a fresh open at that pose (4/5), and 812×375 stays 4/5 = fresh.
The portrait cells don't scroll. Both engines.

### R7 · Gates, bare, tree · control (`gates.sh` + bare re-runs) · load 74

`check-copy-register` 0 · 0 (0 dashes, 0 unadmitted: **M16 holds**) · `lint:lanes` 0 · 0 · `lint:theme-tokens`
0 · 0 · `lint:sleep` 0 · 0 (35 specs vs 34) · `lint:motion` 0 · 0 · `check-theme-selectors` 0 · 0 ·
`check-live-regions` 0 · 0 · **`check-pw-projects` 1 · 0 and `--self-test` 1 · 0** (gap 7) ·
`check-property-block` 0 · 0 (source) · undefined-token census: the lane's A.3 copy 1 · 1 (tree STALE
`--refuse-dur` only, 0 bare; control 2 STALE), the chair's pass-6 copy 1 · 1 (**tree 2 bare**, control 0
bare: A.3's row is still PROPOSED) · `eslint .` tree 0 · `npm run lint` tree 0. `lint:bands`/`lint:verbs`
don't exist on `74a2b5d9`. I didn't re-run vitest or vue-tsc; those are the lane's (830/0; 0/0).

### R8 · Constraints

- **@property**: no new registration; `check-property-block` GREEN.
- **Undefined tokens**: 0 bare only with A.3's admitted row. A.3 is the chair's, so this is cited, not cured.
- **π**: not re-run whole-DOM. The claimed moves are behaviours (re-fit, key, sheet press, guard). The
  resting path is byte-identical at a 16 px root (the lane's `d` sha). Unclaimed: gap 1's cells, and
  gap 4's desk figure (4, not 2–3).
- **W2's mechanics**: untouched. A pointer policy and a re-read, no new mechanic.
- **Decided history**: no r0 row is re-worded, and no r0/R6 row MOVED. L5b is the chair's (inlined at the
  fold).
- **AA**: the edge from painted bytes clears 3.0 on every band in both arms and both themes (FULL 11.96–17.65).
  The text is T9-R8.
- **INTAKE-22 §7 / INTAKE-23 §4**: neither intake carries a §11 row (grep 0). No mark row is owed.

## 2 · Strengths

- **Every charter row that closed, closed on the surface with its negative in the same run, both engines,
  and I reproduced each one**: P1 reds 768×1024, X6 reds the bottom band, the resize-at-rest row is GREEN
  against a reopened control, RELABEL holds one toggle, the row tap keeps `INPUT[cell]`, and the shut row
  reds a 35 % sheet.
- **The RELABEL row asserts on its GREEN run** (`clicks: ['mouse']`, the plant proven live), as LAWS §F asks.
- **The bank is the tree and the dist is the tree**, both verified independently (sha1 per file; hash per
  build).
- **The ballot arms are real and one const each** (`EDGE_QUIET`, `TAP_IS_A_LOOK`, `NAMES_OVER_CELLS`). Crop 3
  is a lawful pair: one payload, B pinned `p-0000000b0b0b`, slugs identical. I looked at it: (b) keeps A's
  column highlight and B's ring on `1`, and (a) shows neither.
- **The four-band numbers are the chair's instrument's numbers** to three decimals. The port hasn't drifted.
- **Incidents are self-declared in full**, including the loaded 26/4 run and the dead attempt's inventory.

## 3 · Failure-mode checklist

| item | verdict |
|---|---|
| vacuous convergence | **HIT (partial)**: the landed four-band row can't see a dark-only erase (DARK GREEN ×2) |
| spec-cites-itself | clear. The 768×1024 row asserts a painted count, and P1 reds it |
| gates that cannot fail | **HIT**: the four-band row in dark (gap 3). The RELABEL row can't fail on a press-less click after a WebKit tap (gap 2). `check-pw-projects` is RED, not vacuous |
| elegant-reduction trap | **HIT**: `board.left <= rowsStart` survives as a disjunct. 700→712×800 coarse goes 1/4 → 4/8 |
| legacy aliases | clear: `pointerType` isn't read in `onClick`, and pass 6's label guard is gone |
| masked fallbacks | **HIT (engine)**: the debt relies on a click WebKit never sends. The absence is still load-bearing, now as a swallow |
| unverified gestalt | clear for crop 3 (looked at). The landscape arm is unframed (declared) |
| consumer-less substrate | clear: `onKey`, `refit`, `onSettle` and `radius` each have a consumer |
| generic default | clear |
| π, undeclared | **HIT**: 712–768×800 coarse (4/6–8), 1024×768 coarse (4/6), 1180×820 coarse (4/4) unpriced; the desk is 4 at rest, quoted 2–3 |
| forgotten constraint | **HIT**: LAWS §D's "or task" clause (gap 2); LAWS §I (the port, gap 6); the registry's B-SEAM default (gap 8); `check-pw-projects` RED (gap 7). filterBudget (R5), M16 and @property (R7), and W2 hold |

## 4 · Ballots as I'd forward them

- **T9-B30, the edge ink** (pass-6 crop 1 stands): FULL (default) vs QUIET. QUIET's cost is as the lane states
  it: in light, 10–26 % of top-band stations and 6–20 % of bottom-band stations under 3.0. FULL beats the
  control's hairline. Forwardable.
- **B-SEAM** (crop 3, the replacement, lawful): the default must be reconciled with registry-v6 §9 (gap 8),
  and (b) carries gap 2's WebKit swallow as its named loss.
- **NAMES_OVER_CELLS** (unframed, declared): the cost table must add 712–768×800 coarse (8/6 vs 4/3),
  1024×768 coarse (6 vs 3), 1180×820 coarse (4 vs 2), and the desk at rest (4 vs 1–2).
- **The pose floor** and **F1**: U-10, unchanged.

## 5 · My incidents

1. My first dev bind (`:4236`) lost a race to MRK-LIVE's critic's preview. `--strictPort` refused, and I
   re-bound `:4231`. Nothing of theirs was touched.
2. My scratch tree first lacked `csp-solver/data`, and the dev server refused its puzzle bank. I added it from
   the same `74a2b5d9` archive.
3. My first C2 run put its config outside a tree with `node_modules`, and `@playwright/test` didn't resolve
   (nothing ran). I moved it into the scratch tree's `.crit7/`, which is now in `scratchpad/trash-plrself-crit7-1/`.
4. `gates.sh`'s census and `check-property-block` rows mis-captured (a node stack tail). Each was re-run bare,
   and those readings are appended to `readings/gates.txt`.
5. Every plant was a file edit in MY scratch tree under my dev server (HMR), restored by copy with the sha1
   verified after each. No lane or control file was written, and no git ran in the control. `rm` was never
   invoked.

## 6 · Cross-pollination

- **A debt keyed on the sequence needs an end.** A flag set on release and cleared only by a click leaks
  wherever an engine sends no click. PLR-PLACE and PLR-COUNT re-take this guard by sha, so they inherit gap 2.
- **A regime sweep crosses every clause's threshold, not just the named cells.** 700 and 768 were read,
  712 wasn't, and the cliff lives there. This applies to every §10/§11 key with a `left <= x` or `top < y`
  disjunct.
- **Every landed paint row runs both themes.** A light-only four-band row passes a dark-only erase. This
  applies to CTRL-TAPE, CTRL-RULE and MRK-LIVE's ring rows.
- **A ratified pose's number is re-read at rest.** CH-71's "2–3" is 4 at rest here. Any lane citing CH-71 re-reads it.
