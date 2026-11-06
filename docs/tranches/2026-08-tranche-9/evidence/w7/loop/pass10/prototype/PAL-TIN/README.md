# PAL-TIN · pass 10 · §11c (batch 5, run first)

Lane tree `.claude/worktrees/wf_308fa864-c94-2` at `74a2b5d9`, nothing committed. This is the second attempt in
batch 5: the first died about two minutes in on an expired login. Its only product edit was homes v3, applied at
04:42 (log carried below). Everything here was re-measured in this run.

## Gaps first

- **No browser row was read this pass.** `~/.claude/guard/ZONE-ARMED` was present the whole run, armed
  2026-11-03 21:30:49. `zone.log` inuse read 7,499,830 at 11:15:16, 7,715,943 at 11:35:45 and 7,868,225 at
  11:50:29, climbing about 120–210 /s toward the 8,000,000 line. Under the owner's guidance (no new long battery
  while the marker exists) and CHAIR §23, no browser row opened. **UNREAD, by name and engine (chromium AND
  WebKit):** §2c over the whole table (charter row 2; the peer-3 `.pcss` plant); §2b at chromium DPR 1 (row 6,
  dark cell 12); every `peer-tin.spec.ts` row on the tree and the control; the union rows `peer-tin:822`,
  `:928`, `:965`, `:550` and `player-tally:1312`/`:1479` (row 9); π and AA (no painted byte was read); every crop.
  No server was started on :4245 or :4239. **The owner must reboot** before any browser row of this lane opens.
- **Gate 4's class is closed to 22 of 24 on the source gate as banked** (the critic's 25 shapes less the struck
  N26c). It was 14 of 24 on this tree at open. The two left are N27 (`?raw` `.txt` injected as `<style>`) and N29
  (SFC `<style src>` outside `src/`). Neither file ever reaches the gate: the ONE library's `followImports` does
  not follow a `?raw` edge or a `<style src>`. Both are filed as a PROPOSED library diff
  (`proposed/shape-census.tin10-raw-import-style-src.PROPOSED.diff`, sha1 `fb3207cd`), which takes the source
  gate to 24 of 24. Per the critic, both are caught by `--dist`, but that arm was not re-read here (no build).
- **The class has two holes I could find: an encoded name.** In a fresh 13-shape battery past the critic's
  (`instruments/fresh10.sh`), 11 of 13 red. F14 `setProperty(atob("LS1jb2xvci1wZWVyLTItcmluZw=="), …)` and F15
  `setProperty(String.fromCharCode(45, 45, …), …)` exit 0. No static reader resolves those, and none is claimed.
- **Watch 2 is the hand-over's, not WALK's.** The re-cut applies 0 on WALK's live blob `1ee13421` and on the
  WAVE's copy `1ac0874a`. It is not landed in WALK's gate: WALK opens after this lane, and landing is WALK's
  act. Watch 2 closes only when WALK's banked gate carries it.
- **The WAVE's copy of WALK's gate carries a different B-TAPE cost row** (`CHURN_COST` 8: `[0.0144, 0.0168]`,
  16: `[0.0056, 0.007]`, against `1ee13421`'s `[0.0144, 0.0139]` and `[0.0073, 0.0057]`). The hand-over's
  `COST_PIN` literals are `1ee13421`'s row, so on the WAVE they red the union's re-stamped row by design. The
  integrator re-stamps the pins with the row, in the same commit.
- **Row 9's union rows are priced, not cured** (see §5): only the wash reach is cured.
- **The ε of each pin is the 8-bit grain, not zero.** The achieved plant offsets are printed per row. A bound
  moved by less than its achieved offset is not caught (MIN_SEP ±0.31–0.32°, RATIO_FLOOR ±0.014–0.017, RING_DH
  +0.036/−0.057°, SCALAR_EPS ±0.002, ABS_FLOOR −0.0032/+0.0037).

## Open state at entry (re-measured, not trusted)

The tree's product diff was read through a temporary index: 33 files, +15,936/−84, tree `81d69ff6`. The pass-9
bank (`pass9.diff` sha1 `ea6428ba`) applied on a fresh index of `74a2b5d9` gives tree `f7c95720`, as its
BANKED.txt says. Adding homes v3's on-WAVE step (`homes.on-WAVE.diff` sha1 `0723d508`, the chair's folded copy)
gives `81d69ff6` exactly. So the dead attempt left no product edit beyond homes v3, and none needed a
keep/finish/revert decision. Its scratch (`walktree/`, a 74a2b5d9 archive with its own `.git` carrying WALK's
pass-9 bank) was verified path by path: all 31 of WALK's banked paths are blob-equal to WALK's bank tree
`6ae9ae16`. The gate and spec import every instrument by relative product path (`./shape-census.mjs`,
`./lib/glyph-pop.mjs`, `./lib/paint-lib.mjs`, `../scripts/shape-census.mjs`). No import from `docs/`.

