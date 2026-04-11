/* tslint:disable */
/* eslint-disable */

/**
 * JavaScript-facing CSP solver.
 *
 * Holds an internal `csp_solver::Csp<BitsetDomain>` and exposes the
 * same surface as `py.rs::Csp`. The bitset specialization matches the
 * Python binding's choice — `BitsetDomain` covers every value in
 * `0..u32::MAX`, which is the natural domain for the integer-CSP
 * puzzles the solver was originally written for.
 */
export class Csp {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Add an all-different constraint over a group of variables.
     */
    addAllDifferent(vars: Uint32Array): void;
    /**
     * Fix a variable to a specific value.
     */
    addEquals(_var: number, value: number): void;
    /**
     * Constrain `x > y`.
     */
    addGreaterThan(x: number, y: number): void;
    /**
     * Constrain `x < y`.
     */
    addLessThan(x: number, y: number): void;
    /**
     * Add a not-equal constraint between two variables.
     */
    addNotEqual(x: number, y: number): void;
    /**
     * Add a variable with the given domain values. Returns its `VarId`.
     *
     * JS callers pass a `Uint32Array`; wasm-bindgen converts it to
     * `Vec<u32>` for free.
     */
    addVariable(domain: Uint32Array): number;
    /**
     * Build the adjacency graph. Required before `solve()`, optional
     * before `propagate()`.
     */
    finalize(): void;
    /**
     * Construct an empty CSP.
     */
    constructor();
    /**
     * Propagate constraints to a fixed point (auto-selects AC-3 if
     * `finalize()` was called, sweep otherwise).
     *
     * Returns `true` on success; throws on `Unsatisfiable`.
     */
    propagate(): boolean;
    /**
     * Propagate constraints with an explicit strategy.
     */
    propagateWith(strategy: PropagationStrategy): boolean;
    /**
     * Solve with the given configuration.
     *
     * Returns an array of solution objects; each solution is a
     * `Record<VarId, Value>` keyed by variable index. Returned via
     * serde-wasm-bindgen as a plain JS value.
     */
    solve(config: SolveConfig): any;
    /**
     * Solve with pre-assigned ("given") values.
     *
     * `given` is a JS object keyed by `VarId`-as-string with `u32`
     * values, deserialized via serde-wasm-bindgen.
     */
    solveWithGiven(config: SolveConfig, given: any): any;
    /**
     * Solver statistics from the last run.
     */
    readonly stats: SolveStats;
}

/**
 * Optimization mode for the solver.
 *
 * Mirrors `csp_solver::OptimizationMode`. Note that `py.rs` does
 * not currently expose this enum (the Python binding is feasibility-
 * only); the WASM binding goes one step further so JS consumers can
 * drive `solve_optimized` paths in commit C5.
 */
export enum OptimizationMode {
    /**
     * Find any feasible solution.
     */
    FEASIBILITY = 0,
    /**
     * Find the solution minimizing total cost.
     */
    MINIMIZE_COST = 1,
    /**
     * Find the solution maximizing total cost.
     */
    MAXIMIZE_COST = 2,
}

/**
 * Variable ordering heuristic.
 *
 * Mirrors `csp_solver::ordering::Ordering`.
 */
export enum Ordering {
    /**
     * Pick variables in declaration order.
     */
    CHRONOLOGICAL = 0,
    /**
     * Pick the variable with the smallest current domain.
     */
    FAIL_FIRST = 1,
    /**
     * Pick the variable with the largest weighted constraint degree.
     */
    DOM_WDEG = 2,
}

/**
 * Propagation strategy for `Csp::propagate_with`.
 *
 * Mirrors `csp_solver::PropagationStrategy`.
 */
export enum PropagationStrategy {
    /**
     * Auto-select: AC-3 if `finalize()` was called, sweep otherwise.
     */
    AUTO = 0,
    /**
     * AC-3 worklist with adjacency graph. Requires `finalize()`.
     */
    AC3 = 1,
    /**
     * Fixed-point sweep over all constraints. No adjacency needed.
     */
    SWEEP = 2,
}

