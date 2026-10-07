# Pass 8 · MRK-LIVE · the live mark (prototype record)

This record covers work tree `.claude/worktrees/wf_f72f3b5a-83a-35` (base `74a2b5d9`). The tree is uncommitted and was advanced IN PLACE on the chair's banks: `pass7/prototype/MRK-LIVE/pass7.diff` plus `pass8/instruments/homes.diff`, which gives tree `a49469ea`.

An earlier pass-8 attempt on this tree died, and its edits were still in the tree. I read them hunk by hunk. Kept and finished: the e2e `node.d.ts` declarations, the struck figures and cites in `gameCell.css` and `FocusRing.vue`, and the `focus-ring.spec.ts` rework. Nothing it printed is cited here. Its T9-B8 composite carried a wrong arm C (`#4589d2@1.0`), so it went to the scratch trash, and every number below was re-measured by this run.

**Control.** Control = `74a2b5d9`, measured three ways:
- **Dist rows:** the chair's `w7-control` preview on :4251 (`index-CubiZsMVSwTc.js`). No git ran in the control tree.
- **Lint and unit battery:** a `git archive 74a2b5d9` in the scratchpad, `.github` included.

**Lane.**
- **Spec rows:** a lane dev server on :4238.
- **Dist:** built outside the tree after the last edit, `index-BkcV-IZ5Z7we.js` / `index-BmkNOUhcvBnA.css`. It is byte-identical (`diff -rq` 0) to a clean build of an archive+diff copy.

The pass-8 number is the critic's.

**Box load.** 1-min load ran 11–253 over the run, from a foreign workload plus sibling lanes. Nothing below is a timing verdict. Every rate-free row is a painted or DOM reading.

## 0 · Gaps first (open, each with the number that holds it)

1. **HEAD's 9×9 frame cell is ADMITTED, not cured, and the default is the control's recipe.**
   - Readings on the four-band probe, cell 0, lane dist:
     - 9×9, left side, core median: **2.812 cr / 2.85 wk light; 2.404 dark** (both engines). **63 of 228 stations under 3:1.**
     - 16×16: **16 of 128**, all sides ≥ 3.609.
   - The control dist reads **2.698 / 2.693 light, 2.312 / 2.316 dark, 63** at 9×9.
   - At 16×16 the control reads **20 cr (a B4 hole on chromium light: RED) / 16 wk**.
   - The default does not lose to the control on any statistic. It is higher on every median because of the 0.95 ink, and it has no hole.
   - G-LIVE-23 admits the 9×9 left side at the shipped reading − 0.05, per engine and theme: **2.762 cr/light · 2.354 cr/dark · 2.8 wk/light · 2.354 wk/dark**. Frame-cell COUNT caps are 63 (9×9) and 16 (16×16), each with a STALE clause.
   - The ring's side on the frame rule is the cause. Only an arm that moves the ring off the rule cures it. `sized` does not (gap 7).
2. **The deck card's ring is ADMITTED, not cured.** G-LIVE-23 reads the right and bottom sides under the card's own sketch:
   - Chromium: light reduce **2.327 / 1.729**, no-preference 1.953; dark 2.964 / 2.261.
   - Webkit: **1.709** light reduce, 1.833 no-preference; dark 2.226.

   The floors are at shipped − 0.05 per engine/theme (the right / bottom pair):
   - cr light 2.277 / 1.679 · wk light 2.272 / 1.659
   - cr dark 2.914 / 2.211 · wk dark 2.914 / 2.176

   Each floor carries a STALE clause, and the in-run WORSE plant (ring 0.8 on the card) reds the admission: 1.568 cr / 1.565 wk bottom. The cure is MRK-ABS's D0 (the deck ring at offset 0). It is PROPOSED to the deck owners and not built here.
3. **INTAKE-22 row 44 stays OPEN on lane and control alike, and the homes' clauses do not close the instrument's own hole.** The `.info-btn` 'i' at rest, DPR 2:
   - **2.510** chromium light, **2.872** webkit light, **4.368** webkit dark, all under 4.5 (RED G2).
   - Chromium dark reads **4.697** GREEN, but the probe exits **3**: **HEAD12 and TAIL12 both stay GREEN at 4.743** on the one-glyph 'i'. The homes' HEAD plant and one-glyph clause were run and do not red that face.
   - Open state: chromium light 5.727 and dark 11.66, both exit 3 by the same plants. The control's chromium light open read came back EMPTY (a transient 523).

   The glyph's ink is §10's, or T9-R8's rung, and is cited here, not changed. That glyph-pop's one-glyph clause misses a HEAD/TAIL plant is the chair's instrument row.
