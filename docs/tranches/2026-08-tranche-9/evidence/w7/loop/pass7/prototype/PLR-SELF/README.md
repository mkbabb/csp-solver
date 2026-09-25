# PLR-SELF · pass 7 (PROTOTYPE): the key on both axes, re-read at rest, four bands, the sequence guard

T9-W7 §11's leader. Advanced IN PLACE in `.claude/worktrees/w7-p4-PLR-SELF`. Base and π control are
**`74a2b5d9`**. Nothing is committed. Under U-10 this lane proposes and the owner disposes. The pass-7
number is the critic's.

| | |
|---|---|
| worktree diff | **24 files, +2,234 / −402** vs `74a2b5d9` (pass 6: 24 / +1,901 / −402; the bank's 23 files exclude `docs/tranches/LEDGER.md`, +2) |
| pass-7 delta | **3 files, +432 / −99** over `pass6.diff`: `PlayerMark.vue`, `HeadSheet.vue`, `e2e/player-mark.spec.ts` (`pass7-delta.diff`, 36,939 B, sha1 `e808c067e391`, `git apply --check` 0 on `74a2b5d9` + `pass6.diff`) |
| substrate for COUNT and PLACE | `pass7-substrate.diff`: 157,612 B, sha1 `f187d83e978d`, 24 patches, `--binary`; `git apply --check` **0** on a fresh `git archive 74a2b5d9` (web/frontend + LEDGER.md) |
| replay route | **In place.** Before any edit, the tree was compared with a scratch `git archive 74a2b5d9` + `pass6.diff` (`git apply --check` 0, apply 0): exactly 3 files differed (the dead attempt's, below) plus the unbanked `LEDGER.md`. No reset, no replay |
| sha1 battery = bank | `PlayerMark.vue` `25b082fd57e1` · `HeadSheet.vue` `f778030625c4` · `player-mark.spec.ts` `677ac6bee362` at the start and end of every battery and at return |
| dist cited | `index-Dsjt37jfIbJ3.js`, 43 files (control 43), built after the last source edit, outDir and cacheDir in scratch, `.plr-self/` moved out during the build |
| servers | dev `:4241` (config `.plr-self/vite.dev.mts`, cacheDir in scratch) · control `:4233` (`index-CubiZsMVSwTc.js` by hash; `:4239` was held by a sibling) · tree dist `:4232`. Killed by recorded PID (listeners 52266 / 53079 / 93725, npx 52219 / 52854 / 93698); the three ports read free |
| box load | 1-min load **322–353** during the first spec run and the first gate pass; 45–250 across the probe batteries (printed per reading in `readings/`) and 49–69 for the final spec run. No timing row is gated in this pass |

## 0 · Gaps first

1. **The state line is RED on the chair's glyph probe's absolute floor (G2) in all four cells, and so is
   the control's caption.** Clean readings, 1280×800, PRM, DPR 1, pop 236–245 px: light **2.167 / 2.275**
   (ch/wk), dark **4.140 / 3.309**. The control's `@mbabb` caption on the same probe: light **2.270 / 2.148**,
   dark **4.245 / 3.404**. The fraction under 4.5 sits inside the control + 0.05 in every cell: light 0.746 /
   0.797 against 0.971 / 0.981, dark 0.540 / 0.624 against 0.584 / 0.662. LAWS P6 §E asks for ≥ 4.5
   "wherever the control clears it", and the control clears it nowhere. This is **T9-R8**, cited and not
   re-cured. The pass-6 dark fraction (0.232 vs 0.037) was read with the lane's own statistic. It doesn't
   reproduce on the chair's whole-population probe, where the tree and the control are within 0.01.
   Chromium light also reds G4 on the clean line (slice 13 at 2.69). I haven't said whether that's a thin
   glyph or a real fade.
2. **Landscape is BALLOTED, not cured.** A new const, `NAMES_OVER_CELLS` (one line), builds the second
   arm. Its cost: it moves the desk, CH-71's ratified corner, for this sheet alone. CH-71 says a pose cure
   is "a pose decision for BOTH disclosures at once". The table is in §2.2. **No frame**: the pair differs
   on a board with four rows against one, and the lane has no frame left to retire (LAWS P6 §C).
3. **The landed four-band row is a PORT of the chair's `edge-bands.mjs`, not an import.** A product spec
   can't import from a frozen evidence directory. The port uses the same clauses (≥ 8 stations and a
   core median ≥ 3.0 per band, ON against edge-OFF), but not the chair's scroll poses or occluder naming.
   Its verdicts agree with the CLI on every plant (X6, X4, FADE15, X5 light RED). I didn't compare the
   numbers station by station. LAWS §I calls a re-implementation a row. The objection is carried here, and
   the fold decides.
4. **`check-pw-projects` / `test:e2e:projects` read RED on the tree (exit 1; control 0).** Check 8 FLOOR
   BAND: `playwright.config.ts` chromium live 252 against floor 214 (owes 215), and webkit 250 against 212
   (owes 213). This pass's three new rows pushed the floor under 85 %. The script's own FLOOR TIMING says
   the restamp is WGATE's (`--restamp`, "WGATE only"), so I didn't run it. `--restamp --dry`: 2 floors move,
   9 stay. Declared; it's the fold's row.
5. **No landed row reads the radius.** The derivation is proven by a probe (§1 row 6) with its literal
   plant, not by a spec row.
6. **The sequence guard is proven under the chair's RELABEL plant, not on iOS.** A real iOS tap is M19's,
   and M19 is unmeasured.
7. **The filter census was read at rest only**, not at boot (§2.5). The boot row is VERB's.
8. **The first whole-spec run read 26 / 4 at load 322–353, with 2 workers.** Three were `stable()` 8 s
   timeouts inside `invite`/`openSheet`, and one was a 180 s screenshot timeout. A direct probe of the
   768×1024 dock shows it settling in 0.5 s. The same file on the same sha1 read **30 / 30** at load
   49–69 with 1 worker. That's a loaded box, not a flake I can prove is absent, so it's declared.
9. **Inherited, unmoved:** the undefined-token census `STALE --refuse-dur` (tree and control both exit
   1); the dark filter count 11 (= control, the integrator's crayon-heart pick); room rows dev-vs-dev
   (W8 §8.3); `visual-regression.spec.ts:790` WebKit (T9-R3); `multiplayer.spec.ts:962` env-gated; r0
   I4/I5; the pose floor (U-10, crop 2). I did not see COUNT's or PLACE's pass-7 rows.
10. **π was not re-run whole-DOM.** The pass-7 delta changes no resting paint. The frame's path `d` is
    byte-identical to the literal-radius arm at a 16 px root (sha `e5926b5d7f10`, both engines). The
    filters equal the control's. Four behaviours move and are claimed: re-fit on resize, the budget key,
    a press on the sheet keeping focus (mouse and touch), and the click guard.

## 1 · The charter's ten rows

| # | row | pass-7 reading (both engines) | state |
|---|---|---|---|
| 1 | two-axis key | `fit()` renders tall and then short, reads each sheet's untransformed box, and treats a lap as an overlap on BOTH axes. `short` wins when the tall sheet laps and one row clears it, or when the board runs under the rows' start. **768×1024 coarse: 1 row, 0 lapped** (pass 6: 4 / 3). The landed row `a portrait phone compresses…` asserts 768×1024 `{rows 1, lapped 0}`. **P1** (pass 6's one-axis key back) reds it ×2 | **closed** |
| 2 | re-fit at rest | While the sheet is open, `resize` and a `transitionend` outside the head queue a rAF re-fit. It's a no-op when the board box and window are unchanged. Landed row `an open sheet reads the space again…`: 390×844 open → 390×800 → at rest **1 row / 0 lapped** = a fresh open. **P2** (listeners struck) reds it ×2. The chair's `rest-probes --preset self-resize`: tree **GREEN ×2** (4/0 → 1/0 = reopened 1/0, settle 167/163 ms at load 154/129); under P2 **RED ×2** (4 rows / 7 lapped) | **closed** |
| 3 | four bands | Landed row `both head disclosures paint a drawn edge on all four sides…` (the port, gap 3), light, 1280×800. Plants in the run: X1, X2, X6 (−4 and −8 variants), X4, FADE15, X5 0.4 (required). X7 0.5 is printed only (≥ 3.0 is a visible edge by §2.4). **P5** (X6 as a FILE edit) reds it ×2. The chair's CLI (`paint-probes --probe edge --plants`), card AND lobby, light AND dark, both engines: **clean GREEN on all four bands, every required plant RED** (8 × exit 0). X6 reads bottom **1.00** with topOnly GREEN. X4/FADE15 read 1.34–1.44. The X5 sensitivity row is RED in light (2.35–2.58) and GREEN on some dark bands (3.1–3.2), which is lawful per the chair's README | **closed** |
| 4 | sequence guard + row tap | `clickOwed` is set by the touch release that toggled, and cleared by the next click, press or key. `click.pointerType` is never read. The sheet's own press is prevented like the mark's, and its touch release shuts it. Landed rows: `one tap is one toggle when the tap's click is labelled as a mouse` (RELABEL built in: a trusted touch click re-sent as `mouse`, or one synthesised 60 ms after release) GREEN ×2, and **P3** (pass 6's label guard) reds it ×2. `a tap opens the mark…` adds the ROW TAP (the cell keeps focus, 0 `cur` frames, the sheet shuts), and **P4** (the sheet un-prevented) reds it ×2. The chair's rest probes: self-touch GREEN ×2 (mark 1 toggle; row tap → `INPUT[cell]`); +RELABEL GREEN ×2 (1 toggle); under P3 +RELABEL **RED ×2** (2 toggles); under P4 the row tap reads **BODY ×2**. Arm (b) re-read on the wire (§2.4). iOS stays M19's | **closed (emulated)** |
| 5 | T9-R8 | Re-taken on the glyph population with the absolute floor, the FAINT/FADE/TAIL/EMPTY plants in the run (every plant RED every cell). Gap 1 | **cited T9-R8** |
| 6 | `--tap-floor` · `:radius` | `--tap-floor`: pass6/CHAIR-RULINGS **A.3** admitted the INHERITED row. The census with A.3's row (`instruments/undefined-token-census.A3.mjs`) reads the tree **0 bare**, 1 STALE (`--refuse-dur`, inherited), exit 1. The control reads 0 bare and 2 STALE (`--refuse-dur` plus `--tap-floor`, which the control lacks, as A.3 says), exit 1. Without A.3's row: tree 2 bare. Cited, not re-landed. `:radius`: `HeadSheet` reads the ground's computed `border-top-left-radius` less the edge's `offsetTop` on a ResizeObserver. `radius.mjs` at a 16 px root: `d` sha **`e5926b5d7f10` on the tree = the literal-15 plant (P7)**, both engines (nothing moved). At 18 px the tree and P7 differ (ch `df1b0dd90c9e` vs `00efc347ea8a`; wk `5eb75a31d13e` vs `8a21342903f3`) | **closed** (gap 5) |
| 7 | landscape + unpriced cells | Priced in both arms, §2.2. Balloted (gap 2) | **balloted** |
| 8 | T9-B30 | QUIET re-measured on the chair's four-band probe (§2.3). Its cost is stated in §3. Crop 1 stands (the path is unchanged at a 16 px root). Crop 3 is re-shot with B's id pinned `p-0000000b0b0b` and A's id seeded, so the slugs are identical across arms | **framed** |
| 9 | the half-closed head | Landed row `shut, both head disclosures paint nothing`: after a dismissal, at rest, each sheet reads pose `0 hidden none`, and 0 px differ from the sheet removed (net of a second bare photograph). The in-run plant (shut at 35 % and visible) must move > 100 px. **P6** (a file edit: shut opacity 0.35) reds it ×2 | **closed** |
| 10 | the hand-off | `pass7-substrate.diff` (sha1 `f187d83e978d`) and `pass7-delta.diff` (sha1 `e808c067e391`). File sha1s: `PlayerMark.vue` `25b082fd57e1…` (blob `55e7a69e`), `HeadSheet.vue` `f778030625c4…` (blob `71db527a`), `player-mark.spec.ts` `677ac6bee362…` (blob `d995c298`). Rows 1–4 all land in `PlayerMark.vue` + the spec, and row 3 in the spec alone | **handed** |

**The break battery** (`instruments/battery2.sh`, `plant.py`). Each plant is a file edit hot-swapped
into the dev server and restored by copy with sha1 verified. The whole break battery ran on the bank
sha1s. P1 → `:508` RED ×2 · P2 → `:567` RED ×2 · P3 → `:689` RED ×2 · P4 → `:605` RED ×2 · P5 → `:822` RED ×2 ·
P6 → `:922` RED ×2 · all restored OK.

## 2 · The numbers

### 2.1 The whole spec file, bare (`player-mark.spec.ts`, dev `:4241`, both engines)

**30 passed / 0 failed** (1 worker, 2.2 min, load 49–69), on the bank sha1s. Gap 8 has the loaded run.

### 2.2 The band census, both arms (`readings/regime-census.txt`, seven at the table)

rows / lapped. `names` = `NAMES_OVER_CELLS = true` (default); `cells` = false. The engines agree unless
two numbers are shown (ch / wk).

| cell | pointer | names | cells | one row would lap (names arm) |
|---|---|---|---|---|
| 390×664 | coarse | 1 / 7 | 1 / 7 | — |
| 390×800 · 360×800 | coarse | 1 / 0 | 1 / 0 | — |
| 390×844 | coarse | 4 / 0 | 4 / 0 | 0 |
| **768×1024** | coarse | **1 / 0** | 1 / 0 | — |
| 520 / 560 / 620 / 700 × 800 | coarse | 1 / **5 / 5 / 8 / 4** | same | — (the phone class: board left 14–16; one row is the floor) |
| 844×390 9×9 | coarse | 4 / **6** | 1 / **4** | 4 |
| 812×375 9×9 | coarse | 4 / **5** | 1 / **3** | 3 |
| 844×390 16×16 | coarse | 4 / **9** | 1 / **6** | 6 |
| 812×375 16×16 | coarse | 4 / **18** | 1 / **12** | 12 |
| 800×700 | fine | 4 / **6** | 1 / **3** | 3 |
| 900×640 | fine | 4 / 2 / 3 | 1 / 1 | 1 |
| 1280×800 (CH-71) | fine | 4 / 3 / 4 | 1 / 1 / 2 | 2 |
| 1280×720 | fine | 4 / 2 / 3 | 1 / 2 | 1 / 2 |

The desk reads 3 / 4 lapped where pass 6's record read 2 / 3. The board top moves 117.3–124.5 between
reads (settling), and I haven't separated the two.

### 2.3 The edge, four bands (the chair's CLI; core median per band, top · right · bottom · left; `<3` = fraction of stations under 3.0)

| | FULL card | FULL lobby | QUIET card | QUIET lobby |
|---|---|---|---|---|
| ch light | 14.66 · 14.46 · 17.65 · 17.65 (top <3 0.024) | 17.36 · 15.03 · 17.52 · 15.96 (0.024) | 4.10 · 4.01 · 4.66 · 4.66 (**top 0.262, bottom 0.184**) | 4.66 · 4.16 · 4.66 · 4.27 (**0.248 / 0.204**) |
| ch dark | 12.67 · 12.17 · 14.30 · 14.40 | 14.37 · 12.71 · 14.37 · 13.31 | 5.00 · 4.90 · 5.53 · 5.57 (0.155 / 0.034) | 5.58 · 5.07 · 5.58 · 5.20 (0.087 / 0.039) |
| wk light | 13.70 · 14.36 · 16.24 · 17.33 (0.049) | 15.03 · 14.46 · 15.22 · 15.40 (0.044) | 3.95 · 4.09 · 4.45 · 4.65 (0.155 / 0.073) | 4.20 · 4.14 · 4.26 · 4.26 (0.102 / 0.058) |
| wk dark | 11.96 · 12.46 · 13.76 · 14.54 | 12.93 · 12.55 · 13.06 · 13.18 | 4.80 · 5.00 · 5.40 · 5.63 (0.112 / 0.039) | 5.07 · 5.07 · 5.14 · 5.21 (0.092 / 0.039) |

Both arms clear the ≥ 3.0 per-band floor in every cell. The control's card hairline reads 1.06 on
pass 6's statistic. I didn't re-read it on this probe.

### 2.4 The seam's wire, both arms (crop 3's run; payload `ATMuMDM0OTUyMDYw…`; givens read back identical on A and B)

| arm | engine | B's id | slugs | B's ring before → after A's mark tap | A's focus |
|---|---|---|---|---|---|
| (b) default | ch / wk | `p-0000000b0b0b` | `rainy-hoverfly`, `quickest-rodent` | 1 → **1** | `INPUT[cell]` both |
| (a) | ch / wk | same | same | 1 → **0** | `BUTTON.player-mark` (ch) · `BODY` (wk) |

### 2.5 The constraints

- **filterBudget** (estate rule, `instruments/filters.mjs`, at rest, dist `Dsjt37jfIbJ3` vs control
  `CubiZsMVSwTc`, shut / card / lobby): light **9 / 9 / 9 = control 9 / 9**, dark **11 / 11 / 11 = control
  11 / 11**, both engines. Nothing grows.
- **M16**: `check-copy-register` exit 0, and the pass adds no new strings.
- **@property**: `check-property-block` source GREEN (tree 0, control 0). Served, `--dist` + `--served
  :4232`: GREEN (0), and the control on `:4233` also GREEN (0).
- **undefined tokens**: see row 6.
- **W2's mechanics** are untouched. No new mechanic, only a pointer policy and a re-read.
- **CH-70**: `grep 'keydown.enter' src` finds 2 comment hits, and 0 handlers.
- **Decided history**: no r0 row is re-worded. L3 is spent, L17 cited, law 39 adopted (all unchanged).
  L5b is the chair's (pass7/CHAIR-RULINGS §2: inlined at the fold). **No r0/R6 row MOVED this pass.**

### 2.6 The pre-return battery (bare; tree · control)

| gate | tree | control |
|---|---|---|
| `player-mark.spec.ts` whole, both engines | **0** (30/30) | n/a (the file is the lane's) |
| `lint:lanes` (`check-lane-membership --self-test`) | 0 | 0 |
| `lint:theme-tokens` | 0 | 0 |
| `lint:sleep` | 0 | 0 |
| `lint:bands` · `lint:verbs` | no such script on `74a2b5d9` | same |
| `test:e2e:projects` · `check-pw-projects` | **1 · 1** (gap 4, FLOOR BAND) | 0 · 0 |
| `check-property-block` source · served | 0 · 0 | 0 · 0 |
| `check-copy-register` | 0 | 0 |
| undefined-token census (A.3 row) | 1 (STALE `--refuse-dur`, 0 bare) | 1 (2 STALE) |
| `eslint .` | 0 (after `.plr-self/` moved out; the one spec comma-expression fixed) | not run (no writes in the control) |
| `npm run lint` (`prettier --check src/ scripts/ ../../scripts/ ../relay/`) | 0 | not run |
| `vue-tsc -b` · `typecheck:e2e` (on a `git archive` of the tree) | 0 · 0 | — |
| vitest, chunked (9 directory chunks + the two top-level files) | **830 passed / 0**, 68 files (the `scripts` chunk has 0 files, exit 1 "no test files", a rig artifact; `cards`/`posters` run separately, 19/19) | — |

## 3 · Ballots for the owner (U-10)

- **T9-B30, the head sheet's edge ink** (crop 1, pass 6's, stands): FULL (default) against QUIET.
  **QUIET's cost, stated:** in light, **15–26 % of the top band's stations and 6–20 % of the bottom's sit
  under 3.0 : 1**, against FULL's 2.4–4.9 % (the top) and 0–2.4 % (the bottom). Every band's median clears
  3.0 in both arms (QUIET 3.95–5.63, FULL 11.96–17.65).
- **The touch seam** (crop 3, the replacement): (b) default, "a tap is a look", against (a). In (b) the
  cell keeps focus and B keeps A's ring. In (a) the ring goes and focus leaves the cell. One payload, one
  variable, the slugs identical.
- **NEW: names or cells** (`NAMES_OVER_CELLS`, unframed, gap 2). Default `true` keeps four names where
  one row still laps the board. The cost: 844×390 6 vs 4, 812×375 5 vs 3, 16×16 9 vs 6 and 18 vs 12, 800×700
  fine 6 vs 3. The `false` arm pays one row's cells everywhere, and **moves the desk** (1280×800: four rows
  to one; CH-71's pose changed for this sheet alone).
- **The pose floor** (crop 2) and **F1** (pass-5 crop 2): U-10, unchanged.

## 4 · Frames

| file | engine · theme · viewport · pointer · DPR | payload | retires |
|---|---|---|---|
| `3-seam-b-vs-a-chromium-light-390x844-coarse-dpr1-pinned.png` (20,751 B, pngquant 60–90) | chromium · light · 390×844 · coarse (hasTouch, witnessed) · DPR 1 | `ATMuMDM0OTUyMDYw…` (112 chars, `instruments/`); B's id `p-0000000b0b0b` | **`pass6/prototype/PLR-SELF/3-seam-b-vs-a-chromium-light-390x844-coarse.png`** (24,526 B) |

Left is (b), right is (a). Top: A's head with the sheet open, the cell's column highlight kept in (b).
Bottom: B's middle band, with A's ring on the `1` cell in (b) and none in (a). Net change to the wave:
−3,775 B. Crops 1 and 2 of pass 6 stand.

## 5 · The dead attempt (run `wf_e1efa465-923`), per hunk

It left 3 edited files plus scratch (`.plr-self/`, `scratchpad/plrself7/`). There was no unrestored plant:
the tree's `PlayerMark.vue` was byte-identical to every `hold.*` copy it had made, and `HeadSheet.vue` to
its X6 hold. All servers were dead. I **kept** every product hunk: the two-axis key, the re-fit, the
sequence guard, the sheet's press, the live radius, the four-band port, the RELABEL row and the shut row.
I **finished** them: the `NAMES_OVER_CELLS` arm, and one comma-expression `eslint` error at the RELABEL
row. None of its evidence is cited. Everything above was re-measured this run. Its
`readings/rest-probes-tree.txt` and a duplicate census copy (byte-identical to pass 6's) were moved to
`scratchpad/trash-plrself7-1/`.

## 6 · Incidents

1. I bound the control on `:4239` without re-scanning. `nc` said it was held, and `--strictPort` refused.
   The control was re-served on `:4233`, and nothing of the sibling's was touched.
2. The chair's `paint-probes` take a CSS selector (`document.querySelector`). My first lobby and
   state-line calls used `:visible` and threw, which read as a clean RED (exit 1). They were re-run with
   `.corner-left [data-lobby]`, and the rows above are the re-run's.
3. The first filter census counted visible filters only (5/6/7). It was re-cut to the estate's rule
   (9/11), and both are in `logs/`.
4. Moving `.plr-self/` out for the build removed the dev server's config under it. Vite logged "server
   restart failed", then restarted when the file returned. No reading was taken during that window.
5. The first spec run was on a box at load 322–353 (gap 8).
6. `rm` was never invoked, and neither was git in the control. Discards went to
   `scratchpad/trash-plrself7-1/` (including the tree's `.plr-self/`). Scratch is
   `scratchpad/plrself7b/` and `plrself7-base/`, and it's the chair's to clean.

## 7 · Replay

`instruments/`: `gates.sh` (browserless gates, tree and control), `instr.sh` + `lobby.sh` (the chair's
rest, edge and glyph probes, plus the radius), `battery2.sh` (both regime arms, the breaks, the seam
frames), `quiet.sh` (T9-B30), `build.sh` + `vite.build.mts`, `filters.mjs`, `tsc.sh`, `vitest.sh`. The
scratch specs are `p7-regime.spec.ts` and `p7-seam.spec.ts`, with the config `pw.scratch.mts`.