/**
 * Pruning strategy for backtracking search.
 *
 * Mirrors `csp_solver::Pruning`. Variants are explicit C-style
 * discriminants so the value is stable across the wasm-bindgen ABI.
 * `non_camel_case_types` is allowed because the variant casing is
 * chosen to match `py.rs` exactly — Python convention is
 * `SCREAMING_SNAKE_CASE` for enum members, and the binding is
 * deliberately isomorphic.
 */
export enum Pruning {
    /**
     * No pruning — pure backtracking.
     */
    NONE = 0,
    /**
     * Forward checking: prune neighbors of the assigned variable.
     */
    FORWARD_CHECKING = 1,
    /**
     * MAC: Maintaining Arc Consistency (AC-3 after each assignment).
     */
    AC3 = 2,
    /**
     * Hybrid: forward checking + singleton propagation.
     */
    AC_FC = 3,
}

/**
 * Solver configuration.
 *
 * Mirrors `csp_solver::SolveConfig`. Field access is via `getter` /
 * `setter` method pairs because wasm-bindgen does not surface struct
 * fields directly across the ABI.
 */
export class SolveConfig {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Construct a `SolveConfig` with explicit field values.
     *
     * Defaults match `csp_solver::SolveConfig::default()`:
     * `FORWARD_CHECKING` pruning, `CHRONOLOGICAL` ordering, one
     * solution, no backjumping, feasibility mode, and a 1_000_000-
     * node budget.
     */
    constructor(pruning?: Pruning | null, ordering?: Ordering | null, max_solutions?: number | null, backjumping?: boolean | null, optimization_mode?: OptimizationMode | null, node_budget?: bigint | null);
    /**
     * Enable conflict-directed backjumping.
     */
    backjumping: boolean;
    /**
     * Maximum number of solutions to enumerate.
     */
    maxSolutions: number;
    /**
     * Maximum number of search nodes before aborting early.
     * `undefined` disables the budget. Defaults to `1_000_000`.
     */
    get nodeBudget(): bigint | undefined;
    set nodeBudget(value: bigint | null | undefined);
    /**
     * Optimization mode (feasibility / minimize / maximize).
     */
    optimizationMode: OptimizationMode;
    /**
     * Variable-ordering heuristic.
     */
    ordering: Ordering;
    /**
     * Pruning strategy used during search.
     */
    pruning: Pruning;
}

/**
 * Solver statistics from the most recent `solve()` call.
 *
 * Mirrors `csp_solver::SolveStats`. All fields are read-only —
 * the wasm-bindgen ABI exposes them as JavaScript getters.
 */
export class SolveStats {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Number of backtracking events.
     */
    readonly backtracks: bigint;
    /**
     * `true` when the last search hit `SolveConfig.nodeBudget` and
     * returned best-so-far rather than optimal results.
     */
    readonly budgetExceeded: boolean;
    /**
     * Number of search nodes visited.
     */
    readonly nodesExplored: bigint;
    /**
     * Number of constraint-propagation steps.
     */
    readonly propagations: bigint;
}

/**
 * Sudoku puzzle difficulty.
 *
 * Mirrors `py.rs::SudokuDifficulty`.
 */
export enum SudokuDifficulty {
    EASY = 0,
    MEDIUM = 1,
    HARD = 2,
}

/**
 * Re-export the unmatched-row sentinel so JS-side callers can
 * reference the constant by name instead of hard-coding `-1`.
 *
 * Mirrors [`csp_solver::SENTINEL`]. Exposed as a wasm-bindgen
 * function (rather than a `#[wasm_bindgen]` constant, which the
 * macro does not support for primitive integers) so the generated
 * `.d.ts` carries the documentation alongside the value.
 */
export function assignmentSentinel(): number;

/**
 * Generate a random Sudoku board for the given difficulty.
 *
 * Mirrors `py.rs::create_random_board`. The optional `templates`
 * argument is a `JsValue` array of position-keyed value maps; when
 * provided, the generator picks a template at random and digs holes
 * from it.
 */
export function createRandomBoard(n: number, difficulty: SudokuDifficulty | null | undefined, templates: any): any;

/**
 * Construct a Sudoku CSP wire object from a position-keyed value map.
 *
 * Mirrors `py.rs::create_sudoku_csp`. Positions are stringified
 * row-major indices into the `n^2 × n^2` grid.
 */
