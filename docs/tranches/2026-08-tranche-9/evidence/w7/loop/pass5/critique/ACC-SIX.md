# ACC-SIX: pass-5 critique (adversarial, non-author)

Subject: the tree `.claude/worktrees/wf_f72f3b5a-83a-45` (base `74a2b5d9`, 16 M + 1 ??, +1437/−111)
and its evidence at `pass5/prototype/ACC-SIX/`. π control: `74a2b5d9`, the chair's shared tree
`w7-control` (dist `index-CubiZsMVSwTc.js`, served read-only, never built or git-touched).

**Convergence earned: 80 % (up from 78). Verdict: ADVANCE.**

## 0 · What I did (no number below is quoted from the lane)

- **The pass-5 advance, isolated.** I rebuilt the pass-4 state in scratch (`git archive 74a2b5d9` +
  the chair's `pass4/prototype/ACC-SIX/pass4.diff`, applied clean) and diffed the tree against it.
  Nine files moved. Three carry substance: `GameBoard.vue` (the `2lh` reserve struck; a
  portrait-only token `calc`), `index.css` (the escape byte deleted; the three-ground ledger) and
  the two gates. `filter-census.spec.ts` gains the dark rows, `package.json` wires `--self-test`,
  and the rest is prettier layout.
- **My build.** I built the tree into scratch, outside the tree, with a private cacheDir. It gives
  `index-DP7V76CJwJKu.js` (43 files). The lane's dist 3 was `BMdJ4epg95hr`, and the difference is
  the prettier re-lay after that build. Every browser row below ran on MY dist (:4237) beside the
  control (:4238), with identity checked by asset hash.
- **Payload.** The lane's codec payload (`?board=ATMuNTMw…MDc5`), with the deal read back as
  `dealOk: true` on every arm in every row.
- **Servers.** Lane preview pid 25181 (npx 25126) and control preview pid 25179 (npx 25127), both
  killed by PID. 4237/4238 read free afterwards. My configs live in the scratchpad, never in the
  tree. The tree's `git status` is unchanged (product files only), and its diff stat is identical.
- **Instruments** are in `critique/ACC-SIX/instruments/`:
  - `c5-trace.mjs`: a copy of the lane's `p5-trace.mjs`, re-pointed. It adds a BALANCED arm and the
    byte modes of the ground and stroke per class.
  - `c5-window.mjs`: the arithmetic contrast window.
  - `c5-pi.mjs`: π, the noise arm and the wrap row at four cells.
  - `c5-landwrap.mjs` v2: settled reads, which are what v1's reads showed.
  - `c5-gate-plants.sh`: run on a scratch MIRROR of the tree.
  - `p5-battery.COPY.sh`: the lane's battery, re-run.

  Summaries are in `readings/`; raw JSON stayed in scratch.

## 1 · Re-measured (numbers)

| row | result |
|---|---|
| **Trace, three grounds, differencing** (1280×800, 8 legal writes; chromium + webkit, dpr 1/3; hidden-vs-hidden noise **0 px in all 32 reads**) | Lane (`#8b5cf6`@1): light line **3.072** (webkit dpr3 **3.117**), edge **3.388**, paper **4.062**. Dark (`#7c3aed`@1): line **3.299** (webkit dpr3 3.275), edge **2.575**, paper **3.355**. Control 74a2b5d9: light **2.876–2.946 / 3.170–3.177 / 3.751–3.760**, dark **3.106–3.148 / 2.441 / 3.139**. The grounds are painted flat: light line 49 (48 at webkit dpr3), edge 230,230,228 (2 rows at dpr1: a real 2 px card edge, not a fringe) and paper 251,250,249; dark 199,197,190 / 42,40,39 / 17,15,14. The stroke core paints the byte exactly (139,92,246). **REPRODUCED to the thousandth.** |
| **Sensitivity at k .9** (the same run) | `#8b5cf6` light line: fraction under 3.0 is **.051 / .164** (chromium dpr1/dpr3) and **.046 / .008** (webkit), with worst column **2.876 / 2.866 / 2.876 / 3.043**. REPRODUCED |
| **The BALANCED rung `#8f61f6`@1** (NEW; hue 293.4°, the locked hue, Y .2104, found by `c5-window.mjs`) | light line **3.227** (webkit dpr3 **3.273**), edge **3.226**, paper **3.867**. At k .9: worst column **3.006–3.198**, fraction under 3.0 **0** in all four cells. Both engines, dpr 1/3. It clears the family's 3.10 trigger on all three light grounds; see §2.1 |
| **Dark window** (arithmetic over every sRGB colour in steps of 3, on the painted dark grounds) | best min over line/edge/paper = **2.893** (rgb 33,120,165). **No byte of any hue clears 3.0 on the dark trio.** The dark edge row is geometric; see §2.3 |
| **π, lane vs control, all elements, fill 0 and fill 2** (both engines; control-vs-control **0 paint / 0 moved** in every cell) | **393×699 coarse** (`hasTouch`, coarse witnessed): paint 0. Moved up **−9.09…−9.11**: `.masthead`, `.logo-text`, `.board-wrapper`, the 81 `.sudoku-cell`s, `.drawer-tab`, `.margin-note`. Moved down **+9.09…+9.11**: `.play-controls`, the 4 `.icon-btn`s, `.board-voice`. `.margin-note` is +4.89 (chromium) / +5.11 (webkit) at fill 2. Strip 39.0 vs 20.8. **812×375, 844×390, 1280×800**: 0 at fill 0; at fill 2 only `.margin-note` moves, +14 / +14.2 / +14.25. **REPRODUCED**, and 812×375 is added |
| **Portrait wrap** (393×699, count showing, the lane's emulated voice line) | the 9×9 hint (209.9 px) and a 16×16-width pair (213.7 + 114.7) both wrap on the lane; the strip holds **39.0**, and the controls' top is the same for every voice. The reserve does its job in portrait. REPRODUCED |
| **Landscape wrap** (NEW, 812×375 coarse, settled reads, both engines) | a 16×16-width pair (hint `G goes nowhere else in this column` 225.9 px + count `3 of 170 on the board` 114.7 px in a **343 px** strip) wraps the lane's strip **20.8 → 40.16**; the control's reads **21.97**. Against the control: W2's `.drawer-tab` **+18.19** (253.46 vs 235.27), `.drawer-tab-tongue` and the outline **+9.1**, `.board-voice` **+21.97**, page scrollHeight **414 vs 395**. At 844×390 (358 px) there is no wrap (22.09 both). At 9×9 widths there is no wrap at 812 (21.97 both). See §2.4 |
| **filter-census, whole spec, both projects** | lane: **4 failed / 12 passed, exit 1**; control: **4 failed / 12 passed, exit 1**. Every failure is G3.1d/G3.3d naming `svg.crayon-heart.idle ⟨saturate(0.85)⟩` ×2. The light rows are 12/12 on both, so filterBudget holds at 9 in light. REPRODUCED |
| **Pre-return battery** (the lane's script, re-run) | tree: every gate 0 except `test-e2e-projects` 1 and `check-pw-projects` 1 (check 8: chromium live 237, floor 214; webkit 235/212). Control: all 0. REPRODUCED (the control's `test-font-coverage` 0 is a script with no `--self-test` handling) |
| **Gates bare** | `check-copy-register` 0 on the tree (0 dashes, 0 unadmitted); `check-font-coverage --self-test` 0 (6 red plants, 2 green controls, live discovery true/true, 3 admission plants); `check-theme-tokens --self-test` 0 |
| **Gate break-attempts on a MIRROR** (`c5-gate-plants.sh`; mirror restored identical to the tree) | font census: control `<StagingBand :safe-verb>` **exit 1**. Green on a broken mirror: an alias import `<Band :safe-verb>` **0**, a kebab tag `<staging-band :safe-verb>` **0**, `v-bind="plantedProps"` **0**, unquoted `:safe-verb=planted` **0**, a dynamic `v-bind:[k]` **0**. Law 20: control (panel re-aimed) **exit 1**. Green: `#sparkle-rainbow href="#solver-ink"` with its stops struck **0**; chrome `:stroke="\`url(#${inkId})\`"` **0**; the admitted consumer struck with a comment `// was url(#solver-ink)` **0** |
| **Undefined-token / @property** | every `var()` the diff adds is declared (14 tokens); no `@property` is added; the one `var(--x, fallback)` in the diff sits inside a comment. `--color-answer-ink`/`#9b74f7` survive only in three ledger comment lines |

Not re-run by me: G6 (a dev two-peer room), the count-in-place ablation (closed in pass 4), G8, Arm A.

## 2 · Open gaps

### 2.1 The escape died on a two-point search; a byte that clears exists (NEW)

The lane's rule, restated this pass: mint a rung only if the incumbent reads under 3.10 and the new
rung clears it. The incumbent reads **3.072** on the line, with 100 % of the core under 3.10 and
5–16 % under 3.0 at k .9. The first clause fires. The lane tested ONE candidate (`#9b74f7`, which
overshoots to 2.695 on the edge) and concluded that "`answer-mid` is the ONE arm over 3.0 on all
three grounds".

The window between the line (49) and the edge (230) is real: 0.200 ≤ Y ≤ 0.221. At its centre,
`#8f61f6` paints **3.227–3.273 / 3.226 / 3.867**. Its worst column is 3.006–3.198 at k .9, and 0 %
of its core is under 3.0, in both engines. It beats the shipped incumbent on every figure in the
sensitivity row. Under the family's own rule, the byte is earned; it's just a different byte.

To close: ship it, or ballot it against `#8b5cf6` (one payload, one variable), and strike the
ledger's "the ONE arm" sentence.

### 2.2 T9-B-ACC6-1's second arm is under the floor (NEW)

The ballot offers the owner `#9b74f7`, which paints **2.695** on the card edge, under 1.4.11's 3.0.
An arm that fails the AA constraint should not reach the owner as a choice. Replace it with a
floor-clearing arm, such as §2.1's, and re-shoot c1 on the same payload.

### 2.3 The dark edge (2.575) is geometry, not palette

By arithmetic on the painted dark trio, no colour of any hue exceeds **2.893** as the minimum over
line (199) / edge (44,43,41) / paper (19,18,17). The line and the edge exclude each other:
Y ≤ .157 is needed for the line, and Y ≥ .175 for the edge.

The row can therefore close only by moving the trace off the card's 2 px edge (or casing it),
measured painted. Otherwise T9-B-ACC6-2 arm (b) scopes the claim, with this impossibility number
written into the ledger. The lane's "open, ledgered" leaves out why no rung can ever close it.

### 2.4 The portrait-only reserve leaves W2's landscape cell unreserved (NEW)

At **812×375 coarse**, a count showing plus the widest hint at 16×16 widths wraps the lane's strip
to **40.16 px**, against the control's **21.97**. That moves W2's `.drawer-tab` **+18.19**, the
tongue **+9.1**, and the page's scroll height **+19**, in both engines. This is the pixel the
reserve exists to hold, and the `(orientation: portrait)` predicate gives it up.

Two caveats: the pair is emulated in the voice's own span (the lane's `p5-wrap` method), and the
count is the width of a 16×16 deal. To close: key the reserve on the space (the strip's width
against the pair; LAWS: "a regime is keyed on the space the surface has"), or read it on a real
16×16 payload at 812×375 and declare the π.

### 2.5 The font census is blind to five more Vue-legal shapes (the §2.9(b) class, second pass)

The six enumerated plants red. The class does not: an alias import, a kebab tag, a non-literal
`v-bind`, an unquoted value and a dynamic argument each GREEN a painting binding (exit 0). The
control reds (exit 1). None of these shapes is live on the tree today; I grepped for kebab
component tags, aliased `.vue` imports and non-literal `v-bind`, and found none.

To close:
- Resolve tags through the SFC's import map, and kebab tags to their PascalCase names.
- Red a non-literal `v-bind` or a dynamic argument until it is pinned.
- Land each shape as a plant.

### 2.6 Law 20's url arm has three doors open (second pass on law 20)

Each of these exits 0:
- `href="#solver-ink"` on a stopless gradient. The chrome's sparkle inherits the answer's five
  stops.
- A template literal `url(#${inkId})`. This is the estate's own idiom (`HandwrittenLogo.vue:468`,
  `DarkModeToggle.vue:220/297`).
