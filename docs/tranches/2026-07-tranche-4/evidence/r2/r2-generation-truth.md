# r2-generation-truth — GENERATION TRUTH (the product-core generator, first lens)

Opens/generalizes FAM-9 `puzzle-gen-density` (r1-gestalt F1). No source edited. All
numbers below come from two THROWAWAY probe examples run against the real generation
functions (the exact browser path), then deleted; the tree is clean of them. Both are
reproduced verbatim in the "Rerunnable probes" appendix — drop either into
`csp-solver/examples/` and `cargo run --release --example <name>`.

Provenance of the numbers: `generate_board_with_templates_seeded` / `generate_futoshiki_seeded`
are the *identical* functions the wasm worker calls (`csp-solver/wasm/src/sudoku.rs:263,272`;
`csp-solver/wasm/src/futoshiki.rs:324`), fed the *identical* embedded template bank
(`embedded_templates`, the `include_dir!` embed the browser bundles as `templates.ts`). 30
seeded deals per (size, difficulty); givens = nonzero cells; difficulty proxy = `measure_difficulty`
(the codebase's own metric: ForwardChecking + FailFirst backtrack count); uniqueness = re-solve
under Ac3+Mrv with `max_solutions:2`, budget 50M nodes.

---

## The measured deal table (30 seeded deals each; the shipped browser path)

### Sudoku — `sizeOptions` = {2→4×4, 3→9×9, 4→16×16} (`web/frontend/src/games/sudoku/ControlPanel/constants.ts:5-8`)

```
N  diff    cells  bank  givens min/mean/med/max   backtracks(FC) min/mean/med/max   unique
2  easy    16     0     12/12/12/12                0/0/0/0                            30/30
2  medium  16     0      7/ 7/ 7/ 7                0/0/0/0                            30/30
2  hard    16     0      4/ 4/ 4/ 5                0/0/0/0                            30/30
3  easy    81     0     61/61/61/61                0/0/0/0                            30/30
3  medium  81     0     35/35/35/35                0/0/0/0                            30/30
3  hard    81    20     22/25/25/27          0/809181/268/3,298,051                  30/30
4  easy   256    10    192/192/192/192            0/0/0/0                            30/30
4  medium 256    10    110/113/113/119      0/331629/0/2,701,707                     30/30
4  hard   256     5    102/105/105/107            0/0/0/0                            30/30
```

### Futoshiki — `boardSizeOptions` = {4,5,6,7} (`web/frontend/src/games/futoshiki/ControlPanel/constants.ts:10-14`)

```
N  cells  givens(all deals)  inequalities  unique
4  16     12                 4             30/30
5  25     19                 5             30/30
6  36     27                 6             30/30
7  49     37                 7             30/30
```

---

## GEN-1 [P2] "Difficulty" is a givens-count knob; the search-difficulty proxy neither tracks the label nor stays monotone
`family_hint: difficulty-label-nonmonotonic`

`target_holes` is the *only* thing difficulty controls on the live path
(`csp-solver/src/puzzles/sudoku/generate.rs:280-284`): Easy `total/4`, Medium `total/1.75`,
Hard `total/1.25`. Givens therefore track the label monotonically (easy > medium > hard, every
size — table above). But the codebase's own difficulty metric, `measure_difficulty`
(`generate.rs:51`, FC+FailFirst backtracks), does **not**:

- **9×9 Easy and Medium are indistinguishable in search difficulty** — both measure **0
  backtracks across all 30 deals**. A 0-backtrack board is solved by pure propagation (naked/hidden
  singles), no guessing. A 35-given "Medium" 9×9 that never requires a guess overpromises its label;
  the only thing separating it from "Easy" is 26 fewer givens.
- **9×9 Hard is wildly variable and can be guess-free** — backtracks span **0 → 3,298,051** (min 0,
  median 268). Because the 20 hard templates differ and the random symmetry transform preserves
  backtrack count, a "Hard" deal can land on a template that is as guess-free (0 backtracks) as Easy.
- **16×16 Hard is EASIER than 16×16 Medium by the proxy — an inversion.** Hard: 102-107 givens, **0
  backtracks every deal**. Medium: 110-119 givens, backtracks up to **2,701,707**. Fewer givens AND
  less search cost — the "Hard" 16×16 templates are trivially FC-solvable while "Medium" ones aren't.
  The label ordering is reversed in the corpus that ships to the browser.

Caveat (stated honestly): `measure_difficulty` is a *ForwardChecking* proxy, not the browser's
actual solve (the worker runs Ac3/GAC, cheaper). The inversion is in the codebase's own difficulty
signal — the same signal the debug band assertion (`generate.rs:156-165`) and `generate_templates.rs`
use to grade tiers. Anchors: probe row `3 medium … 0/0/0/0`; `4 hard … 0/0/0/0` vs `4 medium …
/2,701,707`; `generate.rs:280-284`.

## GEN-2 [P2] Futoshiki ships one hardcoded tier and has no difficulty plumbing at any layer — though the generator can already deal real low-density unique puzzles
`family_hint: puzzle-gen-density`

Confirms r1-gestalt F1 (19/25 given) and root-causes it:

- The blank ratio is a single `const KEEP_DENSITY: f64 = 0.75` (`generate.rs:34`).
  `holes_for_density(5, 0.75)` = `25 − round(18.75)` = 6 holes → **19 givens**, exactly the observed
  value; N=4→12, N=6→27, N=7→37 all match the table. The generator **always reaches target** (achieved
  givens == target in all 120 deals), so it is never even *trying* to be sparse.
- Inequalities default to `n` (`default_inequality_count`, `generate.rs:172`) — ~one per row, clamped
  to the 40-pair budget. On a board already 76% filled the carets are near-decorative.
- **No `Difficulty` type exists for futoshiki at any layer**: none in the solver
  (`src/puzzles/futoshiki/generate.rs`), none in the wasm surface (`generateFutoshiki(board_size, seed)`
  takes no difficulty — `wasm/src/futoshiki.rs:308-309`), and none in the UI
  (`futoshiki/ControlPanel/constants.ts` exposes `boardSizeOptions` only — no difficulty options).
- A *tuned* generator already exists — `generate_futoshiki_tuned_seeded(n, keep_density, inequality_count,
  seed)` (`generate.rs:232`) — but is reachable **only** from tests/probes, never from wasm or UI.

**A real deal is feasible today.** Feasibility sweep (N=5, 30 deals each, keep_density × inequality_count):

```
keepD  ineqs  achieved_givens  unique/30  blanks
0.75   5-40   19.0             30/30       6.0
0.50   5-40   13.0             30/30      12.0
0.40   5-40   10.0             30/30      15.0
0.30   5-40    8.0             30/30      17.0
0.20   5       5.8             30/30      19.2
0.20   10-40   5.0             30/30      20.0
```

Lowering keep to 0.30 yields an 8-given / 17-blank 5×5 that is unique 30/30 — an actual futoshiki. The
uniqueness-checked hole-dig already self-limits (at keep 0.20 it keeps ~1 extra given when a removal
would break uniqueness). So the 0.75 floor is an arbitrary product decision, not a technical limit; a
difficulty control needs only to vary `keep_density` (and raise inequality density at low keep) and wire
the already-existing tuned generator through the wasm surface. Note the sweep also shows inequality
*count* barely moves the outcome at these densities — the givens carry uniqueness — so a genuine
inequality-driven futoshiki needs givens pushed lower AND carets raised in tandem, a design/generation
task for the wave.

## GEN-3 [P2] The embedded corpus is 45 boards and covers only part of the difficulty × size matrix; the rest is generated live in the worker on every deal
`family_hint: corpus-partial-coverage`

The bank (`csp-solver/data/sudoku_puzzles/`, embedded via `include_dir!` at `generate.rs:28`, bundled to
the browser as `web/frontend/src/games/sudoku/data/templates.ts` — header "45 boards, 8020 u32 cells"):

```
N=3 (9×9):   easy 0    medium 0    hard 20
N=4 (16×16): easy 10   medium 10   hard 5
N=2 (4×4):   none
Total: 45.  templates.ts TEMPLATE_BANK = {"3":{easy:[],medium:[],hard:[20]},"4":{easy:[10],medium:[10],hard:[5]}}
```

Consequence — **which tiers are served from corpus vs generated live**:
- **Corpus (template + random symmetry transform, fast):** 9×9 Hard, and all three 16×16 tiers.
- **Live uniqueness-checked hole-digging in the wasm worker, every deal:** all 4×4, and **9×9 Easy +
  9×9 Medium** (`embedded_templates` returns empty → `generate_board_with_templates_seeded` falls to
  `generate_board_slow_with_rng`, `generate.rs:249-250`). Each hole removal runs a full `max_solutions:2`
  solve (`generate.rs:307`); for 9×9 this is the on-deal cost paid on the main product path (worth a
  latency probe in-browser for the wave — native release does 30 deals in seconds, wasm is slower).

Provenance is clean and single-sourced: templates are produced by `examples/generate_templates.rs`,
which calls the same `generate_board`/`measure_difficulty` it validates; files are sparse puzzle-only
JSON (`{"puzzle":{"<pos>":<digit>,…}}`, no solution/backtracks fields), re-parsed by
`parse_puzzle_field` (`generate.rs:77`). Note the 9×9 Hard templates carry **22-27 givens**, not the
17 the slow-path Hard target (`total/1.25`=64 holes) would produce — corpus Hard is milder than the
slow-path formula, and well above the 17-given "minimum sudoku".

## GEN-4 [P2] Every dealt board IS unique — enforced by construction — but sudoku's live-generated uniqueness has zero test coverage and the embedded-bank uniqueness gate is an orphaned example CI never runs
`family_hint: uniqueness-gate-gap`

Uniqueness holds empirically: **270/270 sudoku deals and 120/120 futoshiki deals unique** (tables above).
It is enforced *by construction* — the hole-dig reverts any removal that admits a 2nd solution
(`generate.rs:307-313` sudoku; `generate.rs:147-163` futoshiki `dig_holes`). But the *gate* coverage
is thin-to-absent:

- **Sudoku live-generated uniqueness: no test at all.** The only generation test, `test_generate_4x4`
  (`tests/sudoku.rs:176-205`), asserts **solvability only** (`max_solutions:1`) on **one** 4×4 Easy board
  — it never checks a second solution doesn't exist, and never touches 9×9 or 16×16. Nothing gates that
  the live hole-dig path (which serves 4×4-all + 9×9 Easy/Medium) yields unique boards.
- **Embedded-bank uniqueness: gated only by an example CI does not run.** `examples/verify_bank_uniqueness.rs`
  re-solves every embedded template with `max_solutions:2` and asserts uniqueness — but CI runs only the
  `gac_ab_corpus` example (`.github/workflows/ci.yml:132`); `verify_bank_uniqueness` appears in **no**
  workflow lane and **no** `tests/` file. It is an orphaned gate — a corrupt or non-unique template added
  to `data/` would pass CI. (FAM-1 orphaned-gate pattern, generation edition.)
- **Futoshiki is the one that's actually gated** — `generated_puzzles_are_unique_and_valid`
  (`tests/futoshiki.rs:198-224`) asserts exactly-one-solution, but on a **single seed per N** (4 boards
  total, `0xF000+n`), so it guards the algorithm, not distribution.

Net: uniqueness is a real property of the shipped generator, but the record's implied "gate-tested
uniqueness" is carried for sudoku by an example wired nowhere, and for the live-dig path by nothing.

---

## What this feeds a W-generation / W-design wave (not findings — design inputs)
- A difficulty that grades by *search structure* (guess depth / technique tier), not just givens count —
  or an honest relabel ("Easy/Medium/Hard = clue count"). Today 9×9 Easy≡Medium in solve difficulty and
  16×16 Hard<Medium.
- Regenerate or re-grade the 16×16 corpus so Hard ≥ Medium by the same proxy; consider filling 9×9
  Easy/Medium banks so the on-deal path isn't live hole-digging in wasm.
- Wire `generate_futoshiki_tuned_seeded` through `generateFutoshiki(board_size, difficulty, seed)` and add
  a futoshiki difficulty control; a keep-density ladder (~0.6/0.45/0.3) with rising inequality density
  yields real, unique, non-trivial deals (feasibility proven above).
- Add gates: a sudoku live-gen uniqueness sweep test (n∈{2,3,4} × diff × several seeds, `max_solutions:2`),
  and wire `verify_bank_uniqueness` into a CI lane (or port it to a `#[test]`).

---

## Coverage notes / limits
- Difficulty proxy is `measure_difficulty` (ForwardChecking) — the codebase's own metric, NOT the
  browser's Ac3/GAC solve cost. GEN-1's inversion/flatness is in that proxy; a human-technique grader
  would be the design-side answer.
- Drove the Rust generation functions directly (the exact wasm-called path), not the wasm binary in a
  browser. Cross-target parity (native==wasm for a seed) is asserted by the project's own parity harness
  (`wasm/tests/*_parity.rs`); not independently re-verified here.
- 30 deals/cell is enough to expose flatness/inversion and 0 non-unique; not a tail-risk study of the
  hole-dig's rare high-backtrack Medium boards.

## Rerunnable probes (verbatim — drop into `csp-solver/examples/`, then delete)

### `zzz_gen_truth_probe.rs` (the deal table)
```rust
use csp_solver::ordering::Ordering;
use csp_solver::puzzles::futoshiki::csp::{FutoshikiPuzzle, create_futoshiki_csp};
use csp_solver::sudoku::{Difficulty, create_sudoku_csp, embedded_template_count,
    embedded_templates, generate_board_with_templates_seeded, measure_difficulty};
use csp_solver::puzzles::futoshiki::generate_futoshiki_seeded;
use csp_solver::{Pruning, SolveConfig};
fn givens(b:&[u32])->usize{b.iter().filter(|&&v|v!=0).count()}
fn stats(mut v:Vec<f64>)->(f64,f64,f64,f64){v.sort_by(|a,b|a.partial_cmp(b).unwrap());let n=v.len();
    (v[0], v.iter().sum::<f64>()/n as f64, v[n/2], v[n-1])}
fn su(b:&[u32],n:u32)->usize{let(mut c,g)=create_sudoku_csp(b,n);
    let cf=SolveConfig{pruning:Pruning::Ac3,ordering:Ordering::Mrv,max_solutions:2,
    node_budget:Some(50_000_000),..Default::default()};c.solve_with_given(&cf,&g).len()}
fn main(){const D:u64=30;
 for n in [2u32,3,4]{let m=(n*n)as usize;let total=m*m;
  for(diff,dn)in[(Difficulty::Easy,"easy"),(Difficulty::Medium,"medium"),(Difficulty::Hard,"hard")]{
   let t=embedded_templates(n,diff);let tc=embedded_template_count(n,diff);
   let(mut gv,mut bt,mut u,mut nu)=(vec![],vec![],0,0);
   for s in 0..D{let b=generate_board_with_templates_seeded(n,diff,&t,s.wrapping_mul(2654435761).wrapping_add(1));
    gv.push(givens(&b)as f64);bt.push(measure_difficulty(&b,n)as f64);
    if su(&b,n)==1{u+=1}else{nu+=1}}
   let(g0,gm,ge,g1)=stats(gv);let(b0,bm,be,b1)=stats(bt);
   println!("N={n} {dn:<6} cells={total} tmpl={tc} givens {g0:.0}/{gm:.0}/{ge:.0}/{g1:.0} bt {b0:.0}/{bm:.0}/{be:.0}/{b1:.0} uniq {u}/{nu}");}}
 for n in [4u32,5,6,7]{let(mut gv,mut iq,mut u,mut nu)=(vec![],vec![],0,0);
  for s in 0..D{let(b,ie)=generate_futoshiki_seeded(n,s.wrapping_mul(2654435761).wrapping_add(7));
   gv.push(givens(&b)as f64);iq.push(ie.len()as f64);
   let fx:Vec<(usize,u32)>=b.iter().enumerate().filter(|&(_,&v)|v!=0).map(|(i,&v)|(i,v)).collect();
   let p=FutoshikiPuzzle{n,fixed_cells:fx,inequalities:ie.clone()};let mut c=create_futoshiki_csp(&p);
   let cf=SolveConfig{pruning:Pruning::Ac3,ordering:Ordering::Mrv,max_solutions:2,node_budget:Some(50_000_000),..Default::default()};
   if c.solve(&cf).len()==1{u+=1}else{nu+=1}}
  let(g0,gm,ge,g1)=stats(gv);let(i0,_,_,i1)=stats(iq);
  println!("FUTO N={n} givens {g0:.0}/{gm:.1}/{ge:.0}/{g1:.0} ineq {i0:.0}-{i1:.0} uniq {u}/{nu}");}}
```
Run: `cd csp-solver && cargo run --release --example zzz_gen_truth_probe` (then `rm` it).

### `zzz_futo_feasibility.rs` (the density sweep) — full source archived in this lane's history;
the loop sweeps `generate_futoshiki_tuned_seeded(5, keep∈{.75,.5,.4,.3,.2}, ineqs∈{5,10,20,40}, seed)`
over 30 seeds and re-solves each with `max_solutions:2`. Output reproduced in GEN-2.
