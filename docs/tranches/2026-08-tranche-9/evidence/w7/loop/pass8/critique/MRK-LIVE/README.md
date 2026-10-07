# Pass 8 · MRK-LIVE · adversarial critique

**Convergence 87 (pass 7: 86) · Verdict ADVANCE**

The bank is what it says it is, and its numbers reproduce:
- The work tree still writes tree `8f19557d` (a temporary index copied from its own, before and after this critique).
- `pass8.diff` is 502,279 B, sha1 `3ca99e70`, 30 files +9,780/−179. `git apply --check` exits 0 on a fresh `git archive 74a2b5d9`.
- The delta applies on `74a2b5d9 + pass7.diff + homes.diff` (check 0).
- The five `e2e/lib` homes, `scripts/shape-census.mjs` and `knip.json` are byte-equal to `homes.diff`. No instrument is forked.
- My build of an archive+diff copy gives the lane's dist to the byte: `index-BkcV-IZ5Z7we.js` / `index-BmkNOUhcvBnA.css`, `diff -rq` 0 against the prototype's `dist-final`. It carries 0 `outline-ring`, 0 `--color-ring` and 0 `tuner-toggle`. Its three extra `@property` rules against the control (`--focus-ring-outset`, `--toggle-bleed`, `--motion-note`) are declared in `src/assets/index.css`, so the dist is not contaminated.

The three gates pass 7 named are each cured for their named plants: NOPREF2/COARSE2/MORE2, X7/X8/X9 and FCCLIP2 all red. The 9×9 frame cell now has a row, and T9-B8 has its frame.

The pass is not converged, because **each re-cut gate falls to a sibling of its own plant a third time**:
- **The regime reads judge one stop.** G-LIVE-23 [more] and [coarse] judge only the FIRST chrome stop that reads clean, and a red stop before it is silently skipped. On the lane's dev server that stop is the dev-only `tuner-toggle`, which never ships.
- **G-LIVE-21 is an existence count.** It passes a card with three of its four outline sides clipped.
- **G-LIVE-19 misses a constant.** It misses a masked default whose name is carried by a const.

The shipped default also reds its own gate: G-LIVE-23 [no-preference] went red on the unplanted product in 1 of my 5 chromium reads, in both themes, on the 16×16 frame cell's COUNT cap.

## 0 · Open gaps (exact, each closable)

1. **G-LIVE-23 [prefers-contrast: more] and [pointer: coarse] judge ONE chrome stop, the first that reads clean** (`cleanKey`, spec :1890).
   - A stop that reds under the regime before the first clean one is skipped, never judged. The walk's verdict is read only under `reduce` and `no-preference` (LAWS P7 §E(i): "ALSO reads the verdict").
   - On the lane's dev server, the one stop judged in both regimes is `button.tuner-toggle`. App.vue:805 gates it on `import.meta.env.DEV`, so it is absent from every production build.
   - On the dist, `cleanKey` falls to `button.attribution-trigger`. Every stop-level regime number in the prototype's §1a table ("clean stop 4.188 ×4") is the dev tool's, and every in-run chrome plant (X4, FADE15, X6, CLIP0, THIN_1PX, DASH_1IN8 and the three regime plants) is laid on it.
   - **Critic plant MORE2S/COARSE2S**, file plant on a scratch copy (`instruments/cplants.py`). In `index.css`: `@media (prefers-contrast: more) { html:has(button.logo-trigger:focus-visible) .focus-ring { opacity: 0.15 !important } }`, and the same rule under `(pointer: coarse)`.
     - Proven live on the ONE probe, both engines (`logs/more2s-probe.log`): logo-trigger ring opacity 0.15, **RED at 1.199 cr / 1.196 wk** on all four sides under `more` and under `coarse`.
     - Negatives in the same run: `sun-moon-toggle` 4.188 GREEN in both regimes; logo-trigger with no regime 4.188 GREEN.
     - Result: **the whole spec, both engines, reads 31 passed / 1 failed.** G-LIVE-23 [more] ×2, G-LIVE-23 [coarse] ×2, G-LIVE-16 [more] ×2 and G-LIVE-16 [coarse] ×2 are all GREEN with the plant live. The one red is gap 4, not the plant (`logs/run2-plants.log`).
   - Close: under `more` and `coarse`, judge every stop the walk reaches (the row already has `walkWhole`). Or judge a fixed set of SHIPPED stops, and red any stop that reads red rather than skipping it. Lay the chrome plants on a stop that exists on the dist.
