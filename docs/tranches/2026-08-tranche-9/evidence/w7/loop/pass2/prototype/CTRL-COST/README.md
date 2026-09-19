# CTRL-COST — pass 2 prototype record

**The consequence ladder**, built on the real surface. Worktree
`.claude/worktrees/wf_8630d340-e56-30` (branch `worktree-wf_8630d340-e56-30`), diff left
uncommitted: **18 files, +1,718 / −1,564**. Dev lane `127.0.0.1:4233`, preview lane
`127.0.0.1:4235`, both on a private `cacheDir` (`probe/vite.lane.mjs`), both killed at return.

## 0 · The replay

Pass 1's worktree (`wf_e58b4764-0fc-40`) carries the pass-1 record as ITS uncommitted diff.
The harness refuses `git -C` into another worktree, so the replay went through `diff -qr` + a
file copy: **13 files differed, copied byte-for-byte, `git diff --stat` reproduced pass 1's own
1,003+ / 1,363− exactly.** `vue-tsc` ran clean on the replayed tree before a line was added.
Pass 1 carried: the `askingAct` factory, the note berth, the pin band, the `--cost-head-h`
publisher, the Fraunces `p`, the retired 8% ground. What it did **not** carry is the reason this
record exists: **pass 1 never ran the golden battery** (it needs a dist), so its "goldens
unmoved" was a source argument. It is now a measurement, and it says the opposite.

## 1 · The gate table

| Gate | Reading | State |
| --- | --- | --- |
| G1–G6' | mechanics, copy, names — unchanged from pass 1's readings (`p2.json`) | GREEN |
| G9' contrast (the retired 8% ground) | asked word `sure?` **4.990** light / **6.303** dark; band name 19.451 / 15.839; caption 4.659 / 7.681 — identical in chromium and webkit | GREEN |
| G12' Fraunces `p` | subset re-cut, 31 codepoints, **14,948 B**; `unicode-range: U+006B-0070`; `index.css` total **22,884 B** | GREEN |
| G14 Escape closes the sheet | second Escape: sheetTop **216 → 844**, both engines | GREEN |
| G15 the asking face | two real buttons inside one face; `no` reachable by keyboard; verb re-focused on disarm | GREEN |
| G16 the pinned head | occlusion **71.5% / 63.3% → 0.00%** (the pin band) | GREEN |
| G17 note overhang | worst overhang **2.66px**, chip coverage **0.00%** (was +12.23/9.61% dock, +27.17/8.88% desk, `fill` +11.44/11.83%) | GREEN after three measured cuts |
| G18 the fold ratchet | planted 200 → republished **66**, restored **66**; publisher removed → `min-height: auto`, fold 65.58 | GREEN |
| G19 theme-selectors | the `[data-under-bar]` orphan swept | GREEN |
| units | **66 files / 816 tests**, 0 failed (`GameControlPanel.test.ts` = 40 rows) | GREEN |
| vue-tsc · prettier · 7 estate lint gates · `vite build` | exit 0 each | GREEN |
| **filter census (built dist, both engines)** | **12/12 passed** — G3.1 budget equality, G3.2 fills + transforms, G3.3 coarse regime, G3.5 hover mints nothing | GREEN |
| **goldens (built dist)** | **3 of 4 RED** — see §2 | **RED, declared** |

## 2 · The goldens move, and the control proves it is this family

Run on this worktree's own dist at `:4235`, `playwright-golden.config.ts` (chromium, 1280×800,
DPR2, PRM through `emulateMedia`):

| golden | expected | received | diff | floor |
| --- | --- | --- | --- | --- |
| `logo-light` | 768×226 | 766×226 | 4,691 px, ratio **0.03** | 0.017 |
| `toggle-crest-dark` | 144×144 clip | same | 529 px, ratio **0.03** | 0.017 |
| `cell-light` | 144×144 | 142×144 | 763 px, ratio **0.04** | 0.02 |
| `grid-corner-light` | — | — | — | PASS |

**The control:** the same worktree reverted to HEAD, rebuilt through the same lane config,
served from the same preview port, same battery — **4 passed, exit 0**
(`readings/golden-control.log`). The REDs are this family's, not a stale baseline. (HEAD's
rebuild reproduced `index-9rZPzI5DEcpe.js`, the tree's own dist hash, so the control really is
HEAD.) The family run was then taken again on the FINAL tree, minutes after the control and on
the same lane, and reproduces **3 failed / 1 passed with identical magnitudes**
(`readings/golden-mine.log`) — the pair is what this record cites. Three earlier 4/4-green
golden logs sit in the session scratch; they cannot be attributed to a known dist state, so
they are cited nowhere and were not banked.

**The mechanism, measured (`readings/p2e-head.json` vs `p2e-mine.json`):** no asserted surface
changed size. The logo box is 382.39 CSS wide on both; the first cell is 70.66 on both; the
toggle's box is `(1124, 64, 104, 104)` on both; the board is 640 on both. What changed is
**where they sit**:

