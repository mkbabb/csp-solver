/**
 * Killer cage wire codec — the length-prefixed flat `Uint32Array` the wasm
 * `solveKiller`/`propagateKiller`/`generateKiller` surface reads and writes.
 *
 * A cage is `[k, sum, c0, c1, …, c(k-1)]`: the cell count, the target sum, then its `k`
 * cell indices. The buffer concatenates every cage. Factored out of `useSolver` so the
 * round-trip is unit-testable without instantiating the Worker.
 */
import type { KillerCage } from "../types";

/** Pack `KillerCage[]` into the length-prefixed flat wire buffer. */
export function encodeCages(cages: KillerCage[]): Uint32Array<ArrayBuffer> {
  let len = 0;
  for (const cage of cages) len += 2 + cage.cells.length;
  const buf = new Uint32Array(len);
  let i = 0;
  for (const cage of cages) {
    buf[i++] = cage.cells.length;
    buf[i++] = cage.sum;
    for (const cell of cage.cells) buf[i++] = cell;
  }
  return buf;
}

/** Unpack the length-prefixed flat wire buffer back into `KillerCage[]`. */
export function decodeCages(flat: Uint32Array): KillerCage[] {
  const cages: KillerCage[] = [];
  let i = 0;
  while (i < flat.length) {
    const k = flat[i++];
    if (i >= flat.length) break; // truncated (no sum) — drop the dangling count
    const sum = flat[i++];
    const cells: number[] = [];
    for (let j = 0; j < k && i < flat.length; j++) cells.push(flat[i++]);
    cages.push({ sum, cells });
  }
  return cages;
}
