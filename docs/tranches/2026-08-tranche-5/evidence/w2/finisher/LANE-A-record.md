# T5-W2 FINISHER · LANE A — the record

(This directory is shared with the other finisher lanes; `ax-mitigation.md`, `capture/` and
`instrument/` are not this lane's. Lane A owns the numbered transcripts 00-94 and this file.)

**Tree** `ff5a7cea` ("T5-W2 oracle cures") · **Date** 2026-08-01 · **Charge** the six unclaimed code
rows of the W2 finisher. Every claim below has a banked transcript in this directory. No git state
was changed; the working tree carries the diff.

## The rows

| # | Row | Status | Figures |
|---|---|---|---|
| 1 | Codec universalisation (Dev-20, §1.1/§1.4.1) | **LANDED** | 5 `*UrlState.ts` (1,696 raw) → one `games/shared/persistence.ts` (458) · perGameFiles **32 → 27** · permalink e2e **20/20**, 5/5 games, both engines |
| 2 | 2.2d wire guards 0/3 → 3/3 (Dev-6) | **LANDED** | born-RED 3 failing, then 3/3 THROW |
| 3 | 2.1b spec tests sudoku + futoshiki | **LANDED** | +14 rows, mirroring thermo/killer/kenken |
| 4 | `nodeBudget` wire-or-kill (Dev-7) | **LANDED — WIRE** | 3 distinct tables across 5 games ⇒ kill arm unavailable |
| 5 | row-6 sentinel flake | **LANDED** | digit identity → given count |
| 6 | `tdz-probe.mjs` | **LANDED** | green exit 0 on the tree, ablation red exit 1 on a scratch copy |

**Counts.** unit **357 → 392** (30 → 35 files, 146 suites) · e2e default **227 → 233** ·
perGameFiles **32 → 27** · `games/**` non-test raw **13,730 → 13,355** (−375).

**Gates, all green at the close.** `lint` · `lint:eslint` · `lint:boundary` · `lint:knip` ·
`lint:catch` · `lint:ink` · `lint:tdz` · `vue-tsc -b` · `check-doc-truth` (13/13) ·
`test:golden:bytes` · `test:prod-shake` · `test:font-coverage` · `test:support-floor` ·
`test:e2e:projects` · `test:e2e:retries` · unit-count 392 ≥ 300.

## Row 1 — what the collapse actually is

The axis was never per-game. What a game alone knows is its KEY, its SIZE MATH and its CLUE — and
the clue already carried its own codec pair on `spec.clues`, because the Worker wire needed one.
`createPersistence` takes those three and returns the seven functions the five composables passed
to `useGameState`.

The wire:

    base64url( <version byte> + "<rawSize>.<cells>" [ + ".<clue words>" ] )

The clue section is present exactly when the game HAS a clue seam. **Sudoku's `clues: null` keeps
its body two parts, so sudoku's wire is byte-identical to what it shipped with** — which is why
`visual-golden.spec.ts`'s `PINNED_BOARD` and every sudoku e2e row are untouched.

**THE ROUND-TRIP GUARD** is what makes one decoder safe for four clue vocabularies: a decoded clue
is re-encoded and compared word for word against the incoming buffer. Anything a codec would
silently absorb — a dangling futoshiki endpoint, a truncated thermo tube, a kenken operator ordinal
outside the four — fails the comparison and the link fails closed. The permalink inherits every
wire invariant the codec has, present and future, without knowing what a cage is.

### Disclosed behaviour changes (all four ride ballot 7)

1. **thermo/killer/kenken gain a real `?board=`.** They shipped a Share button over an empty codec:
   `writeShareUrl` a no-op, `dropBoardParam` a no-op, `boardLink` hard-coded `"absent"`.
2. **Futoshiki's clue section changes form.** `1-0,5-0` becomes `1,0,5,0`. An old
   inequality-carrying link now fails closed — it never mis-decodes, because `-` is not a canonical
   base-36 word. A futoshiki link with NO inequalities still round-trips byte-identically.
3. **thermo/killer/kenken now RESTORE from localStorage.** Their stubs returned
   `source: "restored"`, which matches none of `useGameState`'s three restoring sources, so all
   three persisted a board on every move and threw it away on every mount. The universal codec
   returns the real `InitSource` union and the saved board comes back.
4. **A corrupt stored tier coerces to EASY instead of discarding the board** (sudoku only — the
   other four already coerced). The board is the valuable unit.

### The defect kenken's new permalink exposed

`useGameState`'s `canRestore` required `Object.values(persisted.values).some(v => v !== 0)`. **A
KenKen board is dealt with no given digits at all** — its cages are the whole puzzle — so a shared
kenken board decoded fine, was refused by the machine, and the mount deal dropped `?board=` on its
way past. The guard now exempts `source === "url-board"`: a saved all-zero blob is still a session
nobody started, but a shared link is an explicit act. Caught by the row-8 e2e, one engine, on the
first run.

## Row 4 — the measurement, and what "wire" could reach

Five tables, **three distinct**: sudoku ≡ thermo ≡ killer `{2:200k, 3:2M, 4:50M}` · futoshiki
`{4:2M, 5:4M, 6:10M, 7:20M}` · kenken `{4:2M, 5:4M, 6:10M}`. The kill arm needed one identical
value across all five, so it was not available.

Wired to the **solver client**: `SolverClientConfig.nodeBudget` is the same function
`spec.solver.nodeBudget` names, and `solveBoard` defaults to it. `GameStateDomain` loses its
`nodeBudgetForSize` slot and `solve` loses its budget argument — the state machine stops carrying a
per-game search table through two call sites. The worker/protocol already honoured the field
(`solver.worker.ts:207` → `req.nodeBudget`); the parity unit now asserts the frame carries it.

**What this does NOT do, stated plainly:** it does not create a production READ of
`spec.solver.nodeBudget`. The union fixes `model: () => TModel`, and the model is what solves, so a
spec-read would require `composable → spec → composable` — the exact cycle 2.1 severed. The slot's
honest status is NAMING, and it is asserted by identity in 5/5 spec tests. Whether that satisfies
`registryFiction.productionSlotReads` is the lead's call, not this lane's.

## Standing-law compliance

- **Born-RED, every new gate.** Row 1: `10-row1-BORN-RED.txt` (three suites, absence).
  Row 2: `20-row2-2.2d-BORN-RED.txt` (0/3 THROW). Row 6: `60-…-ABLATION-RED.txt` (exit 1).
- **No golden re-baselined.** `--update-snapshots` never invoked. 8 golden runs, 1 red, on
  `toggle-crest-dark` — the surface §3 declares carries no claim. `90-pi-goldens.txt` reports it
  rather than curing it; `test:golden:bytes` green.
- **No git state changed.** Read-only `git log/show/diff/status` only.

## Open rows this lane hands up

1. **Coverage floor: 8 breaches, unchanged in count from HEAD** (`93-coverage-floor-delta.txt`).
   Composition moved again: sudoku shed its best-covered file to the shared floor, clearing
   `shared.branches` and `sudoku.functions` and newly breaching `sudoku.statements`/`.branches`.
   TOTAL rose 37.92% → 38.50%. The lead's two routes stand unchanged.
2. **`gallery-deal.spec.ts:432` × 2 engines** — the same two rows F5 banked, dev-server-bound by
   their own `page.route` on a source module path. Unchanged by this lane.
3. **Two e2e specs forge UNTAGGED `?board=` bodies** — `share-truth.spec.ts:29` and
   `affordances.spec.ts`'s `CONFLICT_BOARD`. The 2.4d ratchet refuses them, so both are now
   *fresh random deals* wearing a pinned board's name. They pass because they only need *a* board,
   but `affordances`' "deterministic conflict board" is no longer deterministic. Pre-existing at
   the tip commit, outside this lane's rows, and a real defect.
4. **`npm run test:coverage:floor` runs `--self-test` ONLY** — the script exits 0 after the control
   by its own `:352` note. The real floor check is `node scripts/check-coverage-floor.mjs` with no
   flag. The npm script's name promises the gate and delivers the control. (This is the same trap
   the Row-6 brief warned about; `tdz-probe.mjs` was written not to have it.)
