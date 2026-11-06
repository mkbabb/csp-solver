# ACC-SIX · pass 10 · CRITIQUE (§3 accent; the critic did not write the charter or the prototype)

Critic lane `crit-ACC-SIX`; ports `:4237` (rig) and `:4250` (control `74a2b5d9`, `index-CubiZsMVSwTc.js`, CSS 93,634 B,
asserted from the served HTML in every run). Every server ran INSIDE its battery's guarded call and stopped with it.
Logs: `logs/` beside this file (copied from the lane's durable scratch). The number at the foot is the critic's.

## 1 · The bank, re-derived (no git on main or in the control tree; temporary indexes and git-inited archives only)

| check | reading | verdict |
|---|---|---|
| work tree `wf_f72f3b5a-83a-45` through a temporary index | HEAD `74a2b5d9`, `write-tree` = `a9065995` (39 files +17468/−160 vs 74a2b5d9, homes included) | = BANKED.txt |
| `74a2b5d9` + `homes.diff` (`07257854`) via temporary index | `ac862f1e` | = declared base |
| `git diff --binary ac862f1e a9065995` | sha1 `ca856344`, 322,743 B, 26 files +5775/−159 | = `pass10.diff` on disk (sha1 re-hashed) |
| home paths ∩ bank paths (13 × 26) | 0 | no residual home edit |
| pass-10 advance: `74a2b5d9` + `pass9.diff` (`bfb5a658` → `84e1f198`) + `homes.on-WAVE` 3way (→ `df69e7d8`) vs `a9065995` | 3 files +282/−13: `e2e/count-yield.spec.ts`, `e2e/wash-step.spec.ts`, `src/pencil/grid/gridPaths.partial30.six.test.ts` | = the on-WAVE delta's paths; **no product source byte** |
| `pass10.delta.on-WAVE.diff` | sha1 `57845ba5`, 23,302 B, 3 paths | = BANKED.txt |

`git apply --check`, each in a fresh `git archive 74a2b5d9` that was `git init`-ed first (log `logs/mk-archives.log`; every
line prints the resolved git dir, which is the archive's own `.git`, never main's):

| tree (archive tree id) | `pass10.diff` (26) | `pass10.delta.on-WAVE.diff` (3) |
|---|---|---|
| `74a2b5d9` bare | **0** | 1 (expected: the specs are WAVE-born) |
| `74a2b5d9` + homes.diff (`7e0d4236`) | **0** | — |
| WAVE bare (`044284b5`) | 1 (expected: the bank is a 74a2b5d9 tree) | **0** |
| WAVE + homes.on-WAVE (`72b7ad67`, the DECLARED base) | — | **0**; applied → `50d702f2` = BANKED's result |
| s13-s7-s3 bare (`e33d791d` = 2f11714f's tree) | 1 (as above) | **0** |
| s13-s7-s3 + homes.on-WAVE (`30af7d01`) | — | **0** |

Every archive id equals the lane's. The applied union's two specs are `cmp`-equal to the work tree's. Rig builds from
those archives (each with its `.git`, Tailwind bounded) reproduce the lane's identities: union `index-B3AhQX0wXIN4.js`
CSS 112,462 B, tree `index-CCBUYCA7IyOU.js` CSS 95,370 B, `noseat` `index-25rXm24Y1yAw.js`, `len32` `index-cpcucSPaR6H1.js`.

## 2 · Browserless rows, re-read by the critic (each `guarded --light`, exit read bare)

| row | tree read | reading | note |
|---|---|---|---|
| `lint:sleep` (`check-sleep-lint.mjs`) | the union `50d702f2` | **exit 1**: 2 findings, `note-reserve.spec.ts:305` and `:357` (LEDGER's); **`count-yield.spec.ts:302` is gone** | SIX's :302 cured on the union; the union stays red on LEDGER's two |
| same, the born-RED | s13-s7-s3 + homes v3 (`30af7d01`, pass 9's spec) | exit 1: `count-yield.spec.ts:302` (500 ms in `across()`) + LEDGER's two | the pass-9 plant reds first, as the law asks |
| `--self-test` on the union | `50d702f2` | exit 1 (LEDGER's `:357` again) | the lint's own self-test is red on the union, not SIX's |
| M16 `check-copy-register` / `--self-test` | union | 0 / 0 | "0 em/en dashes and 0 unadmitted jargon" |
| `lint:theme-tokens --self-test` (the source pin that R6 names as the wash ε's gate) | union | **exit 2**. The wash reach CONTROL reds 6 offences: `useSession.ts` 7 unreadable publishers against 6 pinned, and `PlayerMark.vue` 2 against 0, ×3 tokens. Every W-plant reds as required. | Arm-born TIN and PLACE, carried at v9 (`pass9/integrate/WAVE.md:34-35`). The lane read this gate on the tree only. On the union, the gate R6 names exits 2. |
| `@property` in the served CSS | control / tree / union | 42 / **42** / 60 | the tree equals the control. The union's 60 is the WAVE's own; the charter's "99" does not reproduce from the CSS alone |
| filterBudget 9 | both deltas | `filterBudget.ts` is in neither delta | holds by construction |

## 3 · The browser rows, re-derived (critic's rigs, critic's runner; `instruments/` beside this file)

Rigs: git-inited archives under the lane's durable scratch (`a-wave` = `74a2b5d9` + WAVE.diff + homes.on-WAVE + the
on-WAVE delta → `50d702f2`), the tree served from the prototype's work tree, built OUT of tree by
`instruments/b.tmpl` (one in-memory plant per build, `must()` throws on a miss, `PLANT-HIT` printed). Runner config
`.critsix/pw.config.ts` in the union archive (the product's config, `webServer` off, `workers: 1`, never banked). The
specs ran are the union's (cmp-equal to the tree's). Each engine column is one sequential chain (`instruments/chain.sh`).
Each step is its own guarded call, and every rig's served identity and CSS bytes are asserted before its run.

### Chromium (load = 1-min average at the step's start; zone = `data.kalloc.1024` inuse)

| row | rig (served) | result, exit | load / zone |
|---|---|---|---|
| count-yield, all 18 | union `index-B3AhQX0wXIN4.js`, CSS 112,462 B | **18/18, exit 0** | 6.44 / 801,193 |
| same | tree `index-CCBUYCA7IyOU.js`, CSS 95,370 B | **18/18, exit 0** | 6.90 / 811,325 |
| same | control `index-CubiZsMVSwTc.js`, CSS 93,634 B | **exit 1, 18 failed** (the subject is absent) | 7.25 / 821,206 |
| LIFE + FIT-LONG, pass 9's SEAT plant first | `noseat` `index-25rXm24Y1yAw.js` | **LIFE 2/2 RED** (`left` "1 of 170", `after1` "1 of 170", `after2` "2 of 170"); FIT-LONG 2/2 GREEN | 26.10 / 852,659 |

The union's own readings (chromium): ABS `ref press1` Δstrip 0.00 and Δtab 0.00 in all three cells. Under the margin
plant, Δstrip is 1.00 in all three cells, and Δtab is 0.50 / **0.00** / 0.50 (812 / 1280 / 844). LIFE is `SEAT · cell 84
10->1 · written 2`, laid "1 of 170", then `press3 - R`, then gone at `left`, `after1` and `after2`. FIT-LONG reads at
`T:laid(34)`. The tree: LIFE `THREE`, counts 1,1,1,2,2,3, then `rested`, `after1` and `after2` all gone. FIT-LONG reads
at `B:press3(34)`. Every lane number is reproduced to the printed digit.
| LIFE + FIT-LONG, pass 9's FIT plant first | `len32` `index-cpcucSPaR6H1.js` | **FIT-LONG 2/2 RED** (read at `T:laid(34)`); LIFE 2/2 GREEN | 21.27 / 852,659 |
| **count-yield, all 18: the CRITIC's disjunct plant `norec`** (`GameBoard.vue` `:previous="marginPrevious?.text ?? ''"` → `:previous="''"`, so no record ever stands in line two and the seat never fires on the union) | `norec` `index-Bx_bj8xwkBw5.js`, CSS 112,462 B | **17 passed / 1 failed, exit 1. LIFE 2/2 GREEN**: both cells take the `THREE` branch on the union (1,1,1,2,2,3, then `rested` gone). The one red is the base 812×375 YIELD cell: press 3 keeps "1 of 170" beside the 34-char line, on one row (row two 0) | 18.08 / 869,995 |
| wash-step 4 | union | **4/4, exit 0**: 1.0783 / 1.1040 / 1.1428 / 1.2237, margins +0.0013 / +0.0020 / +0.0008 / +0.0007; W1/W5/W7 under by 0.0585–0.2230; ε witness under by 0.0087–0.0200 | 12.51 / 881,484 |
| same | control | **exit 1, 4 failed**. The clean steps are identical to the union's to four decimals (π). Every plant reads the clean step (inert: no token to move) | 12.58 / 881,484 |

**What `norec` proves (the critic's finding, new this pass).** LIFE is the row that carries pick 4 ("the seat governs; on
the union the count lives ONE write"). It branches on what it OBSERVES (`seat = press3.record`), never on the tree it
was told it is on. On a union whose seat never fires, it reads the tree's disjunct and passes. The spec does red on
`norec`, but only through the 812×375 YIELD cell. On the clean union that cell's "yields at press 3" reads `- RECORD`:
the seat's verdict, not the yield's. Without the record, the union's wider note at 812 (strip 21.98, tab 238.84,
against the tree's 20.8 / 159.67) FITS the 34-char line and the count. So the catch is incidental to a stale `fits:
false` key. It isn't a clause about the seat, and it reds on geometry that any §7/§10 layout change can move. Both
YIELD cells on the clean union read the seat at press 3 (393 and 812 are both `- RECORD`). On the union, the
geometric YIELD at press 3 is read by no base cell. The same class as pass 9's G-FIT-UNION, now on the YIELD side.
Only RESIZE, METRIC and FONT read a geometric yield there. **Pick 4 is met in letter on the clean union. It is not
met as a gate: the union's "one write" is never asserted.** The cure is one line: key the disjunct on the tree under
test (or assert `seat` on the union), with `norec` as its born-RED.

## 4 · Reading the new gates against the checklist (code read on the union `50d702f2`; each finding cites its line)

1. **R1 SEAT born-RED: MET, both engines** (chromium re-derived here; WebKit in §5). `noseat` reds LIFE at `left` /
   `after1` / `after2`. The disjunct control holds: FIT-LONG stays GREEN under `noseat`, and LIFE stays GREEN under
   `len32`. The record leaves through the product's own falsification path (`GameBoard.vue:1075`, verdict
   `falsified` → `marginPrevious = null`). `noseat` proves `props.previous` is empty at `left`; the error note's
   `hidePrevious` alone could not lift the template's hide. Note what the clean union reads after the overwrite:
   `written` stays 2. The overwrite leaves a wrong digit, and the two later hints add no write. So `after1` and
   `after2` are read at poses with no new write. The seat's "never comes back" is proven at `left` and at hint
   presses, not across further WRITES. Under `noseat` the count reads "2 of 170" at `after2`, so a write did land
   there. On the clean union, the reading window past the seat holds no write: a count that came back only on the
   next correct write is unread.
2. **R3 LIFE / pick 4: met in LETTER, not as a gate** (`count-yield.spec.ts:482`, `const seat = …record`). This is the
   §3 finding above: `norec` reads LIFE 2/2 GREEN on the union. This is the "masked fallback" item on the checklist.
   The row's union disjunct is selected by the subject it should be gating.
3. **R2 FIT on the union: the window moved, the class did not** (`:535`). FIT-LONG reads a length key in (20, 34] (the
   lane's `len35` GREEN 4/4 both engines, carried; `len32` RED re-derived here). A key ≥ 35 escapes on every tree,
   because the payload's longest count-laid voice is 34 characters. Registry-v8 §2.12: a gate cured for its plants
   and not its class stays OPEN. Add §3's YIELD-side twin (above): on the union the press-3 YIELD verdict is the
   seat's in both YIELD cells.
4. **R4 ABS: SIX's half read, the TAB clause has no born-RED** (`:438-444`). The spec computes the plant's Δtab (`pT`)
   but asserts only the plant's Δstrip (`pS ≥ 0.5`). Under the margin plant the tab moves 0.50 / **0.00** / 0.50. At
   1280×800 (the one fine cell) nothing has ever shown "the tab never moves for the count" able to red. Charter R4 asked for "the plant
   moves the tab 1 px", and that is not met. LEDGER's RECT at the count-laid pose is still unread (LEDGER's half).
5. **R5 lint:sleep :302: cured in letter. The rest it substitutes is unasserted** (`:325`). `const rest = await
   atRest(page)` returns `{ ms, residual }`, and no row reads `rest`. Neither does any log line. `atRest` is a bounded
   loop (`rest-probes.mjs:34`, 6000 ms) that returns whether the page rested or not. Under a running infinite
   animation it becomes a silent ≤ 6 s settle proxy, the very class `lint:sleep` exists for, and the lint cannot see
   it because it is not a `waitForTimeout`. LAWS P9 §D "a hold refuses, never pins": a rest wait whose failure is
   dropped pins. The event half (`expect.poll` on ≥ 10 post-tz frames, 15 s) is sound. The 0–2 unrendered pre-resize
   reads still have no isolating plant (R5's second half, carried).
6. **R6 the wash: re-derived, π holds, the source gate is red on the union.** The clean steps equal the control's in
   every cell. The floor table is ONE table for both engines, though the dark no-preference step is 1.1030 in WebKit
   against 1.1040 in chromium (LAWS P9 "a per-engine reading carries a per-engine key"). The WebKit margin there is
   +0.0010. The ε witness route is the charter's second arm, and declaring it is lawful. The gate the spec names
   instead, `check-theme-tokens` W8 ± ε, exits **2** on the union (§2: TIN's and PLACE's wash-reach publishers). On
   the tree where SIX's batch gate reads, its declared gate is not 0. The W-plants still red as required there, so
   the pin discriminates. The CONTROL fails on the siblings' bytes.
7. **pick 6 crit.partial30: MET** (re-derived on the union: RED 6/6, frames 15 vs ≤ 11, the negative GREEN 1/1, exit 1).
   FIVE's to cure.
8. **Frames: none shot, none to LOOK at.** R7's `--accent-glow` is unread in paint for a third pass. No crop moves the
   headroom (102,698 B untouched).
9. **No product byte moved.** The tree's served CSS is 95,370 B with `@property` 42 (= the control). M16 is 0.
   filterBudget is not in either delta. AA is not re-read by the lane (2.359 at DPR 1 carried, pass 8) nor by this
   critic. The count line is sub-AA, and it stays §7's or a ballot.

## 6 · Open gaps (exact; each a pass-11 row, in order of weight)

1. **G-LIFE-KEY** (new, the critic's): LIFE's union disjunct is chosen by the observed record (`:482`). `norec` on the
   union reads LIFE 2/2 GREEN, so pick 4's "one write on the union" is unasserted. Cure: key the disjunct on the
   tree, or assert `seat` where line two exists, with `norec` as its born-RED in both engines.
2. **G-YIELD-UNION** (new, same class as pass 9's G-FIT-UNION): on the clean union, both YIELD cells read the seat at
   press 3 (`- RECORD`). Under `norec` the union's 812×375 note fits the 34-char line, so the cell's `fits: false` is
   true only through the seat. No base cell reads the geometric yield at press 3 on the union.
3. **G-FIT class**: the key window is (20, 34], bounded by the payload. A length key ≥ 35 escapes on every tree.
4. **G-ABS-TAB**: the plant's Δtab is computed and never asserted. At 1280×800 the plant moves the tab 0.00, so "the
   tab never moves for the count" has no born-RED there. LEDGER's RECT at the count-laid pose is still unread.
5. **G-REST**: `atRest`'s `{ms, residual}` is dropped (`:325`). The rest wait cannot fail, and under an infinite
   animation it is a silent ≤ 6 s settle. The 0–2 unrendered pre-resize reads still have no isolating plant.
6. **G-WASH-PIN-UNION**: the source pin R6 names as ε's gate (`check-theme-tokens --self-test`) exits 2 on the union
   (TIN/PLACE's wash-reach publishers, carried from v9). It was read 0 on the tree only. The paint floor table is
   not keyed per engine (dark no-pref 1.1030 WK / 1.1040 CR, margin +0.0010 WK).
7. **R7 `--accent-glow`**: unread in paint and unframed, a THIRD pass (T9-B-ACC6-1's second variable).
8. **R3 AA**: the count line sits at 2.359 at DPR 1, sub-AA. It is not re-read by the lane or the critic, and is §7's
   or a ballot.
9. B-TALLY-16 is unbuilt, and the phone clearance (10 px vs 15–16) is unread.
10. Trace AA per arm is carried, not re-read. The FONT leg is a witness.
11. check 8 FLOOR BAND is not re-run. `--head-rule` ×2 are SELF's.
12. G10 / D10-stallrun / slow49 are not re-run. `crit.partial30` is RED 6/6 on tree and union (FIVE's row 1; no
    pass-10 blob rides).
13. There are no frames: the pass shot none, so nothing on the real surface was photographed in either engine this pass.

## 7 · Incidents (self-declared) and the box

- `lint:theme-tokens --self-test` on the union ran past the 120 s foreground budget once and was moved to the
  background by the harness. Its exit (2) was read from its own log file. The tree's self-test was run in the
  background from the start: **exit 0**, wash reach 0 offences. That reproduces the lane's tree claim.
- A `sleep 45` poll was refused by the harness (no foreground sleep). Polls since are bounded `timeout ≤ 85` tails.
- The archive script's `changed=` column reads 0 on every APPLY line. It diffs against a HEAD the uncommitted
  archives don't have (no commit is made, by law). The path counts printed are the patches' own `diff --git`
  counts. The applied trees are proven by their `write-tree` ids, which equal the lane's.
- The WebKit chain queued at 21:46:41 (zone 881,484, load 11.90) behind two foreign `--exclusive webkit` holders
  (one `uv run` at 60 min, one `node` at 6 min). The waiting job held no browser of this lane's. No chromium ran
  while it waited.
- The zone rose 761,672 (21:34) → 881,484 (21:46) across the chromium column, with `guarded`'s "kernel zone leak is
  ARMED" warning on every call (slope 30.2/s). It stayed under 8,000,000 at every row; the owner should watch it.
- No foreign listener was touched. `:4237` and `:4250` were free at open. Each preview ran inside its battery's
  guarded call and was stopped by it. No git ran on main or in the control tree. The prototype's work tree was read
  through temporary indexes only, and nothing was written into it.

## 5 · WebKit (each step its own `guarded --exclusive webkit` call; queued 21:46:41 behind two foreign holders, ran from 21:57)

| row | rig (served) | result, exit | start load / zone |
|---|---|---|---|
| count-yield, all 18 | union `index-B3AhQX0wXIN4.js`, CSS 112,462 B | **18/18, exit 0** | 8.11 / 957,717 |
| same | tree `index-CCBUYCA7IyOU.js`, CSS 95,370 B | **18/18, exit 0** | 9.62 / 967,753 |
| same | control `index-CubiZsMVSwTc.js`, CSS 93,634 B | **exit 1, 18 failed** | 10.05 / 977,307 |
| LIFE + FIT-LONG | `noseat` | **LIFE 2/2 RED** (`left` "1 of 170", `after2` "2 of 170"); FIT-LONG 2/2 GREEN; exit 1 | 7.08 / 1,047,442 |
| same | `len32` | **FIT-LONG 2/2 RED** at `T:laid(34)`; LIFE 2/2 GREEN; exit 1 | 7.54 / 1,047,442 |
| count-yield, all 18 | **`norec`** | **17/1, exit 1: LIFE 2/2 GREEN (`THREE`)**; the one red is the 812×375 YIELD cell (press 3 "1 of 170" beside the 34-char line, row two 0) | 7.05 / 1,047,442 |

WebKit union readings: ABS Δstrip 0.00 and Δtab 0.00 in all 3 cells. Under the plant, Δstrip is 1.00 ×3 and Δtab
0.50 / **0.00** / 0.50. The tabs are 238.98 / 398.16 / 246.53, a per-engine key against chromium's 238.84 / 398.45 /
246.38. LIFE reads `SEAT · cell 84 10->1 · written 2`, the same sequence as chromium. On the tree, LIFE reads `THREE`
1,1,1,2,2,3, then `rested` gone. **Pick 4's reading, union and tree in both engines in one return: reproduced. Its
gate hole (`norec` GREEN on LIFE): reproduced in both engines.**

WebKit wash-step (22:12:53, load 5.61, zone 1,080,424): union **4/4, exit 0**: 1.0783 / 1.1030 / 1.1428 / 1.2251, with
margins +0.0013 / +0.0010 / +0.0008 / +0.0021. W1/W5/W7 are under by 0.0585–0.2230. The ε witness is under by
0.0168 / 0.0200 / **0.0013** / 0.0159. Control: **exit 1, 4 failed**, with clean steps equal to the union's to four
decimals (π), plants inert. Every lane number is reproduced to the printed digit, including the WebKit light-more ε
at 1.1407. At return `:4237` and `:4250` have no listener. Logs for every row are in `logs/`.

## 8 · The number, the verdict

**87** (pass 9's critic: 86). Pass 10 closed the fold blocker. SEAT has a born-RED of the seat's EFFECT in both
engines, re-derived here. `:302` is cured on the union (`lint:sleep` re-read). LIFE is read per pick 4 on union and
tree in both engines in one return. FIT-LONG reaches the union (`len32` RED both engines). `crit.partial30` ships
(RED 6/6 re-derived). It moved no §3 product byte, and it opened two holes in its own new rows. LIFE's union
disjunct is selected by the subject it gates (`norec` GREEN, both engines). The rest that replaced `:302` is
unasserted. The YIELD side carries the same seat mask pass 9 named on FIT. R7 is unread a third pass. No frame was
shot. Under LAWS P9 §C the number is the critic's: +1, not more.

**Verdict: ADVANCE.** §3's leader stays ALIVE. The batch gate (count-yield 4/4 on the union) is MET in both engines,
re-derived. GRAPHITE's six-rig read is GRAPHITE's and is not this lane's to meet. No fold blocker remains. Gaps 1–6
in §6 are pass-11 rows. Earliest 100 for §3: pass 12 (pass 11 must be clean, with `norec`, the tab plant and the
asserted rest; pass 12 the second clean pass).

**Replay route:** the rigs are `74a2b5d9` + `pass9/integrate/WAVE.diff` (`b3725e4f`) + `pass10/instruments/
homes.on-WAVE.diff` (`0723d508`) + `pass10.delta.on-WAVE.diff` (`57845ba5`) → `50d702f2`, plus the tree as banked.
Build with `instruments/b.tmpl` (`PLANT=none|noseat|len32|norec`), run with `instruments/chain.sh <engine>`.