4. **Clause sabotage finds two clauses no plant isolates.** `EDGE_SABOTAGE` on G-LIVE-23 [reduce] chromium:
   - **B1 off → exit 0**: no plant drops stations without also failing B2/B3.
   - **B4 off → exit 0**: DASH_1IN8 also reds through B3 on its bottom band, at depth 1.44.
   - B2 off → RED (five plants). B3 off → RED (THIN_1PX on tier 2).

   A B1-only and a B4-only plant are owed. The library's own `--sabotage-battery` reds 40/40. The hole is the SPEC's plant set, not the library.
5. **Tier 2's thickness clause is carried by ONE side.** THIN_1PX on tier 2 (a 1 px stroke) reds only on the left band: **1.75 at DPR 1; 1.74 cr / 1.78 wk at DPR 2**, against the 1.80 floor. The other three bands read **3.4–3.5 css px** under a 1 px stroke: the depth read counts the ring's own 0.08 fill as painted. The row is RED as required, but by one side. A depth read that excludes the fill's tint band is proposed as an extension to the chair's `edge-bands.mjs`, and is not built here (the instrument is the chair's home).
6. **`test:e2e:projects` is RED on this tree (exit 1) and 0 on the control.** This lane's added rows push the live count past the floor band: **chromium 253 vs floor 214, webkit 251 vs 212**. The restamp is WGATE's, and is DECLARED here, not restamped.
7. **`sized` fails the four-band probe at 9×9.** On `arm: "sized"` (dist `index-DpOwz4MhoAjQ.js`), 9×9 cell 0 medians are all ≥ 3.965, but **31 of 228 stations are under 3:1**, with **B4 holes on every side** (top 0.105, 6 stations in 2 runs). That is RED, both engines, both themes. At 16×16 it equals HEAD. Pass 7 read the same arm as 0/240 on the whole-ring census. The four-band probe sees the graft's wander as holes. `sized`'s cost is named in the row (charter row 6).
8. **The file-plant battery for G-LIVE-19 / -21 / -4 ran at an intermediate spec sha** (`ccfbdb3e`). The regime and faint plants (G-LIVE-16/23) were re-run at the final sha (§2). The final sha changed `docSettled` and G-LIVE-16's board read, not the G-LIVE-19/21/4 bodies. Their in-run negatives (X3/X5–X9 in G-LIVE-19, FCCLIP2 in G-LIVE-21) red inside the record run at the final sha.
9. **G-LIVE-4's at-least-one-reversal clause is still checked only by the second engine of an invocation.** Record run: chromium reversed in place ("no siblings recorded: unchecked"); webkit cut and checked chromium's record. Per-invocation checking is not built.
10. **G-LIVE-17's covering is still a per-room reading:** 8 cells / 4,262–4,581 px² this run, and 6–8 cells / 2,912–4,612 px² across the pass. It is printed, never asserted (T9-R7, the chair's).
11. **Not re-run this pass: π (the ring's `d` and whole-DOM).** The product delta over pass 7 is comment text and two dead token declarations. The dist's CSS diff against the control is the reading instead (§6): **19 tree-only rules, 11 control-only, 0 `outline-ring`, 0 `--color-ring`**. G-LIVE-22 holds the ring's `d` identical to HEAD's recipe **256/81/16** in the record run.

12. **G-LIVE-23 [no-preference]'s 16×16 frame-cell COUNT cap flaked once in 12 clean reads at the final sha.** On chromium light, in the COARSE2 run (a plant that does not match that regime), the left side read **3.148 with 5 stations under 3:1: COUNT 21 > the admitted 16**. The other 11 reads were 16, with left 3.254–3.989. The cap was set from the reduce regime, where the grid is still. Under no-preference the grid boils on, and the frame rule under the ring's left side changes pose. That mechanism is a hypothesis, not read. The control under no-preference reads 16–20. Proposed, not built: read the no-preference frame cell under each of the grid's four baked poses and admit the maximum.
13. **G-LIVE-16 reds under the regime plants and X4b by a plant interaction, not for faintness.** The plants' tier-2 `opacity: 0.2 !important` beats G-LIVE-16's own in-run X2 plant (opacity 0, not `!important`), so its self-check ("X2 … turns input.cell-native-input RED") fails. This is the pass-7 gap 5, unchanged. G-LIVE-16 judges existence. G-LIVE-23 judges visibility, and it reds under every one of these plants by its own clause.

## 1 · The charter rows

| # | row | status | numbers (lane · control `74a2b5d9`) |
|---|---|---|---|
| 1 | G-LIVE-23/16 under no-preference, coarse, more; both themes; NOPREF2/COARSE2/MORE2 in-run; the thickness clause with the 1 px plant | **CLOSED** (thickness by one side on tier 2, gap 5) | See §1a. G-LIVE-16 runs 4 regimes with REGIME0 plants and a 4-shot ON/OFF/ON/OFF read: **24/24** ×3 both engines, X2b 0 px everywhere. The WITNESS row shows the pass-7 hole: NOPREF2 read under reduce stays GREEN (4.188 ×4). The same plant read in force reds, at 1.199 light / 1.149 dark. |
| 2 | G-LIVE-19 through the library's `maskedDefaults`; X7/X8/X9 red; the `maskedIn` regex deleted | **CLOSED** | G-LIVE-19 imports `../scripts/shape-census.mjs` (`maskedDefaults`, `propertyRegistrations`), and the hand-rolled regex is gone. In-run: **X3, X5, X5b, X5c, X7, X8, X9 each caught once.** File plants X5/X7/X8/X9 each red G-LIVE-19 ×2 (§2). Library: `--self-test` **92/92** (40/40 clauses planted, `[masked · LIVE] X7/X8/X9` included), `--sabotage-battery` **40/40 red**. |
| 3 | G-LIVE-21 counts painted pixels on the deck card and staging face; FCCLIP2 its negative | **CLOSED** | Record run: card **1,377 cr / 1,499 wk** px painted, staging **358 cr / 331 wk**. Across the pass, the card read 1,082–1,536 cr / 1,085–1,452 wk. **FCCLIP2 → 0 / 0 px with `outline-style` still solid**, RED in-run. File plant FCCLIP2 reds G-LIVE-21 ×2. Guard: 260 px. |
| 4 | the 9×9 / 16×16 cell-0 clause, admitted at shipped − 0.05 with STALE; the default IS the control | **CLOSED as an admission** (gap 1) | See §1b. The row prints that the default is HEAD's recipe = the control's `d`. Lane ≥ control on every median, lane count ≤ control count. WORSE90 (ghost 0.9) reds both frame cells in-run: 9×9 left 2.538 cr / 2.579 wk; 16×16 by count. |
| 5 | T9-B8 re-shot on HEAD's geometry, one composite ≤ 40 KB; T9-B29 HEAD \| sized at 9×9 cell 0 as its second row | **CLOSED** | §4. **18,215 B**. |
| 6 | `sized`'s cost named in the row | **CLOSED** | Named in `focus-ring.spec.ts` beside T9-B29 and here (gap 7). Its costs: every ring tier below 16×16 redrawn with the graft's wander; 9×9 cell 0 **31/228 under 3:1 with B4 holes** on the four-band probe. The peer-cursor coupling to PLR-COUNT/PLR-PLACE is DECLARED only if the owner fires `sized`, and is not declared now. |
| 7 | the deck card's floor at shipped − 0.05; `gameCell.css` and `FocusRing.vue:315` struck of figures and line cites | **CLOSED** | Floors in gap 2. `gameCell.css`'s tier-2 comment no longer restates painted figures or the retired table: it cites G-LIVE-23 by name. `BoardHost.vue:78/315` became rule-name cites. `FocusRing.vue`'s line cite became a rule-name cite. The graphite arm's consumer is named (row 10). |
| 8 | INTAKE-22 row 44 re-run with the HEAD plant and one-glyph clause; INTAKE-23 row 37 | **OPEN** (gap 3) / **the fold's** | Row 44: lane = control on every rest read (§5). **Row 37** (LIVE reads row 9's composed tree once, before it folds) belongs to the fold: row 9's composed tree is not on this lane's tree. |
| 9 | the four eslint warnings gone; the lint battery 0 warnings | **CLOSED** | `eslint .` exit 0, **0 warnings** (the unused directives at the old 67/790/800/802 are gone). |
| 10 | carried and declared | **DECLARED** | See §1c. |

