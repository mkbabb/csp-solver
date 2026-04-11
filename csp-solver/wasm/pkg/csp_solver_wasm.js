/* @ts-self-types="./csp_solver_wasm.d.ts" */

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
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CspFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_csp_free(ptr, 0);
    }
    /**
     * Add an all-different constraint over a group of variables.
     * @param {Uint32Array} vars
     */
    addAllDifferent(vars) {
        const ptr0 = passArray32ToWasm0(vars, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.csp_addAllDifferent(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * Fix a variable to a specific value.
     * @param {number} _var
     * @param {number} value
     */
    addEquals(_var, value) {
        wasm.csp_addEquals(this.__wbg_ptr, _var, value);
    }
    /**
     * Constrain `x > y`.
     * @param {number} x
     * @param {number} y
     */
    addGreaterThan(x, y) {
        wasm.csp_addGreaterThan(this.__wbg_ptr, x, y);
    }
    /**
     * Constrain `x < y`.
     * @param {number} x
     * @param {number} y
     */
    addLessThan(x, y) {
        wasm.csp_addLessThan(this.__wbg_ptr, x, y);
    }
    /**
     * Add a not-equal constraint between two variables.
     * @param {number} x
     * @param {number} y
     */
    addNotEqual(x, y) {
        wasm.csp_addNotEqual(this.__wbg_ptr, x, y);
    }
    /**
     * Add a variable with the given domain values. Returns its `VarId`.
     *
     * JS callers pass a `Uint32Array`; wasm-bindgen converts it to
     * `Vec<u32>` for free.
     * @param {Uint32Array} domain
     * @returns {number}
     */
    addVariable(domain) {
        const ptr0 = passArray32ToWasm0(domain, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.csp_addVariable(this.__wbg_ptr, ptr0, len0);
        return ret >>> 0;
    }
    /**
     * Build the adjacency graph. Required before `solve()`, optional
     * before `propagate()`.
     */
    finalize() {
        wasm.csp_finalize(this.__wbg_ptr);
    }
    /**
     * Construct an empty CSP.
     */
    constructor() {
        const ret = wasm.csp_new();
        this.__wbg_ptr = ret >>> 0;
        CspFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Propagate constraints to a fixed point (auto-selects AC-3 if
     * `finalize()` was called, sweep otherwise).
     *
     * Returns `true` on success; throws on `Unsatisfiable`.
     * @returns {boolean}
     */
    propagate() {
        const ret = wasm.csp_propagate(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] !== 0;
    }
    /**
     * Propagate constraints with an explicit strategy.
     * @param {PropagationStrategy} strategy
     * @returns {boolean}
     */
    propagateWith(strategy) {
        const ret = wasm.csp_propagateWith(this.__wbg_ptr, strategy);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] !== 0;
    }
    /**
     * Solve with the given configuration.
     *
     * Returns an array of solution objects; each solution is a
     * `Record<VarId, Value>` keyed by variable index. Returned via
     * serde-wasm-bindgen as a plain JS value.
     * @param {SolveConfig} config
     * @returns {any}
     */
    solve(config) {
        _assertClass(config, SolveConfig);
        const ret = wasm.csp_solve(this.__wbg_ptr, config.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Solve with pre-assigned ("given") values.
     *
     * `given` is a JS object keyed by `VarId`-as-string with `u32`
     * values, deserialized via serde-wasm-bindgen.
     * @param {SolveConfig} config
     * @param {any} given
     * @returns {any}
     */
    solveWithGiven(config, given) {
        _assertClass(config, SolveConfig);
        const ret = wasm.csp_solveWithGiven(this.__wbg_ptr, config.__wbg_ptr, given);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Solver statistics from the last run.
     * @returns {SolveStats}
     */
    get stats() {
        const ret = wasm.csp_stats(this.__wbg_ptr);
        return SolveStats.__wrap(ret);
    }
}
if (Symbol.dispose) Csp.prototype[Symbol.dispose] = Csp.prototype.free;

/**
 * Optimization mode for the solver.
 *
 * Mirrors `csp_solver::OptimizationMode`. Note that `py.rs` does
 * not currently expose this enum (the Python binding is feasibility-
 * only); the WASM binding goes one step further so JS consumers can
 * drive `solve_optimized` paths in commit C5.
 * @enum {0 | 1 | 2}
 */
export const OptimizationMode = Object.freeze({
    /**
     * Find any feasible solution.
     */
    FEASIBILITY: 0, "0": "FEASIBILITY",
    /**
     * Find the solution minimizing total cost.
     */
    MINIMIZE_COST: 1, "1": "MINIMIZE_COST",
    /**
     * Find the solution maximizing total cost.
     */
    MAXIMIZE_COST: 2, "2": "MAXIMIZE_COST",
});

/**
 * Variable ordering heuristic.
 *
 * Mirrors `csp_solver::ordering::Ordering`.
 * @enum {0 | 1 | 2}
 */
export const Ordering = Object.freeze({
    /**
     * Pick variables in declaration order.
     */
    CHRONOLOGICAL: 0, "0": "CHRONOLOGICAL",
    /**
     * Pick the variable with the smallest current domain.
     */
    FAIL_FIRST: 1, "1": "FAIL_FIRST",
    /**
     * Pick the variable with the largest weighted constraint degree.
     */
    DOM_WDEG: 2, "2": "DOM_WDEG",
});

/**
 * Propagation strategy for `Csp::propagate_with`.
 *
 * Mirrors `csp_solver::PropagationStrategy`.
 * @enum {0 | 1 | 2}
 */
export const PropagationStrategy = Object.freeze({
    /**
     * Auto-select: AC-3 if `finalize()` was called, sweep otherwise.
     */
    AUTO: 0, "0": "AUTO",
    /**
     * AC-3 worklist with adjacency graph. Requires `finalize()`.
     */
    AC3: 1, "1": "AC3",
    /**
     * Fixed-point sweep over all constraints. No adjacency needed.
     */
    SWEEP: 2, "2": "SWEEP",
});

/**
 * Pruning strategy for backtracking search.
 *
 * Mirrors `csp_solver::Pruning`. Variants are explicit C-style
 * discriminants so the value is stable across the wasm-bindgen ABI.
 * `non_camel_case_types` is allowed because the variant casing is
 * chosen to match `py.rs` exactly — Python convention is
 * `SCREAMING_SNAKE_CASE` for enum members, and the binding is
 * deliberately isomorphic.
 * @enum {0 | 1 | 2 | 3}
 */
export const Pruning = Object.freeze({
    /**
     * No pruning — pure backtracking.
     */
    NONE: 0, "0": "NONE",
    /**
     * Forward checking: prune neighbors of the assigned variable.
     */
    FORWARD_CHECKING: 1, "1": "FORWARD_CHECKING",
    /**
     * MAC: Maintaining Arc Consistency (AC-3 after each assignment).
     */
    AC3: 2, "2": "AC3",
    /**
     * Hybrid: forward checking + singleton propagation.
     */
    AC_FC: 3, "3": "AC_FC",
});

/**
 * Solver configuration.
 *
 * Mirrors `csp_solver::SolveConfig`. Field access is via `getter` /
 * `setter` method pairs because wasm-bindgen does not surface struct
 * fields directly across the ABI.
 */
export class SolveConfig {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SolveConfigFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_solveconfig_free(ptr, 0);
    }
    /**
     * Enable conflict-directed backjumping.
     * @returns {boolean}
     */
    get backjumping() {
        const ret = wasm.solveconfig_backjumping(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Maximum number of solutions to enumerate.
     * @returns {number}
     */
    get maxSolutions() {
        const ret = wasm.solveconfig_maxSolutions(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Construct a `SolveConfig` with explicit field values.
     *
     * Defaults match `csp_solver::SolveConfig::default()`:
     * `FORWARD_CHECKING` pruning, `CHRONOLOGICAL` ordering, one
     * solution, no backjumping, feasibility mode, and a 1_000_000-
     * node budget.
     * @param {Pruning | null} [pruning]
     * @param {Ordering | null} [ordering]
     * @param {number | null} [max_solutions]
     * @param {boolean | null} [backjumping]
     * @param {OptimizationMode | null} [optimization_mode]
     * @param {bigint | null} [node_budget]
     */
    constructor(pruning, ordering, max_solutions, backjumping, optimization_mode, node_budget) {
        const ret = wasm.solveconfig_new(isLikeNone(pruning) ? 4 : pruning, isLikeNone(ordering) ? 3 : ordering, isLikeNone(max_solutions) ? 0x100000001 : (max_solutions) >>> 0, isLikeNone(backjumping) ? 0xFFFFFF : backjumping ? 1 : 0, isLikeNone(optimization_mode) ? 3 : optimization_mode, !isLikeNone(node_budget), isLikeNone(node_budget) ? BigInt(0) : node_budget);
        this.__wbg_ptr = ret >>> 0;
        SolveConfigFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Maximum number of search nodes before aborting early.
     * `undefined` disables the budget. Defaults to `1_000_000`.
     * @returns {bigint | undefined}
     */
    get nodeBudget() {
        const ret = wasm.solveconfig_nodeBudget(this.__wbg_ptr);
        return ret[0] === 0 ? undefined : BigInt.asUintN(64, ret[1]);
    }
    /**
     * Optimization mode (feasibility / minimize / maximize).
     * @returns {OptimizationMode}
     */
    get optimizationMode() {
        const ret = wasm.solveconfig_optimizationMode(this.__wbg_ptr);
        return ret;
    }
    /**
     * Variable-ordering heuristic.
     * @returns {Ordering}
     */
    get ordering() {
        const ret = wasm.solveconfig_ordering(this.__wbg_ptr);
        return ret;
    }
    /**
     * Pruning strategy used during search.
     * @returns {Pruning}
     */
    get pruning() {
        const ret = wasm.solveconfig_pruning(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {boolean} value
     */
    set backjumping(value) {
        wasm.solveconfig_set_backjumping(this.__wbg_ptr, value);
    }
    /**
     * @param {number} value
     */
    set maxSolutions(value) {
        wasm.solveconfig_set_maxSolutions(this.__wbg_ptr, value);
    }
    /**
     * @param {bigint | null} [value]
     */
    set nodeBudget(value) {
        wasm.solveconfig_set_nodeBudget(this.__wbg_ptr, !isLikeNone(value), isLikeNone(value) ? BigInt(0) : value);
    }
    /**
     * @param {OptimizationMode} value
     */
    set optimizationMode(value) {
        wasm.solveconfig_set_optimizationMode(this.__wbg_ptr, value);
    }
    /**
     * @param {Ordering} value
     */
    set ordering(value) {
        wasm.solveconfig_set_ordering(this.__wbg_ptr, value);
    }
    /**
     * @param {Pruning} value
     */
    set pruning(value) {
        wasm.solveconfig_set_pruning(this.__wbg_ptr, value);
    }
}
if (Symbol.dispose) SolveConfig.prototype[Symbol.dispose] = SolveConfig.prototype.free;

/**
 * Solver statistics from the most recent `solve()` call.
 *
 * Mirrors `csp_solver::SolveStats`. All fields are read-only —
 * the wasm-bindgen ABI exposes them as JavaScript getters.
 */
export class SolveStats {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SolveStats.prototype);
        obj.__wbg_ptr = ptr;
        SolveStatsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SolveStatsFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_solvestats_free(ptr, 0);
    }
    /**
     * Number of backtracking events.
     * @returns {bigint}
     */
    get backtracks() {
        const ret = wasm.solvestats_backtracks(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * `true` when the last search hit `SolveConfig.nodeBudget` and
     * returned best-so-far rather than optimal results.
     * @returns {boolean}
     */
    get budgetExceeded() {
        const ret = wasm.solvestats_budgetExceeded(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Number of search nodes visited.
     * @returns {bigint}
     */
    get nodesExplored() {
        const ret = wasm.solvestats_nodesExplored(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Number of constraint-propagation steps.
     * @returns {bigint}
     */
    get propagations() {
        const ret = wasm.solvestats_propagations(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
}
if (Symbol.dispose) SolveStats.prototype[Symbol.dispose] = SolveStats.prototype.free;

/**
 * Sudoku puzzle difficulty.
 *
 * Mirrors `py.rs::SudokuDifficulty`.
 * @enum {0 | 1 | 2}
 */
export const SudokuDifficulty = Object.freeze({
    EASY: 0, "0": "EASY",
    MEDIUM: 1, "1": "MEDIUM",
    HARD: 2, "2": "HARD",
});

/**
 * Generate a random Sudoku board for the given difficulty.
 *
 * Mirrors `py.rs::create_random_board`. The optional `templates`
 * argument is a `JsValue` array of position-keyed value maps; when
 * provided, the generator picks a template at random and digs holes
 * from it.
 * @param {number} n
 * @param {SudokuDifficulty | null | undefined} difficulty
 * @param {any} templates
 * @returns {any}
 */
export function createRandomBoard(n, difficulty, templates) {
    const ret = wasm.createRandomBoard(n, isLikeNone(difficulty) ? 3 : difficulty, templates);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Construct a Sudoku CSP wire object from a position-keyed value map.
 *
 * Mirrors `py.rs::create_sudoku_csp`. Positions are stringified
 * row-major indices into the `n^2 × n^2` grid.
 * @param {number} n
 * @param {any} values
 * @param {number | null} [max_solutions]
 * @returns {any}
 */
export function createSudokuCsp(n, values, max_solutions) {
    const ret = wasm.createSudokuCsp(n, values, isLikeNone(max_solutions) ? 0x100000001 : (max_solutions) >>> 0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Initialize the WASM module.
 *
 * Installs `console_error_panic_hook` so a Rust panic surfaces as a
 * readable JavaScript stack trace in the browser console instead of
 * the opaque `RuntimeError: unreachable executed`. Marked
 * `#[wasm_bindgen(start)]` so it runs automatically the first time
 * the module is instantiated.
 */
export function init() {
    wasm.init();
}

/**
 * Solve a Sudoku CSP previously built by `createSudokuCsp`.
 *
 * Mirrors `py.rs::solve_sudoku`. Returns the updated wire object
 * (with `solutions` and `backtrackCount` populated). Note that
 * because wasm-bindgen passes structs by value rather than by `&mut`
 * reference across the ABI, this returns a fresh wire object instead
 * of mutating in place.
 * @param {any} csp
 * @returns {any}
 */
export function solveSudoku(csp) {
    const ret = wasm.solveSudoku(csp);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg_Error_960c155d3d49e4c2: function(arg0, arg1) {
            const ret = Error(getStringFromWasm0(arg0, arg1));
            return ret;
        },
        __wbg_Number_32bf70a599af1d4b: function(arg0) {
            const ret = Number(arg0);
            return ret;
        },
        __wbg_String_8564e559799eccda: function(arg0, arg1) {
            const ret = String(arg1);
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_bigint_get_as_i64_3d3aba5d616c6a51: function(arg0, arg1) {
            const v = arg1;
            const ret = typeof(v) === 'bigint' ? v : undefined;
            getDataViewMemory0().setBigInt64(arg0 + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
        },
        __wbg___wbindgen_boolean_get_6ea149f0a8dcc5ff: function(arg0) {
            const v = arg0;
            const ret = typeof(v) === 'boolean' ? v : undefined;
            return isLikeNone(ret) ? 0xFFFFFF : ret ? 1 : 0;
        },
        __wbg___wbindgen_debug_string_ab4b34d23d6778bd: function(arg0, arg1) {
            const ret = debugString(arg1);
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_in_a5d8b22e52b24dd1: function(arg0, arg1) {
            const ret = arg0 in arg1;
            return ret;
        },
        __wbg___wbindgen_is_bigint_ec25c7f91b4d9e93: function(arg0) {
            const ret = typeof(arg0) === 'bigint';
            return ret;
        },
        __wbg___wbindgen_is_function_3baa9db1a987f47d: function(arg0) {
            const ret = typeof(arg0) === 'function';
            return ret;
        },
        __wbg___wbindgen_is_null_52ff4ec04186736f: function(arg0) {
            const ret = arg0 === null;
            return ret;
        },
        __wbg___wbindgen_is_object_63322ec0cd6ea4ef: function(arg0) {
            const val = arg0;
            const ret = typeof(val) === 'object' && val !== null;
            return ret;
        },
        __wbg___wbindgen_is_string_6df3bf7ef1164ed3: function(arg0) {
            const ret = typeof(arg0) === 'string';
            return ret;
        },
        __wbg___wbindgen_is_undefined_29a43b4d42920abd: function(arg0) {
            const ret = arg0 === undefined;
            return ret;
        },
        __wbg___wbindgen_jsval_eq_d3465d8a07697228: function(arg0, arg1) {
            const ret = arg0 === arg1;
            return ret;
        },
        __wbg___wbindgen_jsval_loose_eq_cac3565e89b4134c: function(arg0, arg1) {
            const ret = arg0 == arg1;
            return ret;
        },
        __wbg___wbindgen_number_get_c7f42aed0525c451: function(arg0, arg1) {
            const obj = arg1;
            const ret = typeof(obj) === 'number' ? obj : undefined;
            getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
        },
        __wbg___wbindgen_string_get_7ed5322991caaec5: function(arg0, arg1) {
            const obj = arg1;
            const ret = typeof(obj) === 'string' ? obj : undefined;
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_throw_6b64449b9b9ed33c: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg_call_14b169f759b26747: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.call(arg1);
            return ret;
        }, arguments); },
        __wbg_done_9158f7cc8751ba32: function(arg0) {
            const ret = arg0.done;
            return ret;
        },
        __wbg_entries_e0b73aa8571ddb56: function(arg0) {
            const ret = Object.entries(arg0);
            return ret;
        },
        __wbg_error_a6fa202b58aa1cd3: function(arg0, arg1) {
            let deferred0_0;
            let deferred0_1;
            try {
                deferred0_0 = arg0;
                deferred0_1 = arg1;
                console.error(getStringFromWasm0(arg0, arg1));
            } finally {
                wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
            }
        },
        __wbg_get_1affdbdd5573b16a: function() { return handleError(function (arg0, arg1) {
            const ret = Reflect.get(arg0, arg1);
            return ret;
        }, arguments); },
        __wbg_get_8360291721e2339f: function(arg0, arg1) {
            const ret = arg0[arg1 >>> 0];
            return ret;
        },
        __wbg_get_unchecked_17f53dad852b9588: function(arg0, arg1) {
            const ret = arg0[arg1 >>> 0];
            return ret;
        },
        __wbg_get_with_ref_key_6412cf3094599694: function(arg0, arg1) {
            const ret = arg0[arg1];
            return ret;
        },
        __wbg_instanceof_ArrayBuffer_7c8433c6ed14ffe3: function(arg0) {
            let result;
            try {
                result = arg0 instanceof ArrayBuffer;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_Uint8Array_152ba1f289edcf3f: function(arg0) {
            let result;
            try {
                result = arg0 instanceof Uint8Array;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_isArray_c3109d14ffc06469: function(arg0) {
            const ret = Array.isArray(arg0);
            return ret;
        },
        __wbg_isSafeInteger_4fc213d1989d6d2a: function(arg0) {
            const ret = Number.isSafeInteger(arg0);
            return ret;
        },
        __wbg_iterator_013bc09ec998c2a7: function() {
            const ret = Symbol.iterator;
            return ret;
        },
        __wbg_length_3d4ecd04bd8d22f1: function(arg0) {
            const ret = arg0.length;
            return ret;
        },
        __wbg_length_9f1775224cf1d815: function(arg0) {
            const ret = arg0.length;
            return ret;
        },
        __wbg_new_0c7403db6e782f19: function(arg0) {
            const ret = new Uint8Array(arg0);
            return ret;
        },
        __wbg_new_227d7c05414eb861: function() {
            const ret = new Error();
            return ret;
        },
        __wbg_new_34d45cc8e36aaead: function() {
            const ret = new Map();
            return ret;
        },
        __wbg_new_682678e2f47e32bc: function() {
            const ret = new Array();
            return ret;
        },
        __wbg_new_aa8d0fa9762c29bd: function() {
            const ret = new Object();
            return ret;
        },
        __wbg_next_0340c4ae324393c3: function() { return handleError(function (arg0) {
            const ret = arg0.next();
            return ret;
        }, arguments); },
        __wbg_next_7646edaa39458ef7: function(arg0) {
            const ret = arg0.next;
            return ret;
        },
        __wbg_prototypesetcall_a6b02eb00b0f4ce2: function(arg0, arg1, arg2) {
            Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), arg2);
        },
        __wbg_set_3bf1de9fab0cd644: function(arg0, arg1, arg2) {
            arg0[arg1 >>> 0] = arg2;
        },
        __wbg_set_6be42768c690e380: function(arg0, arg1, arg2) {
            arg0[arg1] = arg2;
        },
        __wbg_set_fde2cec06c23692b: function(arg0, arg1, arg2) {
            const ret = arg0.set(arg1, arg2);
            return ret;
        },
        __wbg_stack_3b0d974bbf31e44f: function(arg0, arg1) {
            const ret = arg1.stack;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_value_ee3a06f4579184fa: function(arg0) {
            const ret = arg0.value;
            return ret;
        },
        __wbindgen_cast_0000000000000001: function(arg0) {
            // Cast intrinsic for `F64 -> Externref`.
            const ret = arg0;
            return ret;
        },
        __wbindgen_cast_0000000000000002: function(arg0, arg1) {
            // Cast intrinsic for `Ref(String) -> Externref`.
            const ret = getStringFromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_cast_0000000000000003: function(arg0) {
            // Cast intrinsic for `U64 -> Externref`.
            const ret = BigInt.asUintN(64, arg0);
            return ret;
        },
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
        },
    };
    return {
        __proto__: null,
        "./csp_solver_wasm_bg.js": import0,
    };
}

const CspFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_csp_free(ptr >>> 0, 1));
const SolveConfigFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_solveconfig_free(ptr >>> 0, 1));
const SolveStatsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_solvestats_free(ptr >>> 0, 1));

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint32ArrayMemory0 = null;
function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
        cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function passArray32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getUint32ArrayMemory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_externrefs.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasm;
function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    wasmModule = module;
    cachedDataViewMemory0 = null;
    cachedUint32ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('csp_solver_wasm_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
