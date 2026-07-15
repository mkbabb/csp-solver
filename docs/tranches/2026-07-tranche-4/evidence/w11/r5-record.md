# T4-W11 · Lane R5 — THE use<Game> STATE-MACHINE TWIN (the cure row)

Base branch `t4-w11-wip` @ `8bf069df` (the full R1–R4 + RS + KEY tree). The census's
"state machine shared, domain ops slot" verdict — the 544-CORR-identical twin no original
row owned, the one that V's floor gate reds on. R5 lifts the whole board state machine to
`games/shared/useGameState.ts`; the two composables become thin domain-op adapters.
Port 4685. CEN's live figures govern. **NO rust, NO spec/config/golden edit.**

## BORN-RED (the 544 twin at the start tree)

```
use<Game>.ts twin (CORR): A(useSudoku)=582  B(useFutoshiki)=606  id=544   (93.5% of smaller)
cloc(web/frontend/src/games) = 11,163   (sudoku 2,674 / futoshiki 2,895 / shared 5,472)
```

V's verdict was RED at 11,163 (≤10,678 CEN ceiling; ≤10,867 team-lead cure ceiling). The
544-mult twin is the whole state machine, carrying everything the tranche landed: WU's undo
spine (tagged log + board pool + recordBatch + epoch capture-at-dispatch + the restoring
flag), the staged deal (pendingSize, arm-not-live), W8's assist/marks wiring, W7's grading,
the peek cache. The identical mass IS the shared machine; the divergence is DOMAIN OPS.

## THE EXTRACTION SHAPE (the R3/R4 house grammar — thin composable, slots as per-game fns)

- **NEW `games/shared/useGameState.ts`** (647 cloc) — the game-agnostic machine. Owns EVERY
  twin behaviour comm -12 named: the undo/history integration (`useUndoHistory` wiring,
  recorders, replay effects), epoch/race discipline (dispatch-gen capture + drop-on-mismatch +
  single-writer push-after-resolve), the staged-deal state (`solverSize`/`pendingSize`/`deal`),
  the dirty signal (`isDirty`), the peek cache + marks lifecycles (`usePencilMarks`/
  `useUserMarks`/`useAssists`), the grade/hint spine, and the URL/persist choreography — plus
  `initBoard`/`clearBoard`/`randomize`/`solve`/`fillForced`/`snapshotBoard`/`restoreBoardState`.
  Every game-specific seam enters through ONE `GameStateDomain` slot object — per-game
  functions/values, **zero config booleans** (the P12 god-interface guard).
- **The two size refs stay neutral in the machine** (`solverSize` = the raw selector value,
  `pendingSize` = the staged one, `boardSize` = `computed(domain.boardSizeOf(solverSize))`,
  `totalCells` = its square). The adapters re-label: Sudoku `solverSize → size`, Futoshiki
  `pendingSize → pendingBoardSize` (its public `boardSize` is the machine's derived computed —
  proven read-only externally: no `.boardSize.value =` write anywhere, only `pending*`/
  `difficulty` are written). Sudoku's `boardSize` was ALREADY `computed(size**2)` — no change.
- **The thin adapters** (`useSudoku` 52 cloc, `useFutoshiki` 73 cloc): each builds its domain
  slot object + calls `useGameState` + re-labels the return (2–3 lines) + keeps its genuine
  residue (Sudoku's node-budget table / subgrid math; Futoshiki's `inequalities` ref +
  node-budget table + Latin-square identity math). Public surface byte-compatible.

### The domain-op slot table (every seam, per game)

| Slot | Sudoku | Futoshiki |
|---|---|---|
| `initialSize` | `initial.size` | `initial.boardSize` |
| `boardSizeOf(n)` | `n ** 2` (subgrid→dim) | `n` (identity — plain N×N) |
| `nodeBudgetForSize` | `{2,3,4}` table, ?1M | `{4,5,6,7}` table, ?4M |
| `getRandomBoard` | `api.getRandomBoard(n,d)` | `api.getRandomBoard(n,d)` |
| `applyDealFurniture(board)` | noop | `inequalities.value = board.inequalities` |
| `resetFurniture()` | noop | `inequalities.value = []` |
| `grade(v,n)` | `gradeSudoku(v,n)` | `gradeFutoshiki(v,n,inequalities)` |
| `solve(v,n,budget)` | `api.solveBoard(v,n,budget)` | `api.solveBoard(v,n,inequalities,budget)` |
| `propagate(v,n)` | `api.propagateBoard(v,n)` | `api.propagateBoard(v,n,inequalities)` |
| `fillForced(v,n)` | `fillForcedSudoku(v,n)` | `fillForcedFutoshiki(v,n,inequalities)` |
| `hint(v,n,pref)` | `hintSudoku(v,n,pref)` | `hintFutoshiki(v,n,inequalities,pref)` |
| `snapshotExtra()` | `{}` | `{ inequalities: [...] }` |
| `restoreExtra(blob)` | noop | `inequalities.value = blob.inequalities.map(...)` |
| `restorePersistedFurniture(p)` | noop | `inequalities.value = p.inequalities.map(...)` |
| `syncToUrl` / `clearPersisted` / `dropBoardParam` | per-game module fns | per-game module fns |
| `persist(payload,n)` | `persistBoard({size:n,...payload})` | `persistBoard({boardSize:n,...payload,inequalities})` |
| `writeShareUrl(n,v,tc)` | `writeBoardToUrl(encodeBoard(n,v,tc))` | `…encodeBoard(n,v,tc,inequalities)` |