2. **G-LIVE-21 counts painted pixels against a floor of 30 px, an existence read.** Its clean card paints 1,127–1,386 px.
   - **Critic plant FCSIDE** (the X6 sibling of FCCLIP2): `@media (forced-colors: active) { .game-card, .staging-btn { clip-path: inset(-12px 0 0 0) !important } }`, which keeps only the top outline band.
     - Planted: card **217 px cr / 153 px wk**, staging **97 / 83 px**. G-LIVE-21 **GREEN ×2 both engines**.
     - Same-mode negative (dev, unplanted, ×2): card 1,144 / 1,329 cr and 1,127 / 1,178 wk, staging 358 cr / 331 wk. That is −81 % to −88 % of the indicator, green.
   - Close: read the four outline strips separately and floor EACH one, or floor each strip at a fraction of its clean count (the four-band law's B1/X6 clause, applied to the forced-colours host).
3. **G-LIVE-19 misses a masked default whose NAME is const-carried.** The ONE library's `maskedDefaults` returns `[]` for:
   - X11 `'var(' + N + ', 280ms)'`
   - X12 `` `var(${N}, 280ms)` ``

   Both use `const N = '--motion-note'` (`logs/g19-library-probe.txt`). The file plant X12 in `AnswerKeyLaminate.vue` leaves G-LIVE-19 **GREEN in both engines** (run2).
   - The SHAPE law's read set names "const-carried values resolved or red", and the library already exports `constBindings` and `foldConcat` but does not use them here. The extension is the ONE copy's (§I), and LIVE owes it as a PROPOSED diff with its plant.
   - Also: the spec's comment says an unresolved stem "is printed, never dropped", but `maskedAt` filters `!m.unresolved` and prints nothing (spec :861). The comment and the code disagree.
4. **The shipped default reds its own gate: G-LIVE-23 [no-preference] 16×16 frame-cell COUNT cap.** This reproduces the prototype's gap 12, and it is worse than the one flake it records.
   - My chromium run on the unplanted-for-this-row copy (run2; the critic plants are all out of force under no-preference, fine pointer, no forced colours) read **left 3.148 / COUNT 21 > 16 light and left 3.183 / COUNT 24 > 16 dark**, in one test.
   - Across my runs: 1 red in 5 chromium no-preference reads (run1 dist ×1 green, run2 dev ×1 red, run3 dev ×2 green) and 0 in 4 webkit reads. Adding the prototype's 1 in 12, that is 2 red of 17.
   - The whole spec file is therefore NOT reliably exit 0 on the product it ships. The cap of 16 was stamped under `reduce`, and the `docSettled` bake predicate did not cure the no-preference excursions.
   - Close: read the maximum over the grid's baked poses, as the lane proposed, or stamp the cap from no-preference reads (≥ 20 per engine), with a WORSE plant.
5. **Clause sabotage: B1 and B4 have no isolating plant.** B1 off → exit 0; B4 off → exit 0 (the prototype's gap 4, confirmed in its log).
   - The B2/B3 sabotage runs (`logs/clause-sabotage.txt`) ran at spec line 1964, and the final sha places the row at 1976. So they ran at a pre-final spec, contrary to the record's "every reading here is from runs that started after the last edit".
   - Only B4/B4b ran at the final line.
6. **Tier 2's thickness clause reds on one side only:** THIN_1PX left 1.74–1.78 against the 1.80 floor, and the other bands read 3.4–3.5 css px under a 1 px stroke (the prototype's gap 5). The depth read counts the 0.08 fill. The edge-bands extension is proposed and not built.
7. **The chrome floor of ten stop keys has zero slack on the product.** The dist walk reaches **exactly 10** keys, both engines, both themes, reduce and no-preference (run1). The dev walk's 11 includes the dev-only tuner. Losing one shipped stop, or a deck/guard host, reds the floor. It holds, with no margin.
8. **Rendering mode.** The prototype's whole-file comparison is lane DEV (:4238) against control DIST (:4251). LAWS §B requires "both arms in one rendering mode".
   - I closed it for G-LIVE-23 ×4 regimes and G-LIVE-21 on the lane DIST: **10 passed, EXIT 0**, both engines.
   - G-LIVE-4/14/15/16/17/19/20/22 have not been run on the lane dist by anyone.
9. **`test:e2e:projects` is RED** (exit 1; floor band chromium 253 vs 214, webkit 251 vs 212), where the control exits 0. It is declared, and the restamp is WGATE's. I re-ran it: exit 1.
10. **INTAKE-22 §7 row 44 is OPEN** on lane and control. The rest reads are 2.510 cr light, 2.872 wk light and 4.368 wk dark. Chromium dark reads 4.697 with exit 3, because HEAD12/TAIL12 stay GREEN on the one-glyph 'i': the glyph-pop hole is the chair's instrument row. The cure is §10's or T9-R8's.
    - **INTAKE-23 §4 row 37** is the fold's, as stated.
11. **G-LIVE-4's reversal clause is checked across engines through a file window of 20 minutes.** It is unchecked when an engine runs alone, and a STALE sibling record from an earlier invocation inside the window satisfies it (spec :238–253). That is a masked fallback. It is the prototype's gap 9, narrowed but not closed.
12. **G-LIVE-17's covering is printed, not asserted** (T9-R7, the chair's). **G-LIVE-16 reds under the regime and X4b plants through its X2 self-check** (`!important` interaction), not for faintness (pass-7 gap 5, unchanged).
13. **π was not re-run** (the ring's `d`, whole-DOM, against `74a2b5d9`). The product delta over pass 7 is comment text plus `--color-ring` ×2.
    - I checked: `--color-ring` has 0 consumers in the tree's `src`, `index.html` and `public`. The control's three consumers (the `*` outline sweep, `.sun-moon-toggle:focus-visible`, `.sudoku-cell:focus-within`) were removed by pass 7's delta.
    - The deletion moves no pixel. The dist CSS diff and G-LIVE-22's resident `d` (256/81/16) stand in for π. Pass 7's π reading carries, and nothing re-read it this pass.
14. **Carried:** +2 bare `--color-peer-cursor-ink` (A.3 admitted); the dark filter census 4 failed on both dists (crayon-heart, the ratified pick); the graphite arm's CSS kept with its writer named (App.vue writes `data-ring-arm` from `RING_ARM`; it matches nothing while the const reads "blue"); D0 PROPOSED (the deck owners'); `sized` RED on the four-band probe at 9×9 (31/228, B4 holes), which pass 7's whole-ring census read as 0/240.

