# CTRL-TAPE · pass 10 · adversarial critique (§10 leader, 87 at v9)

Critic's scratch `.claude/t9-scratch/work/pass10/crit-CTRL-TAPE/` (durable; every archive `git init`-ed, every git call
under `GIT_CEILING_DIRECTORIES` = that dir). Ports 4230 (lane) / 4252 (control). The number at the foot is the critic's.

## 0 · Gaps first (what is NOT converged)

**87, held. ADVANCE.** The exact open list is §0′ (written last, after the paint rows); the number's ledger is §8.
Headline: row 3 is open at its class with a paint-proven escape in both engines (N3: one script line, verbs below the
viewport, gate 0); row 1 is open at class five ways; `bounds()`/the admitted list fork homes v3; `lint:tape-foot` is RED
on the WAVE. Pick 7 is met on paint in both engines on tree and WAVE and born-RED on the pass-9 bank. Sections are
numbered in the order read, not the order written (appended in parts).

## 1 · The bank, re-derived

| Check | Reading |
|---|---|
| `pass10.diff` | 593,538 B, sha1 `8f01aaaf…`, 38 paths; re-cut by the critic from the work tree through a temp index (`git add -A`, 51 paths minus the 13 home paths): **byte-identical** (`cmp` 0), tree `cdc0742e` |
| homes v3 by sha | the work tree's 13 home paths re-cut = `homes.diff` `07257854` with only the `index` abbreviation lines differing (0 content lines differ); home paths in `pass10.diff` **0** |
| `pass10.delta.on-WAVE.diff` | 207,814 B, sha1 `d1b8dc0e…`, 12 paths; the critic's increment pass-9 bank tree `3fa1be2b` → lane tree `cdc0742e` over the same paths: `12 files changed, 1652 insertions(+), 98 deletions(-)`, the delta's shortstat |
| apply `pass10.diff` @ `74a2b5d9` (fresh archive, own `.git`) | `--check` exit **0**, 38 paths; then applied over `homes.diff` (exit 0): the result equals the work tree (`diff -rq` src/scripts/e2e: 0) |
| apply delta @ s10 `1be6fe37` + `homes.on-WAVE` | s10.diff exit 0 (64), homes exit 0 (10), delta `--check` exit **0** (12) |
| apply delta @ the WAVE `954bbbab` + `homes.on-WAVE` | WAVE.diff exit 0 (187), homes exit 0 (10), delta `--check` exit **0** (12) |
| apply delta @ the bare WAVE (no homes) | `--check` exit **0** |
| git dir printed per line | `readings/applychecks.txt` (each line names `<scratch>/<tree>/.git`) |