### 1a · The regime table (G-LIVE-23, record run, spec `6ba3463c`; lowest core median per band; `n/a` = not in that regime's walk)

| regime | theme | engine | clean stop (tuner-toggle) | lowest non-admitted chrome | tier 2 cell 40 (min median / min depth) | 9×9 cell 0 (left / count) | 16×16 cell 0 (min / count) | deck card |
|---|---|---|---|---|---|---|---|---|
| reduce | light | cr | 4.188 ×4 | 4.145 guard | 3.92 / 3.84 | 2.812 / 63 | 3.609 / 16 | 1.729 |
| reduce | light | wk | 4.188 ×4 | 3.775 guard | 3.965 / 3.84 | 2.85 / 63 | 3.706 / 16 | 1.709 |
| reduce | dark | cr | 4.379 ×4 | 3.716 guard | 3.989 / 3.89 | 2.404 / 63 | 3.697 / 16 | 2.261 |
| reduce | dark | wk | 4.379 ×4 | 3.505 guard | 3.997 / 3.91 | 2.404 / 63 | 3.825 / 16 | 2.226 |
| no-preference | light | cr | 4.188 ×4 | 3.546 ctrl-btn | 3.92 / 3.84 | 2.812 / 63 | 3.609 / 16 | 1.953 |
| no-preference | light | wk | 4.188 ×4 | 3.546 ctrl-btn | 3.965 / 4.12 | 2.85 / 63 | 3.739 / 16 | 1.833 |
| no-preference | dark | cr | 4.379 ×4 | 3.716 guard | 3.989 / 3.89 | 2.404 / 63 | 3.748 / 16 | 2.261 |
| no-preference | dark | wk | 4.379 ×4 | 3.505 guard | 3.997 / 3.91 | 2.404 / 63 | 3.989 / 16 | 2.226 |
| more | light | cr | 4.188 ×4 | (clean stop + tier 2) | 3.92 / 3.84 | 2.812 / 63 | n/a | n/a |
| more | light | wk | 4.188 ×4 | | 3.965 / 4.33 | 2.85 / 63 | n/a | n/a |
| more | dark | cr | 4.379 ×4 | | 3.989 / 4.03 | 2.404 / 63 | n/a | n/a |
| more | dark | wk | 4.379 ×4 | | 3.997 / 3.91 | 2.404 / 63 | n/a | n/a |
| coarse (393×699, hasTouch) | light | cr | 4.188 ×4 | | 3.92 / 4.02 | 2.812 / 61 | n/a | n/a |
| coarse | light | wk | 4.188 ×4 | | 3.965 / 3.85 | 2.85 / 61 | n/a | n/a |
| coarse | dark | cr | 4.379 ×4 | | 3.989 / 3.89 | 2.404 / 61 | n/a | n/a |
| coarse | dark | wk | 4.379 ×4 | | 3.997 / 3.91 | 2.404 / 61 | n/a | n/a |

