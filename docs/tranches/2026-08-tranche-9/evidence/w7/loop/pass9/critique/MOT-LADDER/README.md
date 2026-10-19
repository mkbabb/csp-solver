# MOT-LADDER · pass 9 CRITIQUE (§13, the motion ladder)

Non-author critic. The prototype's README is `pass9/prototype/MOT-LADDER/README.md`; the number below is mine (LAWS P8 §C).
Everything here was re-derived on scratch trees cut from the bank by temporary index, never on main, never in the control
tree, never in the shared §13 worktree's real index. Scratch: the lane dir `crit-MOT-LADDER` under the durable scratch root.
Instruments: `instruments/` beside this file (copies of the scratch scripts that produced every row).

## 0 · Gaps first (what is NOT converged)

**82, ADVANCE** (§7). The full list is §6. Headline: K7r's own declaration moved into the parent's `<style scoped>` (C1y) or onto a
fall-through class (C17y) ships the reveal at 150 ms with every CI gate 0, painted in both engines; K1's class escapes on both
library arms (C6 template `:style`, C21 `Object.assign`, C27 a bare-hole bracket write); a curve (C13), a deletion (C14), a
negative script delay (C23) and a local token (C24y) escape; four of eight disjunct/guard mutations of the new clause survive
its self-test, one of them (D4) a CI door; `own-gate.diff` is cited and not banked; FIT-1 is consumer-less.

## 1 · Identity and apply, re-derived (temporary indexes in the §13 worktree; no git on main or the control)

| read | result |
|---|---|
| `74a2b5d9` + `pass9.diff` (sha1 `e097669c`, 1,074,355 B) | apply 0 → write-tree **`7b2e2839`** = BANKED.txt |
| `74a2b5d9` + VERB `pass8/prototype/MOT-VERB/pass8.diff` | → **`8c12b15c`** (the open tree the lane declared) |
| `74a2b5d9` + homes v2 `homes.diff` (sha1 `1f70cfda`) | → **`d17813ba`** |
| the worktree as it sits now, `git add -A` into a temporary index | **`7b2e2839`** (VERB has not moved it at this read, 16:36) |
| `8c12b15c` → `7b2e2839` | 13 paths: the 12 homes paths that differ from VERB's pass-8 bank + `scripts/check-motion-bands.mjs` |
| each of the 13 homes v2 paths in `7b2e2839` vs `d17813ba` | **13/13 blob-equal**: homes v2 landed by sha, no residual home edit rides the delta |
| `74a2b5d9` + `pass8/integrate/WAVE.diff` | → **`acb9c08e`** |
| `acb9c08e` + `pass9.delta.on-WAVE.diff` (bare union) | `--check` 0 |
| `acb9c08e` + `homes.on-WAVE.diff` | → **`acde977b`**; + `pass9.delta.on-WAVE.diff` → **`babea79d`** = BANKED.txt |
| `74a2b5d9` + `s13-s7-s3.diff` | → **`f1c9c3fe`** |
| `pass9-ladder-delta.diff` on `f1c9c3fe` | **exit 1** (5 home paths: glyph-pop, postpaint ×2, knip.json, shape-census) |
| gate-only delta (`check-motion-bands.mjs`, `8c12b15c`→`7b2e2839`) on `f1c9c3fe` | `--check` 0 → **`2250db29`** = BANKED.txt's `own-gate.diff` row |
| `pass9.delta.on-WAVE.diff` on `f1c9c3fe` | `--check` 0 |

The section's-integrated-tree check holds only for a gate-only delta the lane cut and did NOT bank (`own-gate.diff` is named in
BANKED.txt but no such file sits in the evidence dir). The banked `pass9-ladder-delta.diff` does not apply to `f1c9c3fe`; the
on-WAVE delta does. Recorded as a §K gap (an unbanked artifact cited as a result), not a defect in the tree: the WAVE union
supersedes `s13-s7-s3` for pass 9.

