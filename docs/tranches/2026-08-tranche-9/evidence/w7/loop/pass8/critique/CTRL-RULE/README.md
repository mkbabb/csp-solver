# T9-W7 · pass 8 · CRITIQUE · CTRL-RULE (the ruled page, §10, alive on T9-B13(b) only)

I wrote neither the charter nor the prototype. **Convergence: 84 (from 80). Verdict: ADVANCE. Earliest 100: pass 10.**
Pass 8 is not clean for this family, so passes 9 and 10 both have to be.

**Rig.** I cut the tree's diff through a temporary index (`GIT_INDEX_FILE` in my scratch): write-tree `47bcf698`,
652,696 B, sha1 `706edfc5…`, `41 files changed, 10042(+), 1235(−)`. That equals the bank byte for byte. The six
instrument homes in the tree `cmp` equal to `homes.diff` (`a1d8adeb`) applied to a fresh `74a2b5d9`. Nothing
in `e2e/` or `scripts/` imports from `docs/`. The only hits for `docs/` are two comment strings (`census.stamp.json`,
the `shape-census.mjs` header). The spec imports `./lib/edge-bands.mjs`, `./lib/glyph-pop.mjs` and
`../scripts/shape-census.mjs`, all relative.

I built out of tree from `git archive 74a2b5d9` + `pass8.diff`, with a private cacheDir in my scratch. The result is
`index-D-xHVlMO7-Jc.js` / `index-CH9SZq56yuC4.css`, and `diff -rq` over the whole dist (43 files) against the lane's
`dist-8b` is IDENTICAL. I served it on `:4231` and the shared control dist on `:4252` (`index-CubiZsMVSwTc.js`),
checking each by asset hash. I later re-used `:4231` for pass-7 `s10`'s dist (`index-BMveQXpEX6ev.js`, the
`s10.BANKED.txt` identity). Every server was started by me and killed by recorded PID after an ancestry and cwd
check, and both ports were free at return. The spec rows ran on the bank's own bytes in my extraction. My critic
rows were inserted into a COPY there (`instruments/ins.py`), and the copy was restored to sha1 `474f58ec` (= the
tree's) before the lint battery ran. **Box load: 1-min 30–45** throughout. None of my rows is a timing row.

## 0 · Gaps (each with its number; the ones the lane did not declare come first)

1. **Row 28's WebKit arm still cannot fail on an inset-erasing value spelled as a stack** (NEW; charter row 3 is
   PARTLY closed). The pass-7 plants all red, and so do eight more. Two spellings throw the inset away while the
   three WebKit arms stay green:
   - **K1b** `#card-foot.card-foot{padding-bottom:calc(.15rem - env(safe-area-inset-bottom) + env(safe-area-inset-bottom))}`
     (net stack 0).
   - **K13b** `#card-foot.card-foot{padding-block-end:.15rem}` (a logical longhand).

   Each reads GREEN on the source arm through the ONE library (browserless), GREEN on the served-cascade arm, and
   GREEN on the flat-phone paint arm (pad 2.4px, lowest ink 840.5, clears 3.5, **both engines**). Chromium's CDP-34
   arm reds both (pad stays 2.4px, clears **−30.5**). The logical shorthand `padding-block:0 0 .15rem` (K14) reads
   the same. The cause is that `STACKED` / `SERVED_OK` MATCH the value's text instead of EVALUATING it, and neither
   arm reads the logical longhands (`padding-block-end`, `padding-block`). The library returns `sites 1` for them, so
   it never sees them as sites.

   Cure, browserless and in WebKit alike: evaluate every live site at env → 0 and env → 34 (a probe element's
   computed `padding-bottom` with the `env()` substituted) and require Δ = 34. Add the logical props to the
   library's read set as a PROPOSED clause with these two plants. (`readings/row28-source-critic-plants.txt`,
   `readings/row28-flat-cdp-critic-plants.txt`.)
