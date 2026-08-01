# r2 · adversarial verification — the architecture-truth claims of `r1/consumer-truth.md`

**Repo** `CSC411_HW2_ProgrammingQuestion` · **commit** `71456713d9f7361af80f09e1a456fc9787507e78` (master; tree clean except the untracked `docs/tranches/2026-08-tranche-5/`) · **verified** 2026-08-01
**Posture** adversarial. Every r1 claim is treated as false until a command, a `file:line`, or a reproduction says otherwise. Read-only on source and configs; nothing built, installed, committed, or deployed.

**Build-artifact provenance (load-bearing for the shake evidence).** `web/frontend/dist/` mtime `2026-08-01 03:52`; the last commit touching `web/frontend/src` or `vite.config.ts` is `515bc537` at `2026-08-01 03:39`; HEAD `71456713` (04:23) touched only two `e2e/*.spec.ts` files (`git show --stat HEAD`). The working tree is clean. **The on-disk `dist/` therefore corresponds to HEAD's source.** `csp-solver/wasm/pkg/` is likewise fresh (mtime `2026-08-01 03:52`).

---

## Verdict table

| # | Claim under test | Verdict |
|---|---|---|
| I1a | `gameRegistry` has **zero production consumers** | **CONFIRMED** |
| I1b | **2/5** games registered in `gameRegistry` | **CONFIRMED** |
| I1c | **4/5** `GameDefinition` slots test-only | **CONFIRMED — and understated** (see N1: they are test-*read* but production-*shipped*) |
| I1d | `SudokuGame.vue` bypasses the contract | **CONFIRMED** |
| TDZ | the recorded TDZ reason for the bypass is real | **CONFIRMED — reproduced** |
| I2 | `PropagationStrategy` / `propagate_with` have zero callers | **CONFIRMED, and r1's `UNKNOWN` RESOLVED** (zero bbnf host callers too) |
| I3 | the 5 workers' undeclared-subpath wasm import | **NARROWED** — mechanism confirmed, blast radius smaller than stated, trigger different from the one named |
| N1 | *(new)* `sudokuGame` ships as unreferenced dead bytes in the main production chunk | **NEW FINDING** |
| N2 | *(new)* `pkg/package.json` is a gitignored, regenerated wasm-pack artifact | **NEW FINDING** — relocates the I3 risk |

---

## I1 — the true consumer set of `gameRegistry` and `GameDefinition`

### 1.1 The attack — every indirection vector r1 could have missed

Each vector was run to exhaustion against `web/frontend/`, excluding `node_modules/` and `dist/`.

