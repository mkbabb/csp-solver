# PAL-WALK · pass 9 critique (§11c, the hue walk)

Critic's lane `crit-PAL-WALK`. Ports 4244 (the tree, then the union) and 4232 (the control). No commit, no stash, no install, no
deploy, no git on main or in `w7-control`. Every number below was re-derived by this lane unless it is marked *cited*. The number
is the critic's (LAWS P8 §C).

## Numbers first

| row | the critic's reading | the prototype's claim | verdict |
|---|---|---|---|
| tree at open | cut through a temp index: tree `6ae9ae16`, diff 668,210 B sha1 `3d60f1fc`, 31 files +14,018/−90 | the same | **equal** |
| homes v2 in the tree | `homes.diff` (sha1 `1f70cfda`) applied to `74a2b5d9` → `d17813ba`; all 13 home paths blob-equal in `6ae9ae16` | applied by sha, byte-equal | **equal**, no residual home edit |
| `pass9.diff` apply --check | **0** on `74a2b5d9`; **1** on `acb9c08e` (8 homes "already exist", plus knip.json, check-pw-projects.mjs, index.css, useGameState.ts, HandDrawnGrid.vue) | the same | equal (the on-WAVE delta is the route) |
| `pass9.delta.on-WAVE.diff` | **0** on `acb9c08e`; **0** on `acde977b` (= `acb9c08e` + homes.on-WAVE, reproduced); applied → tree `3e70ad48` | the same | **equal** |
| bank hygiene | both diffs: 0 hits for `scratchpad`, `/private/tmp`, `/tmp/`, `t9-scratch`, `worktrees`; only dot path `.github/workflows/ci.yml` | the same | clean |
| gate 2 all-pairs table | independent Python (`instruments/pairs9.py`, no import from the gate: walk re-implemented, 8-bit paint, OKLab, every pair): every cell of the prototype's table reproduces to 4 places, tree AND union, HEAD too (`readings/pairs9-all-pairs.txt`) | the table | **re-derived** |
| capacity | 2 issued hands; the **third** hand breaks every string, both arms: digit 0.0758/0.0762, ring 0.0528 (day floor 0.075)/0.0510, name 0.0528/0.0513 | 2 | **re-derived** |
| ungated churned cost | digit n=8 8/28 worst 0.0229 (HEAD 0.0602); ring dark n=8 11/28 worst 0.0143, n=16 47/120 worst 0.0057; CHURN_COST gates the NAME only, n=8 and n=16 only (n=5 printed) | "the cost gated" | **partial**: digit and ring costs ride ungated |
| §A painted law, tree, DPR 2 | chromium AND WebKit: nearest house ink **0.0716** (i=112, solver-ink-3) light, **0.0709** (i=0, crayon-rose) dark; exit 0 both; painted peer-vs-peer N=3/5/8/16 = 0.0758/0.0264/0.0229/0.0084 (light), = the Python | 0.0716 / 0.0709 | **re-derived** both engines; margins 0.0016 / 0.0009 |
| §A painted law, **union** (`3e70ad48`), DPR 2 | chromium AND WebKit: **RED, i=57 vs solver-ink-3 ΔE 0.06944**, exit 1 both | RED 0.0694 | **re-derived**: the on-WAVE delta ships red in its own spec |
| §A on the control (`74a2b5d9` archive, dev on :4232) | exit 1 both engines by a **crash** (`s.replace` of undefined: HEAD's `inkFor` has no ring string) | not run | the control's exit is a crash, not a stated red |
| §B ring, tree, DPR 2 | both engines: core medians i=5/6/86/89/95 light 3.599/3.133/3.598/3.591/3.133 (chromium = WebKit); EDGE clean GREEN, THIN_1PX RED, STROKE_OPACITY015 RED, light and dark; exit 0 | GREEN, plants RED | **re-derived**; WebKit light THIN_1PX reds by 0.05 css px (top depth 1.75 < 1.80) |
| π (served CSS vs control dist `index-CubiZsMVSwTc`) | `@property` 42=42, `filter:` 9=9, backdrop 0=0, antialiased 0=0, assets 37=37, no tree-only selector; token diff = the tape's colour (`--color-user-ink` → `--color-peer-name-ink`), its paper (washi gradient over `--color-card`), the band tokens (`--peer-ink-l` .5→.44 / .8→.65, `--peer-ring-l`, `--peer-name-l` added) | the same | **re-derived**; the paper move is ungated (declared) |
| box | one-minute load 50–59 on every browser row; no row above 120 | 25–87 | in law |

## Gaps first (the critic's, each proven on this tree or cited by path)

1. **Watch 2 is NOT closed: gate 2's twelve boundary controls are threshold-vacuous.** Every ±0.005 plant is cut at
   `floor + eps` where `floor` is read off `SEP_STRINGS`, i.e. off `MIN_DE` / `RING_FLOOR` themselves, so the plants move with
   the bound they claim to pin. Plant `RING_FLOOR 0.075 → 0.05` (bytes `od -c`-verified): bare gate **0**, `--self-test` **0**
   (the rows print "reds … at floor 0.05 − 0.005 (planted 0.0443)"). Plant `MIN_DE 0.10 → 0.09`: bare **0**; the self-test
   reds only INCIDENTALLY, through `c2-cost`'s COUNT+ row (fewer pairs fall under 0.09); all ten MIN_DE boundary rows stay GREEN
   at "floor 0.09 − 0.005 (planted 0.0853)". This is LAWS P8 §F's threshold-sabotage class by name, and the exact cut PAL-TIN
   voided in its own gate this pass ("the first cut derived the plants from MIN_DE, so they moved with it … that cut is void",
   `pass9/prototype/PAL-TIN/README.md` Row 3). TIN's pinned re-cut (`instruments/separation-law.into-walk-gate2.pass9.diff`,
   numeric `PIN`s) was banked for this gate and not folded. The chair's batch gate ("watch 2 closed in WALK's gate 2") is unmet.