## 1 · What I re-derived (both engines)

| reading | prototype | critic | where |
|---|---|---|---|
| 9×9 cell 0 left, lane dist, reduce | 2.812 / 2.404 cr · 2.85 / 2.404 wk · 63 | **2.812 / 2.404 cr · 2.85 / 2.404 wk · u51 left + 6 + 6 = 63** | run1 (lane dist :4238) |
| 16×16 cell 0 left, lane dist, reduce | 3.609 / 3.697 cr · 3.706 / 3.825 wk · 16 | **3.609 / 3.697 cr · 3.706 / 3.825 wk · 16** | run1 |
| deck card right/bottom, lane dist, reduce | cr L 2.327/1.729 · D 2.964/2.261; wk L 1.709 · D 2.226 | **cr L 2.327/1.729 · D 2.964/2.261; wk L 2.322/1.709 · D 2.964/2.226** | run1 |
| 9×9 / 16×16 cell 0, CONTROL `index-CubiZsMVSwTc.js` :4251 | 2.698/2.312 cr · 2.693/2.316 wk · 63; 16×16 20 cr light (B4) / 16 wk | **2.698 / 2.312 cr · 2.693 / 2.316 wk · 63; 16×16 cr light 20 (B4 bottom 0.031), cr dark 20, wk 16 / 16** | `logs/cell0-control.log` |
| G-LIVE-21 painted px, card / staging | 1,377 / 358 cr · 1,499 / 331 wk (range 1,082–1,536) | **dist 1,167 / 358 cr · 1,386 / 331 wk; dev ×2 1,144–1,329 / 358 cr · 1,127–1,178 / 331 wk; FCCLIP2 0 / 0** | run1, run3 |
| G-LIVE-23 ×4 regimes + G-LIVE-21 on the lane DIST | (dev only) | **10 passed, EXIT 0**, 10 stop keys both engines both themes | run1 |

