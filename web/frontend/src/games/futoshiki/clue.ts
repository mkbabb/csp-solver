/**
 * Futoshiki's clue seam, as data — everything the printed inequality furniture IS, apart
 * from the glyph that draws one.
 *
 * The `[greater, lesser]` pairs are Futoshiki's whole divergence from a plain Latin square,
 * and until T5-W2 F2 they were spelled FOUR times over: the caret edge-midpoint math in
 * `FutoshikiBoard.caretDescriptors` and again, verbatim, in `FutoshikiPoster`; the
 * violation sweep and the per-cell a11y clauses in that same board adapter; the flat pairs
 * on the worker wire. One home now, four readers — the live overlay, the
 * poster, the board's adjacency, and the wire — so the still and the live board can never
 * print different carets, and the permalink and the worker can never disagree about what a
 * pair is.
 *
 * Everything here is PURE and takes its board size as an argument: nothing reads a ref, so
 * the same four functions serve a mounted board, a canned poster, and a unit test.
 */
import type { Adjacency } from "@games/shared/conflicts";
import type { ClueCodec } from "@games/shared/solver/client";
import type { Inequality } from "./types";

/**
 * One caret as the overlay draws it: which mark, turned which way, at what fraction of the
 * board box. A caret sits on the shared EDGE of an orthogonally-adjacent pair — never inside
 * a cell — so its placement is the edge midpoint, in percent, and the drawing component
 * centres itself on it.
 */
export interface CaretFigure {
  key: string;
  /** the horizontal mark: `>` (greater on the left) or `<` (greater on the right). */
  glyph: ">" | "<";
  /** 0 horizontal; +90 → ∨ (greater on top), −90 → ∧ (greater on the bottom). */
  rotation: number;
  leftPct: number;
  topPct: number;
  sizePct: number;
  /** stable per-caret hash → deterministic glyph-variant selection (neighbours differ). */
  hash: number;
}

/**
 * The caret figures for a board's printed furniture. A pair sharing a row takes the column
 * boundary between the two cells and picks the mark that opens toward the greater value; a
 * pair sharing a column takes the row boundary and rotates the one `>` mark, so the whole
 * four-way vocabulary reuses two drawn glyphs.
 */
export function caretFigures(inequalities: Inequality[], dim: number): CaretFigure[] {
  const cellPct = 100 / dim;
  const out: CaretFigure[] = [];
  for (const [gt, lt] of inequalities) {
    const rg = Math.floor(gt / dim);
    const cg = gt % dim;
    const rl = Math.floor(lt / dim);
    const cl = lt % dim;
    let glyph: ">" | "<" = ">";
    let rotation = 0;
    let leftPct: number;
    let topPct: number;
    if (rg === rl) {
      // Horizontal pair — the shared edge is the column boundary between them.
      leftPct = (Math.min(cg, cl) + 1) * cellPct;
      topPct = (rg + 0.5) * cellPct;
      glyph = cg < cl ? ">" : "<"; // greater on the left → `>`
    } else {
      // Vertical pair — the shared edge is the row boundary; rotate the `>` glyph.
      topPct = (Math.min(rg, rl) + 1) * cellPct;
      leftPct = (cg + 0.5) * cellPct;
      rotation = rg < rl ? 90 : -90; // greater on top → ∨ (+90); on the bottom → ∧ (−90)
    }
    out.push({
      key: `${gt}-${lt}`,
      glyph,
      rotation,
      leftPct,
      topPct,
      sizePct: cellPct * 0.5,
      hash: gt * 131 + lt * 7 + 1,
    });
  }
  return out;
}

/**
 * The clue clauses folded into each touched cell's accessible name (F6). The caret itself is
 * `aria-hidden` — a bare "greater-than" glyph tells AT nothing — so the constraint is read on
 * BOTH endpoints, in the direction that cell sees it. A cell touched by two carets gets both
 * clauses, joined.
 */