2. **The law is held for the churn-free prefix, renamed.** `SEP_HANDS = 2` holds TIN's law over hands 0–1: one pair, the first
   two ids a session ever issues. Indices are never reassigned, so a two-player room after one leave-and-join is hands {0, 2},
   {1, 2} or (two churns) {0, 3}: {0, 2} holds (name 0.1339), but {1, 2} breaks every string (name 0.0528 light, digit 0.0758,
   ring 0.0528 by day) and {0, 3} breaks the name at 0.0274 light / 0.0271 dark (re-derived, `pairs9.py`). The charter's row 2 asked
   for the law keyed on the product's capacity (n ≥ 8); the law is keyed on what the walk can hold, and n ≥ 3 is moved to a
   COST row. A parameter fitted to the subject is a knob (LAWS P8 §E), and `c2-cap` gates the knob's value, not the property.
3. **The cost row is self-cited and partial.** `CHURN_COST` is the walk's own n=8/16 reading written back as the bound
   (spec-cites-itself: it can only red a regression, never the loss it records). It gates the NAME string only; the digit
   (n=8 worst 0.0229 vs HEAD 0.0602) and the ring (dark n=16 47/120, worst 0.0057) churned costs ride ungated; TIN's room of
   five is printed, not gated. `COST_EPS` and `CHURN_COST.worst` carry the same relative-plant defect as gap 1 (battery below).
4. **The on-WAVE delta is RED on the union in its own spec, both engines.** §A on `3e70ad48` (acde977b + the delta), DPR 2:
   **i=57 vs `--color-solver-ink-3`, ΔE 0.06944 < 0.07**, chromium and WebKit, exit 1 (`readings/spec-A-union-*.txt`). The
   spec is a local instrument (O-12: CI is browserless), so CI holds only the 12° hue law and the union ships the breach
   silently. On the tree the same floor holds by 0.0016 (light) and 0.0009 (dark). §11c cannot land on the WAVE green this pass.
5. **The 0.07 absolute floor and the capacity bounds in §A have no boundary plants** (`expect(r.nearest.dE) ≥ 0.07`,
   `peerVsPeer["4"] > 0.05`, `["8"] < 0.05`, `["16"] < 0.02`): no bound ± ε control, in-run or filed (LAWS P8 §F).