5. **`scripts/tdz-probe.mjs` is wired to `npm run lint:tdz`** but not to CI. The CI edit is the
   lead's.

## The files

| Transcript | What it holds |
|---|---|
| `00-baseline-census.txt` | perGameFiles 32 and unit 357/30 at HEAD |
| `10-row1-BORN-RED.txt` | Row 1 born-RED — three suites, absence |
| `11-row1-census-after.txt` | perGameFiles 27, the LOC arithmetic |
| `12-row1-GREEN.txt` | 69 persistence rows across five games |
| `20-row2-2.2d-BORN-RED.txt` | 0/3 THROW |
| `21-row2-2.2d-GREEN.txt` | 3/3 THROW |
| `30-unit-battery-GREEN.txt` | the battery mid-lane |
| `40-row4-nodebudget-measurement.txt` | the grep, the three tables, the verdict |
| `50-row5-sentinel-diff.txt` | the sentinel diff |
| `60-row6-tdz-probe-ABLATION-RED.txt` | probe RED, exit 1, scratch copy |
| `61-row6-tdz-probe-GREEN.txt` | probe GREEN, exit 0, live tree unchanged |
| `70-static-gates.txt` | static gates mid-lane |
| `80-build.txt` · `81-e2e-permalink.txt` · `82-e2e-full.txt` | build, permalink 20/20, full suite |
| `90-pi-goldens.txt` | 8 golden runs, the one red, the reading |
| `91-exit-gates.txt` · `92-unit-count-coverage.txt` · `93-coverage-floor-delta.txt` | exit gates, counts, the floor |
| `94-final-battery.txt` | the close |
