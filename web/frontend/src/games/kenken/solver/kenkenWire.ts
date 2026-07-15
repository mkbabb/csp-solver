/**
 * KenKen cage wire codec — the length-prefixed flat `Uint32Array` the wasm
 * `solveKenKen`/`propagateKenKen`/`generateKenKen` surface reads and writes.
 *
 * A cage is `[k, op, target, c0, c1, …, c(k-1)]`: the cell count, the operator ordinal
 * (`+ =0`, `− =1`, `× =2`, `÷ =3`), the target, then its `k` cell indices. The buffer
 * concatenates every cage. Factored out of `useSolver` so the round-trip is unit-testable
 * without instantiating the Worker; the ordinal mapping is the single source shared with the
 * Rust `CageOp::ordinal`.
 */
import type { KenKenCage, KenKenOp } from "../types";

/** Cage operator → wasm wire ordinal (mirrors Rust `CageOp::ordinal`). */
const OP_TO_ORDINAL: Record<KenKenOp, number> = { "+": 0, "-": 1, "×": 2, "÷": 3 };
/** Wire ordinal → cage operator (mirrors Rust `CageOp::from_ordinal`). */
const ORDINAL_TO_OP: readonly KenKenOp[] = ["+", "-", "×", "÷"];

/** Pack `KenKenCage[]` into the length-prefixed flat wire buffer. */
export function encodeCages(cages: KenKenCage[]): Uint32Array<ArrayBuffer> {
  let len = 0;
  for (const cage of cages) len += 3 + cage.cells.length;
  const buf = new Uint32Array(len);
  let i = 0;
  for (const cage of cages) {
    buf[i++] = cage.cells.length;
    buf[i++] = OP_TO_ORDINAL[cage.op];
    buf[i++] = cage.target;
    for (const cell of cage.cells) buf[i++] = cell;
  }
  return buf;
}

/** Unpack the length-prefixed flat wire buffer back into `KenKenCage[]`. */
export function decodeCages(flat: Uint32Array): KenKenCage[] {
  const cages: KenKenCage[] = [];
  let i = 0;
  while (i < flat.length) {
    const k = flat[i++];
    if (i + 1 >= flat.length) break; // truncated (no op/target) — drop the dangling count
    const op = ORDINAL_TO_OP[flat[i++]] ?? "+";
    const target = flat[i++];
    const cells: number[] = [];
    for (let j = 0; j < k && i < flat.length; j++) cells.push(flat[i++]);
    cages.push({ op, target, cells });
  }
  return cages;
}