- Every reading agrees to the thousandth. The admission floors sit 0.05 under these readings, and the COUNT caps equal them exactly.
- The cr dark 16×16 control also reads 20. The spec's comment ("16–20 under") covers it.

## 2 · Plants run (pass 7's first, then the critic's)

**Pass 7's plants.** I did not re-run them as file plants. The prototype's final-sha file battery (`../../prototype/MRK-LIVE/logs/plants.txt`) shows:
- NOPREF2 12 failed; COARSE2 5; MORE2 4; X4, X4b and DARKX4b red; FCCLIP2, X5, X7, X8 and X9 red at `ccfbdb3e`.

Read against its reasons:
- **NOPREF2/COARSE2/MORE2 red G-LIVE-23 only through the precondition** ("a chrome stop read clean, to lay … on"). The file plant faints EVERY stop, so no clean stop exists. They never red a judged verdict. That is exactly why the one-stop sibling (gap 1) passes.
- **In-run, the rows' own plants red on my runs**: FCCLIP2 0 / 0 px, the regime plants, X3–X9. So the rows can see their own plants and not the siblings.

**The critic's battery.** One scratch copy (`git archive 74a2b5d9` + `pass8.diff`, = the tree), dev on :4238, the whole spec, both engines, three plants at once. Each plant is out of force in every other row's regime.

| plant | row | verdict | proof of life |
|---|---|---|---|
| MORE2S (`prefers-contrast: more`, logo-trigger only) | G-LIVE-23 [more], G-LIVE-16 [more] | **GREEN ×2 each** | ring 0.15 · four-band RED 1.199 cr / 1.196 wk |
| COARSE2S (`pointer: coarse`, logo-trigger only) | G-LIVE-23 [coarse], G-LIVE-16 [coarse] | **GREEN ×2 each** | ring 0.15 · RED 1.199 / 1.196 |
| FCSIDE (forced colours, three sides clipped) | G-LIVE-21 | **GREEN ×2** | card 217 / 153 px vs 1,127–1,329 clean |
| X12 (`` `var(${N}, 280ms)` `` in the laminate) | G-LIVE-19 | **GREEN ×2** | library returns `[]` |
| whole file | | **31 passed / 1 failed**, the 1 = gap 4 (unplanted row) | |

