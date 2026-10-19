# MOT-LADDER · pass 9 PROTOTYPE (§13, batch 3, ran FIRST on the one §13 tree)

Tree `.claude/worktrees/wf_f72f3b5a-83a-59`, advanced in place. At open its temporary-index write-tree was
**`8c12b15c`**, VERB's pass-8 BANKED tree to the byte: no difference to declare. Homes v2 was applied by sha
(`homes.diff` sha1 `1f70cfda`), its 13 paths landed byte-equal to `74a2b5d9 + homes.diff` (temporary index, exit 0).
The pass-8 residual home edits (LADDER's four `shape-census` clauses, VERB's hand-rolled `paint-lib.d.mts` /
`postpaint.d.mts`, `knip.json`'s pass-8 cite line) were STRIPPED by that landing, and homes v2 carries LADDER's
four clauses itself. The originals sit in the lane's trash. The one product file this pass edits is
`web/frontend/scripts/check-motion-bands.mjs`. Two library extensions are filed as **PROPOSED**, not banked.

The number is the critic's. This README holds the lane's readings.

## 0 · Gaps first

1. **K1, K11, K12, K14, K16, K17 are RED only with the PROPOSED library diff.** On the bank (homes v2) they still
   exit 0 through every ladder gate (K12/K14/K17 red only prettier, on the plant's spelling). The cure is the ONE library's: `obj-bracket` (K1) and `clock-context` (K11/K12/K14/K16/K17)
   in `PROPOSED-shape-census-clock-context-obj-bracket.diff`. The gate already consumes both, so it reds them once the
   chair folds the diff, with no gate change. The two union lines and the two tree lines that `clock-context` newly reads are
   admitted as **dormant** `ctx: true` ADMITTED_ARITH rows. A dormant row is exempt from STALE while the library lacks the
   field, and it is live (and STALE-checked) once the field is there.
2. **Element reach reads SFC templates only.** `index.html`'s elements and elements a component's `class` prop
   forwards to its child root are not in the universe. An opaque `:class`/`v-bind` (one that MAY carry any class)
   is read as carrying only the literals it names (`carried()`), so a rule that reaches an element only through an
   opaque binding is not a reach. This is a declared cut: without it, every rule would reach every `dynClass` element.
3. **Element reach ignores the cascade's tie-breakers.** Specificity, layer and order are not used, so a new rule that
   lands on a banked element and LOSES the cascade still reds (an over-red, never a miss). On the WAVE union this
   read 0 such rows once the full selector was carried (incident 3).
4. **`clamp()` reads at its FLOOR** (the R4 lower bound, the ONE library's `lengthPx`). So `clamp(10ms, var(--motion-leave),
   300ms)` reds at 10 even though, with no viewport unit in it, it paints at 200. The edge rows pin `clamp(200ms, …)` HELD.
5. **Door 6a is open, priced below (§5).** The consumer roster's floor is the stamp.
6. **Row 8 / INTAKE-23 row 17 (`DRAW_IN_PRESETS.*.duration` beside `MOTION.hand.serial`) is VERB's design on the one tree.**
   It is declared OPEN with the tree's numbers, and VERB's pass-9 number comes after this bank (§6). **Row 9's take of VERB's hinge
   row and boot-hand spec "after VERB's pass-9 bank"** is OPEN by construction, since LADDER ran first. **Row 19** is unchanged:
   the tokens do not exist on the tree, so C1–C6 cannot run.
7. **The K7s/K7r PRETTIER column reads 0.** The plants are formatted CSS, so prettier was never the closure.
8. **K23 escapes both arms.** A keyframe stop pulled from 60 % to 6 % shortens a phase's effective time while the
   duration holds. The ratchet values durations and never keyframe offsets. The cure is a keyframe-offset term in the
   site key, which is a new clause and is not taken this pass.
9. **The gate's tree half is ~9× slower than pass 8's** (§8 incident 10).

## 1 · The charter's rows (each closed on the bank, closed only with PROPOSED, or open with its number)

| row | state | how (all in `scripts/check-motion-bands.mjs` unless named) |
|---|---|---|
| 1 · B6 on the ELEMENT (K7r, K7s) | **CLOSED on the bank** | New clause `element-reach` (2c). `estateElements()` reads every shipped SFC template through the ONE library's `templateElements`. A new site and a banked site that may land on ONE element (`mayMatch` on each row's FULL selector, with scoped rules held to their own file) are one clock: a new site there below the banked length reds. K7r/K7s red `lint:bands` through CI's own invocation (§2). The behavioural row is in §3: the K7r build paints 0.15 s / 150 ms in both engines at both viewports, which is what the gate now refuses. |
| 2 · script DURATION writes (K1) | **CLOSED for every shape homes v2 reads; K1's exact spelling only with PROPOSED `obj-bracket`** | New clause `script-durations`. Every `scriptWrites` site of `animation[-duration]`/`transition[-duration]` in shipped script is valued. A length (unadmitted), a rung inside a script string, or a computed hole that is not a bare clock read reds. Keyframe names, local tokens, `0s`/`1ms` and a bare `${MOTION…}` hole (the TS roster's) hold. `vars["animation-duration"] = "50ms"` is a bracket write on a plain object, which homes v2's `scriptWrites` does not read, hence the PROPOSED clause. |
| 3 · B3 reads SCRIPT rung publishers (K15) | **CLOSED on the bank** | New clause `rung-publishers` (B3). Every non-registration site the ONE library's `tokenSites` reads for each `--motion-<rung>` is a second home: script `setProperty`, a `:style` key, Typed OM, or a sheet or SFC declaration. Computed keys are UNRESOLVED and counted, never charged. |
| 4 · CSS arithmetic on a banked site (K3) | **CLOSED on the bank** | New clause `css-arith`. A rung read inside `calc()`/`min()`/`max()`/`clamp()` is valued at the function's LOWER BOUND by the ONE library's `lengthPx` (R4's bound, with times carried as px). The site ratchet and the subject/element reach then read that value. Edge plants at bound−1 ms RED, at bound HELD, at bound+1 ms HELD. |
| 5 · TS consumer VALUE (K11 K16 K17 K12 K14) | **CLOSED only with PROPOSED `clock-context`** | The gate's B13 reads `ctx` from `clockReads` (`!!r.ctx`). Homes v2 has no `ctx`, so the five plants exit 0 on the bank. With the PROPOSED diff, all five red B13 (§2). |
| 6 · knip | **CLOSED as a count** | `lint:knip` exits 0 on the tree; the inherited `cubicBezier` red is gone (VERB's pass-8 un-export). The library entry is the chair's homes `knip.json` and is not this lane's to strike: 76 exports, **17 consumed** on this tree, **59 entry-kept**, listed by name in `logs/row6-exports.txt`. |
| 7 · the four KEYWORD_TWINS | **MINTED** (CHAIR-RULINGS §11) | `RUNG_LEDGER` holds KT-1…KT-4 (subject, value, ruling, why, re-trigger). Each twin carries `row` and `chair`. A minted twin KEEPS its ceiling: the mint names a twin and never frees it. `ledgerBound` closes the ledger both ways and has a plant and a negative. The verdict line no longer prints "awaiting". |
| 8 · INTAKE-23 row 17 | **OPEN (VERB's design, one tree)** | `DRAW_IN_PRESETS` gridFrame 350 / gridSubgrid 280 / gridCell 200 / glyph 350 ms sit beside `MOTION.hand.serial` {frame: throw 520, subgrid: note 250, cell: whisper 150}. Two homes that disagree on every tier. Row 19's tokens: `--storybook-*` is absent on the tree AND on the WAVE union (grep 0), so C1–C6 cannot run; the row is struck for this pass with that reason. |
| 9 · VERB's hinge row + boot-hand spec, by sha after VERB's pass-9 bank | **OPEN by construction** | LADDER banks before VERB opens. Row 9's fallback (the `--live-fit` row) is MINTED as `RUNG_LEDGER` FIT-1. |
| 10 · door 6a | **PRICED** (§5) | swap → `--bank` → re-stamp exits 0. |
| 11 · clause + threshold sabotage | **CLOSED** (§2) | four new gate clauses, each with a plant only it reds; edge plants at bound±ε for every numeric clause. |
| 12 · the WAVE union served | **CLOSED browserless** (§4) | `lint:bands` 0 on WAVE + homes.on-WAVE + this delta, self-test included, in both library arms. |

## 2 · The critic's K plants, bare exits (`instruments/ktree.sh`; `logs/kt-bank/`, `logs/kt-prop/`)

Open state = 8c12b15c + homes v2, every gate (`logs/k-battery-open-*.tsv`). Final = this bank's gate, the TREE half
(`check-motion-bands.mjs --list`, no self-test) for every plant, plus CI's whole `npm run lint:bands` for the
headline plants (`-` = not run there). Only the gate file moved between open and final, so the open state's
verbs/motion/tokens/eslint/prettier columns stand for the final tree. Every plant applied (exit 0) and every
planted file was restored byte-equal (`cmp` 0) on both arms.

| plant | open: bands verbs motion tokens eslint prettier | bank: tree-half | bank: CI | PROPOSED: tree-half | PROPOSED: CI |
|---|---|---|---|---|---|
| NONE | 0 0 0 0 0 0 | 0 | 0 | 0 | - |
| K1 | 0 0 0 0 0 0 | 0 | - | **1** | **1** |
| K2 | 1 0 0 0 0 0 | **1** | - | **1** | - |
| K2b | 1 0 0 0 0 0 | **1** | - | **1** | - |
| K3 | 0 0 0 0 0 0 | **1** | **1** | **1** | - |
| K4 | 1 0 0 0 0 0 | **1** | - | **1** | - |
| K5 | 1 0 0 0 0 0 | **1** | - | **1** | - |
| K6 | 1 0 0 0 0 0 | **1** | - | **1** | - |
| K7 | 1 1 0 0 0 0 | **1** | - | **1** | - |
| K8 | 1 1 0 0 0 0 | **1** | - | **1** | - |
| K9 | 1 1 0 0 0 0 | **1** | - | **1** | - |
| K10 | 1 1 0 0 0 0 | **1** | - | **1** | - |
| K11 | 0 0 0 0 0 0 | 0 | - | **1** | **1** |
| K12 | 0 0 0 0 0 1 | 0 | - | **1** | - |
| K13 | 1 0 0 0 0 1 | **1** | - | **1** | - |
| K14 | 0 0 0 0 0 1 | 0 | - | **1** | - |
| K15 | 0 0 0 0 0 0 | **1** | **1** | **1** | - |
| K16 | 0 0 0 0 0 0 | 0 | - | **1** | - |
| K17 | 0 0 0 0 0 1 | 0 | - | **1** | - |
| K18 | 1 1 0 0 0 0 | **1** | - | **1** | - |
| K23 | 0 0 0 0 0 0 | 0 | - | 0 | - |
| K7r | 0 1 0 0 0 0 | **1** | **1** | **1** | - |
| K7s | 0 1 0 0 0 0 | **1** | **1** | **1** | - |

Escapes every gate on the bank: **K1, K11, K16, K23**. Escapes with PROPOSED: **K23**.
K12, K14 and K17 red only prettier on the bank (the plant's spelling, not a closure); they are counted as bank misses
in §0. **K23** (a keyframe stop pulled from 60 % to 6 %, the phase's effective time shortened while the duration
holds) escapes both arms: the ratchet values durations, never keyframe offsets (§0 gap 8).

### 2b · Clause sabotage (`--sabotage-battery`, `logs/tree-sabotage.log`)

- `subject-reach` → RED (2 self-test rows, first `B6 RATCHET`)
- `element-reach` → RED (3 self-test rows, first `B6 RATCHET`)
- `css-arith` → RED (3 self-test rows, first `B6 RATCHET`)
- `script-durations` → RED (4 self-test rows, first `B6 RATCHET`)
- `rung-publishers` → RED (2 self-test rows, first `B3 ONE HOME, NO FALLBACK`)
- `collect-sources` → RED (1 self-test rows, first `B6 RATCHET`)
- `lib-decls` → RED (2 self-test rows, first `B6 RATCHET`)
- `longhand-term` → RED (1 self-test rows, first `B6 RATCHET`)
- `consumer-roster` → RED (4 self-test rows, first `B6 RATCHET`)
- `arith-lib` → RED (5 self-test rows, first `B13 ARITHMETIC`)
- `curve-publishers` → RED (3 self-test rows, first `B8 CURVE`)
- `fit-one-writer` → RED (3 self-test rows, first `B3 ONE HOME, NO FALLBACK`)
- `knobs` → RED (2 self-test rows, first `B6 RATCHET`)
- `twin-ratchet` → RED (3 self-test rows, first `B8 CURVE`)
- `rung-ratchet` → RED (1 self-test rows, first `B6 RATCHET`)
- `site-ratchet` → RED (6 self-test rows, first `B6 RATCHET`)
- `orphan` → RED (2 self-test rows, first `B6 RATCHET`)
- `ts-ratchet` → RED (1 self-test rows, first `B6 RATCHET`)
- `floor-digest` → RED (1 self-test rows, first `B6 RATCHET`)
- `floor-derive` → RED (1 self-test rows, first `B6 RATCHET`)
- `hinge-derive` → RED (4 self-test rows, first `G-HINGE`)
- `hinge-curve` → RED (1 self-test rows, first `G-HINGE`)
- `hinge-present` → RED (1 self-test rows, first `G-HINGE`)

**SABOTAGE BATTERY: 23/23 clauses red the self-test when deleted**, exit 0.

The battery deletes each clause and re-runs `--self-test`; a clause no row reds would print HELD. The four new
clauses (`element-reach`, `css-arith`, `script-durations`, `rung-publishers`) each red on their own verbatim plant.
The earliest clauses ran on gate sha1 `da0c89d1`, before the last edit (`let hit`, the `LIB_CTX` row text) moved
it to `0dffc87c`. Both edits are null on the bank arm (self-test 140 RED / 40 HELD on both shas).
Numeric edges: K7r bound−ε 299 ms RED / 300 HELD; K3 −1 ms RED, at bound HELD, +1 ms HELD; `clamp` floor RED.

## 3 · The behavioural row (row 1): the reveal's computed duration, both engines × 1440×900 and 390×844

The pass-8 critic's `crit8.spec.mjs`, re-used whole (`instruments/ladder9-behave.spec.mjs`). A fresh deal arms the reveal,
and nothing is written into a Vue node. Rows are in `logs/behave.jsonl` and exits in `logs/behave-exits.txt`. Every arm
opened at a 1-min load under 120 (83.3 / 90.2 / 102.4). These are computed-value reads, not timing rows.

| arm (served id) | chromium 1440 | chromium 390 | webkit 1440 | webkit 390 | `--motion-leave` / attribution transition | spec exit |
|---|---|---|---|---|---|---|
| control `w7-control` :4247 (`index-CubiZsMVSwTc.js`) | 0.3 s / 300 | 0.3 s / 300 | 0.3 s / 300 | 0.3 s / 300 | — / 0.2 s | 0 |
| tree :4246 (`index-BZ0qqsnzl2cb.js`) | 0.3 s / 300 | 0.3 s / 300 | 0.3 s / 300 | 0.3 s / 300 | 0.2 s / 0.2 s | 0 |
| tree + K7r :4246 (`index-DGRXMkRgZ50g.js`) | **0.15 s / 150** | **0.15 s / 150** | **0.15 s / 150** | **0.15 s / 150** | 0.2 s / 0.2 s | 0 |

The K7r plant ships the reveal at half its banked length in both engines. That is the paint `lint:bands` now refuses
(§2: K7r bands **1**, through `element-reach`). All three servers were started by this lane and killed by recorded PID
after a cwd check (`logs/behave-pids.txt`: control 79129/79086, tree 79835/79780, K7r 81313/81258).

## 4 · Dist identity, π and AA

- A clean out-of-tree build of this tree (private cacheDir) and one of VERB's pass-8 tree `8c12b15c`, both under main's
  current `node_modules`, are **byte-identical on all 44 emitted files** (`index-BZ0qqsnzl2cb.js` / `index-DHs860g5jK_C.css`).
  This pass moves **0 served bytes**. So π vs `74a2b5d9` is VERB's pass-8 movement, unchanged, and AA cannot move.
  filterBudget is untouched (9). No utility class is minted (T9-R6): the served CSS is equal to the reference CSS.
- The identity differs from the pass-8 critic's `index-BHJMbOny6cIs.js` because main's `node_modules` moved at
  `4131e427` (vue 3.5.43 and the audit bumps). Both builds compared here were cut today under the same modules.
- M16: the pass adds no product string (`src/` untouched); `lint:copy` is in the pre-return battery.

## 5 · Door 6a, priced (row 10)

On a scratch snapshot of this tree (`instruments/door6a.sh`, exits in `logs/door6a-exits.txt`):

| step | `lint:bands` |
|---|---|
| 1 · App.vue beat 0 `MOTION.rungs.leave` → `MOTION.rungs.whisper` (a swap, 200 → 150) | **1** (consumer-roster: banked 2× at 200, now 1×, gained whisper 150) |
| 2 · `--bank` (re-writes `motion-bank.json`) | 0 |
| 3 · the gate as shipped | **1** (floor-digest: the bank digests to `852bffda…`, the gate holds `d2b74ee5…`) |
| 4 · re-stamp `BANK_SHA256` to `852bffda…` | **0**: the swap ships |

**The door's shape:** the consumer roster's only floor is the stamp, and a re-stamp is a reviewed one-line edit in the same
diff. **The row that closes it** (drafted for the chair, A.3 form): *subject* the `consumers` roster of `motion-bank.json`;
*value* re-derived off `BASE_REF` (the roster over `git show 74a2b5d9:` texts) the way `floor-derive` re-derives sites and TS
clocks; *rule* a banked consumer's count or value below the base's derivation reds unless a MOVED/DELETED/RETUNE row
`{ consumer }` names it; *re-trigger* any `--bank` that lowers a roster entry. It is not built this pass.

## 6 · PROPOSED for the chair (the ONE library; never in the bank)

`PROPOSED-shape-census-clock-context-obj-bracket.diff` (8,777 B, 2 paths: `scripts/shape-census.mjs` and `.d.mts`).
`git apply --check` exits 0 on homes v2's tree `d17813ba` and on WAVE + homes.on-WAVE `acde977b`.

- **`clock-context`.** `clockReads` returns `ctx` for a read that feeds a value-choosing context: `logical` (`&&`, `||`,
  `??`), `ternary` (the condition or an arm), `comma` (a grouping paren with a top-level comma), `indexed-literal`
  (an array literal followed by `[`/`.`) and `call-apply` (`.call(`, `.apply(`, `Reflect.apply(`). It returns `null` for
  a bare read, a call argument, an object value or a sum. The scan is bracket-depth-aware, and a newline is a boundary
  unless an operator continues the expression.
- **`obj-bracket`.** `scriptWrites` reads a literal-keyed bracket write on any object (`vars["animation-duration"] =
  "50ms"`). `.style[…]` stays the existing arm (no duplicate), and a computed key reads nothing.
- **Proof** (`logs/proposed-lib-*`): `--self-test` 138/138, clauses planted 85/85, exit 0. The born-RED is the same
  138 rows on the homes v2 library: 136/138, and exactly the two new rows FAIL. `--sabotage-battery` 85/85, exit 0.
  (A first born-RED run read 135/138 with `tw-palette` failing too. That was an artifact of the seed's location, with no
  `node_modules` beside it; re-run with the seed inside the tree, it reads 136/138.)
- **What the gate does with them, read on a snapshot with the diff applied** (§2, PROPOSED column): K1 reds `script-durations`,
  and K11/K12/K14/K16/K17 red B13. On the tree, `clock-context` newly reads 2 lines (`useFlipGlide.ts:148` `??`,
  `HandwrittenGlyph.vue:211` `||`). On the union it reads 2 more (`MarginNote.vue:305` PRM ternary, `gridPaths.ts:611`
  FIVE's slot ternary). Each line has a dormant `ctx: true` ADMITTED_ARITH row: the tree's in the bank, the union's in the
  on-WAVE delta only. With the diff applied, `lint:bands` exits 0 on the tree and on the union.

## 8 · Incidents (self-declared)

1. **Two tool calls in one response, twice** (the two `scopedAt` edits early in the pass, and once more later). The rule is one per response.
2. **Stall law, twice.** Two foreground commands ran past 120 s at a 1-min load of 110–120 (the self-test + WAVE chain; the
   door-6a script). The harness moved each to the background. Both were browserless and had no timing clause, and each
   was re-read from its own log.
3. **A truncation over-red, found on the union and cured before the bank.** The first element-reach read keyed on the bank
   key's 80-character selector. On the WAVE it cut `html.theme-turning …` mid-compound to a bare `.`, which reads as
   class-less, so GCP's `.section-heading` whisper "landed" on the theme turn's 350. Rows now carry the FULL selector
   (`fullSelector`/`sel`), and the union reads 0.
4. **A computed-duration over-red, found on the union and cured before the bank.** LEDGER's `stopTheClock`
   (`MarginNote.vue:226`, `still ? "0s" : \`${MOTION.rungs.whisper}ms\``) red as "COMPUTED". A hole that is a BARE clock
   read is the TS roster's, so it now holds. It is pinned as a NEGATIVE-NEGATIVE row, and a non-bare hole
   (`${MOTION.rungs.whisper / 3}`) is a RED row.
5. **The first reference build was invalid.** The pass-8 reference checkout had no `.git` root, so Tailwind's source scan
   took in everything (233 KB CSS against 97.5 KB). It was re-built with a git root and then compared byte-equal (§4).
   Two first builds failed for a missing `csp-solver/data` (the puzzle bank) in the snapshots, which was added.
6. **Batteries stopped by recorded PID.** The first K battery on a pre-final gate (PID 96972 / wrapper 96967, command
   checked) was stopped once the gate moved; its snapshot was restored by `cp`. `final.sh` (74007/74005) was stopped after
   its sabotage stage, because the parallel `final2.sh` ran the same remaining stages on the same final bytes. The full
   six-gate K battery (`final2.sh`, `kbattery`, `kbands`) was too slow at load 80–110 and was stopped by PID, along with
   four orphaned children (18674/18884/18540/18770, each cwd-checked as this lane's snapshot). It was re-cut as
   `ktree.sh` (§2): the gate's tree half for every plant, CI's `lint:bands` for the headline plants, and the other
   gates' columns from the open-state battery, which stands because only the gate file moved.
7. **A shell `&`, once.** The PROPOSED library's sabotage battery ran under a shell `&` in a dev snapshot, not under
   `run_in_background`. It wrote its own log, and its exit is read from that log.
8. **A bank-grep hit that is not a path.** `/tmp/lawful-copy` is a pass-8 plant literal (the `knobs` row:
   `knobFindings({ ROOT: "/tmp/lawful-copy" })`), not a scratch path. It is carried unchanged rather than re-spelt after the
   final batteries ran.
9. **No deletions, no commits.** No `rm` of any form; discards went to the lane's trash by `mv`. No commit, commit-tree,
   update-ref, push or stash. Git ran only in this lane's §13 tree (temporary indexes, `archive`, `checkout-index` into
   scratch) and in scratch repos (init + a depth-1 fetch of `74a2b5d9`). No git ran on main or in the control tree.
   Scratch lives under the durable scratch dir.
10. **The gate costs more.** The tree half takes 14 s user / 27.6 s real at load 63, against ~3 s at pass 8. Eight
   `tokenSites` passes (one per rung, for `rung-publishers`) dominate. Memoizing them in one pass over the files is the
   next cut; it is declared rather than taken, because the pass's numbers were read on these bytes.

## 9 · Replay route

Advanced in place, so there is no replay. To reproduce the bank: `git read-tree 74a2b5d9` into a temporary index and
`git apply --cached pass9.diff`, which gives the tree in BANKED.txt. Equivalently, `8c12b15c` + `pass9-ladder-delta.diff`.
For the union: `acde977b` (= `acb9c08e` + `pass9/instruments/homes.on-WAVE.diff`) + `pass9.delta.on-WAVE.diff`. The
instruments are in `instruments/`, and every script names its own paths:

- `snap.sh <name>` builds a scratch repo with the base fetched.
- `kbattery.sh <snap> <tag>` runs the critic's K plants (`plantk.py`/`plantk2.py`, pass-8 critique `instruments/`, read
  whole) through CI's invocations.
- `final.sh` / `final2.sh` run the self-tests, the sabotage batteries, both K arms and the WAVE self-test.
- `wavesync.sh` + `wave-extra.py` build the union arm.
- `door6a.sh`, `builds.sh` / `build1.sh`, and `behave.sh` with `ladder9-behave.spec.mjs` + `pw.config.mjs`.
- `prereturn.sh` and `unit.sh` run the pre-return and unit batteries.
- `prop1–3.py` produce the PROPOSED library from homes v2.

## 7 · Pre-return battery, bare (`instruments/prereturn.sh`; exits in `logs/prereturn-*.tsv`), and the unit battery

The CI frontend lint lanes, in CI's own invocations, on this tree at the final gate bytes (`0dffc87c`). Every row is
**0**: `lint:eslint`, `lint:knip`, `lint` (prettier), `test:font-coverage`, `lint:ink`, `lint:catch`, `lint:theme-selectors`,
`lint:theme-tokens`, `lint:tdz`, `lint:lanes`, `lint:sleep`, `lint:motion`, **`lint:bands`**, `lint:verbs`, `lint:copy` (M16),
`lint:live-regions`, `test:support-floor`, `test:e2e:projects`, `lint:boundary`, `check-pw-projects`, and `eslint .
--max-warnings 0` (22/22). The control column (a `git archive 74a2b5d9`) is in the table at §7b.

Unit (`instruments/unit.sh`): `vue-tsc -b` **0**; `typecheck:e2e` **0**, so homes v2's typed declarations satisfy VERB's
three `e2e/lib` consumers (boot-hand, fold-verb, frame-halfstroke). vitest by directory: `src/games` 57 files / 741 tests,
`src/pencil` 11 / 96, `src/composables` 3 / 16, all passing (**71 files, 853 tests**). `src/lib` and `src/assets` hold no
test file, and vitest exits 1 on "no test files", which is not a failure. The pass touches no `src/` byte.

### 7b · The control's exit beside every pre-return row (`git archive 74a2b5d9` of `web/frontend web/relay scripts .github csp-solver/data`)

Control 0 on 19 of 22 rows. The three 1s:

- `lint:bands` **1** and `lint:verbs` **1**: the gates are absent at `74a2b5d9`, as at pass 8.
- `test:support-floor` **1**: clause 5 "README.md is unreadable". The archive carries no root `README.md`, so this is an artifact
  of the archive's path list, not a control defect.

The tree is 22/22 at 0.
