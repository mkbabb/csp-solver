# Pass 5 · MRK-LIVE · adversarial critique

Critic: non-author, pass 5. Two sittings of the same role.
- **Sitting 1** (2026-09-22 20:01): its run died before it returned. Its evidence is on disk: the
  un-prefixed files in `critique/MRK-LIVE/logs/` and `instruments/`.
- **Sitting 2** (2026-09-23): this one. It audited sitting 1's disk, re-ran the load-bearing rows
  itself, and added four findings (gaps 3, 4, 8 and 9). Its logs are the `rerun2-*` files.

The pass-5 number below is sitting 2's.

**Subject.** The work tree `wf_f72f3b5a-83a-35` (detached at `74a2b5d9`, uncommitted). Before and after
every break it equals `pass5/prototype/MRK-LIVE/pass5.diff` byte for byte. I checked this by applying
the bank to a clean `git archive` of `74a2b5d9` and running `cmp` on all 22 files: `TREE-EQUALS-BANK
bad=0`, both times.

**Controls.**
- Sitting 2: the shared `w7-control` dist on :4239, identity `index-CubiZsMVSwTc.js`.
- My own build of the lane on :4237. It reproduces build 2 byte for byte (`index-ts0njdC-qv3v.js` /
  `index-Bb9MlCSFpOdg.css`). It was built into the scratchpad with a private cacheDir.
- The lane's dev server on :4238.
- Sitting 1 also served a dev-mode control of `74a2b5d9` on :4236.

**Convergence 85 (from 84). Verdict ADVANCE.**

What reproduces:
- The mechanism, both engines.
- π at 728 nodes, 0 deltas.
- The re-cut stranded control, the departure gate, and the forced-colours cure. Every one has a real
  negative control.

What holds it at 85:
- The design's safety gate still cannot see paint. Delete the ring's only ink and the whole spec file
  stays 16/16 green.
- The lane's own fallback strike turns the wave's undefined-token census RED. The lane never ran that
  census.
- The ring ballot is framed on the station minimum, where the chair named the core median.
- G-LIVE-19 pins a `--motion-note` registration that MOT-LADDER's block contradicts at the fold.

## 0 · Open gaps (each closable, numbers attached)

1. **G-LIVE-16 cannot see paint (A RECT IS NOT PAINT).** Its `drawn` clause is a rect-contains-centre
   test. Its `boardInk` clause reads a declared stroke.
   - **X1 (sitting 2, re-run).** Delete `--ring-ink: var(--color-focus-sketch)` (index.css:235). The
     ring path then computes `stroke: none`. Ring-ON vs `.focus-ring{visibility:hidden}` changes
     **0 px in chromium**. In webkit it changes 326 px, which equals the no-change noise arm's 326.
     As-is, the same probe reads **3,560 / 4,038 px**. The WHOLE `focus-ring.spec.ts` stays **16
     passed, EXIT 0** (`rerun2-X1-spec.log`).
   - **X2 (sitting 2, re-run).** Set `.cell-ghost.is-active { opacity: 0 }`. The tier-2 wrapper
     computes opacity 0, while the path still reads `rgb(58,123,196)` at 0.95, so `boardInk` stays
     true. G-LIVE-16 stays **green in both engines**.
     - Sitting 2's paint probe clips the cell at +6 px. Focus vs blur falls from 4,186 / 4,144 px
       as-is to 772 / 1,199 px (webkit noise is 286). The residual is not the ring.
     - Sitting 1 read 3,462 / 2,874 → 0 / 0 on a tighter clip.
   - **Close:**
     - A drawn stop counts only if the ring path's computed stroke is not `none` AND ring-ON minus
       ring-hidden paints more than the noise arm.
     - A board stop counts only if the ancestor opacity chain is non-zero, or focus-vs-blur paints.
     - X1 and X2 are the negative controls, run in the same batch.