The batch gate (the trio's deltas apply 0 on `74a2b5d9`, s10 and the WAVE) is **met for this lane**. The declared
base in BANKED.txt (WAVE + homes.on-WAVE) is true, and the delta also applies on the bare WAVE.

## 2 · The gate, browserless (critic's re-derivation on the lane tree)

**The pass-9 plant FIRST** (`pass9/critique/CTRL-TAPE/instruments/breaks9.mjs`, `v8gate.mjs`, unmodified, `FE=` the
work tree): escapes GREEN **0/61**; controls GREEN **0/2**; V8 / V9 / V10 **RED**. Reproduced. The two controls (no
paint move) now RED too: the admitted list reds every new declaration, by design (charter row 1: "the control absent").

`check-tape-foot` bare on the critic's reconstruction of the lane tree: exit **0** ("12 clauses hold").
`--self-test`: 157 plants red, 7 boundaries green, live green (re-derived); the sabotage battery's count is in §4.

## 3 · The critic's pass-10 siblings (`instruments/crit10.mjs`, in memory, `FE=` the work tree; `readings/crit10.tree.txt`)

Twenty one-line siblings of the clauses this pass re-cut (12, 12s, 11b, 11c, 4a). The live tree reads 0 fails;
a sibling's reading is the fails it ADDS.

| Id | Plant | Gate | Class it opens |
|---|---|---|---|
| N1 | scene.css appends a byte copy of the admitted base `.card-foot { padding-bottom: calc(0.75rem + env(…)) }` after the desk rule | RED (clause 1 THE INSET, not 12) | the content key ignores cascade ORDER; clause 1's own effective-value read catches this one |
| N1b | the admitted mobile `.drawer-case` cap re-declared, same ctx, appended | GREEN | control (no desk paint): correct |
| **N2** | panel `.action-bar { grid-template-columns: 1fr }` (the WAVE's admitted value, re-planted on the tree) | **GREEN** | gap 3 (the union roster), the lane's own declared gap: a tree-side regression to a sibling's value is admitted |
| **N3** | `footBerth.value = !!document.getElementById("card-foot") && false;` (one line, the script) | **GREEN** (also bare on disk: `readings/gate.n3.txt`, exit 0) | **row 3's class**: 11b evaluates the template expression only; the constant moved one hop into the script pins the Teleport disabled |
| **N3b** | `getElementById("card-foot-x")` | **GREEN** | same class |
| N4 | `:disabled="footBerth !== footBerth"` | GREEN (`constantOf` = varies through the NaN probe) | runtime-constant on a boolean ref; no product paint move on the scene (the bar always teleports), a guest mount breaks. Semantic hole, not a paint escape |
| N4b | `:disabled="!footBerth && footBerth === footBerth"` | GREEN | control: correct |
| N5 | App.vue writes `.action-verbs` `transform` | RED (clause 10) | — |
| **N5b** | App.vue `setProperty("zoom", "4")` on the bar | **GREEN** | gap 2 (script-write denylist), declared |
| **N5c** | App.vue `visibility = "hidden"` on every `.icon-sublabel` | **GREEN** | gap 2, declared: the words vanish with CI's witness at 0 |
| N5d / N5e | `setAttribute("style", …)` / `style.cssText` | RED (clause 1) | — |
| N6 / N6b / N6c / N6d | `[class*="sublabel"]`, `#card-foot > * > *`, `:is(…):has(> .icon-sublabel)`, an `index.html` `<style>` | RED ×4 | the matcher is conservative; a page-level `<style>` is read |
| **N7** | `body { writing-mode: vertical-rl }` | **GREEN** | **inheritance**: the subjects stop at GameScene's root; an inherited property set above it reaches every verb and word |
| **N7b** | `#app { line-height: 6 }` | **GREEN** | same class (inherited into the words) |
| **N8** | `@layer utilities, components, base, theme;` prepended to index.css | **GREEN** | **cascade-layer order**: an `@`-prelude is skipped, so the layer statement that decides every utility-vs-base contest is no admitted input |
| **N9** | SheetWashiLabel keeps `(rng() - 0.5) * 3` and returns `(tilt * 2)` | **GREEN** | **12s pins a literal, not the drawn tilt**: the band doubles to ±3° with the seed clause at 0 |

Paint-moving GREEN: **N2, N3, N3b, N5b, N5c, N7, N7b, N8, N9** — nine (two declared by the lane: N2 gap 3,
N5b/N5c gap 2). N3/N3b, N7/N7b, N8 and N9 are NEW classes the lane did not declare. N3 is the class of charter row 3
itself ("a constant-valued `:disabled` (any spelling) reds"): the cure reads the template spelling and not the value
the Teleport receives, so row 3 is cured for its plants and not its class (registry-v8 §2.12 → OPEN).
Paint confirmation for N3 (built, served, both engines) is in §5.

**Threshold and disjunct sabotage** (`instruments/thr10.mjs`, `readings/thr10.tree.txt`): 4a 9.99 px RED (4+12),
10 px and 10.01 px RED by 12 only (4 GREEN, the bound holds ±ε); xx-small, 0.5em, 1%, `font: 9px serif`,
`font: italic 9px/1 serif`, `calc(10px - 0.01px)`, `max(1px, 0.1rem)`, `clamp(1px, 1vw, 2px)` RED on 4 (the
shorthand disjunct and the math disjuncts read); `x-small` (= 10 px) and `smaller` RED on 4 (fails closed,
over-strict at the boundary keyword). 12s: band 1.49deg RED, literal `* 3.0000001` RED, cap 16rem RED (via 12),
`* (3)` RED (a value-identical spelling reds: fails closed, brittle), cap `240px` and band `0.0041666667turn`
(value-identical units) RED: the seed pins units, not values. No threshold row of this pass is GREEN where it must
be RED.

## 4 · The gate on the integrated trees (critic's scratch, delta APPLIED, each with its own `.git`)

| Tree | `check-tape-foot` bare | critic's siblings (`crit10.mjs`, live fails subtracted) |
|---|---|---|
| lane (`74a2b5d9` + homes + `pass10.diff`) | **0** | paint-moving GREEN: N2, N3, N3b, N5b, N5c, N7, N7b, N8, N9 |
| s10 `1be6fe37` + homes.on-WAVE + delta | **0** (`readings/gate.s10.txt`) | N3, N3b, N5b, N5c, N7, N7b, N8, N9 GREEN; N2 not applicable (`readings/crit10.s10.txt`) |
| WAVE `954bbbab` + homes.on-WAVE + delta | **1**: clause 4 ×3 on `index.css:981` `@layer base @media (forced-colors: active) :focus-visible { outline: 2px solid Highlight }` (bar, verbs, foot) (`readings/gate.wave.txt`) | N3, N3b, N5c, N7, N7b, N9 GREEN; N5b and N8 RED there (`readings/crit10.wave.txt`) |

The WAVE reading reproduces the lane's. The critic's judgment on it differs from the lane's: a forced-colors
`:focus-visible` outline is the platform's accessibility ring, not a second "hand" on the tape. Clause 4 reds an
accessibility rule the product must keep, so on the union the gate is red for a reason that is the GATE's, not
LIVE's. Either way `lint:tape-foot` is RED on the pass-10 base the chair named, and the section's leader owns the
§10 gate on the integrated tree (charter "Leader duties"). It is carried as an open row of THIS family, not
re-assigned to LIVE.

## 6 · The chair's picks for this family, judged

| Pick | Judgment | Reading |
|---|---|---|
| 2 · lead §10 at 87, no default moves, the solid 2 px ring stays | **MET on the diff**: the increment touches no ring, no default constant; the berth's value is identical (tokens resolve to `7.5rem × sin(1.5deg) + 0.5px`); served CSS 98,331 B = the lane's | §1, §5 |
| 7 · board ink is the truth across a reload; read both engines on tree AND WAVE | **MET for player digits** (unit 6/6, born-RED R and C red under an undo-depth plant, 2 failed / 4 passed, restored 6/6: `readings/unit.ink*.txt`; paint in §5). **A residue the ruling does not settle: hint ink.** `boardInk` excludes every digit in the solver's tone, so a board whose only writes are hints the player asked for reads pristine and one click clears them; pass 9's walk asked. That is a shipped behaviour the lane changed and flagged, not one the chair ruled. It goes to the chair as a ballot, with the lane's default (hints are the solver's ink) unread on paint by either side (§5e) | §5 |
| 8 · 7.5rem and 1.5deg as tokens or named seed inputs | **MET in letter, OPEN at class**: the tokens exist and the berth spends them; clause 12s pins the JS literal `* 3` to twice `--washi-tilt-band`. N9 (`(tilt * 2)` on the returned value, literal kept) doubles the drawn band to ±3° with the gate at 0 on tree, s10 and WAVE: the pin reads one token of source, not the tilt the seed draws. The seed's frozen input is frozen only against the edit 12s imagined | §3 N9 |
| 21 · `poseSettled` struck at s10 unless folded with a born-RED | **NOT FOLDED** (no PROPOSED `rest-probes` diff): struck at the s10 integrator by the ruling's default. Not a gap of the number, a loss of the row | lane gap 6 |

The batch gate: **met** (§1).

## 7 · Holes the lane did not declare (browserless)

**7a · The admitted list has no stale arm: a DELETION is admitted** (`instruments/del10.mjs`, `readings/del10.*.txt`).
Clause 12 reds a live declaration absent from the roster; it never reds a roster entry absent from the tree (the
union roster could not carry one: 443 WAVE-only entries are stale on the lane tree by construction). Nine one-line
deletions on the chain's own rules, lane tree and WAVE+delta alike: D1 foot `flex: none`, D2 foot `padding-bottom`,
D3 foot `z-index: 45` RED (clauses 9, 1, 2 read those properties by name); **D4 bar `display: grid`, D5 bar
`padding-block`, D6 bar `align-items`, D7 verbs `display: flex` (the four verbs stack), D8 verbs `justify-content`,
D9 verbs `flex: 1` GREEN — 6/9**, lane, s10 and WAVE alike. D7 bare on disk (`d7/` scratch tree): "12 clauses hold".
**But D7 moves no paint**: built and probed (§5), the verbs' box reads 699.41–755.78 at 1440×900 chromium, identical to
the lane (the flex comes from elsewhere). So the deletion class is a law gap (the ONE library's `admittedSites` reds a
stale entry, this gate does not), NOT a demonstrated paint escape: the critic's own D7 conjecture ("the four verbs
stack") is withdrawn by its reading. D4–D6, D8, D9 were not built.

**7b · `bounds()` and the admitted list are FORKS of the ONE library, not open PROPOSED diffs.** Homes v3
(`pass10/instruments/README.md` §1 rows 3–4, line 62, and its "consumer lines": "TAPE's `check-tape-foot`
`bounds`") ships `bounds(value, regime)` at `scripts/shape-census.mjs:4705` (lifted verbatim from this gate at
batch 0) and `admittedSites(sites, list, {key})` at `:4681`, file:line:prop keyed with a **stale entry RED**. The
lane tree carries both (homes v3 applied by sha, verified in §1), yet `check-tape-foot.mjs` still defines its own
`export function bounds` at `:480`, imports neither, and builds a second admitted-list mechanism (content-keyed, no
stale arm) beside the library's. The lane's gap 1 ("`bounds()` … NOT CUT … no diff filed") misstates the state: the
clause is cut and homed; the consumer line it owes was never wired. Per the pass-9 ruling 9 (carried) a home's
consumer imports it and a needed change is a PROPOSED diff on the home; a gate-local twin after batch 0 is the
checklist's "instrument forked after batch 0". The content key the lane chose is exactly where the fork departs
from the library's (and from registry-v9 line 157, "file+line keyed"); 7a is that departure's price.

The library's `admittedSites` takes its key as a parameter (`{ key = (s) => file:line:prop }`), so the lane's
content key (and its argued line-drift, gap 4) was available ON the home with the stale arm intact: the departure
is not forced by the key choice. A per-tree roster (the lane's own ballot 3) is the precondition for a stale arm;
the union roster forbids it.

**7c · Row 7 reads a literal band, not the seed's.** `zone-grammar.spec.ts:1272` plants
`#card-foot .washi-label { --washi-tilt: ${tilt} !important }` for `tilt` in the literals `"1.5deg"`, `"-1.5deg"`.
The paint row neither reads `--washi-tilt-band` nor the tilt SheetWashiLabel draws, so (i) a token change (pick 8's
"any later change owes TAPE row 7 re-read") re-reads row 7 at the OLD band and passes; (ii) N9's doubled draw is
invisible to it. Pick 8's tie reaches the CSS and the gate's literal; it does not reach the row that measures the
berth. With 7a–7b this keeps pick 8 OPEN at class.

**7d · A WAVE red the stage-0 read names TAPE's, absent from the lane's return.** `WAVE9-read.md:267`:
`face-law:2258` on the WAVE, WebKit, one cell reds on "the hole ledger's entry for `#card-foot .action-verbs button`
still holds on a control (else strike it)", ruled **section-born, CTRL-FACE (the ledger) / CTRL-TAPE (the berth)**.
The lane's README never names `face-law:2258`. Cited, not re-read (stage 0's number); an open row of §10 the
leader co-owns.

**Leak grep (critic's):** `pass10.diff` scratchpad 0, `/private/tmp` 0, `/tmp/` 0, `.claude/t9-scratch` 0, dot paths 1
(`.github/workflows/ci.yml`, carried since pass 8); the delta 0/0/0/0/0. **Unit:** `useGameState.ink.test.ts` 6/6 exit
0; the critic's own born-RED (a plant reading the undo log instead of the board) reds R and C, 2 failed / 4 passed,
exit 1, file restored byte-identical (`cmp` 0). **Typecheck:** `vue-tsc -b` on WAVE+delta exit 0 (`readings/tsc.wave.txt`;
a first run without `node_modules` linked was trashed, incident C2). `inkSinceDeal` residue: 0 on lane, s10 and WAVE.
**Constraints:** `lint:sleep`, `lint:copy` (M16, 0 em/en dashes, 0 jargon), `lint:theme-tokens`, `lint:theme-selectors`,
`lint:ink`, `lint:motion` all exit 0 on the lane. filterBudget: the increment touches no filter or `pencilConfig.ts`.
`@property`: the increment registers none (the two new tokens are plain `:root` custom properties, never animated).

**`lint:tape-foot` (= `--self-test`) on the integrated trees:** s10+delta exit **0** (157 red / 7 green / live green,
`readings/selftest.s10.txt`); WAVE+delta exit **1**, "3 FAILED": the live tree and two boundaries ("font-size 10px on
the bar", "4a +ε: the words at 10.01px") RED through the same `index.css:981` forced-colors line
(`readings/selftest.wave.txt`). On the pass-10 base the chair named, the gate's own threshold boundaries cannot be
read GREEN: 4a's +ε pair is unproven on the union.

## 5 · Paint, re-derived (critic's builds; every row's first line in `readings/rows/<row>.log` prints load, zone, `ZONE-ARMED`, the served/routed dist)

Builds (critic's scratch, own `.git`): lane `index-8d15OH18y0jq.js`, index CSS 98,331 B — **the lane's dist identity
byte for byte**; control `index-CubiZsMVSwTc.js` (w7-control, served `:4252`). Plant/born-RED builds under a sub-path
(`--base /<t>/`, CSS +9 B, declared): N3 `index-DTrj83ZYlsh7.js`, D7 `index-CPprbm1O3IwB.js`, pass-9 bank
`index-CvXg-ZAXdOCh.js`. Two routes: the lane's own spec on `vite preview :4230` (config without `webServer`); the
critic's `probe10.mjs` SERVERLESS (requests to `http://tape.local` fulfilled from the dist on disk), because the
machine's heavy queue held both servers 22:51→23:02 behind other repos' long dev servers (incident C3).

**5a · the lane's rows, chromium, lane tree** (`zone-grammar -g "T9-M12|row 7|painted bottom"`, 23:11:58, load
9.87 → 11.13, zone 1,389,006, ZONE-ARMED present): exit **0**, 9 passed (23.9 s). Row 7: 0 / 0 / 0 px² at ±1.5°,
spill −22.80 / −0.96 / −23.18; NEG 47.18 / 71.22 / 29.80. M12: `clear the board?` askW 83.42, verbs 0, notes 0;
dealt 20 → 0 unasked; inked asks; reload fine and coarse "R asked, C solved unasked". **Every figure equals the
lane's** (prototype §3).

**5b · the critic's probe, chromium, 1440×900, DPR 2, reduce** (23:10:2x–23:11:49, load 10.4–12.3, zone 1.36–1.38M):

| Tree | tape: bar in `#card-foot` · verbs top–bottom (px) | M12 reload: restored · Clear asks · answer clears · Solve asks · empties after |
|---|---|---|
| lane | **true** · 699.41–755.78 (foot 693.02–814.17) | 5 · **asks** · cleared · **no** · 0 |
| pass-9 bank (born-RED) | true · 699.41–755.78 | 5 · **no ask: one click cleared the restored digit** |
| control `74a2b5d9` | false (no foot) · 699.41–755.78 | 5 · no ask (fine pointer, pre-pass-8) |
| **N3** (one script line) | **false** · **1367.39–1423.77, below the 900 px viewport** | — |
| D7 | true · 699.41–755.78 (no move) | — |

Pick 7 on paint: the lane cures the pass-9 tree's reload defect, born-RED on the pass-9 bank in the same session by
an instrument the lane did not write. **N3 is confirmed on paint**: with `check-tape-foot` exit 0 on that tree, the
four verbs leave the viewport at the desk (bar not teleported, verbs 467 px below the fold). Row 3 is OPEN at class.

**5c · the lane's reload row, born-RED on its predecessor (the lane did not run this):** the lane's own
`zone-grammar.spec.ts -g "across a reload"` against the pass-9 bank's build (`:4230/p9/`, 23:12:27, load 11.13,
zone 1,389,006): exit **1**, 2 failed, both cells (fine, coarse) at `R · a restored digit asks` — `toHaveCount(1)`
read `0`. The same row on the lane: GREEN (5a). Against the control (`:4252`, 23:12:58, load 11.18, zone 1,400,307):
exit 1, 2 failed on `getBoundingClientRect` of null (no `#card-foot`: the control cannot host the row, so its red is
the absent foot, not the ask). The row is therefore born-RED on the tree it cures, in this run, by the critic.

**5d · the lane's rows, WebKit (`--exclusive webkit`), lane tree** (23:13:05, load 10.06 → 9.47, zone 1,400,307,
ZONE-ARMED present): exit **0**, 9 passed (33.8 s). Row 7: 0 px² at ±1.5°, spill −22.65 (−22.64 at −1.5°) / −1.02 /
−23.06; NEG 55.91 / 71.22 / 36.64; M12 askW 83.45; dealt, inked, reload fine and coarse as chromium. **Equal to the
lane's WebKit figures.** Fill's slack 0.96 px (chromium) / 1.02 px (WebKit) holds on the critic's build: row 7 is thin
but read.

**5e · hint ink on paint: UNREAD.** At 1440×900 fine the play-controls' Hint button is coarse-only (0 × 0, `hintBtn`
in `rows/x-control-chromium.log`), and the board's bare `h` key wrote no digit within 600 ms in the critic's probe
(`rows/x2-lane-chromium.log`: `written ""`). The lane's ballot (hint ink is the solver's, not dirty) stays unproven on
paint by either side; the unit file has no hint row (R′ is a restored solver digit, not a hint write).

