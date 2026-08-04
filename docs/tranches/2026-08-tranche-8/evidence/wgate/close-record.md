# T8 — the marks tranche · WGATE close record

DRAFT — seals at the end of this file; every § below states its own evidence.

## §1 · What this tranche was

Twenty owner marks (M1–M14, M16–M20; **M15 was never issued** — the numbering is the
owner's, kept verbatim), executed as seven waves plus chair work:

- **W1 chrome cures** (M2/M3/M4/M8) — `dee8d97d`
- **W2 interaction cures** (M5/M7/M9/M10) — `dee8d97d`+`9ef3fd23`
- **W6 the copy purge** (M16) — `d152a6a9`, the `lint:copy` gate standing in CI
- **W4 the logo class** (M6) — `d5655d9b`, the capture band [0.99, 1.5] gated
- **W3 the deep design pair** (M1/M11/M12/M13/M14) — design `beb251ba`, lanes
  `bfab089b` (A · substrate) / `f83536b0` (C · language) / `1802da4e` (B · deck)
- **W5 the bench** (the owner's bench ask + M19) — `f1aafba0`, residue generation r13
- **W7 alignment** (M17/M18) — `bde64fb7`
- **Chair** — M20 (`eb0ff0d9`), the wordmark-clip adjudication (same commit), the
  red-lanes cure + M19 remnant (`4c6ea788`), cursor-send wiring (in `f83536b0`)

The two owner ballots raised mid-design were resolved by the owner's word: **Option A**
(the table follows a switch) and **the table follows + slug/session preserved** (rejoin as
the same author on return). Both are implemented in Lane A's substrate and gated
(`session-substrate.spec.ts`, born-RED ×4 at `e296915a`) — dispositioned as T8-R01.

## §2 · The commit chain (this wave of work)

`e296915a` → `f1aafba0` (W5 bench) → `bfab089b` (W3-A) → `f83536b0` (W3-C + chair wiring)
→ `bde64fb7` (W7-G2 + A's App bindings) → `1802da4e` (W3-B) → `eb0ff0d9` (M20 + clip
adjudication) → `8d9139c2` (M20 control poll + whole-tree battery) → `4c6ea788` (red lanes
cured). Earlier waves: `1bac685a` (formation) → `dee8d97d` → `9ef3fd23` → `d152a6a9` →
`d5655d9b` → `beb251ba`.

## §3 · The gates at close

Whole-tree battery at `8d9139c2`/`4c6ea788`, quiet box:

| gate | result |
|---|---|
| vue-tsc · eslint | clean |
| unit | 547/547, 51 files |
| lint:sleep / motion / copy / lanes / boundary / ink / catch | all OK (29 specs declared) |
| e2e default, both engines | 401 passed / 0 failed / 2 skipped |
| goldens vs built dist | 4/4 unmoved |
| doc-truth | 0 RED / 32 GREEN (self-test 49/49 both colours) |
| evidence-policy | PASS |
| npm audit | 0 vulnerabilities (undici ^7.29.0 override; wrangler stays 4.116.0) |
| CI at `4c6ea788` | PENDING — run 30937087945 |

## §4 · The ladder (U-10: no mark closes here — every position awaits the owner's eye)

| mark | position | where the cure lives |
|---|---|---|
| M1 hover attribution + ghost cursors | cured-pending-re-look | C: tape + aria suffix, ghost tier 4; A: `cur` wire; chair: cursor-send at GameBoard's focus seams |
| M2 divider above deal | cured-pending-re-look | W1 `--ink-press-rule` |
| M3 superfluous text pruned | cured-pending-re-look | W1 census + cures; M16 re-graded every survivor |
| M4 staging-band language | cured-pending-re-look | W1 band rebuild (the 0.67px WebKit wrap died) |
| M5 consistent hover boil | cured-pending-re-look | W2-C census + invariant |
| M6 logo low-res | cured-pending-re-look | W4: the vueuse SVG lens class killed; band [0.99, 1.5] counted, 0 outside |
| M7 Esc + transition jitter | cured-pending-re-look | W2: Esc window-owned; 3 measured mechanisms dissolved |
| M8 controls reflow | cured-pending-re-look | W1 fixed 544×112 footprint ×5 games |
| M9 dark-toggle storybook | cured-pending-re-look | W2-C git archaeology, the old definition re-used |
| M10 flank click-to-warp | cured-pending-re-look | W2-B |
| M11 more than two games | cured-pending-re-look | B: 3 slots, 5 at ≥113rem, edge 0, graded depth |
| M12 live true-state previews | cured-pending-re-look | B previews + A `previewFor`/`flushSave`; persistence across switches |
| M13 multiplayer × gallery edges | cured-pending-re-look | the apotheosis 26-row matrix; A's session-is-the-table + FOLLOW (both owner rulings in) |
| M14 join/leave animation | cured-pending-re-look | C: join ring (seed 91, filterless), roster fold, J/L/R beats, PRM forms |
| M16 the copy law | ENFORCED, STANDING | W6 purge + `lint:copy` in CI; permanent law |
| M17 masthead line | cured-pending-re-look | G2 `--head-rule`; badge/toggle 12.00/12.00 every desk rung |
| M18 title↔board rhythm | cured-pending-re-look | G2: kenken 96–112px dead paper → 0.00; left line 0.00 |
| M19 Safari puppeting | LAW EXECUTED, STANDING | frontmost machinery deleted; quiet driver (W3C-direct safaridriver, never focused); last remnants stripped at `4c6ea788` |
| M20 wordmark floats on board | cured-pending-re-look | chair: dock height-scoped ≤500px + fallback band clearance; gated §M20 both engines |

Adjudicated, not a defect: **the wordmark first-frames "clip"** (G2's hand-off) — four
scenarios × two engines × per-frame counting, zero frames of ink past the box; what the eye
catches is the authored 1.2s reveal wipe on cold mount
(`evidence/chair-wordmark-clip/report.md`). Whether the wipe stays is the owner's call.

## §5 · The bench (W5 + the r13 residue)

The r-series (D3, pinned snapshot `index-C9b17OTx4t72.js`): iOS sim boil × multiplayer
**15/15 PASS** at 101.49–102.84% of ceiling, long33 = 0 in all fifteen — multiplayer moves
fps by <0.6 across solo → present → traffic. Desktop Safari rows PASS via the quiet driver.
Solve family tabled ungraded; one unpriced cost flagged: sudoku 16×16 MEDIUM **generation**
684ms median (solve 55ms).

The r13 generation (T8-R10; this close, against the deploy candidate
`index-jt51RN8od5PV.js`) — EXECUTED, `evidence/w5-bench/README.md` §9.2: the suspect sim
cell re-measured PASS (102.33%, long33 0); the cold arm priced (worker init 12–21ms,
a cold 16×16 cell whole in 281ms); the chromium footnote run (relative shape agrees);
**the wire re-run cleared the drift note — Lane A's rewritten wire prices the same,
101.46–102.77% of ceiling, long33 0 in all twelve cells, multiplayer still free**; and
the top-size HARD cells measured to their timeout: **thermo and killer 16×16 HARD
generation exceed the 25s probe leash on real desktop Safari**, widening T8-R05 to a
three-game class (sudoku's r-series timeout was the first sighting).

## §6 · Deploy + the live visual pass

PENDING — CH-57 gated on run 30937087945: `ci-conclusion.sh` → `npm run deploy --
--conclusion-file`; then the visual pass on sudoku.babb.dev, both engines, incl. the M20
window (900×676), the deck at 1280/1808, a two-context join/leave, and the five games.

## §7 · Residue + the owner's ballots (row ids → `DISPOSITIONS.md`)

- **T8-R02 · the mid-dusk ink dip** (~120ms, T3-W10-shipped) — default: ship as-is;
  ballot open.
- **T8-R03 · the cold-mount reveal wipe** (1.2s, reads as "sudok" mid-beat) — design
  ballot from the clip adjudication; shipped behavior is T3-era and unchanged.
- **T8-R04 · B's far tier at 0.58 dark** recedes hard against dark ground — owner's-eye
  item.
- **T8-R06 · B narrowed the FOLLOW ribbon** to peers ≥ 1 ("0 other players will follow"
  is a false sentence) — named deviation, adopted.
- **T8-R07 · C's boot suppression** silences the roster row's write-in as well as the
  ring — C's reading of "no trace"; rows still land. Adopted.
- **T8-R05 · sudoku 16×16 MEDIUM generation 684ms** — unpriced; banked with a trigger
  (pre-generation is the obvious lever).
- **T8-R08 · A's bounded leaks, named**: a follower whose game chunk never resolves leaks
  one `adopted` credit; a crashed tab's claim prunes at the 8-room bound. Banked.
- **T8-R11 · below 768 the badge has no gallery mount** (G2) — M17's gallery clause
  satisfied ≥768 only; a design call past the mark. Ballot.
- **T8-R09 · the e2e contention class** stands documented: rows red under multi-worker
  load, green serial — the M20 control now polls for exactly this reason. Closed.
- **T8-R12 · the M19 law's tranche execution** — closed at `4c6ea788`; the law itself is
  permanent.

## §8 · Traps banked this close

- **scene.css is GameScene-SCOPED** — a selector for another component's element builds
  inert. The M20 cap landed there first and died silently; the born-RED gate caught it.
  Shell-geometry rules live in `GameBoard.vue`'s own scoped style.
- **`useElementSize` on an SVG reads the transform-inclusive rect** (W4's class) — the
  lens is `useLayoutBoxSize`; three surfaces migrated.
- **A one-shot read after `addStyleTag` can race the sheet under load** (webkit, 4
  workers) — poll, don't sample.
- **`npm audit fix --force` offered a wrangler DOWNGRADE** (4.116 → 4.35) as its "fix" —
  the override pin (`undici ^7.29.0`) cures without touching the deploy tool.

## §9 · The seal

PENDING — CI conclusion, deploy id, live-pass results, and the seal SHA land here.
