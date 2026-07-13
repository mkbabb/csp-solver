//! GAC A/B false-UNSAT corpus probe — Pass-4 kernel-soundness-closure.
//!
//! Ported from wf_34cf008e-c2c-5's gac_ab_corpus (gac-default-on critique) onto
//! the composed tree, stripped to the load-bearing check for kernel closure:
//! does the composed tree return a false "no solution" (solved=false with
//! budget_exceeded=false) on any known-solvable board in the corpus (50
//! boards post-W4 bank shrink), under the EXACT production config (Pruning::Ac3,
//! Ordering::Mrv) — with GAC in AllDifferent both OFF and ON? Pre-fix (against
//! the then-113-board tranche-1 corpus): 23/113 off + 2/113 on = 25. Post-fix:
//! 0/50 either way.
//!
//! T3-W6 (ROW-3d) promoted this to a CI smoke lane and added the **node-count
//! spine assert**: the deterministic search-node totals over the 50-board corpus
//! (GAC off→on: 4,153,388 → 8,222) are the invariant oracle — GAC's pruning
//! strength is fixed, so if either total moves, either a GAC edit changed search
//! semantics or the embedded corpus itself was re-cut (a deliberate re-mint, as at
//! T4-W6). The process exits non-zero on ANY false-UNSAT OR a moved spine.
//!
//! Corpus: 5 named hard 9x9 + the N=3-hard + N=4 template banks (50 post-W4). The
//! `--n5` flag is a no-op — `n5_board` reads `sudoku_solutions/5/`, a
//! directory that is already absent from `data/`.
//! Run: cargo run --release --example gac_ab_corpus -- --n5

use std::fs;
use std::path::Path;
use std::sync::atomic::Ordering as AtomicOrdering;

use csp_solver::ordering::Ordering as RustOrdering;
use csp_solver::solver::gac::GAC_IN_ALLDIFF_ENABLED;
use csp_solver::sudoku;
use csp_solver::{Pruning as RustPruning, SolveConfig as RustSolveConfig};

fn parse_int_map(json: &str, key: Option<&str>) -> Vec<(usize, i64)> {
    let body: &str = match key {
        Some(k) => {
            let needle = format!("\"{k}\"");
            let kpos = json
                .find(&needle)
                .unwrap_or_else(|| panic!("key {k:?} not found"));
            let brace = json[kpos..].find('{').unwrap() + kpos + 1;
            let end = json[brace..].find('}').unwrap() + brace;
            &json[brace..end]
        }
        None => {
            let start = json.find('{').unwrap() + 1;
            let end = json.rfind('}').unwrap();
            &json[start..end]
        }
    };
    let mut out = Vec::new();
    let bytes = body.as_bytes();
    let mut i = 0;
    while i < bytes.len() {
        if bytes[i] == b'"' {
            let kstart = i + 1;
            let kend = body[kstart..].find('"').unwrap() + kstart;
            let pos: usize = body[kstart..kend].parse().unwrap();
            let cstart = body[kend..].find(':').unwrap() + kend + 1;
            let vend = body[cstart..]
                .find(',')
                .map(|p| p + cstart)
                .unwrap_or(body.len());
            let val: i64 = body[cstart..vend].trim().parse().unwrap();
            out.push((pos, val));
            i = vend + 1;
        } else {
            i += 1;
        }
    }
    out
}

struct Board {
    name: String,
    n: u32,
    flat: Vec<u32>,
}

fn board_from_given(name: String, n: u32, given: &[(usize, i64)]) -> Board {
    let m = (n * n) as usize;
    let mut flat = vec![0u32; m * m];
    for &(pos, val) in given {
        if val != 0 {
            flat[pos] = val as u32;
        }
    }
    Board { name, n, flat }
}