2. **The B13(b) caption names every variable the chair listed, but not every variable the frames carry** (LAWS P7
   §C; charter row 1 is closed on the chair's letter). A fifth variable is visible in both frames and unnamed.
   The ruled arm draws a BOX around each verb (`clear` / `fill` / `solve` / `share`) and around `deal` and `play`.
   HEAD (`74a2b5d9`, my photograph at the frame's cell) and `s10` (both pass 6's and pass 7's) set those icons
   unboxed, inside one case.

   Two smaller points. The `pencils` grouping and the centred deal are HEAD's, not FACE's (HEAD already tapes
   `pencils` over `marks` / `what fits` and centres the deal row). The caption's "(b) drops of the fold's page" is
   still true, but (b) also drops them from HEAD's page. The frames' right arm is PASS-6 `s10` (`index-QGTCf7nYCMIb.js`),
   while the caption's names line quotes PASS-7 `s10`. My photograph of pass-7 `s10` (`index-BMveQXpEX6ev.js`, 390×844c
   DPR 2, scrolled to end) shows the same structure on this surface (the tapes, the centred fields, the unboxed foot,
   the `pencils` tape over `marks`), so the referent mix moves no pixel I can see. It should still be stated.
   The chair rules whether the fifth variable holds the condition.
3. **M18's re-cut has no clause-sabotage battery, and it has no weight clause.** My clause matrix (10 plants × 4
   cells × 2 engines, `readings/m18-clause-matrix.txt`):
   - The absolute 4.8 floor is the SOLE catcher of a `mask-image` at alpha .81 (quarters 3.53 L / 4.368 D, alpha carried
     at 0.677–0.678, chain 1) in 7 of 8 cells. In chromium 390c light, `core` also reds.
   - The alpha and chain clauses are never the sole catcher of any of the 10 plants.
   - A stroke thinned to 0.55× its width HOLDS in 6 of 8 cells (both engines at 1280f, WebKit at 390c; quarters
     5.236 / 6.069 unchanged). A rule drawn at half weight passes as "painted and seen".

   The floor carries the class, so this is not a hole in the pass-7 sense. The re-cut still ships no sabotage row,
   though, and a weight clause is the chair's to rule. The ring law's P7 §E(ii) thickness clause names rings, and a
   drawn rule is its nearest sibling.
4. **The portable rows red on the fold's tree as shipped** (charter row 8). `pass8.delta.on-s10.diff` applies 0 on a
   fresh `74a2b5d9 + s10`, and so do the homes (both re-run by me). But its source arm reds on `s10` (51 sites) until the
   chair folds `shape-census.class-ternary.PROPOSED.diff` into the ONE copy. The only thing the fold carries of this
   family is red on arrival without a library change. The lane declared this.
5. **The iPad seal is RED for the third pass: 1246.53 / 1246.72 against 1227.5** (lane's reading, reproduced by the pass-7
   critic, not re-run by me). It is B13(b)'s cost and is written into the caption at +19.03 / +19.22. The caption still
   does not name who re-stamps `:814` if (b) fires, which was pass-7 critic gap 1's second clause.
6. **The names' AA is a written LOSS, and the desk cell is ungated** (the lane's gaps 2–3, reproduced). The row gates
   390×844c DPR 2 only. At 1280f DPR 1 chromium light, `size` reds G4 col 4 at every ink. The instruments README reads the
   same 2.63 on the control's `.section-heading`. That is the probe's read of that glyph pair, and the chair owns it.