export function constraintLabels(
  inequalities: Inequality[],
  dim: number,
): Map<number, string> {
  const dir = (from: number, to: number): string => {
    const d = to - from;
    if (d === 1) return "to the right";
    if (d === -1) return "to the left";
    if (d === dim) return "below";
    if (d === -dim) return "above";
    return "";
  };
  const clauses = new Map<number, string[]>();
  const add = (pos: number, clause: string) => {
    const arr = clauses.get(pos);
    if (arr) arr.push(clause);
    else clauses.set(pos, [clause]);
  };
  for (const [gt, lt] of inequalities) {
    add(gt, `greater than the cell ${dir(gt, lt)}`);
    add(lt, `less than the cell ${dir(lt, gt)}`);
  }
  const out = new Map<number, string>();
  for (const [pos, arr] of clauses) out.set(pos, arr.join(" and "));
  return out;
}

/**
 * The board adjacency Futoshiki adds on top of the shared Latin-square core: a pair whose
 * two endpoints are BOTH filled and whose printed `>` doesn't hold is a violation, and both
 * endpoints get the teacher's red circle. An unfilled endpoint is not yet wrong.
 *
 * Shaped as `findConflicts`' own `extra` sink so the board binds it without adapting it.
 */
export function inequalityViolations(
  inequalities: Inequality[],
): NonNullable<Adjacency["extra"]> {
  return (values, add) => {
    for (const [gt, lt] of inequalities) {
      const a = values[String(gt)] ?? 0;
      const b = values[String(lt)] ?? 0;
      if (a !== 0 && b !== 0 && a <= b) {
        add(gt);
        add(lt);
      }
    }
  };
}

/**
 * The wire head — the pairs flattened to `[greater, lesser, greater, lesser, …]`, the shape
 * the worker (and, at 2.2, the one solver client) transfers. The `dim` the seam's decode
 * signature carries is not read: a pair is two absolute positions, self-describing at any
 * board size, and the size guard lives at the permalink boundary where an untrusted pair
 * actually arrives.
 */
export function encodeInequalities(
  inequalities: Inequality[],
): Uint32Array<ArrayBuffer> {
  const buf = new Uint32Array(inequalities.length * 2);
  inequalities.forEach(([a, b], i) => {
    buf[i * 2] = a;
    buf[i * 2 + 1] = b;
  });
  return buf;
}

export function decodeInequalities(flat: Uint32Array): Inequality[] {
  const out: Inequality[] = [];
  for (let i = 0; i + 1 < flat.length; i += 2) out.push([flat[i], flat[i + 1]]);
  return out;
}

/**
 * THE UNTRUSTED-PAIR GUARD — the doc-invariant `types.ts` promises, enforced where an
 * untrusted pair actually arrives (the `?board=` permalink hands this to
 * `createPersistence`'s `validateClue`; a dealt board's furniture comes from the solver and
 * satisfies it by construction).
 *
 * Each pair must be orthogonally ADJACENT — horizontal neighbours (|Δ| = 1, same row) or
 * vertical (|Δ| = n) — every endpoint in range, exact duplicates refused, and the whole set
 * bounded at the maximum adjacent-pair count 2·n·(n−1). Without it a crafted link renders one
 * floating `<FutoshikiCaret>` per pair (100k pairs → main-thread freeze), and a non-adjacent
 * pair draws a caret on an edge that doesn't exist.
 */
export function inequalitiesWellFormed(
  inequalities: Inequality[],
  dim: number,
): boolean {
  const totalCells = dim ** 2;
  if (inequalities.length > 2 * dim * (dim - 1)) return false;
  const seen = new Set<string>();
  for (const [a, b] of inequalities) {
    if (a < 0 || a >= totalCells || b < 0 || b >= totalCells) return false;
    const adjacent =
      (Math.abs(a - b) === 1 && Math.floor(a / dim) === Math.floor(b / dim)) ||
      Math.abs(a - b) === dim;
    if (!adjacent) return false;
    const pair = `${a}-${b}`;
    if (seen.has(pair)) return false;
    seen.add(pair);
  }
  return true;
}

/** The codec pair, named once: `spec.clues` spreads it, the solver client is handed it. */
export const futoshikiClue: ClueCodec<Inequality[]> = {
  encode: encodeInequalities,
  decode: decodeInequalities,
};
