# ACC-SIX · pass 9 · CRITIQUE (§3 accent) — the critic's number

Critic `crit-ACC-SIX`, non-author. Base and π control `74a2b5d9` (shared `w7-control`, `index-CubiZsMVSwTc.js`, served by
this critic on `:4250`); the lane's bank built out of tree and served on `:4237`. Every archive, build, log and plant
lives in this critic's durable scratch (never banked). No git ran on main or in the control tree; git ran only in the
prototype's work tree (read-only: `rev-parse`, `archive`, `status`) and as `git apply` inside scratch archives with a
discovery ceiling set. No commit, stash, push, deploy, publish or install.

## 0 · The bank, re-derived

| check | result |
|---|---|
| sha1 `pass9.diff` / `pass9.delta.on-WAVE.diff` / `pass9.delta.on-s13-s7-s3.diff` | `bfb5a658…` / `9b6dbf14…` / `b8741975…` = BANKED.txt; bytes 743,943 / 70,394 / 68,089 = BANKED.txt |
| `git apply --check pass9.diff` on a fresh `git archive 74a2b5d9` | **0** |
| the applied archive vs the live work tree (`wf_f72f3b5a-83a-45`), 38 paths | **0 mismatching**; the tree's only untracked product path is `e2e/lib/` (the homes) |
| `pass9.delta.on-WAVE.diff` on bare WAVE (`74a2b5d9` + `pass8/integrate/WAVE.diff`) | **0** |
| the same on WAVE + `homes.on-WAVE.diff` (= `acde977b`), then applied | **0**, applied; this union built to `index-BGox1KTDMsaa.js` = the lane's served union hash |
| `pass9.delta.on-s13-s7-s3.diff` on bare s13-s7-s3 (`74a2b5d9` + `pass8/integrate/s13-s7-s3.diff`) | **0** (the lane's `002b73c0` base, s13-s7-s3 with its home libs at v2, is the lane's own cut and not re-made) |
| homes v2 by sha: `homes.diff` applied on `74a2b5d9`, its 13 paths vs the tree | **13/13 byte-equal**; residual home edits in `pass9.diff` 0 |
| home paths touched by `pass9.delta.on-WAVE.diff` (vs `homes.on-WAVE.diff`'s 11) | **0** |
| the seed term: `SheetWashiLabel.vue` + `.test.ts` on the tree | **= `74a2b5d9` bytes**; the union's line `:83` is HEAD's `mulberry32(props.seed * 2654435761 + props.text.charCodeAt(0))` |

**Critic's incident 1 (declared).** The first archive pass ran `git apply` inside the critic's durable scratch (an ignored
directory inside the repo) without a discovery ceiling: git found the outer repo and SILENTLY SKIPPED every path outside the
cwd, so `--check` printed 0 vacuously and nothing applied (caught when the applied tree lacked `count-yield.spec.ts`).
The archives were moved to the critic's trash and re-cut with `GIT_CEILING_DIRECTORIES`; every row above is from the
re-cut. The same trap would silently void any lane's in-scratch `apply --check` — a law-sized trap for the record.

## 1 · What pass 9 moved (pass-8 bank → pass-9 bank, product paths)

23 paths differ between `74a2b5d9 + pass8.diff` and `74a2b5d9 + pass9.diff`. **`MarginNote.vue`, `GameBoard.vue`,
`GameControlPanel.vue`, `index.css` and every other §3 product file are byte-identical to pass 8**: the advance is specs
(`count-yield`, `wash-step`, `tally-flash`), the wash reach (`check-theme-tokens.mjs`), the homes (by sha), FIVE's
primitive by sha (`DifficultyTally.vue`, `gridPaths.ts`, `front-rate.spec.ts`, `node.d.ts`, `gridPaths.poseFronts.test.ts`)
and the seed term's return (`SheetWashiLabel.vue` + test back to HEAD). No §3 product byte was cured this pass; gap
rows that need the product (R3 AA, B-TALLY-16, the glow) stand where pass 8 left them.

## 2 · Re-derived on the WAVE union (the batch gate, CHAIR §3) — measurement 1

The union built by the critic from `74a2b5d9 + WAVE.diff + homes.on-WAVE.diff + pass9.delta.on-WAVE.diff` serves
`index-BGox1KTDMsaa.js` (the lane's hash). Bank-5's `count-yield.spec.ts`, out-of-tree config, workers 1.

| row | chromium | webkit |
|---|---|---|
| count-yield on the union (load 61.3 → 56.0 cr · 56.0 → 51.0 wk) | **11/11, exit 0** | **11/11, exit 0** |
| base 4/4: strip at rest 20.8 / 21.98 / 23.63 / 22.09; tab 508.73 / 238.84 / 398.45 / 246.38 (wk 508.42 / 238.98 / 398.16 / 246.53) | 393: never laid; 812, 1280, 844: laid at press 2, **gone at press 3 with a RECORD in every cell**, gone at press 4 | the same poses |
| RESIZE ×4 | row two 0 of 89–93 frames | row two 0 of 39–44; one excluded pre-event read (`k1@-39.0ms y774.35`, 1280 light — the pre-resize position measured against the post-resize mid) |
| METRIC ×2 (11 px / 2 px) | row two 0 of 122–123 | 0 of 61 |
| FONT ×1 | WITNESS (stand meta null) | WITNESS (stand meta null) |

The lane's union numbers reproduce. **What the table also says, and the lane's return does not:** on the union the
count is laid at press 2 and is gone at press 3 in EVERY cell — the two YIELD cells and the two FIT cells read the same
sequence (`- - 1of170 1of170 -R -R`). §3's FIT claim ("where the pair fits it stays; the next write updates it in place,
2 of 170") has no cell on the shipping product in which it is true or false: §7's seat takes the berth first. The count
the charter promises for "the first three writes of a deal" rides ONE write on the union's hint path (a hand fill
with no record is unread). The YIELD/FIT split is a
distinction the union cannot show.

## 3 · The critic's plants on count-yield (the new SEAT disjunct and the FIT key window)

Each plant is one in-memory rewrite of `MarginNote.vue` in the critic's out-of-tree build (`must()` throws on a miss),
served on `:4237` with its identity asserted. The voices were read first with a read-only probe (1280×800, chromium):
on `74a2b5d9` (control `:4250`) press 1 speaks 31 chars, **press 2 is SILENT**, press 3 speaks 34; on the union press 2
speaks 31 chars ("A goes nowhere else in this row"), press 3 34, and a record stands in line two from press 3 on
(press 3–6: `record true`, never leaves inside six presses).

| plant (union unless named) | what it rewrites | chromium | webkit | reading |
|---|---|---|---|---|
| `noseat` | deletes the union's readYield seat line `if (props.metaYields && props.meta && props.previous) return emit("yielded")` | **11/11 GREEN, exit 0** | (below) | every pose identical to the clean union. The template's `v-if="meta && !(metaYields && previous)"` hides the count while a record stands, so SEAT's two asserts read the template, not the seat's yield. The seat's only own effect (the count must not come back when the record LEAVES) is never read: the record never leaves in the spec's four presses. **SEAT has no plant that reds it — a disjunct with no born-RED (LAWS P8 §F).** |
| `press3` (yield when the voice is ≥ 30 chars) | appends a length key to LINE | exit 1 | exit 1 | reds at `laid` (31 ≥ 30) — caught, but only because the union's press-2 voice is 31 |
| `noro` (the lane's, re-derived; `index-B-CZAyxp4OfO.js` = the lane's hash) | deletes `new ResizeObserver(readYield)` | exit 1: base 4/4 GREEN, **RESIZE 4/4 + METRIC 2/2 RED**, the count on row two in 90–94 of 90–95 frames after the turn (first at +59.6 to +61.4 ms; y 573.7 vs mid 564.3, y 342.84 vs 333.2) | (below) | the lane's born-RED reproduces; FONT stays GREEN under it (the lane's gap 2) |