Bank grep: `pass9-ladder-delta.diff` and `pass9.delta.on-WAVE.diff` read 0 for `scratchpad|/private/tmp|/tmp/|.claude/t9-scratch`
and `^+++ .*/\.`; `pass9.diff` reads 2 (the `.github/workflows/ci.yml` product path and the pass-8 plant literal
`/tmp/lawful-copy` inside the gate's own self-test). Both are what the lane declared.

## 2 · Measurements re-derived (both engines, served)

Served from scratch dists built out of tree with a private cacheDir on a `git init`'d copy (no commit) of the bank tree;
control = the shared `w7-control` dist served read-only on :4247; work arms on :4246. Every server was started by this critic
and killed by recorded PID after a cwd check (`logs/behave-pids.txt`). Load at every arm's open 53–68 (1-min), under 120.

1. **Dist identity — REPRODUCED.** The bank tree builds to `index-BZ0qqsnzl2cb.js` / `index-DHs860g5jK_C.css` (97,546 B), 44
   emitted files: the lane's identity, so the pass moves 0 served bytes against VERB's pass-8 tree. π vs `74a2b5d9` is VERB's
   pass-8 movement unchanged; AA cannot move; filterBudget stays 9. (Main's `node_modules` at `4131e427`, as the lane's.)
2. **The behavioural row — REPRODUCED.** `getComputedStyle(.cell-reveal-animated).animationDuration` and the `cell-reveal`
   CSSAnimation's `effect.getTiming()`, after a fresh deal, at 1440×900 and 390×844:

| arm (served id) | chromium 1440 | chromium 390 | webkit 1440 | webkit 390 | spec exit |
|---|---|---|---|---|---|
| control `index-CubiZsMVSwTc.js` :4247 | 0.3 s / 300 | 0.3 s / 300 | 0.3 s / 300 | 0.3 s / 300 | 0 |
| bank tree `index-BZ0qqsnzl2cb.js` :4246 | 0.3 s / 300 | 0.3 s / 300 | 0.3 s / 300 | 0.3 s / 300 | 0 |

## 3 · Disjunct, guard and threshold sabotage of the new element clause (LAWS P8 §F — not run by the lane)

The lane's `--sabotage-battery` switches whole clauses off (23/23; re-run here, `logs/bank-sab.log`). P8 §F also binds every
GUARD and every DISJUNCT inside a clause, and every numeric bound. `instruments/dsab.py` mutates ONE expression of the shared
2b/2c block in `check-motion-bands.mjs` on a scratch copy, runs CI's `--self-test`, restores the gate (`cmp` 0 every row):

| id | the mutation | `--self-test` exit | reading |
|---|---|---|---|
| D1 bound−ε | `r.ms >= was` → `r.ms >= was - 1` | 1 | pinned (the 299 ms row) |
| D2 disjunct | drop `r.longhand \|\|` | 1 | pinned |
| **D3 disjunct** | drop `r.fam === "animation" \|\|` | **0** | **unpinned**: no row reds only it, no unreachability reason stated |
| **D4 disjunct** | drop `\|\| kr.term === r.term` | **0** | **unpinned AND live**: see C28 below |
| D5 guard | delete `if (r.scoped && r.file !== file) continue;` | 1 | pinned (the Other.vue NEG-NEG) |
| D6 guard | `carried(el)` → `el` (opaque bindings carry everything) | 1 | pinned |
| **D7 fallback** | `catch { hit = true }` → `hit = false` | **0** | **unpinned**: the over-red fallback for an unreadable selector has no row |
| **D8 guard** | drop `kr.fam !== r.fam` | **0** | **unpinned**: no cross-family NEG-NEG |

**D4 is a door, not a style point.** Plant C28 (`html .gallery-fade-leave-active { transition: opacity var(--motion-whisper)
var(--verb-layDown-ease) }` in index.css, a 150 ms compound override of the 200 ms banked App.vue site): the intact gate reds it
(`lint:bands` 1, subject-reach), the D4-mutated gate passes it **with its own self-test GREEN** (`logs/dsab/c28.tsv`: intact 1,
D4 0). A one-token edit to the gate removes the transition half of the compound-override ratchet and nothing in the gate notices.
Four of eight guard/disjunct mutations survive the self-test; the clause battery's 23/23 does not license the clause's internals.

## 4 · The class, not the plants: the critic's C-plants (`instruments/plantc.py`, bare exits in `logs/kb-*/battery.tsv`)

Each plant applied to a scratch copy of the bank (`ksnap*`), CI's own invocations run bare (`lint:bands` = `--self-test`,
`lint:motion`, `lint:verbs`), every planted file restored and `cmp`-checked, then a whole-`src/` diff against the bank (0).
PROPOSED arm = the bank + `PROPOSED-shape-census-clock-context-obj-bracket.diff` (applied with `patch -p1`, 2 files).
Painted rows: each plant built out of tree to its own dist and served on :4246 beside the control on :4247 (control spec exit 0
on every run, `index-CubiZsMVSwTc.js`, 0.3 s / 300 both engines both viewports), read by `spec/critl9.spec.mjs` after a fresh deal.

