import type { SerializedSolverError } from "./solverError";

/**
 * The game-agnostic frames of the solver Worker wire protocol — single-sourced for both
 * games (T4-W4 solver-seam dedup; these were byte-identical across the boundary). Each
 * game's own `solver/protocol.ts` composes its `SolverRequest`/`SolverResponse` union
 * FROM these shared frames, keeping only the genuinely game-specific members (board shape,
 * inequality furniture, node budget) explicit and parameterized there.
 *
 * Every request/response carries `id` (correlates a response to its request) and, on
 * success, a `kind` discriminant; a failure is `ok: false` plus the serialized error.
 */

/**
 * Cold-start prewarm (T3-W8 §cold-start): a no-op that forces the worker to run
 * `ensureInit()` — instantiate the wasm — ahead of the first real solve/generate. Carries
 * no payload; the worker inits and pongs back.
 */
export interface PingRequest {
  id: number;
  kind: "ping";
}

/** Prewarm pong — the wasm is instantiated and the worker is hot. */
export interface PingResponse {
  id: number;
  ok: true;
  kind: "ping";
}

/** The `ok: false` failure frame — the serialized typed error, correlated by `id`. */
export type SolverErrorResponse = { id: number; ok: false } & SerializedSolverError;