**5f · the critic's probe, WebKit (`--exclusive webkit`), 23:14:04–23:14:39, load 9.59 → 8.81, zone 1,411,779:**
lane — bar in foot, verbs 699.13–755.48; reload: restored 5, Clear **asks**, answer clears, Solve unasked, 0 empties.
**N3 — bar NOT in foot, verbs 1367.94–1424.30, below the 900 px viewport** (the escape, both engines). D7 — verbs
699.13–755.48, no move. So: pick 7 holds on paint in both engines by two instruments (the lane's spec and the
critic's probe); row 3's class escape (N3) moves the verbs out of the viewport in both engines with the gate at 0.

**5g · π** (the lane's `instruments/pi10.mjs`, unmodified; every element outside `.drawer-case`, pinned board,
reduce, DPR 2, three cells × light/dark):

| A → B | Engine | rect | paint | tag | load / zone |
|---|---|---|---|---|---|
| control `74a2b5d9` → lane | chromium | 0/0/**1/1**/0/0 (dock390shut) | 0 ×6 | **29** ×6 (855→858, 877→880) | 8.75→9.05 / 1,411,779 |
| pass-9 bank → lane (the pass-10 increment alone) | chromium | **0 ×6** | **0 ×6** | **0 ×6** | 9.05→8.95 / 1,423,713 |
| pass-9 bank → lane | WebKit | **0 ×6** | **0 ×6** | **0 ×6** | 8.95→10.77 / 1,434,870 |

The lane's π against the control reproduces cell for cell (rect 1 at dock390 still unnamed; tag 29 is the pass-9
bank's drawer-tab subtree, not this pass's). The increment moves **no** pixel outside the case in either engine, and
the berth's resolved value is identical, so pick 2's "no default moves" holds on paint. The WebKit control-vs-control
floor was not run (the increment's 0 needs none). AA: the increment changes no ink, colour or glyph (π paint 0 on
the nine computed paint properties); no AA row was owed and none was read.

