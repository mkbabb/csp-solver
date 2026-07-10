//! GAC A/B timing probe — first-party wall-time ratios, GAC off vs on.
//!
//! Sibling to `gac_ab_corpus` (which reports false-UNSAT *counts* only). This
//! probe is the committed home of the GAC aggregate *speedup* number the
//! tranche once inherited from a deleted scratch harness (the "13.36×-class"
//! figure). It solves the shipped bank + the 5 named hard 9×9 boards under the
//! EXACT production config (`Pruning::Ac3`, `Ordering::Mrv`), with GAC-in-
//! AllDifferent both OFF and ON, and reports RATIOS (off/on) — never an
//! absolute-ms headline (wall-clock is this box's regime, not an SLA).
//!
//! Load-robustness: for each board the two states are measured INTERLEAVED
//! (on, off, on, off, …) across `BEST_OF` repetitions, and the per-state figure
//! is the MIN wall time over reps (least-contended sample). Adjacent on/off
//! pairs see near-identical instantaneous load; the min further denoises. Node
//! counts are deterministic (host-independent) and identical across reps.
//!
//! Aggregate ratio = Σ(off wall) / Σ(on wall) within a bucket / the whole
//! corpus — dominated by the heavy boards, matching the historical aggregate's
//! shape. Named-board ratios are reported individually with their direction, so
//! the disclosed minority cost (some hard 9×9 slower ON) is first-party.
//!
//! Corpus: 5 named hard 9×9 + the post-W4 template bank (N=3-hard + N=4). Run:
//!   cargo run --release --example gac_timing_probe

use std::fs;
use std::path::Path;
use std::sync::atomic::Ordering as AtomicOrdering;
use std::time::Instant;

use csp_solver::ordering::Ordering as RustOrdering;
use csp_solver::solver::gac::GAC_IN_ALLDIFF_ENABLED;
use csp_solver::sudoku;
use csp_solver::{Pruning as RustPruning, SolveConfig as RustSolveConfig};

/// Repetitions per state, per board. The reported wall time is the min over
/// these (best-of); node counts are deterministic so any rep suffices.
const BEST_OF: usize = 5;

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

/// Bucket key: named hard 9×9 collapse to one bucket; templates key on
/// `N{n}/{difficulty}` (the individual stem is dropped).
fn bucket_of(name: &str) -> String {
    if name.starts_with("hard-9x9::") {
        return "hard-9x9 (named)".to_string();
    }
    let rest = name.strip_prefix("template::").unwrap_or(name);
    match rest.rfind('/') {
        Some(i) => rest[..i].to_string(),
        None => rest.to_string(),
    }
}

struct Timing {
    wall_ns: u128,
    nodes: u64,
    solved: bool,
}

/// One solve under the given GAC state, timing the SOLVE only (CSP
/// construction is identical across states and would only dilute the ratio).
fn solve_timed(board: &Board, gac_on: bool) -> Timing {
    GAC_IN_ALLDIFF_ENABLED.store(gac_on, AtomicOrdering::Relaxed);
    // EXACT production config from py/sudoku_api.rs::solve_sudoku.
    let config = RustSolveConfig {
        pruning: RustPruning::Ac3,
        ordering: RustOrdering::Mrv,
        ..Default::default()
    };
    let (mut csp, given) = sudoku::create_sudoku_csp(&board.flat, board.n);
    let t0 = Instant::now();
    let solutions = csp.solve_with_given(&config, &given);
    let wall_ns = t0.elapsed().as_nanos();
    let stats = csp.stats();
    Timing {
        wall_ns,
        nodes: stats.nodes_explored,
        solved: !solutions.is_empty(),
    }
}

/// Interleaved best-of-`BEST_OF`: alternate on/off within each rep, keep the
/// min wall time per state. Returns `(off, on)` best timings.
fn measure(board: &Board) -> (Timing, Timing) {
    let mut best_off: Option<Timing> = None;
    let mut best_on: Option<Timing> = None;
    for _ in 0..BEST_OF {
        let on = solve_timed(board, true);
        let off = solve_timed(board, false);
        best_on = Some(match best_on {
            Some(b) if b.wall_ns <= on.wall_ns => b,
            _ => on,
        });
        best_off = Some(match best_off {
            Some(b) if b.wall_ns <= off.wall_ns => b,
            _ => off,
        });
    }
    (best_off.unwrap(), best_on.unwrap())
}

