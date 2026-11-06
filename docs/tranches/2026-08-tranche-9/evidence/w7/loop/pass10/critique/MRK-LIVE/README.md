# MRK-LIVE · pass 10 · CRITIQUE (§4, the live ring)

Non-author critic. The number is mine (LAWS P8 §C). Scratch root `.claude/t9-scratch/work/pass10/crit-MRK-LIVE/`
(named only as the root; nothing here points into it as evidence). Ports :4238 / :4253 were **never opened**
(§3: the zone).

## 0 · Verdict, numbers first

- **Number: 84 (held; pass-9 critic 84).** Verdict **ADVANCE** (the family stays §4's leader; the batch gate is
  NOT MET; no fold to the union).
- **Batch gate** ("watch 2 CLOSED or WALK folds into TIN; LIVE's union row GREEN under every regime"): **NOT
  MET.** The union was not read by the lane in any regime and no union dist exists; I could not read it either
  (§3).
- **CHAIR pick 3 (T9-M15, judged on arm (a) only): UNMET.** Arm (a) is unbuilt: no outset geometry, no plant, no
  reading, nothing built on FACE's pass-10 bank. Arm (b) is **not admissible** (nobody showed (a) failing in
  either engine; (a) was never tried). Arm (c) is refused and was not used. T9-M15 stays OPEN at pass 9's
  reading (9×9 tier 2 cell 0 COUNT 118 > 63; 16×16 48–59 > 16), carried, not re-read.
- **CHAIR pick 5 (WebKit dark pose-3 B4 0.031): UNMET.** No per-engine, per-pose key, no moving plant. The caps
  21/24 are untouched (lawful: never loosened).
- **CHAIR pick 21 (G-LIVE-21 jointly, on FACE's bank): UNMET.** No joint geometry; FACE's tree never applied.
- **What advanced, and what I credit:**
  1. **The hold refuses** by the ONE library's `rest-probes.holdPoses` (HR1/HR2), imported by relative product
     path (`./lib/rest-probes.mjs`), the pinning copy kept only as a `LIVE_SABOTAGE=hold` arm. CREDITED on the
     code read and on the lane's chromium logs; **not re-derived by me** in a browser (zone), WebKit unread by
     anyone.
  2. **The undefined-token census ×2** (`gameCell.css:297/:299`) cured on the on-WAVE delta: **re-derived by me
     4 → 2**, with the lane's STALE plant AND two disjunct plants the lane did not run (§2.2).
  3. **`test:font-coverage` `cell-frames`** cured on the on-WAVE delta: **re-derived by me** (wavelive names
     `cursor-name` only; §2.3).
- **What I REFUSE to credit:**
  1. **The ink-keyed FC strip read (R1/R2 "CLOSED" in movedRows) is a spec-local RE-ROLL of an instrument the
     instruments lane owns** (homes v3 `e2e/lib/edge-bands.mjs` clause `inkkey`, `inkOf`, `inkTol = 48`;
     instruments README row 8 "The ink-keyed FC strip read · MRK-LIVE"). LAWS P9 §I: "a lane that re-rolls one in
     its tree has its delta stripped." The lane's own finding (a flat key loses 85–95 % of an alpha Highlight)
     is a **defect of the library's `inkkey`** (`inkOf` slices alpha off, `isInk` flat-matches; its self-test
     uses only opaque literal inks), and the lawful route was a PROPOSED diff with its plant and born-RED. None
     was filed. Row R1/R2-FC is therefore OPEN, and the library hole is a finding for the instruments lane.
  2. **G-LIVE-17's literal cap 12**: browser-UNREAD, its born-RED (CRIT-TAPE3X) never demonstrated, no ±ε pair,
     no 74a2b5d9 born-RED (charter R2 asks for one), slug unpinned; a fitted constant (B-TAPE-COVER proposed).
  3. Every WebKit row (none read), every union row (none read), π and AA (not read), whole-file ×10 (not run).

## 1 · The bank, re-derived (each apply in a git-inited archive; gitdir printed)

