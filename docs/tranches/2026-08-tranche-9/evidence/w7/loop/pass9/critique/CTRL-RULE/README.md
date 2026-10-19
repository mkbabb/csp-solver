# PASS 9 · CTRL-RULE · the ruled page — adversarial critique

Critic lane `crit-CTRL-RULE`. Work tree served on `:4231`, the shared control (`w7-control`, `74a2b5d9`,
`index-CubiZsMVSwTc.js`) on `:4255`; both listeners started by this lane, PIDs recorded, killed by PID at close.
Every reading below was taken by this critic unless it is marked *lane's*. The number is this critic's.

## 1 · Identity and bank (re-derived)

| check | result |
|---|---|
| lane tree's temporary-index diff vs `74a2b5d9` (critic's own `GIT_INDEX_FILE`) | write-tree `d3a9e60f`, 820,057 B, sha1 `38c952dc…`, `47 files changed, 13473(+), 1235(−)`; **`cmp` = pass9.diff byte-for-byte** |
| file set vs `pass8.diff` | +6 paths, all homes v2's `.d.mts` declarations; 0 paths dropped |
| homes v2 (`pass9/instruments/homes.diff`) | sha1 `1f70cfda…` = README's; its 13 paths are the only home paths in the bank |
| `pass9.delta.diff` (lane-only move) | 4 files: `e2e/zone-grammar.spec.ts`, `App.vue`, `ConfirmRibbon.vue`, `RuledLine.vue`; **no home path** (no residual home edit) |
| `pass9.delta.on-WAVE.diff` / `on-s10` | 1 file each (`e2e/zone-grammar.spec.ts`); sha1 `0dba2dfc…` / `01b1d73d…` = BANKED.txt |
| `apply --check` `pass9.diff` on a fresh `git archive 74a2b5d9` (critic's scratch, no repo above it) | **0** |
| `apply --check` `pass9.delta.on-WAVE.diff` on `74a2b5d9 + WAVE.diff` (write-tree **`acb9c08e`** re-derived) | **0**; and **0** on WAVE + `homes.on-WAVE.diff` (it touches no home path) |
| `apply --check` `pass9.delta.on-s10.diff` on `74a2b5d9 + s10.diff` | **0** (write-tree `a15da8e6`: the gitlink-only difference from `7d2b1fdc` that `pass8/integrate/WAVE.md` §5 already declares) |
| grep of all five banks for `scratchpad`, `/private/tmp`, `/tmp/`, `.claude/t9-scratch`; `+++`/`---` dot-paths | 0 / 0 |
| `e2e/zone-grammar.spec.ts` imports | `./lib/edge-bands.mjs`, `./lib/glyph-pop.mjs`, `../scripts/shape-census.mjs`; no `docs/` import |
| clean out-of-tree build (`git archive` + `pass9.diff` + a `git init` marker, private cacheDir) | **`index-Dlhfy8_pqUkL.js`** = the lane's clean build hash, reproduced |

The batch gate (every bank 0 on `74a2b5d9` and on the pass-8 WAVE) is **MET**.

## 2 · Row 28 — the critic's own plants (class, not the lane's plant list)

The source arm's read set is `padding-bottom`, `padding-block-end`, `padding-block` (pads) and `margin-bottom`,
`margin-block-end`, `margin-block`, `bottom`, `inset-block-end`, `inset-block` (displacements), element-keyed on
`#card-foot`. Six critic plants the lane never named, each appended to the plant tree's `scene.css` (the shipped
scoped file, so specificity and order equal the shipped rule's), source arm run bare from that tree (chromium
project, browserless row `row 28 · source`), exit read from the file the run wrote:

| plant (critic's) | what it does under a 34 inset | source arm exit | reason printed |
|---|---|---|---|
| N0 none (negative control, same run set) | — | **0** GREEN | — |
| N3 `padding-bottom: calc(.15rem + min(env(), 10px))` | inset capped at 10 | **1** RED | `Δ 10 ≠ 34 (2.4 @0 / 12.4 @34)` ×8 regimes |
| N4 `calc(.15rem + env(…, 0px) * .97)` | Δ 32.98 (threshold, novel spelling + fallback) | **1** RED | `Δ 32.98 ≠ 34` ×8 |
| N7 `position: relative; inset: auto auto calc(-1*env()) auto` | the `inset` shorthand drops the foot 34 | **1** RED | `displaces the foot: 0 @0 / -34 @34` ×8 |
| N1 `translate: 0 env(safe-area-inset-bottom)` | the foot sinks 34 into the inset | **0 GREEN — blind** | `translate` is not in the read set |
| N6 `position: relative; top: env(safe-area-inset-bottom)` on the foot | the foot sinks 34 | **0 GREEN — blind** | `top` is not in the read set (`bottom` is) |
| N2 `.card-foot > * { position: relative; top: env() }` | the verbs sink 34 inside the pad | **0 GREEN — blind** | element-keyed on the foot; its children are not read |

So the source arm is a **sufficient** reader of pad arithmetic (N3/N4/N7 red with the right reason) but **not a
class gate for displacement**: three of six novel displacements read GREEN. Whether the row closes its class
therefore rests on the paint arm (synthetic 34, both engines) catching N1/N2/N6 — §3.

## 4 · The lane's rows re-run bare by the critic (tree `:4231` clean build `index-Dlhfy8_pqUkL.js`)

`-g "row 28|T9-M18|hover's reach has ONE writer"`, both projects, exit read from the file the run wrote: **EXIT 1 —
15 passed, 1 failed**. The failure is the WebKit copy of `row 28 · paint under a real inset (chromium CDP)`,
`browserContext.newPage: Test timeout of 30000ms exceeded while setting up "page"` — the run OPENED at 1-min load
70.21 and the box surged to **640.39** mid-run (a foreign/sibling surge: crowdstrike, VS Code, Discord, a
simulator, other lanes' chromium). It is the row that skips in WebKit, so it is an infrastructure red, re-run
under the gate in §5. The run is not a timing row.

Reproduced to the hundredth (chromium, same run): served pad `2.4px @0`, `36.4px @34`; flat lowest ink 840.5,
clears 3.5; CDP 34 ink 806.5 clears 3.5 = synthetic 34 at CDP 0 (806.5, 3.5); `max()` clears 1; K1b/K13b/K14
clear −30.5. M18 shipped quarters `thick` 3.005–3.023 css (1280f light chromium), alpha 0.679, core 5.236 L /
6.014 D. W087 margin −0.188/−0.195, W093 +0.053/+0.063. **The sole-catcher matrix reproduces the lane's** cell for
cell: weight sole on W087 8/8 and W055 6/8; floor sole on MASK81 6/8 (absent in chromium 390c L and D); alpha
(INK60) and chain (ANC89) sole in the 4 DARK cells only, 0/4 light. The charter asked 10 plants × 4 cells × 2
engines; the matrix is 7 plants (the lane's count, stated).

**The reach ceiling, anchored on the control by the critic** (the lane's gap): the ONE library's `tokenSites`
on `git archive 74a2b5d9` + homes v2 reads **14 unresolved, 0 writers** (HEAD writes no `--toggle-reach`); on the
tree 14 unresolved + 1 writer `src/assets/index.css:174`. The ceiling 14 is the control's count, so the source
comment's "control-anchored" now holds by this reading; the lane's gap is closed by the critic, not by the lane.

**Battery rows, bare, on a second clean extraction** (`git archive 74a2b5d9` + `pass9.diff`, a `git init` marker,
no critic file in it): `lint:copy` (M16 self-test) 0 · prettier on the 4 moved files 0 · `eslint --max-warnings
0` on the 4 moved files 0 · `typecheck:e2e` 0 · `shape-census --self-test` 0 (136/136, 83/83 clauses planted).
Box 1-min load 245–266 across these (browserless; none a timing row).

**The served class set vs the shared control** (critic's own extraction of every `.class` token in `dist/assets/*.css`):
tree 464 vs control 458; +23 tree-only tokens, all the family's component classes and their pseudo forms
(`.rp-name`, `.ruled-line`, `.confirm-*`, `.card-foot`, …); −17 control-only (the centre's re-cut: `.zone-row*`,
`.washi-tag:hover`, `.gap-1`, …). **`.antialiased` and `.inline-flex` absent: the T9-R6 cure reproduces.**

## 5 · Independent re-derivations (critic's own probe, not the lane's readers)

Probe: `crit-rule-probe.spec.ts` in the critic's scratch tree (never banked). (a) M18 weight: per device column,
Σ over rows of min(1, |on − off| / p98) ÷ DPR, the median over the middle 60 % of columns (not per quarter), the
rule hidden by `visibility` for OFF. (b) Row 28: the critic's own CSS route rewriting
`env(safe-area-inset-bottom[, fb])` to `${inset}px` before load (fresh context per inset), reading computed
`padding-bottom` and `padding-block-end`, the foot box, and the lowest descendant BOX (geometry, a different
reader from the lane's paint diff). Opened at 1-min load 182.56 (the driver waits for < 200).

**(a) chromium** (DPR 1, PRM):

| cell | shipped | 0.55× (1.65) | 0.87× (2.61) | 0.93× (2.79) | 1.1× (3.3) |
|---|---|---|---|---|---|
| 1280f light / dark | **3.028 / 3.016** | 1.545 / 1.527 | 2.545 / 2.527 | 2.814 / 2.798 | 3.303 / 3.302 |
| 390c light / dark | **3.034 / 3.023** | 1.779 / 1.767 | **2.759 / 2.744** | 2.772 / 2.752 | 3.290 / 3.279 |

The shipped weight (3.02–3.03 css against authored 3) and the 0.55× loss re-derive. **But at 390c the bound − ε
plant reads 2.759 / 2.744 by this statistic — ABOVE the 2.70 floor — and is indistinguishable from bound + ε
(2.772 / 2.752).** The lane's per-quarter median reads 2.512 there (RED by −0.188). The p10 of the critic's
columns (2.524 / 2.504) agrees with the lane's number, so the 390c column distribution is bimodal (the X-stretched
wobble) and the ±ε bracket's verdict at 390c belongs to the STATISTIC, not to the ink. At 1280f both statistics
agree (2.545 vs 2.512 RED; 2.814 vs 2.753 GREEN). Finding: the threshold battery is honest at 1280f and
statistic-dependent at 390c.

**(b) chromium**: inset 34 → pad `36.4px` (`padding-block-end` 36.4px), lowest box 807.61, inset line 810,
clears **2.39** by box; inset 0 → pad `2.4px`, lowest box 841.61, clears 2.39. The lane's 36.4 / 2.4 re-derive by a
different route; the lane's painted ink (806.5 / 840.5) sits 1.11 inside the box, as ink should.

**(a) WebKit** (same probe, same run, EXIT 0, 12 passed): shipped **3.000 / 3.008** at both cells; 0.55× 1.651 /
1.659; 0.87× **2.610 / 2.612** (RED vs 2.70 at both cells); 0.93× 2.788–2.798; 1.1× 3.301–3.310. WebKit paints the
stroke linearly to the thousandth at both cells, so its ±ε bracket is honest by any statistic; the
statistic-dependence is chromium-390c's alone.

**(b) WebKit**: inset 0 → pad `2.4px`, lowest box 841.5, clears 2.50; synthetic 34 → pad `36.400002px`
(`padding-block-end` the same), lowest box 807.5, clears **2.50** against the line at 810. Row 28's shipped pad
re-derives in BOTH engines by the critic's own route (the critic's route is the same species as the lane's
SYNTH_ROUTE — a served-bytes rewrite — so it inherits gap: no real WebKit `env()` is exercised).

## 6 · The frames, LOOKED AT (B13(b) pair, `pass7/prototype/CTRL-RULE/frames/p7-b13b-…-{light,dark}-…png`)

One payload, both themes, chromium 390×844c DPR 2, scrolled to end. What the critic sees that the caption does
not say as a VARIABLE:
- **A sixth variable: the names' ink.** The left's margin names are the muted voice (grey on paper, light-grey on
  slate); the right's headings are full ink. The caption books it as a COST ("the names' painted contrast
  4.659 L / 7.681 D") and the lane's own row 5 flips it by one const (`--color-pencil-graphite` at full), so it is a
  const-flippable variable and P7 §C wants it named as one, not only priced.
- **Both arms are stale, not only the right.** The left is pass 7's ruled page (`index-DhyGcaFHh9QU.js`); the bank
  being balloted is pass 9's (`index-Dlhfy8_pqUkL.js`, 47 files, pass 8 moved 41). The caption declares the right
  arm's staleness and is silent on the left's.
- Visible on the left in both themes: a blank band of ~45 css between `players`' rule and the foot's rule (two
  rules with nothing between, at scroll end), and `Center` wrapped onto its own line under `marks` (the marks
  chips' wrap at 390c the lane lists UNREAD in row 8 is on the ballot frame).
- Headroom spent this pass: 0 B (no crop), consistent with the lane.

## 3 · Row 28 — the paint arm against the critic's source-blind plants (both engines)

Each plant built into its own dist from the plant tree (`scene.css` + the plant, bytes grepped in the built CSS:
`translate:0 env(safe-area-inset-bottom)`, `top:env(safe-area-inset-bottom);position:relative`, `.card-foot[data-v]>*{top:env(…)}`),
served alone on `:4231`, the lane's `row 28 · behaviour` row and the critic's probe run from the planted tree.
Every row opened under the driver's < 200 gate (loads 164.87 / 132.15 / 112.71); every server killed by its PID
after a cwd check.

| plant | lane's behaviour row, chromium · WebKit | its reason | critic's box probe @34 |
|---|---|---|---|
| N1 `translate: 0 env()` | **RED · RED** (EXIT 1) | synthetic 34: ink 840.5, `clears −30.5` (`Expected ≥ 2`) | foot bottom 878 / 877.89, box clears −31.61 / −31.50 |
| N6 foot `top: env()` | **RED · RED** | clears −30.5 both | — |
| N2 children `top: env()` | **RED · RED** | clears −30.5 both | box clears −31.61 / −31.50 |

Flat phone (inset 0) stays 2.4 / 840.5 / 3.5 under every plant (the plants are inset-only, as designed). **Row 28
closes at its class by DISJUNCTION**: the source and served arms are exact for pad arithmetic (N3, N4, N7 red with the
right reason) and blind to `translate`, `top` and the children; the synthetic-34 paint arm catches all three in both
engines. The read set is narrower than "every site that may displace the foot", so the class holds on the paint arm
alone for those three species. Stated, not a deduction. The remaining hole is the one the lane names: the inset is
a served-bytes rewrite, so no real WebKit `env()` and no real iOS (M19).

The lane's WebKit CDP row (`paint under a real inset`) re-run alone at load 50.13: **EXIT 0, 1 skipped** (it skips
in WebKit by design); the critic's §4 red was the load-640 infrastructure timeout.
On the WAVE union (`acb9c08e` + `homes.on-WAVE.diff` + `pass9.delta.on-WAVE.diff`, the critic's tree) the source
arm reads **3 sites / 0 bad, EXIT 0**: the lane's WAVE number reproduced.

## 7 · M18's weight clause cites its own subject: the class is OPEN (critic's plant N5)

`RULE_AUTHORED` is READ from `RuledLine.vue`'s sheet, and the weight floor is `0.9 × RULE_AUTHORED`. So a thinner
stroke **authored in source** moves the floor with it. Plant N5: `RuledLine.vue:113` `stroke-width: 3;` →
`stroke-width: 1.65;` (the 0.55× of the pass-8 critic's hole, `od -c` verified), built, served alone, the lane's
`T9-M18` rows run from the planted tree (so `RULE_AUTHORED` = 1.65, floor 1.485), opened at load 90.67:

| cell | painted thick (quarters) | the SHIPPED clause set | the test |
|---|---|---|---|
| chromium 1280f light | 1.516–1.753 | **GREEN** | red only later, at the bound+ε plant's bookkeeping (`W093 … ["floor"]`) |
| chromium 1280f dark | 1.505–1.747 | **GREEN** | **PASSES whole** |
| chromium 390c light / dark | 1.696–1.958 | RED (core 2.571 / floor) | RED |
| WebKit 1280f light | 1.656–1.660 | **GREEN** | red only at `W093` bookkeeping |
| WebKit 1280f dark | 1.642–1.653 | **GREEN** | **PASSES whole** |
| WebKit 390c light | 1.656–1.660 | **GREEN** | red only at `W093` bookkeeping |
| WebKit 390c dark | 1.642–1.653 | **GREEN** | red only at `alpha is INK60's sole catcher` bookkeeping |

**A 0.55× stroke shipped in source holds the gate's shipped clauses in 6/8 cells and passes the whole test in 2/8**
— the pass-8 critic's "0.55× HOLDS 6/8", re-opened through the authored value. The lane's W055/W087/W093 plants
are `!important` CSS overrides that leave `RULE_AUTHORED` at 3, so they bite; the class (the rule painted too thin)
is not cured — registry-v8 §2.12's class law, and the checklist's spec-cites-itself row. The cure is one line: pin
the authored reference to the derivation `RuledLine.vue:20–27` already states ("the thinnest stroke that clears
every phase in both engines is 3") — `floor = 0.9 × max(RULE_AUTHORED, 3)` or `expect(RULE_AUTHORED).toBe(3)` — with
N5 as its born-RED. Ruling 7 binds the floor to the authored width; it does not license the authored width to fall.

Also (§5): at chromium 390c the ±ε bracket (2.61 vs 2.79) is resolved by the lane's per-quarter median and not by
the critic's whole-span median (2.759 vs 2.772, both above 2.70); the bracket is statistic-dependent in that one
cell and honest in the other seven.

## 8 · The chair's picks, the grafts, and ruling 7 read against the weight clause

| pick / graft | critic's reading | met? |
|---|---|---|
| withdraw the class-ternary duplicate (TAPE owns it) | `class-ternary` appears 0× in `pass9.delta.diff`, 0× in `pass9.delta.on-WAVE.diff`; its 8 hits in the cumulative `pass9.diff` are all inside homes v2's `scripts/shape-census.mjs` (TAPE's one clause, RULE's plant grafted as its second plant: "one clause, two plants") | **MET** |
| the centre stays off the fold (B13) | `pass9.delta.on-WAVE.diff` and `on-s10` each touch ONE path, `e2e/zone-grammar.spec.ts`; no RuledGroup / `--rp-margin` / scene re-cut rides either | **MET** |
| TAPE graft: `pressDestructive` on every Solve press | the spec presses no Solve (0 `solve` presses in `zone-grammar.spec.ts`), so the graft is vacuous here, not taken | n/a |
| FACE graft: the per-band forced-colours row for the drawn rules | 0 `forced` hits in the spec; no forced-colours row for `svg.ruled-line` exists on the tree | **NOT TAKEN** (gap) |
| FACE graft: the solid ring on the ruled page's controls | lives in the B13 centre (off the fold); not re-read by the critic | carried |

**Ruling 7 is mis-cited by the weight clause.** The lane books its floor as "ruling 7's 0.9 × authored". Ruling 7
grants the authored-width floor ONLY at sites on SELF's named roster of drawn frames (HandDrawnOutline on the wells
and both head sheets) and says *every other edge keeps the law's 1.80*. `RuledLine.vue`'s rule is not on that
roster. So the rule's lawful floor is either the charter's 0.9 × authored with the authored width PINNED (the
derivation `RuledLine.vue:20–27` states: 3), or the law's 1.80 at DPR 1. Either catches N5 (§7): its painted
thick at 1280f is 1.505–1.753 chromium and 1.642–1.660 WebKit, below 1.80 in every 1280f cell. As shipped, the
clause reads `RULE_AUTHORED` from the subject's own source (`zone-grammar.spec.ts:1645–1655`, via the ONE library's
`elementSites`), so a source-authored thin stroke moves the floor with it: spec-cites-itself, the class OPEN.

## 9 · The constraints

| constraint | critic's reading | verdict |
|---|---|---|
| π vs `74a2b5d9` | pass 9's product move is three comment re-spellings (`App.vue`, `RuledLine.vue`, `ConfirmRibbon.vue`). Its one served effect is removing the comment-minted `.antialiased` and `.inline-flex` rules; no template, `index.html` or script names either class (grep of `src/` + `index.html`: only `display: inline-flex` declarations), so both rules were dead and their removal moves no pixel. The B13 centre's π against HEAD is pass 8's, unchanged, and stays the ballot's cost | no new pixel |
| filterBudget 9 | `filterBudget.ts` byte-identical to the control's (`cmp`). The filter census (`playwright-throttle.config.ts` projects `filter-census-{chromium,webkit}`, server stripped, base URL external), run bare by the critic, light only: **tree :4231 chromium 0 (6/6) · WebKit 0 (6/6); control :4255 chromium 0 (6/6) · WebKit 0 (6/6)**. Opened at load 15.04 / 17.50 / 30.78 / 40.83 (counts, not a timing row). The DARK census on the union stays UNREAD (the lane's and this critic's) | held (light) |
| M16 | `lint:copy` self-test 0 on the critic's clean extraction (§4); lane 0\|0 | held |
| AA from painted bytes | rule ink re-derived (§4: alpha 0.679, core 5.236 L / 6.014 D chromium). The names' painted AA is pass 8's written loss (4.659 L / 7.681 D); the deeper rung is a probe and not shipped; the 1280f cell is not GATED | loss stands |
| the @property law | pass 9 adds no product `@property` or `registerProperty`; its 3 `@property` hits in the bank are homes v2's census clauses. Clause 3 AMBER is carried, not re-read | carried |
| the ballot pair on one payload | B13(b) pair is one payload, one engine, both themes (§6), but it shows a sixth variable the caption prices and does not name, and both arms are stale identities | OPEN |

## 10 · Verdict

Rows: **1 CLOSED at its class by disjunction** (the source and served arms evaluate pad arithmetic, and the
synthetic-34 paint arm catches every displacement the read set is blind to, both engines; the inset is a served
rewrite). **2 OPEN at its class**: the weight floor reads its authored reference from the subject's own source, so
a 0.55× stroke authored in `RuledLine.vue` holds the shipped clauses in 6/8 cells and the whole test in 2/8
(plant N5). Ruling 7 does not license that reference for a rule that is off SELF's roster. At chromium 390c the
±ε bracket also flips with the statistic. **3 OPEN**: the caption still hides a sixth variable (the names' ink) and
both arms are stale. **4 CLOSED** (the duplicate is withdrawn, and the on-WAVE and on-s10 deltas apply 0 and read
3 sites / 0 bad on the WAVE). 5 is the ballot's price; 6 is reasoned plus one PROPOSED clause; 7 is CURED and
its ceiling 14 is now control-anchored by this critic; 8 is carried and partly UNREAD.

The charter prices 84 → 87 on rows 1–4 closed at their class. Two of four are closed. **Number: 85 (from 84).**
**Verdict: ADVANCE.** The cure for row 2 is one line plus a born-RED (pin `RULE_AUTHORED` to 3, or floor at
max(0.9 × authored, 1.80), with N5 as its plant). Row 3 needs the caption to name six variables and both arms'
identities.

Servers: `:4231` (the tree) and `:4255` (the control) were started by this critic three times. Each time they were
killed by recorded PID after a cwd check, and both ports were free at return. No git was run on main or in the
control tree, nothing was committed, and nothing was removed with rm.
