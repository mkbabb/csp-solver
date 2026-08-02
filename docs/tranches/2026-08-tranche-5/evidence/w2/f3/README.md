# T5-W2 F3 — ONE SOLVER SPINE (move 2.2)

**Lane** Opus, under the Fable team lead · **opened/closed** 2026-08-01 · **base** `e63af853`
(working tree carrying F1 + the three F2 lanes) · **tree** working, uncommitted — the lead commits.

The charter of record is `../wave-open.md` §2 rows 2.2a–2.2c and §3's π schedule; the patterns of
record are `../f1/` and the three `../f2-*/`. This directory is the solver lane's evidence.

| File | What it holds |
|---|---|
| `10-pi-entry.txt` | **the four goldens BEFORE a line of F3** — the four-game migration's pixels, proven |
| `20-pi-exit.txt` | the four goldens on the final tree, md5s of the chunks they were taken against |
| `30-vitest.txt` | the unit lane, 31 files / 350 tests |
| `40-build.txt` | the build, green, with the emitted-asset table both bundle arms read |
| `50-censuses.txt` | workers · `?url` · protocols · per-game solver dirs · `ensureInit`, source AND dist |
| `60-live-five-games.txt` | **the live proof** — five families dealing and solving in a real browser |
| `70-killed-files.txt` | the killed-file ledger with `wc -l`, and why one corpse died early |
| `80-bundle.txt` | the 2.2 bundle row, including the one gate figure that missed |

---

## What landed

**Five solver spines became one, over one worker, over one binary.**

| | before | after |
|---|---|---|
| `useSolver.ts` | 5 (840 raw) | **0** — `games/shared/solver/client.ts` |
| `solver.worker.ts` | 5 (634 raw), `ensureInit` byte-identical ×5 | **1** (`solverSpine.workers: 1`) |
| `protocol.ts` | 5 (402 raw) over a 32-line shared frame | **1** (`solverSpine.protocols: 1`) |
| `?url` import of the `.wasm` | 5 source sites, 5 dist chunks | **1** site, **1** chunk (`urlContractSites: 1`) |
| wire codecs | 3 `*Wire.ts` under `<g>/solver/` | on the clue seam, `<g>/clue.ts`, 4/4 |
| per-game solver dirs | 5 | **0** |

**The one protocol says what it carries, not what a game calls it.** The five per-game protocols
diverged at exactly two points — what the dimension was *named* (`n` for the boxed families,
`boardSize` for the Latin ones) and what the clue buffer was *named* (`inequalities` ·
`thermometers` · `cages` · `cages`). Neither is a difference in the wire: both marshal as a
`Uint32Array` beside the board and both name the same wasm argument slot. So the wire carries
`dim` and `clue`, and `game` selects the family. Sudoku's `clue` buffer is empty — the wire form
of `clues: null`, the same stated absence the spec declares. Thermo/killer/kenken/futoshiki's
`templates` buffer is empty — same discipline, other axis.

**The one worker is a message loop and a five-row table.** The table is not the registry fiction
reborn: the wasm binary's own surface *is* five families (15 verbs), and one worker over one
binary has to say which one it means. Nothing in it declares what a game IS.

**The one client is a pure facade over a module-singleton transport.** It holds no state, so a
game constructing it costs nothing, and every game's board rides the same hot worker — a lazy
game's first deal no longer pays a cold wasm instantiation the eager game already paid for.

