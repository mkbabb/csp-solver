# PLR-SELF · pass-9 CRITIQUE

I'm the critic. I didn't write the charter, the prototype or the spec. Base and π control: `74a2b5d9`.
Work tree served on `:4241` (my own `git archive` of the bank tree `04c8b7dc`, dev server); control on `:4259`
(the shared `w7-control`, dist `index-CubiZsMVSwTc.js`). Both servers started and stopped by me, by recorded PID.

**Convergence: 93 (+1). Verdict: ADVANCE. §11 on the leader: 93.**

Pass 9 closes the two defects that held pass 8 at 92, and both closures survive my own plants in both engines:

- The three forgiveness clauses now red when deleted, in the run and from the source (6/6 RED).
- The fitted 0.7 is gone; the 1024–1056 sweep holds one pose while the board slides.

It doesn't reach 95 because what remains open is not small. The drawn-frame gate is still a SKIP on the bank, and
its PROPOSED roster leaks the very parameter CHAIR §7 forbids. The on-WAVE delta lands a new `lint:bands` red,
and it buys its `lint:verbs` green with two rows the lane wrote into another section's ledger. The key's area
comparison never decides a real cell. One landed row dies on its own 30 s budget at load 51.

## 0 · Gaps first (exact, open)

1. **Charter row 2 / CHAIR §7 is not closed at this bank.** The drawn roster is a PROPOSED diff, so the four-band
   row `test.skip`s on the bank: the section's only B3 gate on its drawn frame cannot fail there. The batch
   gate's "roster in the ONE library" is unmet until the fold (§4).
2. **The PROPOSED roster leaks `thickTol`.** It refuses a typed `thick` beside `drawn`, but `thickTol` passes
   through and multiplies the floor (B3 = `thick × thickTol`). `{drawn: 'head-sheet', thickTol: 0.5}` floors
   the frame at 0.75. That is a lane-chosen parameter one option over, and it must be refused or pinned before the
   chair folds (§4, §4a).
3. **The `tray-well` roster entry has no consumer.** It pins the wells' 4 sites, but no row anywhere passes
   `drawn: 'tray-well'`, so the wells' B3, which CHAIR §7 names, is gated nowhere. The two off-roster
   `HandDrawnOutline`s on the union (`bar-frame`, unclassed) are read by nothing (§4).
4. **Once folded, the row's SKIP-on-absence is a masked fallback.** It must red when `DRAWN_FRAMES` is
   absent, not skip. The real-surface row also lacks the 0.55× plant (LAWS P8 §E letter; THIN_1PX covers it
   monotonically) (§4).
5. **The on-WAVE delta lands a new red.** `lint:bands` B2 goes 0 → 1 on `MOTION.presenceInkMs = 400`, read bare
   by me. The lane leaves it red and files the seam under **B-SEAM**, a name v8 already gives the
   `TAP_IS_A_LOOK` ballot; the chair has not ruled this one (§5).
6. **`lint:verbs` is green on the WAVE only through the lane's self-admission.** The delta writes two ADMITTED rows
   for its own `PlayerMark.vue` declarations into VERB's ledger (`signature`, `prm`). That is the gate re-worded
   to pass until §13 admits or names them (§5).
7. **The key's area comparison is unreachable on the real surface.** With `LAPONLY` planted (any lap → one row),
   the KEY_CELLS, sweep, desk and resize rows stay GREEN in both engines; only two synthetic unit rows red. The
   bank states no unreachability reason, and the B-NAMES arm (a) caption describes a measure that never decides
   a cell (§3).
8. **The `:546` row (phones, tablet, 844×390) dies on its own 30 s default budget at load ~51** on the clean
   bank (chromium). The row carries 8 cells and no `test.setTimeout`. At a 120 s CLI budget it passes in 48.8 s (chromium) and 54.6 s (webkit) at load ~73: the row is right and its budget is wrong (§8).
