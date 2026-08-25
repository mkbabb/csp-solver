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
import type { ConflictSink } from "@games/shared/conflicts";
import type { ClueCodec } from "@games/shared/solver/client";
import { demandGroup } from "@games/shared/solver/wire";
import type { KillerCage } from "./types";

export function cageFigures(cages: KillerCage[]): CageFigure[] {
  return cages.map((c) => ({ cells: c.cells, label: String(c.sum) }));
}

/**
 * ── T9-W1 §1.2 — THE CAGE JOINS THE BOARD'S LAW ────────────────────────────────────────────
 *
 * Killer's cage arithmetic was absent from the conflict derivation entirely: the boxed geometry
 * bought the row/column/box sweep and nothing else, so a board whose ONLY fault was a cage
 * total got graded 'failed' and sent the reader to a row with nothing wrong in it. This is
 * futoshiki's `inequalityViolations` shape exactly — a factory over the printed furniture,
 * returning `findConflicts`' own `extra` sink — so the board binds it without adapting it.
 *
 * A cage carries TWO relations and the sweep reports the tighter one it can prove:
 *   · all-different, provable the moment two of its filled cells agree. Only the REPEAT is
 *     circled then, and the cage's arithmetic is not second-guessed: the repeat is the whole
 *     fault, and circling cells that may yet be right would be the red pencil lying.
 *   · the printed total, provable when the cage is full (the sum missed it) or when the filled
 *     cells have already OVERSHOT it — every empty cell holds at least 1, so a cage whose
 *     filled sum plus one-per-empty exceeds the label cannot reach it whatever goes in.
 * Anything short of a proof stays silent: a half-written cage inside its total is not wrong,
 * it is unfinished.
 */
export function cageViolations(cages: KillerCage[]): ConflictSink {
  return (values, add) => {
    for (const cage of cages) {
      const held = new Map<number, number[]>();
      let filled = 0;
      let sum = 0;
      for (const pos of cage.cells) {
        const val = values[String(pos)] ?? 0;
        if (val === 0) continue;
        filled++;
        sum += val;
        const bucket = held.get(val);
        if (bucket) bucket.push(pos);
        else held.set(val, [pos]);
      }
      let repeated = false;
      for (const bucket of held.values()) {
        if (bucket.length > 1) {
          for (const pos of bucket) add(pos);
          repeated = true;
        }
      }
      if (repeated) continue;
      const empty = cage.cells.length - filled;
      const wrong = empty === 0 ? sum !== cage.sum : sum + empty > cage.sum;
      if (wrong) for (const pos of cage.cells) add(pos);
    }
  };
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