6. **The control cannot run the spec.** §A on `74a2b5d9` exits 1 by a crash in both engines (HEAD's `inkFor` has no ring
   string: `s.replace` of undefined), so every §A battery row's control exit is a crash, not a stated red.
7. **B-TAPE's comparator is still simulated** (the prototype's gap 8, carried): HEAD's ink laid on THIS tree's label and paper.
   TIN's critic measured the simulated control 0.16–0.21 low on ticked tapes and the real HEAD-on-HEAD control showing pink
   and green LOSSES at chromium DPR 1 dark (registry-v8 row PAL-TIN (6)). The CI pin's (0.80, 0.82] bracket was swept against
   the same comparator; 0.81 was not read.
8. **`at-own` bites by a crash** (`TypeError` in `paintedLab`), not a stated red; the 36-clause battery ran on pre-final bytes
   (sha1 `988c93d2`) and was not re-run on the final gate (*cited*, prototype gaps 9–10; not re-run by this critic either).
9. **§C chromium DPR 2 reds clean on the tree** (four G5 rows at the `i`, 3.37–3.51 vs 4.76, *cited*); DPR 1 13 rung rows
   (CHAIR §11: T9-R8's sibling, does not gate); FADE80 hole at chromium DPR 3 (−0.001); FADE65's 0.001 margin and FADE70v's hole
   stand on the library's G3 slack.
10. **The paper is an ungated π move** (`background: linear-gradient(var(--sheet-washi-neutral) …), var(--color-card)` on the
    tape, re-derived in the served CSS): the 4.374:1 claim is struck honestly, and N2 is named unpinned. Declared, still a
    pixel moved with no gate.
11. **§B's 1 px plant has a 0.05 css px margin in WebKit light** (top depth 1.75 < 1.80; DPR 2): the plant reds, narrowly.
12. **Carried** (prototype gap 7): T9-B-PW7-1 unframed; the census row applied in evidence only; `--color-peer-name-ink`
    inert on every authored cell; kinship r2 and L6 read once; DPR 3 read once.

## Row 1 · fork parity, re-run by the critic (the pass-8 plants FIRST, then the class)

Each plant is a new `src/games/shared/critx_<name>.ts` on its own copy of the tree's `web/frontend` (bytes `od -c`-verified,
`atk/<name>/plant.od` under lane scratch); the gate read BARE, its exit written by the runner (`instruments/atk-crit.py`,
`atk-crit2.py`). Clean copy: bare **0** (255 sources). Load 53–67 throughout.

| plant | shape | gate exit | the row that reds |
|---|---|---|---|
| N3 (pass 8) | `el.attributeStyleMap.set("--color-peer-name-ink", "red")` | **1** | check 4, `script-typed-om` |
| N4 (pass 8) | `document.styleSheets[0].insertRule(".dark { --peer-name-l: 0.5 }")` | **1** | check 4, `script-css-string` |
| N5 (pass 8) | a `<style>`'s `textContent` rule | **1** | check 4, `script-css-string` |
| N12 (pass 8) | `CSSStyleSheet.replaceSync(".dark { --peer-name-l: 0.5 }")` | **1** | check 4, `script-css-string` |
| X1 | Typed OM on the BAND (`CSS.number(0.5)`) | **1** | `script-typed-om` |
| X2 | `insertRule` through a bound alias | **1** | `script-css-string` |
| X3 | `style.append("…rule…")` | **1** | `script-css-string` |
| X4 | async `replace(…)` | **1** | `script-css-string` |
| X5 | `el.style.cssText = "--peer-name-l: 0.5"` | **1** | `script-cssText` |
| X6 | `insertAdjacentHTML("<style>…</style>")` | **1** | `script-css-string` |
| X7 | `setAttribute("style", "--peer-name-l: 0.5")` | **1** | `script-cssText` + `script-css-string` |
| X10 | `setProperty(TOK, "0.5")`, `TOK` a module const | **1** | check 4 |
| X11 | `setProperty(String.fromCharCode(45, 45) + "peer-name-l", …)` | **1** | `script-setProperty-computed` ("unreadable, so red") |
| X12 | `setProperty(["--peer", "name", "l"].join("-"), …)` | **1** | `script-setProperty-computed` |
| **X8** | `insertRule(".dark { " + k + ": 0.5 }")`, `k = "--peer-" + "name-l"` | **0** | none: 256 sources read, 32 computed sites (= clean); not even printed as unresolved |
| **X9** | `replaceSync(`` `.dark { --peer-name-l: ${v} }` ``)`: the token NAME a literal, only the VALUE interpolated | **0** | none: invisible, as X8 |