2. **G-LIVE-19's masked-default clause reads only the CSSOM of the route it loads.**
   - **X3 (sitting 2, re-run).** Plant `var(--motion-note, 280ms)` in the lazy `AnswerKeyLaminate.vue`
     (`defineAsyncComponent`, GameShell.vue:42). G-LIVE-19 stays **green in both engines**.
   - The same plant in the eager `gameCell.css` reds both engines, naming `--motion-note in
     .x3-plant[data-v-6ba7cccc]`. So the clause works on-route and is blind off it.
   - **Close:** run the comment-stripped source walk the file already has for `@property`, this time
     for `var(--<registered>,` over every `.css` and every `.vue` `<style>`. X3 is the negative
     control.
   - Source today holds **0** such sites behind the three registrations, so the cure moves no pixel.
3. **NEW: the undefined-token census is RED on the lane, and the lane never ran it.** Every rung
   consumer owes the copy (LAWS §Gates; registry §2.11). I ran MOT-VERB's
   `undefined-token-census.copy.mjs` with `FE=<tree>`:

   | tree | bare var() naming no declaration, other slots | exit |
   |---|---|---|
   | lane | **2**: `gameCell.css:300` and `:302` `--color-peer-cursor-ink` | 1 |
   | control `74a2b5d9` | **0** | 1 (the copy's STALE `--refuse-dur` row, identical on both) |

   Charter row 4's strike turned a HOOK (`var(--color-peer-cursor-ink, var(--color-user-ink))`) into
   a bare consumer. The token's only declaration is BoardHost.vue:78's inline style object, in
   another file's scope. The census rules that undeclared unless an INHERITED row ledgers it.
   - The census does see X1: it names `FocusRing.vue:301 --ring-ink`. So it is the one estate
     instrument that reds the unpainted ring, and it is already red on this tree.
   - **Close:** land the INHERITED row `--color-peer-cursor-ink :: games/shared/BoardHost.vue ->
     games/shared/gameCell.css`, or have the census read the inline publisher. Re-run: 0 rows. X1 then
     reds it alone.
4. **NEW: G-LIVE-19 pins a `--motion-note` registration the §13 tree contradicts.**
   - The lane registers `--motion-note` as a STAND-IN (index.css:497, `initial-value: 250ms`,
     `inherits: true`). G-LIVE-19 asserts that one home is `assets/index.css` and that the initial is
     `250ms`.
   - The §13 tree `-59` (LADDER + VERB) registers the same name with `initial-value: 0ms` in its one
     block. The lane's own comment calls exactly that shape "the masked default this wave strikes".
   - At the fold, either the name is registered twice (G-LIVE-19 and LADDER's B3 red) or one family's
     value loses.
   - **Close:** the chair rules the rung's initial once (250ms or 0ms plus a publisher), and G-LIVE-19
     reads only the painted `0.25s`, not the registration's initial. Book it as a §6↔§13 coupling.
5. **The ring-token ballot is stated on the station MINIMUM.** LAWS P4 and registry §2.4 require the
   core DISTRIBUTION, with the core MEDIAN as the named statistic. The lane's own
   `P5-paint-rows.log` has every column. The return and README quote only the worst station.

   | arm (16×16 FRAME) | light median · worst · fraction < 3 | dark median · worst · fraction < 3 |
   |---|---|---|
   | alias @0.95 | 3.972 / 3.965 · 2.812 / 2.850 · 10 % | 3.989 / 3.997 · 2.436 / 2.404 · 10 % |
   | alias @1.0 | 4.289 · 2.98 · 10 % | 4.286 · 2.528 · 10 % |
   | `#4589d2` @1.0 | 3.581 · 2.918 / 2.891 · 5 % / 6.7 % | (light only) |
   | `#2f68aa` @1.0 | (dark only) | 3.28 · 3.28 · 0 % |

   - At the median every arm clears, and the alias has the most headroom. At the minimum no light arm
     clears.
   - "The alias fails the frame at any opacity" is true only of the minimum.
   - The README's "ABS's 3.569 is a left-side reading" is wrong: 3.569 is the lane's own chromium
     **p30** for that row.
   - **Close:** restate ballot row (a) with both statistics side by side, and strike the ABS sentence.
6. **The WebKit `isTheRing` refusals were run noise** (sitting 1's re-run; not re-run in sitting 2).
   On sitting 1's re-run:
   - `#4589d2` @1.0 FRAME reads TRUE (Δ 0, n 60, worst 2.891, median 3.581).
   - Dark alias @1.0 paper reads TRUE (4.286).
   - A `reducedMotion: reduce` arm reads identically, so the frame dip is geometry: the same 6/60
     stations.

   **Close:** replace the return's "isTheRing refused the webkit row".
7. **G-LIVE-4's reversal is still `if (afterReversal.ring)`.** This is the third pass with a silent
   skip, and it is the lane's own gap 5. **Close:** assert strictly, with a reversal-only negative
   control.
8. **NEW: masked defaults inside the lane's own gate code.**
   - `spoken-gallery.spec.ts` (lane-added lines, `pass5.diff`:27 and :48) reads
     `parseFloat(getPropertyValue('--focus-ring-outset')) || 3`.
   - If the registration went missing, the gate would substitute the house default the product no
     longer has.
   - **Close:** strike both `|| 3`. The registration guarantees a px value.
9. **NEW: the §2.11 control column is stale.** The return quotes "the earlier 12-row file on control:
   10 red / 2 green".
   - The FINAL 16-row file on the control DIST reads **12 failed / 4 passed, EXIT 1**
     (`rerun2-R2-spec-control-dist.log`). The reds are G-LIVE-4/14/15/16/19/20, both engines. The
     greens are G-LIVE-17 and G-LIVE-21, both engines.
   - Sitting 1 read the same 12/4 on the dev-mode control.
   - G-LIVE-17 GREEN on the control DIST contradicts LAWS P4's "a dist never forms a room" for this
     row, so the chair should look at what that row actually forms on a dist.
   - G-LIVE-17 is a non-regression guard, not a born-RED:
     - Its `air ≥ 0` clause has no negative control.
     - Line 755 waits a fixed 900 ms for the sliding dock. That goes against the file's own "no clock"
       header and LAWS ("poll the settled pose"). `lint:sleep` passes it.
   - **Close:** re-bank the control column. Poll the sheet's settled transform. Plant an overlap for
     `air`.
10. **`.guard-btn` is still unread under forced colours.** `P5-forced.log` walks 7 stops, and the
    guard is not one of them. **Close:** add the armed guard to G-LIVE-21's walk.
11. **Crops 1/2 carry a second uncontrolled variable.** I looked at both: the sun's rotation phase
    and position differ (sitting 1's ink bounding box is 191×196 vs 173×174 px at equal ink). The
    caption declares only the sparkle phase.
    - Crop 4 does not let an eye tell the forced-colours outline from the card's own drawn frame. The
      claim rests on the 3,044 px differencing, and the caption should say so.
    - **Close:** caption both.
12. **The "over its own fill" row (3.619 / 3.691) is the `vsIn` MEDIAN**, from the sampler the lane
    itself flags as unreliable (every `vsIn` worst reads 1.0). **Close:** re-run with the guard.
13. **Inherited and declared, not the lane's:**
    - The dark filter census: 4 failed / 8 passed on the lane and on the control, the same
      `svg.crayon-heart.idle ⟨saturate(0.85)⟩` (sitting 1).
    - Law 39's tab.
    - R1: the chair's probe reads RED on the lane and the control, identically.
    - Ring arms (b)/(c), which are ABS's.
    - T9-R5's covering.
    - 60/120 Hz, stated as unmeasurable.

## 1 · What was re-run (both engines unless stated)

| # | measurement | lane's claim | reading | sitting |
|---|---|---|---|---|
| R1 | `focus-ring.spec.ts` whole, lane dev :4238 | 16/16 EXIT 0 | **16 passed EXIT 0** (26.5 s) | 2 (and 1) |
| R2 | the same file on the control DIST `74a2b5d9` :4239 | earlier 12-row file 10 red / 2 green | **12 failed / 4 passed EXIT 1** | 2 (1: the same on dev control) |
| R3 | π, lane dist (my build, same identity) vs control dist, real payload `?size=3&board=ATMu…MDA4`, every element | 74 nodes, 0 / 0 | **728 nodes × 16 props, 0 deltas / 0 px, control vs control 0 / 0, same board**, both engines | 2 (and 1) |
| R4 | G-LIVE-21 with GameCard.vue's forced-colours rule deleted | RED both engines pre-cure | **RED both engines** (`outline-style` "none"). sha1 restore `7792ecf8` verified | 2 |
| R5 | B4 (departure cure deleted) → G-LIVE-20 | RED webkit, green chromium | reproduced: webkit "t+120: focus is on body, so no ring" | 1 |
| R6 | pre-return battery, bare | all 0 | `lint` 0 · `lint:copy` 0 (0 dashes, 0 unadmitted) · `lint:theme-tokens` 0 · `lint:lanes` 0 · `lint:sleep` 0 · `lint:motion` 0 · `test:e2e:projects` 0 (35 specs / 563) · `check-pw-projects` 0 · `eslint .` 0 · `prettier --check src/` 0. Control: all 0 (lane's `prereturn-control-74a2b5d9.log`; 34 specs / 547) | 2 |
| R7 | undefined-token census copy | not run | **lane EXIT 1, 2 new rows; control 0 rows** (gap 3) | 2 |
| R8 | the chair's r0 law probe with `FE` pointed at the tree | — | lane EXIT 0, L1–L6 GREEN. R1/R2/R3 born-RED and identical to the control | 2 |
| R9 | filter census LIGHT on the lane dist | = 9 | 12 passed, budget 9 holds. The source diff adds no `<filter>` | 1 (source 2) |
| R10 | filter census DARK | 4 / 8 on both | 4 / 8 on both, the same unclaimed row | 1 |
| R11 | P5-PAINT 16×16, 40 rows plus a PRM arm | see gap 5 | every chromium row to the digit; gap 6 | 1 |
| R12 | break tests X1 / X2 / X3 | — | all GREEN = gates that cannot fail. Every restore sha1-verified: `9f0c825f` index.css, `d96a86f6` gameCell.css, `e54be0c0` AnswerKeyLaminate.vue | 2 (and 1) |

## 2 · The charter's rows, judged

| row | status | note |
|---|---|---|
| 1 G-LIVE-16 re-cut | closed as chartered; still paint-blind | the flush per stop, `outlineStyle` and the in-run stranded control are all real (B6 reds; the control reds on HEAD). But gap 1 |
| 2 `--toggle-bleed` sentinel | closed | 9999px is outside the publisher's domain (App.vue:967, < 0 at all three rungs). B1 reds. The FocusRing guard stops WebKit's 300×150 stray |
| 3 G-LIVE-19 | closed in part | source census per name and depth, the `--motion-note` paint read. Masked-default clause route-bound (gap 2); fold collision (gap 4) |
| 4 peer-cursor fallback | closed on the predicate; opens gap 3 | BoardHost.vue:78/:315 bind the class and the publisher on one key. The strike needs its INHERITED row |
| 5 departure estate row | closed | B4 webkit-only (chromium has no defect); the bound is stated |
| 6 phone table | closed | settles on `button.mobile-heading-btn` |
| 7 crop pair, theme held | closed, with a caption gap | gap 11 |
| 8 sensitivity row | closed | present on every painted row (`sens` column) |
| 9 rank as an order | closed | a declared-rank row on real cells; B5 reds it |
| 10 250 ms clause | closed by landing | B8. Gap 4 is its fold price |
| 11 grafts | 2 of 3, plus a witnessed decline | RING_GEOMETRY: f=1.00 goes 5.4 u past the square (the lane's reading; not re-derived) |
| 12 G-LIVE-17 | closed as a guard | green on control dev AND dist (gap 9) |
| 13 dist, census, laminate, Hz, guard | closed except the guard | gap 10 |
| 14 inbound `gameCell.css` | closed | GRAPHITE's hunks ruled out with a reason |
| 15 real payloads | closed | π, crops and paint state their payloads |
| leader: the rank | closed on the alias arm | 1.0 ties invalid's 1; arm (c) needs a new invalid rung |
| leader: forced colours | the deck closed (R4 reproduced) | the guard unread |

## 3 · Checklist

- **Gates that cannot fail:**
  - G-LIVE-16's `drawn` and `boardInk` (X1, X2).
  - G-LIVE-19's masked-default clause off-route (X3).
  - G-LIVE-4's reversal `if`.
- **The constraint it forgot:**
  - The undefined-token census (gap 3).
  - The named statistic on the ballot (gap 5).
- **Masked fallbacks:**
  - Two `|| 3` in the lane's gate code (gap 8).
  - None in product source: 0 `var(--registered,` sites.
- **Vacuous convergence:** the spec file stays green with the ring's only ink deleted (gap 1).
- **Legacy alias:** none. `--ring-ink` → `--color-focus-sketch` is the ballot's seam: one name for the
  chrome, so the two-value arm changes one value. It is not a kept old name.
- **π:** clean at 728 nodes, both engines, with its noise arm.
- **filterBudget 9:** holds.
- **M16:** 0.
- **AA from painted bytes:** reproduced, but quoted on the wrong statistic (gap 5).
- **@property:** three blocks at file scope, one each, consumed bare. The `--toggle-bleed` initial is a
  real sentinel. `--motion-note`'s stand-in collides at the fold (gap 4).
- **Unverified gestalt:** the frames match their claims except gap 11's captions.
- **Generic default:** none.
- **Circularity:** none. Every gate reads the live page or the source.

## 4 · Cross-pollination

- **CTRL-FACE, CTRL-RULE, PLR-SELF** (every lane that copies `--ring-ink`): an existence row for a drawn
  ring must read PAINT. As-is ring-ON minus hidden is 3,560 / 4,038 px, and 0 px with the ink gone.
  A rect row cannot tell the two apart.
- **MOT-VERB:** the undefined-token census reds a hook-to-bare strike across files. Every lane that
  strikes a fallback on an inline-published token (peer-cursor, per-player inks) needs the INHERITED
  row in the same diff.
- **MOT-LADDER and the chair:** `--motion-note`'s initial is claimed by two families at two values
  (250ms stand-in vs 0ms). Rule it once, before the fold.
- **MRK-ABS and the chair:** the three-arm ring ballot is one distribution quoted at three statistics.
  The owner sees the median and the worst side by side.
- **MOT-LADDER, MOT-VERB, PAL-WALK:** a masked-default census scans SOURCE, not one route's CSSOM. The
  lazy chunks are invisible to a live read.
- **The chair (LAWS P4):** G-LIVE-17 is green on the control DIST, so re-check "`?wire=local` is
  DEV-only" for this route.

## 5 · Evidence, replay, incidents

`pass5/critique/MRK-LIVE/`:
- `logs/`: sitting 1's are un-prefixed; sitting 2's are `rerun2-*`. Sitting 2 overwrote sitting 1's
  `battery-lane.txt` before renaming it `rerun2-battery-lane.txt`. Sitting 1's figures for it are
  quoted in its draft and match (all 0).
- `instruments/`: sitting 1's copies, plus `rerun2/crit2-paint.probe.ts` (ring-ON vs hidden, focus vs
  blur, a no-change noise arm, and in-page PNG differencing).

Replay (sitting 2):
1. Serve the lane dev on :4238 with a private-cache two-line config.
2. Build the lane into the scratchpad and serve the preview on :4237 (verify `index-ts0njdC-qv3v.js`).
3. Serve the control dist on :4239 (verify `index-CubiZsMVSwTc.js`).
4. Run the spec config against :4238 and :4239.
5. Run each break (python exact-string replace, sha1 restore).
6. Run `FE=<tree> node undefined-token-census.copy.mjs` on the lane and the control.
7. Run π with `node pi-crit-allnodes.mjs :4237 :4239`.
8. Run the r0 law probe with FE re-pointed.

Incidents (sitting 2):
- One `sleep 45; tail` was blocked by the harness and replaced with an until-loop. Nothing ran.
- My first X1 census row printed `EXIT 0`. That was `tail`'s exit code, the known trap. The re-run
  unpiped reads EXIT 1.
- My build ran while `.mrklive-crit2/` (scratch `.ts`) sat in the tree. The identity still reproduced
  build 2 byte for byte, so Tailwind minted nothing from it.
- All six server PIDs were killed by record: 9473/9529 lane dev, 15881/15909 control, 18311/18345 lane
  preview. `.mrklive-crit2/` was deleted.
- The tree was re-verified equal to the bank (22/22 `cmp`). Its `git status` shows 19 M plus 3 ??,
  product files only.
- No commit, push, stash, install or deploy.