WebKit for the three union rows above: `noseat` **11/11 GREEN, exit 0** (load 47.8 → 50.1) — the same vacuity;
`press3` exit 1 (load 40.3 → 42.3); `noro` exit 1 (load 52.6 → 53.9), RESIZE 4/4 + METRIC 2/2 with the count on row
two in every frame after (29–43 of 29–43 RESIZE, 46/46 and 48/49 METRIC). The control's exits are not printed beside
these rows because count-yield on `74a2b5d9` has no count to read (the lane's own "exit 1, the witness reds" stands).

### 3b · The FIT arm's key window on the union (threshold sabotage the lane's plant set did not run)

The lane's `overyield` keys the yield on a voice longer than 20 chars and reds FIT at `laid` on the union. Its ε
neighbour, the same defect keyed one notch above the union's press-2 voice (31 chars):

| plant | rewrite | union chromium | union webkit | tree (both) |
|---|---|---|---|---|
| `len32` (`index-5HKAMaiCjg71.js` union / `index-DBOrvzA_sax_.js` tree) | LINE + `if (props.text && props.text.length >= 32) emit("yielded")` — the count yields beside any voice of 32+ chars, a length key exactly like `overyield` | **11/11 GREEN, exit 0** (load 65.3 → 60.2): laid 1 of 170, press 3 gone + RECORD, every clause GREEN | **11/11 GREEN, exit 0** (load 60.2 → 58.2) | chromium exit 1: "FIT: beside the long line the count stays" RED at 1280 and 844 (+ the stand witnesses) — load 54.8 → 90.1 |

So on the union FIT bites a length key only in (20, 31]: every key in [32, 34] — the very defect FIT's comment names
("a yield keyed on the hint's LENGTH ends the lesson here") — ships GREEN, because SEAT replaces FIT's press-3 assert
wherever a record stands, and on the union a record stands at press 3 in every FIT cell. The lane's gap 12 declares
"FIT witnessed at `laid` only"; this plant prices it: the union's FIT arm is a one-payload threshold that a length key
one char above the press-2 hint escapes. A FIT reading that can fail on the union needs a payload whose FIRST voiced
pose carries the long line (or a press-3 read with the record dismissed), not a branch that swaps the assert away.

## 4 · Re-derived on the tree (`index-CCBUYCA7IyOU.js` = the lane's hash)

count-yield chromium **11/11, exit 0** (load 53.9 → 51.2): the lane's poses reproduce (strip 20.8 at rest, tab
508.73 / 159.09 / 398.45 / 166.59; RESIZE row two 0 of 88–93; METRIC 9 px / 1 px, 0 of 122). The tree's own trace shows
what the moved ABSOLUTE clause no longer reads anywhere in §3: at press 1 (a 31-char voice, no count) the strip grows
20.8 → 23.61 / 21.97 / 22.09 and the tab moves +0.58 px (812×375) and +0.64 px (844×390), then falls back at the silent
press 2. That motion is `74a2b5d9`'s (no count is up) and the reserve is LEDGER's, so it is not charged to SIX; it is
named because the clause that used to print it is gone from this spec, and **no pass-9 bank reads it in its place**:
`pass9/prototype/NOTE-LEDGER/README.md` carries no RECT row and no reading of the strip with the count laid (grep:
0 hits for `RECT`, `meta`, the count). The clause was DELETED on SIX's side with no receiving reader this batch; the
§3 promise it held ("the strip is one line either way, so the tab never moves for the count") is ungated on the tree
AND the union until LEDGER lands RECT. CHAIR §3 is met in text, not in a reading.

