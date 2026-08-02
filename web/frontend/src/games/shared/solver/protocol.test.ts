import { describe, it, expect } from "vitest";
import { describeError } from "./describeError";
import {
  SolverError,
  isSerializedSolverError,
  type SolverErrorCode,
} from "./solverError";
import { classifyError, classifyCode, PAPER_NOTE_COPY } from "./classifyError";
import type { GameId, SolverRequest, SolverResponse } from "./protocol";

// FE-unit layer (T4-W2): the solver Worker PROTOCOL + error framing, unit-covered without
// spinning the wasm Worker. Playwright exercised the happy path only and could not enumerate
// the error frames; these do. Bounded-respawn coverage lives at
// games/shared/solver/transport.test.ts; the per-game marshalling lives at client.test.ts.
//
// ONE FILE, T5-W2 F3. This was `games/sudoku/solver/protocol.test.ts` and
// `games/futoshiki/solver/protocol.test.ts` — the same error-seam assertions written twice,
// diverging only in which per-game wire naming they annotated their frames with (`n` vs
// `boardSize`). With one protocol the second file has nothing left to say that this one
// doesn't, and its one genuinely distinct assertion — a CLUED solve request, which sudoku's
// wire could not express — is folded into the framing block below, now covering all five
// families off one union.

/** A wasm-style thrown error: a real Error with a `.code` string reflected onto it, the
 * shape `csp-solver/wasm/src/sudoku.rs::coded_error` produces across the wasm boundary. */
function coded(code: string, message: string): Error & { code: string } {
  const e = new Error(message) as Error & { code: string };
  e.code = code;
  return e;
}

const ALL_CODES: readonly SolverErrorCode[] = [
  "INVALID_INPUT",
  "BUDGET_EXCEEDED",
  "UNSAT",
  "WORKER_FAILURE",
];

describe("describeError → structured-clone-safe failure frame", () => {
  it("passes the three solver-raisable codes through with their message", () => {
    expect(describeError(coded("INVALID_INPUT", "given cells conflict"))).toEqual({
      code: "INVALID_INPUT",
      message: "given cells conflict",
    });
    expect(describeError(coded("BUDGET_EXCEEDED", "gave up at node budget"))).toEqual({
      code: "BUDGET_EXCEEDED",
      message: "gave up at node budget",
    });
    expect(describeError(coded("UNSAT", "no completion"))).toEqual({
      code: "UNSAT",
      message: "no completion",
    });
  });

  it("collapses an UNKNOWN code string to WORKER_FAILURE (message preserved)", () => {
    // A code the solver can never raise is machinery breakage, not graded work.
    expect(describeError(coded("SEGFAULT", "boom"))).toEqual({
      code: "WORKER_FAILURE",
      message: "boom",
    });
    // Even the literal 'WORKER_FAILURE' is not on the passthrough allowlist — it falls
    // through the same branch and is (re-)stamped WORKER_FAILURE.
    expect(describeError(coded("WORKER_FAILURE", "already dead")).code).toBe(
      "WORKER_FAILURE",
    );
  });

  it("collapses a NON-STRING .code to WORKER_FAILURE", () => {
    const e = new Error("weird") as unknown as Error & { code: number };
    e.code = 500;
    expect(describeError(e)).toEqual({ code: "WORKER_FAILURE", message: "weird" });
  });

  it("maps a plain Error with no .code to WORKER_FAILURE with its message", () => {
    expect(describeError(new Error("unhandled rejection"))).toEqual({
      code: "WORKER_FAILURE",
      message: "unhandled rejection",
    });
  });

  it("stringifies a NON-Error throw (string / bare object / null) under WORKER_FAILURE", () => {
    expect(describeError("detached")).toEqual({
      code: "WORKER_FAILURE",
      message: "detached",
    });
    expect(describeError({ foo: 1 })).toEqual({
      code: "WORKER_FAILURE",
      message: "[object Object]",
    });
    expect(describeError(null)).toEqual({ code: "WORKER_FAILURE", message: "null" });
    expect(describeError(undefined)).toEqual({
      code: "WORKER_FAILURE",
      message: "undefined",
    });
  });

  it("always returns one of the four SolverErrorCodes", () => {
    for (const thrown of [coded("UNSAT", "x"), new Error("y"), "z", 42, {}, null]) {
      expect(ALL_CODES).toContain(describeError(thrown).code);
    }
  });
});

describe("isSerializedSolverError — the ok:false frame discriminator", () => {
  it("accepts a bare {code, message} and a full error response frame", () => {
    expect(isSerializedSolverError({ code: "WORKER_FAILURE", message: "x" })).toBe(
      true,
    );
    const frame: SolverResponse = { id: 1, ok: false, code: "UNSAT", message: "no" };
    expect(isSerializedSolverError(frame)).toBe(true);
  });

  it("rejects a SUCCESS response frame (no code/message on the wire)", () => {
    const ok: SolverResponse = { id: 1, ok: true, kind: "ping" };
    expect(isSerializedSolverError(ok)).toBe(false);
  });

  it("rejects non-objects and partial/mistyped shapes", () => {
    expect(isSerializedSolverError(null)).toBe(false);
    expect(isSerializedSolverError(undefined)).toBe(false);
    expect(isSerializedSolverError("WORKER_FAILURE")).toBe(false);
    expect(isSerializedSolverError(7)).toBe(false);
    expect(isSerializedSolverError({ code: "UNSAT" })).toBe(false); // no message
    expect(isSerializedSolverError({ message: "x" })).toBe(false); // no code
    expect(isSerializedSolverError({ code: 1, message: "x" })).toBe(false); // code not string
    expect(isSerializedSolverError({ code: "UNSAT", message: 2 })).toBe(false); // message not string
  });
});