fn hard_corpus() -> Vec<Board> {
    let puzzles: [(&str, &str); 5] = [
        (
            "Al Escargot",
            "100007090030020008009600500005300900010080002600004000300000010040000007007000300",
        ),
        (
            "Platinum Blonde",
            "000000012000000003002300400001800005060070800000009000008500000900040500470006000",
        ),
        (
            "Golden Nugget",
            "000000039000001005003050800008090006070002000100400000009080050020000600400700000",
        ),
        (
            "Inkala 2010",
            "005300000800000020070010500400005300010070006003200080060500009004000030000009700",
        ),
        (
            "17-clue minimal",
            "000000010400000000020000000000050407008000300001090000300400200050100000000806000",
        ),
    ];
    puzzles
        .iter()
        .map(|(name, s)| {
            let flat: Vec<u32> = s.chars().map(|c| c.to_digit(10).unwrap()).collect();
            Board {
                name: format!("hard-9x9::{name}"),
                n: 3,
                flat,
            }
        })
        .collect()
}

fn template_corpus(data_dir: &Path) -> Vec<Board> {
    let mut boards = Vec::new();
    for n in [2u32, 3, 4] {
        for difficulty in ["easy", "medium", "hard"] {
            let dir = data_dir
                .join("sudoku_puzzles")
                .join(n.to_string())
                .join(difficulty);
            let Ok(entries) = fs::read_dir(&dir) else {
                continue;
            };
            let mut paths: Vec<_> = entries.filter_map(|e| e.ok()).map(|e| e.path()).collect();
            paths.sort();
            for path in paths {
                if path.extension().and_then(|e| e.to_str()) != Some("json") {
                    continue;
                }
                let content = fs::read_to_string(&path).unwrap();
                let given = parse_int_map(&content, Some("puzzle"));
                let stem = path.file_stem().unwrap().to_string_lossy().to_string();
                boards.push(board_from_given(
                    format!("template::N{n}/{difficulty}/{stem}"),
                    n,
                    &given,
                ));
            }
        }
    }
    boards
}

fn n5_board(data_dir: &Path) -> Option<Board> {
    let path = data_dir
        .join("sudoku_solutions")
        .join("5")
        .join("board-0.json");
    let content = fs::read_to_string(&path).ok()?;
    let solution = parse_int_map(&content, None);
    let given: Vec<(usize, i64)> = solution
        .into_iter()
        .filter(|(pos, _)| pos % 9 != 0)
        .collect();
    Some(board_from_given(
        "n5-easy::board-0(stride-dig)".to_string(),
        5,
        &given,
    ))
}

struct RunResult {
    solved: bool,
    budget_exceeded: bool,
    nodes: u64,
}

fn run_once(board: &Board, gac_on: bool) -> RunResult {
    GAC_IN_ALLDIFF_ENABLED.store(gac_on, AtomicOrdering::Relaxed);
    // EXACT production config from py/sudoku_api.rs::solve_sudoku.
    let config = RustSolveConfig {
        pruning: RustPruning::Ac3,
        ordering: RustOrdering::Mrv,
        ..Default::default()
    };
    let (mut csp, given) = sudoku::create_sudoku_csp(&board.flat, board.n);
    let solutions = csp.solve_with_given(&config, &given);
    let stats = csp.stats().clone();
    RunResult {
        solved: !solutions.is_empty(),
        budget_exceeded: stats.budget_exceeded,
        nodes: stats.nodes_explored,
    }
}

// The deterministic node-count spine over the 50-board default corpus (no --n5):
// the invariant oracle T3-W6 asserts. Search-node counts are a pure function of
// the algorithm on fixed data — identical across runs, machines, and load
// (docs/benchmarks.md:21; the T3 spine 40,513→4,678 reproduced exactly under
// load-avg ~3.8 where the WALL ratio swung 10.5–13.8×). GAC's pruning strength on
// fixed data is invariant, so if either total moves, a RED — either a GAC edit
// changed semantics, or the corpus was deliberately re-cut and the spine re-mints
// with attribution. RE-MINTED at T4-W6: the stale 16×16 Hard bank (0 backtracks
// every board) was regenerated to genuinely search-hard boards (GEN-1, disposition
// (a)) — the fixture moved, not GAC; new totals reproduced identically on CI
// (run 29238452743) and darwin. The old corpus's 8.66× ratio citation retires;
// on the honest bank GAC's prune is ~505× by nodes (W14 recasts the headline).
const SPINE_OFF_NODES: u64 = 4_153_388;
const SPINE_ON_NODES: u64 = 8_222;