9. **Carried, cited, not re-derived by me**: π vs `74a2b5d9` (by construction both times), dist identity
   / filterBudget / M16 (the lane's reads plus my diff read), PLACE's :610 merge (list/yield GREEN, chart RED,
   B-CHART), check 8 FLOOR BAND, T9-R8, B-NAMES unframed, real iOS and the 350 ms bound (M19; the RUNSHEET line
   drafted, not landed). The forgiveness rows read the activation at 12–92 ms, never near the window's far
   edge where pass 8's costs sat (109–143 ms).

## 1 · Identity — re-derived through temporary indexes (no commit, no git on main's work tree)

| read | result |
|---|---|
| sha1 / bytes | `pass9.diff` 5ee85d8b 615,783 · `pass9-substrate.diff` 013f21bb 620,680 · `pass9.delta.on-WAVE.diff` 33e41544 186,205 · `proposed/edge-bands.drawn.diff` 462dd40a 11,823 — all as BANKED.txt says |
| `pass9.diff` on `74a2b5d9` | check **0**; applied → **`04c8b7dc`** (BANKED's tree) |
| `pass9-substrate.diff` on `74a2b5d9` | applied → **`7fb4bdf0`** |
| `pass8.diff` on `74a2b5d9` | → `959454c2` (pass 8's bank tree) |
| WAVE.diff on `74a2b5d9` | → `acb9c08e`; homes.on-WAVE → **`acde977b`** |
| delta on bare WAVE `acb9c08e` | check **0** |
| delta on WAVE + homes `acde977b` | check **0**; applied → **`f333e6de`** (BANKED's) |
| PROPOSED on `f333e6de` | check **0** |
| `pass9.diff` on s10 (`a15da8e6`) / s13-s7-s3 (`f1c9c3fe`) | **1 / 1** — §11 is in neither integration; the WAVE is §11's only union |
| homes v2 in the bank | the 13 homes paths of `d17813ba` (`74a2b5d9` + homes.diff) diff **empty** against `04c8b7dc`: homes v2 applied by sha, byte for byte |
| residual home edits in the delta | the delta's 27 paths and homes.on-WAVE's 11 paths are **disjoint**: none rides |
| forbidden-path grep | 0 on all four diffs (scratch, temp, home-absolute); no dot-dir `+++` path |
| blobs | `PlayerMark.vue` fcfec07d, `rowBudget.ts` 6b35c48d — `git hash-object` on my archive equals BANKED's |

**The pass-9 advance** (`959454c2` → `04c8b7dc`, 17 files +3,697/−325): the 13 homes-v2 paths (instruments, not
SELF's), and SELF's own five — `rowBudget.ts` (+47, new), `rowBudget.test.ts` (+53, new), `PlayerMark.vue` (+40/−36:
the key re-cut onto `takesShort`, `UNDER_BOARD`/`NAMES_OVER_CELLS`/`covered`/`area` deleted, the 350 ms comment,
`touch-action: manipulation` on `.player-mark`, two `// policy:` lines), `useSession.ts` (+1 `// policy: quiet`),
`player-mark.spec.ts` (+380 lines touched). `HeadSheet.vue` is unchanged since pass 8.

## 2 · Re-derived measurement A — the three forgiveness rows (charter row 1), both engines

My battery on `04c8b7dc` (`:4241`), 6 rows per engine (the three debt rows + the three key rows of §3), load read
before each run (chromium opened at **25.79**, webkit at **48.42**; ends 48.42 / 52.36; all < 120).

| row | chromium clean / CUT gap (ms) | webkit clean / CUT gap (ms) | clean states | CUT states |
|---|---|---|---|---|
| S2 press forgives (withheld) | 33.5 / 15.8 | 21 / 23 | `false,true,false` | `false,true` |
| S3 key forgives (withheld) | 18.6 / 14.4 | 21 / 13 | `false,true,false` | `false,true` |
| S1 paid click, `own` (chromium only) | 15.7 / 23.9 | — | `false,true,false` | `false,true` |
| S1 paid click, `relabel` | 12.5 / 25.6 | 72 / 92 | `false,true,false` | `false,true` |

Exit **0 / 0** (6 passed each). The lane's figures reproduce in shape (its 13–78 ms; mine 12.5–92 ms).

**My own born-RED, independent of the lane's `ctx.route` cut**: I deleted each clause from the SOURCE in my tree
(`plant.py`: `NOPRESS` = `onPress` loses `owedAt = -Infinity`, `NOKEY` = `onKey` loses it, `NOPAID` = `onClick`
loses it), let the dev server serve it, and ran the matching row. **6/6 RED** (3 clauses × 2 engines, each exit
1), and each reds on the CLEAN arm's states (`["false","true"]` against `["false","true","false"]`, e.g. NOPRESS
chromium gap 19 ms, webkit 12 ms), not merely on the cut's hit count. Restored by sha1 (`PlayerMark.vue`
85afa644, `rowBudget.ts` af62045c = the bank blobs). So the in-run negative is the same defect a source deletion
makes: **charter row 1 is CLOSED**, with three reservations:

- The rows read the activation at **12–92 ms**, not where the pass-8 critic found the cost (+109 to +143 ms); the
  window is 350 ms and nothing sits near its far edge. The comment names the pass-8 costs; no row reads there.
- The cut is a regex over Vite's dev transform (`function onPress(e) {` with types stripped). On a built dist the
  CUT arm reads `hits 0` and reds: it fails loud, not vacuous, but these three rows are dev-server-only instruments.
- The `relabel` delivery's comment says "one `mouse` click 60 ms after the release"; in Chromium the trusted touch
  click cancels the timer and the relabel fires at +4–6 ms (my log: `click:mouse@6`). Only WebKit reads the 60 ms.

## 3 · Re-derived measurement B — the key on no-growth (charter rows 3, 7), both engines, and its disjunct plant

**Clean bank** (same battery as §2): `the row budget adds rows only where they grow nothing` (all 14 KEY_CELLS,
incl. 1366×768 9×9/16×16 and 1194×834 9×9/16×16), `holds one pose across 1024-1056 x 768 coarse` (nine widths,
board left strictly rising, 1/3 at each) and `the desk draws one row over two cells` (`|top − 124.45| ≤ 0.5`, three
ages): **GREEN in chromium and webkit**, exit 0 / 0. The pass-8 cliff (1040 → 1048) is gone and the pitch is
priced per board. Charter rows 3 (as a behaviour), 6 (unit row + comment) and 7 are CLOSED on my read.

**The disjunct plant the lane did not run on the surface — `LAPONLY`**: `takesShort` reduced to `laps(tall, board)`
(the null clause and the area comparison both gone; any lap takes one row). Rows: the KEY_CELLS row, the sweep,
the desk, the resize re-read, the portrait/landscape-phone row.

| plant | KEY_CELLS (14) | sweep (9) | desk | resize | unit `rowBudget.test.ts` |
|---|---|---|---|---|---|
| `LAPONLY` chromium | **GREEN** | **GREEN** | **GREEN** | **GREEN** | — |
| `LAPONLY` webkit | **GREEN** | **GREEN** | **GREEN** | **GREEN** | **2/8 RED** (the two keep-tall rows: "the board ends ε inside your row", "under your row as much as under all four") |

The `:546` row (phones, 768×1024, 844×390 landscape) under `LAPONLY`, read at a 120 s budget (§8): **GREEN**, chromium (exit 0). Under the default 30 s budget it died on infrastructure in every run, clean included.

**The area comparison is unreachable on the real surface.** Every e2e row reads the same with or without it.
Its keep-tall side needs a board whose overlap with the four-row sheet equals its overlap with the one-row sheet
while the tall one laps it; the board sits below the head, so its bottom is always below the short sheet's, and
any lap grows with the added rows. Only the synthetic unit boxes reach it. So, as shipped, "no-growth" is
operationally pass 8's `NAMES_OVER_CELLS = false` arm (any lap → one row), with the comparison as unwitnessed
substrate. That isn't wrong, and the lane half-says it ("No cell keeps four rows that lap the board"), but LAWS
P8 §F asks every box disjunct for a plant that reds only it **on the surface it gates, or a stated
unreachability reason**. Neither is in the bank: the comment and the B-NAMES caption describe a measure that never
decides a cell. B-NAMES arm (a) should be captioned as "any lap → one row".

## 4 · Charter row 2 / CHAIR §7 — the drawn roster (read on the PROPOSED diff, not the bank)

The bank carries no roster: `ROSTER = 'DRAWN_FRAMES' in edgeBands` is false on homes v2, and the four-band row
`test.skip`s. On the bank alone the section's only B3 gate on its drawn frame **cannot fail**: a SKIP inside a
battery that reports "22 passed + 1 skipped, exit 0". The lane says so (its gap 1). What I add:

1. **`thickTol` escapes the roster's refusal.** `fourBands` refuses a typed `thick` beside `drawn`, but
   `thickTol` (default 0.9) stays a free caller option and B3 is `thickness < thick * thickTol`. A caller
   passing `{ drawn: 'head-sheet', thickTol: 0.5 }` floors the 1.5 px frame at **0.75**, and a 1 px frame clears
   it. That is the lane-chosen parameter CHAIR §7 rules is never a closure, re-opened one option over. The
   typings (`edge-bands.d.mts`) still type `thickTol` beside `drawn`. Born-RED in §4a.
2. **The `tray-well` entry has no consumer.** `DRAWN_FRAMES['tray-well']` pins 4 sites at 1.5 px in
   `GameControlPanel.vue` (the pin holds: 4/4 at 1.5 on `74a2b5d9`, `04c8b7dc`, `acb9c08e` and `f333e6de`, my
   read with the roster's own regexes), but no row on the bank or on the WAVE + delta passes
   `drawn: 'tray-well'` (`git grep` over `e2e/` and `scripts/`). CHAIR §7 names "the wells and both head
   sheets"; the wells' B3 is pinned in a roster and gated nowhere. Consumer-less substrate.
3. **Off-roster drawn frames exist on the union.** The WAVE's `GameControlPanel.vue` carries two more
   `<HandDrawnOutline … :stroke-width="1.5">` (class `bar-frame`, and one with no class). Under §7 they keep the
   1.80 floor; nothing reads them at all. A roster keyed by class, not a census, cannot see a new drawn frame.
4. **The real-surface row ships THIN_1PX but not the 0.55× plant** (LAWS P8 §E: "every drawn-edge gate ships
   the 1 px plant AND the 0.55× plant"). The 0.825 px plant and the ±ε pair (1.40 / 1.30) live only in the
   library's fixture self-test. Monotone with THIN_1PX, so a letter gap, not a hole.
5. **The SKIP is a masked fallback once folded.** The row keys on the export's presence. If the fold lands and
   a later edit renames or drops `DRAWN_FRAMES`, the row goes back to SKIP with exit 0. After the fold the
   absence must red, not skip.
6. **"Both head sheets" = one site, correctly.** `HeadSheet.vue` holds the one `head-sheet-frame` and both the
   @mbabb card (`AttributionCard.vue:87`) and the lobby (`PlayerLobby.vue:3`) mount it. That matches §7.

### 4a · The roster on the real surface, and the `thickTol` born-RED (bank + PROPOSED, my tree)

- PROPOSED on `04c8b7dc`: `patch --dry-run` 0, applied 0 (and `git apply --check` 0 on `f333e6de`, §1).
- **Four-band row with the roster folded: GREEN in chromium (2.5 min, load 66.04 at open) and webkit (4.4 min,
  load 58.43)**, exit 0 / 0. It runs four regimes × two themes × both sheets with its plants red, and is no
  longer a SKIP. The lane's reading reproduces.
- **Library self-test, chromium, DPR 1 and 2, clean: exit 0, 0 `WRONG`.** The drawn rows read as the lane
  says: 1.5 px at the roster floor GREEN +0.150, 1.40 GREEN +0.050, 1.30 RED −0.050, 1 px and 0.825 px RED,
  off-roster RED at 1.80, the 1.4 pin RED, a typed `thick` REFUSED.
- **My plant, one self-test row added in scratch** (`tol-plant.py`):
  `{ drawn: 'head-sheet', drawnSource: <1.5>, thickTol: 0.5 }` on the 1 px fixture, want RED (B3). Result, light
  and dark: **`→ GREEN ← WRONG`**, self-test **exit 3** (the library's own "hole" code). The library takes the
  roster's floor and lets the caller halve it. Restored by copy (`edge-bands.mjs` sha1 e8687ead, the PROPOSED
  bytes). The cure is one clause: refuse `thickTol` beside `drawn` as `thick` is refused (or pin it to 0.9),
  with this row as its plant.

## 5 · The on-WAVE delta — gates re-read by me on `git archive`s of `acde977b` (pristine) and `f333e6de` (+ delta)

| gate (exit read bare from a file) | pristine `acde977b` | + delta `f333e6de` | reading |
|---|---|---|---|
| `check-theme-tokens.mjs --self-test` | 1 | 1 | pristine: **2 bare + 2 masked** · delta: **2 bare + 0 masked**. The `--head-rule` fallback strike reaches the WAVE (App.vue:1261, AttributionCard.vue:166 now `var(--head-rule)` bare; v8 §2's union-born red is cured). The 2 bare are ConfirmRibbon's `--tap-floor` (T9-R10). The lane's §5 row reads "pristine 1 … only the 2 bare": the pristine also carried the 2 masked it cures, so its pristine column under-reports |
| `check-motion-bands.mjs --self-test` (`GIT_DIR` on main's object store, read-only) | **0** | **1** | `[B2 CLOSED] MOTION.presenceInkMs = 400 is a duration outside the ladder and outside the exemptions` + the negative-negative REGRESSED. **The delta lands a red on the union**; the lane leaves it red and re-asks a ballot |
| `check-pencil-verbs.mjs --self-test` | 0 | 0 | GREEN on the delta only because the delta writes **its own two ADMITTED rows into VERB's ledger** (`PlayerMark.vue :: color var(--presence-ink-dur) var(--ease-standard) #1` as `signature`, `0s #1` as `prm`). A lane admitting its own sites into another section's gate is the gate re-worded to pass, however "provisionally" it is labelled. §13 has not admitted them |

Other script hunks in the delta, read: `check-font-coverage.mjs` (+`lobbyStrings`, two `BOUND_TAPES` rows; FACE's
ledger), `check-motion-bands.mjs` (the well's three GRADED rows → six DELETED rows with values; LADDER's ledger),
`check-pw-projects.mjs` (+`player-mark.spec.ts`), `check-theme-tokens.mjs` (`--tap-floor` scope row; the
`useJoinWash.ts: 1` publisher pin struck). The deletions follow the well's deletion and tighten (a re-added
publisher reds); the two verb admissions and the B2 red do not.

**The ballot is mis-named.** The lane files `presenceInkMs` as **B-SEAM**. B-SEAM is already v8's ballot for
`TAP_IS_A_LOOK` (registry-v8 §ballots; pass-8 CHAIR pick 9 set its default to (b)). Its "(b) via the chair"
reads as if the chair had ruled this seam; it has not. It needs its own name, and until the chair rules it the
union carries a lane-born B2 red.

## 6 · Constraints

- **π vs `74a2b5d9`: not re-read by the lane, not re-read by me.** I read the product advance line by line (§1):
  at rest the sheet is shut, and the only rest-state byte is `touch-action: manipulation`, which paints nothing.
  The open sheet's pose is the claimed surface. Pass 8's π read (`pass8/prototype/PLR-SELF/readings/pimode.jsonl`)
  therefore stands by construction; it's a cite, not a reading, and it costs a point on this pass's number.
- **AA**: no new ink in the product delta; the painted-AA rows are pass 8's and T9-R8 stays cited.
- **filterBudget 9**: no `filter` in SELF's product delta (read). The lane's CSS diff vs pass 8 (+26 B, one
  declaration) agrees; I did not rebuild the dist.
- **M16**: SELF's product delta adds no UI string (read); `lint:copy` 0 is the lane's.
- **`@property`**: bank unchanged from pass 8; on the WAVE the delta drops its own `--head-rule` block and keeps
  the union's single registration (`index.css:240` on `f333e6de`, one `@property --head-rule`). Verified by grep.
- **The ballot pair on one payload**: B-NAMES is still unframed (numbers only, §2 of the lane's README); no crop.

## 7 · The pass-8 critic's ten gaps, and the chair's picks, judged

| pass-8 gap | pass-9 state (my read) |
|---|---|
| 1 forgiveness clauses unplanted | **CLOSED** — in-run negatives, plus my source deletions 6/6 RED (§2) |
| 2 B3 at a lane-lowered thick 1.5 | **OPEN** — ruled by CHAIR §7, roster PROPOSED not folded; bank row SKIPs; `thickTol` escape; wells unconsumed (§4) |
| 3 fitted 0.7, one-width cliff | **CLOSED** as behaviour (sweep GREEN ×2); the area clause is surface-unreachable, undeclared (§3) |
| 4 1366×768 / 1194×834 unpriced | **CLOSED** — priced in KEY_CELLS, GREEN ×2 |
| 5 §E(i) arms not in the landed row | **CLOSED IN CODE, UNRUN ON THE BANK** — the arms exist, the row SKIPs without the roster |
| 6 untyped `edge-bands.d.mts` | **CLOSED** — homes v2 typed, taken by sha |
| 7 `!short` flip undeclared | **CLOSED** — doc + unit row + plant (lane's 8/8 battery; LAPONLY reds the keep-tall rows, §3) |
| 8 350 ms asserted; touch-action scope | **CLOSED IN CODE** — comment + `touch-action` on `.player-mark`; RUNSHEET line drafted, not landed; M19 the owner's |
| 9 desk `Math.round` | **CLOSED** — tolerance row GREEN ×2 |
| 10 carried | carried: check 8 FLOOR BAND (fold's), T9-R8, B-NAMES unframed, real iOS, π cited |

CHAIR picks for this family:
- **§7 drawn roster in the ONE library with plants**: NOT MET at this bank. It's a PROPOSED diff (the lawful form
  under §9; the chair folds), and as proposed it carries the `thickTol` hole and an unconsumed `tray-well` entry.
- **§7 every other edge keeps 1.80**: met in code (off-roster RED at 1.80 in the fixture).
- **The `--head-rule` fallback strike reaches the WAVE through the on-WAVE delta**: MET — masked 2 → 0 on
  `f333e6de` (§5).
- **Batch gate**: SELF's bank exists and is byte-verified (COUNT/PLACE can take it by sha: blobs in BANKED.txt
  match my archive); the roster arm is not in the library. SIX's seed term and ABSOLUTE clause are SIX's, and I
  didn't read them.

## 8 · Control exits, the portrait row, unit and WAVE suite

- **Control `:4259` (`74a2b5d9` dist)**, chromium, `key forgives` + `the desk draws one row`: **exit 1**, both RED by
  absence (the roster poll and the mark's locator time out: no mark on the control). Born-RED by absence, as the
  lane read it.
- **The `:546` row (portrait phones, 768×1024 tablet, 844×390 landscape) on the CLEAN bank, chromium, load
  50.96: exit 1 — `Test timeout of 30000ms exceeded`** after ~7 of its 8 cells. Same budget death as in all three
  plant runs (Incidents 3). The lane's battery read it GREEN at a lower load. A landed row that dies at load 51
  under its default 30 s budget, while the box law takes verdicts up to 120, is a fragile row: it needs its own
  `test.setTimeout` (its siblings carry 300 s). The raised-budget re-reads follow.
- **`:546` at `--timeout 120000` (CLI budget only; no product or spec byte changed), clean bank: chromium 1 passed (48.8 s, load 74.50), webkit 1 passed (54.6 s, load 72.19)**, exit 0 / 0. The row is correct and needs ~50 s at load ~73: its 30 s default is the defect. Same budget, `LAPONLY`: chromium GREEN (§3).
- **`rowBudget.test.ts` clean** (after restore, sha1 af62045c): 8/8, exit 0. Under `LAPONLY`: 2/8 RED (§3).
- **WAVE + delta (`f333e6de`), unit chunked by directory**: pencil 16 files / 163, games 59 / 784, composables
  3 / 16 (lib and assets hold no test files, exit 1 "No test files found") = **78 files / 963 tests green** — the
  lane's figure reproduces.

## Incidents (self-declared)

1. **A near-miss: `git apply` from inside my scratch tree resolves to MAIN's repository** (the scratch lives under
   main's ignored `.claude/`, so `git rev-parse --show-toplevel` there is main's root). I caught it before any
   apply ran: the PROPOSED diff went on with `patch -p1` in the tree instead. No git ran against main's work tree
   or index; every temporary index sat under my durable scratch, and the only object writes were the `write-tree`s
   that reproduce the banked trees.
2. **Plants planted while another reader ran**: my `rowBudget.test.ts` run landed while `LAPONLY` was planted, so
   it read 2/8 RED. I keep it as the plant's unit reading (§3), not as a clean reading; the clean unit read is §8.
3. **The portrait/landscape-phone row (`:546`) timed out or failed on infrastructure in all three plant runs**
   (`LAPONLY` chromium: `crowd` poll killed at the 30 s test budget; `LAPONLY` webkit: `settled` killed at the
   budget; `GE` chromium: `invite`'s drawer never hid). None is a pose assertion. The row carries 8 cells and no
   `test.setTimeout` override, so the 30 s default is its budget at load ~50. §8 has its clean reads.
4. **`zsh` ate `$t:web/…`** (the `:w` modifier) in my first per-tree loop; re-run with `${t}:…`. No reading was
   taken from the broken run.

## Replay route

Scripts in my durable scratch (`<critic-scratch>`, the lane dir `crit-PLR-SELF`; copies of the two plant scripts in
`logs/`):
1. `replay.sh`: temporary indexes on main's object store, never its work tree → every tree and check in §1.
2. `git archive 04c8b7dc` → `tree/`, `node_modules` linked to the house install, `.critself/{vite,pw}.mts`
   (scratch only, cacheDir under scratch). Dev `:4241`, control preview `:4259`.
3. `batt1.sh` (§2/§3 clean battery ×2 engines) → `plants.sh` (NOPRESS/NOKEY/NOPAID/LAPONLY ×2, GE chromium;
   `plant.py`, restored by sha1) → `post.sh` (`:546` clean and LAPONLY, the control rows, then `prop.sh`:
   PROPOSED by `patch -p1`, four-band ×2, self-test clean, `tol-plant.py` row) → `post2.sh` (`:546` at
   `--timeout 120000` ×2 engines + LAPONLY; the clean `rowBudget` unit read).
4. `git archive acde977b` / `f333e6de` → `w-*`; `bands.sh` (lint:bands with `GIT_DIR` read-only, lint:verbs),
   `check-theme-tokens.mjs --self-test`, `unit-wave.sh` (vitest by directory).
Every exit read bare from a file the run wrote; loads printed at each run's head and tail.

Servers: dev `:4241` (pid 63375, child 63448, cwd my `tree/web/frontend`) and control `:4259` (pid 63378, child 63452,
cwd `w7-control/web/frontend`), both started by me and stopped by SIGTERM after a cwd check; both ports free after.
Nothing committed, stashed, pushed, deployed or installed.
