import { describe, it, expect } from "vitest";
import { describeError } from "@games/shared/solver/describeError";
import {
  SolverError,
  isSerializedSolverError,
  type SolverErrorCode,
} from "@games/shared/solver/solverError";
import {
  classifyError,
  classifyCode,
  PAPER_NOTE_COPY,
} from "@games/shared/solver/classifyError";
import type { SolverRequest, SolverResponse } from "./protocol";

// FE-unit layer (T4-W2) — Futoshiki twin of games/sudoku/solver/protocol.test.ts. The error
// seam (`describeError`/`solverError`/`classifyError`) is single-sourced in
// `@games/shared/solver` (T4-W4); this file verifies it against the Futoshiki wire shapes
// (`boardSize`, ineq buffer). Bounded-respawn coverage lives at
// games/shared/solver/transport.test.ts.

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

describe("describeError (futoshiki) → structured-clone-safe frame", () => {
  it("passes the three solver-raisable codes through", () => {
    expect(describeError(coded("INVALID_INPUT", "clue conflict")).code).toBe(
      "INVALID_INPUT",
    );
    expect(describeError(coded("BUDGET_EXCEEDED", "x")).code).toBe("BUDGET_EXCEEDED");
    expect(describeError(coded("UNSAT", "x")).code).toBe("UNSAT");
  });

  it("collapses unknown code / non-Error / no-code throws to WORKER_FAILURE", () => {
    expect(describeError(coded("SEGFAULT", "boom"))).toEqual({
      code: "WORKER_FAILURE",
      message: "boom",
    });
    expect(describeError(new Error("plain"))).toEqual({
      code: "WORKER_FAILURE",
      message: "plain",
    });
    expect(describeError("detached")).toEqual({
      code: "WORKER_FAILURE",
      message: "detached",
    });
    expect(describeError(null)).toEqual({ code: "WORKER_FAILURE", message: "null" });
  });

  it("always returns one of the four SolverErrorCodes", () => {
    for (const thrown of [coded("UNSAT", "x"), new Error("y"), "z", {}, null]) {
      expect(ALL_CODES).toContain(describeError(thrown).code);
    }
  });
});

describe("isSerializedSolverError (futoshiki) — ok:false discriminator", () => {
  it("accepts error frames, rejects success frames + malformed shapes", () => {
    const err: SolverResponse = { id: 1, ok: false, code: "UNSAT", message: "no" };
    const ok: SolverResponse = { id: 1, ok: true, kind: "ping" };
    expect(isSerializedSolverError(err)).toBe(true);
    expect(isSerializedSolverError(ok)).toBe(false);
    expect(isSerializedSolverError({ code: "UNSAT" })).toBe(false);
    expect(isSerializedSolverError(null)).toBe(false);
  });
});

describe("worker framing (futoshiki wire) + fiction split", () => {
  it("discriminates the solve request (boardSize + separate ineq buffer)", () => {
    // `satisfies` proves assignability to the request union while keeping the narrow
    // 'solve'-member fields (`boardSize`, `inequalities`) accessible without a guard.
    const solve = {
      id: 2,
      kind: "solve" as const,
      board: new Uint32Array(25),
      boardSize: 5,
      inequalities: new Uint32Array([1, 0]),
    } satisfies SolverRequest;
    expect(solve.kind).toBe("solve");
    expect(solve.boardSize).toBe(5);
    expect(solve.inequalities.length).toBe(2);
  });

  it("reconstructs a SolverError from a describeError frame and classifies it", () => {
    const { code, message } = describeError(coded("BUDGET_EXCEEDED", "gave up"));
    const frame: SolverResponse = { id: 3, ok: false, code, message };
    expect(isSerializedSolverError(frame)).toBe(true);
    const fiction = classifyError(new SolverError(code, message));
    expect(fiction).toMatchObject({
      kind: "paper-note",
      variant: "budget",
      retryable: true,
    });
  });

  it("maps codes to fictions: WORKER_FAILURE→network, graded→teacher-red, unknown→unknown", () => {
    expect(classifyCode("WORKER_FAILURE")).toEqual({
      kind: "paper-note",
      variant: "network",
      message: PAPER_NOTE_COPY.network,
      retryable: true,
    });
    expect(classifyCode("UNSAT")).toEqual({ kind: "teacher-red" });
    expect(classifyCode("INVALID_INPUT")).toEqual({ kind: "teacher-red" });
    expect(classifyCode("???")).toMatchObject({
      kind: "paper-note",
      variant: "unknown",
    });
    expect(classifyError(new TypeError("x"))).toMatchObject({ variant: "network" });
  });
});