## The rows (charter numbering)

**1 · Gate 4 at its class: 22/24 source (was 14/24 at open), 24/24 with the PROPOSED library.** g4-decl's three
regexes (bare `token:`, quoted `"token":`, `setProperty("token"`) are replaced by ONE class reading: a peer token
(`--color-peer-N[-ring|-name]`, `--peer-{ink,ring,name}-l`) named anywhere outside `index.css` is a second
publisher, unless its head is a consumer's. Consumers are `var(` (also spelled `var\(\s*` inside a regex
literal) and the reads `getPropertyValue(`, Typed OM `.get(`, `.getAll(` and `.has(`. A write is never admitted.
The read admission was born on the union: on the WAVE, the first cut red five READS in `e2e/peer-walk.spec.ts`
(`getPropertyValue("--peer-ink-l")` and the regex literal `/var\(\s*--peer-name-l\s*\)/`). With the reads
admitted, the WAVE reads the same 8 gate-4 findings under the new gate as under the pass-9 gate. All 8 are
union-born in `PlayerMark/PlaceChart.test.ts` and `PlayerMark.place.test.ts`, which are not TIN's files.
Critic's 25 shapes (`instruments/attack10.sh`, adapted from the critic's `attack.sh`) on a replica of this tree:

| | at open (gate `d05491a3`, homes v3) | banked gate | + PROPOSED library |
|---|---|---|---|
| N1 N2 N3a N3b N4 N5 N6 N34 | exit 0 ×8 | exit 1 ×8 | exit 1 ×8 |
| N21 N22 (`%23`) | exit 1 ×2 (homes v3 `pct-decode`) | exit 1 ×2 | exit 1 ×2 |
| N27 (`?raw` `.txt`), N29 (`<style src>` outside `src/`) | exit 0 ×2 | **exit 0 ×2** | exit 1 ×2 |
| N7–N12, N14, N26a/b, N30, N41, N42 (the 12 that red at pass 9) | exit 1 ×12 | exit 1 ×12 | exit 1 ×12 |
| N26c `.sss` (struck by the critic) | 0 | 0 | 0 |
| clean0 / clean1 | 0 / 0 | 0 / 0 | 0 / 0 |

Fresh shapes past the critic's (`instruments/fresh10.sh`, PROPOSED library): F1 `.call`, F2 array-held, F3
template, F4 concat, F5 a JS unicode escape (`\u002d`), F10 `CSS.registerProperty`, F11 `insertRule`, F12 `cssText`, F13
`.join`, F8 a `public/` svg `<style>`, F7 a `style=""` attribute: exit 1 each. **F14 `atob(…)` and F15
`String.fromCharCode(…)`: exit 0 (OPEN).** The self-test carries ten class plants as regressions (N1, N2, N3a,
N3b, N4, N5, N6, N34, T1 a `Map` of arms, T2 a band in a Typed-OM write), each RED. It also carries three read
shapes in the consumer GREEN control.

**3 · g4-decl's disjuncts: dissolved.** The clause is one regex now. Its one branch, the consumer admission, is
its own clause id `g4-decl-admit`, so the sabotage battery deletes it apart from the reading. See Batteries.

**4 · The five bounds, pinned.** MIN_SEP, ABS_FLOOR, RATIO_FLOOR and RING_DH are now `TIN_THRESH`-overridable
like the other five, and each of the five carries a PIN-form boundary pair in `--self-test`. The pins are literal
numbers, never read off the constants. Each plant is built as the byte triple nearest its target, on its side of
the PIN, with the achieved value printed:

| bound | tally | RED plant (achieved) | quiet plant (achieved) |
|---|---|---|---|
| MIN_SEP 12° | g1a | light peer-1 `#006152`, 11.68° from solver-ink-4 | light peer-2 `#424b8e`, 12.31° from user-ink |
| ABS_FLOOR 0.075 | g1b-abs | light peer-4 `#3c38c5`, ΔE 0.0718 from solver-ink-3 | `#3d34c5`, ΔE 0.0787 |
| RATIO_FLOOR 0.75 | g1b-ratio | light peer-4 `#3c36c5`, score 0.7357 | `#3d34c5`, score 0.7667 |
| RING_DH 1° | g3b | light peer-4-ring `#230083`, 1.036° | dark peer-2-ring `#9cd00d`, 0.943° |
| SCALAR_EPS 0.005 | g4-light | dark peer-5-ring `#ff8bf4`, L off 0.0070 | dark peer-2-ring `#9ed002`, L off 0.0030 |