describe("worker request/response framing", () => {
  it("discriminates requests by `kind`", () => {
    const solve: SolverRequest = {
      id: 3,
      game: "sudoku",
      kind: "solve",
      board: new Uint32Array(16),
      dim: 2,
      clue: new Uint32Array(0),
    };
    const ping: SolverRequest = { id: 4, kind: "ping" };
    expect(solve.kind).toBe("solve");
    expect(ping.kind).toBe("ping");
    expect(solve.id).not.toBe(ping.id);
  });

  it("carries every family's solve on ONE frame — clued and unclued alike", () => {
    // The futoshiki twin's one distinct assertion, generalized: a clued solve request used to
    // need its own union member per game (`inequalities` / `thermometers` / `cages` / `cages`),
    // and sudoku's wire could not express one at all. `satisfies` proves assignability while
    // keeping the narrow 'solve'-member fields readable without a guard.
    const families: readonly { game: GameId; dim: number; clue: number[] }[] = [
      { game: "sudoku", dim: 2, clue: [] }, // clues: null — the empty buffer IS the absence
      { game: "futoshiki", dim: 5, clue: [1, 0] }, // a [greater, lesser] pair
      { game: "thermo", dim: 2, clue: [3, 0, 1, 2] }, // a length-prefixed tube
      { game: "killer", dim: 2, clue: [2, 9, 0, 1] }, // a cage: count, sum, cells
      { game: "kenken", dim: 4, clue: [2, 0, 5, 0, 1] }, // a cage: count, op, target, cells
    ];
    for (const { game, dim, clue } of families) {
      const solve = {
        id: 2,
        game,
        kind: "solve" as const,
        board: new Uint32Array(16),
        dim,
        clue: new Uint32Array(clue),
      } satisfies SolverRequest;
      expect(solve.game).toBe(game);
      expect(solve.dim).toBe(dim);
      expect(Array.from(solve.clue)).toEqual(clue);
    }
  });

  it("a ping names no family — one worker, one binary, one warm", () => {
    const ping: SolverRequest = { id: 7, kind: "ping" };
    expect("game" in ping).toBe(false);
  });

  it("an error frame is ok:false + serialized; a success frame is ok:true and not", () => {
    const err: SolverResponse = {
      id: 5,
      ok: false,
      code: "BUDGET_EXCEEDED",
      message: "budget",
    };
    const ok: SolverResponse = { id: 5, ok: true, kind: "ping" };
    expect(err.ok).toBe(false);
    expect(isSerializedSolverError(err)).toBe(true);
    expect(ok.ok).toBe(true);
    expect(isSerializedSolverError(ok)).toBe(false);
  });

  it("a describeError result slots straight into an error frame and reconstructs a SolverError", () => {
    // The full error path: a raw wasm throw → the worker frames it → the main thread
    // reconstructs the typed SolverError from the frame (useSolver.ts::throwIfError).
    const { code, message } = describeError(coded("BUDGET_EXCEEDED", "gave up"));
    // The `: SolverResponse` annotation is itself the framing assertion — the frame is a
    // valid error response by construction. Reconstruct from the in-scope pair (the union
    // type intentionally doesn't expose `.code` without narrowing).
    const frame: SolverResponse = { id: 9, ok: false, code, message };
    expect(isSerializedSolverError(frame)).toBe(true);
    const reconstructed = new SolverError(code, message);
    expect(reconstructed).toBeInstanceOf(Error);
    expect(reconstructed.code).toBe("BUDGET_EXCEEDED");
    expect(reconstructed.message).toBe("gave up");
  });
});

describe("classifyError / classifyCode — the fiction split (error-path frames)", () => {
  it("maps WORKER_FAILURE (the describeError sink) to the network paper-note", () => {
    expect(classifyCode("WORKER_FAILURE")).toEqual({
      kind: "paper-note",
      variant: "network",
      message: PAPER_NOTE_COPY.network,
      retryable: true,
    });
  });

  it("maps BUDGET_EXCEEDED to the budget paper-note and the graded codes to teacher-red", () => {
    expect(classifyCode("BUDGET_EXCEEDED")).toMatchObject({
      kind: "paper-note",
      variant: "budget",
    });
    expect(classifyCode("UNSAT")).toEqual({ kind: "teacher-red" });
    expect(classifyCode("INVALID_INPUT")).toEqual({ kind: "teacher-red" });
  });

  it("maps an absent / unrecognized code to the unknown paper-note", () => {
    expect(classifyCode(undefined)).toMatchObject({
      kind: "paper-note",
      variant: "unknown",
    });
    expect(classifyCode("SOMETHING_NEW")).toMatchObject({
      kind: "paper-note",
      variant: "unknown",
    });
  });

  it("classifies thrown values end-to-end (SolverError sets retryable off BUDGET only)", () => {
    expect(classifyError(new SolverError("BUDGET_EXCEEDED", "x"))).toEqual({
      kind: "paper-note",
      variant: "budget",
      message: PAPER_NOTE_COPY.budget,
      retryable: true,
    });
    expect(classifyError(new SolverError("WORKER_FAILURE", "x"))).toMatchObject({
      variant: "network",
      retryable: false,
    });
    expect(classifyError(new SolverError("UNSAT", "x"))).toEqual({
      kind: "teacher-red",
    });
    expect(classifyError(new TypeError("boom"))).toMatchObject({
      variant: "network",
      retryable: true,
    });
    expect(classifyError("detached string")).toMatchObject({
      variant: "unknown",
      retryable: true,
    });
  });

  it("threads the whole path: raw wasm throw → frame → SolverError → fiction", () => {
    const { code, message } = describeError(coded("UNSAT", "no completion"));
    const fiction = classifyError(new SolverError(code, message));
    expect(fiction).toEqual({ kind: "teacher-red" });
  });
});
