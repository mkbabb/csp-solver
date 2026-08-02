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
import type { ClueCodec } from "@games/shared/solver/client";
import { demandGroup } from "@games/shared/solver/wire";
import type { ThermoLine } from "./types";

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