| check | result | gitdir · paths |
|---|---|---|
| sha1 `pass10.diff` | `932d9564f4e3833d3d494805b3cd0f79f9bc2419`, 237,216 B (= BANKED.txt) | — |
| sha1 `pass10.delta.on-WAVE.diff` | `b21fafb3e885be62db2be0712b9191a3bac6fc40`, 25,340 B (= BANKED.txt) | — |
| homes v3 by sha | `homes.diff` `07257854…`, `homes.on-WAVE.diff` `0723d508…` (= instruments README) | — |
| `pass10.diff` --check on bare 74a2b5d9 | **0** | `crit/base/.git` · 23 |
| `homes.diff` applied on 74a2b5d9 | **0** | `crit/base/.git` · 13 |
| `pass10.diff` --check on 74a2b5d9 + homes v3 | **0**; applied for real 0 | `crit/base/.git` · 23 |
| round trip vs the work tree | `diff -rq` src / e2e / scripts: **0 / 0 / 0** lines | — |
| `WAVE.diff` applied on 74a2b5d9 (= 954bbbab) | **0** | `crit/wave/.git` · 187 |
| delta --check on the bare WAVE | **0** | `crit/wave/.git` · 3 |
| `homes.on-WAVE.diff` on the WAVE | **0** | `crit/wave/.git` · 10 |
| delta --check on WAVE + homes v3 (declared base) | **0**; applied for real 0 | `crit/wave/.git` · 3 |
| `pass10.diff` --check on the WAVE | **1** (expected: the WAVE already carries pass 9's LIVE; the route is the delta). The section's integrated tree IS the WAVE (§4's only union), so the delta's two checks are the section checks | `crit/wave/.git` |
| home paths in `pass10.diff` | **0** (comm of the 13 homes paths against the 23 `+++` paths) | — |
| leak grep (scratchpad, /private/tmp, /tmp/, .claude/t9-scratch) | **0 / 0** | — |

**The pass-10 step**, read against pass 9's bank (74a2b5d9 + `pass9/prototype/MRK-LIVE/pass9.diff` `931c7a9d`,
applied 0, 36 paths, `crit/base9/.git`) by `diff -rq` over the whole frontend: **exactly 11 files differ** —
the 10 homes v2 → v3 paths (each equal to `homes.on-WAVE.diff`'s path list) and `e2e/focus-ring.spec.ts`
(+111 / −27, now sha1 `1a0255c4`). No `src/` byte moved. The BANKED.txt claim reproduces.

## 2 · Findings (most severe first), each with what I re-derived

### 2.1 · The FC ink key is a fork of `edge-bands.inkkey`; the library's key is itself wrong for an alpha ink (OPEN, both)

- **Where.** `e2e/focus-ring.spec.ts` (sha1 `1a0255c4`) `:509–:550`: `INK_TOL = 48` and a composite test
  `hypot(p − (a·ink + (1−a)·off)) ≤ tol` inside the spec-local `indicatorPixels`, fed `highlightRGB` parsed in
  G-LIVE-21 (`:1182–:1184`). The homes v3 library ships the same re-key as `fourBands({ ink, inkTol = 48 })`,
  clause `inkkey`, `inkOf` (`e2e/lib/edge-bands.mjs:51–53, :135–:152, :210, :244–:247`), registered in the
  instruments README as row 8, "The ink-keyed FC strip read · MRK-LIVE". The spec imports `edge-bands` for
  G-LIVE-23 (`:2012`) but never calls its `inkkey` for G-LIVE-21.
- **The law.** LAWS P9 §I names "the ink-keyed FC strip" among the instruments lane's re-keys: "a lane that
  re-rolls one in its tree has its delta stripped." The checklist's "an instrument … forked after batch 0".
- **The library defect the lane found and did not file.** `inkOf` returns `m.slice(0, 3)` — the alpha of
  chromium's emulated `Highlight` (`rgba(5, 0, 73, 0.8)`, the lane's reading) is dropped, and `isInk` is a flat
  RGB match. The lane's own first read with a flat key lost 85–95 % of the outline (card 154 px,
  `prototype/MRK-LIVE/logs/bat-g21-tree-cr-flatink.log`). The library self-test's `#f-fc` row keys on opaque
  literals (`[0,90,180]` / `[102,178,255]`), so no self-test row exercises a system colour with alpha: the
  library's `inkkey` reds a real alpha outline as absent (a false RED, never a masked GREEN, but every
  consumer that keys on `"Highlight"` in chromium inherits it). This is a homes-v3 gap for the instruments
  lane, and LIVE's composite is the PROPOSED diff it owed (with an alpha-ink self-test row and its born-RED).
