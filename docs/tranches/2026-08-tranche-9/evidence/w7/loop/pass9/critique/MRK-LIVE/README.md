# Pass 9 · MRK-LIVE · adversarial critique (§4)

Critic's scratch: `.claude/t9-scratch/work/pass9/crit-MRK-LIVE/` (logs, plants, the scratch spec copy). Ports 4238 (lane dist,
served from the critic's own rebuild of the bank) and 4253 (the control `w7-control`, `index-CubiZsMVSwTc.js`).

## 0 · The bank, re-derived (no lane file trusted)

| check | result |
|---|---|
| the work tree's diff, cut by the critic through a temporary index (`git diff --cached --binary 74a2b5d9`) | tree `5813f90c`, 668,031 B, sha1 `931c7a9d`, 36 files +13,156/−180 = `pass9.diff` byte for byte |
| `pass9.diff` `apply --check` on a fresh `74a2b5d9` archive | exit 0; applied for real, exit 0 |
| `pass8.diff` on a second fresh archive, then `diff -rq` against the pass-9 copy | the pass-9 advance is `e2e/focus-ring.spec.ts`, `e2e/node.d.ts` and the 13 homes-v2 paths, nothing else; **no `src/` byte moved** |
| homes v2 (`homes.diff` sha1 `1f70cfda`) applied on a third archive, `cmp` per path against the pass-9 copy | 13/13 EQ: applied by sha, no residual home edit |
| `pass9.delta.on-WAVE.diff` (sha1 `86088a19`, 23 paths) | home paths in it: 0. `--check` on WAVE (`74a2b5d9` + `pass8/integrate/WAVE.diff` web/ + `homes.on-WAVE.diff` `a0f8e6f3`): exit 0; on the bare WAVE: exit 0; on bare `74a2b5d9`: exit 1 (7 paths), as an on-WAVE delta must |
| section integrated tree | N/A (charter: §4 is in neither section union) |
| grep `scratchpad`, `/private/tmp`, `/tmp/`, `.claude/t9-scratch` over both banks; `+++` to a dot-path | 0 / 0 / 0 (the two `docs/` hits in `pass9.diff` are prose comments inside the homes files, not imports) |
| instruments | the spec loads `../scripts/shape-census.mjs` and `./lib/edge-bands.mjs` through `import(new URL(rel, import.meta.url))`; nothing from `docs/` |
| dist identity | the critic's build of `74a2b5d9 + pass9.diff` serves `index-BmkNOUhcvBnA.css` / `index-D4J4KBuCqu7y.js`, `diff -rq` 0 against the lane's served dist. **Trap, declared:** the first two critic builds served `index-CcbAosw0T4v3.css` (1,437 differing CSS lines: `@container`, the red palette, `--tw-translate-*`) because a `git archive` copy has no `.git`, so Tailwind's scanner ignores `.gitignore` and scans the `node_modules` symlink. An empty `.git` dir at the copy's root restores the boundary. The lane's replay route (§7: "a fresh `git archive` … symlink `node_modules`") does NOT reproduce its dist as written. |

## 1 · What the pass-9 advance is (read in the code, not the README)