The first threshold battery, run before the constructions were tightened, read 34/36. MIN_SEP 12→12.6 and
RATIO_FLOOR 0.75→0.78 stayed GREEN because those plants then sat at 12.65 and 0.7802. Both constructions now take
the nearest triple, and the ε are now 0.3° and 0.015. The final-bytes battery is under Batteries.

**2 · §2c over the whole table: OPEN, UNREAD.** This is a browser row, and the zone held it (see Gaps first). It
was not authored blind, because a spec row that has never run is not banked. The route that stays open: one
probe per arm (5 names and 5 rings, both themes) in the board's own cascade context, read as painted bytes
against the authored table. The plant is the critic's built peer-3 `.pcss` (`pass9/critique/PAL-TIN/instruments/
build-pcss3b.sh`), not an in-spec re-declaration. Gate 4 now reds a token spelled in a spec, so a plant written
into `e2e/` would itself be a second publisher.

**5 · Watch 2: the hand-over re-cut on `1ee13421`.** Numbers are under Batteries.

**6 · §2b G5-rung: OPEN, UNREAD (browser).** The PROPOSED `pass9/prototype/PAL-TIN/proposed/G5-rung.PROPOSED.md`
still awaits the chair. Dark cell 12's pink (tree 2.941 vs HEAD 2.986, the pass-9 critic's reading) was not
re-read on HEAD-on-HEAD.

**7 · The pass-9 README's misprints, re-printed.** The bias band of sim − HEAD is two-signed: 10 of 60 keys read
high (the critic's count; not re-measured this pass, since it is a browser reading). The source-file count is 261,
not 262. The banked gate, run bare on the tree and on its replica, reads 261 with exit 0 on both. The WAVE union
reads 308. One mid-run self-test on the replica printed 262. The cause is unexplained, and it did not reproduce
once the replica was verified clean (incident 3).

**8 · Razor margins (carried, unmoved by this pass; the tin's bytes are untouched):** worst dark name pair
0.101 against MIN_DE 0.10, and worst light ring pair 0.0769 against RING_FLOOR 0.075. On the WAVE union, gate 2
prints worst name pair 0.077 light / 0.101 dark and worst ring pair 0.0769 light.

**9 · Union-born, §11 × §11c.**
- **The wash reach: CURED.** `check-theme-tokens` on the WAVE read 6 wash-reach offences, three of them
  `useSession.ts` (`--wash-blue`, `--wash-graphite` and `--ground-wash-unit`, each "7 unreadable publishers where 6
  are pinned"). The seventh key is TIN's: `withSelfInk`'s `{ ...next, [selfId.value]: … }`. The 74a2b5d9 file
  reads 6, and the WAVE adds exactly that site. The cure is a plain assignment (`out[selfId.value] = …`), with the
  same behaviour and no computed key. On the WAVE it gives 3 offences, all three in
  `src/pencil/chrome/PlayerMark/PlayerMark.vue` ("2 where 0 are pinned"), which is not TIN's file. The pin was not
  re-counted: the instrument is not TIN's, and its count is right.
- **F1 `useSession.test.ts:446` (SELF's `SELF_TAKES_A_HAND`) against TIN's room of one: priced.** The shipped
  constant is `true` on both the tree and the WAVE. TIN's `withSelfInk` binds the hand only when
  `Object.keys(next).length > 1`, so at the join (a room of one) `mine()` has no ink and F1 reads false where it
  wants true. Under pick 9 (the union's test follows the shipped arm), TIN's arm is the side that contradicts.
  Its re-author is one guard: drop `&& Object.keys(next).length > 1` when `takesAHand`. That flips TIN's own row
  `useSession.test.ts:527` ("a room of one binds neither arm"), and any painted row that reads a solo player's
  ink. Those painted rows are not enumerated here. It was not made here: the cost lands on painted rows this pass could not read.
- **U3 :688, U5 :727 and `BoardHost.authors.test.ts:245` (WALK's rows against TIN's palette): carried.** The
  WAVE reads the same 4 reds before and after the wash cure (60 tests, 4 failed, 56 passed, both runs). U3 wants 4
  distinct inks and reads 2, U5's deep-equal fails, and `:245` wants `var(--peer-ring-l)` in the ring ink, a
  WALK-walk string, where TIN's tin binds `var(--color-peer-4-ring)`. Under pick 9, WALK re-authors these against
  TIN's mechanism.
- **The row-side `PlayerTick` on SELF's sr-only roster (`peer-tin:928`/`:965` RED at A4) and `peer-tin:822`:
  priced, UNREAD.** Both are browser rows. Two routes: give the tick a painted home (the tape already carries
  it, `:888`), or strike `:928`/`:965` at a cost of one identity string on the roster. This lane can only name
  that cost, not read it.

**10 · WALK's wire rows against the palette:** see 9. They are WALK's to re-author (pick 12).

**11 · Carried:** WebKit FADE80 printed-only (CHAIR §11); L6 in WALK's form; roster n−1; B-TAPE ×2; DPR 2 rows;
the union's `typecheck:e2e` 2 (RULE's). None was re-read.

## Incidents (self-declared)

1. **The first attempt died on an expired login** about two minutes in. Its homes v3 apply (04:42, exit 0,
   reverse-check 0, the 10 path shas logged) is the only product edit it left, and it was re-verified by tree
   equality (see Open state).
2. **The first WAVE scratch read `homes_apply=1`.** In a scratch repo with no commit, `git apply --3way` falls
   back to an index that has nothing in it, and fails. A plain `git apply` read 0, and so did its reverse-check.
   Every later check uses plain apply on fresh archives.
3. **A battery was contaminated, then discarded.** The final-bytes chain (threshold, then sabotage) was running
   on the replica when `attack10.sh` and `fresh10.sh` planted files into that same replica. I stopped that chain
   by its recorded PID and moved its partial logs to the lane's trash (`final*.contaminated*`). The replica was
   checked byte-equal to the tree (`diff -rq`, 0), and the chain was relaunched clean.
4. **One chain was stopped to re-cut the bytes.** The first final chain ran before `colourLiterals` was
   memoised. The memo changes no verdict: self-tests 3 and 4 print identical `SELF-TEST` lines, and the run drops
   from 63.6 s to 23.2 s. That chain was stopped by PID (`final*.stale*` in trash) so the batteries read the
   banked bytes.
5. **The pin constructions were tightened after a battery.** The first threshold battery read 34/36 (see row 4),
   so the MIN_SEP and RATIO constructions were tightened. The verdict lines name both cuts, and no gate was
   re-worded.
6. **The zone crossed 8M during the run** (`inuse=8004873` at 12:04:05, rising about 120–210 /s, ZONE-ARMED the
   whole run). No browser row was opened at any point. **The owner must reboot.**

## Replay route

Scratch (`$SCRATCH` = the lane's durable scratch dir), no browser:
1. `rep/` = an rsync of the tree's `web/frontend` with `node_modules` symlinked. `rep2/` = the same, plus
   `proposed/shape-census.tin10-raw-import-style-src.PROPOSED.diff` (`patch -p1`).
2. `wave10/` = `git archive 74a2b5d9` + `git init` + `pass9/integrate/WAVE.diff` + `homes.on-WAVE.diff`
   (`instruments/mk-wave.sh`; use a plain apply, see incident 2).
3. `walktree/` = a `74a2b5d9` archive + WALK's `pass9.diff` (its own `.git`). The hand-over applies there.
4. Gate rows: `node scripts/check-peer-tin.mjs [--self-test | --threshold-battery | --sabotage-battery]`, from
   the replica's `web/frontend`, through `guarded --light`. The shapes: `instruments/attack10.sh` and
   `instruments/fresh10.sh` (`REP=…`, `ATK_TAG=…`). WALK: `instruments/walk-sab.sh`. The union's wash reach:
   `node scripts/check-theme-tokens.mjs` on `wave10/`.

## Batteries (exits read bare from files each battery wrote; box load per row in the logs)

Every row below is browserless and ran through `guarded --light`. No zone row applies to it. The zone was read
anyway: 7.50M at open, 8.00M at 12:04:05, 8.16M at 12:22:33.

| battery | on | result | control |
|---|---|---|---|
| `--self-test` (banked gate `76255232`, homes v3 `49115989`) | replica of the tree | exit 0, 130 `SELF-TEST:` lines, 0 FAILED | — |
| `--threshold-battery` | replica | **36/36** moved bounds red the self-test, exit 0 | first cut 34/36, exit 1 (row 4) |
| born-RED: the pass-9 gate `d05491a3` with the critic's five moves (MIN_SEP 13, ABS_FLOOR 0.08, RATIO_FLOOR 0.70, RING_DH 1.5, SCALAR_EPS 0.010) | replica | **exit 0 ×5** (unpinned, as born) | the pass-9 gate unsabotaged: exit 0 |
| `--sabotage-battery` (clauses, no `--dist`) | replica | **44/46**, exit 1: `g4-blank` and library `strip-regex` GREEN ("no plant") | pass 9 read 46/46 WITH `--dist` (`pass9/…/readings/node-battery.txt:71`, `:80`) |
| `--dist` arm (self-test and battery) | — | **UNREAD**: `guarded` REFUSED the build (exit 75) at kernel zone 8.14M | — |
| `g4-decl` deleted | replica | BITES (exit 3): B1, a band rule in `gameCell.css`, stays GREEN | — |
| `g4-decl-admit` deleted | replica | BITES (exit 1): the consumer control reds | — |
| the critic's 25 shapes | replica / rep2 (+PROPOSED) | 22/24 / 24/24 red, N26c 0 (struck) | clean0/clean1 exit 0 both |
| fresh F-shapes | replica / rep2 | 11/13 / 11/13 (F14, F15 exit 0) | clean0/clean1 exit 0 both |
| `check-theme-tokens` (wash reach) | the WAVE | 6 → **3** offences (useSession's 3 cured) | the WAVE's own useSession: 6 |
| `vue-tsc -b`, `typecheck:e2e`, `typecheck:node` | the tree | 0, 0, 0 | — |
| unit (vitest, maxWorkers 2, chunked: `games/shared`; the rest of `games` + `composables`; `pencil`) | the tree | 34 + 26 + 8 files, 437 + 328 + 73 = **838 passed**, exit 0 ×3 | — |
| unit `useSession.test.ts` + `BoardHost.authors.test.ts` | the WAVE | 4 failed / 56 passed, before AND after the cure | the WAVE's own useSession: same 4 |
| `check-copy-register --self-test` | the tree | exit 0, 0 dashes, 0 jargon (the one new string is a code comment) | — |
| gate 4 bare on the WAVE | the WAVE | exit 1, 8 findings, the same 8 under the pass-9 gate (union-born, `PlayerMark/*.test.ts`) | pass-9 gate: exit 1, 8 |

`g4-blank` and `strip-regex` were GREEN without `--dist` in this run, and both bit WITH it at pass 9. There,
`g4-blank` bit on the shipped entry chunk, and `strip-regex` bit via B2 under `--dist`. Whether `strip-regex`
needs the bundle to bite was not established here. Both are OPEN until the `--dist` battery runs after the
reboot.

## Watch 2 and the WALK battery (row 5)

The hand-over is `instruments/separation-law.into-walk-gate2.pass10.diff` (sha1 `7e9a6105`, 7,958 B), cut on
WALK's live gate blob `1ee13421` → `75a625bd`. WALK's live gate already carries TIN's whole law (`SEP_STRINGS`,
`RING_FLOOR`, `CHURN_COST`), so pass 9's 4-of-5 failing hunks are moot. The re-cut adds two things, both in
PIN form, with literal pins:
- The six floor boundary controls (`FLOOR_PIN`: user-ink 0.1/0.1, cursor-ink 0.075/0.1, name-ink 0.1/0.1, at
  PIN ± 0.005). Each plant must also sit on its own side of its pin.
- `CHURN_COST` plants per cell and arm (n = 8 and 16, light and dark: WORST at PIN ∓ 0.001 and COUNT +1, with
  `COST_PIN` 8: under [11, 11], bound [0.0124, 0.0119]; 16: under [51, 51], bound [0.0053, 0.0037]). The live
  blob planted the n=8 light cell only.

`git apply --check`: **0 on `1ee13421`** (walktree, own `.git`) and **0 on the WAVE's copy `1ac0874a`**. The
re-cut's self-test on WALK's pass-9 tree exits 0 (113 ✓ before, all 12 cost rows and 12 floor rows ✓ after). The
achieved plants include n=16 dark: WORST − 0.0028 / + 0.0043 against PIN 0.0037.

WALK threshold battery, the live blob against the re-cut (`instruments/walk-sab.sh`; the two COUNT rows re-run
with the sed bound to `CHURN_COST`'s own line, because the first cut's pattern also moved the re-cut's
`COST_PIN`):

| move | `1ee13421` (live) | re-cut |
|---|---|---|
| MIN_DE 0.106 / 0.094 | exit 1 / 1 | exit 1 / 1 |
| RING_FLOOR 0.081 / 0.069 | **exit 0 / 0** | exit 1 / 1 |
| COST_EPS 0.0035 / 0.0005 | **exit 0 / 0** | exit 1 / 1 |
| CHURN_COST 8 worst light 0.0160, 8 worst dark 0.0123 | **exit 0 / 0** | exit 1 / 1 |
| CHURN_COST 8 under dark 12 | **exit 0** | exit 1 |
| CHURN_COST 16 worst light 0.0057, 16 worst dark 0.0073 | **exit 0 / 0** | exit 1 / 1 |
| CHURN_COST 16 under light 52 | **exit 0** | exit 1 |
| total | 2 of 12 bite | **12 of 12 bite** |

**On the WAVE, WALK's gate does not run at all, before the hand-over or after it.** Base and re-cut both throw
`TypeError: Cannot read properties of null (reading 'C')` from `runAll` (`check-peer-arcs.mjs:1026`). The
union ships TIN's `playerIdentity.ts`, whose strings are `var()` arms and not WALK's `oklch` walk. That is
pick 9 / pick 12 in one line: WALK's gate 2 must be re-authored against TIN's mechanism before it reads the
union.

**Watch 2's state: OPEN, ready to land.** It applies 0 on the live blob, and its battery is 12/12 there.
Landing it in WALK's gate 2 is WALK's act this batch, and so is a gate that runs on the union. If WALK does
neither, pick 12 folds WALK's gates into TIN at v10. TIN's gate 2 (`SEP`/`RING_FLOOR`/`EXEMPT_FLOOR`, PIN-form,
36/36 on the threshold battery) and its site law can receive them.

## Leader duties (§11c)

- **The section's number is the critic's to print.** This return claims no number.
- **The §11 × §11c arms, priced:** see row 9. F1 is TIN's to re-author under pick 9, at the cost named there.
  U3, U5 and `:245` are WALK's.
- **B-TAPE ballot text, default unmoved:** "The walk tells two issued hands apart under PAL-TIN's whole law and
  breaks at the third. Its churned cost is written in its gate: 11/28 name pairs under 0.10 at n = 8 (worst
  0.0144 light / 0.0139 dark) and 51/120 at n = 16 (worst 0.0073 / 0.0057). HEAD's same-index control on the
  same table reads 8/28 (worst 0.0602 / 0.0593) and 35/120 (worst 0.0234 / 0.0239). At TIN's room of five, the
  walk reads 4/10 under (worst 0.0182 / 0.0194) and HEAD reads 2/10 (worst 0.0896 / 0.0975). The default stays
  TIN's tin." Read from WALK's live gate on its pass-9 tree, `walk-base-selftest.log` lines 10–12.

## Instruments (relative product paths)

`web/frontend/scripts/check-peer-tin.mjs` (the gate: `--self-test`, `--threshold-battery`, `--sabotage-battery`),
`web/frontend/scripts/shape-census.mjs` (homes v3 `49115989`, unedited; the PROPOSED diff is filed apart),
`web/frontend/scripts/check-peer-arcs.mjs` (WALK's gate, read on WALK's tree and on the WAVE),
`web/frontend/scripts/check-theme-tokens.mjs` (the WAVE's, the wash reach), and
`web/frontend/scripts/check-copy-register.mjs`. The lane scripts are under `instruments/` here (`$SCRATCH` stands
for the lane's durable scratch dir), and the sanitized readings are under `readings/`. No server was started, and
none is left. Nothing imports from `docs/`.

## Bank

`pass10.diff`: `--binary`, on `74a2b5d9`, cut through a temporary index, product paths only. 33 files, +16,181/−84,
777,698 B, sha1 `8cec1746`, tree `9fdae2fe`. It applies 0 on a fresh `74a2b5d9` archive (reverse 1), and the 33
paths are equal to the lane tree. `pass10.delta.on-WAVE.diff` declares its base as the pass-9 WAVE plus homes v3
(`74a2b5d9` + `WAVE.diff` `b3725e4f` + `homes.on-WAVE.diff` `0723d508`, tree `9528a8ec`). It is 2 files
(`check-peer-tin.mjs`, `useSession.ts`), +266/−21, 21,851 B, sha1 `dd52a3f4`. It applies 0 there (reverse 1) and
0 on the plain WAVE. Both diffs grep clean of scratch paths. Everything else is in BANKED.txt.