export function createSudokuCsp(n: number, values: any, max_solutions?: number | null): any;

/**
 * Initialize the WASM module.
 *
 * Installs `console_error_panic_hook` so a Rust panic surfaces as a
 * readable JavaScript stack trace in the browser console instead of
 * the opaque `RuntimeError: unreachable executed`. Marked
 * `#[wasm_bindgen(start)]` so it runs automatically the first time
 * the module is instantiated.
 */
export function init(): void;

/**
 * Solve a bipartite assignment COP from a JS request object.
 *
 * Validates the request, delegates to
 * [`csp_solver::assignment`], and serializes the resulting
 * [`AssignmentSolution`](csp_solver::AssignmentSolution) back as a
 * JS value. All error paths surface as a `JsError` (a JavaScript
 * `Error` instance on the consuming side).
 *
 * See [`AssignmentRequest`] / [`AssignmentResponse`] for the wire
 * shapes; the TypeScript bindings are auto-generated by
 * wasm-bindgen from those structs.
 */
export function solveAssignmentCop(req: any): any;

/**
 * Solve a Sudoku CSP previously built by `createSudokuCsp`.
 *
 * Mirrors `py.rs::solve_sudoku`. Returns the updated wire object
 * (with `solutions` and `backtrackCount` populated). Note that
 * because wasm-bindgen passes structs by value rather than by `&mut`
 * reference across the ABI, this returns a fresh wire object instead
 * of mutating in place.
 */
export function solveSudoku(csp: any): any;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_csp_free: (a: number, b: number) => void;
    readonly __wbg_solveconfig_free: (a: number, b: number) => void;
    readonly __wbg_solvestats_free: (a: number, b: number) => void;
    readonly createRandomBoard: (a: number, b: number, c: any) => [number, number, number];
    readonly createSudokuCsp: (a: number, b: any, c: number) => [number, number, number];
    readonly csp_addAllDifferent: (a: number, b: number, c: number) => void;
    readonly csp_addEquals: (a: number, b: number, c: number) => void;
    readonly csp_addGreaterThan: (a: number, b: number, c: number) => void;
    readonly csp_addLessThan: (a: number, b: number, c: number) => void;
    readonly csp_addNotEqual: (a: number, b: number, c: number) => void;
    readonly csp_addVariable: (a: number, b: number, c: number) => number;
    readonly csp_finalize: (a: number) => void;
    readonly csp_new: () => number;
    readonly csp_propagate: (a: number) => [number, number, number];
    readonly csp_propagateWith: (a: number, b: number) => [number, number, number];
    readonly csp_solve: (a: number, b: number) => [number, number, number];
    readonly csp_solveWithGiven: (a: number, b: number, c: any) => [number, number, number];
    readonly csp_stats: (a: number) => number;
    readonly solveSudoku: (a: any) => [number, number, number];
    readonly solveconfig_backjumping: (a: number) => number;
    readonly solveconfig_maxSolutions: (a: number) => number;
    readonly solveconfig_new: (a: number, b: number, c: number, d: number, e: number, f: number, g: bigint) => number;
    readonly solveconfig_nodeBudget: (a: number) => [number, bigint];
    readonly solveconfig_optimizationMode: (a: number) => number;
    readonly solveconfig_ordering: (a: number) => number;
    readonly solveconfig_pruning: (a: number) => number;
    readonly solveconfig_set_backjumping: (a: number, b: number) => void;
    readonly solveconfig_set_maxSolutions: (a: number, b: number) => void;
    readonly solveconfig_set_nodeBudget: (a: number, b: number, c: bigint) => void;
    readonly solveconfig_set_optimizationMode: (a: number, b: number) => void;
    readonly solveconfig_set_ordering: (a: number, b: number) => void;
    readonly solveconfig_set_pruning: (a: number, b: number) => void;
    readonly solvestats_backtracks: (a: number) => bigint;
    readonly solvestats_budgetExceeded: (a: number) => number;
    readonly solvestats_nodesExplored: (a: number) => bigint;
    readonly solvestats_propagations: (a: number) => bigint;
    readonly assignmentSentinel: () => number;
    readonly solveAssignmentCop: (a: any) => [number, number, number];
    readonly init: () => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