fn ratio(off_ns: u128, on_ns: u128) -> f64 {
    if on_ns == 0 {
        f64::NAN
    } else {
        off_ns as f64 / on_ns as f64
    }
}

fn main() {
    let manifest_dir = Path::new(env!("CARGO_MANIFEST_DIR"));
    let data_dir = manifest_dir.join("data");

    let mut corpus = hard_corpus();
    corpus.extend(template_corpus(&data_dir));

    println!(
        "# GAC A/B timing probe — {} boards (production config: Ac3 + Mrv), \
         best-of-{} interleaved (on,off,…), ratios only",
        corpus.len(),
        BEST_OF
    );
    println!("# ratio = off/on wall time; >1 means GAC ON is faster.\n");

    // Warm-up: touch both states once (JIT-free, but settles allocator/caches).
    if let Some(b) = corpus.first() {
        let _ = solve_timed(b, true);
        let _ = solve_timed(b, false);
    }

    // Ordered bucket accumulators: (Σoff_ns, Σon_ns, Σoff_nodes, Σon_nodes, count).
    let mut buckets: Vec<(String, u128, u128, u64, u64, usize)> = Vec::new();
    let mut tot_off_ns: u128 = 0;
    let mut tot_on_ns: u128 = 0;
    let mut tot_off_nodes: u64 = 0;
    let mut tot_on_nodes: u64 = 0;
    // Named-board rows, in corpus order.
    let mut named: Vec<(String, f64, u64, u64)> = Vec::new();

    for board in &corpus {
        let (off, on) = measure(board);
        assert!(
            off.solved && on.solved,
            "{} unsolved under production config (off={}, on={})",
            board.name,
            off.solved,
            on.solved
        );
        tot_off_ns += off.wall_ns;
        tot_on_ns += on.wall_ns;
        tot_off_nodes += off.nodes;
        tot_on_nodes += on.nodes;

        let key = bucket_of(&board.name);
        match buckets.iter_mut().find(|b| b.0 == key) {
            Some(b) => {
                b.1 += off.wall_ns;
                b.2 += on.wall_ns;
                b.3 += off.nodes;
                b.4 += on.nodes;
                b.5 += 1;
            }
            None => buckets.push((key, off.wall_ns, on.wall_ns, off.nodes, on.nodes, 1)),
        }

        if board.name.starts_with("hard-9x9::") {
            let short = board.name.strip_prefix("hard-9x9::").unwrap().to_string();
            named.push((short, ratio(off.wall_ns, on.wall_ns), off.nodes, on.nodes));
        }
    }

    println!("## Per-bucket aggregate (Σoff / Σon)");
    println!("| bucket | boards | wall ratio (off/on) | nodes off→on |");
    println!("|---|---|---|---|");
    for (key, off_ns, on_ns, off_nd, on_nd, cnt) in &buckets {
        println!(
            "| {key} | {cnt} | {:.2}× | {off_nd} → {on_nd} |",
            ratio(*off_ns, *on_ns)
        );
    }

    println!("\n## Corpus aggregate");
    println!(
        "wall ratio (Σoff/Σon): {:.2}×   |   nodes off→on: {tot_off_nodes} → {tot_on_nodes} ({:.2}× fewer)",
        ratio(tot_off_ns, tot_on_ns),
        if tot_on_nodes == 0 {
            f64::NAN
        } else {
            tot_off_nodes as f64 / tot_on_nodes as f64
        }
    );

    println!("\n## Named hard 9×9 (individual ratios, minority-cost direction)");
    println!("| board | wall ratio (off/on) | direction | nodes off→on |");
    println!("|---|---|---|---|");
    for (name, r, off_nd, on_nd) in &named {
        let dir = if *r >= 1.0 {
            format!("ON faster ({r:.2}×)")
        } else {
            format!("ON SLOWER ({:.2}× slower)", 1.0 / r)
        };
        println!("| {name} | {r:.2}× | {dir} | {off_nd} → {on_nd} |");
    }
}