- Pre-plant shas `index.css` `afbb2be1`, laminate `e54be0c0` (= the prototype's final). Both were restored sha-equal after the run. The tree was never edited.

**Clause sabotage on the re-cut gates.** The prototype's `EDGE_SABOTAGE` battery stands as read (gap 5). The critic's plants are the class-level sabotage: each deletes a clause the gate never had (a per-stop regime read, a per-side forced-colours floor, a const read).

## 3 · Constraints

| constraint | reading |
|---|---|
| instrument imports | `e2e/focus-ring.spec.ts` → `./lib/edge-bands.mjs`, `../scripts/shape-census.mjs` by relative `import(new URL(...))`; homes byte-equal; no `docs/` import in `focus-ring.spec.ts` (other specs' `docs/` strings are pre-existing, not this lane's) |
| SHAPE law (i), second reader | `sites()` extracts `index.html`'s `<style>` by a spec-local regex beside the library's `sfc`/`stripCss`. It is small and not a fork of a library function, but it is a second reader of one site class. It is noted, not red. |
| M16 | `check-copy-register --self-test` exit 0 (0 dashes, 0 jargon) |
| filterBudget | the product delta over pass 7 touches no filter. The prototype's census (light 12/12, dark 4 failed = crayon-heart on BOTH dists) stands. |
| @property law | 3 registrations, each in `src/assets/index.css`, one home each. The dist carries 45 against the control's 42, the difference being exactly those three. |
| AA painted | every G-LIVE-23 reading is painted bytes on the ONE probe, re-derived above |
| π | gap 13 |
| eslint | `--max-warnings 0` on the three touched files: exit 0 |
| lint:theme-tokens | exit 0 |
| test:e2e:projects | exit 1 (gap 9) |
| frame | `t9-b8-ink-3arms-…-x3.png`, 18,215 B |

**The frame, looked at.**
- Row 1 shows A, B and C on 16×16, cell 0 focused, differing in hue and weight. C reads darkest, as the caption says, and the fill tint moves with the arm, as declared.
- Row 2 shows HEAD's 9×9 ring with its left stroke laid against the frame rule, and `sized` inset and crumpled.
- Each row is on one payload with its variable named. `check-evidence-policy` exits 0, and the w7 PNGs total 1,998,833 B (101 files), a headroom of 98,319 B.
- The composite retires nothing, and it is charged to ruling 18's T9-B8 line.
- The caption's claim "cells 0–1" is weak: cell 1 is barely in frame. That is a caption precision note, not a lie.

## 4 · Ballots

- **T9-B8:** arm A ships, and B and C are framed on HEAD's geometry. Lawful, and nothing fires.
- **T9-B29:** HEAD ships. `sized` is framed, and its four-band cost is named (31/228, B4 holes).

Both stand as the owner's.

## 5 · The number

**87.** It rises one on real closures:
- regimes read under three new media arms;
- the masked-default read moved into the ONE library;
- forced colours judged on paint;
- the 9×9 frame edge carried by a row whose floors I reproduce to the thousandth, on lane and control;
- T9-B8 and T9-B29 framed lawfully;
- the comments struck, 0 eslint warnings, and the Tailwind comment-candidate cured with a born-RED.

It is held there for three reasons:
- the pass-7 shape repeats: each re-cut gate falls to a sibling of its own plant (gaps 1–3);
- the shipped default reds its own gate about one read in eight on chromium (gap 4);
- two of the four-band clauses have no isolating plant (gap 5).

**Earliest 100:** pass 10. Gaps 1–4 cured in pass 9, and two clean passes after that.

## 6 · Box, route, incidents

- **Box load (1-min):** 50.7 at start; 49.8 → 39.3 over run1; 41.4 at run2's end; 41.4 at run3's end; 33.5 at the control cell-0 read. No timing verdicts.
- **Replay.**
  - Scratch `critlive8/copy` = `git archive 74a2b5d9 web/frontend csp-solver/data` + `pass8.diff` (apply 0; `diff -rq` against the tree 0), with `node_modules` symlinked to main's.
  - The dist was built with `instruments/vite.critbuild.mts` (private cacheDir outside the project).
  - `serve-dist.sh` / `serve-dev.sh` on :4238 and `serve-control.sh` on :4251 (`w7-control`, identity verified by hash).
  - Playwright via `instruments/pw.crit.mjs`. Plants via `instruments/cplants.py apply|restore`. Proof of life via `instruments/more2s-probe.mjs`. The control cell-0 read via `instruments/cell0-crit.mjs`, which is the prototype's `cell0p.mjs` re-pointed to the copy's homes and read whole first (no delete-bearing lines).
- **Incidents.**
  - The first dist build failed because the copy lacked `csp-solver/data` (the sudoku-templates plugin). Re-archived, it built.
  - Two scratch scripts (the G-LIVE-19 probe and the cell-0 probe) were copied into the SCRATCH copy's `web/frontend` to resolve `node_modules`, then moved to `critlive8/trash/`. Nothing entered the work tree.
  - One gate's log redirect was mistyped (`/tmp/..` path, exit 1 from the shell, not the gate), and it was re-run bare with correct paths. `check-pw-projects` was first read through a pipe (its exit masked), and re-run bare: 1.
- **Servers.** Killed by recorded PID after a cwd and ancestry check:
  - lane dist: wrapper 32784, child 32835;
  - planted dev: 50793 / 50838;
  - control: 32881 / 32929.

  Both ports were empty at return.
- **Hygiene.** No git in the control tree. No `rm`. The only git run against the work tree was a temporary index (`GIT_INDEX_FILE`) to read its tree sha, before and after. Nothing was committed, pushed, stashed, installed or deployed.
