/**
 * Thermometer wire codec — the length-prefixed flat `Uint32Array` the wasm
 * `solveThermo`/`propagateThermo`/`generateThermo` surface reads and writes.
 *
 * A tube is `[k, c0, c1, …, c(k-1)]`: the cell count followed by its `k` cell indices
 * (bulb → tip). The buffer concatenates every tube. Factored out of `useSolver` so the
 * round-trip is unit-testable without instantiating the Worker.
 */
import type { ThermoLine } from "../types";

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

/** Unpack the length-prefixed flat wire buffer back into `ThermoLine[]`. */
export function decodeThermometers(flat: Uint32Array): ThermoLine[] {
  const thermos: ThermoLine[] = [];
  let i = 0;
  while (i < flat.length) {
    const k = flat[i++];
    const line: number[] = [];
    for (let j = 0; j < k && i < flat.length; j++) line.push(flat[i++]);
    thermos.push(line);
  }
  return thermos;
}
