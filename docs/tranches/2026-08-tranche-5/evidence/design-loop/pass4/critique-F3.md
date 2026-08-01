# NON-AUTHOR CRITIQUE — pass-4 stage F3 (MOBILE CARRIER) · 2026-08-01

Read-only audit. Bar = pass3-registry §2's numbered work orders for F3. Verified against the
actual diffs at MAIN `52ef014a` (five commits `2791d437…52ef014a` on base `3969f512`), the
banked logs under `pass4/logs/F3/` (37 + 56 in `final/`), the lane's raw JSON under
`pass4/rigF3/`, the lane's four shots, and MEASURE's `pass4/measure/RESULTS.md`. Where the lane
and MEASURE disagree, MEASURE wins and the disagreement is a gap row.

**Verdict: 4 of 5 rows closed — 80%. Not a clean pass.** The lane's charter first line
(trigger (b)) is uncured for a third pass; four residual gaps sit on rows that did close.

---

## 1 · THE WORK-ORDER ROWS, ONE BY ONE

### Row 1 — "the landscape unprefix priced against the 44px floor or reverted" · **CLOSED**
Priced, not reverted, and the pricing is real work.

- The ladder is banked as a five-rung table on ONE built dist, both engines identical to 0.00px,
  nine viewport cells, `regimeOk=true` on every one (`logs/F3/landladder.log`,
  `rigF3/out-landladder-{chromium,webkit}.json`). Every figure in §1 of the dossier and in the
  shipped `GameBoard.vue` comment reproduces from that log: 74.22/25.11/35.77/40.22/42.88.
- The 44px question is answered as a geometric impossibility rather than negotiated: a 9×9 at
  44px is a 400px board in a 390px viewport, so even `100dvh` lands 42.88. **I substantiated the
  floor-ownership claim independently** — `index.css:765` is "44px tap-target floor, coarse
  pointers only", and every `≥44` assertion in the estate (`mobile-affordances`, `drawer`,
  `mobile-platform:399`, `zone-grammar:377-378`) is a control/chip/tab box. No gate has ever
  bound a board cell. The claim holds.
- The cure is a constant with a reason, not a tuned number (`100dvh − 1.5rem` = the gutter the
  width arm already spends), it is inert at every portrait cell in the ladder, and `lg:` restores
  the row regime's 10rem verbatim so the golden viewport is untouched (640 with, 672 without).
- Gated, and the gate can fail: `board-covisibility.spec.ts:261` reds on base at exactly
  25.11-vs-40.22 (`final/gate1-base.log`), green on head 27/27.
- The disclosed cost is measured before it was found by someone else
  (`logs/F3/masthead-844x390.log`) and written at the code site, not only in the report.
- MEASURE confirms 40.22 at 844×390 and 44.44 at 926×428 and marks the deploy-gate row **PASS**.

Residual, carried below as G2/G4: the rung was elected by the lane alone, the new fold overflow
is ungated, and the banked cost figure is 2px off MEASURE's on the byte-identical artifact.

### Row 2 — "the four banked assets + keypad band dispositioned row by row" · **CLOSED**
All five disposed **in the tree**, where the next hand reads them, each with a trigger:
`useKeyboardViewport.ts` (296 band CLOSED-GREEN; `--vv-height` RETIRED, trigger = the first
`position:fixed` surface below 1024), `useFlipGlide.ts` (channel split BANKED with its trigger;
`run()`-per-release CONSUMED as the engine's own contract, with `reverse()`'s one legitimate
case named), `visual-regression.spec.ts` (`drawerGlide ≡ vaul` CONSUMED **and gated**).