### 4a · CI-GREEN escapes that PAINT the reveal shorter or gone, both engines × 1440×900 and 390×844

| plant | what ships | bands | motion | verbs | PROPOSED bands | painted (chromium & webkit, both viewports) |
|---|---|---|---|---|---|---|
| **C6** | BoardHost's `<component :is=cell … :style="{ 'animation-duration': '150ms', … }">` (a template `:style` key, falls through to DigitCell's root) | **0** | **0** | **0** | (row pending, §4d) | `animationDuration` **0.15 s**, effect **150 ms** ×4 (`index-DjP0u5TW7c18.js`) |
| **C13** | `.game-cell { animation-timing-function: steps(1, end) }` (index.css) | **0** | **0** | **0** | — | the reveal's curve **`steps(1)`** ×4: a 300 ms hold then a pop (`index-78X-W-s_JsuY.js`) |
| **C14** | `.game-cell { animation: none }` (index.css) | **0** | **0** | **0** | — | `animationName` **none**, no CSSAnimation ×4: the reveal is DELETED (`index-DNWjewpZKllK.js`) |
| **C21** | DigitCell `Object.assign(vars, { "animation-duration": "50ms" })` (K1's class, a second spelling) | **0** | **0** | **0** | **0** | **0.05 s / 50 ms** ×4 (`index-D95Z2z_-dmlo.js`) |
| **C23** | DigitCell `vars["--reveal-delay"] = "-150ms"` (a negative delay: half the reveal skipped) | **0** | **0** | **0** | **0** | duration 300, delay **−150**, active **150 ms** ×4 (`index-DBPdcp3ugyLl.js`) |

C6 is the K1 class's TEMPLATE arm: `scriptDurations()` reads `sfc(text).scripts` only, so a `:style` binding in a template is
outside the universe (the K15 clause reads `:style` keys for rungs; the duration clause does not). C21 (and C19 a computed key
`vars[["animation","duration"].join("-")]`, C22 a camelCase dot write `vars.animationDuration`, both 0 on both arms) shows the
K1 cure is a SPELLING cure: PROPOSED `obj-bracket` reads the one bracket shape K1 used and nothing beside it. C13 and C14 show
element reach keys DURATION terms only: a curve or a deletion on the banked element is not a site the ratchet values, and
C14 deletes the very animation the title claim protects with every gate at 0. C23 and C3 are K23's class (effective time cut
while the duration holds): C3 (`.game-cell { animation-delay: -150ms }`, painted active 150 ms ×4, `index-7nUWNSfBN9nR.js`)
is caught by `lint:verbs` only, as an incidental "number typed instead of a rung"; C23 escapes every gate.

**C27 survives the PROPOSED arm too.** DigitCell `vars["animation-duration"] = \`${MOTION.rungs.whisper}ms\`` (K1's exact
bracket spelling, the value a BARE clock hole): bands **0** on the bank AND on PROPOSED (`obj-bracket` reads it; the gate then
HOLDS it, because "a hole that is a BARE clock read is the TS roster's"), motion 0, verbs 0; painted **0.15 s / 150 ms** ×4
(`index-k1DmxPp5lFID.js`). The roster ratchets a consumer's count and value at its OWN site; a new consumer that lands on a
banked CSS element is a shortening of that element's clock, and neither the roster nor element reach keys it. The
`stopTheClock` cure (lane incident 4) is the over-red's cure, not this miss's.