7. **Declared, the fold's or the estate's**, and read by me with the control's exit beside it:
   - check 8, live 260/258 against stamps 238/236 (tree 1 | control 0);
   - undefined-token census `ConfirmRibbon.vue:140/141 --tap-floor` + the STALE `--refuse-dur` (1 | 1);
   - the dark filter census, crayon-heart ×2 (lane's reading, tree = control; I did not re-run it);
   - WebKit has no inset emulation, and real iOS is unwitnessed (M19);
   - INTAKE-22 row 28 clause 1's letter re-cut (`scene.css:585`), which the chair rules;
   - row 29 on `s10`'s rail, which is FACE's.
8. **A doc line went stale** in the product: `App.vue:991` still quotes the hover as
   `.sun-moon-toggle:hover { transform: scale(1.08) }`, but the hover now reads `scale(var(--toggle-reach))`. That is
   one comment line, fixed with the next edit.

## 1 · Numbers I re-derived (both engines unless marked; tree `:4231` | control `:4252`)

| row | tree | control / s10 | verdict |
|---|---|---|---|
| diff via temp index vs bank | 652,696 B, sha1 `706edfc5`, write-tree `47bcf698`, 41 files +10042/−1235 | — | = BANK |
| `git apply --check`: cumulative on fresh 74a2b5d9 · delta on 74a2b5d9+pass7+homes · on-s10 delta on fresh 74a2b5d9+s10 · homes on s10 · cumulative on s10 | **0 · 0 · 0 · 0 · 22 files refuse** | — | REPRODUCED |
| dist identity (clean out-of-tree build) | `index-D-xHVlMO7-Jc.js`, `diff -rq` = lane's `dist-8b` | control `index-CubiZsMVSwTc.js` | REPRODUCED |
| **M18 shipped** (spec rows, 1280f + 390c DPR 1, both themes) | alpha **0.679** 8/8; quarters **5.236** L, **6.014** chr / **6.069** wk D; chain 1; 16/16 spec rows GREEN | — | REPRODUCED |
| **M18 ink plants** (R55 + `INK_PLANTS` 0.81 ×3) | alpha **0.547–0.553**, alpha clause RED and floor RED **32/32** | — | REPRODUCED |
| **pass-7 critic's plants FIRST** (plain, no `!important`) | C1 `path{stroke-opacity:.81}` RED 8/8 (chain+floor+alpha); C3 `svg{filter:opacity(.81)}` RED 8/8; C2 `path{opacity:.81}` plain paints NOTHING (the draw-on fill outranks it: 5.236 = shipped), and its `!important` twin reds in the spec | — | pass-7 gap 3 CLOSED |
| **M18 critic plants** | mask .81: RED 8/8, the floor its sole catcher in 7/8; `.action-bar{filter:opacity(.81)}`: chain+floor RED 8/8 (alpha carried 0.678–0.682); stroke-width ×0.55: HOLDS 6/8; graphite 88 % / 75 %: alpha **0.879 / 0.749–0.753** (a darker ink: the alpha reader is linear in ink, a calibration check) | — | gap 3 |
| **Row 28 source arm, the ONE library** (browserless, bank bytes) | shipped 1 site GREEN; pass-7 E4 / E3 / shadow RED; my index.css `!important`, GameScene `<style>`, `var(--fp,0px)`, nested, `:is()`, `@supports`, `@layer` RED; **net-zero stack GREEN, `padding-block-end` GREEN, `padding-block` GREEN**; `calc(0px+env())` and `calc(-1rem+env())` GREEN at source (they red on the flat phone's pad clause); the legal `env(…, 0px)` fallback REDS (over-strict decoy) | — | gap 1 |
| **Row 28 flat phone** (390×844c DPR 2, inset 0) | shipped: served 1 site, pad 2.4px, lowest 840.5, clears **3.5** both engines; translate 3px → clears 0.5 RED; margin −3px → 0 RED; E4 → served RED; **K1b / K13b GREEN both engines** | CDP 34 (chromium): shipped pad 36.4px, clears 3.5; K1b / K13b / K14 **clears −30.5 RED**; E4 clears 1 RED | gap 1 |
| lane's row-28 rows (source, served+flat, CDP) | 5/5 GREEN (webkit CDP skipped, stated) | — | REPRODUCED |
| **Names on paint** (glyph gate, 390×844c DPR 2) | L **4.659**, under-4.5 **0.204–0.254**; D **7.681**, **0.134–0.175**; 12/12 GREEN; plants 90/96 RED, the 6 GREEN = FADE80 dark at **5.329**, seen | — | REPRODUCED |
| **`--toggle-reach` one writer** (browserless) | shipped GREEN (1 writer `index.css:174`, 14 computed-key sites UNRESOLVED, printed); my plants RED: `main.ts` `setProperty`, `:style` object, static `style=`, Tailwind `[--toggle-reach:1.25]`, a second `@property` in `typography.css`, `:is(.sun-moon-toggle):hover`, the foot's `* 1.08 / 2` literal; the individual `scale: 1.25` on hover GREEN at source (the live hover row owns it, not re-run by me) | — | row 7 CLOSED |
| **π of the pass-8 moves** (computed) | `.ruled-group` track **136px** (107.188 chr / 107.1875 wk at 360), `--rp-margin` 8.5rem / 6.7rem on the grid, none on `.control-panel-wrap`; `--toggle-foot` **172.16** at 1280, **55.76** at 390c / 360; hover `matrix(1.08…)` | control hover `matrix(1.08…)` both engines | π 0 at the toggle; the moves are value-identical |
| battery (bare; tree \| control) | lint:lanes 0\|0 · theme-tokens 0\|0 · sleep 0\|0 · motion 0\|0 · copy 0\|0 · ink 0\|0 · **test:e2e:projects 1\|0** · prettier 0\|0 · **check-pw-projects 1\|0** (check 8: live 260/258, stamped 238/236, floor owes 221/220) · check-copy-register 0\|0 · property-block src 0\|0, served 0\|0 (49 on `index-CH9SZq56yuC4.css`) · **undefined-token census 1\|1** · shape-census self-test 0 (92/92, 40/40) · `eslint . --max-warnings 0` 0\|0 · knip 0\|0 | | REPRODUCED |

Not re-run by me: the filter census at boot and rest, the seam post-paint, the seal, vitest (831), `vue-tsc -b`, and the PROPOSED
class-ternary self-test. The lane's readings stand as the lane's.

## 2 · Checklist

- **Gates that cannot fail:** row 28's WebKit arms on a value-shaped stack and on a logical longhand (gap 1). Pass 7's
  three named plants are closed.
- **Vacuous convergence / spec-cites-itself:** none new. The names' G3 bound is the clean read + 0.05 by the ONE
  probe's design. The absolute G1 4.5 is the floor that bites (margin 0.159).
- **The elegant-reduction trap:** "the three move together or not at all; on `s10` there is nothing to move". That's
  honest. The centre doesn't travel, and the family lives on the ballot.
- **Masked fallbacks / legacy aliases:** `--rp-margin` now lives where it is read, with no alias left on the panel
  (verified computed). The reach law prints the 14 computed-key sites UNRESOLVED and never counts them. That's
  honest, but a writer through a computed key would pass.
- **Unverified gestalt:** I looked at the frames, at HEAD at the frame's cell, and at pass-7 `s10` at the frame's
  cell. That surfaced the fifth variable (gap 2).
- **π:** 0 on the three product moves (computed, both engines); the toggle's hover is identical to the control.
- **Constraints:** AA from painted bytes (names reproduced). The filterBudget is unchanged (lane's read, tree =
  control). M16 is 0 (`check-copy-register` 0|0). The @property law is GREEN source and served. `--toggle-reach`
  is registered in `index.css`'s one block, and it is RULE's own token: it travels only with B13(b).
- **Instruments:** the three imports are relative product paths and the homes are unforked (`cmp`). Two readers
  remain hand-rolled in the spec: the row-28 served/flat arm (`SERVED_PAD`, `LOWEST_INK`) and M18's `FOOT_RULE` /
  `RULE_INK`, a single-sided cousin of `edge-bands`' four-band probe that predates batch 0 and was extended in the
  spec this pass rather than PROPOSED to the ONE copy. This is PLAUSIBLE against LAWS §I rather than a fork, and the
  chair rules whether a drawn rule is `edge-bands`' subject.
- **A number the critic did not re-derive:** listed above. The lane's seal, seam and filter numbers are its own.

## 3 · Strengths (reproduced)

1. **M18 now reads ink.** The conditional reference is sound: forcing a neutral longhand re-rasters the path, and the
   lane caught that on its own red. The alpha reader is LINEAR in ink (0.879 for 88 %, 0.749–0.753 for 75 %, 0.549
   for 0.81 × 0.679), which is independent evidence that it measures what it claims. The floor catches the mask
   class the reference can't see.
2. **Row 28 imports the ONE library and pairs it with a behavioural twin** that sees what no source reader sees.
   The inline write, a structural selector, an `!important` universal, a translate and a negative margin each red
   in both engines. The `every-site` / `regimes` / `shape` / `element-keyed` / `media-eval` sabotage battery bites
   5/5 (the lane's printed map, reproduced in my run).
3. **One writer for the reach** survives seven plants of mine across five writer spellings.
4. **The record is honest and byte-exact.** The bank equals the tree, the dist equals a clean build, 22 files refuse
   on `s10` as listed, and every declared red is reproduced with the control's exit.

## 4 · Convergence: **84**, ADVANCE

Rows 2, 4 and 7 are CLOSED and reproduced. Row 1 is closed on the chair's letter but carries one unnamed variable.
Row 3 is closed for its named plants and open for its class in WebKit. Rows 5 and 6 were read (lane's). Row 8 is cut
and applies, and it reds on `s10` pending the chair's library fold. The seal is red for a third pass as B13(b)'s
stated cost. None of the open gaps needs a new primitive: two library clauses (evaluate the stack, read the logical
longhands), one caption line, one sabotage row and a weight clause for the chair to rule. **Earliest 100: pass 10.**

## 5 · Cross-pollination

- **Every inset / edge source gate (TAPE's `check-tape-foot`, FACE's rail, the chair's `shape-census`):** evaluate
  a stacked value at two insets instead of matching its text, and read `padding-block(-end)` / `inset-block-end` /
  `margin-block-end` as sites of the physical side. Plants: K1b and K13b.
- **Every served-cascade twin:** `getPropertyValue('padding-bottom')` is blind to a logical longhand in CSSOM. Read
  the logical names too.
- **Every drawn-edge paint gate with a relative reference (TAPE's foot ring, LIVE, SELF):** a `mask-image` and an
  ancestor `filter: opacity()` ride into any reference that only neutralises the element's own longhands. Only an
  absolute floor or the chain catches them.
- **Every ballot pair against `s10`:** HEAD already carries the `pencils` tape and the centred deal. A caption that
  attributes them to FACE misplaces them.

## 6 · Incidents (the critic's own)

1. Before switching to the temporary index, I ran one `git status --short` in the lane's worktree on its REAL index.
   It was read-only in intent, but it can refresh the index's stat cache. The cut itself used `GIT_INDEX_FILE` in my scratch.
2. My first out-of-tree build exited 1 because the extraction lacked `csp-solver/data`. It was re-extracted and rebuilt.
   My first battery red `lint:lanes` (no `.github` in the extraction) and property-block src (a non-existent
   `--dist`) on BOTH arms. Both rows were re-run with the rig fixed, 0|0, and the first readings are kept beside them.
3. My first K1 plant carried `!important`, and the served arm red it on the `!important` text, not on the value. It was
   re-run plain (K1b) and read GREEN. My first reach plants R2/R3 appended a second `<template>` (an invalid SFC)
   and read GREEN. They were re-run inside App.vue's real template (R2b/R2c/R3b) and read RED. Only the valid runs are cited.
4. A foreground `sleep 50` poll was refused by the harness. It was replaced by background notifications.
5. No `rm`. Nothing was written into the lane's worktree or the control tree, and no git ran in the control tree.
   Scratch lives under `<scratchpad>/rulecrit8/`. No crop is banked, so the headroom spent is 0 B, and
   `check-evidence-policy` exits 0 bare.