### PRESERVED EXACTLY (owner-audited, verify-proven — the machine is faithful line-for-line)

- The **epoch parity ruling**: every board-REPLACING resolve (`randomize`, `clearBoard`,
  `restoreBoardState`) bumps `boardGeneration`; **`solve` does NOT** (mutates in place — marks
  survive, crest untouched). The `dispatchGen` is captured at dispatch; a stale resolve (gen
  moved mid-flight) `return`s — **single-writer push-after-resolve, zero orphan entries**.
- The **`restoring` flag** walking marks past the void-watch on the restore's generation bump.
- **Refuse-while-pending** (`pending: () => loading.value` in the undo effects).
- The **batch entry for Fill** (`recordBatch`, one gesture/one undo, Δ0 records nothing).
- **Session-only history**; the staged/live partition (`deal` commits `pendingSize`,
  size-changing deal is a clean-reset off-log); the WU prev/next-marks pool shape unchanged
  (`recordBoard(prevBlob, nextBlob, prevMarks, nextMarks, op)`). The board-blob key order is
  identical (`{…, inequalities}` last for Futoshiki), so the content-hash pool dedups the same.

## THE FLOOR — the headline gate (cloc before/after, real deletion)

```
cloc(web/frontend/src/games)   BEFORE 11,163  →  AFTER 10,747     (net −416)
  sudoku    2,674 → 2,144   (−530)
  futoshiki 2,895 → 2,362   (−533)
  shared    5,472 → 6,119   (+647  — the single-copy machine)
```

- **AFTER = 10,747 ≤ 10,867** (the team-lead cure ceiling, excl. KEY's +189 declaration
  layer) — **GREEN, 120 cloc of margin.** Net removed **416** vs required **≥296**; CEN's
  formula predicted ~336 from the 544-mult twin — delivered 416 (the machine deduped tighter
  than the trivial-discount floor, as the twin was 93.5% identical, the highest of any pair).
- **Real deletion, not relocation**: the two composables shed **1,063 cloc** (594+594 → 52+73);
  shared grew **647** (the machine). 647 landed < 1,063 removed → the machine is genuinely
  smaller than the two copies it replaces.
- Also clears the stricter CEN ≤10,678? No (10,747 > 10,678) — but that ceiling folds the
  882-line trivial-structural inflation CEN itself measured; the **binding cure gate is
  ≤10,867**, and it's GREEN.

## TWIN COLLAPSE (comm -12 CORR)

```
use<Game>.ts twin:  544 → 27    (A=52 / B=73)
```

The 27 residue is undedupable adapter scaffolding: the two `import` blocks, `useSolver()`/
`resolveInitialState()` calls, the `NODE_BUDGET_BY_SIZE` structural lines (VALUES differ
2/3/4 vs 4/5/6/7), and the identical-signature slot keys (`syncToUrl`, `dropBoardParam`,
`getRandomBoard: (n,d)=>api.getRandomBoard(n,d)`). Merging them would fork the differing
budget tables + technique imports + size math into a config flag — the named failure mode.

## THE BATTERY (all GREEN, UNEDITED)