### 4b · PROPOSED arm, the lane's claims re-derived

K1 **1**, K11 **1**, K12 **1**, K14 **1**, K16 **1**, K17 **1** on PROPOSED (`logs/kb-prop/battery.tsv`), NONE 0: the lane's PROPOSED
column reproduces. Beside them on the same arm: C6 0, C19 0, C21 0, C22 0, C23 0, C27 0. Row 5 is a closure of the five
spellings the pass-8 critic typed, not of "the consumer's value".

### 4c · Plants the gate DOES catch (the cure is real where it reaches)

C5 (`index.html` `<style>` `.game-cell` 150 ms) bands **1** (B1 + element-reach: index.html RULES are read; the cut is index.html
ELEMENTS). C7 (`setProperty(\`--motion-${rk}\`, "10ms")`, const-carried key) bands **1** (B3: the library folds the const).
C8 (`style.cssText += "--motion-leave: 10ms"`) **1**. C9 (`calc(var(--motion-leave) * 0.25)`) **1**, C10 (`calc(… - 150ms)`) **1**.
C11a (`.game-cell { animation-duration: 299ms }`) **1**, C11b (300 ms) bands **0** (verbs 1 on the literal): the bound edge reproduces.
C28 (§3) **1** on the intact gate.

### 4d · K7r's own class comes back CI-GREEN: a parent's `<style scoped>`, and a class that falls through