- The clean stop's minimum painted depth is **≥ 2.01 css px** in every cell of the table, against the floor of 2 × 0.9.
- The regime plants are proven live by the ring's computed opacity (0.15, both engines) and red in-run in every regime and theme:
  - NOPREF2: clean stop 1.199 light / 1.149 dark; tier 2 1.278 / 1.22.
  - MORE2: the same as NOPREF2.
  - COARSE2: 1.199 / 1.149; tier 2 1.278–1.53 / 1.22–1.452.

### 1b · Cell-0 admissions (four-band probe, cell 0 focused, PRM, 1280×800 fine, DPR 1)

| arm / dist | 9×9 left (cr L / D · wk L / D) | 9×9 under 3:1 | 16×16 (min median · under 3:1, cr / wk) |
|---|---|---|---|
| **HEAD** (lane, `index-BkcV…`) | 2.812 / 2.404 · 2.85 / 2.404 | 63 / 228 | 3.609–3.825 · 16 / 16, GREEN |
| control `74a2b5d9` | 2.698 / 2.312 · 2.693 / 2.316 | 63 / 228 | 3.338–3.555 · **20 (light: B4 hole, RED)** / 16 |
| `sized` (`index-DpOwz4MhoAjQ.js`) | 3.972 / 3.989 · 3.965 / 3.997 | **31 / 228, B4 holes every side, RED** | = HEAD |

Under no-preference ×6 (the breath running): lane 16×16 = **16 in 24/24 reads** (left 3.254–3.989), and the control reads 16–20 with one webkit B4 hole.

### 1c · Carried and declared (row 10)

| item | reading |
|---|---|
| bare `--color-peer-cursor-ink` | +2 (A.3 admitted). The undefined-token census exits 1 on both trees: tree = 2 bare + the inherited STALE `--refuse-dur`, control = the STALE only. |
| dark filter census | **4 failed / 8 passed on both dists** (lane `index-BkcV…`, control `index-CubiZsMVSwTc.js`). Every failure is `svg.crayon-heart.idle ⟨saturate(0.85)⟩`, the chair's ratified fold pick. Light is 12/12 on both. |
| the graphite arm's CSS | kept, with its consumer named: App.vue writes `data-ring-arm` from `RING_ARM`. |
| G-LIVE-4 | gap 9. |
| G-LIVE-17 | gap 10. |
| 60/120 Hz | re-run, §6. |
| R2's WebKit subject | re-run: WebKit reversed in place this pass (159.52 px; chromium 157.42), so R2 now has a WebKit subject and reds G-LIVE-4 ×2. |

### What else moved this pass (claimed, declared)

