/**
 * Killer's clue seam, as data — the mapping from its own cage vocabulary to the figures the
 * shared `CageOverlay` draws, and the cage furniture's wire head.
 *
 * The overlay owns the GEOMETRY (the inset dotted boundary, the jittered vertices, the corner
 * placement); a game owns what its corner text SAYS. Killer's says the sum. Written once here
 * so the live board and the poster print the same thing, and so the spec's `clues.props` has
 * one place to read at F2.
 *
 * The codec pair moved here from `solver/killerWire.ts` at T5-W2 F3, verbatim, when the
 * per-game solver directory died. It is the shape the wasm
 * `solveKiller`/`propagateKiller`/`generateKiller` surface reads and writes, AND the shape the
 * permalink will carry when 2.4 lands one `persistence.ts` — one codec, both consumers, so the
 * wire and the permalink can never disagree about what a cage is.
 */
import type { CageFigure } from "@games/shared/CageOverlay.vue";
import type { ClueCodec } from "@games/shared/solver/client";
import { demandGroup } from "@games/shared/solver/wire";
import type { KillerCage } from "./types";

export function cageFigures(cages: KillerCage[]): CageFigure[] {
  return cages.map((c) => ({ cells: c.cells, label: String(c.sum) }));
}

/**
 * Pack `KillerCage[]` into the length-prefixed flat wire buffer: a cage is
 * `[k, sum, c0, c1, …, c(k-1)]` — the cell count, the target sum, then its `k` cell indices.
 * The buffer concatenates every cage.
 */
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

/** Unpack the length-prefixed flat wire buffer back into `KillerCage[]`. A cage that runs off
 *  the end of the buffer THROWS (2.2d) — the bare `break` that used to drop the dangling count
 *  handed the caller a cage it never sent. */
export function decodeCages(flat: Uint32Array): KillerCage[] {
  const cages: KillerCage[] = [];
  let i = 0;
  while (i < flat.length) {
    const k = flat[i++];
    demandGroup(flat, i, 1 + k, "killer cage");
    const sum = flat[i++];
    const cells: number[] = [];
    for (let j = 0; j < k; j++) cells.push(flat[i++]);
    cages.push({ sum, cells });
  }
  return cages;
}

/** The codec pair, named once: `spec.clues` spreads it, the solver client is handed it. */
export const killerClue: ClueCodec<KillerCage[]> = {
  encode: encodeCages,
  decode: decodeCages,
};