The gate's element universe is each SFC's OWN template; `landsOn` holds a scoped rule to its own file. Vue's scoped CSS stamps a
child component's ROOT with the parent's scope id, and a non-prop `class` on `<component>` falls through to that root
(BoardHost's own comment says DigitCell is single-root with no `inheritAttrs: false`). Both put a rule on DigitCell's root that
the gate cannot see. The longhand forms paint and escape `lint:bands`; `lint:verbs` reds them only for the missing curve:

| plant | where | bands | motion | verbs | painted |
|---|---|---|---|---|---|
| C1 | BoardHost `<style scoped>` `.game-cell { animation-duration: var(--motion-whisper) }` | 0 | 0 | 1 (curve) | **0.15 s / 150** ×4 both engines (`index-BCG8tcncNElM.js`) |
| C2 | BoardHost scoped `:deep(.game-cell) { … }` | 0 | 0 | 1 (curve) | — |
| C17 | `class="cell-quick"` on BoardHost's `<component>` + index.css `.cell-quick { animation-duration: var(--motion-whisper) }` | 0 | 0 | 1 (curve) | **0.15 s / 150** ×4 both engines (`index-Caf3Qh8L6Hii.js`) |
| **C1y** | BoardHost scoped `.game-cell { animation: cell-reveal var(--motion-whisper) var(--verb-layDown-ease) }` | **0** | **0** | **0** | `animationDuration` **0.15 s** on the reveal cell (chromium 1440 + 390; webkit rows timed out, below) |
| **C17y** | the class fall-through, same declaration | **0** | **0** | **0** | **0.15 s** (chromium 1440, webkit 1440 + 390; chromium 390 timed out) |
| C1x / C17x | the same with `var(--ease-anticipatePop) backwards` | **0** | **0** | **0** | — |
| CK7ry | the SAME declaration in index.css on `.game-cell` (K7r's site) | **1** | 0 | 0 | — (the lane's cure earns this row: bands is the only gate that reds it) |
| **C24y** | index.css `.game-cell { --cq: 150ms; animation: cell-reveal var(--cq) var(--verb-layDown-ease) }` (a LOCAL token) | **0** | **0** | **0** | §4e |

CK7ry beside C1y is the point: one declaration, one element, one paint; moved from index.css into the parent component's scoped
block (or onto a forwarded class) it leaves every CI gate at 0. The 'K7r in ANOTHER file's `<style scoped>`' NEGATIVE-NEGATIVE
row pins this miss as lawful: its fixture renders a bare `<p>`, never a child component, so it cannot tell "another file" from
"the parent of the banked element". The timed-out rows are a spec limit, not a paint doubt: the shorthand lands on every cell
and the 150 ms reveal clears `.cell-reveal-animated` on `animationend` before a raf poll catches it in that arm (spec exits 1).

### 4e · The pass-8 K plants, run FIRST on the bank (CI's three gates bare; `logs/kb-bank/battery.tsv`)

| plant | bands | motion | verbs | lane's bank column | | plant | bands | motion | verbs | lane's bank column |
|---|---|---|---|---|---|---|---|---|---|---|
| NONE | 0 | 0 | 0 | 0 | | K12 | 0 | 0 | 0 | 0 |
| K1 | **0** | 0 | 0 | 0 | | K13 | 1 | 0 | 0 | 1 |
| K2 | 1 | 0 | 0 | 1 | | K14 | **0** | 0 | 0 | 0 |
| K2b | 1 | 0 | 0 | 1 | | K15 | 1 | 0 | 0 | 1 |
| K3 | 1 | 0 | 0 | 1 | | K16 | **0** | 0 | 0 | 0 |
| K4 | 1 | 0 | 0 | 1 | | K17 | **0** | 0 | 0 | 0 |
| K5 | 1 | 0 | 0 | 1 | | K18 | 1 | 0 | 1 | 1 |
| K6 | 1 | 0 | 0 | 1 | | K23 | **0** | 0 | 0 | 0 |
| K7 | 1 | 0 | 1 | 1 | | K7r | 1 | 0 | 1 | 1 |
| K8 | 1 | 0 | 1 | 1 | | K7s | 1 | 0 | 1 | 1 |
| K9 | 1 | 0 | 1 | 1 | | | | | | |
| K10 | 1 | 0 | 1 | 1 | | | | | | |
| K11 | **0** | 0 | 0 | 0 | | | | | | |

The lane's bank column reproduces row for row. Seven of the pass-8 critic's eighteen plants plus K23 still ship CI-green on the
bank (K1, K11, K12, K14, K16, K17, K23; prettier not re-run here). K7r and K7s were ALREADY red through CI at the open tree via
`lint:verbs` (the lane's open column: verbs 1); the batch gate's "K7r RED through CI" was met before this pass's gate moved.
What this pass adds is that `lint:bands` reds it for the RIGHT reason (CK7ry: bands 1, verbs 0).

**C24y painted:** `animationDuration` **0.15 s** on the reveal cell ×4 (chromium & webkit, 1440×900 & 390×844; `index-CZEz0XSPggC1.js`,
spec exit 0). A local custom property carrying a length is "valued at its own CSS site" in the prose and valued nowhere in the
ratchet: the element-reach row reads `var(--cq)` as no clock. (C26, the same length as a `var()` FALLBACK, reds 1: the miss is
the declared-local arm only.)

**§3 addendum — D4 is a CI door.** C28 above is also red in `lint:verbs` (direction: layDown on a leave). C28y spells the curve
the house way (`var(--verb-lift-ease)`): intact gate bands **1**, motion 0, verbs **0** — `lint:bands` is its only gate — and the
D4-mutated gate passes it with its self-test GREEN (`logs/dsab/C28y.tsv`: intact 1, D4 0). The term disjunct is load-bearing,
CI-exclusive, and unpinned.

## 5 · Constraints

- **π / AA / filterBudget:** the bank moves 0 served bytes against VERB's pass-8 tree (dist identity re-derived, 44 files), so
  π vs `74a2b5d9` is VERB's pass-8 movement, AA cannot move, filterBudget 9. Not re-photographed: no pixel is this pass's.
- **M16:** no product string (`src/` untouched by the bank; the 13-path delta is scripts + e2e libs + knip.json).
- **@property law:** untouched (the registration is read, not written; `rung-publishers` exempts index.css's `@property` only).
- **The ONE library:** homes v2 landed by sha, 13/13 blob-equal; no import from `docs/`; extensions filed as PROPOSED, not forked.
  The gate imports `scripts/shape-census.mjs` by relative product path.
- **Ballot pair on one payload / frames:** none filed, none owed (a gate pass). Frames charged: 0 B.
- **CHAIR §11 (KEYWORD_TWINS):** met. KT-1…KT-4 live in `RUNG_LEDGER` inside the gate, `docs/tranches/LEDGER.md` untouched (the
  bank's only non-`web/frontend` path is `.github/workflows/ci.yml`, carried from pass 8). `ledgerBound` closes KT↔twin both ways.
  **FIT-1 is consumer-less:** `ledgerBound` filters `/^KT-/`, and no clause reads `RUNG_LEDGER`'s FIT-1 (FIT_WRITERS is its own
  table); deleting the row changes no exit. A minted fallback row nothing reads is prose in an array.
- **Batch gate:** "LADDER's K7r RED through CI" — MET (bands 1 and verbs 1; it was verbs-red at open already). FACE's ring on s10
  and TAPE's dirty narrowing are other lanes' rows; not judged here.

## 6 · Gaps (the critic's list; §0 points here)

1. **THE TITLE CLAIM FAILS THROUGH CI AN EIGHTH TIME, painted both engines.** K7r's class (a second rule on the banked element)
   is cured for its plants, not its class (registry-v8 §2.12 ⇒ OPEN): C1y (parent's `<style scoped>`) and C17y (a fall-through
   `class` on `<component>`) ship the reveal at 150 ms with bands/motion/verbs 0. Element reach must follow the COMPONENT tree:
   a scoped rule lands on its own elements AND on the root of every child component its template renders; a non-prop `class`
   on a component tag lands on that component's root. The Other.vue NEGATIVE-NEGATIVE must render a child to stay honest.
2. **K1's class is cured for one spelling.** C6 (a template `:style` key; `scriptDurations` reads `<script>` only) paints 150 ms
   with every gate 0 on BOTH arms. C21 (`Object.assign(vars, {...})`, painted 50 ms), C19 (computed key), C22 (camelCase dot
   write) read 0 on both arms. C27 (`vars["animation-duration"] = \`${MOTION.rungs.whisper}ms\``, painted 150 ms) is K1's own
   spelling with a bare clock hole: PROPOSED reads it and the gate then HOLDS it as "the roster's". Row 2 is OPEN on the bank
   and on PROPOSED.
3. **Row 5 is cured for five spellings** (K11/K12/K14/K16/K17 red only on PROPOSED), never on the bank; its closure waits on a
   batch-0 fold that has not happened. On the bank, K11/K12/K14/K16/K17 + K1 + K23 still exit 0 in every gate.
4. **Only durations are on the ladder's element.** C13 (`steps(1, end)` on `.game-cell`: the reveal becomes a 300 ms hold and a
   pop) and C14 (`animation: none`: the reveal deleted) are CI-green and painted ×4. The idea says "every duration AND curve a
   rung"; a curve or a deletion on a banked element is not valued by element reach.
5. **Effective-time cuts escape** (K23's class, the lane's own gap 8, wider than stated): C23 (script `--reveal-delay: -150ms`,
   painted active 150 ms ×4) exits 0 everywhere; C3 (CSS negative delay) is caught by `lint:verbs` only, incidentally.
6. **A local token carries a length past the ratchet** (C24y, painted 0.15 s ×4, all gates 0).
7. **Disjunct/guard sabotage not run by the lane; four of eight survive** (D3, D4, D7, D8). D4 is a live CI door (C28y).
8. **`own-gate.diff` is cited in BANKED.txt and not banked**; the banked ladder delta does not apply to `f1c9c3fe` (exit 1). The
   §K row "apply --check on your section's integrated tree" rests on an artifact a reader cannot fetch. (Re-cut here: 0 →
   `2250db29`, so the claim is true; the bank is incomplete.)
9. **FIT-1 is consumer-less** (§5). Rows 8 and 9 are OPEN by the lane's own account (VERB's numbers; VERB not yet banked);
   row 19 struck (no `--storybook-*` on tree or union, grep 0 — re-derived). Door 6a priced, not closed.
10. **The gate's cost** rose ~9× (lane's own number, not re-timed here); `tokenSites` ×8 un-memoized.
11. **README §7 sits after §9** and §0's "K12/K14/K17 red only prettier" is the plant's spelling, not a closure (the lane says so).