- **A threshold with no ±ε.** `INK_TOL = 48` is cited to the library's default but has no ±ε pair on this
  read. Arithmetic on the lane's own ink (no browser): the composite over a black Canvas is (4, 0, 58.4), whose
  distance to an unchanged black pixel is **58.5**, so the clause separates the outline from black Canvas by
  10.5 RGB units at 48; a moved pixel at (0, 0, 20) sits 38.6 from the composite and counts as outline. Which
  Canvas chromium's emulation paints is UNREAD by me; the margin is named, not measured.
- **What it means for the number.** R1/R2's FC row is not credited as CLOSED. The lane's chromium evidence
  (CRIT-FCMOVE 0 px, 4/4 red; `inkkey` clause sabotage GREEN 4.090 / 2.785; control born RED at the existence
  clause) is a sound reading of a forked reader. The WebKit side, where the pass-9 hole was widest (3.838 /
  5.332 / 2.785 / 4.932 GREEN on all four strips), was **read by nobody** this pass.

### 2.2 · The undefined-token census ×2: CURED on the delta (re-derived, with two new disjunct plants)

Read on my WAVE copy (954bbbab + homes v3 + the delta, `crit/wave/.git`) through `undefinedTokens()` of a
`main()`-stripped copy of the copy's own `scripts/check-theme-tokens.mjs` (moved to my trash after the read),
`guarded --light`, exit 0 (`crit/logs/census.log`):