- **A Tailwind candidate minted from a comment, cured.**
  - `index.css`'s comment spelled the retired `outline-ring/50` utility's class name. Tailwind scans comments, so the lane's first dist carried a dead `.outline-ring\/50` rule. That was born-RED: the first lane build's `index-CEfOewyENIjo.css` carried the rule.
  - The comment is re-spelled ("half-alpha outline sweep …"), and `DarkModeToggle.vue`'s comment likewise. The served CSS now has **0**.
  - The rule had also masked a dead token: `--color-ring` (light `hsl(0 0% 3.9%)`, dark `hsl(48 8% 83%)`) had lost its consumers. Both declarations are deleted. `lint:theme-tokens` read 1 on the tree before the deletion and reads 0 now.
- **`docSettled` is a rest streak, not an animation drain.**
  - The living mark's breath runs poses 1–3 for ~460 ms after `getAnimations()` drains, on the shared boil beat, which is invisible to WAAPI. `breath-probe.mjs` shows it. That breath red G-LIVE-23 [no-preference] (tuner-toggle B4, two dropped stations).
  - The settle now polls from the test side (lint:sleep-compliant) for 600 ms of: every `data-mark-pose` at 0, every ring painted, the grid's four `image.boil-frame-bitmap` bakes present, and no finite animation running.
  - The 16×16 frame-cell count excursions under no-preference (21/24/25 > 16) went with the bake predicate.
- **G-LIVE-16's board read hides the grid.**
  - The ghost's OFF sheet now empties its ink in place (`stroke: rgba(0,0,0,0)`) instead of `visibility: hidden`, and the grid is hidden in all four photographs.
  - The boil aliased the X2b self-check GREEN at 36–37 px in 5 of 18 webkit non-reduce runs. Ink-OFF alone still failed 1 in 12. Now: **24/24 ×3, X2b 0 px** everywhere.

## 2 · Break tests

**Plant copy.** The file plants ran on a scratch COPY of the tree (archive + diff, synced; the tree is never edited), served on :4238. Each plant is applied, runs the rows that can see it (both engines), and is restored sha-equal.

**Final-sha battery** (spec `6ba3463c`, `index.css` `afbb2be1`, `FocusRing.vue` `c1b3838c`, `gameCell.css` `97cb3309`):

| plant (file, `index.css`) | rows run | reds | named reason |
|---|---|---|---|
| NOPREF2 `@media (prefers-reduced-motion: no-preference)` ring 0.15 + tier 2 0.2 | G-LIVE-16, -23 | **12 failed / 4 passed**: G-LIVE-16 ×6 (every regime but reduce), G-LIVE-23 [no-preference] ×2, [coarse] ×2, [more] ×2 | G-LIVE-23: "a chrome stop read clean, to lay NOPREF2 on" and "… under pointer: coarse / prefers-contrast: more"; G-LIVE-16: its X2 self-check (see gap 13) |
| COARSE2 `@media (pointer: coarse)` | G-LIVE-16, -23 | **5 failed / 11 passed**: G-LIVE-16 [coarse] ×2, G-LIVE-23 [coarse] ×2, and **G-LIVE-23 [no-preference] chromium ×1, which is not the plant's** (gap 12) | "a chrome stop read clean under pointer: coarse" |
| MORE2 `@media (prefers-contrast: more)` | G-LIVE-16, -23 | **4 failed / 12 passed**: G-LIVE-16 [more] ×2, G-LIVE-23 [more] ×2 | "… under prefers-contrast: more" |
| X4 `.focus-ring { opacity: 0.15 }` | G-LIVE-16/23 [reduce] | G-LIVE-23 ×2 | "every side of every ring … 3:1" |
| X4b `.cell-ghost` 0.2 `!important` | G-LIVE-16/23 [reduce] | G-LIVE-23 ×2, G-LIVE-16 ×2 (gap 13) | |
| DARKX4b `.dark .focus-ring { opacity: 0.15 }` | G-LIVE-16/23 [reduce] | G-LIVE-23 ×2 | the dark walk |

Every plant was restored sha-equal (`index.css` `afbb2be1` after each). The battery exited 0. The file-plant logs are in `logs/plants.txt`; the intermediate-sha results sit in the scratch trail and are summarised below.

**Intermediate-sha battery** (spec `ccfbdb3e`; gap 8):