The keypad row carries a genuine inline control (`padding-bottom:0` → the deepest control
strands under the band) and the row is honest that it characterizes rather than cures ("green on
BOTH dists"). The curve row's falsifiability is **shown, not asserted**: `gate1-curve-control.log`
reds naming both values (`0.32,0.72,0,1` vs `0.4,0.1,0.2,1`) — and the report says the first cut
of that row red on engine re-serialisation, which is the kind of self-report this loop wants.

Residual, carried as G3: "CLOSED, GREEN" on a three-pass owner row that the evidence of record
still lists open, closed on an emulated visual viewport.

### Row 3 — "the sub-1280 tally line restored or its deletion disclosed and gated" · **CLOSED. The best row in the lane.**
- Restored as ONE ref (`vignetteHasTally`) replacing two languages; the vignette's
  `display:none`/`@media 1280` pair is deleted because the prop decides; `quiet` now clips the
  VOICE (`.margin-note-block.is-quiet .margin-note`) and the reserved line moves to the block, so
  the strip is the same height before and after the grade.
- The gate counts paints in **both directions** and intersects the rect against every clipping
  ancestor — and the report volunteers that its own first cut "scored the exact defect it exists
  for as a pass". GATE-1 on base: 0 paints where 1 is demanded (`final/gate1-base.log`).
- MEASURE reproduced it independently: **1 paint at seven widths** on head, **0 at all six
  sub-1280 cells** on the pass-3 close, plus an unclipped-plant control proving the 0 is a
  measurement and not a blindness.
- **I confirmed it on glass myself**: `shots-F3/F3-p4-head-phone-390x664-solved.png` renders
  `0 backtracks — 1ms` on its reserved line under the board at 390×664.

### Row 4 — "the dt-name removal re-scoped or re-worded to its true blast radius" · **CLOSED**
Re-worded to "RETIRED, ESTATE-WIDE, desktop included" in the commit body, in `DifficultyTally.vue`
where the markup used to be, and in `GameControlPanel.vue` where the mis-scoped rule used to be.
The dead markup goes with the ruling (span, transition, three-selector hover rule, PRM arm,
`:deep` suppression). The deciding reading is banked both engines
(`out-assets-base-*.json`: verbToReceipt 7.531 → −103.531 chromium, 7.547 → −103.547 webkit;
card 281 / boardLeft 215.5 byte-identical), and the report **names the hypothesis it falsified**
(occlusion, not the max-content walk the pass-3 comment predicted). The durability row's control
is deliberately class-neutral so it fires on the pre-retirement build, and `final/gate1-base.log`
shows it green there — i.e. the control demonstrably is not swallowed. Residual as G9/G10.

### Trigger (b) — the charter's first line · **OPEN, third pass** → **G1 BLOCKING**

---

## 2 · GAPS

**G1 · BLOCKING — trigger (b), the owner's ALL-mobile mark, is uncured for a third pass.**
Pass 3 bought 0.045 of a 0.705-viewport gap; pass 4 bought **zero**. The lane's own covis raw
(`out-covis-p4{base,head}-chromium.json`) reads `pageVh 1.705` on BOTH arms at 390×664, and
MEASURE §3 prints the same: "the whole stack is still 1.705 viewports at 390×664, and is still
not claimable." The dossier admits it at §8.2 and routes the lever to Lane C's uncashed T′
collapse — the routing is honest and probably correct, but the charter's first line is open, so
this family does not post a clean pass and the 100% clock does not start.

**G2 · MAJOR — the landscape rung is elected by the lane alone, ungated on its new cost, and has
no eye on glass.** Three things compound:
(i) the trade is a real design ruling — pass 3's board sat WHOLE above the fold at 844×390 and
this one does not. I looked at both shots: `F3-p4-base-land-844x390.png` shows all nine rows;
`F3-p4-head-land-844x390.png` is cut off at row 7. Whole-board visibility was spent for cell
size, and the ladder has two intermediate rungs (`4rem` → 35.77) nobody adjudicated;
(ii) nothing gates the new overflow — the renamed row asserts `height ≤ innerHeight`, which 366
in 390 satisfies at any of the four candidate caps, so the disclosed 90px cost has no bound;
(iii) **no on-device cell exists in this lane and none exists anywhere in the pass** — every
MEASURE device arm is 393×699 portrait (`device*.jsonl`, `m4-bat-*.jsonl`); I grepped, there is
no landscape or rotation reading. Registry owner row 2 says this exact cell "needs a human eye on
glass"; it is now in its third pass and the number it guards has changed underneath it.

**G3 · MAJOR — the 296px keypad band is declared "CLOSED, GREEN" against the evidence of
record.** RESULTS §10 item 7 still carries "the keypad rig row" as an **unchanged owner row**.
The closure rests entirely on `installFakeVisualViewport` — no OS keyboard was ever raised
against this tree, and the numbers (+292 of 296, dealClearance 8.05) are banked from the BASE
dist only (`assets-base.log`). The mechanism argument is good and the inline control is real;
the label is ahead of it. Adjudicator row: either the owner's keypad row is struck with this
evidence, or the lane's "CLOSED" is downgraded to "characterized".

**G4 · MINOR — a banked number that does not reproduce on the byte-identical artifact.** F3
banks the landscape fold overflow at **88.58px** (report §1 and, durably, the shipped
`GameBoard.vue` comment); MEASURE reads **90.58 chromium / 89.98 webkit** on a dist whose
`index-6v9S84SRo2al.js` I confirmed is md5-identical to F3's own (`dc6424524ce09d0cc9e4865c561beeac`).
Same finding, same sign, 2px apart — but the disagreement is now in product source.

**G5 · MINOR — surface-name bookkeeping, the named pass-3 offense, in the gate table.** §6 reports
the built-dist lane as "**16 / 16** — filter-census 3 …, theme-bake ×4, wordmark, **throttled-void**".
Its own `final/built-dist-lane.log` contains filter-census **6**, wordmark **6**, theme-bake **4**,
and **zero** throttled-void rows (`grep -ci throttled` = 0). The lane's config
(`playwright-throttle.config.ts`) defines five projects; F3 ran four and named the fifth.
MEASURE's full lane is 17/17 including `throttled-void.spec.ts:38`. Substance is covered; the
bookkeeping is not.

**G6 · MINOR — a count contradicted by the lane's own log.** §6 says "vitest **332 / 32 files**";
`final/vitest.log` reads `Test Files 31 passed (31)`. MEASURE flags the same.

**G7 · MINOR — a red routed to another lane on a control that stopped one arm short.** §6 books
`gallery-deal.spec.ts:432` as "Lane A's row, routed, not mine" and backs it with a base-tree
control through the same vite preview (`e2e-galleryrace-basetree-preview.log` — a real control,
and it does reproduce). But MEASURE runs the row on the **dev server** and it passes 3/3: it is a
preview-timing artifact of the lazy-chunk hold, not a tree defect on any lane. A lane row was
opened against Lane A on an incomplete attribution.

**G8 · MINOR — §5's "byte-identical except the one cell this stage touches" is stated over an
incomplete cell set.** The covis table carries one landscape cell; the lane's own ladder shows
the cap also moves 926×428 (29.33 → 44.44) and 740×360 (21.77 → 36.88). No concealment — the
ladder is banked and MEASURE prints 926×428 — but the claim is broader than the table under it.

**G9 · MINOR — the retirement removes the only VISIBLE route to the hardest-step name.** The
deleted rule carried `:hover`, `:focus-visible` AND `:focus-within` arms. A sighted keyboard user
now has no path to `descriptor.expand` at any width; the stated replacement is the `aria-label`,
which is not a visible surface. Disclosed, but decided by the lane with no alternative (static
caption, `title`, a mount outside the deal row) considered in the open.

**G10 · MINOR — `TallyDescriptor.expand` is now consumer-less** with 5 unit rows still testing
it. Disclosed at the site and at §8.5, and deliberately not widened into five games' shared
voice — the right call, but the consumer-less field is the exact class this loop keeps naming.

---

## 3 · FAILURE-MODE CHECKLIST + THE NAMED PASS-3 OFFENSES

- **Stale tables — NOT FOUND, and this is the pass-3 offense (F6) most convincingly cured.**
  `dist-F3head/assets/index-6v9S84SRo2al.js` is md5-identical to MEASURE's independently rebuilt
  `measure/dist-head` (`dc6424524ce09d0cc9e4865c561beeac`), so every figure taken on the lane's
  23:35 dist is a figure on the final artifact. `final/tree.txt` reads `52ef014a` and every
  `final/` log is timestamped 23:49–23:54, after the last commit at 23:49:26. §5's covis table
  reproduces cell-for-cell from `out-covis-p4{base,head}-chromium.json`; §1's ladder from
  `landladder.log`; §2/§4's figures from `assets-base.log`. I found no table that outruns its raw.
- **Gates that cannot fail — NOT FOUND.** Three new rows, three controls: the tally row plants a
  second copy inline and asserts the count reaches 2; the rotation row re-injects pass 3's rung
  and is banked RED at 25.11 vs 40.22; the curve row is banked RED naming both values; the receipt
  row's control is class-neutral *on purpose* so the pre-retirement `display:none` cannot swallow
  it, and it passes on the base arm, which proves the point. The keypad row's control (stop
  spending the inset → deepest control stranded) is asserted, not narrated.