- A comment that keeps the admitted count after the real consumer is struck. LAWS P4: "strip
  comments before matching a source-text law".

To close: census a gradient `href` to `#solver-ink`, red a dynamic `url(#${…})` on any paint
property (or resolve its id), and strip comments before counting.

### 2.7 Carried open (the lane names them; I confirm)

- **R6 heading census and R3 wobble (row 10)** are unrun for a third pass.
- **G0.** `p5-g0.mjs` was written and not run, and the progressbar contract (valuenow = filled)
  diverges from ACC-FIVE's percent reading. G0 on the payload, with the contract named for the
  fold.
- **The co-landing (row 8).** `DifficultyTally` consumes `poseFronts` without `frontGate`. It is
  stated and unpaid, and the leader's tally rate (134.2/s against a ceiling of ≤62.5/s) rides on it.
- **Arm A (row 9)** is an injected clone. Its glyph occlusion of 0 px² holds only because cells
  72–75 are empty on this deal; price it with a digit written there.
- **Estate, declared:** the `filter-census` dark 4/16 red on both arms (the chair's cure) and
  `check-pw-projects` check 8 (the chair's restamp).
- **The portrait reserve's standing price.** Every portrait phone session pays the 18.2 px column
  redistribution, for a count that shows for three writes once per deal. It is declared, and the
  §7 seating names or refuses it (§6.6). It is not a lane gap.
- **Frames.**
  - `c2` near-duplicates c3's upper arm: 97 % of channels are within 2 levels. It adds 24 KB with
    no new information.
  - There is no dark crop.
  - c1's lower arm is §2.2's sub-floor byte.

## 3 · Closed this pass (verified)

- **π declared, reduced and reproduced.** The phone moves 13.6 → 9.1 px, 844×390 and the desk read
  0 (W2's tab no longer moves at 9×9), and the diff names every selector. The noise arm is 0.
- **The user-ink ledger.** Corrected to 4.640 / 7.696 painted, on the grounds 253,253,252 /
  19,18,17. It agrees with pass 4's critique and with my painted grounds.
- **The escape byte deleted with no alias left.** One consumer, argued. The sensitivity row is
  present and reproduced.
- **The dark filter-census row landed born-RED**, reproduced on both arms.
- **The font census's six pass-4 shapes and the StagingBand pair red.** Break test 1 is the
  lane's; the self-test is real.
- **Law 20's url arm reds the pass-4 bypass on the real panel.**

## 4 · Checklist

| item | verdict |
|---|---|
| vacuous convergence | clear |
| spec-cites-itself | clear (the ledger is re-read painted) |
| gates that cannot fail | **hit ×2**: the font census on 5 shapes (second pass for the class), law 20's url on 3 |
| elegant-reduction trap | **hit**: "the escape died" from one tested candidate (§2.1); the co-landing is stated, not paid |
| legacy aliases | clear (`--color-answer-ink` is gone; only ledger comments remain) |
| masked fallbacks | **hit**: the incumbent ships under the family's own 3.10 trigger because the one escape overshot (§2.1) |
| unverified gestalt | partial: no dark crop; c2 duplicates c3 |
| consumer-less substrate | clear (answer-mid: one consumer, argued) |
| generic default | clear |
| the pixel it moves and did not declare | **hit**: 812×375 at 16×16 widths, W2's tab +18.19 (§2.4) |
| constraints | AA: a ballot arm is under 3.0 (§2.2), and the dark edge can't be met by any byte (§2.3). filterBudget 9 holds in light, both engines; dark is the chair's estate row. M16 0. @property n/a. The undefined-token census is clean. The decided history is PROPOSED only. W2's mechanics: tab moved in 812×375 (§2.4) |

## 5 · Verdict

**ADVANCE at 80.** Two of the four faults that held pass 4 under 80 are closed and reproduced to
the thousandth: the undeclared π and the false ledger sentence. The instrument this pass built
(three-ground differencing with a zero-noise arm) is the best painted-contrast rig in the section.

The other two faults are closed only for their enumerated plants: the font census and law 20 still
green eight broken shapes between them. The pass's centre decision, killing the escape, rests on
one candidate, while the window holds a byte that clears all three light grounds in both engines.
The dark edge is a geometry problem, and nothing in the palette can close it. None of this is a
missing primitive.

## Cross-pollination

- **ACC-FIVE / ACC-GRAPHITE / PAL-\***: search the window, don't test a point. `c5-window.mjs`
  derives the feasible Y band from the painted grounds and names the balanced byte in one pass.
- **Every lane with a ground pair on both sides of the stroke** (a light line beside a dark card
  edge): check feasibility before minting. The dark trio here is infeasible (max 2.893 for ANY
  colour).
- **Every `(orientation: …)` or width predicate**: read the widest board's copy (16×16) at 812×375
  before claiming landscape is safe.
- **Every source-text gate**: resolve component tags through the import map, strip comments, and
  red dynamic ids; a gate that enumerates plants is cured for the plants, not the class.
