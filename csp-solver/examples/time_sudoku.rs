use csp_solver::constraint::VarId;
use csp_solver::domain::bitset::BitsetDomain;
use csp_solver::ordering::Ordering;
use csp_solver::*;

fn solve_puzzle(grid: &[u32; 81], name: &str, config: &SolveConfig) {
    let start = std::time::Instant::now();
    let mut csp = Csp::new();
    let domain = BitsetDomain::new(1..=9);
    for _ in 0..81 {
        csp.add_variable(domain.clone());
    }

    // Add BINARY NotEqual for each pair in same row/col/box.
    // This is what Python does — AllDifferent singleton-only revise is too weak for AC-3.
    let mut add_group = |vars: Vec<VarId>| {
        for i in 0..vars.len() {
            for j in (i + 1)..vars.len() {
                csp.add_not_equal(vars[i], vars[j]);
            }
        }
    };
    for r in 0..9u32 {
        add_group((0..9).map(|c| r * 9 + c).collect());
    }
    for c in 0..9u32 {
        add_group((0..9).map(|r| r * 9 + c).collect());
    }
    for bi in 0..3u32 {
        for bj in 0..3u32 {
            add_group(
                (0..3)
                    .flat_map(|di| (0..3).map(move |dj| (bi * 3 + di) * 9 + (bj * 3 + dj)))
                    .collect(),
            );
        }
    }

    csp.finalize();
    let given: Vec<(VarId, u32)> = grid
        .iter()
        .enumerate()
        .filter(|(_, v)| **v != 0)
        .map(|(i, v)| (i as VarId, *v))
        .collect();
    let solutions = csp.solve_with_given(config, &given);
    let elapsed = start.elapsed();
    let bt = csp.stats().backtracks;
    let prop = csp.stats().propagations;
    let found = !solutions.is_empty();
    println!(
        "{name:30} | {found:5} | {bt:>8} bt | {prop:>8} prop | {:.2} ms",
        elapsed.as_secs_f64() * 1000.0
    );
}

fn main() {
    #[rustfmt::skip]
    let al_escargot: [u32; 81] = [
        1,0,0,0,0,7,0,9,0, 0,3,0,0,2,0,0,0,8, 0,0,9,6,0,0,5,0,0,
        0,0,5,3,0,0,9,0,0, 0,1,0,0,8,0,0,0,2, 6,0,0,0,0,4,0,0,0,
        3,0,0,0,0,0,0,1,0, 0,4,0,0,0,0,0,0,7, 0,0,7,0,0,0,3,0,0,
    ];
    #[rustfmt::skip]
    let platinum: [u32; 81] = [
        0,0,0,0,0,0,0,1,2, 0,0,0,0,3,5,0,0,0, 0,0,0,6,0,0,0,7,0,
        7,0,0,0,0,0,3,0,0, 0,0,0,0,0,0,0,0,0, 0,0,1,0,0,0,0,0,8,
        0,4,0,0,0,2,0,0,0, 0,0,0,1,8,0,0,0,0, 2,5,0,0,0,0,0,0,0,
    ];
    #[rustfmt::skip]
    let inkala: [u32; 81] = [
        0,0,5,3,0,0,0,0,0, 8,0,0,0,0,0,0,2,0, 0,7,0,0,1,0,5,0,0,
        4,0,0,0,0,5,3,0,0, 0,1,0,0,7,0,0,0,6, 0,0,3,2,0,0,0,8,0,
        0,6,0,5,0,0,0,0,9, 0,0,4,0,0,0,0,3,0, 0,0,0,0,0,9,7,0,0,
    ];

    let configs = [
        ("AC3+FailFirst", SolveConfig {
            pruning: Pruning::Ac3, ordering: Ordering::FailFirst,
            max_solutions: 1, backjumping: false,
        }),
        ("AC3+DomWdeg", SolveConfig {
            pruning: Pruning::Ac3, ordering: Ordering::DomWdeg,
            max_solutions: 1, backjumping: false,
        }),
        ("FC+FailFirst", SolveConfig {
            pruning: Pruning::ForwardChecking, ordering: Ordering::FailFirst,
            max_solutions: 1, backjumping: false,
        }),
    ];

    println!(
        "{:30} | {:5} | {:>10} | {:>10} | time",
        "puzzle/config", "found", "backtracks", "propagations"
    );
    println!("{}", "-".repeat(80));
    for (cname, cfg) in &configs {
        solve_puzzle(&al_escargot, &format!("Al Escargot/{cname}"), cfg);
    }
    for (cname, cfg) in &configs {
        solve_puzzle(&platinum, &format!("Platinum/{cname}"), cfg);
    }
    for (cname, cfg) in &configs {
        solve_puzzle(&inkala, &format!("Inkala 2010/{cname}"), cfg);
    }
}