- **Undisclosed deletions — NOT FOUND in the pass-4 diffs.** Every deletion (the reveal span and
  its four rules, the vignette `display:none`/`@media` pair, the `:deep` suppression, the
  `min-height` move) is disclosed at its own site. The pass-3 undisclosed deletion (F4, the tally)
  is restored **and** gated; the pass-3 mis-scoped rule (F5, dt-name) is re-worded at its true
  radius. G9 is a disclosed consequence, not a hidden one.
- **Surface-name bookkeeping — FOUND, twice (G5, G6)**, both contradicted by the lane's OWN
  banked logs, which is the only reason they are minor rather than structural.
- **Half-text discharge / masked fallback — one instance (G7)**: a control that reproduces on one
  server and was never tried on the other, with a cross-lane routing hung on it.
- **Closed-against-the-record — one instance (G3).**
- **Unbanked gates — GONE for this lane.** Pass 3's F3 §7-class offense does not recur: 37 logs
  under `logs/F3/`, 56 under `logs/F3/final/`, and every rig raw JSON on disk. I checked existence
  file by file; nothing cited in the dossier is missing.

---

## 4 · WHAT THIS LANE EARNED

1. **The tally restore** — a content deletion found, root-caused to two individually-correct
   silences, cured with one ref instead of two languages, gated in both directions with a probe
   that had to be taught to see through the sr-only pattern, born-RED on base, reproduced by a
   non-author at seven widths, and visible on glass in the lane's own shot.