fn main() {
    let args: Vec<String> = std::env::args().collect();
    let do_n5 = args.iter().any(|a| a == "--n5");
    let manifest_dir = Path::new(env!("CARGO_MANIFEST_DIR"));
    // Puzzle data is now crate-owned at `csp-solver/data/` (moved out of the
    // Python package). Note: the `sudoku_solutions/` bank was excised, so the
    // `--n5` path (`n5_board`) now degrades to its existing "not found, skipping"
    // branch unless a board is regenerated there.
    let data_dir = manifest_dir.join("data");

    let mut corpus = hard_corpus();
    corpus.extend(template_corpus(&data_dir));
    if do_n5 {
        if let Some(b) = n5_board(&data_dir) {
            corpus.push(b);
        } else {
            eprintln!("N=5 board-0.json not found under {data_dir:?}, skipping");
        }
    }

    println!(
        "# GAC A/B false-UNSAT corpus — {} boards (production config: Ac3 + Mrv)",
        corpus.len()
    );
    let mut off_unsat = Vec::new();
    let mut on_unsat = Vec::new();
    let mut off_nodes: u64 = 0;
    let mut on_nodes: u64 = 0;
    for board in &corpus {
        let off = run_once(board, false);
        let on = run_once(board, true);
        off_nodes += off.nodes;
        on_nodes += on.nodes;
        // A "false UNSAT" = returned zero solutions WITHOUT hitting the node
        // budget, on a board with a known recorded solution.
        if !off.solved && !off.budget_exceeded {
            off_unsat.push(board.name.clone());
        }
        if !on.solved && !on.budget_exceeded {
            on_unsat.push(board.name.clone());
        }
    }
    println!(
        "false-UNSAT (GAC off): {}/{}",
        off_unsat.len(),
        corpus.len()
    );
    for n in &off_unsat {
        println!("   OFF-UNSAT {n}");
    }
    println!("false-UNSAT (GAC on):  {}/{}", on_unsat.len(), corpus.len());
    for n in &on_unsat {
        println!("   ON-UNSAT {n}");
    }
    let total = off_unsat.len() + on_unsat.len();
    println!("TOTAL false-UNSAT across both GAC states: {total}");

    // Node-count spine — the invariant oracle (asserted only on the default
    // 50-board corpus; --n5 would append a board and shift the totals, but its
    // data bank is absent so the default run is what CI exercises).
    let spine_ok = if do_n5 {
        println!(
            "node-count spine: SKIPPED (--n5 changes the corpus) — off={off_nodes} on={on_nodes}"
        );
        true
    } else {
        let ok = off_nodes == SPINE_OFF_NODES && on_nodes == SPINE_ON_NODES;
        println!(
            "node-count spine (GAC off→on): {off_nodes} → {on_nodes} \
             (expected {SPINE_OFF_NODES} → {SPINE_ON_NODES}) — {}",
            if ok { "HOLD" } else { "MOVED" }
        );
        if !ok {
            eprintln!(
                "::error:: node-count spine MOVED: off {off_nodes} (want {SPINE_OFF_NODES}), \
                 on {on_nodes} (want {SPINE_ON_NODES}) — a GAC edit changed search semantics"
            );
        }
        ok
    };

    let pass = total == 0 && spine_ok;
    println!(
        "VERDICT: {}",
        if pass {
            format!("0/{} false-UNSAT + spine HOLD — PASS", corpus.len())
        } else if total != 0 {
            "REGRESSION PRESENT (false-UNSAT)".to_string()
        } else {
            "REGRESSION PRESENT (node-count spine moved)".to_string()
        }
    );
    std::process::exit(if pass { 0 } else { 1 });
}
