FE='/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend/'
def edit(f, old, new, count=1):
    p=FE+f; s=open(p).read()
    assert s.count(old)==count, (f, old[:60], s.count(old))
    s=s.replace(old,new); open(p,'w').write(s)

# 1 · pencilConfig: RING_GEOMETRY (MRK-ABS's, figures restated at the DOM's 0.636 px/u) + RING_ARM
edit('src/pencil/config/pencilConfig.ts', '''/** Frozen defaults for reset.''', '''// THE RING'S GEOMETRY (T9-W7 §5, grafted from MRK-ABS pass 5, G-ABS-7/8). The ghost ring's wander
// is an ABSOLUTE in ghost units, one number for every board, because a hand's tremor is a length,
// not a fraction of the cell: at roughness 0.4 the old ring wandered ~0.375 u at 16×16 and ~2 u
// at 4×4.
//
// MA-N, what the inset is load-bearing for: the ring's painted outer ink (its vertices through
// the path's own screen CTM plus half the heaviest stroke the sheet draws) stays inside its own
// cell's DOM box, 16×16, every cell, both engines. In the reader's px at 1280×800 (the 16×16 cell
// is 39.75 px per 62.5 u, 0.636 px/u — never the ghost svg's own 0.489):
//     stroke 10 (invalid AND selected)   f = 1.00 → ENTERS the neighbour by 0.501 px (−0.788 u)
//                                        f = 0.86 → clears by 1.639 px (2.577 u)
//     stroke 7 (tier 2)                  f = 1.00 → +0.232 px (0.366 u) · f = 0.86 → +2.373 px
// `focus-ring.spec.ts` G-LIVE-22 prints and holds these from the DOM (the recipe proven identical
// to every resident `d` first, 256/256). 0.90 is the banked alternate (+1.027 px at stroke 10).
// WHAT IT COSTS, stated: drawn inside its square, the ring's side crosses the board's frame rule
// on the edge cells, and the painted whole-ring fraction under 3:1 on cell 0 moves with it — the
// ring ballot carries the number.
export const RING_GEOMETRY = Object.freeze({
  /** the ring's wander in ghost units — `maxDisplace`, one number for every board */
  wanderUnits: 5.4,
  /** the ring is drawn at this fraction of the cell, centred: a mark INSIDE the square */
  inset: 0.86,
});

/** Frozen defaults for reset.''')

# 2 · gridPaths: generateCellRects and generateCellFrames on ONE recipe
edit('src/pencil/grid/gridPaths.ts', '''import type { GrainConfig } from "../config/pencilConfig";''', '''import { RING_GEOMETRY, type GrainConfig } from "../config/pencilConfig";''')
edit('src/pencil/grid/gridPaths.ts', '''      const cellSize = viewBoxSize / boardSize;
      const cellSegments = boardSize >= 16 ? 2 : 4;
      const cellRects: Record<number, string> = {};
      for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
          const pos = r * boardSize + c;
          const x = c * cellSize;
          const y = r * cellSize;
          cellRects[pos] = wobbleRect(x, y, cellSize, cellSize, {
            roughness: 0.4,
            segments: cellSegments,
            seed: seed + 500 + pos * 7,
            jagged: true,
          });
        }
      }
      return cellRects;''', '''      const cellRects: Record<number, string> = {};
      for (let pos = 0; pos < boardSize * boardSize; pos++) {
        const { x, y, size, opts } = ringRecipe(boardSize, viewBoxSize, seed, pos);
        cellRects[pos] = wobbleRect(x, y, size, size, opts);
      }
      return cellRects;''')
edit('src/pencil/grid/gridPaths.ts', '''/**
 * THE LIVING MARK (T9-W7 §5) — the four poses of ONE cell's ghost ring.''', '''/**
 * ONE RING RECIPE for the resting ring and the living mark's skeleton (RING_GEOMETRY, MRK-ABS's
 * graft): drawn INSIDE its square at `inset`, centred, with an absolute wander in ghost units.
 * Inverting `maxDisplace = roughness × len × 0.015` over the INSET edge makes the wander size-free
 * exactly. Segments are PINNED at 4, not derived from the board: the shape constant belongs to the
 * primitive at this count, and 16×16 dropping to 2 split one wander into two (its resident `d`
 * strings go 58,761 B → 119,894 B, paid once per deal into the LRU).
 */
function ringRecipe(boardSize: number, viewBoxSize: number, seed: number, pos: number) {
  const cellSize = viewBoxSize / boardSize;
  const { wanderUnits, inset } = RING_GEOMETRY;
  const size = inset * cellSize;
  const pad = ((1 - inset) / 2) * cellSize;
  return {
    x: (pos % boardSize) * cellSize + pad,
    y: Math.floor(pos / boardSize) * cellSize + pad,
    size,
    opts: {
      roughness: wanderUnits / (0.015 * size),
      segments: 4,
      seed: seed + 500 + pos * 7,
      jagged: true,
    },
  };
}

/**
 * THE LIVING MARK (T9-W7 §5) — the four poses of ONE cell's ghost ring.''')
edit('src/pencil/grid/gridPaths.ts', '''  const cellSize = viewBoxSize / boardSize;
  const frames = generateRectBoilFrames(
    (pos % boardSize) * cellSize,
    Math.floor(pos / boardSize) * cellSize,
    cellSize,
    cellSize,
    {
      roughness: 0.4,
      segments: boardSize >= 16 ? 2 : 4,
      seed: seed + 500 + pos * 7,
      jagged: true,
    },
    boilAmount,
    frameCount,
  );''', '''  const { x, y, size, opts } = ringRecipe(boardSize, viewBoxSize, seed, pos);
  const frames = generateRectBoilFrames(x, y, size, size, opts, boilAmount, frameCount);''')
# 3 · the unit: pose 0 identity at 16×16 too
edit('src/pencil/grid/gridPaths.test.ts', '''    const rects = generateCellRects(9, 3, 1000, 42);
    expect(generateCellFrames(9, 3, 1000, 42, 40, 0.3, 4)[0]).toBe(rects[40]);
  });''', '''    const rects = generateCellRects(9, 3, 1000, 42);
    expect(generateCellFrames(9, 3, 1000, 42, 40, 0.3, 4)[0]).toBe(rects[40]);
    // …and at 16×16, where the ring recipe's pinned segments and inset are the whole difference
    const r16 = generateCellRects(16, 4, 1000, 42);
    expect(generateCellFrames(16, 4, 1000, 42, 0, 0.3, 4)[0]).toBe(r16[0]);
    expect(generateCellFrames(16, 4, 1000, 42, 255, 0.3, 4)[0]).toBe(r16[255]);
  });''')
print('graft applied')