2. **Single-tree discipline, provable by md5.** The pass-3 offense that survived only on MEASURE's
   re-run is now cured by construction.
3. **The golden flake row upgraded from a red to a rate — with a NO-OP CONTROL ARM.** I counted
   the logs myself: base 0/7, no-op (base + one comment byte) 3/14, head 5/14. A tree semantically
   identical to base reding 3/14 is the arm that decides the attribution, and nothing was
   re-baselined. MEASURE's 0/8 makes three rates in one day, which is the finding.
4. **The 44px question answered rather than argued** — a geometric impossibility plus the floor's
   true owner, which I verified independently against `index.css` and every `≥44` assertion in the
   suite.
5. **The whole five-rung ladder banked**, so the election I dispute in G2 is at least auditable by
   the adjudicator who should have made it.
6. **Three self-reports the loop rewards**: the probe that scored its own defect as a pass, the
   curve row that red on `.32` re-serialisation, and the falsified max-content hypothesis.

---

## 5 · ROUTING

- **G1** is the family's blocking row and is not the lane's to close alone (Lane C's T′). It must
  stay the charter's first line into pass 5.
- **G2** and **G3** are adjudicator/owner rows, not lane rows: which ladder rung ships, and whether
  an emulated visual viewport strikes a three-pass owner row.
- **G4–G8** are corrections the lane can make in the open in pass 5 (one of them, G4, in product
  source). **G9/G10** are disclosed residue.
- Nothing pushed, nothing deployed; MAIN is 35 commits ahead of `origin/master` and clean.