## 7 · The number

**82** (from 83; the lane's own pass gains are real and are credited: K3, K15, K7r/K7s red by bands for the right reason —
CK7ry is the proof — C5/C7/C8/C9/C10 red, the 140/40 self-test and the 23/23 clause battery reproduce, the WAVE union reads 0,
0 served bytes, CHAIR §11 met). It does not rise because the charter's rows 1, 2 and 5 close their PLANTS and not their CLASS:
nine CI-green plants paint the reveal shorter, slower-to-start or gone in both engines at both viewports (C1y, C17y, C6, C21,
C27, C23, C24y, C13, C14), two of them K7r's own declaration moved one file up the component tree. It drops one because the
new clause's internals were shipped unsabotaged (four of eight disjunct/guard mutations survive, one a live door) and a
NEGATIVE-NEGATIVE row encodes the parent-scope miss as lawful. **Verdict: ADVANCE** — the idea is not dead (where element reach
reaches, it is the only gate that holds: CK7ry, C28y), and the cure is a component-tree universe plus template-binding and
local-token valuation, not a new idea.

## 8 · Incidents (self-declared)

1. **A contaminated first K battery.** `kbat.sh`'s restore list omitted `AttributionCard.vue`; K5's edit persisted, so K6's anchor
   went missing (exit 3) and K7…K11 read on a K5-planted tree (K11 bands 1, falsely). Found at K11, the battery was stopped by its
   recorded PID (64058, command checked), `AttributionCard.vue` and a half-planted `App.vue` restored from the bank, the whole
   `web/frontend` diffed clean against the bank, the restore list fixed plus a closing whole-`src/` diff row, and the full K
   battery re-run from NONE. The bad table is kept as `logs/kb-bank-CONTAMINATED.battery.tsv`; no number here comes from it.