| box | HEAD | CTRL-COST | Δ |
| --- | --- | --- | --- |
| `.controls-card` width | 324.22 | **365.97** | **+41.75** |
| board / logo / cell x | 129.89 | **109.02** | **−20.87** |
| card `padding-top` | 20px | 50.6px | +30.6 (the pin band, by design) |

The card is shrink-to-fit at the desk, so its width is the widest max-content box inside it, and
the row centres on the card's own centre (988 both ways) — so the card growing left-walks the
whole board column, and every crop lands on a different sub-pixel phase.

**The contributor, named (`p2f-head.json` vs `p2f-mine.json`):** HEAD's widest box is the
keyboard legend at **284.22**. Ours is the `writing` band's act row at **325.97** — `play-controls`
179.59 (undo·redo·hint) + `fill` 63.59 + `solve` 63.59 + two 9.6 gaps. At HEAD those five are
never on one line: `fill` and `solve` live in the sticky `.action-bar` (max-content 216, its verb
strip 184). Gathering the writing acts into one rung is precisely what the ladder asks for, and
**41.75px is its price.**

**The cure was auditioned and it does not clear the gate.** `contain: inline-size` on the act row
(+ `flex-basis: 100%` on `play-controls`, desk only) releases the row from pricing the card — and
the title passes straight to the marks options row at **302.42**, card **342.42**, board x 120.78:
the walk halves to 10.27px and the goldens still move. So the family needs more width than HEAD's
card whatever that row does. The audition is recorded in the source comment at `.band-acts` and
**reverted** — the tree carries the honest single row.

**Disposition (U-10, the owner's):** either the three goldens are re-minted in ONE reviewed
`--update-snapshots` act as part of adopting this family, or the card's width is pinned by a law
that outranks its content. A card's width law is **W2's mechanic, not this family's**, so a
prototyper may not write it — and re-minting a golden to quiet a red I caused is the
re-baseline-on-a-single-red trap the campaign has paid for twice. Declared, not cured.

## 3 · Gaps — everything still open

1. **The goldens are RED** (§2). Blocking for adoption; the disposition is not mine.
2. **`--sheet-chrome` does not exist in this tree.** The spec says the berth's clearance is
   "CONSUMED from W2 §2.5's derivation"; the token reads empty, so that consumption is NOT
   landed and the berth's geometry is my own arithmetic.
3. **430×932 seam RED (−20.52 / −20.81)** — inherited from HEAD, unclaimed by this family, not
   cured here.
4. **844×390 (landscape) seam reads −120.9 / −121.3** — newly measured, unclaimed, uncured.
5. **The `no` painted-bytes read degenerates** on a mostly-blank 56×44 box (percentile
   collapses: 1.171 light / 1.336 dark). The load-bearing figure is the composited
   **19.451 / 15.839**; a painted-bytes claim for that glyph needs a tighter crop.
6. **PW-WebKit cannot Shift-Tab to the verb**, so that leg of the focus contract is
   chromium-measured only.
7. **`guardFace` was null in the gallery π read** — the guard ribbon was never armed, so that
   row is unmeasured rather than green.
8. **The toggle-crest red is attributed by geometry, not by pixels.** Its box does not move,
   so the 529 px are the crop's own phase — but the spec itself records this golden as
   marginally convergent, and I did not run it three times to separate the two.
9. **No visual pass by eye on the desk two-row audition** (§2) — it is reverted, so nothing
   ships unseen, but the tier-split layout it implies has never been looked at.
10. **The unit layer still cannot witness a rank**: the tap floor, the pin band and the berth
    are CSS claims; jsdom applies no stylesheet, so all three ride the probes here and nothing
    in CI holds them.

## 4 · What is on disk

- `readings/` — `p2.json` `p2b.json` `p2b-2.json` `p2c.json` `p2d.json` (pass-2 measurements),
  `p2e-head.json` `p2e-mine.json` `p2f-head.json` `p2f-mine.json` `p2g-mine.json` (the golden
  attribution), `hue-census.txt`, `law-probe.txt`, `golden-control.log`, `golden-mine.log`,
  `census.log`.
- `probe/` — `vite.lane.mjs` and the probes `p2 · p2b · p2c · p2d · p2e · p2f · p2g`.
- `instruments/` — `hue-census.COPY.mjs`, `law-probe.COPY.mjs` (r0 copies, re-pointed), and
  `law-probe.PROPOSED.diff` (r0 row **MOVED** — its subject moved with the band head; proposed
  as a diff, never re-cut in place).
- `frames/` — four crops, 172 KB total: `ask-390-light.png`, `ask-390-dark.png`,
  `pinned-head-390-116.png`, `writing-note-1280.png`.
