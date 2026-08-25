/**
 * Thermo's clue seam, as data — the thermometer furniture's wire head.
 *
 * A tube is `[k, c0, c1, …, c(k-1)]`: the cell count followed by its `k` cell indices (bulb →
 * tip). The buffer concatenates every tube. This is the shape the wasm
 * `solveThermo`/`propagateThermo`/`generateThermo` surface reads and writes, AND the shape the
 * permalink will carry when 2.4 lands one `persistence.ts` — which is why the pair lives on the
 * clue seam rather than beside a worker: one codec, both consumers, so the wire and the
 * permalink can never disagree about what a tube is.
 *
 * Moved here from `solver/thermoWire.ts` at T5-W2 F3, verbatim, when the per-game solver
 * directory died (the futoshiki lane's F2 precedent). Everything is PURE and unit-testable
 * without instantiating the Worker.
 */
import type { ConflictSink } from "@games/shared/conflicts";
import type { ClueCodec } from "@games/shared/solver/client";
import { demandGroup } from "@games/shared/solver/wire";
import type { ThermoLine } from "./types";

/**
 * ── T9-W1 §1.2 — THE THERMOMETER JOINS THE BOARD'S LAW ─────────────────────────────────────
 *
 * Thermo's chain ordering was absent from the conflict derivation entirely: the boxed geometry
 * bought the row/column/box sweep and nothing else, so a board whose ONLY fault ran DOWN a tube
 * got graded 'failed' and sent the reader to a row with nothing wrong in it. Same shape as
 * futoshiki's `inequalityViolations` — a factory over the printed furniture, returning
 * `findConflicts`' own `extra` sink.
 *
 * The rule is the tube's own and it is a rule about the WHOLE PATH, not each step: values
 * strictly increase bulb to tip, so any two filled cells in path order that fail to increase
 * are wrong with or without gaps between them. Every failing pair is circled, not merely the
 * first — a reader shown one end of a fall cannot see which end to change. Positions are
 * gathered before they are handed on, so a cell caught in two falls is reported once.
 */
export function chainViolations(thermos: ThermoLine[]): ConflictSink {
  return (values, add) => {
    const wrong = new Set<number>();
    for (const path of thermos) {
      for (let i = 0; i < path.length; i++) {
        const lower = values[String(path[i])] ?? 0;
        if (lower === 0) continue;
        for (let j = i + 1; j < path.length; j++) {
          const upper = values[String(path[j])] ?? 0;
          if (upper === 0) continue;
          if (lower >= upper) {
            wrong.add(path[i]);
            wrong.add(path[j]);
          }
        }
      }
    }
    for (const pos of wrong) add(pos);
  };
}

/** Pack `ThermoLine[]` into the length-prefixed flat wire buffer. */
export function encodeThermometers(thermos: ThermoLine[]): Uint32Array<ArrayBuffer> {
  let len = 0;
  for (const t of thermos) len += 1 + t.length;
  const buf = new Uint32Array(len);
  let i = 0;
  for (const t of thermos) {
    buf[i++] = t.length;
    for (const cell of t) buf[i++] = cell;
  }
  return buf;
}

/** Unpack the length-prefixed flat wire buffer back into `ThermoLine[]`. A tube that runs off
 *  the end of the buffer THROWS (2.2d) — a truncated frame is malformed, never a short tube. */
export function decodeThermometers(flat: Uint32Array): ThermoLine[] {
  const thermos: ThermoLine[] = [];
  let i = 0;
  while (i < flat.length) {
    const k = flat[i++];
    demandGroup(flat, i, k, "thermo tube");
    const line: number[] = [];
    for (let j = 0; j < k; j++) line.push(flat[i++]);
    thermos.push(line);
  }
  return thermos;
}

/** The codec pair, named once: `spec.clues` spreads it, the solver client is handed it. */
export const thermoClue: ClueCodec<ThermoLine[]> = {
  encode: encodeThermometers,
  decode: decodeThermometers,
};