| # | Attack vector | Command | Result |
|---|---|---|---|
| A1 | `import.meta.glob` (Vite's file-system registry) | `grep -rn "import\.meta\.glob" --include=*.{ts,vue,js,mjs} .` | **0 hits, whole frontend.** No glob registry exists anywhere in the app. |
| A2 | dynamic `import()` reaching the registry | `grep -rn "import(" --include=*.{ts,vue} src/` | 13 hits. **All enumerated:** `main.ts:6` (dev rAF probe), `App.vue:78` (dev FilterTuner), 9 `registry.ts` poster/scene loaders (`:221,241,244,255,256,266,267,284,285`), `SudokuGame.vue:27` (laminate), `usePathAnimation.ts:15` (a `import("vue")` *type* position). **None resolves a game definition or `gameRegistry`.** |
| A3 | string-keyed access (`gameRegistry[id]`, `registry[…]`) | `grep -rn "gameRegistry"` unrestricted | 4 files total (below). **No bracket access exists** — every hit is a literal member read in a test, or prose. |
| A4 | router indirection | `grep -n "vue-router"` → absent; `README.md:62` "no router, no state library" | **No router.** The route is `?game=<id>`, parsed at `App.vue:85-86`, validated against `GAMES` (`App.vue:86`, `App.vue:124`), resolved by `sceneFor()` (`App.vue:56-71`), mounted at `App.vue:498` `<component :is="sceneFor(scene)">`. `GAMES` — not `gameRegistry` — is the only table on that path. |
| A5 | build-time codegen | `vite.config.ts` declares exactly **two** plugins: `sudoku-templates` (`:26`, `name:'sudoku-templates'` `:84`) and `head-hints` (`:131`, `:135`) | `sudoku-templates` derives `src/games/sudoku/data/templates.ts` from `csp-solver/data/sudoku_puzzles`. **Neither plugin reads, writes, or references the registry.** No other codegen exists. |
| A6 | vite plugins / aliases smuggling a consumer | `vite.config.ts:204-205` `@pencil`→`src/pencil`, `@games`→`src/games` | Plain path aliases. No virtual modules, no `resolveId` hooks touching games. |
| A7 | e2e / scripts / npm-script consumers | `grep -rn "gameRegistry\|defineGame\|@games/registry\|GameDefinition" e2e/ scripts/ *.ts *.js *.json` | **1 hit, a comment:** `scripts/check-font-coverage.mjs:46` mentions "the games' `defineGame` sections" in prose. Zero code consumers. |
| A8 | anything outside `web/frontend/src` | `git grep -l "gameRegistry" -- ':!docs' ':!web/frontend/src'` | **Empty.** Nothing in the repo outside the four files below names it. |

### 1.2 The TRUE consumer set of `gameRegistry`

Unrestricted sweep, all file types:

```
$ grep -rn "gameRegistry" . --exclude-dir={node_modules,dist,dist-throttle,.git} -l
src/games/registry.test.ts
src/games/registry.ts
src/games/sudoku/SudokuGame.vue
src/games/sudoku/game.test.ts
```

Four files, and only two of them are *code*:

| File | Nature of the reference | Class |
|---|---|---|
| `src/games/registry.ts:134` | the declaration itself (`export const gameRegistry = {…} as const`); `:141,142,150,151,291` are doc-comments | **DECLARATION** |
| `src/games/registry.test.ts:97,99,100,101,102,129,130,131,182` | the only reads in the tree | **TEST** |
| `src/games/sudoku/SudokuGame.vue:43` | a `//` comment explaining why the scene does *not* import it | **COMMENT** |
| `src/games/sudoku/game.test.ts:8` | a doc-comment restating the same TDZ reason | **COMMENT** |

**I1a CONFIRMED.** Production reads of `gameRegistry`: **zero**. Eight attack vectors returned nothing.

**I1b CONFIRMED.** `registry.ts:134-137` holds exactly `{ sudoku, futoshiki }` — 2 of the 5 shipped games. `registry.test.ts:131` pins the absence of the other three: `expect(gameRegistry).not.toHaveProperty("thermo")`. The test is the map's only reader *and* the ratifier of its incompleteness.

### 1.3 `GameDefinition` — per-slot production consumption, all five scenes

`GameDefinition` is declared at `registry.ts:100-113` with five slots. Property access on the five definition objects, production `.vue` files only:

```
$ grep -rn "\(sudoku\|futoshiki\|thermo\|killer\|kenken\)Game\.[a-zA-Z]" --include="*.vue" src/games/
thermo/ThermoGame.vue:39     const sections = computed<ControlSection[]>(() => thermoGame.options(thermo));
kenken/KenKenGame.vue:35     const sections = computed<ControlSection[]>(() => kenkenGame.options(kenken));
killer/KillerGame.vue:34     const sections = computed<ControlSection[]>(() => killerGame.options(killer));
futoshiki/FutoshikiGame.vue:37  const sections = computed<ControlSection[]>(() => futoshikiGame.options(futoshiki));
```
*(the two `SudokuGame.vue` hits at `:40` and `:55` are inside `//` comments, not code)*

| # | slot | `registry.ts` | production reads | reader identity | test reads |
|---|---|---|---|---|---|
| 1 | `options` | `:110` | **4** | ThermoGame `:39`, KenKenGame `:35`, KillerGame `:34`, FutoshikiGame `:37` | ✔ |
| 2 | `model` | `:102` | **0** | every scene calls `use<Game>()` directly — `SudokuGame.vue:36`, `FutoshikiGame.vue:32`, `ThermoGame.vue:32`, `KillerGame.vue:28`, `KenKenGame.vue:29` | 20 hits in `*.test.ts` |
| 3 | `cellFurniture` | `:104` | **0** | every scene imports its Board component directly — `SudokuGame.vue:14`, `FutoshikiGame.vue:15`, `ThermoGame.vue:21`, `KillerGame.vue:20`, `KenKenGame.vue:21` | — |
| 4 | `clueFurniture` | `:108` | **0** | same — the overlay is wired inside each Board, never off the definition | ✔ |
| 5 | `solverPayloads` | `:112` | **0** | each game reaches its own `useSolver` directly | ✔ |

**I1c CONFIRMED** as arithmetic: `options` is the sole production-read slot; 4 of 5 slots have zero production readers. Two refinements the r1 phrasing loses:

- The four unread slots are not merely "declared" — they are **written at 5 sites** (`sudoku/game.ts:26-28,46`, and the twins at `futoshiki/game.ts`, `thermo/game.ts`, `killer/game.ts`, `kenken/game.ts`) and, for two of the five games, **shipped into the production bundle** (see N1). "Test-only" implies zero production cost. That is false.
- `options` at 4/5 is itself the surface of the bypass: the one game that skips it is the eager, default, most-trafficked scene.

### 1.4 `SudokuGame.vue` bypasses the contract — I1d CONFIRMED

`SudokuGame.vue:57-73` builds `sections` as a hand-written literal from `./ControlPanel/constants` (`:18`). `sudoku/game.ts:29-45` declares the byte-equivalent list through `defineGame`. The scene never imports `./game`:

```
$ grep -rn "from \"./game\"" src/games/sudoku/
src/games/sudoku/game.test.ts:23:import { sudokuGame } from "./game";
```

Only the test. **`sudoku/game.ts` has exactly two importers repo-wide** — `registry.ts:18` (which feeds it into the unread `gameRegistry`) and `game.test.ts:23`. The reference implementation of the contract has **no production reader**.

The divergence is guarded, not silent: `sudoku/game.test.ts:69-72` mounts the scene and asserts `shape(read())` equals `shape(sudokuGame.options(sudokuGame.model()))`, plus per-`onChange` behavioural parity at `:81-98`. Structural drift reds. **Semantic drift inside an `onChange` body beyond what `shape()` compares does not.**

### N1 — NEW: `sudokuGame` ships as unreferenced dead bytes in the main chunk

r1 stopped at "no production consumer". The stronger fact is what the bundler did with it. Probing the shipped main chunk:

```
$ grep -o "cellFurniture" dist/assets/index-Dm02QDxyy-Zi.js | wc -l
2
$ grep -o ".\{240\}cellFurniture.\{160\}" dist/assets/index-Dm02QDxyy-Zi.js
…var Tf={model:La,cellFurniture:ol,clueFurniture:null,options:e=>[{key:"size",heading:"Size",…
…var Ff={model:jv,cellFurniture:of,clueFurniture:uf,options:e=>[{key:"boardSize",…
```

`Tf` is `sudokuGame` (matches `sudoku/game.ts:26-46` field-for-field). `Ff` is `futoshikiGame`. Both survive into the **main entry chunk** — `registry.ts:18-19` statically imports them, so neither rides its game's lazy chunk (`FutoshikiGame-DCKlSo9bDPNy.js` contains **0** occurrences of `cellFurniture`).

Their fates diverge. From the chunk's own export list:

```
export{… Ff as i, … ol as _, …}          # futoshikiGame IS exported
$ node -e '…match(/(^|[^A-Za-z0-9_$])Tf([^A-Za-z0-9_$]|$)/g)…'
Tf identifier occurrences in whole chunk: 1 (1 = declaration only)
sudokuGame dead literal bytes: 315
main chunk total bytes: 239693
```

- **`futoshikiGame` is LIVE** — 2 occurrences: its declaration plus `Ff as i` in the export list, consumed by the lazy `FutoshikiGame` chunk at `FutoshikiGame.vue:37`.
- **`sudokuGame` is DEAD** — exactly **1** occurrence in 239,693 bytes: its own declaration. Never referenced, never exported. **315 bytes of unreachable object literal on the critical-path bundle**, plus it pins `model:La` (`useSudoku`), `cellFurniture:ol` (`SudokuCell`) and `solverPayloads:ma` (`useSolver`) as retained references.

The tree-shaker could not remove it because `registry.ts:18` imports it and `gameRegistry` (`:134`) closes over it. The TDZ forbids using it; the registry forbids deleting it. It ships doing nothing.

---

## TDZ — the recorded reason, verified by reproduction

**The recorded claim**, `SudokuGame.vue:40-46`:

> `NOT read off `sudokuGame.options` … Importing `./game` here closes the cycle scene → game → registry → scene, and registry's module body evaluates `gameRegistry = { sudoku: sudokuGame }` while that const is still in its TDZ: the app dies at boot with "Cannot access 'sudokuGame' before initialization"`

**The graph, from source.** Four edges, all static:

| edge | site |
|---|---|
| `App.vue` → `SudokuGame.vue` | `App.vue:15` |
| `App.vue` → `registry.ts` | `App.vue:35` |
| `registry.ts` → `sudoku/game.ts` | `registry.ts:18` |
| `registry.ts` → `SudokuGame.vue` | `registry.ts:24` |
| `sudoku/game.ts` → `registry.ts` | `sudoku/game.ts:10` |

**The order is load-bearing.** `App.vue:15` (the scene) precedes `App.vue:35` (the registry). ESM depth-first evaluation therefore enters the cycle *through the scene*. Adding `import { sudokuGame } from "./game"` to `SudokuGame.vue` makes the descent: `App` → `SudokuGame` → `sudoku/game.ts` (body **not yet run**) → `registry.ts` (deps `:18` and `:24` both already in-progress → skipped as cycle edges) → **`registry.ts` body executes line 134** while `sudokuGame`'s binding is uninitialized.

**Reproduction.** An isomorphic four-module ESM graph, each line annotated with the real `file:line` it mirrors, run under `node v26.0.0`:

```
===== HYPOTHETICAL (scene imports ./game) =====
.../hypo/registry.mjs:4
export const gameRegistry = { sudoku: sudokuGame }; // registry.ts:134
                                      ^
ReferenceError: Cannot access 'sudokuGame' before initialization
    at .../hypo/registry.mjs:4:39

===== ACTUAL (scene hand-inlines) =====
HYPO BOOT OK SudokuGame 1
```

**CONFIRMED.** The error string is verbatim what `SudokuGame.vue:44` records. The control arm — the shipped arrangement, scene hand-inlining — boots clean, which isolates the `./game` import as the sole cause.

Three corroborating notes:

1. **`defineGame` is a hoisted `function`, and that is why the *current* cycle survives.** `registry.ts:121` uses a function declaration, hoisted and initialized before `registry.ts`'s body runs, so `sudoku/game.ts:21`'s `defineGame({…})` resolves through the in-progress cycle edge. `registry.ts:119` records this in-file. Had `defineGame` been a `const` arrow, today's arrangement would TDZ too.
2. **The TDZ is not Chromium-specific and not dev-only.** Cyclic-ESM evaluation order is spec-fixed; a Rollup/Rolldown hoisted bundle preserves both the order and `const` TDZ semantics. `SudokuGame.vue:47-53` additionally records a real-MobileSafari exercise of the *shipped* arrangement (iOS 19, AppleWebKit/605.1.15, 81 cells, zero page errors trapped from a pre-module `<head>` hook) — that is evidence the bypass works, not evidence about the TDZ.
3. **The reason is real but the framing is narrow.** The TDZ is a consequence of `registry.ts:24` statically importing the scene *and* `registry.ts:18` statically importing the definition. It is a property of the current graph, not a law about eager games. UNKNOWN whether any alternative arrangement avoids it — establishing that is design work and out of scope here.

---

## I2 — `PropagationStrategy` / `Csp::propagate_with`

**Attack surface swept:** `examples/`, `benches/`, `tests/`, doctests, the wasm crate, the py bindings, and the bbnf vendored tree.

```
$ git grep -n "PropagationStrategy" -- '*.rs' '*.py' '*.pyi' '*.ts' '*.js'
csp-solver/src/config.rs:32          pub enum PropagationStrategy {
csp-solver/src/csp/solve.rs:9        use crate::config::{…, PropagationStrategy, …};
csp-solver/src/csp/solve.rs:21           self.propagate_with(PropagationStrategy::Auto)
csp-solver/src/csp/solve.rs:25       pub fn propagate_with(&mut self, strategy: PropagationStrategy) …
csp-solver/src/csp/solve.rs:30,32,34,37,51   (the enum's own match arms + self-recursion)
csp-solver/src/lib.rs:37             pub use config::{…, PropagationStrategy, …};
```

**Ten hits, all inside `csp-solver/src`.** Every one is the declaration, the re-export, or `propagate_with`'s own body recursing on itself (`:32`, `:34`). Zero in `csp-solver/examples/` (8 files), `csp-solver/benches/` (11), `csp-solver/tests/` (22), `csp-solver/wasm/`, or `csp-solver/src/py/`.

**Doctests.** The three remaining `propagate_with` mentions — `config.rs:30`, `error.rs:110`, `solver/ac3.rs:16` — are all prose inside `///` / `//!` comments, verified by reading the surrounding lines; none is inside a `` ```rust `` block. No doctest calls it.

**bbnf — r1's `UNKNOWN`, now RESOLVED.** `bbnf-lang` is on disk at `/Users/mkbabb/Programming/bbnf-lang` (HEAD `af15f63e0`). It carries a vendored copy at `crates/csp-solver/`, byte-identical at the relevant lines. Excluding that copy:

```
$ git grep -n "PropagationStrategy\|propagate_with" -- '*.rs' '*.ts' '*.py' ':!crates/csp-solver'
(empty)
```

Zero host callers. Every bbnf call site takes the bare auto-select entry point:

```
$ git grep -n "\.propagate()" -- '*.rs' ':!crates/csp-solver'
crates/core/src/backend/rust/analysis/inline/plan.rs:167   let _ = csp.propagate();
crates/egraph/src/csp_scheduler.rs:235                     let _ = csp.propagate();
crates/ir/src/passes/sets/dispatch/eligibility.rs:67       let _ = csp.propagate();
crates/ir/src/passes/sets/first_sets.rs:71                 let _ = csp.propagate();
crates/ir/src/passes/sets/follow.rs:70                     let _ = csp.propagate();
crates/ir/src/passes/span.rs:61                            let _ = csp.propagate();
crates/ir/src/passes/types/mod.rs:67,127                   let _ = …csp.propagate();
   (+ crates/egraph/tests/csp_scheduler.rs:214)
```

**I2 CONFIRMED, and stronger than r1 dared state.** `PropagationStrategy` and `propagate_with` have **zero callers in this repo and zero callers in the sole declared external consumer**. `docs/bbnf-integration.md:14`'s claim that bbnf "relies on the auto-selection" is corroborated by the call sites: it does, and it never names the enum. The only remaining UNKNOWN is a third-party crates.io consumer of `csp-solver` 0.6.0 outside both trees — unresolvable from disk.

---

## I3 — the 5 workers' undeclared-subpath wasm import — **NARROWED**

**The consumers.** Five workers import the raw binary by deep subpath, one line each:

```
src/games/sudoku/solver/solver.worker.ts:37
src/games/futoshiki/solver/solver.worker.ts:23
src/games/thermo/solver/solver.worker.ts:18
src/games/killer/solver/solver.worker.ts:18
src/games/kenken/solver/solver.worker.ts:18
    import wasmUrl from "@mkbabb/csp-solver-wasm/csp_solver_wasm_bg.wasm?url";
```

**The pkg's `exports` state.** `csp-solver/wasm/pkg/package.json`, verbatim and complete:

```json
{
  "name": "@mkbabb/csp-solver-wasm", "type": "module", "version": "0.6.0", "license": "MIT",
  "files": ["csp_solver_wasm_bg.wasm", "csp_solver_wasm.js", "csp_solver_wasm.d.ts"],
  "main": "csp_solver_wasm.js", "types": "csp_solver_wasm.d.ts",
  "sideEffects": ["./snippets/*"]
}
```

**No `exports` field.** r1 §3D confirmed on that point.

### What actually breaks, and when — resolution tested under all three states

A scratchpad clone of the real package (`package.json` + `.js` + `.wasm`) under `node_modules/@mkbabb/`, probed with `import.meta.resolve`:

| state | result |
|---|---|
| **A — as shipped today** (no `exports`) | `RESOLVED -> file:///…/csp_solver_wasm_bg.wasm` |
| **B — `exports` map added without a `.wasm` row** | `FAILED -> ERR_PACKAGE_PATH_NOT_EXPORTED \| Package subpath './csp_solver_wasm_bg.wasm' is not defined by "exports"` |
| **C — `exports` map including `"./csp_solver_wasm_bg.wasm"`** | `RESOLVED -> file:///…/csp_solver_wasm_bg.wasm` |

*(the repo's own `pkg/package.json` was left untouched — post-probe `grep -c exports` → `0`, md5 `253050d6e0d52b89cbabf75e1d5b20b0`)*

### The three timing questions, answered

| question | answer | evidence |
|---|---|---|
| **Does registry publish break it?** | **No.** | The `.wasm` is in `files`, so it ships. `npm pack --dry-run` in `pkg/`: tarball contains `csp_solver_wasm_bg.wasm` (122.4 kB), 6 files, 66.3 kB packed. And with no `exports` map, a registry consumer resolves the subpath by the same legacy fallback as state A. |
| **Does `npm pack` break it?** | **No.** Same evidence. One *minor* gap, unrelated to resolution: `csp_solver_wasm_bg.wasm.d.ts` exists on disk but is absent from `files`, so it is not in the tarball — a typings gap for registry consumers, not a resolution failure. |
| **"Nothing, because file:-link forever"?** | **No — that is also wrong.** The link is real (`node_modules/@mkbabb/csp-solver-wasm -> ../../../../csp-solver/wasm/pkg`, `web/frontend/package.json:37` `file:../../csp-solver/wasm/pkg`), but the exposure does not require anyone to publish, and does not require anyone to edit anything. See N2. |

### N2 — NEW: the exposure is a *generator* risk, not an edit risk

r1 §3D and D1 frame the hazard as "**Adding** an `exports` map … would break all five workers", which implies a deliberate human edit. That framing is wrong, because **the file nobody would edit is the file nobody *can* edit**:

```
$ git ls-files csp-solver/wasm/pkg
(empty)
$ git check-ignore -v csp-solver/wasm/pkg/package.json
.gitignore:74:csp-solver/wasm/pkg/    csp-solver/wasm/pkg/package.json
```

`pkg/package.json` is **untracked and gitignored** — a build artifact that `wasm-pack` regenerates wholesale on every build (`csp-solver/wasm/Makefile:19-21`, and its own comment at `:16-18` confirms it: "pkg/ is gitignored … a local build artifact"). `git grep "pkg/package.json"` over non-doc files returns **nothing**: there is no post-build patch step, no `jq` assertion, no CI tripwire on this file's shape.

So the `exports`-map state is not a decision this repo holds. It is whatever the installed `wasm-pack` emits. And the generator floor is **open-ended**:

```
.github/workflows/ci.yml:318   - name: Install wasm-pack (>=0.14 floor — D9 three-file atomicity)
.github/workflows/ci.yml:348   - name: Install wasm-pack (>=0.14 floor)
.github/workflows/ci.yml:395   - name: Install wasm-pack (>=0.14 floor — see the wasm job note)
$ wasm-pack --version
wasm-pack 0.15.0
```

A minimum, no maximum, no lockfile. **The failure mode is: a `wasm-pack` release starts emitting an `exports` map, CI installs it, and all five workers fail to resolve `csp_solver_wasm_bg.wasm?url` — with zero source change, zero diff to review, and no gate watching this file.** The break lands at build/resolve time (a Vite resolve error on `npm run build` and on dev), which is loud, not silent — but it lands on a file no reviewer sees.

**Verdict I3: NARROWED.** The mechanism r1 describes is real and empirically confirmed (state B). The blast radius is smaller than the "undeclared surface" framing suggests — publish, pack, and registry consumption are all unaffected today. The genuine exposure is N2: an ungated, unpinned generator owns the resolution contract for five production workers.

**Ancillary, confirmed:** r1's U10 stands. `sideEffects: ["./snippets/*"]` names a directory that does not exist (`ls csp-solver/wasm/pkg/` → 7 entries, no `snippets`), and it too is generator-emitted, not authored here.

---

## Adjudication facts (no design)

### F1 — what the registry was chartered to be

The charter is `docs/tranches/2026-07-tranche-4/waves/T4-W11-game-contract-distillation.md`, "The keystone — `defineGame` + `PuzzleClass` (P12, the deliverable)", `:50-68`. Its origin is the distillation census `evidence/x/x6-distillation.md:124`:

> **P12 | THE GAME CONTRACT — what a "game" IS to the shell** … *implicit* — no interface exists; each game is a bespoke dir wired by convention … The shell's contract … is nowhere declared as a type; it's re-satisfied ad hoc per game. Distillation must PRODUCE `defineGame<TBoard, TCell, TClue>()` so game #3 (x2/x4) plugs in, not forks.

and `x6-distillation.md:126`: "P12 (the contract) is the *absence* that forces all the others to fork."

The wave's own statement of intent, `T4-W11:55` and `:64`:

> `// web/frontend/src/games/registry.ts — the named game interface (NEW; the absence P12 names)`
> **KISS guard against a lossy god-interface**: the contract is *only* the intersection the shells already need; anything game-specific stays a slot/impl, never a config flag.

**The two acceptance gates as written** (`T4-W11:91-92`):

| gate | text |
|---|---|
| **contract exists** | "`defineGame` + `PuzzleClass` are **absent today** (`grep -rl defineGame` empty — RED); after, **both games are declared through the contract** and a game dir is `{ model, cell-furniture, clue-furniture, options, solver payloads }`" |
| **contract acceptance** | "a **third-game stub** … compiles against the contract **with zero shell edits** — the acceptance proof that the contract is the intersection, not a fork point" |

**The gate as recorded closed** (`evidence/w11/gates.md:30-31`):

| gate | probe | observed | status |
|---|---|---|---|
| contract exists (FE+Rust) | `grep -rl defineGame src`; `grep -rln PuzzleClass csp-solver` | defineGame in registry.ts + both game.ts + test | **GREEN** |
| contract acceptance | `vue-tsc -b --force`; `git diff --stat games/shared/` | vue-tsc 0; no tracked shell edited | **GREEN** |

**The load-bearing fact for adjudication: both gates are satisfied by *declaration* and *compilation*. Neither gate names a runtime reader.** `grep -rl defineGame` is a declaration probe; `vue-tsc -b` is a type probe; `git diff --stat games/shared/` is an absence-of-edit probe. All three go green on a contract that nothing consumes. The charter's own framing — "**names the TYPE they satisfy**", `evidence/w11/key-contract.md:5` — is a compile-time claim, and it is true today. The charter never asserted the shells would *read* the definition; `key-contract.md:6-7` says the opposite in passing: "Additive only — the shells, scenes, and shipped-game components are **BYTE-UNTOUCHED**."

### F2 — the runtime path each of the 5 games actually takes, route → mounted board

Common prefix, identical for all five: `?game=<id>` → `parseGame()` `App.vue:84-87` (validated with `GAMES.some`) → `game` ref `:117` → `scene` ref `:119` → `sceneFor(scene)` `:56-71` (`GAMES.find(c => c.id === id) ?? GAMES[0]`) → `<component :is="sceneFor(scene)">` `App.vue:498`.

| game | card | chunk | scene component | model | board/cell furniture | control sections | solver payloads |
|---|---|---|---|---|---|---|---|
| **sudoku** | `registry.ts:215-226`, `eager:true` | main (static `registry.ts:24`, `App.vue:15`) | `SudokuGame.vue` | `useSudoku()` **direct** `:36` | `SudokuBoard` **direct import** `:14` | **hand-inlined literal** `:57-73` | `useSolver` **direct** `:12` |
| **futoshiki** | `:228-245` | lazy `FutoshikiGame-*.js` | `FutoshikiGame.vue` | `useFutoshiki()` **direct** `:32` | `FutoshikiBoard` **direct import** `:15` | **`futoshikiGame.options(...)`** `:37` | direct |
| **thermo** | `:249-257` | lazy `ThermoGame-*.js` | `ThermoGame.vue` | `useThermo()` **direct** `:32` | `ThermoBoard` **direct import** `:21` | **`thermoGame.options(...)`** `:39` | direct |
| **killer** | `:260-268` | lazy `KillerGame-*.js` | `KillerGame.vue` | `useKiller()` **direct** `:28` | `KillerBoard` **direct import** `:20` | **`killerGame.options(...)`** `:34` | direct |
| **kenken** | `:271-286` | lazy `KenKenGame-*.js` | `KenKenGame.vue` | `useKenken()` **direct** `:29` | `KenKenBoard` **direct import** `:21` | **`kenkenGame.options(...)`** `:35` | direct |

Read down the columns: **`GAMES` carries the whole route**; `gameRegistry` carries none of it; and of the contract's five slots, only `options` is on any runtime path, on four of five scenes.

### F3 — the minimal factual statement of the divergence

> `defineGame`/`GameDefinition` was chartered as the named type the shared shells satisfy (P12, `x6-distillation.md:124`), and its acceptance gates measured declaration, compilation, and absence-of-shell-edits (`T4-W11:91-92`; `w11/gates.md:30-31`). All five games declare through it. At runtime, the shells consume one of its five slots. `options` is read by 4 of 5 scenes; `model`, `cellFurniture`, `clueFurniture` and `solverPayloads` are read by none — every scene reaches its composable, its board component, and its solver directly. The routing table the app actually uses is `GAMES` (`registry.ts:294-300`), a separate structure in the same file; `gameRegistry` (`:134-137`), which holds 2 of the 5 games, has zero readers outside `registry.test.ts`. The eager default game does not read its own declaration at all: `SudokuGame.vue:57-73` hand-copies what `sudoku/game.ts:29-45` declares, because importing it would close a cycle whose evaluation order puts `sudokuGame` in TDZ at `registry.ts:134` — verified by reproduction, `ReferenceError: Cannot access 'sudokuGame' before initialization`. The unread `sudokuGame` object nonetheless ships: 315 unreferenced bytes in the 239,693-byte main production chunk, deletable by neither the bundler (`registry.ts:18` holds it) nor the author (the TDZ forbids using it).

---

## Residue and honest UNKNOWNs

| # | Item | Status |
|---|---|---|
| R1 | third-party crates.io consumers of `csp-solver` 0.6.0 naming `PropagationStrategy`, outside this repo and bbnf-lang | **UNKNOWN** — not resolvable from disk |
| R2 | whether any *published* `@mkbabb/csp-solver-wasm` version on the npm registry already carries an `exports` map (npm shows 0.2.0 as the last publish per `2026-07-tranche-4/evidence/w14/c-census.md:20`; 0.6.0 is unpublished) | **UNKNOWN** — no network probe run |
| R3 | whether `wasm-pack` ≥ 0.16 emits `exports` | **UNKNOWN** — unreleased; this is exactly what makes N2 a standing risk rather than a present defect |
| R4 | The r1 §4 drift note stands independently: `MEMORY.md` still asserts "FastAPI at web/api" and "the API is the Option-A reference"; `git ls-files web/api` → 0 files. Repo docs are correct; the memory file is stale. | corroborated, not re-litigated here |

**Discipline compliance.** No file under `web/frontend/`, `csp-solver/`, or any config was written, moved, or deleted. No build, install, commit, push, or deploy was run. `npm pack --dry-run` writes no tarball. No lockfile touched. Ports 3001/4288/3000/4188 untouched; `:4177` never bound. All scratch work lives in the session scratchpad.

ROW-COMPLETE
