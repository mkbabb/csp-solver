/* tslint:disable */
/* eslint-disable */

/**
 * Align two SVG forms via the morph-core pipeline.
 *
 * Accepts a JS object matching `AlignRequest` (camelCase fields):
 *
 * ```js
 * alignForms({
 *   source: { id: "b", subpaths: [...], viewBox: [0,0,100,100] },
 *   target: { id: "d", subpaths: [...], viewBox: [0,0,100,100] },
 *   hints:  { subpathPairs: [{ source: 0, target: 1 }] },  // optional
 * })
 * ```
 *
 * Returns a JS object matching `WireAlignment`:
 *
 * ```js
 * { sourceFormId, targetFormId, pairs, unmatchedSource, unmatchedTarget }
 * ```
 */
export function alignForms(request: any): any;

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

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly init: () => void;
    readonly alignForms: (a: any) => [number, number, number];
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