## 8 · The number: **87, held** (from 87). Verdict **ADVANCE** (ALIVE; §10's leader on the number, the batch gate met)

The charter's own price: "87 → 90 needs gaps 1–3 closed at their class, both engines."

| Charter gap | Closed for its plants | Closed at its class |
|---|---|---|
| 1 · clause 9's siblings → the admitted list | **yes**: the pass-9 61 → 0/61 GREEN on lane, s10 and WAVE; V8/V9/V10 RED | **no**: N2 (union roster), N5b/N5c (script denylist), N7/N7b (inheritance above GameScene), N8 (`@layer` order) GREEN with paint moved by construction; no stale arm (D4–D9 GREEN, paint unread except D7 = 0); `bounds()` and the admitted list FORKED from homes v3's `bounds`/`admittedSites` |
| 2 · 4a's element key | **yes**: V8/V10 RED, 9.99 RED / 10 and 10.01 GREEN on 4, the shorthand and math disjuncts read | yes on the lane and s10; **unproven on the WAVE** (its +ε boundary reds through `index.css:981`) |
| 3 · row 3, 11b evaluates | **yes**: `Boolean(1)`, `!footBerth || true`, `!undefined`, ternary-constant RED; `!footBerth` varies | **no**: N3 (`footBerth.value = … && false;`, one script line) GREEN, **verbs below the viewport in both engines** |