| reading | bare `any` | stale |
|---|---|---|
| wavelive (the INHERITED row present) | **2** (`ConfirmRibbon.vue:140/:141 --tap-floor`, T9-R10's) | 0 |
| the row removed (= waveh3) | **4** (+ `gameCell.css:297/:299 --color-peer-cursor-ink`) | 0 |
| PLANT, the lane's: readers re-pointed in `gameCell.css` | 2 | **1** (the row) |
| PLANT, mine: BoardHost's declaration renamed (the from-file disjunct) | 2 | **1** (the row) |
| PLANT, mine: a third, unledgered reader in `DigitCell.vue` | **3** (`DigitCell.vue:464`) | 0 |

`stale` reds the gate (`check-theme-tokens.mjs:2583`). The row is a true DOM claim: `BoardHost.vue:343` spreads
`peerCursorInk[pos]` (`{"--color-peer-cursor-ink": ink}`, `:92`) into each DigitCell root's style under
`:is-peer-cursor` (`:345`), and `gameCell.css:297/:299` read it in that root's subtree. Every disjunct reds.
I judge it the census's own ledger, not a self-admission (LAWS P9 §F), and file the seam for the chair as
the lane did; the gate's owner section, not LIVE, has the last word.

### 2.3 · `test:font-coverage` `cell-frames`: CURED on the delta (re-derived)

wavelive (`crit/logs/wavelive-test:font-coverage.log`, exit 1): the one finding left is BoardHost's
`cursor-name` (PAL-WALK's, WAVE.md). `cell-frames` is `string[]` path data (`DigitCell.vue:43`, consumed only
as `livingPoses = cellFrames.slice(1)`, `:109`), the same species as the pinned `ghost-path`, so the pin is a
true claim. The gate's own message names a pin as an admission of a bind set; the chair may count it as one.
waveh3 (the same copy with the delta reversed, `git apply -R` 0, `crit/wave/.git`; exit 1): the finding reads
`cursor-name, cell-frames`. The delta moves exactly that one token.

### 2.4 · The hold refuses: CREDITED on the code, chromium only, with one seam

- `holdPoses` (`:1896–:1912`) calls the library's `rest-probes.holdPoses(page, { edge, ring: ".focus-ring",
  exempt: [".cell-ghost", ".game-card"] })` and reds the cell `B-HOLD refused (…)` (`:2030–:2031`). The library
  (`e2e/lib/rest-probes.mjs:116–:150`) pins nothing when any candidate refuses. The pinning copy survives only
  behind `LIVE_SABOTAGE=hold` (the clause-sabotage arm), which is lawful as a plant.
- **The seam the lane declared, sharpened.** `exempt` joins the library's `skip`, and `skip` has two effects:
  a layer **inside** a `.game-card` is skipped outright (neither held nor refused), and a layer **containing**
  a `.game-card` is refused by HR1. The first is the open one: a `will-change: opacity` pose stack inside a card
  (the poster's boil) flips between ON and OFF unheld, and a flip inside the read's inner strip (`inn` px) is
  counted as ring paint. The lane's "the read sees the deck as the user does" is true of the cards' own glide
  opacity, and unproven for what boils inside them. No plant shows it either way: UNREAD (a card-interior pose
  plant under [no-preference] with the outline clipped is the row it owes).
- CRIT-ANC55's selector `:has(> svg.focus-ring)` resolves, by the refusal it printed, to `div.page-root` (the
  ring is a direct child of the page root), so outside reduce it reds by HR1 on the whole page, not on a
  0.55 subtree near the stop. It still reds where pass 9's hold went GREEN, which is the row. Under [reduce] it
  reds on contrast (2.084 / 2.115), the plant's real physics.
- Not re-derived by me in any engine (§3). WebKit: read by nobody.

### 2.5 · G-LIVE-17: a fitted literal with no browser reading (OPEN)

- `G17_COVER_CAP = 12` (`:1472`), the record's widest 10 cells + 2. LAWS P9 §E: a fitted constant names its
  ballot (B-TAPE-COVER, proposed) AND is pinned ±ε with the cells it flips; the ±ε pair is unbuilt.
- CRIT-TAPE3X (`:1597–:1604`) is in-run but **never ran**: the row is dev-only (`?wire=local`, `size=3`, 390×844)
  and nobody served the dev server. Its red is plausible, not shown: on a 9-wide board at ~40 px pitch a
  tape three times its run spans the board; it exceeds 12 only while it still straddles two rows (≥ 17
  others). A one-row tape across the whole board covers ≤ 8 others and passes the cap. So the cap bounds a
  one-row tape of any length at the board's width: it bounds rows, not length, and the covering law it is not.
- The charter's "a 74a2b5d9 born-RED" for the re-keyed bound: not run. The slug is unpinned, so the shipped
  row's own reading can move with the payload (margin 2 cells).
- `poseSettled` (`:1427`, used `:1526`, `:1530`) is still the spec's own rest wait (LAWS P9 §B; CHAIR §21
  strikes it unless folded into `rest-probes`). Declared by the lane; OPEN.

### 2.6 · Chair picks 3, 5, 21 and the batch gate: UNMET (no code, no reading)

The diff holds no geometry for arm (a) (no `--focus-ring-outset` or edge-cell rule moved; `src/` untouched),
no per-engine key for the WebKit dark pose-3 B4 0.031 and no plant that moves it, and nothing built on FACE's
bank. The lane's reason for (a), "no browser reading of the frame-rule width", is not a reason the law admits
for leaving a ruled arm unbuilt. `div.grid-ink` is a masked layer of baked hand-drawn pose paths
(`HandDrawnGrid.vue:509`, `:737`), so its edge width is a painted reading, not a source literal. The lane
had chromium rows under 8M this pass (G-LIVE-21, the four regimes) and spent them on R1/R2, so the frame's
painted width on the union was a budget choice, not an impossibility. The reading arm (a) owed was that
width on the union, an outset built from it, and a born-RED on the union in both engines. Union every regime: unread. So: T9-M15 OPEN on arm
(a); arm (b) not admissible; arm (c) refused; pick 5 OPEN; G-LIVE-21 a product red (pass 9: born RED on the
control too; this pass chromium card 0.274–0.847, staging bottom 0.908 vs 1.80, on a forked reader).

### 2.7 · The five WAVE reds LIVE owns: 2 cured on the delta, 3 open

| red | this pass | who read it |
|---|---|---|
| census ×2 | cured (§2.2) | me, browserless |
| font-coverage `cell-frames` | cured (§2.3) | me, browserless |
| `lint:tape-foot` clause 4 (`index.css:981`) | **RED** on wavelive, exit 1, the three ONE HAND lines (bar, verbs, foot) | me (`crit/logs/wavelive-lint:tape-foot.log`) |
| G-LIVE-19 `:1021` re-point | code only; browser-UNREAD | nobody |
| `face-law:2190` ×6 (`.mobile-heading-btn` dpr 3 bottom 1.33) | uncured, unread; WAVE9-read §5 reads it in BOTH engines on the pass-9 WAVE (50/8/1), arm-born MRK-LIVE | stage 0 (cited, not mine) |

The stage-0 WebKit column of the pass-9 WAVE (WAVE9-read.md, focus-ring 10/6/0 tree vs 2/14/0 control, zone
4841→6208 / 7796→8003) reads the same six focus-ring reds as chromium (`:878`, `:1130`, `:2212/:2279/:2305/
:2329`). That is the pass-9 tree's number, cited; LIVE's pass-10 delta was never read in WebKit.

`lint:sleep` on wavelive: exit 1, the WAVE's own three (`count-yield:302`, `note-reserve:305/:357`), none in
`focus-ring.spec.ts`, as the lane says.

## 3 · The box: every browser row UNREAD by me (the zone); the owner must reboot

`~/.claude/guard/ZONE-ARMED` present throughout (armed 2026-11-03 21:30, per the lane). `tail -1 zone.log`:
11:58:53 **7,958,279** (load 15.42 / 17.94 / 16.03), 11:59:55 7,967,043, 12:00:58 7,977,028, 12:02:00
**7,986,260** (slope 166/s, under 14k from the line, so no row could finish under it), **12:04:05 8,004,873**,
12:05:08 8,013,894. At ≥ 8M no browser row opens (CHAIR §23). So, UNREAD by me, by name and engine:

| row | chromium | WebKit |
|---|---|---|
| G-LIVE-21 lane (ink-keyed strips, CRIT-FCMOVE, FCSIDE, FC1PX, FCCLIP2) | UNREAD (lane's read cited) | UNREAD (nobody) |
| G-LIVE-21 `LIVE_SABOTAGE=inkkey` | UNREAD (lane's cited) | UNREAD (nobody) |
| G-LIVE-21 control 74a2b5d9 | UNREAD (lane's cited) | UNREAD (nobody) |
| G-LIVE-23 + G-LIVE-16 × [reduce] / [no-preference] / [more] / [coarse], CRIT-ANC55 | UNREAD (lane's cited) | UNREAD (nobody) |
| `LIVE_SABOTAGE=hold` | UNREAD (lane's cited) | UNREAD (nobody) |
| G-LIVE-17 + CRIT-TAPE3X (dev-only) | UNREAD (nobody) | UNREAD (nobody) |
| G-LIVE-19 `:1021` on the union (dev-only) | UNREAD (nobody) | UNREAD (nobody) |
| union, every regime; T9-M15 tier 2 cell 0 | UNREAD (nobody) | UNREAD (nobody) |
| `face-law:2190` on wavelive | UNREAD (stage 0 read the pass-9 WAVE) | UNREAD (same) |
| π vs 74a2b5d9, AA from painted bytes | UNREAD (nobody this pass) | UNREAD (nobody) |

Servers: none started, none killed; :4238 and :4253 untouched. **The owner must reboot** before any further
browser row of this family (or any family) opens.

## 4 · Constraints

- **π vs 74a2b5d9:** not read this pass by the lane or me. No `src/` byte moved, so the lane dist equals pass
  9's faithful rebuild by name (`index-D4J4KBuCqu7y.js` + CSS 94,138 B, the lane's statement, not re-built by me);
  pass 9's critic read π 0 at rest. Carried, not re-derived.
- **AA from painted bytes:** unread. **filterBudget 9:** no `src/` byte, no filter moved (code read). **M16:**
  no product string (code read; the lane's `check-copy-register` 0 cited). **@property law:** no `@property`
  touched (code read). **Frames:** none shot, no headroom spent, none to look at.
- **Instruments by relative product path:** `./lib/edge-bands.mjs` (G-LIVE-23), `./lib/rest-probes.mjs`
  (holdPoses), `../scripts/shape-census.mjs` (G-LIVE-19), each via `import(new URL(rel, import.meta.url))`;
  none from `docs/`. **The fork:** the ink key in `indicatorPixels` (§2.1).
- **New fitted constants with no ±ε pair:** `INK_TOL` 48 (§2.1), `G17_COVER_CAP` 12 (§2.5).

## 5 · The exact open gaps (each a row; numbers that hold them)

1. **The FC ink key forked from `edge-bands.inkkey`** (LAWS P9 §I; stripped): file it as the PROPOSED diff to
   `inkOf`/`isInk` (alpha composite over the OFF pixel), with an alpha-system-ink self-test row and its
   born-RED, then re-point G-LIVE-21's strips at the library. `INK_TOL` ±ε pair owed.
2. **The library's `inkkey` drops alpha** (`inkOf` `slice(0, 3)`, flat `isInk`; the self-test keys opaque inks
   only): a homes-v3 hole for every `"Highlight"` consumer in chromium. Instruments lane.
3. **G-LIVE-21 product red**, chromium card 0.274–0.847 / staging bottom 0.908 vs 1.80 (forked reader);
   WebKit unread; the joint geometry on FACE's bank (pick 21) unbuilt.
4. **CRIT-FCMOVE in WebKit** (pass 9's widest hole, 4/4 strips GREEN): not shown closed.
5. **Pick 3 · T9-M15 arm (a) unbuilt**: tier 2 cell 0 on the union RED (9×9 118 > 63; 16×16 48–59 > 16, pass 9).
6. **Pick 5 · WebKit dark pose-3 B4 0.031**: no per-engine, per-pose key, no moving plant.
7. **The hold in WebKit, and the `.game-card` interior skip** (§2.4): unread; a card-interior pose plant owed.
8. **G-LIVE-17**: cap 12 browser-unread, CRIT-TAPE3X never ran, no ±ε, no 74a2b5d9 born-RED, the slug unpinned;
   the cap bounds rows, not length (§2.5).
9. **`poseSettled`** still the spec's own rest wait (LAWS P9 §B, CHAIR §21).
10. **`lint:tape-foot` clause 4** RED on wavelive (re-derived); the lane's arm is an objection with no diff.
11. **`face-law:2190` ×6** uncured; G-LIVE-19 `:1021` browser-unread.
12. **The union in every regime**, the union dist behind `.git` with its CSS vs a clean build, π on 16×16 /
    deck band / coarse 393 / focused frames, whole file ×10 per engine, control ×3: none run.
13. **The chromium [coarse] dark toggle B4 0.024** (2 of 7 runs at pass 9): one clean run, mechanism unread.
14. Carried untouched: THIN_1PX tier 2 left 1.43; D0 PROPOSED; sized 31/228; FLOOR BAND; INTAKE-22 row 44 /
    INTAKE-23 row 37; the crayon-heart dark census.

## 6 · Why 84 and not more (or less)

The pass-10 step is one spec file and two gate lines; no `src/` byte moved, so every product red pass 9 priced
is still priced. Up: the hold refuses through the library (a P9 §D law met, chromium); two of LIVE's five
WAVE reds are cured and hold under my plants, two of them new disjuncts. Down: the FC read, the row the §8.1
line names first, rests on a forked reader (P9 §I) and is not credited; all three chair picks for this family
(3, 5, 21) are unbuilt; two new fitted constants carry no ±ε; nothing was read in WebKit or on the union, so
the batch gate is not met. Those cancel; the number holds at **84**. Earliest 100 for §4: pass 12 at best.

## 7 · Incidents (mine) and the lane's, judged

- Mine: none against the laws that I know of. Every apply ran in a `git init`-ed archive with its gitdir
  printed; the lane's work tree was read by `git archive 74a2b5d9` and `diff -rq` only (no temporary index,
  no blob written to the shared store, no `git status`); no git on MAIN or the control. A `main()`-stripped
  copy of `check-theme-tokens.mjs` lived in my WAVE copy for one read and was moved to `crit/trash/`. My WAVE
  copy had the delta reversed for the waveh3 reads and re-applied after (exit in `crit/logs/gates.log`). No
  browser, no server, no port.
- The lane's five self-declared incidents stand as declared. The read-only `git archive | tar -t` on MAIN is
  a P8 §A breach, priced at nothing because nothing was written. The four chain stops were by recorded PID on
  its own chain.

## 8 · Replay route

1. `git archive 74a2b5d9 web .gitignore .github README.md` into an empty dir, `git init`, `git apply
   pass10/instruments/homes.diff` (`07257854`, 13 paths), `git apply pass10/prototype/MRK-LIVE/pass10.diff`
   (23 paths) = the lane tree (diff -rq 0 / 0 / 0 against the work tree).
2. The same archive, `git init`, `git apply pass9/integrate/WAVE.diff` (187) →
   `pass10/instruments/homes.on-WAVE.diff` (`0723d508`, 10) → `pass10.delta.on-WAVE.diff` (3) = wavelive.
   Symlink `node_modules` to main's. Browserless gates: `npm run -s test:font-coverage | lint:sleep |
   lint:tape-foot` under `guarded --light`; the census via `undefinedTokens()` of a `main()`-stripped copy,
   with the three plants of §2.2.
