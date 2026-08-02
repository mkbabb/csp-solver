/**
 * KenKen's clue seam, as data — the mapping from its own cage vocabulary to the figures the
 * shared `CageOverlay` draws, and the cage furniture's wire head.
 *
 * The overlay owns the GEOMETRY (the inset dotted boundary, the jittered vertices, the corner
 * placement); a game owns what its corner text SAYS. KenKen's says the target with its
 * operator glyph — bare for a singleton "given" cage. Written once here so the live board and
 * the poster print the same thing, and so the spec's `clues.props` has one place to read at F2.
 *
 * The codec pair moved here from `solver/kenkenWire.ts` at T5-W2 F3, verbatim, when the
 * per-game solver directory died. It is the shape the wasm
 * `solveKenKen`/`propagateKenKen`/`generateKenKen` surface reads and writes, AND the shape the
 * permalink will carry when 2.4 lands one `persistence.ts` — one codec, both consumers, so the
 * wire and the permalink can never disagree about what a cage is. The operator ordinals are the
 * single source shared with the Rust `CageOp::ordinal`.
 */
import type { CageFigure } from "@games/shared/CageOverlay.vue";
import type { ClueCodec } from "@games/shared/solver/client";
import { demandGroup } from "@games/shared/solver/wire";
import type { KenKenCage, KenKenOp } from "./types";

export function cageFigures(cages: KenKenCage[]): CageFigure[] {
  return cages.map((c) => ({
    cells: c.cells,
    label: c.cells.length === 1 ? String(c.target) : `${c.target}${c.op}`,
  }));
}

/** Cage operator → wasm wire ordinal (mirrors Rust `CageOp::ordinal`). */
const OP_TO_ORDINAL: Record<KenKenOp, number> = { "+": 0, "-": 1, "×": 2, "÷": 3 };
/** Wire ordinal → cage operator (mirrors Rust `CageOp::from_ordinal`). */
const ORDINAL_TO_OP: readonly KenKenOp[] = ["+", "-", "×", "÷"];

/**
 * Pack `KenKenCage[]` into the length-prefixed flat wire buffer: a cage is
 * `[k, op, target, c0, c1, …, c(k-1)]` — the cell count, the operator ordinal (`+ =0`, `− =1`,
 * `× =2`, `÷ =3`), the target, then its `k` cell indices. The buffer concatenates every cage.
 */
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

/** Unpack the length-prefixed flat wire buffer back into `KenKenCage[]`. A cage that runs off
 *  the end of the buffer THROWS (2.2d), and so does an operator ordinal outside the four — the
 *  `?? "+"` fallback silently rewrote a `÷` cage into a `+` one, which is a different puzzle. */
export function decodeCages(flat: Uint32Array): KenKenCage[] {
  const cages: KenKenCage[] = [];
  let i = 0;
  while (i < flat.length) {
    const k = flat[i++];
    demandGroup(flat, i, 2 + k, "kenken cage");
    const ordinal = flat[i++];
    const op = ORDINAL_TO_OP[ordinal];
    if (op === undefined) {
      throw new RangeError(`kenken cage: unknown operator ordinal ${ordinal}`);
    }
    const target = flat[i++];
    const cells: number[] = [];
    for (let j = 0; j < k; j++) cells.push(flat[i++]);
    cages.push({ op, target, cells });
  }
  return cages;
}

/** The codec pair, named once: `spec.clues` spreads it, the solver client is handed it. */
export const kenkenClue: ClueCodec<KenKenCage[]> = {
  encode: encodeCages,
  decode: decodeCages,
};