**The four pass-8 shapes are cured** (N3/N4/N5/N12 RED through the library, each naming the plant's file and line), and seven
siblings red. **The class is not**: a rule held in a TEMPLATE LITERAL whose value is interpolated (X9) and a rule whose
token is a folded concatenation inside `insertRule` (X8) publish the name's band with check 4 GREEN and no unresolved site
printed. X9 is the ordinary way to write a dynamic rule. The asymmetry is the tell: a computed NAME in `setProperty` reds
(X11, X12: "unreadable, so red"), while a computed rule TEXT in `insertRule`/`replaceSync` is read as nothing. By registry-v8 §2.12 (a gate cured for its plants and not its
class is OPEN) row 1 is **not closed**; the cure is the library's string arm (`shape-census.mjs` ~2365, `tok-string-rule`)
reading a template literal's static text around `${…}` holes and folding the concatenated argument of a rule-taking call,
filed as the chair's PROPOSED, not forked here.

## The union, re-derived (`3e70ad48` = `acde977b` + `pass9.delta.on-WAVE.diff`, served dev on :4244)

| row | chromium DPR 2 | WebKit DPR 2 | the prototype's claim |
|---|---|---|---|
| gate bare | **0** (`logs/gate-union-bare`) | — | 0 |
| §A the painted law | **exit 1**: nearest i=57 vs `--color-solver-ink-3` **0.069435** < 0.07 (light; the test stops at its first failed expect, so the dark arm and the 12° rows are UNREAD on the union) | **exit 1**, the same hand, 0.069435 | RED 0.0694 |
| §C the name on the tape | **exit 0**: 24/24 subject rows GREEN; FADE65 48/48 RED (both variants), min G3 margin **0.109** | **exit 0**: 24/24 GREEN; FADE65 48/48 RED (G3 alone), min G3 margin **0.002** | GREEN; 0.109 / 0.002 |
| M16 `check-copy-register` | **0** (tree **0**) | | 0 |

Loads: §A 52.7–53.0 at start; §C 49.1–59.1 (chromium), 59.1–60.4 (WebKit). The union's §A dark arm and its painted-hue rows
are a READ GAP: the spec's first failed `expect` ends the test, so nothing past light §A row 1 is read on the union.

## The tree, re-derived (`6ae9ae16`, archived to lane scratch with a `.git` marker, dev on :4244)

- §A, both engines DPR 2: exit 0; light 0.0716 at i=112, dark 0.0709 at i=0; painted N=2/3/5/8/16 equal to `pairs9.py` to 4 places
  in both engines; AA on every asserted ground ≥ 4.5 (worst dark selection-wash 4.708 at i=115); the tape's digit-string arm
  (ballot, reported) 2.993 dark.
- §B, both engines DPR 2: exit 0; core medians as in the numbers table; EDGE clean depths 2.25–2.69 css px; THIN_1PX 1.38–1.75
  (RED on B3 per band, every band); STROKE_OPACITY015 RED on B2 (1.41–1.54). Every band reports the native input as its
  occluder (`input.cell-native-input.absolute`): the read is through a transparent element, not around it.
- §A on the control (`74a2b5d9`): **crash** in both engines (gap 6).
- §C, chromium DPR 2: **exit 1, 4/24 subject rows RED**, all G5 at glyph 17 `i`: 3.51 / 3.37 / 3.51 / 3.51 < 4.76 (payload
  `…002e`, cells 11/12/14/8, by day); FADE65 48/48 RED, min G3 margin 0.096; FADE80 32/32 RED. Load 64.6 → 59.
- §C, WebKit DPR 2: **exit 0**, 24/24 GREEN; FADE65 48/48 RED on G3 alone, min G3 margin **0.001**. Load 59.3 → 44.6.

## The charter's rows, judged

| # | row | the prototype | the critic |
|---|---|---|---|
| 1 | fork parity | CLOSED | **the four pass-8 shapes CURED** (re-derived); **the class OPEN**: X8 (concatenated rule text) and X9 (template-literal rule, value interpolated) exit 0 |
| 2 | gate 2 on every pair; TIN's law with boundary controls; the churned cost | LANDED; walk fails past 2 | **OPEN**: the law is held for SEP_HANDS = 2 (the prefix, renamed); the twelve boundary controls move with the floor constants (RING_FLOOR 0.05 GREEN); `CHURN_COST.worst` loosened GREEN; the cost names-only; TIN's pinned re-cut not folded. **Watch 2 NOT closed** |
| 3 | the CI pin on the ONE probe | re-stated; N2 unpinned | **PARTIAL**: re-stated; the bracket swept on a simulated comparator; 0.81 unread; N2 unpinned (threshold row below) |
| 4 | §B through the homes | CLOSED | **CLOSED**, re-derived both engines DPR 2 (WebKit light 1 px plant margin 0.05 css px) |
| 5 | the paper's π claim | STRUCK, ungated | **accepted as declared**; the move stays ungated |
| 6 | FADE65 at every cell | CLOSED, 0.001 named | **CLOSED on its terms**, re-derived: tree chromium 48/48 RED (min margin 0.096); union chromium 48/48 (0.109), union WebKit 48/48 (**0.002**) |
| 7 | §C chromium DPR 1 | to the chair | to the chair (CHAIR §11). New and re-derived: **chromium DPR 2 on the tree reds 4/24** (G5 at the `i`, 3.37–3.51 < 4.76, payload `…002e` by day); the same rows read GREEN on the union, where the hue moved 0.5° (181.79 → 182.29): a verdict that flips on half a degree |
| 8 | the clause-sabotage battery | 35/36, LN cured | *cited* (not re-run); `at-own` bites by a crash; the battery predates the final bytes. The critic's threshold battery is new evidence against row 2 |
| 9 | carried | read once | carried |

## Constraints

- **π vs `74a2b5d9`**, served CSS (dist built from the tree in lane scratch, `index-DEQCTfRH3pFD.js`; control dist
  `index-CubiZsMVSwTc.js`, served from `w7-control` on :4232 by `vite preview` and identity-read): scope hashes normalised, the
  only declarations that differ are the tape's colour, its paper and the band tokens (`readings/pi-served-css-tokens.diff`).
  No tree-only selector, so no comment-minted utility (T9-R6) in this bank.
- **filterBudget**: `filter:` declarations 9 = 9; **@property** 42 = 42; **antialiased** 0 = 0; assets 37 = 37.
- **AA from painted bytes**: §A's AA rows ≥ 4.5 on every asserted ground, both engines (the tree); the union's AA rows UNREAD
  (the test ends at §A row 1).
- **M16**: `check-copy-register` 0 on the tree and on the union.
- **The ballot pair on one payload**: no frames this pass (0 of 120,378 B spent); T9-B-PW7-1 stays unframed (carried).
- **Paint rows read on a DEV server** (the spec imports `/src/games/shared/playerIdentity.ts`): every §A/§B/§C reading, the
  prototype's and this critic's, is of vite's dev graph, not the built dist. The π read above is the dist's. Declared.

## The critic's incidents (declared)

1. **The control is not the shared `w7-control` for the spec rows.** The spec imports `/src/…` and needs a dev server; `w7-control`
   ships a pre-built dist, and a dev server there would write into a shared read-only tree. The `74a2b5d9` control for §A is a
   `git archive` in lane scratch (plus `csp-solver/data`, after the first boot failed on the puzzle-bank check), served by vite
   dev on :4232. The `w7-control` preview served :4232 first, for the π read only, and was stopped by its recorded PID.
2. **One foreground `sleep 45`** in an early poll (it ran); a later `sleep 55` was refused by the harness. Waits after that ran
   in the background.
3. **A driver script that used a shell `&`** to start a server was written and moved to the lane's trash unrun.
4. **Servers stopped by recorded PID after a cwd check**: the tree preview and the control preview (:4244/:4232), the tree dev
   server, the union dev server; the second tree dev server is stopped at return (below). No foreign listener was touched.
5. Evidence instruments are filed with the lane path replaced by `<lane-scratch>` and the repo path by `<repo>`.
6. No git ran on main or in `w7-control`. Git in the prototype's worktree was read-only plus temporary indexes under lane
   scratch (`read-tree`, `add -A`, `write-tree`, `apply --cached`, `archive`): `write-tree` and `add` wrote loose objects into the
   shared object store, no ref moved.

## The threshold battery on gate 2 (new this pass; LAWS P8 §F)

Each plant moves ONE bound in `scripts/check-peer-arcs.mjs` on its own copy (`instruments/thr.sh`, `thr-plants.txt`, the
anchor matched exactly once, bytes `od -c`-verified), then the gate runs bare and under `--self-test`, each exit written by the
runner. A bound is PINNED only if moving it reds. Load 50–68 throughout.

| plant | bare | `--self-test` | reading |
|---|---|---|---|
| clean copy | 0 | 0 | 113 rows |
| T1 `MIN_DE` 0.10 → 0.09 | 0 | 1 | reds ONLY through `c2-cost`'s COUNT+ (fewer pairs fall under 0.09, so its plant finds no 12th); all ten MIN_DE boundary rows GREEN at "floor 0.09 − 0.005 (planted 0.0853)": **pinned by accident** |
| **T2 `RING_FLOOR` 0.075 → 0.05** | **0** | **0** | **UNPINNED**: the rows read "reds … at floor 0.05 − 0.005 (planted 0.0443)" |
| T3 `COST_EPS` 0.002 → 0.02 | 0 | 1 | reds only because the relative target goes negative (planted 0.0000): an artefact of a large ε |
| **T4 `CHURN_COST[8].worst` [0.0144, 0.0139] → [0.0044, 0.0039]** | **0** | **0** | **UNPINNED**: "reds … planted 0.0014 against 0.0044 − 0.002" — the boundary plant follows the bound |
| T5 `CHURN_COST[8].under` 11 → 12 | 0 | 1 | pinned through the COUNT+ search failing to find a 13th pair |
| T3b `COST_EPS` 0.002 → 0.006 | **0** | **0** | **UNPINNED**: "planted 0.0072 against 0.0144 − 0.006" |
| T6 `CHURN_COST[16]` deleted | **0** | **0** | **UNPINNED**: no row plants the n=16 cost |
| T7 `NAME_FLOOR` 0.84 → 0.80 | 0 | 1 | **pinned**: A10's literal 0.80 and check 5's literal 0.8 both red |
| T8 `CHURN_COST[16].under` 51 → 60 | **0** | **0** | **UNPINNED** |
| T9 `CHURN_COST[8].worst` dark only, 0.0139 → 0.0039 | **0** | **0** | **UNPINNED**: the plants read the light arm only |

**Six of nine bound moves leave the gate GREEN** (T2, T3b, T4, T6, T8, T9), and two more red only by accident (T1, T3). The
pinned rows are the CI pin (T7) and the n=8 light COUNT (T5). The boundary rows follow the constant they pin, the same
defect the prototype's README calls "12 boundary rows … every one holding" without moving a bound. `readings/threshold-battery.txt`
holds every plant's `od -c`, both exits, the loads, and the rows that moved.

## TIN's hand-over does not apply

`pass9/prototype/PAL-TIN/instruments/separation-law.into-walk-gate2.pass9.diff` (8,046 B), dry-run with `patch` on a copy
of this gate: **4 of 5 hunks FAIL** (`readings/tin-handover-dryrun-on-walk-gate.txt`). TIN cut it on WALK's pass-8 blob
`bb15c9e1`. WALK's gate 2 was re-cut since. Watch 2 needs a hand merge of TIN's numeric `PIN`s into this gate's all-pairs
form. Neither lane has made it.

## The number and the verdict

**80 (pass 8: 85). ADVANCE. Watch 2 is NOT closed.**

**What earned:**
- The pass-8 parity shapes are cured through the library: N3, N4, N5 and N12 RED, plus nine siblings, re-run by the critic.
- §B's private decoder is gone, and the ring reads through `edge-bands` with in-run plants. Re-derived in both engines.
- FADE65 is planted on both payloads at every cell, with its margins named. Re-derived on the tree and the union, both engines.
- The π claim is struck honestly; the served CSS confirms the declared moves and no others.
- The all-pairs table is true to four places against an independent re-derivation, on the tree and the union. Both engines paint
  the same N=2…16 worsts.
- The union's gate reads bare 0 and self-test 113/113.

**What it cost, by the checklist:**
- **Gates that cannot fail (threshold).** Six of nine bound moves on gate 2 stay GREEN, because the boundary controls follow the
  constants they pin. PAL-TIN voided its own first cut for the same defect, and TIN's pinned re-cut does not apply here.
- **The class cure.** X8 and X9 publish the name's band with check 4 GREEN; registry-v8 §2.12 calls that OPEN.
- **Vacuous convergence / a lane-chosen parameter.** The law is held for SEP_HANDS = 2, the churn-free prefix renamed. The cost
  row is the walk's own reading written back as its bound. Only the name is costed, and only n=8 light is planted.
- **The constraint it breaks silently.** The on-WAVE delta reds §A's 0.07 house-ink floor at i=57 (0.06944) in both engines.
  CI is browserless and blind to it. The union's §A dark arm and its hue rows go UNREAD.
- **A verdict on a knife edge.** Chromium DPR 2 §C reds 4/24 on the tree and is GREEN on the union across a 0.5° hue move.
  FADE65's WebKit margin is 0.001 (tree) and 0.002 (union).
- **The control cannot run the spec**: it crashes on `74a2b5d9`. The B-TAPE comparator is still simulated.

**Why ADVANCE and not BANK:** every open row has a named cure that can be cut:
- TIN's numeric PINs, hand-merged into the all-pairs gate, with a plant per CHURN_COST cell and arm.
- The library's string arm reading template-literal and concatenated rule text (filed for the chair, not forked).
- A walk guard or chroma cap that clears i=57 on the union, with §A's 0.07 given a bound ± ε plant.
- The HEAD-on-HEAD comparator from the control.

The capacity of two is a B-TAPE ballot cost for the owner (a separability LOSS against HEAD at every churned room), not a gate
WALK can cure. The batch gate this lane had to meet (watch 2 closed in gate 2) is **unmet**. Earliest 100 is not pass 10 on
this evidence.

## Replay route

1. Bank and homes: build a temp index on `74a2b5d9` in the prototype's worktree, `git add -A`, then `write-tree` → `6ae9ae16`.
   `git diff --cached --binary` is `3d60f1fc`. `homes.diff` applied → `d17813ba`, and its 13 paths blob-equal to `6ae9ae16`.
   `apply --check` `pass9.diff` and the on-WAVE delta on `74a2b5d9`, `acb9c08e` and `acde977b` (index-based).
2. All-pairs: `python3 -I instruments/pairs9.py` (prints the tree, the union and HEAD).
3. Threshold battery: `git archive 6ae9ae16` → `<lane-scratch>/tree`, node_modules symlinked. Then
   `python3 -I instruments/thr-drive.py [names]` (rows in `thr-plants.txt`; each row runs `thr.sh` on its own copy).
4. Attack set: `python3 -I instruments/atk-crit.py`, then `atk-crit2.py`.
5. Browser: put a `.git` marker file in each archive. Run vite dev with a lane cacheDir (`.vite-crit.mts`), the tree or union on
   :4244 and the `74a2b5d9` archive (+ `csp-solver/data`) on :4232. Then `instruments/spec.sh TAG ENGINE DPR URL "§A|§B|§C"`
   (`spec-u.sh` for the union), with the Playwright config copied from the prototype's `pw-walk9.mts`.