The advance is one spec file (sha1 `43d1f322`, +334/−85 lines over pass 8's 2,100) and `process.ppid` in `node.d.ts`. No product byte moved,
so every PRODUCT red pass 8 carried is carried unchanged; the pass's work is gate work. Read clause by clause:

- **`holdPoses` keys on `will-change: opacity`, not on "is a baked pose stack".** It pins EVERY such element outside the ring's own
  subtree to opacity 1 (if it read > 0.5) or 0 — `!important`, for the read. It never asserts that a pinned element holds no focus
  stop and no ring, nor that its opacity was binary. An ancestor of the ring at a fractional opacity is therefore painted at 1 for
  the read: the gate photographs a ring the user never sees (proven, §2 CRIT-ANC55). This is a masked fallback the pass ADDED, in
  every regime outside `reduce` ([no-preference], [more], [coarse]).
- **G-LIVE-17's "covering asserted" is self-relative.** The bound is `cells ≤ 2 × (⌈labelW / pitch⌉ + 1)`: it grows with the label it
  bounds. Its negative control COVER4 asserts only `labelH > pitch` (the one-line clause); no plant reds the cell clause alone, and
  the bound was widened from one row to two after the shipped tape read 6 > 4 (the spec's own comment). A tape stretched along its
  run can never red it (§2 CRIT-TAPE3X). Gap 11 is a booked clause, not a covering assertion; W2 §2.5's law stays T9-R7's.
- **`posed()` pins a pose by `.boil-frame-bitmap:nth-of-type(k+1)`.** `nth-of-type` counts by TAG among siblings, not by class.
  On the lane tree the four `<image>` bakes are the only `image` siblings (it reads); on the union they are the only `div` children of
  `div.grid-ink` (HandDrawnGrid.vue:509–516), so the keying holds there by markup, though no per-pose read has run on the union (it
  was read at [reduce] only, where `posed` is skipped). The loose-cap STALE clause would catch an all-hidden pose. A seam, not a hole.
- **The per-pose caps are the shipped counts** (chromium pose 3 = 21 light / 24 dark; webkit 16; every other 16). Pinned at
  margin 0 with a STALE clause on the low side, so a cap cannot sit above the reading: that is a ratchet, honestly built. But the
  pose-3 caps ADMIT 5–8 more stations under 3:1 than every other pose: an admission minted at the lane, by count, on the same
  frame-cell trade it declined to admit for B4 (gap 4). The lane's own rule (B4 is the chair's) and its cap (COUNT is the lane's)
  are not the same rule. It does not lose to the control (34/33 at the same pose), which is why it is not a regression.

## 2 · The critic's batteries (lane dist on :4238 = the critic's rebuild of the bank; control on :4253)

Every battery runs `npx playwright test` from the critic's bank copy, load-gated under 120, exit written bare to
`logs/bat-<name>.exit`. The critic's plants ride a scratch COPY of the spec (`e2e/crit-ring.spec.ts`, env-gated hooks, never
banked); plant bytes verified with `od -c` (`plants/*.css`).

### 2a · crit1 — G-LIVE-23 [reduce] + [no-preference], both engines, with the critic's plant CRIT-ANC55

CRIT-ANC55 (`plants/anc55.css`): `html:has(button.sun-moon-toggle:focus-visible) :has(> svg.focus-ring) { will-change: opacity; opacity: 0.55; }`
— the ring's own parent at 0.55 while the stop holds focus, no `!important`, laid through the row's own `planted()` on the
row's own PLANT_STOP.

| regime | chromium light / dark | webkit light / dark |
|---|---|---|
| [reduce] (no hold) | **RED** 2.084 / 2.115 on every side, u84/84 | **RED** 2.061 / 2.133 |
| [no-preference] (`holdPoses`) | **GREEN (a hole)** 4.188 / 4.379 — the full ring | **GREEN (a hole)** 4.188 / … |

The same bytes the gate reds under `reduce` read as a perfect ring outside it: `holdPoses` pins the 0.55 parent to opacity 1
(`!important` beats the plant). [more] and [coarse] call the same `read()`, so they carry the same hole by construction.
The shipped product does not exploit it TODAY: the critic's census (`inst/wcprobe.mjs`, `logs/wcprobe-lane.log`) finds 44 pinned
elements on the landing page in both engines, every one at opacity 0 or 1 and none containing a stop or a ring. So it is a
gate hole, not a product red; the cure is two clauses in `holdPoses` (red, not pin, any `will-change: opacity` element that
contains a ring or a stop, or whose opacity is not 0/1), each with this plant.

**crit1 exit 1** (`logs/bat-crit1.log`, `logs/bat-crit1.exit`; load 71.43 at start → 57.04 at end, under 120). 2 passed / 2 failed, 4.0 min:
- [reduce] ✓ in both engines: every lane plant RED plus CRIT-ANC55 RED. Re-derived: 26 judged ok, the 9×9 frame cell at left 2.812 (cr light),
  `u51` on its admission.
- [no-preference] chromium ✘ with exactly two fails, both CRIT-ANC55 (light, dark). Without the critic's plant, the row is green. Re-derived:
  16×16 cell 0 per held pose is 16/16/16/**21** light (pose 3 left 3.148 u5) and 16/16/16/**24** dark (left 3.183 u8), the lane's numbers to the station.
- [no-preference] webkit ✘: CRIT-ANC55 ×2 plus the lane's own declared red, **dark @pose3 B4 bottom 0.031 (1 station)**, reproduced to the thousandth.

### 2b · crit2 — G-LIVE-21 + G-LIVE-17 on the lane dist, both engines (`logs/bat-crit2.log`, exit **1**; load 57.94 → 57.39)

G-LIVE-21 ✘ both engines (the lane's declared product red, re-derived); G-LIVE-17 ✓ both engines.

| G-LIVE-21 strips (depth = painted px / edge) | top | bottom | left | right | total |
|---|---|---|---|---|---|
| card, chromium, CLEAN | 1.063 | 1.251 | 0.792 | 0.907 | 1,468 |
| card, chromium, **FC1PX** (outline 1 px) | 0.907 | 1.024 | 0.863 | 0.765 | 1,311 |
| card, webkit, CLEAN | 0.716 | 1.207 | 1.073 | 0.599 | 1,326 |
| card, webkit, **FC1PX** | 0.925 | 1.719 | 0.785 | 1.658 | **1,882** |
| staging, chromium, CLEAN / FC1PX | 1.322 / 0.253 | 0.966 / 0.057 | 1.878 / 0.878 | 2.000 / 1.000 | 358 / 104 |
| staging, webkit, CLEAN / FC1PX | 1.126 / 0.149 | 0.920 / 0.046 | 1.732 / 0.732 | 2.000 / 1.000 | 331 / 88 |
| card FCSIDE cr / wk | 0.545 / 1.039 | 0 / 0 | 0 / 0 | 0 / 0 | 182 / 347 |

**The new plants are vacuous on the card.** FCSIDE's assertion is "≥ 3 strips red" and FC1PX's is "> 0 strips red", but the CLEAN
card already reds 4 of 4 strips in both engines. On the card a 1 px outline paints 89 % of the shipped 2 px one in chromium and
**142 %** of it in webkit: the row cannot tell the shipped outline from a 1 px plant there at all, and it reports the plant
"caught". On the staging face FC1PX's "> 0" is vacuous too (clean already reds 2 strips); only FCSIDE on staging (≥ 3 against clean 2)
discriminates. So R2's in-run plants prove 1 of 4 assertions. A plant on a row whose clean read is already red must assert a
DIFFERENTIAL (strictly more strips red than clean, or each strip strictly below its clean depth by a stated margin), with a
born-RED that the current form fails.

G-LIVE-17 (re-derived): chromium covers **6** cells, label 105.2 px, pitch 40.22 → bound 2 × (3 + 1) = 8; webkit **8** cells, label
129.3 px → bound 10. The lane's README printed 8 cells / 125.79 px for chromium: the label width moves run to run (the slug is
unpinned), so the bound moves with it. COVER4 printed 15 cells against a bound the row never evaluates for it (its assert is `labelH > pitch`).

### 2c · crit3ctl — the same rows on the control (`logs/bat-crit3ctl.log`, exit **1**; load 70.14 → 70.05)

G-LIVE-21 ✘ both engines at its first clause ("the active card's outline is the system Highlight": `rgb(0, 0, 0)`) — born RED, as the
lane said. **G-LIVE-17 ✓ both engines on the control** (8 cells, labels 130.26 / 128.75 px): the "covering asserted" row is GREEN on
`74a2b5d9`, so it is not a born-RED cure of anything; it books a bound the control already meets.

### 2d · crit4tape — CRIT-TAPE3X on G-LIVE-17 (`plants/tape3x.css`; `logs/bat-crit4tape.log`, exit **0**; load 70.05 → 69.13)

`.attribution-tape .washi-label { transform: scaleX(3) !important; transform-origin: left center !important; }` — the label three
times its length. Chromium: label **376.03 px**, covered area **9,653 px²** (clean 3,526–4,219), 8 cells; webkit 369.19 px, 9,653 px².
**GREEN in both engines**: the bound rose to 2 × (⌈376/40.22⌉ + 1) = 22 with the label it bounds, and the area (×2.3) is printed, never
asserted. Gap 11 is not closed; it is re-worded into a clause that cannot see a longer tape.

### 2e · crit5 / crit6 — threshold sabotage on the per-pose caps (chromium, [no-preference]; `CRIT_CAPD` = −1 / +1 on every `@pose` cap)

- **cap − 1** (`logs/bat-crit5capm1.log`, exit **1**; load 69.08 → 49.89): 8/8 pose reads RED by COUNT (`16 > 15` at poses 0–2,
  `21 > 20` / `24 > 23` at pose 3), and nothing else red. The bound reds by ε on the low side.
- **cap + 1** (`logs/bat-crit6capp1.log`, exit **1**; load 49.89 → 51.48): 8/8 pose reads STALE ("loose by 1"), nothing else red.
- The per-pose caps are pinned at margin 0 in both directions: the threshold battery passes. (The 9×9 `counts`/`regimeCounts` caps
  carry the same STALE clause; the critic did not sabotage them.)

## 3 · Constraints, checked by the critic

| constraint | reading |
|---|---|
| M16 (`check-copy-register.mjs`, the critic's bank copy) | exit 0: 0 dashes, 0 unadmitted jargon (`logs/m16.log`) |
| @property law | the lane CSS carries 45 `@property` rules, `sort | uniq -d` = 0 duplicates |
| `typecheck:e2e` / eslint on the spec + `node.d.ts` (critic's bank copy) | exit 0 / exit 0 (`logs/tsc-e2e.log`, `logs/eslint.log`) |
| filterBudget 9 | `src/` is byte-identical to pass 8's bank (§0); no filter moved; the critic did not re-run `filter-census.spec.ts` |
| AA from painted bytes | every G-LIVE-23 verdict above is a painted four-band read (ON/OFF photographs), both engines |
| π against `74a2b5d9` | the lane's R6 "π re-run" is G-LIVE-22 (resident `d` = the recipe), not a whole-DOM read; the critic's whole-viewport read is §6 |
| T9-R6 (a comment/e2e word is a Tailwind source) | lane dist clean (§0). **The lane's UNION dist is not**: see §5 |
| frames | none owed and none added; T9-B8/T9-B29 stand on pass 8's composite. The critic added no crop. |

## 4 · The charter's rows, scored by the critic

| row | the ask | the critic's read | status |
|---|---|---|---|
| R1 (gap 1) | judge every stop; plants on shipped stops | `cleanKey` deleted; every reached stop judged; PLANT_STOP = the toggle; the SIB plant reds `logo-trigger` alone (lane logs); crit1's [no-pref] walk reached 10 keys | **CLOSED** at the walk; but the read every stop goes through is `holdPoses`-pinned outside reduce (gap 3 below) |
| R2 (gap 2) | per-strip FC floor, FCSIDE + 1 px plant RED | per-strip floor landed and reds the PRODUCT; 3 of its 4 new plant asserts are vacuous (§2b) | **OPEN** (product red + vacuous plants) |
| R3 (gap 3) | X11/X12 + the :861 cure | X11/X12 through homes v2's `masked-const`; X13 UNRESOLVED reds; lane logs, not re-run by the critic | closed on the lane's read (not re-derived) |
| R4 (gap 4) | the 16×16 no-pref cap, mechanism, ≥ 10 runs exit 0 | mechanism = baked pose, read per held pose, re-derived to the station (21/24); webkit pose-3 B4 re-derived; file exit 1 both engines | **OPEN** (exit-0 ×10 unmet; pose-3 caps a lane-minted admission) |
| R5 (gap 5) | B1-only / B4-only plants, sabotage at final sha | SQUAT6/NOTCH confined; sabB1c/sabB4c exit 1 each with the one fail (lane logs, both engines); cap ±1 re-derived by the critic (§2e) | closed (the lane's runs; the critic ran the cap's threshold pair, not the clause pair) |
| R6 (gaps 8, 12) | whole file on the lane dist both engines; π re-run | lane7 whole file both engines (28/4); π = G-LIVE-22 only; critic's π §6 | **PARTIAL** |
| R7 (gaps 10, 11) | reversal per invocation; G-LIVE-17 asserted | ppid keying + stale plant (lane logs); G-LIVE-17's bound self-relative, green on control, CRIT-TAPE3X GREEN | 10 closed (lane's read); **11 OPEN** |
| R8 (gap 7) | floor slack / shipped set | `G23_SHIPPED` named, each missing key reds; re-derived 10/10 keys in crit1 | **CLOSED** |
| row 14 | §4's ring on the union | 4 reds read on a contaminated union CSS (§5); critic's clean re-read §5a | **OPEN** |

## 5 · §4 on the WAVE union: the lane's union dist is NOT the union's build

The critic built `74a2b5d9 + WAVE.diff (web/) + homes.on-WAVE.diff + pass9.delta.on-WAVE.diff` itself (apply exit 0; `src/` and `e2e/`
`diff -rq` 0 against the lane's own `wavelane` copy). With a `.git` boundary at the copy's root it serves
**`index-Ditx63kWWCr0.css` / `index-C8SKFKQiZrVj.js`**, not the lane's `index-BMkArYWrrLBL.css` / `index-CxYYFTpn59P6.js`.

- The lane's `wavelane` copy is a whole-repo `git archive` (docs/, scripts/, Cargo …) with no `.git`, so Tailwind's scanner ignored
  `.gitignore` and minted utilities from outside `src/`: the lane's union CSS carries **1,336 selectors the clean union build does not**
  (`.isolate`, `.z-10`, `.top-0`, `[color:red]`, `[vite:html]`, `[agentkeepalive:deprecated]`, sonner's toast arbitraries, the red palette,
  `--font-serif`, global `--tw-translate-*` / `--tw-scale-*` defaults on `*`), and lacks 2 (`.grow`, `.ring` as standalone rules).
- That is LAWS P8 §B's T9-R6 dist-identity law (diff the served CSS against a clean build AND list every utility with no `src/`
  consumer), failed on the union read — the same trap the critic hit and declared in §0 for the lane build. The lane's "rebuilt at the
  final spec it is `diff -rq` 0 against the served union dist" compared one contaminated build with another.
- Consequence: row 14's four reds (tier 2 cell 0, top side) were read on a page the union never serves. The critic's re-read on
  the clean union build is §5a.

### 5a · wave1 — §4 on the CLEAN union build (`index-Ditx63kWWCr0.css`), both engines (`logs/bat-wave1.log`; load-gated under 60)

The lane's union server was swapped out by the critic's own: the critic's lane server on :4238 was stopped by its recorded PID
(83701, child 83837) after a cwd check (`crit-MRK-LIVE/p9/web/frontend`); `inst/serve-wave.sh` then served the clean union on :4238.

- **Row 14 reproduces on the clean build, to the thousandth**: chromium light 9×9 cell 0 top 2.812 / COUNT 118 > 63; 16×16 cell 0 top
  2.812 u29 / COUNT 49 > 16. The contaminated CSS did not move this reading; the lane's row-14 verdict stands on the right page. The
  T9-R6 identity breach (§5) stands as a process gap, not as a moved number.

### 5b · wave1 in full (`logs/bat-wave1.log`, exit **1**; load 40.75 → 39.98, under 60 at open): 2 passed / 6 failed, 3.7 min

| row | chromium | webkit |
|---|---|---|
| G-LIVE-22 | ✓ | ✓ |
| G-LIVE-21 | ✘ card 0.491–1.084 (left 0.491) | ✘ card top 1.527 / bottom 1.207 / **left 2.276 / right 2.027** |
| G-LIVE-23 [reduce] | ✘ only tier 2 at cell 0 (9×9 top 2.812 / 2.436, COUNT 118; 16×16 top 2.812 / 2.436, COUNT 49 / 51) | ✘ the same seam (2.85 / 2.404; 118; 48 / 49) |
| G-LIVE-23 [no-preference] (**first read on the union**) | ✘ only tier 2 at cell 0, at EVERY held pose: 16×16 COUNT 48–55 light, 49–59 dark | ✘ the same: 48–51 light, 49–54 dark; **no B4 at webkit dark pose 3 on the union** |

- Every other stop is judged ok, the shipped set reads 10/10 in all four walks, and no plant is a hole (34 plant reads RED).
- WebKit's union card reads left 2.276 and right 2.027 px of "outline" depth, more than the authored 2 px: the strip read is counting
  focus-time change that is not the outline (the card re-renders on focus in WebKit; the lane names it for the box's inside and
  excludes the inside, but the strips outside the box still take the card's own drawn sketch). §2b's FC1PX-paints-142 % is the same
  mechanism. A depth floor that a non-outline change can meet is the critic's §5c plant.

### 5c · critfc — CRIT-FCMOVE on G-LIVE-21, on the clean union (`plants/fcmove.css`; `logs/bat-critfc.log`, exit **1**; load 35.46 → 38.76)

`@media (forced-colors: active) { .gallery-viewport:focus-visible .game-card.is-center { clip-path: inset(0) !important; translate: -4px -4px !important; } }`
— the outline clipped to NOTHING (FCCLIP2's own clip) while the focused card moves 4 px. Laid by a scratch hook just before the card read
(`inst/crit-fc.spec.ts`; the outline's computed style, width and Highlight ink are untouched, so the property clauses stay green).

| card strips with NO outline painted | top | bottom | left | right | total |
|---|---|---|---|---|---|
| chromium | **3.796** | 0.937 | **2.711** | 1.306 | 3,224 px (clean 1,184) |
| webkit | **3.838** | **5.332** | **2.785** | **4.932** | 6,219 px (clean 2,673) |

**WebKit's per-strip card floor is GREEN with no outline at all**: the run's webkit fails are the staging face and FCCLIP2 (which the
plant's own clip disturbs), NOT "every strip of the deck card's outline". Chromium clears 2 of 4 strips. The R2 cure counts any pixel that
changes with focus in the band outside the box as outline paint, so a card that moves, scales or re-renders on focus satisfies it. The
floor must read the outline's INK (Highlight-coloured pixels in the band, or ON-vs-OFF restricted to the system ink), with this plant born-RED.

## 6 · π against `74a2b5d9`, whole viewport, at rest (the critic's `inst/pi2.mjs`, `logs/pi2.log`)

1280×800, `reducedMotion: reduce`, focus blurred, one pinned 9×9 payload (G-LIVE-17's), lane (:4238) against control (:4253),
each side loaded twice for a noise floor; a pixel differs at > 8/255 on any channel. (The critic's first, unpinned read, `logs/pi.log`,
differs by 24–43k px per frame on the BOARD region only: `useSudoku` deals at random per load, so an unpinned π is noise.)

| engine · route · theme | control vs control | lane vs lane | lane vs control |
|---|---|---|---|
| chromium · `/?board=P` · light / dark | 0 / 0 | 0 / 0 | **0 / 0** |
| chromium · `/?size=3&board=P` · light / dark | 0 / 0 | 0 / 0 | **0 / 0** |
| webkit · `/?board=P` · light / dark | 0 / 0 | 0 / 0 | **0 / 0** |
| webkit · `/?size=3&board=P` · light / dark | 0 / 0 | 0 / 0 | **0 / 0** |

Load 65.61 → 40.64, exit rc 0. **At rest, unfocused, the lane moves no pixel against `74a2b5d9` in either engine or theme**: the declared
π is the ring itself (G-LIVE-22's resident `d`), and nothing else paints. Unread by this probe: 16×16, the deck/staging band, the
coarse/393-wide layouts, and every focused frame (where the ring's move is the subject, not π).


## 7 · The open gaps (the critic's; numbers first)

1. **G-LIVE-21 is a PRODUCT red in both engines** (re-derived: card strips 0.599–1.251, staging bottom 0.920–0.966, against 1.80). No `src/`
   byte moved; the cure (the ring's geometry vs §10's card frame) is unbuilt. Pass 8's "G-LIVE-21 10/10 exit 0" is withdrawn by a
   stricter read, honestly; the row is red.
2. **R2's cure is not an outline read** (§2b, §5b, §5c). 3 of its 4 new plant asserts are vacuous (FCSIDE-card, FC1PX-card, FC1PX-staging
   assert "≥ 3" / "> 0" strips red where the CLEAN read already reds 4 and 2; FC1PX paints 89 % / 142 % of the shipped card outline), and
   the depth statistic counts any focus-time change outside the box: **CRIT-FCMOVE (outline clipped to nothing, card moved 4 px) reads
   the webkit card 3.84 / 5.33 / 2.79 / 4.93, GREEN on all four strips, and chromium 2 of 4**; the union's webkit card reads 2.28 / 2.03
   (> the authored 2 px) with no plant. The floor must read the outline's Highlight ink, born-RED on CRIT-FCMOVE; plants on a red row
   assert a differential. No bound±ε on 1.80 (the lane's own gap).
3. **`holdPoses` is a masked fallback this pass added** (§2a, CRIT-ANC55): the ring's parent at 0.55 reds 2.06–2.13 under [reduce] and
   reads a full 4.188/4.379 ring under [no-preference] in BOTH engines (GREEN, a hole); [more]/[coarse] share the read. The hold must red,
   not pin, any `will-change: opacity` element that contains a ring or a stop or whose opacity is not 0/1, with this plant born-RED.
4. **G-LIVE-17's covering bound is self-relative and green on the control** (§2c, §2d): CRIT-TAPE3X (label ×3, 376 px, area ×2.3) is GREEN in
   both engines; the bound was widened 1 → 2 rows after a shipped red; COVER4 asserts only the one-line clause. Gap 11 stays open.
5. **G-LIVE-23 [no-preference] webkit** reds dark @pose3 B4 0.031 (re-derived to the thousandth; the control has it too) — the chair's /
   T9-B29's call; the lane admitted nothing. **G-LIVE-23 [coarse] chromium** dark toggle B4 0.024 at 2 of 7 (the lane's rate; not re-read
   by the critic; mechanism unread). The file is exit 1 in both engines; "≥ 10 runs exit 0 per engine" (R4) is unmet.
6. **The pose-3 COUNT caps (21 / 24 chromium) are an admission minted at the lane** on the frame-cell trade it refused to admit for B4;
   honest (pinned, STALE-guarded, better than the control's 34/33) but the chair's to ratify, not the lane's to type.
7. **Row 14 is RED on the clean union too** (§5a: top 2.812 / COUNT 118 reproduced to the thousandth) and, newly read by the critic,
   under [no-preference] at EVERY held pose (16×16 cell 0 top 2.812, COUNT 48–55 against 16). The lane's union dist was built from a
   contaminated scan (§5: 1,336 extra selectors; T9-R6's identity law failed) though it did not move this number. The cure is the chair's
   (a)/(b)/(c) pick; nothing is admitted.
8. **The union read is [reduce] only.** `posed()`'s `:nth-of-type` keying holds on the union by markup (the four bakes are the only `div`
   children of `div.grid-ink`, HandDrawnGrid.vue:509–516), but no per-pose read has run there.
9. **π**: G-LIVE-22's recipe identity is not a whole-DOM π; the critic's whole-viewport read is §6.
10. Carried and unmoved: THIN_1PX tier 2 one-side red; the ONE library's absent-edge throw (PROPOSED); the control ran once per engine;
    A.3 +2 bare `--color-peer-cursor-ink`; crayon-heart census; D0 PROPOSED; sized 31/228; FLOOR BAND; INTAKE-22 row 44 / INTAKE-23 row 37 unread.
11. **The replay route does not reproduce the dist as written** (§0: a `git archive` with no `.git` builds `index-CcbAosw0T4v3.css`).


## 8 · The number: **84** (pass 8's critic: 87). Verdict: **ADVANCE**

- **Earned** (re-derived by the critic, not taken): R1 every stop judged on shipped stops, with the in-run sibling; R8 the shipped set by
  name (10/10 in every walk, lane and union); R4's mechanism read to the station (21/24 at chromium pose 3; webkit's pose-3 B4 0.031) with
  per-pose caps that pass the threshold battery both ways (§2e); G-LIVE-23 [reduce] green on the lane in both engines with every plant
  RED; π at rest 0 px in both engines and themes (§6); the bank, homes v2, the on-WAVE delta and the lane dist all reproduced to the byte.
- **Refused**: the pass ADDED a masked fallback in every regime outside reduce (`holdPoses`, CRIT-ANC55 GREEN, both engines); R2's per-strip
  cure accepts a card with NO outline as a full ring in WebKit (CRIT-FCMOVE) and 3 of its 4 plants are vacuous; G-LIVE-17's covering is
  self-relative and green on the control (CRIT-TAPE3X GREEN); no product byte moved, so G-LIVE-21 is red in both engines and the file is
  exit 1 in both; §4 on the union is red at cell 0 in [reduce] AND [no-preference] (newly read), and the lane read it on a contaminated build.
- Three below pass 8: two of the pass's new gates (the hold and the strip floor) are themselves holed by single-line plants, and the
  gaps the pass closed (R1, R8, R5, R4's mechanism) are gate rows, not product rows. Not BANK: every open row has a named cure (two
  `holdPoses` clauses; an ink-keyed strip floor; a differential plant form; a non-self-relative covering bound or the T9-R7 law) or a
  named chair/owner pick (B4 at the frame cell, the union seam (a)/(b)/(c), the G-LIVE-21 geometry with §10), and §4 still leads its
  section. Earliest 100 for §4: pass 11 (pass 10 owes the product geometry for G-LIVE-21 plus three gate re-cuts, then two clean passes).

## 9 · Incidents (the critic's own)

1. The critic's first two builds served a contaminated CSS (`index-CcbAosw0T4v3.css`); both moved to `trash/`, the third (with a `.git`
   boundary) is the dist every lane battery read. No battery ran on the contaminated builds.
2. The scratch spec copy (`crit-ring.spec.ts`) gained its G-LIVE-17 hook while crit1 was running; the hook is env-gated (`CRIT_TAPE`, unset
   in crit1) and touches no G-LIVE-23 line, so crit1's verdicts are unaffected. Declared.
3. `inst/pi.mjs` failed once on a bad `sharp` import path (moved to `trash/`); its rerun was UNPINNED (random deals) and is cited only as
   the reason for the pinned `pi2.mjs`.
4. Foreground `sleep 60` was refused by the harness once; every later wait was a background waiter or a Monitor.
5. Servers: lane (:4238, PID 83701/83837), union (:4238, 44651/44701), control (:4253, 83806/83876), each the critic's own, each stopped by
   recorded PID after a cwd check; both ports empty at close (curl 000). No git on main or in the control tree; nothing committed;
   no `rm` (discards in `trash/`); all scratch under `.claude/t9-scratch/work/pass9/crit-MRK-LIVE/`.
6. Not re-run by the critic: the clause-sabotage pair (sabB1c/sabB4c), the [more]/[coarse] regimes, G-LIVE-4/14/15/16/19/20, the control's
   whole file, the unit suites, filter-census. Those rows stand on the lane's logs only.