count-yield WebKit on the tree **11/11, exit 0** (load 51.2 → 55.3): RESIZE row two 0 of 37–45, METRIC 0 of 49–61, base
PAINT 0 of 49–52 frames. Measurement 1 (count-yield, tree AND union, both engines) and the lane's `noro` born-RED (union,
both engines) are re-derived.

On the TREE the same `press3` key (`index-DnbPB1GKfsL8.js`) reds FIT at 1280 and 844 in both engines (exit 1; load
55.3 → 53.5 cr, 53.5 → 67.7 wk) — press 3 is the first voiced pose there and no record exists, so FIT reads the long
line. The FIT arm is real on `74a2b5d9`'s note; what it can see on the union is the question §3b answers.

Tree `noro` (`index-BOFYa-xmTey1.js` = the lane's hash): exit 1 in both engines, RESIZE 4/4 + METRIC 2/2 RED, base 4/4
GREEN (load 65.4 → 60.4 cr, 60.4 → 55.9 wk). The lane's tree born-RED reproduces.

## 5 · The wash (R2) — measurement 2 and the clause battery

**The reach's clause battery, re-run by the critic** (`WASH_SABOTAGE=<id> node scripts/check-theme-tokens.mjs
--self-test` on the critic's archive of the tree; browserless; exits read from files): `lint:theme-tokens` on the tree
exit 0 ("the wash reach … 0 offence(s)"); `none` exit 0; `reach-none` exit 2 with exactly W10 FAILED (0 offences) and both
CONTROLs GREEN — as the lane printed. The whole battery is §5b.

**A stale clause in the spec's own prose.** `wash-step.spec.ts:14–15` still says the floor is HEAD's step "less 0.006 for
the photograph"; `:23–27` and `FLOOR` say 0.001. The pass-8 slack the pass-9 paragraph retires is still asserted in the
header (a legacy alias in a gate's doc, the same file).

### 5a · wash-step on the tree (`index-CCBUYCA7IyOU.js`), measurement 2

| run · engine (load start → end) | no-pref light | no-pref dark | more light | more dark | exit |
|---|---|---|---|---|---|
| floor (HEAD − 0.001) | 1.077 | 1.102 | 1.142 | 1.223 | |
| ws1 · chromium (56.5 → 65.5) | 1.078 (+0.001); W1 1.019, W5 1.000, ε 1.067 (−0.010) | 1.104 (+0.002); ε 1.082 (−0.020) | 1.143 (+0.001); W7 1.000, ε 1.133 (−0.009) | 1.224 (+0.001); ε 1.208 (−0.015) | 0 |
| ws1 · webkit (65.5 → 69.0) | 1.078 (+0.001); ε 1.060 (−0.017) | 1.103 (+0.001); ε 1.082 (−0.020) | 1.143 (+0.001); **ε 1.141 (−0.001)** | 1.225 (+0.002); ε 1.207 (−0.016) | 0 |

The lane's eight clean steps and every in-run plant reproduce to the third decimal. **The gate's resolution IS its
margin**: `step()` returns `+ratio(…).toFixed(3)` and the floors are three-decimal, so the clean tree clears its floor by
one quantum in 6 of 8 cells and WebKit's ε (the contrast arm one percent under its pin) reds by one quantum. A ±0.0005
shift in the peer cell's painted bytes, from anything (a glyph AA change, a paper grain, a colour-space rounding in a
new WebKit), flips either the clean read RED or the ε plant GREEN. The lane's gap 3 says so; the critic prices it: the
paint row cannot distinguish "the wash at HEAD" from "the wash one percent fainter" in WebKit light-more with ANY margin,
and the source pin (W8±ε at 0.1 %) is what actually holds the arm. A paint gate whose plant reds by the rounding quantum
is a fitted constant (LAWS P8 §E), not a bound.

ws2 (a second full run on the same served build; chromium load 78.5 → 81.3, webkit 81.3 → 84.9; exit 0 both): every
clean step and every plant equal to ws1 at the third decimal, WebKit's ε again 1.141 against 1.142. The paint is
deterministic on this box, so the one-quantum margin is not flake today; it is a bound with no room for any real change.

wash-step on the UNION (`index-BGox1KTDMsaa.js`; chromium load 74.5 → 70.4, webkit 68.8 → 74.7; exit 0 both): all eight
clean steps and every plant identical to the tree's to the third decimal (WebKit ε 1.141 vs 1.142 again). The wash is
π-clean between tree and union, as the lane says.

### 5b · The wash reach's clause battery, re-derived (`WASH_SABOTAGE`, the critic's archive of the tree)

| id | exit | plants FAILED (0 offences) | CONTROLs |
|---|---|---|---|
| (lint, no self-test) | 0 | — (wash reach 0 offences) | — |
| `none` | 0 | none | GREEN |
| `reach-none` | 2 | W10 only | GREEN |
| `arms` | 2 | W7, W8, W8+ε, W8−ε, W7−ε, W9 | GREEN |
| `arm-pct` | 2 | W8, W8+ε, W8−ε, W7−ε | GREEN |
| `arm-ctx` | 2 | W11 only | GREEN |
| `arm-once` | 2 | W12 only | GREEN |

Each clause reds exactly the plants the lane names; the battery reproduces. (Each self-test ran 3.5–7 min at load
54–71; exits read from files the battery wrote.)

### 5c · The seed law's two rows on the union (CHAIR §4), re-derived

| row | chromium | webkit |
|---|---|---|
| FACE row 7 · `face-law.spec.ts:781` "a tape's paper covers its own PAINTED word, per word" (the grep also ran the four case-wide tape-occlusion rows `:1282`/`:1614`, all GREEN) | **GREEN**, 5/5, exit 0 (load 84.0 → 83.4) | **GREEN**, 5/5, exit 0 (load 83.4 → 83.0) |
| TAPE row 7 · `viewport-law.spec.ts:396` "§2.5 no washi tape covers any part of an interactive element" @ 1440×900 (`U-tape2`, quoted grep, 1 test) | **GREEN**, 1/1, exit 0 (load 74.7 → 70.8) | **GREEN**, 1/1, exit 0 |

Both seed-law rows re-read GREEN on the union in both engines: the term's return cures the two pass-8 WAVE reds it caused.
The seed's tilt per tape equals `74a2b5d9`'s by construction (byte-identical inputs and function).

## 6 · Constraints (re-read by the critic)

| constraint | reading |
|---|---|
| `@property` in the served CSS | tree 42 = control 42 (`index-CubiZsMVSwTc.js`'s dist); union 99 (the WAVE's; the delta's one added `@property` text is the W5 plant string inside `wash-step.spec.ts`, assembled into an injected style at run time, never a product registration) |
| filterBudget 9 | `filterBudget.ts` byte-equal to `74a2b5d9` on the tree; not in either delta |
| M16 (`check-copy-register.mjs`) | tree exit 0, union exit 0 ("0 em/en dashes and 0 unadmitted jargon") |
| π | §3's product bytes are pass 8's (§1), so pass 8's 16 π readings stand by construction; the delta's only product-source paths are FIVE's by sha (`DifficultyTally.vue`, `gridPaths.ts`) and the seed's return to HEAD. Served CSS tree 98,536 B vs control 96,800 B (pass 8's +1,736 B, unchanged) |
| AA from painted bytes | NOT closed: the count line is sub-AA at DPR 1 (the lane's R3 sweep: 2.359 shipped, 3.845–3.898 at 100 % graphite). Not re-derived by the critic this pass; the product bytes that paint it are pass 8's, whose critic read 2.359 both engines. **The §3 feature ships a sub-AA line at DPR 1, with no owner having accepted the row (PROPOSED to §7, not taken)** |
| the @property law | no new registration in either delta |
| the ballot pair on one payload | T9-B-ACC6-1's frame is pass 8's (one payload, trace only; looked at: gold over violet, light left / dark right). The caption now names `--accent-glow` as the second variable, but **the glow is unread in paint and unframed**: the owner is asked to vote on an arm whose second half no one has seen |
| kenken `+`/`÷` cite (CHAIR §11) | verified: `scripts/check-font-coverage.mjs` `UNRESOLVED_SINKS`, the `component :is="spec.clues.overlay"` row (tree `:372–376`, union `:505ff`), and `clue.ts` `case "+"` / `case "÷"`. The cite is met; the cure has no owner (the row says "the chair's to route") |

## 7 · The charter's twelve gaps and the chair's picks, disposed by the critic

| pass-8 gap / pick | pass-9 state (critic) |
|---|---|
| 1 G-RO · the RO half ungated | **CLOSED** — RESIZE ×4 + METRIC ×2, `noro` RED on tree and union, both engines, re-derived. The FONT leg cannot fail (declared, a witness) |
| 2 G-W7 · the wash's sixth escape | **CLOSED at source, THIN in paint** — arms read in every block (W7/W8/W9/W11/W12; the whole clause battery re-derived, §5b); paint reads both contrast arms, W7 reds 1.000 both engines; the paint bound's margin is one rounding quantum (§5a) |
| 3 count-line AA at DPR 1 | **OPEN** — no rung closes it (lane's sweep); PROPOSED to §7, not taken. The feature still paints sub-AA |
| 4 union count-yield 0/4 | **CLOSED as written** — 11/11 on the union both engines, re-derived — but by a SEAT branch that swaps FIT's press-3 assert away on every union FIT cell (§3, §3b) |
| 5 tape seed text term (CHAIR §4) | **CLOSED** — the term is HEAD's bytes on the tree and HEAD's line on the union (verified byte-for-byte); FACE row 7 / TAPE row 7 on the union in §5c |
| 6 B-TALLY-16 + phone clearance | **OPEN**, untouched |
| 7 kenken cite (CHAIR §11) | **MET** — cite verified; cure unowned |
| 8 the caption's second variable | **MET in text**; the glow is unread in paint and unframed (OPEN as a reading) |
| 9 trace AA per arm | **OPEN** (carried, not re-read) |
| 10 three home forks | **CLOSED** — homes v2 13/13 byte-equal; 0 residual home edits in either delta (verified) |
| 11 check 8 / `--head-rule` | **OPEN** — check 8 RED on the tree (lane's reading, not re-run by the critic: it shells git); `--head-rule` ×2 still masked on the union, SELF's, not struck |
| 12 G10 + the strobe re-derived by a critic | **NOT re-derived by this critic** (FIVE's primitive by sha; the lane's own reads only). Per LAWS P8 §C the lane's G10 numbers are not this critic's |
| CHAIR §3 ABSOLUTE → painted reserve | **MOVED, NOT RECEIVED** — deleted from SIX's spec; no pass-9 LEDGER bank reads it (§4) |
| CHAIR §3 count-yield 4/4 on the WAVE | **MET** (§2) |
| batch gate: SELF's bank + drawn-frame roster | not SIX's to land; the gate names SELF's bank, which COUNT/PLACE take — outside this critique |

## 8 · Open gaps (the critic's, ranked; each with the number that holds it)

1. **G-SEAT · the SEAT disjunct has no born-RED.** `noseat` (the union's readYield seat line deleted) reads count-yield
   11/11 GREEN in both engines: the template's `v-if="meta && !(metaYields && previous)"` hides the count while the record
   stands, so SEAT reads the template, never the seat's yield; the seat's one own effect (no return when the record
   leaves) is never exercised (the record stands through press 6). LAWS P8 §F: a disjunct with no plant that reds only it.
2. **G-FIT-UNION · FIT is a one-payload threshold on the union.** `len32` (a yield keyed on voice length ≥ 32 — the
   defect FIT exists to catch) is 11/11 GREEN on the union in both engines and RED on the tree. On the union FIT bites
   a length key only in (20, 31]; SEAT swaps the press-3 assert away in every FIT cell. The class (a yield keyed on the
   hint's length) is cured on `74a2b5d9`'s note, not on the shipping union (registry-v8 §2.12, the class law).
3. **G-LIFE · on the union's hint path the count rides ONE write.** Laid at press 2, gone at press 3 in all four cells
   (both engines) once a second hint pushes the first into line two (a hand-written fill with no record is not read by
   any row, so its lifetime is unmeasured), so YIELD and FIT cells read the same sequence; §3's "first three writes" and "2 of 170 in place" have no
   cell on the union. Whether §7's seat should end the lesson at the first record is a §3/§7 ruling nobody has made; the
   spec encodes the integrator's rule as SIX's expectation.
4. **G-ABS · the ABSOLUTE strip clause was deleted, not moved.** No pass-9 LEDGER bank reads the strip with the count
   laid (`NOTE-LEDGER/README.md`: no RECT row, no count reading). Until it lands, "the strip is one line, the tab never
   moves for the count" is ungated everywhere.
5. **R3 · the count line is sub-AA at DPR 1** (2.359 shipped; no graphite rung reaches 4.5; PROPOSED to §7, untaken).
6. **The wash paint bound's margin is its rounding quantum** (`toFixed(3)`; clean +0.001 in 6/8 cells, WebKit ε −0.001,
   deterministic over two runs and on the union). The source pin holds the arm; the paint row is a fitted constant.
7. **B-TALLY-16 unbuilt; the phone clearance (10 px vs 15–16) unread.**
8. **The glow (`--accent-glow`) is a ballot variable unread in paint and unframed.**
9. **Trace AA per arm carried, not re-read.** · 10. **FONT leg cannot fail (a witness).** · 11. **check 8 RED on the
   tree; `--head-rule` ×2 masked on the union (SELF's).**
12. **Not re-derived by this critic:** G10/D10/slow49, the R3 sweep, unit/vue-tsc/typecheck, check 8, lints beyond
   M16 and theme-tokens.
13. **Record defects:** the README's replay route names the union tree `458106cb` (bank-4's) where BANKED.txt and the
   return name `2bd90cc6`; `wash-step.spec.ts:14–15` still states the retired 0.006 slack.

## 9 · Critic's incidents (self-declared)

1. The in-scratch `git apply` with no discovery ceiling (§0): vacuous checks, re-cut, nothing cited from it.
2. `spec.sh`'s unquoted `--grep` split a multi-word title into positional file filters (the lane's incident 6, repeated):
   the FACE run ran 5 face-law tests (row 7 among them, all GREEN, cited); the first TAPE run matched 28 tests across
   files and was killed by its recorded PIDs (81508 spec.sh, 81512 npm, 81615 node; command lines checked to name this
   critic's config) before any result; the grep was quoted and the row re-run (`U-tape2`).
3. Load 38–90 (1-min) across the rows, under the 120 verdict line throughout; foreign playwright swarms
   (fourier-analysis, value.js, glass-ui) shared the box. No row was read above 120.
4. Servers: union/tree previews on `:4237` and the control on `:4250` were started by this critic, PIDs recorded,
   stopped by `stop.sh` after a cwd + ancestry check. No foreign listener was touched.

## 10 · The number and the verdict

**86** (pass-8 critic 85; the lane does not claim one). Earned: the RO half gated and born-RED on both bases in both
engines; the wash's arms read in every block with the W7 paint plant RED; the seed term returned byte-for-byte with both
seed-law rows GREEN on the union; the three home forks stripped against homes v2 by sha; count-yield 11/11 on the
union; the kenken cite. Refused: the SEAT branch that made the union GREEN cannot fail (`noseat` GREEN 11/11 ×2); on the
union FIT is a one-payload threshold (`len32` GREEN 11/11 ×2) — the yield-on-length class is cured for `74a2b5d9`'s note,
not the shipping one; the count lives one write on the union with no ruling that it should; the ABSOLUTE clause has
no receiver; the count line still paints sub-AA at DPR 1; B-TALLY-16 unbuilt; the glow unread. Four of the refusals are
new this pass and sit in the very gate the batch was judged on, which is why the number moves one point, not more.

**Verdict: ADVANCE** — SIX stays alive and §3's leader on the number (CHAIR p9 §1 held it at 85; this critique does not re-rank ACC-FIVE), on four pass-10 rows: (1) a SEAT plant
that reds only SEAT (a record that LEAVES inside the run, or the template's hide removed with the seat kept), or the
branch struck; (2) a union FIT read that can fail on a length key at the press-3 line (a payload whose first voiced pose
is the long line, `len32` RED on the union); (3) the chair's ruling on the count's lifetime under §7's seat (one write,
or three); (4) LEDGER's RECT reading of the strip with the count laid, on the union, with its plant. R3 stays §7's.
Earliest 100 for §3: not pass 10 — pass 9 is not a clean pass.