| plant (file) | rows run | reds |
|---|---|---|
| FCCLIP2 `clip-path: inset(0)` on the deck card + staging face | G-LIVE-21 | G-LIVE-21 ×2 ("painted px") |
| X5 laminate template `style=` fallback | G-LIVE-19 | ×2 |
| X7 `VAR(` upper-case | G-LIVE-19 | ×2 |
| X8 a `${}` stem | G-LIVE-19 | ×2 |
| X9 a concatenation | G-LIVE-19 | ×2 |
| R2 (G-LIVE-4's framing) | G-LIVE-4 | ×2, webkit included (its subject now exists) |

**In-run plants** (record run, spec `6ba3463c`; each reds its stop, else the row fails "this row cannot see a ring"):

| plant | chromium light | webkit light |
|---|---|---|
| X4 ring 0.15 | 1.199 ×4 | 1.196 ×4 |
| FADE15 ink 15 % | 1.196 ×4 | 1.196 ×4 |
| FADE15 tier 2 | 1.205–1.215 | 1.204 |
| X6 bottom clipped | bottom 1.00 (32/32 dropped) | same |
| X6 tier 2 bottom | 1.077 | — |
| THIN_1PX chrome | depth 1.00–1.14 (B3) | 1.15–1.16 |
| THIN_1PX tier 2 | left depth 1.75 only (gap 5) | 1.75 |
| DASH_1IN8 | B4 on all sides, B3 bottom 1.44 | B4 |
| X4b tier 2 0.2 | 1.278 ×4 | 1.269–1.278 |
| WORSE deck card 0.8 | bottom 1.568 | 1.565 |
| WORSE90 9×9 frame cell | left 2.538 | 2.579 |
| WORSE90 16×16 frame cell | count | count |

Dark X4 reads 1.149 cr / 1.151 wk; dark X4b reads 1.22 cr / 1.22–1.231 wk.

**Clause sabotage** (`EDGE_SABOTAGE`, G-LIVE-23 [reduce] chromium):

| clause off | exit | reds |
|---|---|---|
| B2 | RED | X4b light/dark, FADE15 tier 2, WORSE deck, WORSE90 9×9 |
| B3 | RED | THIN_1PX tier 2 |
| B1 | **0** (gap 4) | |
| B4 | **0** (gap 4) | |

The first B4 run crashed on "Execution context destroyed", because the spec was edited mid-run. Its re-run (`sab-B4b`) is the reading.

## 3 · T9-B29 and T9-B8 (the owner's; nothing fires before the eye)

- **T9-B29.** HEAD ships. `sized` is gap 7 and row 6; `graft` is unchanged from pass 7.
- **G-LIVE-22** (DOM figures, record run): HEAD **+1.958 · +5.382 (5.383 wk) · +9.826** at stroke 10 for 16×16 · 9×9 · 4×4. The graft reads 1.639 · 6.88 · 14.141. The resident `d` is identical to HEAD's recipe **256/81/16**.
- **T9-B8.** Arm A ships (`#3a7bc4`@0.95). Arms B `#4589d2`@0.95 and C `#2f68aa`@1.0 are built behind the token. Each arm was proven live by its computed stroke: rgb(58,123,196) 0.95 · rgb(69,137,210) 0.95 · rgb(47,104,170) 1.

## 4 · The frame (1; one lawful composite)

| crop | bytes | engine · theme · viewport · pointer · DPR · payload | retires | charged |
|---|---|---|---|---|
| `t9-b8-ink-3arms-16x16-mint4-cells0-1+t9-b29-head-vs-sized-9x9-mint3-cell0-focused-light-chromium-1280x800-fine-dpr1-prm-x3.png` | **18,215** (pngquant 60–90; raw 50,285) | chromium · light · 1280×800 · fine · DPR 1 · PRM · ×3 nearest-neighbour | nothing (the pass-6 pair was already swept) | ruling 18's T9-B8 allocation (≤ 40 KB) |

- **Row 1: T9-B8's three arms**, A | B | C, on 16×16 (`mintSudoku(4)`), cells 0–1, cell 0 focused. The one variable is the stroke hue and stroke-opacity. Because the ring's 0.08 fill tint follows `--color-focus-sketch`, it moves with the arm. The token override also recolours every other `--color-focus-sketch` consumer, which is declared.
- **Row 2: T9-B29, HEAD | sized**, on 9×9 (`mintSudoku(3)`), cell 0 focused. The one variable is the ring's `d`.
- I looked at the composite. At this scale the three inks differ by hue and weight only; C reads darkest. HEAD's 9×9 ring lies on the frame rule's left side, and `sized`'s sits inset and crumpled.
- **Headroom.** `check-evidence-policy` PASS, exit 0. At the shot, the w7 PNGs totalled **1,998,833 B / 2,097,152 B** (101 files), including this frame.

## 5 · INTAKE-22 row 44 (glyph-pop, `.info-btn .info-glyph`, DPR 2, PRM, 1280×800 fine)

| state | chromium light | chromium dark | webkit light | webkit dark |
|---|---|---|---|---|
| rest (lane = control) | **2.510 RED** | **4.697 GREEN, exit 3** (HEAD12/TAIL12 GREEN 4.743) | **2.872 RED** | **4.368 RED** |
| open (lane) | 5.727, exit 3 | 11.66, exit 3 | G4/G3 red | G4/G3 red |

In the open state, FAINT30, FADE65, MID20, TAIL35 and EMPTY each red where their clause applies. HEAD12 and TAIL12 are the two that stay GREEN on the one-glyph 'i'.

## 6 · Measurements beside the rows

- **The whole spec file** (`focus-ring.spec.ts`, 16 rows × both engines = 32):
  - lane :4238, spec `6ba3463c`: **32 passed, EXIT 0** (5.0 m, load 39–63);
  - control :4251 (`index-CubiZsMVSwTc.js`): **28 failed / 4 passed, EXIT 1**. Green there: G-LIVE-17 (a guard) and G-LIVE-22 (a return to HEAD reds nothing). Every other row reds for its named reason; G-LIVE-23 reds on "`.focus-ring` matches 0 elements" (the control has no drawn ring).
  - Earlier whole-file runs on intermediate shas: 61 passed / 3 failed (G-LIVE-16 webkit, before the grid-hide), 31/1, and 63/63 in a ×2 run that was killed externally (incident 1).
- **G-LIVE-16 ×3**, both engines, on the final sha: **24/24**.
- **DPR 2 thickness** (`dpr2-probe.mjs`, lane dist):
  - info-btn clean: depth 2.50–2.51; THIN_1PX 1.17, RED B3 all sides.
  - tier 2 clean: 3.85–3.97; THIN_1PX red on the left only (gap 5).
- **Hz** (`hz/p6-hz.probe.ts`, lane dist vs control): the pose sequence **1,2,3,0** at ~125 ms steps under the 60 Hz shim, the driven clock and the native clock, both engines. Control: **0 writes** everywhere.
  - The clocks read off-nominal under load (webkit 60-shim 83.3 Hz; driven 62.5–101 Hz). They are printed only.
- **Filter census**: light 12/12, lane and control; dark 4 failed / 8 passed on both (row 10).
- **check-property-block**: source 0 and served 0 on lane and control.
- **Dist identity and CSS**: `dist-final` = a clean copy build (`diff -rq` 0). Against the control's CSS: 19 tree-only product rules and 11 control-only. There are 0 `outline-ring` and 0 `color-ring` rules.
- **vitest** (chunked, bare):

  | suite | tree | control |
  |---|---|---|
  | composables | 3 files / 16 | 3 / 16 |
  | games | 57 / 743 | 57 / 741 |
  | pencil | 9 / 77 | 8 / 73 |

  All exit 0. `src/lib` has no tests and exits 1 on both.
- **vue-tsc -b**: 0 on the tree and on the control.

## 7 · Pre-return battery (bare; tree = the final tree · control = `git archive 74a2b5d9` with `.github`)

| gate | tree | control |
|---|---|---|
| the whole spec file, both engines | **0** (32/32) | 1 (28 failed / 4 passed) |
| lint:lanes | 0 | 0 (the first read exited 2 because the archive lacked `.github`; re-archived, 0) |
| lint:theme-tokens | 0 | 0 |
| lint:sleep | 0 | 0 |
| lint:copy | 0 | 0 |
| lint:motion | 0 | 0 |
| lint:ink | 0 | 0 |
| lint:bands · lint:verbs | 1 · 1 (not on this tree; they land from VERB/LADDER) | 1 · 1 (not on `74a2b5d9`) |
| test:e2e:projects | **1** (floor band, gap 6) | 0 |
| `npm run lint` (prettier) | 0 | 0 |
| `eslint .` | 0, **0 warnings** | 0, 0 warnings |
| knip | 0 | 0 |
| typecheck:e2e | 0 | 0 |
| check-property-block source · `--dist` | 0 · 0 | 0 · 0 |
| undefined-token census (pass-6 copy) | 1 (2 bare + 1 STALE, row 10) | 1 (the same STALE) |
| vue-tsc -b | 0 | 0 |

## 8 · Instruments and their import paths

- **Product imports** (relative, no `docs/` path):
  - `e2e/focus-ring.spec.ts` loads `./lib/edge-bands.mjs` and `../scripts/shape-census.mjs` through `import(new URL(rel, import.meta.url))`.
  - It also imports `../src/pencil/config/pencilConfig` (for `BOIL_CONFIG`, `RING_GEOMETRY`).
  - Row 44 runs `node e2e/lib/glyph-pop.mjs` from the tree's `web/frontend` (`instruments/row44.sh`).
  - The homes' `e2e/lib/{paint-lib,postpaint,rest-probes}.mjs` ride the bank unchanged.
- **Scratch probes** (copied to `instruments/`): `shoot8.mjs` (the composite), `cell0p.mjs` / `cell0n.mjs` (cell-0 reduce / no-preference ×6), `breath-probe.mjs`, `bake-probe.mjs`, `dpr2-probe.mjs`, `thin-probe.mjs`, `row44.sh`, `hz.sh` + `hz/`, `plants8.py` + `plantbat8.sh`, `lintbat.sh`, `unit.sh`, `final.sh` / `final2.sh`, `regimes.py` / `regtab.py`, `cssdiff.py`, `pw.*.mjs`.
- **The battery's two census scripts** are read from `pass6/instruments/` by absolute path, in the scratch battery only, never from product code.
- **Logs** are in `logs/`.

## 9 · Bank, replay route, incidents, moved rows

**Bank** (`BANKED.txt`):
- **Diff:** `pass8.diff`, **502,279 B**, sha1 `3ca99e70b0b0a7fb3c3ad7567a363cb361aed383`.
- **Shortstat:** 30 files changed, +9,780/−179.
- **Tree:** `8f19557d4fe384bbf15b21c01f65f19754d87e31`.
- **Cut:** through a temporary index copied from the worktree's own, product paths under `web/frontend` only, `--binary`.
- **Apply check:** `git apply --check` on a fresh `git archive 74a2b5d9`: **exit 0**.
- **Delta on the pass7+homes tree `a49469ea`:** `pass8.delta.on-p7homes.diff`, **78,572 B**, sha1 `4501d42b…`, 6 files +634/−240, apply-check **0**.
- The tree's `git status`: product files only: 21 modified and 5 untracked entries (`e2e/focus-ring.spec.ts`, `e2e/lib/` with its five `.mjs`, `scripts/shape-census.mjs`, `FocusRing.vue`, `gridPaths.test.ts`).

**Replay route.** IN PLACE, and nothing was replayed. The homes (`pass8/instruments/homes.diff`) were already applied on the tree (tree `a49469ea` = 74a2b5d9 + pass7 + homes). The dead attempt's hunks were read and kept (preamble). This run's own edits were:
- `index.css`: the comment re-spelled and `--color-ring` ×2 deleted.
- `DarkModeToggle.vue`: the comment re-spelled.
- `focus-ring.spec.ts`: the `docSettled` rest streak, G-LIVE-16's ground and ink-OFF, the control comment "16–20 under", and the import of `BOIL_CONFIG`.

Nothing was reverted.

**Incidents.**
1. **External kill.** At ~16:46, my lane dev server and the ×2 spec run (`spec-b`) were killed from outside (exit 144), with 63/63 completed tests passed. I restarted the server with a recorded PID. The final record run is separate.
2. **An edit during a running battery.** `index.css` was edited during `spec-b`. The spec was edited during the clause-sabotage battery, which crashed the first B4 run ("Execution context destroyed"). B4 was re-run, and every reading here is from runs that started after the last edit.
3. **The plant battery for G-LIVE-19/21/4 ran at spec `ccfbdb3e`** (gap 8). The G-LIVE-16/23 plants were re-run at the final sha.
4. **Stray and tooling errors.**
   - A stray `/tmp/null` was written once, and moved to the scratch trash.
   - The first bank re-cut used a fresh temporary index, which listed a `docs/precepts` deletion. That index went to the trash, and the bank was re-cut from a copy of the worktree's own index.
   - Also: the DPR 2 probe first aimed at the dev-only tuner-toggle on the dist (switched to info-btn), and a zsh `=====` echo, an unquoted heredoc and an lsof parse error were each fixed. None moved a reading.
5. **No `rm`.** Discards went to `<scratchpad>/trash-mrklive8-1/` (the dead attempt's PNG, instruments and logs; the bad index).
6. **Servers were killed by recorded PID after a cwd check.** These were: the lane dev (69288), the final-dist preview (98750/98899), the plant copy (16104/16231), all on :4238, and the control preview (51354/51405) on :4251. The earlier sized and copy servers were stopped the same way. Both ports were empty at return. The listener on :4244 is not mine and was left alone. No git ran in the control tree. Nothing was committed, pushed, stashed, installed or deployed.

**Moved rows.** None. R6 law 39's form list stays MOVED on this tree, as since pass 4 (the chair's row). No instrument's subject moved. The homes' instruments are imported unchanged.

**INTAKE-22 §7:** row 44 **OPEN** (gap 3). **INTAKE-23 §4:** row 37 is **the fold's**.

## 10 · Leader's line (§4)

The marks' number is the critic's. The T9-B8 composite is §4. The regime table is §1a. The cell-0 admissions are §1b.