| Gate | Command | Result |
|---|---|---|
| types | `npx vue-tsc -b --force` | exit **0** |
| unit | `npm run test:unit` | **273 passed / 22 files** (271 baseline + KEY's 2, UNEDITED) |
| eslint | `npm run lint:eslint` | exit **0** (three-home tripwire holds — the machine imports only `@pencil`/`@/`/`@games/shared`, nothing from `@games/{sudoku,futoshiki}`) |
| knip | `npm run lint:knip` | exit **0** (`useGameState` consumed by both adapters) |
| prettier | `npx prettier --check src/` | exit **0** |
| build | `npm run build` | exit **0** (418ms) |

## THE INVARIANT — vs the BUILT DIST (`vite preview --port 4685`, killed after)

Default suite via a TEMP webServer-free mirror (`playwright.r5-verify.config.ts` =
`{...base, webServer: undefined}`, **DELETED after**) so Playwright never touched the owner's
`:3000` (verified still up + untouched) / `:3001`. Golden self-skipped its `:3000` on
`PLAYWRIGHT_BASE_URL`.

| Suite | Config | Result |
|---|---|---|
| **default e2e** | temp mirror, `:4685` | **63 passed** (final dist) |
| **visual goldens (π)** | `playwright-golden.config.ts`, `:4685` | **4/4 passed** — `cell-light`, `grid-corner-light`, `logo-light` (**clean first shot, no flake**), `toggle-crest-dark` BYTE-FOR-π; **zero re-baselines** (`git status e2e/` clean, no PNG touched) |

### WU undo / staged-deal / dirty e2e paths explicitly exercised (all in the green 63)

- `affordances.spec.ts:229` **undo**: Ctrl+Z reverts, Ctrl+Shift+Z redoes, Meta+Z, plain-z
  not swallowed (the `recordEdit`/`undo`/`redo` spine).
- `affordances.spec.ts:263` **fill batch**: one Fill sweep undoes as ONE gesture, redo
  re-fills (`recordBatch`).
- `affordances.spec.ts:294` + `permalink.spec.ts:94/107/123` **permalink**: share writes
  `?board=` and a reload reproduces the exact board (`shareBoard`/`writeShareUrl`); randomize
  drops `?board=` (`dropBoardParam`); futoshiki loads WITH its inequalities (furniture travel).
- `mobile-affordances.spec.ts:341` **Deal is dirty-gated (T4-WU/U3)**: a pristine board carries
  no arm; a dirty board arms first (`isDirty` off the undo depth).
- `mobile-affordances.spec.ts:245/252` + `affordances.spec.ts:357/376/449` **peek + marks +
  composed keyboard** (both games): long-press peek (`peekSolution`), K-marks, K-peek + roving
  + undo in one session.
- `sudoku-interaction.spec.ts:47/65/88/186` **solve epoch**: randomize→solve→success,
  solve→edit→idle revert (`applyCellValue` reverts state), consecutive solve, solve failure.
- `futoshiki.spec.ts:66/125` **size switching** (`deal` staged commit) + **solve**.
- `share-truth.spec.ts` share success/failure + corrupt `?board=` margin notice (`linkError`).

## THE PERF DELTA — idle-0-paint invariant (owner P0), CEN recipe verbatim

`cen-idle-paint.mjs` vs the R5 dist on `:4685`. **A concern surfaced and was falsified by A/B.**

| Metric (dealt board, 5s) | Sudoku | Futoshiki (clean) | CEN baseline |
|---|---:|---:|---|
| **main-thread paints (trace)** | **0** (2/2) | **0** (5/6) | 0 |
| `RecalcStyleCount` Δ | **40–41** | **40** | ~40 (tripwire floor) |
| boil beats/sec · class-mut | 15.98 · 160 | 15.98 · 160 | 16 · 160 |
| liveCount (grain-hoist layers) | 4 | 4 | 4 |

- **Sudoku: 0 paints EVERY run, RecalcΔ 40** — the machine adds no vnode/reactivity depth.
- **Futoshiki: 5/6 clean at 0 paints / RecalcΔ 40 / boilMut 160 / liveCount 4**; 1/6 leaked
  34 paints — the **CEN-documented Worker deal-tail** ("~16–34, 2 of N runs; re-run/lengthen
  settle to reach the 0-paint steady state").
- **The A/B that falsified the false alarm**: a 6s window first showed futoshiki 3/3 at ~40
  paints. Testing paint-vs-window scaling on MY tree gave 5s=32 / 8s=54 / 12s=80 (linear,
  ~6.5/s). I restored the **baseline composables** (`git checkout` the pair, park the machine),
  rebuilt, and measured: baseline futoshiki gave **8s=54 / 12s=80 — BYTE-IDENTICAL to my tree**,
  and 5s ran **3/6 clean (0) / 3/6 leak (32–34)**. The periodic activity + the intermittent
  5s deal-tail are **pre-existing futoshiki characteristics**, not an R5 regression. Restored my
  files, rebuilt, re-measured: **5/6 clean, identical distribution.** Sudoku control clean both.

## RUST INVARIANT

**R5 touched ZERO rust** — FE-only footprint (`git status csp-solver/` clean of R5 edits). The
174-test baseline is preserved by construction; per CEN §0, V measures rust off the clean base.

## FOOTPRINT (clean, additive, FE-only)

```
 M web/frontend/src/games/sudoku/composables/useSudoku.ts          (→ thin domain adapter, 52 cloc)
 M web/frontend/src/games/futoshiki/composables/useFutoshiki.ts    (→ thin domain adapter, 73 cloc)
?? web/frontend/src/games/shared/useGameState.ts                   (the shared state machine, 647 cloc)
```

Temp `playwright.r5-verify.config.ts` DELETED, `:4685` killed, `:3000`/`:3001` never touched,
`CONTRIBUTING.md` deletion untouched. No commit (team lead commits). Tree left additive.

## RESIDUE ACCOUNTING (where the 544 went)

- **517 lines → the single-copy machine** (`useGameState.ts`): the shared state machine, now
  one home instead of two.
- **27 lines → undedupable adapter scaffold** (imports, `useSolver`/`resolveInitialState`
  calls, budget-table structure, identical-signature slot keys) — merging them forks the
  genuinely-divergent budget values / technique imports / size math into a flag.
- **The genuine per-game residue stays in the adapters**: Sudoku's `{2,3,4}` budget table +
  subgrid `n**2`; Futoshiki's `inequalities` ref + `{4,5,6,7}` table + identity math + the 9
  inequality-threading closures.

**HEADLINE: floor GREEN at cloc(games)=10,747 ≤ 10,867 (net −416, required ≥296); twin
544→27; full battery + 63 e2e + 4/4 goldens + idle-0-paint all GREEN, unedited; 0 rust.**