2. **A `git apply` that applied nothing.** In a scratch copy nested under the repo, `git apply` resolved the enclosing repo and
   ignored every path (exit 0, 0 bytes moved); caught by `diff -rq`, re-done with `patch -p1`. No path outside the copy moved.
3. **One control server outlived its run** (kill_own read the first of two recorded listener PIDs). Its cwd was checked by hand as
   the control tree and its PIDs as this critic's (80694/80607), and it was killed; the helper now reads the latest PID.
4. **One shell `&`** (the C6 build, inside a backgrounded call); its exit is read from `logs/builds.exits` (`bc6 build 0`).
5. **The C1y/C17y spec arms exit 1** on two and one rows (raf poll misses a 150 ms class); rows that landed are reported, the misses
   are named in §4d.
6. Several responses carried one tool call each; none ran a foreground command past 120 s. Loads at every timing/paint row 20–69.
   No rm, commit, commit-tree, update-ref, push, stash; no git on main or in the control tree (git ran only against the §13
   worktree's object store through temporary indexes under the scratch dir, and `git init` in four build copies). Nothing banked.

## 9 · Replay

Scratch root: the durable lane dir `crit-MOT-LADDER`. `bank/` = `checkout-index` of `74a2b5d9 + pass9.diff` (= `7b2e2839`),
`wave/` = `acb9c08e + homes.on-WAVE + pass9.delta.on-WAVE` (= `babea79d`), `kprop/` = `bank/` + the PROPOSED diff (`patch -p1`),
`node_modules` symlinked to main's. Then:

- `run1.sh` — `lint:bands` on bank and union, `--sabotage-battery` on bank (`logs/run1.exits`: 0, 0, 0; 140/40 both trees; 23/23).
- `kbat.sh <fe> <tag> <plants…>` with `plantc.py` (critic plants) and the pass-8 critic's `plantk.py`/`plantk2.py` (copied, read
  whole) — `logs/kb-<tag>.battery.tsv` (plant exit, bands, motion, verbs, restore cmp, load; closing whole-tree diff row).
- `dsab.sh` + `dsab.py` — the eight disjunct/guard/threshold mutations (`logs/dsab/dsab.tsv`); `d4plant.sh` (PL=C28y) the D4 door.
- `build1.sh <dir> <plant>` then `behave.sh` (ARMS=…) with `critl9.spec.mjs` + `pw.config.mjs` — control :4247, arm :4246, PIDs in
  `logs/behave-pids.txt`, rows in `logs/behave.jsonl`, exits and loads in `logs/exits.txt`.