Earned this pass (real, and why the number does not fall): pick 7 on paint in both engines, tree and WAVE, by two
instruments, born-RED on the pass-9 bank in the same session; the dormant `resize` arm gone; 4a re-keyed and
threshold-pinned; the tokens published with the increment π 0 in both engines; a clean, home-free, apply-verified
bank on all three bases; 26/26 clause sabotage re-derived. What refuses a rise: gaps 1 and 3 open at their class with
a paint-proven escape for 3; an instrument fork after batch 0 (a checklist failure the lane misdescribed as "not cut");
`lint:tape-foot` RED on the pass-10 base (WAVE) with its +ε boundary unreadable there; pick 8 tied in CSS but not in
the row that measures it (7c) nor in the drawn tilt (N9); `face-law:2258`'s co-owned WebKit red unaddressed;
`poseSettled` struck by default. 88 would pay for closures the readings do not show.

## 0′ · Gaps first, EXACT (the critic's list, every one open)

1. **Row 3 at class**: N3/N3b, a constant in the script, GREEN on lane/s10/WAVE; paint: bar not in `#card-foot`,
   verbs 1367.39–1423.77 (chromium) / 1367.94–1424.30 (WebKit) below a 900 px viewport. 11b must read the value the
   Teleport receives (the ref's writers), not its template spelling.
2. **Row 1 at class**: N2 (union roster; the lane's gap 3), N5b/N5c (script-write denylist; the lane's gap 2),
   N7/N7b (inherited properties set above GameScene's root), N8 (`@layer` statement order) GREEN.
3. **No stale arm**: deletions D4–D9 GREEN 6/9 on all three trees (paint read only for D7: no move).
4. **Instrument fork**: `check-tape-foot.mjs:480` `bounds` and the clause-12 roster mechanism duplicate homes v3's
   `shape-census.mjs:4705 bounds` / `:4681 admittedSites` (stale-RED, key parameterised); the consumer line is unwired.
5. **The WAVE**: `lint:tape-foot` exit 1 (live + two boundaries) through `index.css:981` forced-colors
   `:focus-visible` outline; the critic reads it as the gate misjudging an accessibility ring, not LIVE's arm.
6. **Pick 8 at class**: N9 (`(tilt * 2)` on the returned tilt) GREEN; row 7 plants literal `±1.5deg`, never the token.
7. **`face-law:2258`** WebKit cell on the WAVE (`WAVE9-read.md:267`, section-born FACE ledger / TAPE berth): not in
   the return.
8. **Hint ink**: a chair ballot; unread on paint by either side (5e); no unit row writes a hint.
9. Carried from the lane, re-confirmed: `poseSettled` struck at s10 (pick 21); 12s's cap-unpublished arm and the
   `constantOf` probe set unplanted; INTAKE-22 rows 19/21, `check-doc-truth` 6, real iOS unread; π dock rect-1 element
   unnamed; the WebKit π control-vs-control floor not run.

## 9 · Replay route (critic)

- Trees: `git archive 74a2b5d9 web/frontend .github .gitignore README.md csp-solver/data` into a scratch dir, `git init`,
  then: lane = `+ pass10/instruments/homes.diff + pass10.diff`; s10 = `+ pass9/integrate/s10.diff + homes.on-WAVE.diff
  + pass10.delta.on-WAVE.diff`; WAVE = `+ pass9/integrate/WAVE.diff + homes.on-WAVE.diff + delta`; p9 = `+ pass9/prototype/
  CTRL-TAPE/pass9.diff`. Every git call under `GIT_CEILING_DIRECTORIES=<scratch>`; `readings/applychecks.txt`.
- Gate siblings: from a tree's `web/frontend`, `FE=$PWD node <this dir>/instruments/crit10.mjs` (N-set), `del10.mjs`
  (deletions), `thr10.mjs` (threshold/disjunct); the pass-9 set first: `pass9/critique/CTRL-TAPE/instruments/breaks9.mjs`.
- Plant trees on disk: N3 = lane + `footBerth.value = !!document.getElementById("card-foot") && false;`
  (GameControlPanel.vue:905, bytes in `readings/plants.od.txt`); D7 = lane − `display: flex;` in `.action-verbs`.
  Each built `vite build` (own `.git`, CSS index 98,331 B on the lane = the lane's), and for the probe also
  `--base /<t>/ --outDir dist-sub` (CSS +9 B from the base path: declared, a plant demonstration, never a verdict row).
- Paint: `instruments/probe10.mjs` (one browser per run, a context per cell, closed in `finally`), serverless:
  `BASE=http://tape.local[/<t>] DIST=<dist> FE=<tree> node probe10.mjs <engine> tape,reload,hint,hintreload`
  (requests fulfilled from the dist on disk); through `guarded` (WebKit `--exclusive webkit`). Spec rows: the lane's
  `zone-grammar.spec.ts -g "T9-M12|row 7|painted bottom"` through a config with no `webServer`, on `vite preview :4230`.

## 10 · Incidents (the critic's own)

- **C1** The first build of the scratch lane exited 1 (`sudoku-templates`: no `csp-solver/data` in the archive);
  `csp-solver/data` extracted from `74a2b5d9` into each scratch tree, rebuilt. The killed build script's parent shell
  was my own background task (killed by PID; cwd checked for the guarded child).
- **C2** `vue-tsc -b` on the WAVE copy first ran without `node_modules` linked (exit 1 on missing modules); trashed
  (`trash/tsc.wave.no-nm.txt`), re-run linked: exit 0.
- **C3** The heavy queue held both preview servers 22:51 → 23:02 behind other repos' 90-minute dev servers, and the
  browser pool starved the first probe 23:00:22 → ~23:09:30 (chained runs elsewhere re-taking freed slots before the
  2-s poll). Waiting, not stalled; the second build pair moved to `--light` (0.5 s builds).
- **C4** The probe's first hint press (the play-controls button) timed out: at 1440 fine that button is coarse-only
  (0 × 0). The `h` key fallback wrote no digit; hint ink is declared UNREAD (5e), not read.
- **C5** The critic's D7 conjecture ("the verbs stack") was refuted by its own reading and withdrawn in 7a.
- **C6** Plant/born-RED builds are sub-path builds (`--base`, CSS +9 B): demonstrations, never a verdict on the
  shipped bytes; the lane's verdict rows were read on the faithful build (`index-8d15OH18y0jq.js`, CSS 98,331 B).
- Servers I started (`:4230` lane, `:4252` control) stopped by recorded PID after a cwd check (exit 143 = mine); no
  listener left on either port; no probe or browser left running. Nothing was committed; nothing written to main's
  `src/e2e/scripts`; the lane's work tree was only read (a temp index under my scratch).
- Machine at every browser row: load 8.75–12.30 (under 120), zone inuse 1,209,159–1,434,870 (under 8M),
  `ZONE-ARMED` present throughout (armed 21:30:49): short guarded rows only, as the lane did.