What a game still supplies is only what a game alone knows: `game` (the family), `boardSide` (its
OWN `boardSizeOf`, handed over rather than re-derived — the same function `useGameState` already
gets one line away), `clue` (the seam's codec pair, or `null`), `templates` (or `null`).

**`spec.solver` is back to the charter's `{ nodeBudget }`.** F1 amended it to
`{ nodeBudget, prewarm }` with a named cause and scheduled its own death at 2.2. 2.2 collected:
one worker means one warm, so `GameShell` imports `prewarm` from the client that performs it
instead of asking five games for five handles onto one act.

---

## Green

| gate | result |
|---|---|
| **π entry** | **4/4** — `cell-light`, `grid-corner-light`, `logo-light`, `toggle-crest-dark` |
| **π exit** | **4/4**, same four, on the final dist, one tree state, no rebuild between arms |
| `vitest run` | **31 files, 350 tests, 0 failed** (341 at the F2 close) |
| `vue-tsc -b` | 0 errors, whole tree |
| `npm run build` | green |
| `prettier --check src/` | clean |
| `eslint .` | clean |
| `lint:boundary` | **12 errors, unchanged** — every one pre-existing, 2.5's row. `git diff` over `src/games` adds **zero** cross-game import lines |
| `lint:knip` | **4 rows, unchanged** — all four pre-existing (`SolveState`/`SolveStats` ×2 games, 2.3's kill list). F3's own four (`Tier`, `DealtBoard`, `SolveResult`, `SolverErrorResponse`) were un-exported to 0 |
| **live** | five families deal + solve to a complete board in chromium, **zero page errors** |

**Not run, by charter:** the full e2e suite, the throttle lane, coverage. π + unit + build are F3's.

---

## π — the entry gate, and what it cost to read honestly

The lane's first ordered act was π **before touching anything**, because the four-game migration
had landed and nobody had proven its pixels. Two things had to be got right to read it at all:

1. **The charter's literal gate command does not work on this host.** It defaults `baseURL` to
   `:3000`, which here answers `200 {"status":"ok","service":"palette-api"}` — an unrelated
   service from another project, not the SPA. `global-setup.ts` correctly refused it (`#app` never
   visible). Goldens mint against the **built dist** by standing discipline anyway, so the run
   went through a `vite preview` on this lane's own `:4188` (killed at close). The owner's
   `:3000`/`:3001`/`:4288` were never touched.
2. **The first honest read was 3/4, and the red was a flake — proven, not assumed.**
   `toggle-crest-dark` came in at ratio 0.03 against a 0.017 darwin soul floor. Rather than wave
   at the charter's "NO π CLAIM RESTS HERE", the lane characterized it: the surface oscillated
   **1028 ↔ 1194 px between consecutive captures inside one stabilization loop**, and then passed
   **5/5 on immediate re-runs against the byte-identical dist**. That is the non-convergence
   `visual-golden.spec.ts:206-215` documents in its own comment ("flaked this golden three times
   across unchanged trees, each red passing on rerun of the same SHA"). Independently: `git status`
   over `src/pencil/**` is **empty** and `index.css` is untouched, so the crest's subject is
   byte-identical to HEAD. Banked entry read: **4/4**.

**No golden was re-baselined, and none needed to be.**

---

## For the lead

1. **THE F2 BARRIER IS DISCHARGED — and it had to be, here.** `f2-thermo/20-barrier.md` raised two
   shared defects and stated that "until they land, **no migrated row mounts**". Both were true and
   both were still open at F3-open: `App.vue`'s `loader: card.scene!` resolved `undefined` for all
   four lazy rows, and `GameShell` bound no `:clue`. The lane landed **the barrier's own patches,
   verbatim**, including its `ClueSeam.from` amendment (named cause, dated, carried into the type's
   doc comment). Reasons, in order: a non-null assertion on a field no row carries is precisely the
   masking fallback the wave's laws forbid; both were interim states this workflow's own sequence
   had to clear by VERIFY; and without them **no claim about a solver spine could be verified at
   all** — four of five families could not reach the worker. `60-live-five-games.txt` is what that
   bought.
2. **`futoshiki/game.ts` and the last `gameRegistry` row died early — F3's consequence, not a raid
   on F4.** The corpse's `solverPayloads: useSolver` named a per-game solver module, and 2.2
   deleted every one. Pointing it at the one client would have been a second path to a seam that
   now has exactly one. `registry.ts` declares `gameRegistry = {}`; the file, the type, the
   identity function and the test still go together at F4, so 2.1a is advanced, not pre-empted.
3. **The bundle row missed by 0.37 kB, and the lane did not tune it.** π §3 asks for "worker chunk
   count 5→1, main chunk not larger". Worker chunks: 5→1. Main chunk: **+0.37 kB (+0.17%)**, because
   the main chunk now carries the client that serves five games where it carried sudoku's own. Total
   dist JS: **−76.35 kB**. Full argument and both arms in `80-bundle.txt`. Accept or restamp — the
   lane declines to hold the row by keeping the eager game off the shared client, which would be
   the collapse undone.
4. **2.2d is NOT landed, and here is its born-RED state, re-derived.** The charter's wire-guard row
   ("a truncated group buffer **throws** for thermo, killer AND kenken") is a behaviour change and
   my exit list does not carry it. State on the final tree, at the codecs' new home: `killer/clue.ts`
   and `kenken/clue.ts` `break` on a truncated group (drop the dangling count); `thermo/clue.ts`
   guards nothing at all. **0/3 throw.** The move is a one-file-per-game edit now that all three
   codecs sit beside each other — cheaper than it was, and it wants its own probe banked before its
   cure.
5. **`spec.solver.nodeBudget` still has zero production reads.** F3 removed the one thing that made
   `spec.solver` a live slot (`prewarm`, by its own schedule). `nodeBudget` is NAMED by each spec
   and READ by each model through the same export, so the fact has one home — but nothing reads it
   *off the spec*. That is a 2.1b census row, stated rather than papered over; it is not a
   regression F3 introduced and it is not F3's to invent a reader for.
6. **`clue` is now a ninth read expression per clued game** (barrier §2's own prediction), so
   `clues` stops being the one slot in the union whose value was declared but never consumed.
